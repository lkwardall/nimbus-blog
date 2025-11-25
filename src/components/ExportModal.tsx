import React, { useState, useEffect } from "react";
import { Article, Category } from "../types";

interface ExportModalProps {
  onClose: () => void;
  data: Category[];
}

// --- Helper Functions for Content Generation ---

const toCamelCase = (str: string): string => {
  return str
    .replace(/\*\*/g, "")
    .replace(/"/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(" ")
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("")
    .slice(0, 50);
};

const sanitizeMarkdownForBody = (markdown: string | undefined): string => {
  if (!markdown) return "";
  let sanitized = markdown;
  sanitized = sanitized
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-");
  sanitized = sanitized.replace(/(^#{1,6}\s+)\*\*(.*?)\*\*/gm, "$1$2");
  sanitized = sanitized.replace(/(\[)\*\*(.*?)\*\*(\])/g, "$1$2$3");
  return sanitized;
};

const generateArticlesFileContent = (data: Category[]): string => {
  if (!data || data.length === 0) return "// No data available to export.";

  const uniqueArticles = new Map<number, Article>();
  data.forEach((cat) =>
    cat.subcategories.forEach((sub) =>
      sub.articles.forEach((art) => {
        if (!uniqueArticles.has(art.id)) uniqueArticles.set(art.id, art);
      })
    )
  );

  const articleIdToVarName = new Map<number, string>();
  const varNameToArticle = new Map<string, Article>();

  Array.from(uniqueArticles.values()).forEach((article) => {
    let varName = toCamelCase(article.title);
    let counter = 1;
    let originalVarName = varName;
    while (varNameToArticle.has(varName)) {
      varName = `${originalVarName}${counter++}`;
    }
    articleIdToVarName.set(article.id, varName);
    varNameToArticle.set(varName, article);
  });

  let allArticlesString = "const allArticles = {\n";
  const escBody = (str: string | undefined) =>
    (str || "")
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\${/g, "\\${");

  varNameToArticle.forEach((article, varName) => {
    const isDraft = new Date(article.publicationDate).getFullYear() === 2099;

    if (isDraft || !article.body) {
      const cleanedTitle = (article.title || "").replace(/"/g, "");
      allArticlesString += `  ${varName}: createUnpublishedArticle(${JSON.stringify(
        cleanedTitle
      )}, ${JSON.stringify(article.subcategory || "")}),\n`;
    } else {
      const sanitizedBody = sanitizeMarkdownForBody(article.body);
      const cleanedTitle = (article.title || "").replace(/\*\*/g, "");

      allArticlesString += `  ${varName}: createPublishedArticle(\n`;
      allArticlesString += `    ${JSON.stringify(cleanedTitle)},\n`;
      allArticlesString += `    ${JSON.stringify(
        article.subcategory || ""
      )},\n`;
      allArticlesString += `    {\n`;
      allArticlesString += `      date: '${
        new Date(article.publicationDate).toISOString().split("T")[0]
      }',\n`;
      allArticlesString += `      isFeatured: ${
        article.isFeatured ?? false
      },\n`;
      allArticlesString += `      author: ${JSON.stringify(
        article.author || ""
      )},\n`;
      if (article.reviewedBy) {
        allArticlesString += `      reviewedBy: ${JSON.stringify(
          article.reviewedBy
        )},\n`;
      }
      allArticlesString += `      description: ${JSON.stringify(
        article.description || ""
      )},\n`;
      allArticlesString += `      imageUrl: ${JSON.stringify(
        article.imageUrl || ""
      )},\n`;
      allArticlesString += `      alt: ${JSON.stringify(article.alt || "")},\n`;
      allArticlesString += `      body: \`${escBody(sanitizedBody)}\`\n`;
      allArticlesString += `    }\n`;
      allArticlesString += `  ),\n`;
    }
  });
  allArticlesString += "};\n";

  const blogDataString = `export const blogData: Category[] = ${JSON.stringify(
    data.map((cat) => ({
      ...cat,
      imageUrl: cat.imageUrl?.startsWith("data:image")
        ? undefined
        : cat.imageUrl,
      alt: cat.imageUrl?.startsWith("data:image") ? undefined : cat.alt,
      subcategories: cat.subcategories.map((sub) => ({
        ...sub,
        articles: sub.articles.map(
          (art) => `%%${articleIdToVarName.get(art.id)}%%`
        ),
      })),
    })),
    null,
    2
  ).replace(/"%%(.*?)%%"/g, "allArticles.$1")};`;

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
  reviewedBy?: string;
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
    reviewedBy: options.reviewedBy,
    description: options.description || \`An in-depth look at "\${cleanTitle}". Key insights and research from Discover Wellness.\`,
    link: '#',
    body: articleBody,
  };
};

const createUnpublishedArticle = (title: string, subcategory: string): Article => {
  const cleanTitle = title.replace(/"/g, '');
  return {
    id: idCounter++,
    title: cleanTitle,
    publicationDate: new Date('2099-12-31T23:59:59Z').toISOString(), // Far future date for drafts
    subcategory,
  };
};


// --- Central Article Repository ---
// This content is generated from your edits. Copy and paste it into data/articles.ts
`;

  return `${staticHeader}\n${allArticlesString}\n\n${blogDataString}\n`;
};

// --- System File Content Generators ---

const SYSTEM_FILES = {
  "README.md": `# Discover Wellness Blog

A modern, React-based blog application built with Vite, React 19, and Tailwind CSS v4.

## Getting Started

1.  **Install Dependencies:**
    \`\`\`bash
    pnpm install
    \`\`\`

2.  **Run Development Server:**
    \`\`\`bash
    pnpm dev
    \`\`\`

3.  **Build for Production:**
    \`\`\`bash
    pnpm build
    \`\`\`
`,

  "package.json": JSON.stringify(
    {
      name: "discover-wellness",
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview",
      },
      dependencies: {
        marked: "13.0.1",
        react: "^19.2.0",
        "react-dom": "^19.2.0",
        "react-router-dom": "^7.1.5",
        "react-markdown": "^9.0.3",
        "remark-gfm": "^4.0.0",
      },
      devDependencies: {
        "@tailwindcss/vite": "^4.0.0",
        "@types/node": "^22.10.0",
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        "@vitejs/plugin-react": "^4.3.4",
        tailwindcss: "^4.0.0",
        typescript: "~5.7.2",
        vite: "^6.0.0",
      },
    },
    null,
    2
  ),

  "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Discover Wellness</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>`,

  "tsconfig.json": JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        useDefineForClassFields: true,
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        baseUrl: ".",
        paths: {
          "@/*": ["./src/*"],
        },
      },
      include: ["src"],
      exclude: ["node_modules"],
    },
    null,
    2
  ),

  "vite.config.ts": `import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});`,

  "src/index.css": `@import "tailwindcss";

@theme {
  --color-primary: #308271;
  --color-primary-hover: #45a08d;
  --color-bg-dark: #0f323e;
}

/* Article Content Typography */
.article-content h1 {
  @apply text-4xl font-extrabold text-white mb-6;
}
/* ... (paste the rest of your index.css content here if you want it exported) ... */
`,
};

export const ExportModal: React.FC<ExportModalProps> = ({ onClose, data }) => {
  const [activeTab, setActiveTab] = useState<"content" | "system">("content");
  const [selectedSystemFile, setSelectedSystemFile] =
    useState<keyof typeof SYSTEM_FILES>("package.json");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy to Clipboard");

  useEffect(() => {
    if (activeTab === "content") {
      setGeneratedCode(generateArticlesFileContent(data));
    } else {
      setGeneratedCode(SYSTEM_FILES[selectedSystemFile]);
    }
  }, [onClose, data, activeTab, selectedSystemFile]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopyButtonText("Copied!");
      setTimeout(() => setCopyButtonText("Copy to Clipboard"), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setCopyButtonText("Copy Failed");
      setTimeout(() => setCopyButtonText("Copy to Clipboard"), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-75"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-[#0f323e] border border-gray-700 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 pb-0 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Project Source</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 mt-6 border-b border-gray-700 flex space-x-6">
          <button
            onClick={() => setActiveTab("content")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "content"
                ? "text-[#308271] border-b-2 border-[#308271]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Content Data (data/articles.ts)
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "system"
                ? "text-[#308271] border-b-2 border-[#308271]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            System Files (Scaffold)
          </button>
        </div>

        <div className="p-6 flex-grow overflow-hidden flex flex-col">
          {activeTab === "content" && (
            <div className="bg-[#0a2129] p-4 rounded-md mb-4 flex-shrink-0">
              <p className="text-sm text-gray-300">
                To save your article edits permanently, copy this code and
                replace the contents of{" "}
                <code className="bg-black/50 px-1 py-0.5 rounded">
                  data/articles.ts
                </code>
                .
              </p>
            </div>
          )}

          {activeTab === "system" && (
            <div className="mb-4 flex-shrink-0">
              <p className="text-sm text-gray-300 mb-4">
                These files are required to run this app outside of this
                environment (e.g. on GitHub or CodeSandbox). Create these files
                in the root of your project folder.
              </p>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {(
                  Object.keys(SYSTEM_FILES) as Array<keyof typeof SYSTEM_FILES>
                ).map((fileName) => (
                  <button
                    key={fileName}
                    onClick={() => setSelectedSystemFile(fileName)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                      selectedSystemFile === fileName
                        ? "bg-[#308271] text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {fileName}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-grow relative overflow-auto bg-[#010202] rounded-md border border-gray-700">
            <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded opacity-70">
              {activeTab === "content"
                ? "data/articles.ts"
                : selectedSystemFile}
            </div>
            <pre className="p-4">
              <code className="text-sm text-white whitespace-pre-wrap font-mono">
                {generatedCode}
              </code>
            </pre>
          </div>
        </div>

        <div className="p-6 pt-0 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-[#308271] text-white rounded-md font-semibold hover:bg-[#45a08d] transition-colors w-40"
          >
            {copyButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};
