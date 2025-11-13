import { useState, useEffect, useCallback } from 'react';
import { Category, Article } from '../types';
import { blogData as initialData } from '../data/articles';

const LOCAL_STORAGE_KEY = 'discoverWellnessBlogData';

export const useBlogData = (): [
  Category[], 
  (articleId: number, updatedArticle: Partial<Article>) => void, 
  () => void,
  (categoryName: string, updatedCategory: Partial<Category>) => void
] => {
  const [data, setData] = useState<Category[]>(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        // A simple migration check for articles and categories
        const parsed = JSON.parse(storedData);
        parsed.forEach((cat: Category) => {
          if (cat.imageUrl && !cat.alt) {
            cat.alt = `A decorative image for the ${cat.name} category`;
          }
          cat.subcategories.forEach(sub => sub.articles.forEach(art => {
            if (art.published && !art.alt) {
                art.alt = `An image related to the article: ${art.title}`;
            }
          }));
        });
        return parsed;
      }
      // Use JSON stringify/parse for a deep clone to avoid mutation issues on reset
      return JSON.parse(JSON.stringify(initialData));
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return JSON.parse(JSON.stringify(initialData));
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [data]);

  const updateArticle = useCallback((articleId: number, updatedArticle: Partial<Article>) => {
    setData(prevData => {
      return prevData.map(category => ({
        ...category,
        subcategories: category.subcategories.map(subcategory => ({
          ...subcategory,
          articles: subcategory.articles.map(article =>
            article.id === articleId ? { ...article, ...updatedArticle } : article
          ),
        })),
      }));
    });
  }, []);

  const updateCategory = useCallback((categoryName: string, updatedCategory: Partial<Category>) => {
    setData(prevData => 
      prevData.map(category => 
        category.name === categoryName ? { ...category, ...updatedCategory } : category
      )
    );
  }, []);
  
  const resetData = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all content to the original state? All your changes will be lost.')) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setData(JSON.parse(JSON.stringify(initialData)));
    }
  }, []);

  return [data, updateArticle, resetData, updateCategory];
};
