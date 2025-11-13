
import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SubHeader } from './components/SubHeader';
import { Footer } from './components/Footer';
import { ArticleCard } from './components/ArticleCard';
import { EditModal } from './components/EditModal';
import { useBlogData } from './hooks/useBlogData';
import { Category, Article } from './types';
import { CategoryCard } from './components/CategoryCard';
import { ArticleDetailView } from './components/ArticleDetailView';

const CategoryDetailView: React.FC<{ 
  category: Category; 
  isEditMode: boolean; 
  onEditArticle: (article: Article) => void;
  onSelectArticle: (article: Article) => void;
  selectedSubcategoryName: string | null;
}> = ({ category, isEditMode, onEditArticle, onSelectArticle, selectedSubcategoryName }) => {
  const isAllView = selectedSubcategoryName === null;

  const sections = useMemo(() => {
    if (isAllView) {
      const allArticles = category.subcategories.flatMap(sub => sub.articles);
      
      // Deduplicate articles by their ID to prevent showing the same article multiple times.
      const uniqueArticles = Array.from(new Map(allArticles.map(article => [article.id, article])).values());

      // FIX: Explicitly type `a` as Article to resolve type inference issue.
      const allPublished = uniqueArticles.filter((a: Article) => a.published);
      const allUnpublished = uniqueArticles.filter((a: Article) => !a.published);

      if (allPublished.length === 0 && allUnpublished.length === 0) return [];

      return [{
        name: category.name, // Use category name for key, won't be displayed
        publishedArticles: allPublished,
        unpublishedArticles: allUnpublished,
      }];
    }
    // For specific subcategory view, filter down to just that one.
    return category.subcategories
      .filter(sub => sub.name === selectedSubcategoryName)
      .map(sub => ({
        name: sub.name,
        publishedArticles: sub.articles.filter(a => a.published),
        unpublishedArticles: sub.articles.filter(a => !a.published),
      }));
  }, [category, selectedSubcategoryName, isAllView]);


  return (
    <section id={category.name.replace(/\s+/g, '-')} className="mt-8 md:mt-12 scroll-mt-20">
      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight border-b-2 border-[#308271] pb-3 mb-8">
        {category.name}
      </h1>
      <div className={isAllView ? "" : "space-y-12"}>
        {sections.map(section => {
          if (section.publishedArticles.length === 0 && section.unpublishedArticles.length === 0) {
            return null;
          }

          return (
            <div key={section.name}>
              {!isAllView && <h3 className="text-2xl font-semibold text-gray-200 mb-6">{section.name}</h3>}
              
              {section.publishedArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {section.publishedArticles.map(article => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      isEditMode={isEditMode} 
                      onEdit={onEditArticle}
                      onSelectArticle={onSelectArticle} 
                    />
                  ))}
                </div>
              )}

              {section.unpublishedArticles.length > 0 && (
                <div className={`p-6 rounded-xl bg-[#0f323e]/80 border border-white/10 ${section.publishedArticles.length > 0 ? 'mt-8' : ''}`}>
                  <h4 className="font-semibold text-lg text-white mb-4">Coming Soon</h4>
                  <ul className="list-none space-y-2">
                    {section.unpublishedArticles.map(article => (
                      <li key={article.id} className="text-gray-400 flex items-start">
                        <svg className="w-4 h-4 mr-3 mt-1 text-[#308271] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        {article.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

const EditModeToggle: React.FC<{ isEditMode: boolean; onToggle: () => void; onReset: () => void; }> = ({ isEditMode, onToggle, onReset }) => (
    <div className="fixed bottom-4 right-4 z-50 bg-[#0f323e]/80 backdrop-blur-lg p-3 rounded-lg shadow-2xl border border-white/20 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${!isEditMode ? 'text-white' : 'text-gray-400'}`}>Preview</span>
            <button onClick={onToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isEditMode ? 'bg-[#308271]' : 'bg-gray-600'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEditMode ? 'translate-x-6' : 'translate-x-1'}`}/>
            </button>
            <span className={`text-sm font-medium ${isEditMode ? 'text-white' : 'text-gray-400'}`}>Edit</span>
        </div>
        {isEditMode && (
            <button onClick={onReset} className="text-xs text-gray-300 hover:text-red-400 transition-colors border border-gray-600 px-2 py-1 rounded-md">Reset Data</button>
        )}
    </div>
);

const FeaturedArticleCard: React.FC<{article: Article; isEditMode: boolean; onEdit: (article: Article) => void; onSelectArticle: (article: Article) => void;}> = ({ article, isEditMode, onEdit, onSelectArticle }) => {
  return (
    <div className="relative rounded-xl overflow-hidden bg-[#0f323e] shadow-2xl mb-12">
      <div className="md:flex">
        {article.imageUrl && (
          <div className="md:w-1/2">
            <img className="h-64 w-full object-cover md:h-full" src={article.imageUrl} alt={article.alt} />
          </div>
        )}
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
          <p className="text-sm font-semibold text-[#308271] uppercase tracking-wide">Featured Article</p>
          <h2 className="mt-2 text-3xl font-bold text-white leading-tight">{article.title}</h2>
          <p className="mt-4 text-gray-300">{article.description}</p>
          <button onClick={() => !isEditMode && onSelectArticle(article)} className={`mt-6 inline-block bg-[#308271] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#45a08d] transition-colors self-start ${isEditMode ? 'cursor-not-allowed opacity-70' : ''}`}>
            Read More
          </button>
        </div>
      </div>
       {isEditMode && (
        <button
          onClick={() => onEdit(article)}
          className="absolute top-4 right-4 bg-white text-[#0f323e] px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors z-10"
          aria-label={`Edit article: ${article.title}`}
        >
          Edit
        </button>
      )}
    </div>
  );
};


const App: React.FC = () => {
  const [blogData, updateArticle, resetData, updateCategory] = useBlogData();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
  };
  
  const handleCloseModal = () => {
    setEditingArticle(null);
  };
  
  const handleSaveArticle = (articleId: number, updatedArticle: Partial<Article>) => {
    updateArticle(articleId, updatedArticle);
    // If the currently viewed article is updated, refresh its state
    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle(prev => prev ? { ...prev, ...updatedArticle } : null);
    }
  };
  
  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
  };
  
  const handleSelectCategory = (name: string) => {
    setSelectedCategoryName(name);
    setSelectedSubcategoryName(null);
    setSelectedArticle(null); // Deselect article when changing category
  };

  const handleSelectSubcategory = (name: string | null) => {
    setSelectedSubcategoryName(name);
  };

  const handleGoHome = () => {
    setSelectedCategoryName(null);
    setSelectedSubcategoryName(null);
    setSelectedArticle(null);
  };
  
  const { featuredArticle, recentArticles } = useMemo(() => {
    const allPublished = blogData
      .flatMap(cat => cat.subcategories.flatMap(sub => sub.articles))
      .filter(a => a.published);

    allPublished.sort((a, b) => b.id - a.id);
    
    const featured = allPublished.find(a => a.title.includes("Testosterone Decline")) || allPublished[0] || null;
    const recent = allPublished.filter(a => a.id !== featured?.id).slice(0, 6);
    
    return { featuredArticle: featured, recentArticles: recent };
  }, [blogData]);


  const selectedCategory = useMemo(() => {
    if (!selectedCategoryName) return null;
    return blogData.find(cat => cat.name === selectedCategoryName) || null;
  }, [selectedCategoryName, blogData]);

  const appStyle: React.CSSProperties = {
      backgroundColor: '#010202',
      backgroundImage: `
        radial-gradient(at 25% 15%, hsla(195, 66%, 15%, 0.7) 0px, transparent 50%),
        radial-gradient(at 75% 85%, hsla(167, 44%, 31%, 0.5) 0px, transparent 50%),
        radial-gradient(at 50% 50%, hsla(195, 55%, 25%, 0.3) 0px, transparent 70%)
      `,
  };
  
  const renderContent = () => {
    if (selectedArticle) {
      return <ArticleDetailView 
                article={selectedArticle}
                isEditMode={isEditMode}
                onEditArticle={handleEditArticle}
                onBack={() => setSelectedArticle(null)}
             />;
    }
    if (selectedCategory) {
      return <CategoryDetailView 
                category={selectedCategory}
                isEditMode={isEditMode}
                onEditArticle={handleEditArticle}
                onSelectArticle={handleSelectArticle}
                selectedSubcategoryName={selectedSubcategoryName}
             />;
    }
    return (
      <>
        {featuredArticle && (
          <FeaturedArticleCard 
            article={featuredArticle}
            isEditMode={isEditMode}
            onEdit={handleEditArticle}
            onSelectArticle={handleSelectArticle}
          />
        )}
        
        <section className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">Recent Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentArticles.map(article => (
                    <ArticleCard key={article.id} article={article} isEditMode={isEditMode} onEdit={handleEditArticle} onSelectArticle={handleSelectArticle} />
                ))}
            </div>
        </section>

        <section className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">Explore All Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogData.map(category => (
                <CategoryCard 
                  key={category.name} 
                  category={category} 
                  isEditMode={isEditMode}
                  onSelectCategory={handleSelectCategory}
                  onUpdateCategory={updateCategory}
                />
              ))}
            </div>
        </section>
      </>
    );
  };
  
  return (
    <div style={appStyle} className="min-h-screen text-white font-sans flex flex-col">
      <Header 
        onGoHome={handleGoHome}
        categories={blogData}
        selectedCategoryName={selectedCategoryName}
        onSelectCategory={handleSelectCategory}
      />
      {selectedCategory && (
        <SubHeader 
          category={selectedCategory}
          selectedSubcategoryName={selectedSubcategoryName}
          onSelectSubcategory={handleSelectSubcategory}
        />
      )}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1">
        {renderContent()}
      </main>
      <Footer />

      <EditModeToggle 
        isEditMode={isEditMode}
        onToggle={() => setIsEditMode(!isEditMode)}
        onReset={resetData}
      />

      {editingArticle && (
        <EditModal 
          article={editingArticle}
          onSave={handleSaveArticle}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default App;
