
import React, { useState, useEffect } from 'react';
import { Article, Category } from '../types';

const LOCAL_STORAGE_KEY = 'discoverWellnessBlogData';

const toCamelCase = (str: string): string => {
  return str
    .replace(/\*\*/g, '') // Remove markdown bold
    .replace(/"/g, '') // Remove quotes
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .split(' ')
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('')
    .slice(0, 50); // Truncate to prevent excessively long names
};

const generateArticlesFileContent = (): string => {
  const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!storedDataString) {
    return "// No data found in local storage. Make some edits first!";
  }

  const data: Category[] = JSON.parse(storedDataString);
  
  // --- Step 1: Extract unique articles and create mappings ---
  const uniqueArticles = new Map<number, Article>();
  data.forEach(cat => cat.subcategories.forEach(sub => sub.articles.forEach(art => {
    if (!uniqueArticles.has(art.id)) {
      uniqueArticles.set(art.id, art);
    }
  })));

  const articleIdToVarName = new Map<number, string>();
  const varNameToArticle = new Map<string, Article>();

  Array.from(uniqueArticles.values()).forEach(article => {
    let varName = toCamelCase(article.title);
    // Ensure varName is unique
    let counter = 1;
    let originalVarName = varName;
    while(varNameToArticle.has(varName)) {
        varName = `${originalVarName}${counter++}`;
    }
    articleIdToVarName.set(article.id, varName);
    varNameToArticle.set(varName, article);
  });
  
  // --- Step 2: Generate the `allArticles` object string ---
  let allArticlesString = 'const allArticles = {\n';
  varNameToArticle.forEach((article, varName) => {
    const isDraft = new Date(article.publicationDate).getFullYear() === 2099;
    
    // Helper to escape strings for code generation
    const esc = (str: string | undefined) => (str || '').replace(/'/g, "\\'").replace(/\n/g, '\\n');
    const escBody = (str: string | undefined) => (str || '').replace(/`/g, '\\`').replace(/\$/g, '\\$');


    if (isDraft || !article.body) {
      allArticlesString += `  ${varName}: createUnpublishedArticle("${esc(article.title)}", "${esc(article.subcategory)}"),\n`;
    } else {
      allArticlesString += `  ${varName}: createPublishedArticle(\n`;
      allArticlesString += `    '${esc(article.title)}',\n`;
      allArticlesString += `    '${esc(article.subcategory)}',\n`;
      allArticlesString += `    {\n`;
      allArticlesString += `      date: '${new Date(article.publicationDate).toISOString().split('T')[0]}',\n`;
      allArticlesString += `      isFeatured: ${article.isFeatured ?? false},\n`;
      allArticlesString += `      author: '${esc(article.author)}',\n`;
      allArticlesString += `      description: '${esc(article.description)}',\n`;
      allArticlesString += `      imageUrl: '${esc(article.imageUrl)}',\n`;
      allArticlesString += `      alt: '${esc(article.alt)}',\n`;
      allArticlesString += `      body: \`${escBody(article.body)}\`\n`;
      allArticlesString += `    }\n`;
      allArticlesString += `  ),\n`;
    }
  });
  allArticlesString += '};\n';

  // --- Step 3: Generate the `blogData` array string ---
  const blogDataString = `export const blogData: Category[] = ${JSON.stringify(
    data.map(cat => ({
      ...cat,
      subcategories: cat.subcategories.map(sub => ({
        ...sub,
        articles: sub.articles.map(art => `%%${articleIdToVarName.get(art.id)}%%`) // Placeholder
      }))
    })),
    null,
    2
  ).replace(/"%%(.*?)%%"/g, 'allArticles.$1')};`; // Replace placeholder with variable reference


  // --- Step 4: Assemble the final file content ---
  const staticHeader = `
import { Category, Article } from '@/types';

let idCounter = 1;

const createArticleBody = () => {
  return \`
Discover Wellness is your trusted partner in the journey towards a healthier, more vibrant life. We believe in a proactive, evidence-based approach to wellness, combining cutting-edge science with holistic lifestyle strategies.

## Our Philosophy on Modern Health

In today's fast-paced world, achieving optimal health requires more than just reacting to illness. It demands a personalized and preventative strategy. We focus on key pillars of longevity and well-being.

### Hormone Optimization
Hormones are the chemical messengers that regulate everything from your mood and metabolism to your energy levels. We delve into the science of hormone therapy, providing clear, unbiased information on treatments like TRT for men and bioidentical hormone replacement for women. Our goal is to demystify these powerful therapies and help you understand if they're right for you.

### Lifestyle as Medicine
What you eat, how you move, and the quality of your sleep are the foundations of good health. Our articles break down complex nutritional science into actionable advice, offer workout strategies that fit your life, and explore techniques to improve your rest and recovery.

*   **Nutrition:** Guidance on whole foods, understanding macronutrients, and the truth about popular diets.
*   **Exercise:** From strength training to cardiovascular health, we cover it all.
*   **Recovery:** The critical role of sleep, stress management, and active recovery.

## The Role of Technology

We are at the forefront of the wellness technology revolution. From advanced diagnostics and wearables to the potential of AI in healthcare, we explore how innovation can empower you to take control of your health. We provide critical analysis of new technologies, helping you separate the hype from what's truly effective.

### Peptides and Advanced Supplements
The world of supplements can be confusing. We provide in-depth guides on powerful molecules like NAD⁺, Glutathione, and therapeutic peptides like BPC-157. Our content is written by experts to ensure you receive safe, effective, and evidence-based recommendations.

> **Disclaimer:** The information on this website is for informational purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional before making any decisions about your health or treatment.

Join us at Discover Wellness as we explore the future of health and empower you to live your best life, for longer.
  \`;
};

interface ArticleOptions {
  date: string;
  isFeatured?: boolean;
  body?: string;
  author?: string;
  description?: string;
  imageUrl?: string;
  alt?: string;
}

const createPublishedArticle = (title: string, subcategory: string, options: ArticleOptions): Article => {
  const cleanTitle = title.replace(/\\*\\*/g, '');
  const articleBody = options.body || createArticleBody(); 
  return {
    id: idCounter++,
    title: cleanTitle,
    publicationDate: new Date(options.date).toISOString(),
    isFeatured: options.isFeatured ?? false,
    subcategory,
    imageUrl: options.imageUrl || \`https://source.unsplash.com/random/800x600?sig=\${idCounter}&query=health,wellness,science\`,
    alt: options.alt || \`An image related to the article: \${cleanTitle}\`,
    author: options.author || 'Wellness Expert',
    description: options.description || \`An in-depth look at "\${cleanTitle}". Key insights and research from Discover Wellness.\`,
    link: '#',
    body: articleBody,
  };
};

const createUnpublishedArticle = (title: string, subcategory: string): Article => ({
  id: idCounter++,
  title: title.replace(/"/g, ''),
  publicationDate: new Date('2099-12-31T23:59:59Z').toISOString(), // Far future date for drafts
  subcategory,
});

// --- Central Article Repository ---
// This content is generated from your edits. Copy and paste it into data/articles.ts
`;

  return `${staticHeader}\n${allArticlesString}\n\n${blogDataString}\n`;
};


export const ExportModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [generatedCode, setGeneratedCode] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');

  useEffect(() => {
    setGeneratedCode(generateArticlesFileContent());
    
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyButtonText('Copy Failed');
      setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-75" aria-modal="true" role="dialog">
      <div className="bg-[#0f323e] border border-gray-700 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Export Data</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="bg-[#0a2129] p-4 rounded-md mb-4">
            <p className="text-sm text-gray-300">
                Your edits have been exported into the code format below. To make your changes permanent, copy this code and replace the entire content of the <code className="bg-black/50 px-1 py-0.5 rounded">data/articles.ts</code> file in your project.
            </p>
        </div>
        <div className="flex-grow overflow-hidden relative">
            <pre className="h-full overflow-auto bg-[#010202] rounded-md p-4">
                <code className="text-sm text-white whitespace-pre-wrap font-mono">
                    {generatedCode}
                </code>
            </pre>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">Close</button>
          <button onClick={handleCopy} className="px-4 py-2 bg-[#308271] text-white rounded-md font-semibold hover:bg-[#45a08d] transition-colors w-40">
            {copyButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};
