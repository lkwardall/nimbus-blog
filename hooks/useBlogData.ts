
import { useState, useEffect, useCallback } from 'react';
import { Category, Article, Subcategory } from '../types';
import { blogData as initialData } from '../data/articles';

const LOCAL_STORAGE_KEY = 'discoverWellnessBlogData';

const sanitizeDataForStorage = (data: Category[]): Category[] => {
  try {
    const sanitizedData = JSON.parse(JSON.stringify(data));

    sanitizedData.forEach((category: Category) => {
      if (category.imageUrl && category.imageUrl.startsWith('data:image')) {
        delete category.imageUrl;
        delete category.alt;
      }
      category.subcategories.forEach((subcategory: Subcategory) => {
        subcategory.articles.forEach((article: Article) => {
          if (article.imageUrl && article.imageUrl.startsWith('data:image')) {
            delete article.imageUrl;
            delete article.alt;
          }
        });
      });
    });

    return sanitizedData;
  } catch (error) {
    console.error("Failed to sanitize data for storage, returning original data.", error);
    return data;
  }
};


const initializeAndMigrateData = (): Category[] => {
  const initialDataCopy = JSON.parse(JSON.stringify(initialData)) as Category[];
  
  try {
    const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedDataString) {
      // No stored data, so we can safely use the initial data.
      return initialDataCopy;
    }

    const storedData = JSON.parse(storedDataString) as Category[];

    // Create maps of all articles for efficient lookup.
    const initialArticlesMap = new Map<number, Article>();
    initialDataCopy.forEach(cat => cat.subcategories.forEach(sub => sub.articles.forEach(art => initialArticlesMap.set(art.id, art))));

    const userArticlesMap = new Map<number, Article>();
    storedData.forEach(cat => cat.subcategories.forEach(sub => sub.articles.forEach(art => userArticlesMap.set(art.id, art))));

    // Create the new data structure starting from the initialData's structure.
    const mergedData = JSON.parse(JSON.stringify(initialDataCopy)) as Category[];
    
    // 1. Preserve user edits: Update any article in our new structure with the user's saved version.
    mergedData.forEach(cat => {
      cat.subcategories.forEach(sub => {
        sub.articles = sub.articles.map(article => {
          if (userArticlesMap.has(article.id)) {
            // If the user has a saved version of this article, use it.
            return userArticlesMap.get(article.id)!;
          }
          // Otherwise, it's a new default article, so we keep it.
          return article;
        });
      });
    });

    // 2. Preserve user-created articles: Find articles the user created and add them to the correct subcategory.
    const mergedSubcategoryMap = new Map<string, Subcategory>();
    mergedData.forEach(cat => {
        cat.subcategories.forEach(sub => {
            const key = `${cat.name}|${sub.name}`;
            mergedSubcategoryMap.set(key, sub);
        })
    });
    
    storedData.forEach(cat => {
        cat.subcategories.forEach(sub => {
            const key = `${cat.name}|${sub.name}`;
            const targetSubcategory = mergedSubcategoryMap.get(key);
            
            if (targetSubcategory) {
                sub.articles.forEach(storedArticle => {
                    if (!initialArticlesMap.has(storedArticle.id)) {
                        // This is a user-created article. Add it if it's not already there.
                        if (!targetSubcategory.articles.some(a => a.id === storedArticle.id)) {
                            targetSubcategory.articles.push(storedArticle);
                        }
                    }
                });
            }
        });
    });

    // 3. Preserve category-level user edits (e.g., a generated cover image).
    const userCategoryMap = new Map(storedData.map(cat => [cat.name, cat]));
    mergedData.forEach(cat => {
      const userCat = userCategoryMap.get(cat.name);
      if (userCat) {
        cat.imageUrl = userCat.imageUrl;
        cat.alt = userCat.alt;
      }
    });

    // Persist the newly merged data back to local storage immediately.
    // This ensures subsequent loads are based on the correct, merged state.
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitizeDataForStorage(mergedData)));

    return mergedData;

  } catch (error) {
    console.error("Error during data initialization/migration. To prevent further issues, the data will be reset to the default state. Please review the error:", error);
    // If anything goes wrong, clear the corrupted storage and start fresh to avoid error loops.
    localStorage.removeItem(LOCAL_STORAGE_KEY);
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
      const dataToStore = sanitizeDataForStorage(data);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [data]);

  const saveArticle = useCallback((articleData: Partial<Article>, placements: { categoryName: string, subcategoryName: string }[]) => {
    setData(prevData => {
        let workingArticle: Article;
        const isNewArticle = !articleData.id;

        // Step 1: Create or find the definitive, updated article object.
        if (isNewArticle) {
            const newId = Date.now(); // Simple unique ID for client-side
            workingArticle = {
                id: newId,
                title: 'New Article',
                publicationDate: new Date().toISOString(),
                ...articleData,
                isFeatured: articleData.isFeatured ?? false,
            } as Article;
        } else {
            // Find any instance of the existing article to merge changes into.
            let existingArticle: Article | undefined;
            for (const cat of prevData) {
                for (const sub of cat.subcategories) {
                    existingArticle = sub.articles.find(a => a.id === articleData.id);
                    if (existingArticle) break;
                }
                if (existingArticle) break;
            }
            if (!existingArticle) return prevData; // Should not happen if editing

            workingArticle = { ...existingArticle, ...articleData };
        }

        // Ensure subcategory on the article object is updated to reflect its primary placement.
        // This makes sure it's correct for display (e.g., in ArticleCard) and for export.
        if (placements.length > 0) {
            workingArticle.subcategory = placements[0].subcategoryName;
        } else if (isNewArticle) {
            // A new article should have a subcategory. Assign a default if none provided,
            // although the UI should enforce selecting at least one placement.
            workingArticle.subcategory = 'Uncategorized';
        }

        const newPlacementKeys = new Set(placements.map(p => `${p.categoryName}|${p.subcategoryName}`));

        // Step 2: Rebuild the data structure immutably.
        // This ensures all references to the updated article are correct.
        const newData = prevData.map(category => {
            let hasChanged = false;
            const newSubcategories = category.subcategories.map(subcategory => {
                const currentKey = `${category.name}|${subcategory.name}`;
                const originalArticles = subcategory.articles;
                let newArticles = originalArticles;
                
                const isCurrentlyPlaced = originalArticles.some(a => a.id === workingArticle.id);
                const shouldBePlaced = newPlacementKeys.has(currentKey);

                if (isCurrentlyPlaced && !shouldBePlaced) { // REMOVE
                    newArticles = originalArticles.filter(a => a.id !== workingArticle.id);
                } else if (!isCurrentlyPlaced && shouldBePlaced) { // ADD
                    newArticles = [...originalArticles, workingArticle];
                } else if (isCurrentlyPlaced && shouldBePlaced && !isNewArticle) { // UPDATE
                    newArticles = originalArticles.map(a => a.id === workingArticle.id ? workingArticle : a);
                }
                
                if (newArticles !== originalArticles) {
                    hasChanged = true;
                    return { ...subcategory, articles: newArticles };
                }
                return subcategory;
            });
            
            if (hasChanged) {
                return { ...category, subcategories: newSubcategories };
            }
            return category;
        });

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
      // Get all unique published articles
      const allArticles = prevData.flatMap(cat => cat.subcategories.flatMap(sub => sub.articles));
      const allPublished = allArticles.filter(art => new Date(art.publicationDate) <= new Date());
      // FIX: Explicitly type the Map to ensure TypeScript correctly infers the type of `uniquePublishedArticles` as `Article[]`.
      const uniquePublishedArticles: Article[] = Array.from(new Map<number, Article>(allPublished.map(a => [a.id, a])).values());

      if (uniquePublishedArticles.length < 2) return prevData;

      uniquePublishedArticles.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());

      const currentFeaturedIndex = uniquePublishedArticles.findIndex(a => a.isFeatured);
      const nextFeaturedIndex = (currentFeaturedIndex + 1) % uniquePublishedArticles.length;
      
      const currentFeaturedId = currentFeaturedIndex !== -1 ? uniquePublishedArticles[currentFeaturedIndex].id : null;
      const nextFeaturedId = uniquePublishedArticles[nextFeaturedIndex].id;

      if (currentFeaturedId === nextFeaturedId) return prevData;
      
      const updatedArticlesMap = new Map<number, Article>();

      // Update the article to be un-featured
      if (currentFeaturedId !== null) {
          const currentFeaturedArticle = uniquePublishedArticles.find(a => a.id === currentFeaturedId);
          if (currentFeaturedArticle) {
              updatedArticlesMap.set(currentFeaturedId, { ...currentFeaturedArticle, isFeatured: false });
          }
      }

      // Update the article to be featured
      const nextFeaturedArticle = uniquePublishedArticles.find(a => a.id === nextFeaturedId);
      if (nextFeaturedArticle) {
          updatedArticlesMap.set(nextFeaturedId, { ...nextFeaturedArticle, isFeatured: true });
      }

      // Rebuild the data structure, using updated articles from the map to maintain shared references
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
