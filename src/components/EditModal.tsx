
import React, { useState, useEffect } from 'react';
import { Article, Category } from '../types';

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


// Helper to convert ISO date string to a format suitable for datetime-local input
const toDateTimeLocal = (isoString?: string | null): string => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        // Check for an invalid date
        if (isNaN(date.getTime())) {
            return '';
        }
        // Adjust for timezone offset
        const tzoffset = date.getTimezoneOffset() * 60000;
        const localISOTime = new Date(date.getTime() - tzoffset).toISOString().slice(0, 16);
        return localISOTime;
    } catch (e) {
        // This catch is a fallback, but isNaN should handle most cases.
        return '';
    }
};

export const EditModal: React.FC<EditModalProps> = ({ article, allCategories, onSave, onClose }) => {
  const [editedArticle, setEditedArticle] = useState<Partial<Article>>(article);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
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

  const handleUseImageUrl = () => {
    if (!imageUrlInput) {
        setError('Please enter an image URL.');
        return;
    }

    try {
        new URL(imageUrlInput);
    } catch (_) {
        setError('Please enter a valid URL.');
        return;
    }
    
    setEditedArticle({
        ...editedArticle,
        imageUrl: imageUrlInput,
        alt: `Image from external URL: ${imageUrlInput}`
    });
    setError(null);
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
      <div className="bg-[#0f323e] border border-gray-700 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center shrink-0">
            <h2 className="text-2xl font-bold text-white">{isCreating ? 'Create New Article' : 'Edit Article'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        
        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto">
            <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Title" name="title" value={editedArticle.title || ''} onChange={handleChange} />
                <InputField label="Written By" name="author" value={editedArticle.author || ''} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <InputField label="Reviewed By (Optional)" name="reviewedBy" value={editedArticle.reviewedBy || ''} onChange={handleChange} />
                 <InputField 
                    label="Publication Date" 
                    name="publicationDate" 
                    type="datetime-local" 
                    value={toDateTimeLocal(editedArticle.publicationDate)} 
                    onChange={handleChange}
                />
            </div>
            
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

            <div className="mt-6 p-4 bg-[#0a2129] rounded-lg space-y-4">
                <h3 className="text-lg font-medium text-white">Update Image</h3>
                
                {/* Option 2: Use URL */}
                <div>
                    <label htmlFor="imageUrlInput" className="block text-sm font-medium text-gray-300 mb-1">Use image from a URL</label>
                    <div className="flex gap-2">
                        <input 
                            type="url" 
                            id="imageUrlInput"
                            value={imageUrlInput} 
                            onChange={(e) => setImageUrlInput(e.target.value)} 
                            placeholder="https://example.com/image.jpg" 
                            className="flex-grow bg-[#0f323e] border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#308271] focus:border-[#308271] sm:text-sm" 
                        />
                        <button onClick={handleUseImageUrl} className="px-4 py-2 bg-[#215b69] text-white rounded-md font-semibold hover:bg-[#308271] transition-colors">
                            Use URL
                        </button>
                    </div>
                </div>
                
                {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
            </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end space-x-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-[#308271] text-white rounded-md font-semibold hover:bg-[#45a08d] transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
};
