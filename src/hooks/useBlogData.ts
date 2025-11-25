import { useState, useEffect, useCallback } from "react";
import { Category, Article } from "../types"; // Removed Subcategory
import { blogData as initialData } from "../data/articles";

const LOCAL_STORAGE_KEY = "discoverWellnessBlogData";

const sanitizeDataForStorage = (data: Category[]): Category[] => {
  try {
    // We simplified this logic, so we don't need to iterate with types anymore
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error(
      "Failed to sanitize data for storage, returning original data.",
      error
    );
    return data;
  }
};

const initializeAndMigrateData = (): Category[] => {
  const initialDataCopy = JSON.parse(JSON.stringify(initialData)) as Category[];

  try {
    const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedDataString) {
      return initialDataCopy;
    }

    const storedData = JSON.parse(storedDataString) as Category[];
    const initialArticlesMap = new Map<number, Article>();

    initialDataCopy.forEach((cat) =>
      cat.subcategories.forEach((sub) =>
        sub.articles.forEach((art) => initialArticlesMap.set(art.id, art))
      )
    );

    const userArticlesMap = new Map<number, Article>();
    storedData.forEach((cat) =>
      cat.subcategories.forEach((sub) =>
        sub.articles.forEach((art) => userArticlesMap.set(art.id, art))
      )
    );

    const mergedData = JSON.parse(
      JSON.stringify(initialDataCopy)
    ) as Category[];

    mergedData.forEach((cat) => {
      cat.subcategories.forEach((sub) => {
        sub.articles = sub.articles.map((article) => {
          if (userArticlesMap.has(article.id)) {
            return userArticlesMap.get(article.id)!;
          }
          return article;
        });
      });
    });

    // Preserve user-created articles
    const mergedSubcategoryMap = new Map<string, any>();
    mergedData.forEach((cat) => {
      cat.subcategories.forEach((sub) => {
        const key = `${cat.name}|${sub.name}`;
        mergedSubcategoryMap.set(key, sub);
      });
    });

    storedData.forEach((cat) => {
      cat.subcategories.forEach((sub) => {
        const key = `${cat.name}|${sub.name}`;
        const targetSubcategory = mergedSubcategoryMap.get(key);

        if (targetSubcategory) {
          sub.articles.forEach((storedArticle) => {
            if (!initialArticlesMap.has(storedArticle.id)) {
              if (
                !targetSubcategory.articles.some(
                  (a: Article) => a.id === storedArticle.id
                )
              ) {
                targetSubcategory.articles.push(storedArticle);
              }
            }
          });
        }
      });
    });

    // Preserve category edits
    const userCategoryMap = new Map(storedData.map((cat) => [cat.name, cat]));
    mergedData.forEach((cat) => {
      const userCat = userCategoryMap.get(cat.name);
      if (userCat) {
        cat.imageUrl = userCat.imageUrl;
        cat.alt = userCat.alt;
      }
    });

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(sanitizeDataForStorage(mergedData))
    );
    return mergedData;
  } catch (error) {
    console.error("Error during data initialization/migration.", error);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return initialDataCopy;
  }
};

export const useBlogData = (): [
  Category[],
  (
    articleData: Partial<Article>,
    placements: { categoryName: string; subcategoryName: string }[]
  ) => void,
  () => void,
  (categoryName: string, updatedCategory: Partial<Category>) => void,
  () => void,
  (newData: Category[]) => void
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

  const saveArticle = useCallback(
    async (
      articleData: Partial<Article>,
      placements: { categoryName: string; subcategoryName: string }[]
    ) => {
      // 1. PREPARE THE DATA
      // We determine the ID and structure upfront so we can send it to both State and Server.
      const isNewArticle = !articleData.id;
      const articleId = articleData.id || Date.now();

      const workingArticle: Article = {
        id: articleId,
        title: articleData.title || "New Article",
        publicationDate:
          articleData.publicationDate || new Date().toISOString(),
        ...articleData, // Merge in the edits
        isFeatured: articleData.isFeatured ?? false,
        // Default subcategory if none selected
        subcategory:
          placements.length > 0
            ? placements[0].subcategoryName
            : articleData.subcategory || "Uncategorized",
      } as Article;

      // 2. UPDATE REACT STATE (Optimistic UI Update)
      setData((prevData) => {
        const newPlacementKeys = new Set(
          placements.map((p) => `${p.categoryName}|${p.subcategoryName}`)
        );

        return prevData.map((category) => {
          let hasChanged = false;
          const newSubcategories = category.subcategories.map((subcategory) => {
            const currentKey = `${category.name}|${subcategory.name}`;
            const originalArticles = subcategory.articles;
            let newArticles = originalArticles;

            const isCurrentlyPlaced = originalArticles.some(
              (a) => a.id === workingArticle.id
            );
            const shouldBePlaced = newPlacementKeys.has(currentKey);

            if (isCurrentlyPlaced && !shouldBePlaced) {
              // Remove from this subcategory
              newArticles = originalArticles.filter(
                (a) => a.id !== workingArticle.id
              );
            } else if (!isCurrentlyPlaced && shouldBePlaced) {
              // Add to this subcategory
              newArticles = [...originalArticles, workingArticle];
            } else if (isCurrentlyPlaced && shouldBePlaced && !isNewArticle) {
              // Update in this subcategory
              newArticles = originalArticles.map((a) =>
                a.id === workingArticle.id ? workingArticle : a
              );
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
      });

      // 3. SEND TO BACKEND SERVER
      try {
        const response = await fetch("/api/save-article", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workingArticle),
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Saved to disk:", result.message);
          // Optional: Show a toast or small notification here
        } else {
          console.error("Server failed to save:", result.error);
          alert("Warning: Failed to save file to disk. " + result.error);
        }
      } catch (error) {
        console.error("Network error:", error);
        alert(
          "Error: Could not connect to local server. Is it running on port 5000?"
        );
      }
    },
    []
  );

  const updateCategory = useCallback(
    (categoryName: string, updatedCategory: Partial<Category>) => {
      setData((prevData) =>
        prevData.map((category) =>
          category.name === categoryName
            ? { ...category, ...updatedCategory }
            : category
        )
      );
    },
    []
  );

  const cycleFeaturedArticle = useCallback(() => {
    setData((prevData) => {
      const allArticles = prevData.flatMap((cat) =>
        cat.subcategories.flatMap((sub) => sub.articles)
      );
      const allPublished = allArticles.filter(
        (art) => new Date(art.publicationDate) <= new Date()
      );
      const uniquePublishedArticles: Article[] = Array.from(
        new Map<number, Article>(allPublished.map((a) => [a.id, a])).values()
      );

      if (uniquePublishedArticles.length < 2) return prevData;

      uniquePublishedArticles.sort(
        (a, b) =>
          new Date(b.publicationDate).getTime() -
          new Date(a.publicationDate).getTime()
      );

      const currentFeaturedIndex = uniquePublishedArticles.findIndex(
        (a) => a.isFeatured
      );
      const nextFeaturedIndex =
        (currentFeaturedIndex + 1) % uniquePublishedArticles.length;
      const currentFeaturedId =
        currentFeaturedIndex !== -1
          ? uniquePublishedArticles[currentFeaturedIndex].id
          : null;
      const nextFeaturedId = uniquePublishedArticles[nextFeaturedIndex].id;

      if (currentFeaturedId === nextFeaturedId) return prevData;

      const updatedArticlesMap = new Map<number, Article>();
      if (currentFeaturedId !== null) {
        const current = uniquePublishedArticles.find(
          (a) => a.id === currentFeaturedId
        );
        if (current)
          updatedArticlesMap.set(currentFeaturedId, {
            ...current,
            isFeatured: false,
          });
      }
      const next = uniquePublishedArticles.find((a) => a.id === nextFeaturedId);
      if (next)
        updatedArticlesMap.set(nextFeaturedId, { ...next, isFeatured: true });

      return prevData.map((category) => ({
        ...category,
        subcategories: category.subcategories.map((subcategory) => ({
          ...subcategory,
          articles: subcategory.articles.map(
            (article) => updatedArticlesMap.get(article.id) || article
          ),
        })),
      }));
    });
  }, []);

  const resetData = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to reset all content to the original state?"
      )
    ) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setData(JSON.parse(JSON.stringify(initialData)));
    }
  }, []);

  const importData = useCallback((newData: Category[]) => {
    if (
      window.confirm(
        "This will overwrite your current local changes. Are you sure?"
      )
    ) {
      if (Array.isArray(newData) && newData.length > 0) {
        setData(newData);
        alert("Content imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    }
  }, []);

  return [
    data,
    saveArticle,
    resetData,
    updateCategory,
    cycleFeaturedArticle,
    importData,
  ];
};
