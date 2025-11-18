
import React, { useEffect, useState, useRef } from 'react';
import { Article } from '../types';
import { TableOfContents, Heading } from './TableOfContents';
import { parse } from 'marked';

interface ArticleDetailViewProps {
  article: Article;
  isEditMode: boolean;
  onEditArticle: (article: Article) => void;
  onBack: () => void;
}

const LoadingContent: React.FC = () => (
    <div className="space-y-8 animate-pulse">
        <div className="h-12 bg-[#215b69]/50 rounded-lg w-3/4"></div>
        <div className="h-6 bg-[#215b69]/50 rounded-lg w-1/2"></div>
        <div className="h-80 bg-[#215b69]/50 rounded-xl w-full"></div>
        <div className="space-y-4">
            <div className="h-6 bg-[#215b69]/50 rounded-lg w-full"></div>
            <div className="h-6 bg-[#215b69]/50 rounded-lg w-5/6"></div>
            <div className="h-6 bg-[#215b69]/50 rounded-lg w-full"></div>
        </div>
    </div>
);

// Throttles a function to prevent it from being called too frequently.
const throttle = (func: (...args: any[]) => void, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  isEditMode,
  onEditArticle,
  onBack,
}) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const parseMarkdown = () => {
      if (!article.body) {
        if (isMounted) {
            setHtmlContent('<p class="text-gray-400">This article has no content yet.</p>');
            setHeadings([]);
            setIsLoading(false);
        }
        return;
      }
      
      try {
        if (!isMounted) return;

        const rawHtml = parse(article.body) as string;
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, 'text/html');
        
        const newHeadings: Heading[] = [];
        const headingElements = doc.querySelectorAll('h2, h3');
        const slugCounts: { [key: string]: number } = {};

        headingElements.forEach((el, index) => {
            const text = el.textContent || '';
            const level = parseInt(el.tagName.substring(1), 10);
            
            let baseSlug = text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/&/g, '-and-')
                .replace(/[^\w-]+/g, '')
                .replace(/--+/g, '-');

            if (!baseSlug) {
              baseSlug = `heading-${index + 1}`;
            }
            
            if (slugCounts[baseSlug] === undefined) {
                slugCounts[baseSlug] = 0;
            } else {
                slugCounts[baseSlug]++;
                baseSlug = `${baseSlug}-${slugCounts[baseSlug]}`;
            }

            const id = baseSlug;
            
            el.setAttribute('id', id);
            newHeadings.push({ id, text, level });
        });

        const processedHtml = doc.body.innerHTML;
        
        setHtmlContent(processedHtml);
        setHeadings(newHeadings);

      } catch (err) {
        console.error("Error parsing markdown:", err);
        setError("Could not display article content.");
      } finally {
        if (isMounted) {
            setIsLoading(false);
        }
      }
    };

    parseMarkdown();
    window.scrollTo(0, 0);

    return () => {
        isMounted = false;
    };
  }, [article]);
  
  useEffect(() => {
    if (isLoading || headings.length === 0) return;

    const handleScroll = () => {
        // This offset should be slightly larger than the combined height of the sticky headers.
        const topOffset = 196; 
        let bestCandidate: { id: string | null; position: number } = { id: null, position: -Infinity };

        // Find the last heading that has scrolled past the top offset line.
        // We do this by finding the heading that is above the line, but closest to it (i.e., has the largest `rect.top`).
        for (const heading of headings) {
            const element = document.getElementById(heading.id);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top < topOffset && rect.top > bestCandidate.position) {
                    bestCandidate = { id: heading.id, position: rect.top };
                }
            }
        }
        
        let newActiveId = bestCandidate.id;

        // If no heading is above the offset line (e.g., at the very top of the page),
        // default to the first heading if it's visible on screen.
        if (!newActiveId && headings.length > 0) {
            const firstHeadingEl = document.getElementById(headings[0].id);
            if (firstHeadingEl && firstHeadingEl.getBoundingClientRect().top < window.innerHeight) {
                newActiveId = headings[0].id;
            }
        }

        setActiveHeadingId(newActiveId);
    };

    const throttledScrollHandler = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Run once on load to set the initial active heading
    handleScroll();

    return () => {
        window.removeEventListener('scroll', throttledScrollHandler);
    };
}, [headings, isLoading]);


  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-sm text-[#308271] hover:text-white font-semibold transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Back to articles
        </button>
        {isEditMode && (
          <button
            onClick={() => onEditArticle(article)}
            className="bg-[#308271] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#45a08d] transition-colors"
            aria-label={`Edit article: ${article.title}`}
          >
            Edit Article
          </button>
        )}
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-12">
        {/* TOC for larger screens (sidebar) */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-52">
            <TableOfContents headings={headings} activeHeadingId={activeHeadingId} />
          </div>
        </aside>

        <div className="lg:col-span-3">
          {isLoading ? <LoadingContent /> : (
            <article className="pb-[28rem]">
              <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                  {article.title}
                </h1>
                {article.author && article.subcategory && (
                  <p className="text-lg text-gray-400">
                    By <span className="font-semibold text-gray-300">{article.author}</span> in <span className="font-semibold text-gray-300">{article.subcategory}</span>
                  </p>
                )}
              </header>
              {article.imageUrl && (
                <div className="mb-8 rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src={article.imageUrl}
                    alt={article.alt}
                    className="w-full h-auto object-cover max-h-[500px]"
                  />
                </div>
              )}
              
              {/* TOC for smaller screens */}
              <div className="lg:hidden my-8">
                  {headings.length > 0 && (
                      <div className="bg-[#0f323e]/80 border border-white/10 rounded-xl p-6">
                          <TableOfContents headings={headings} activeHeadingId={activeHeadingId} />
                      </div>
                  )}
              </div>

              {error ? (
                  <div className="text-red-400 bg-red-900/20 p-4 rounded-lg">{error}</div>
              ) : (
                  <div
                    ref={contentRef}
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
              )}
            </article>
          )}
        </div>
      </div>
    </div>
  );
};
