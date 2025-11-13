import { useState, useEffect, useCallback } from 'react';
import { Category, Article, Subcategory } from '../types';
import { blogData as initialData } from '../data/articles';

const LOCAL_STORAGE_KEY = 'discoverWellnessBlogData';

const initializeAndMigrateData = (): Category[] => {
  const initialDataCopy = JSON.parse(JSON.stringify(initialData)) as Category[];
  
  try {
    const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedDataString) {
      // First time load or after a reset: use initial data.
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialDataCopy));
      return initialDataCopy;
    }

    const storedData = JSON.parse(storedDataString) as Category[];

    // 1. Create maps of all articles from both sources.
    const initialArticlesMap = new Map<number, Article>();
    initialDataCopy.forEach(cat => cat.subcategories.forEach(sub => sub.articles.forEach(art => initialArticlesMap.set(art.id, art))));

    const userArticlesMap = new Map<number, Article>();
    storedData.forEach(cat => cat.subcategories.forEach(sub => sub.articles.forEach(art => userArticlesMap.set(art.id, art))));

    // 2. Create the definitive map of all articles, with user edits taking precedence.
    const finalArticlesMap = new Map<number, Article>(initialArticlesMap);
    userArticlesMap.forEach((article, id) => finalArticlesMap.set(id, article));

    // 3. Use the new initialData as the structural template.
    const finalData = JSON.parse(JSON.stringify(initialDataCopy)) as Category[];

    // 4. Populate the new structure with the final, definitive article content.
    finalData.forEach(cat => {
        cat.subcategories.forEach(sub => {
        sub.articles = sub.articles
            .map(art => finalArticlesMap.get(art.id)!)
            .filter(Boolean); // Filter out any undefined if an ID was somehow missing
        });
    });

    // 5. Preserve user-created articles and articles from deleted/renamed categories/subcategories.
    const finalCategoryMap = new Map(finalData.map(cat => [cat.name, cat]));

    storedData.forEach(storedCategory => {
        let targetCategory = finalCategoryMap.get(storedCategory.name);
        // If a category was deleted/renamed in the new code, recreate it to preserve its content.
        if (!targetCategory) {
            targetCategory = { name: storedCategory.name, subcategories: [] };
            finalData.push(targetCategory);
            finalCategoryMap.set(targetCategory.name, targetCategory);
        }
        
        // Preserve category-level edits like generated images.
        if (storedCategory.imageUrl) {
            targetCategory.imageUrl = storedCategory.imageUrl;
            targetCategory.alt = storedCategory.alt;
        }

        const targetSubcategoryMap = new Map(targetCategory.subcategories.map(sub => [sub.name, sub]));

        storedCategory.subcategories.forEach(storedSubcategory => {
            let targetSubcategory = targetSubcategoryMap.get(storedSubcategory.name);
            // If a subcategory was deleted/renamed, recreate it within its parent category.
            if (!targetSubcategory) {
                targetSubcategory = { name: storedSubcategory.name, articles: [] };
                targetCategory!.subcategories.push(targetSubcategory);
                targetSubcategoryMap.set(targetSubcategory.name, targetSubcategory);
            }

            const articlesInTargetSub = new Set(targetSubcategory.articles.map(a => a.id));

            storedSubcategory.articles.forEach(storedArticle => {
                // If an article from the user's storage is not yet in this subcategory in our new structure, add it.
                // This covers user-created articles and articles whose original categories were removed/renamed.
                if (!articlesInTargetSub.has(storedArticle.id)) {
                    const articleToAdd = finalArticlesMap.get(storedArticle.id);
                    if (articleToAdd) {
                        targetSubcategory!.articles.push(articleToAdd);
                        articlesInTargetSub.add(articleToAdd.id);
                    }
                }
            });
        });
    });
    
    // Persist the robustly merged data back to local storage immediately.
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalData));
    return finalData;

  } catch (error) {
    console.error("Critical error during data migration. To prevent app instability, data has been reset to the default state. Please report this error:", error);
    // As a last resort, if the merge fails catastrophically, reset to prevent a crash loop.
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialDataCopy));
    return initialDataCopy;
  }
};

export const useBlogData = (): [
  Category[], 
  (articleData: Partial<Article>, placements: { categoryName: string, subcategoryName: string }[]) => void, 
  () => void,
  (categoryName: string, updatedCategory: Partial<Category>) => void,
  () => void,
] => {
  const [data, setData] = useState<Category[]>(initializeAndMigrateData);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [data]);

  const saveArticle = useCallback((articleData: Partial<Article>, placements: { categoryName: string, subcategoryName: string }[]) => {
    setData(prevData => {
        let newData = JSON.parse(JSON.stringify(prevData)); // Deep copy to avoid mutation issues
        let articleObject: Article | null = null;
        let isNewArticle = false;

        if (articleData.id) { // UPDATE existing article
            // Find the first instance of the article to update it.
            // Since all instances are references to the same object, updating one updates all.
            for (const cat of newData) {
                for (const sub of cat.subcategories) {
                    const found = sub.articles.find(a => a.id === articleData.id);
                    if (found) {
                        articleObject = found;
                        break;
                    }
                }
                if (articleObject) break;
            }

            if (!articleObject) { // Article not found, maybe it's a new one that looks like an old one
                 isNewArticle = true;
                 const newId = Date.now();
                 articleObject = {
                     id: newId,
                     title: 'New Article',
                     publicationDate: new Date().toISOString(),
                     ...articleData,
                     isFeatured: articleData.isFeatured ?? false,
                 } as Article;
            } else {
                 // Apply updates to the single article object
                Object.assign(articleObject, articleData);
            }

        } else { // CREATE new article
            isNewArticle = true;
            const newId = Date.now();
            articleObject = {
                id: newId,
                title: 'New Article',
                publicationDate: new Date().toISOString(),
                ...articleData,
                isFeatured: articleData.isFeatured ?? false,
            } as Article;
        }

        const newPlacementKeys = new Set(placements.map(p => `${p.categoryName}|${p.subcategoryName}`));

        // Iterate over all subcategories to add or remove the article reference
        newData = newData.map((cat: Category) => ({
            ...cat,
            subcategories: cat.subcategories.map(sub => {
                const currentKey = `${cat.name}|${sub.name}`;
                const isCurrentlyPlaced = sub.articles.some(a => a.id === articleObject!.id);
                const shouldBePlaced = newPlacementKeys.has(currentKey);
                
                let newArticles = [...sub.articles];

                if (isCurrentlyPlaced && !shouldBePlaced) {
                    newArticles = newArticles.filter(a => a.id !== articleObject!.id);
                } else if (!isCurrentlyPlaced && shouldBePlaced) {
                    newArticles.push(articleObject!);
                } else if (isCurrentlyPlaced && shouldBePlaced) {
                    // If updating, we need to replace the old object with the updated one
                    // to ensure property changes (like title) are reflected.
                    const index = newArticles.findIndex(a => a.id === articleObject!.id);
                    if (index !== -1) {
                        newArticles[index] = articleObject!;
                    }
                }

                return { ...sub, articles: newArticles };
            })
        }));

        return newData;
    });
  }, []);


  const updateCategory = useCallback((categoryName: string, updatedCategory: Partial<Category>) => {
    setData(prevData => 
      prevData.map(category => 
        category.name === categoryName ? { ...category, ...updatedCategory } : category
      )
    );
  }, []);
  
  const cycleFeaturedArticle = useCallback(() => {
    setData(prevData => {
      const allArticles = prevData.flatMap(cat => cat.subcategories.flatMap(sub => sub.articles));
      const allPublished = allArticles.filter(art => new Date(art.publicationDate) <= new Date());
      const uniquePublishedArticles: Article[] = Array.from(new Map<number, Article>(allPublished.map(a => [a.id, a])).values());

      if (uniquePublishedArticles.length < 2) return prevData;

      uniquePublishedArticles.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());

      const currentFeaturedIndex = uniquePublishedArticles.findIndex(a => a.isFeatured);
      const nextFeaturedIndex = (currentFeaturedIndex + 1) % uniquePublishedArticles.length;
      
      const currentFeaturedId = currentFeaturedIndex !== -1 ? uniquePublishedArticles[currentFeaturedIndex].id : null;
      const nextFeaturedId = uniquePublishedArticles[nextFeaturedIndex].id;

      if (currentFeaturedId === nextFeaturedId) return prevData;
      
      const updatedArticlesMap = new Map<number, Article>();

      if (currentFeaturedId !== null) {
          const currentFeaturedArticle = uniquePublishedArticles.find(a => a.id === currentFeaturedId);
          if (currentFeaturedArticle) {
              updatedArticlesMap.set(currentFeaturedId, { ...currentFeaturedArticle, isFeatured: false });
          }
      }

      const nextFeaturedArticle = uniquePublishedArticles.find(a => a.id === nextFeaturedId);
      if (nextFeaturedArticle) {
          updatedArticlesMap.set(nextFeaturedId, { ...nextFeaturedArticle, isFeatured: true });
      }

      return prevData.map(category => ({
        ...category,
        subcategories: category.subcategories.map(subcategory => ({
          ...subcategory,
          articles: subcategory.articles.map(article =>
            updatedArticlesMap.get(article.id) || article
          ),
        })),
      }));
    });
  }, []);

  const resetData = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all content to the original state? All your changes will be lost.')) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setData(JSON.parse(JSON.stringify(initialData)));
    }
  }, []);

  return [data, saveArticle, resetData, updateCategory, cycleFeaturedArticle];
};