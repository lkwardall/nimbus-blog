
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
import { ExportModal } from './components/ExportModal';

const isArticlePublished = (article: Article) => new Date(article.publicationDate) <= new Date();
const isDraft = (article: Article) => new Date(article.publicationDate).getFullYear() === 2099;

const CategoryDetailView: React.FC<{ 
  category: Category; 
  isEditMode: boolean; 
  onEditArticle: (article: Article) => void;
  onSelectArticle: (article: Article) => void;
  selectedSubcategoryName: string | null;
}> = ({ category, isEditMode, onEditArticle, onSelectArticle, selectedSubcategoryName }) => {
  const isAllView = selectedSubcategoryName === null;

  const sections = useMemo(() => {
    const processArticles = (articles: Article[]) => {
      const uniqueArticles = Array.from(new Map(articles.map(article => [article.id, article])).values());

      if (isEditMode) {
        // In edit mode, all articles (published, scheduled, drafts) are displayed as cards.
        return {
          publishedArticles: uniqueArticles,
          unpublishedArticles: [],
        };
      }
      
      // In preview mode:
      const published = uniqueArticles.filter(isArticlePublished);
      // Don't show drafts in preview
      const scheduled = uniqueArticles.filter(a => !isArticlePublished(a) && !isDraft(a));

      return {
        publishedArticles: published,
        unpublishedArticles: scheduled,
      };
    };

    if (isAllView) {
      const allCategoryArticles = category.subcategories.flatMap(sub => sub.articles);
      const { publishedArticles, unpublishedArticles } = processArticles(allCategoryArticles);
      
      if (publishedArticles.length === 0 && unpublishedArticles.length === 0) return [];
      
      return [{
        name: category.name,
        publishedArticles: publishedArticles,
        unpublishedArticles: unpublishedArticles,
      }];
    }
    
    return category.subcategories
      .filter(sub => sub.name === selectedSubcategoryName)
      .map(sub => {
        const { publishedArticles, unpublishedArticles } = processArticles(sub.articles);
        return {
          name: sub.name,
          publishedArticles: publishedArticles,
          unpublishedArticles: unpublishedArticles,
        };
      });
  }, [category, selectedSubcategoryName, isAllView, isEditMode]);


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
                  <ul className="list-none space-y-3">
                    {section.unpublishedArticles.map(article => (
                      <li key={article.id} className="text-gray-400 flex items-start justify-between">
                        <div className="flex items-start">
                          <svg className="w-4 h-4 mr-3 mt-1 text-[#308271] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                          <span>{article.title}</span>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap pl-3">
                          {new Date(article.publicationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
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

const EditModeToggle: React.FC<{ isEditMode: boolean; onToggle: () => void; onReset: () => void; onCycleFeatured: () => void; onCreate: () => void; onExport: () => void; }> = ({ isEditMode, onToggle, onReset, onCycleFeatured, onCreate, onExport }) => (
    <div className="fixed bottom-4 right-4 z-50 bg-[#0f323e]/80 backdrop-blur-lg p-3 rounded-lg shadow-2xl border border-white/20 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${!isEditMode ? 'text-white' : 'text-gray-400'}`}>Preview</span>
            <button onClick={onToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isEditMode ? 'bg-[#308271]' : 'bg-gray-600'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEditMode ? 'translate-x-6' : 'translate-x-1'}`}/>
            </button>
            <span className={`text-sm font-medium ${isEditMode ? 'text-white' : 'text-gray-400'}`}>Edit</span>
        </div>
        {isEditMode && (
          <div className="flex items-center space-x-2 border-l border-gray-600 pl-4">
            <button onClick={onCreate} className="text-xs text-gray-300 hover:text-white transition-colors border border-gray-600 px-2 py-1 rounded-md hover:bg-[#308271] hover:border-[#308271]">Create Article</button>
            <button onClick={onCycleFeatured} className="text-xs text-gray-300 hover:text-white transition-colors border border-gray-600 px-2 py-1 rounded-md hover:bg-[#308271] hover:border-[#308271]">Cycle Featured</button>
            <button onClick={onExport} className="text-xs text-gray-300 hover:text-white transition-colors border border-gray-600 px-2 py-1 rounded-md hover:bg-[#308271] hover:border-[#308271]">Export Data</button>
            <button onClick={onReset} className="text-xs text-gray-300 hover:text-red-400 transition-colors border border-gray-600 px-2 py-1 rounded-md">Reset Data</button>
          </div>
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
  const [blogData, saveArticle, resetData, updateCategory, cycleFeaturedArticle] = useBlogData();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
  };
  
  const handleCreateArticle = () => {
    setEditingArticle({
        title: '',
        author: 'Wellness Expert',
        publicationDate: new Date().toISOString(),
        description: '',
        body: '## New Section\n\nStart writing your article here.',
        alt: '',
    });
  };
  
  const handleCloseModal = () => {
    setEditingArticle(null);
  };
  
  const handleSaveArticle = (articleData: Partial<Article>, placements: { categoryName: string, subcategoryName: string }[]) => {
    saveArticle(articleData, placements);
    
    if (selectedArticle && selectedArticle.id === articleData.id) {
      setSelectedArticle(prev => prev ? { ...prev, ...articleData } : null);
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
    const allArticles = blogData.flatMap(cat => cat.subcategories.flatMap(sub => sub.articles));
    const allPublished = allArticles.filter(isArticlePublished);
    const uniquePublished = Array.from(new Map(allPublished.map(a => [a.id, a])).values());
    uniquePublished.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
    
    const featured = uniquePublished.find(a => a.isFeatured) || uniquePublished[0] || null;
    const recent = uniquePublished.filter(a => a.id !== featured?.id).slice(0, 6);
    
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

      {/* Main Content with standard padding-bottom; article-specific padding is handled inside the component */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-24">
        {renderContent()}
      </main>
      
      {/* This spacer will grow to push the footer down on short pages */}
      <div className="flex-grow"></div>
      
      <Footer />

      <EditModeToggle 
        isEditMode={isEditMode}
        onToggle={() => setIsEditMode(!isEditMode)}
        onReset={resetData}
        onCycleFeatured={cycleFeaturedArticle}
        onCreate={handleCreateArticle}
        onExport={() => setIsExportModalOpen(true)}
      />

      {editingArticle && (
        <EditModal 
          article={editingArticle}
          allCategories={blogData}
          onSave={handleSaveArticle}
          onClose={handleCloseModal}
        />
      )}

      {isExportModalOpen && (
        <ExportModal onClose={() => setIsExportModalOpen(false)} />
      )}
    </div>
  );
};

export default App;
