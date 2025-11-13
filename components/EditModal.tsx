import React, { useState, useEffect } from 'react';
import { Article, Category } from '../types';
import { GoogleGenAI } from "@google/genai";

interface EditModalProps {
  article: Partial<Article>;
  allCategories: Category[];
  onSave: (articleData: Partial<Article>, placements: { categoryName: string, subcategoryName: string }[]) => void;
  onClose: () => void;
}

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; name: string, type?: string }> = ({ label, value, onChange, name, type = 'text' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
    <div className="mt-1">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="block w-full bg-[#0a2129] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#308271] focus:border-[#308271] sm:text-sm"
      />
    </div>
  </div>
);

const TextAreaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; name: string, rows?: number }> = ({ label, value, onChange, name, rows = 3 }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="mt-1">
        <textarea
          rows={rows}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="block w-full bg-[#0a2129] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#308271] focus:border-[#308271] sm:text-sm"
        />
      </div>
    </div>
);


const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#308271]"></div>
    </div>
);

// Helper to convert ISO date string to a format suitable for datetime-local input
const toDateTimeLocal = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // Adjust for timezone offset
    const tzoffset = date.getTimezoneOffset() * 60000;
    try {
        const localISOTime = new Date(date.getTime() - tzoffset).toISOString().slice(0, 16);
        return localISOTime;
    } catch (e) {
        // Handle invalid date strings gracefully
        return '';
    }
};

export const EditModal: React.FC<EditModalProps> = ({ article, allCategories, onSave, onClose }) => {
  const [editedArticle, setEditedArticle] = useState<Partial<Article>>(article);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlacements, setSelectedPlacements] = useState<Map<string, boolean>>(new Map());

  const isCreating = !article.id;

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (article.id) {
        const placements = new Map<string, boolean>();
        allCategories.forEach(cat => {
            cat.subcategories.forEach(sub => {
                if (sub.articles.some(art => art.id === article.id)) {
                    placements.set(`${cat.name}|${sub.name}`, true);
                }
            });
        });
        setSelectedPlacements(placements);
    }
  }, [article, allCategories]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'publicationDate') {
        setEditedArticle({ ...editedArticle, publicationDate: new Date(value).toISOString() });
    } else {
        setEditedArticle({ ...editedArticle, [name]: value });
    }
  };
  
  const handlePlacementChange = (categoryName: string, subcategoryName: string) => {
    const key = `${categoryName}|${subcategoryName}`;
    const newPlacements = new Map(selectedPlacements);
    newPlacements.set(key, !newPlacements.get(key));
    setSelectedPlacements(newPlacements);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError("File is too large. Please upload an image under 2MB.");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        setEditedArticle({
            ...editedArticle,
            imageUrl: reader.result as string,
            alt: `User uploaded image: ${file.name}`
        });
        setError(null);
    };
    reader.onerror = () => {
        setError("Failed to read the uploaded image.");
        console.error("FileReader error:", reader.error);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateImage = async () => {
    if (!prompt) {
        setError('Please enter a prompt to generate an image.');
        return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: `A visually appealing, professional blog image for an article about wellness. Prompt: ${prompt}`,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9',
          },
      });

      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

      setEditedArticle({
          ...editedArticle,
          imageUrl,
          alt: `AI generated image: ${prompt}`
      });

    } catch (err) {
        setError('Failed to generate image. Please check your API key and try again.');
        console.error(err);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSave = () => {
    const placements = Array.from(selectedPlacements.entries())
        .filter(([, isSelected]) => isSelected)
        .map(([key]) => {
            const [categoryName, subcategoryName] = key.split('|');
            return { categoryName, subcategoryName };
        });
    onSave(editedArticle, placements);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-75" aria-modal="true" role="dialog">
      <div className="bg-[#0f323e] border border-gray-700 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">{isCreating ? 'Create New Article' : 'Edit Article'}</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Title" name="title" value={editedArticle.title || ''} onChange={handleChange} />
            <InputField label="Author" name="author" value={editedArticle.author || ''} onChange={handleChange} />
          </div>
          <InputField 
            label="Publication Date" 
            name="publicationDate" 
            type="datetime-local" 
            value={toDateTimeLocal(editedArticle.publicationDate || '')} 
            onChange={handleChange}
          />
          <TextAreaField label="Description" name="description" value={editedArticle.description || ''} onChange={handleChange} />
          
          <TextAreaField 
            label="Article Body (Markdown Supported)" 
            name="body" 
            value={editedArticle.body || ''} 
            onChange={handleChange} 
            rows={10}
          />
          <p className="text-xs text-gray-400">Use `## Heading` and `### Subheading` to create sections for the Table of Contents.</p>
          
          <div className="mt-6 p-4 bg-[#0a2129] rounded-lg">
            <h3 className="text-lg font-medium text-white mb-2">Categories & Subcategories</h3>
            <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
              {allCategories.map(cat => (
                <div key={cat.name}>
                  <h4 className="font-semibold text-gray-200 text-md sticky top-0 bg-[#0a2129] py-1">{cat.name}</h4>
                  <div className="pl-4 mt-1 space-y-1">
                    {cat.subcategories.map(sub => (
                      <label key={sub.name} className="flex items-center space-x-3 cursor-pointer text-gray-300 hover:text-white">
                        <input
                          type="checkbox"
                          checked={!!selectedPlacements.get(`${cat.name}|${sub.name}`)}
                          onChange={() => handlePlacementChange(cat.name, sub.name)}
                          className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-[#308271] focus:ring-[#308271] focus:ring-offset-0"
                        />
                        <span>{sub.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-white mb-2">Article Image</h3>
            {editedArticle.imageUrl && <img src={editedArticle.imageUrl} alt={editedArticle.alt} className="rounded-lg w-full object-cover max-h-64 mb-4" />}
            <InputField label="Image Alt Text (for SEO)" name="alt" value={editedArticle.alt || ''} onChange={handleChange} />
          </div>

          <div className="mt-6 p-4 bg-[#0a2129] rounded-lg">
             <h3 className="text-lg font-medium text-white mb-2">Update Image</h3>
             <div className="grid md:grid-cols-2 gap-4 items-center">
                <div className="flex flex-col items-center justify-center">
                    <input type="file" id="imageUpload" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                    <label htmlFor="imageUpload" className="w-full text-center px-4 py-2 bg-[#215b69] text-white rounded-md font-semibold hover:bg-[#308271] disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors cursor-pointer">
                        Upload Image
                    </label>
                    <p className="text-xs text-gray-400 mt-2">Max file size: 2MB</p>
                </div>
                 <div className="flex flex-col">
                     <p className="text-sm text-gray-400 mb-2 text-center md:text-left">Or generate a new one with AI:</p>
                     <div className="flex gap-2">
                        <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A person meditating at sunrise" className="flex-grow bg-[#0f323e] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#308271] focus:border-[#308271] sm:text-sm" />
                        <button onClick={handleGenerateImage} disabled={isGenerating} className="px-4 py-2 bg-[#308271] text-white rounded-md font-semibold hover:bg-[#45a08d] disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
                            {isGenerating ? '...' : 'Go'}
                        </button>
                     </div>
                 </div>
             </div>
             {isGenerating && <div className="mt-4"><LoadingSpinner/></div>}
             {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-[#308271] text-white rounded-md font-semibold hover:bg-[#45a08d] transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
};