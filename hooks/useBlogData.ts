
import { useState, useCallback } from 'react';
import { Category, Article } from '../types';
import { blogData as initialData } from '../data/articles';

const LOCAL_STORAGE_KEY = 'discoverWellnessBlogData';

const initializeData = (): Category[] => {
  try {
    const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedDataString) {
      return JSON.parse(storedDataString) as Category[];
    } else {
      const initialDataCopy = JSON.parse(JSON.stringify(initialData)) as Category[];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialDataCopy));
      return initialDataCopy;
    }
  } catch (error) {
    console.error("Error initializing data from localStorage. Reverting to default data.", error);
    return JSON.parse(JSON.stringify(initialData)) as Category[];
  }
};

export const useBlogData = (): [
  Category[], 
  (articleData: Partial<Article>, placements: { categoryName: string, subcategoryName: string }[]) => void, 
  () => void,
  (categoryName: string, updatedCategory: Partial<Category>) => void,
  () => void,
  (jsonData: string) => Promise<void>,
  () => string
] => {
  const [data, setData] = useState<Category[]>(initializeData);

  const saveDataToLocalStorage = (newData: Category[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    } catch (error) {
      console.error("Error saving data to localStorage", error);
    }
  };

  const saveArticle = useCallback((articleData: Partial<Article>, placements: { categoryName: string, subcategoryName: string }[]) => {
    setData(currentData => {
      const newData = JSON.parse(JSON.stringify(currentData));
      const isNew = !articleData.id;
      let finalArticle: Article;

      if (isNew) {
        finalArticle = {
          id: Date.now(),
          title: 'Untitled Article',
          publicationDate: new Date().toISOString(),
          isFeatured: false,
          ...articleData,
        } as Article;
      } else {
        let originalArticle: Article | undefined;
        for (const cat of newData) {
          for (const sub of cat.subcategories) {
            const found = sub.articles.find(a => a.id === articleData.id);
            if (found) {
              originalArticle = found;
              break;
            }
          }
          if (originalArticle) break;
        }
        if (originalArticle) {
          finalArticle = { ...originalArticle, ...articleData };
        } else {
           finalArticle = { id: articleData.id, ...articleData } as Article;
        }
      }

      // Atomically update placements:
      // 1. First, remove all instances of this article from the entire data structure.
      newData.forEach(cat => {
        cat.subcategories.forEach(sub => {
          sub.articles = sub.articles.filter(a => a.id !== finalArticle.id);
        });
      });

      // 2. Then, add the single, definitive, updated article object to the correct new placements.
      placements.forEach(p => {
        const category = newData.find(c => c.name === p.categoryName);
        if (category) {
          const subcategory = category.subcategories.find(s => s.name === p.subcategoryName);
          if (subcategory) {
            const articleForPlacement = { ...finalArticle, subcategory: p.subcategoryName };
            if (!subcategory.articles.some(a => a.id === articleForPlacement.id)) {
                subcategory.articles.push(articleForPlacement);
            }
          }
        }
      });

      saveDataToLocalStorage(newData);
      return newData;
    });
  }, []);

  const updateCategory = useCallback((categoryName: string, updatedCategoryData: Partial<Category>) => {
    setData(currentData => {
        const newData = currentData.map(category => 
          category.name === categoryName ? { ...category, ...updatedCategoryData } : category
        );
        saveDataToLocalStorage(newData);
        return newData;
    });
  }, []);
  
  const cycleFeaturedArticle = useCallback(() => {
    setData(currentData => {
        const allArticles = currentData.flatMap(cat => cat.subcategories.flatMap(sub => sub.articles));
        const allPublished = allArticles.filter(art => new Date(art.publicationDate) <= new Date());
        const uniquePublishedArticles = Array.from(new Map(allPublished.map(a => [a.id, a])).values());
    
        if (uniquePublishedArticles.length < 2) return currentData;
    
        uniquePublishedArticles.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
    
        const currentFeaturedIndex = uniquePublishedArticles.findIndex(a => a.isFeatured);
        const nextFeaturedIndex = (currentFeaturedIndex + 1) % uniquePublishedArticles.length;
        
        const currentFeaturedId = currentFeaturedIndex !== -1 ? uniquePublishedArticles[currentFeaturedIndex].id : null;
        const nextFeaturedId = uniquePublishedArticles[nextFeaturedIndex].id;
    
        if (currentFeaturedId === nextFeaturedId) return currentData;

        const newData = JSON.parse(JSON.stringify(currentData));
        newData.forEach((cat: Category) => {
            cat.subcategories.forEach(sub => {
                sub.articles.forEach(art => {
                    if (art.id === currentFeaturedId) art.isFeatured = false;
                    if (art.id === nextFeaturedId) art.isFeatured = true;
                });
            });
        });
        
        saveDataToLocalStorage(newData);
        return newData;
    });
  }, []);

  const resetData = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all content to the original state? All your changes will be lost.')) {
        const initialDataCopy = JSON.parse(JSON.stringify(initialData));
        saveDataToLocalStorage(initialDataCopy);
        setData(initialDataCopy);
    }
  }, []);
  
  const importData = useCallback(async (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData);
      if (!Array.isArray(parsedData)) {
        throw new Error("Invalid data format: Expected an array of categories.");
      }
      // A more robust validation could be added here
      setData(parsedData);
      saveDataToLocalStorage(parsedData);
    } catch (error) {
      console.error("Failed to import data:", error);
      throw new Error("Failed to parse the imported data file. Please ensure it's a valid JSON backup.");
    }
  }, []);

  const exportData = useCallback((): string => {
    return JSON.stringify(data, null, 2); // Pretty-print with an indent of 2
  }, [data]);

  return [data, saveArticle, resetData, updateCategory, cycleFeaturedArticle, importData, exportData];
};