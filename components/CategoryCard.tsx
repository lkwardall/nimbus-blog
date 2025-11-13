import React, { useState } from 'react';
import { Category } from '../types';
import { GoogleGenAI } from "@google/genai";

interface CategoryCardProps {
  category: Category;
  isEditMode: boolean;
  onSelectCategory: (name: string) => void;
  onUpdateCategory: (name: string, data: Partial<Category>) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="absolute inset-0 bg-black/60 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
    </div>
);

const isArticlePublished = (publicationDate: string) => new Date(publicationDate) <= new Date();

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, isEditMode, onSelectCategory, onUpdateCategory }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const articlesToShow = category.subcategories
    .flatMap(sub => sub.articles.filter(a => isArticlePublished(a.publicationDate)))
    .slice(0, 3);

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    setError(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A professional, visually appealing blog category image representing: ${category.name}. Abstract, clean, modern, wellness theme.`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        const altText = `AI-generated decorative image for the ${category.name} category`;
        
        onUpdateCategory(category.name, { imageUrl, alt: altText });
    } catch (err) {
        setError('Failed to generate image.');
        console.error(err);
    } finally {
        setIsGenerating(false);
    }
  };

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
      
      {isGenerating && <LoadingSpinner />}

      {isEditMode && (
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={handleGenerateImage}
            disabled={isGenerating}
            className="bg-[#0f323e] text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-[#215b69] disabled:bg-gray-500 transition-colors border border-gray-600"
            aria-label={`Generate image for ${category.name} category`}
          >
            {category.imageUrl ? 'Regenerate Image' : 'Generate Image'}
          </button>
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
      )}
    </div>
  );
};