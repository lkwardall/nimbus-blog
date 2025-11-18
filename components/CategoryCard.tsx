
import React from 'react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  isEditMode: boolean;
  onSelectCategory: (name: string) => void;
  onUpdateCategory: (name: string, data: Partial<Category>) => void;
}

const isArticlePublished = (publicationDate: string) => new Date(publicationDate) <= new Date();

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, isEditMode, onSelectCategory, onUpdateCategory }) => {

  const articlesToShow = category.subcategories
    .flatMap(sub => sub.articles.filter(a => isArticlePublished(a.publicationDate)))
    .slice(0, 3);

  return (
    <div className="relative group rounded-xl overflow-hidden bg-[#0f323e] shadow-lg hover:shadow-2xl hover:shadow-[#308271]/20 transition-all duration-300 transform hover:-translate-y-1">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: category.imageUrl ? `url(${category.imageUrl})` : 'none' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
      
      <div className="relative p-6 flex flex-col justify-end h-96 text-white">
        <h3 className="text-3xl font-bold">{category.name}</h3>
        <ul className="mt-4 space-y-2 text-sm text-gray-300 border-l-2 border-[#308271] pl-4">
          {articlesToShow.map(article => (
            <li key={article.id}>{article.title}</li>
          ))}
          {articlesToShow.length === 0 && <li className="italic">No published articles yet.</li>}
        </ul>
        <button 
          onClick={() => onSelectCategory(category.name)}
          className="mt-6 w-full bg-[#308271] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#45a08d] transition-colors self-end"
        >
          View All
        </button>
      </div>
    </div>
  );
};
