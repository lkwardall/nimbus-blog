import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  isEditMode: boolean;
  onEdit: (article: Article) => void;
  onSelectArticle: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, isEditMode, onEdit, onSelectArticle }) => {
  const handleCardClick = () => {
    if (!isEditMode) {
      onSelectArticle(article);
    }
  };

  return (
    <div className="relative">
      <div 
        onClick={handleCardClick}
        className={`group block rounded-xl overflow-hidden bg-[#0f323e] hover:bg-[#215b69] transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-[#308271]/20 ${!isEditMode ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <div className="flex flex-col">
          {article.imageUrl && (
              <div className="overflow-hidden relative">
                  <img 
                      src={article.imageUrl} 
                      alt={article.alt} 
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
              </div>
          )}
          <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow">
            <div>
              <h3 className="font-bold text-white text-xl group-hover:text-[#308271] transition-colors duration-300">
                {article.title}
              </h3>
              {article.author && article.subcategory && (
                  <p className="text-sm text-gray-400 mt-2">
                      By <span className="font-semibold text-gray-300">{article.author}</span> in <span className="font-semibold text-gray-300">{article.subcategory}</span>
                  </p>
              )}
              {article.description && (
                  <p className="text-gray-300 mt-3 text-sm leading-relaxed">
                      {article.description}
                  </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {isEditMode && (
        <button
          onClick={() => onEdit(article)}
          className="absolute top-2 right-2 bg-[#308271] text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-[#45a08d] transition-colors z-10"
          aria-label={`Edit article: ${article.title}`}
        >
          Edit
        </button>
      )}
    </div>
  );
};