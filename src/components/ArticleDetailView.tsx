import React, { useMemo, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Article } from "../types";
import { TableOfContents, Heading } from "./TableOfContents";
import { ArticleCard } from "./ArticleCard";

interface ArticleDetailViewProps {
  article: Article;
  isEditMode: boolean;
  onEditArticle: (article: Article) => void;
  onBack: () => void;
  relatedArticles?: Article[];
  onSelectArticle: (article: Article) => void;
}

// --- Ad Data Configuration ---
const AD_DATA = {
  WeightWise: {
    tag: "Metabolic Health",
    title: "WeightWise®: Biology, Not Willpower",
    text: "Stop the cycle of regain. Access personalized GLP-1 protocols (Semaglutide & Tirzepatide) combined with expert coaching.",
    button: "Check Eligibility",
    link: "https://nimbushealthcare.com/weightwise",
    image:
      "https://cdn.prod.website-files.com/6891c0aa1164f1d025c6c041/68df676fb1b51c4f89d0c6ee_Group%201000006445.webp",
    alt: "WeightWise metabolic health",
  },
  NimCore: {
    tag: "Hormone Optimization",
    title: "NimCore®: Restore Your Edge",
    text: "Reclaim your energy with physician-guided testosterone and hormone therapy tailored to your bloodwork.",
    button: "View Protocols",
    link: "https://nimbushealthcare.com/nimcore",
    image:
      "https://cdn.prod.website-files.com/6891c0aa1164f1d025c6c041/68ecd85b7d3e7aab636f529b_Mask%20group6.webp",
    alt: "NimCore men's health",
  },
  Nimbus: {
    tag: "Proactive Wellness",
    title: "Healthcare Designed for Longevity",
    text: "We optimize systems, not just symptoms. From hair regrowth to cellular renewal, discover the Nimbus ecosystem.",
    button: "Start Your Journey",
    link: "https://nimbushealthcare.com",
    image:
      "https://cdn.prod.website-files.com/6891c0aa1164f1d025c6c041/68a850e8115fc5e6e2a01f86_start.webp",
    alt: "Nimbus Healthcare",
  },
};

const AdCard: React.FC<{ type: keyof typeof AD_DATA }> = ({ type }) => {
  const ad = AD_DATA[type];
  return (
    <div className="article-ad-card">
      <div className="article-ad-image-wrapper">
        <img src={ad.image} alt={ad.alt} />
      </div>
      <div className="article-ad-content-wrapper">
        <div className="article-ad-text-content">
          <span className="article-ad-tag">{ad.tag}</span>
          <div className="article-ad-title">{ad.title}</div>
          <div className="article-ad-text">{ad.text}</div>
        </div>
        <a
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className="article-ad-button"
        >
          {ad.button}
        </a>
      </div>
    </div>
  );
};

// Utility to generate IDs for TOC matching
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

// Throttles a function to prevent it from being called too frequently.
const throttle = (func: (...args: any[]) => void, limit: number) => {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
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
  relatedArticles = [],
  onSelectArticle,
}) => {
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);

  // 1. Extract Headings for TOC
  const headings = useMemo<Heading[]>(() => {
    if (!article.body) return [];
    // Match both ## (H2) and ### (H3)
    const matches = [...article.body.matchAll(/^(#{2,3})\s+(.+)$/gm)];
    return matches.map((match, index) => {
      const text = match[2];
      let id = slugify(text);
      if (!id) id = `heading-${index}`; // Fallback for empty text

      return {
        id,
        text,
        level: match[1].length, // 2 or 3
      };
    });
  }, [article.body]);

  // 2. Split content into sections (by H2) to allow ad insertion
  const sections = useMemo(() => {
    if (!article.body) return [];
    // Splits the markdown by H2 headers, keeping the delimiter in the array so we don't lose the header itself
    return article.body.split(/(?=^##\s)/m);
  }, [article.body]);

  // 3. Determine Ad Strategy
  const adStrategy = useMemo(() => {
    const text = article.body || "";
    const plan: { index: number; type: keyof typeof AD_DATA }[] = [];

    let firstAdType: keyof typeof AD_DATA = "Nimbus";
    if (text.includes("WeightWise")) firstAdType = "WeightWise";
    else if (text.includes("NimCore") || text.includes("Testosterone"))
      firstAdType = "NimCore";

    // Insert first ad after the 2nd section (Index 1)
    if (sections.length > 1) plan.push({ index: 1, type: firstAdType });

    // Insert second ad after the 4th section (Index 3), always general Nimbus unless first was general
    if (sections.length > 3) plan.push({ index: 3, type: "Nimbus" });

    return plan;
  }, [article.body, sections.length]);

  // Scroll Spy for TOC
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const topOffset = 196;
      let bestCandidate: { id: string | null; position: number } = {
        id: null,
        position: -Infinity,
      };

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Find header that is above the offset line (scrolled past) but closest to it
          if (rect.top < topOffset && rect.top > bestCandidate.position) {
            bestCandidate = { id: heading.id, position: rect.top };
          }
        }
      }

      // Fallback to first heading if at top
      if (!bestCandidate.id && headings.length > 0) {
        const firstEl = document.getElementById(headings[0].id);
        if (
          firstEl &&
          firstEl.getBoundingClientRect().top < window.innerHeight
        ) {
          bestCandidate.id = headings[0].id;
        }
      }

      setActiveHeadingId(bestCandidate.id);
    };

    const throttledScrollHandler = throttle(handleScroll, 100);
    window.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", throttledScrollHandler);
  }, [headings]);

  if (!article.body)
    return <div className="text-gray-400">No content available.</div>;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-sm text-[#308271] hover:text-white font-semibold transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Back to articles
        </button>
        {isEditMode && (
          <button
            onClick={() => onEditArticle(article)}
            className="bg-[#308271] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#45a08d] transition-colors"
          >
            Edit Article
          </button>
        )}
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-12">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-32">
            <TableOfContents
              headings={headings}
              activeHeadingId={activeHeadingId}
            />
          </div>
        </aside>

        <div className="lg:col-span-3">
          <article className="pb-12">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                {article.title}
              </h1>
              {article.author && (
                <div className="text-lg text-gray-400 flex flex-col gap-1">
                  <p>
                    Written by{" "}
                    <span className="font-semibold text-gray-300">
                      {article.author}
                    </span>
                  </p>
                  {article.reviewedBy && (
                    <p>
                      Reviewed by{" "}
                      <span className="font-semibold text-gray-300">
                        {article.reviewedBy}
                      </span>
                    </p>
                  )}
                  {article.subcategory && (
                    <p>
                      in{" "}
                      <span className="font-semibold text-gray-300">
                        {article.subcategory}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </header>

            {/* Main Image */}
            {article.imageUrl && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={article.imageUrl}
                  alt={article.alt}
                  className="w-full h-auto object-cover max-h-[500px]"
                />
              </div>
            )}

            {/* Mobile TOC */}
            <div className="lg:hidden my-8">
              {headings.length > 0 && (
                <div className="bg-[#0f323e]/80 border border-white/10 rounded-xl p-6">
                  <TableOfContents
                    headings={headings}
                    activeHeadingId={activeHeadingId}
                  />
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className="article-content">
              {sections.map((section, index) => {
                const adToRender = adStrategy.find((p) => p.index === index);

                return (
                  <React.Fragment key={index}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Custom renderers to attach IDs for TOC
                        h2: ({ node, children, ...props }) => {
                          const text = String(children);
                          const id = slugify(text) || `heading-${index}`;
                          return (
                            <h2 id={id} {...props}>
                              {children}
                            </h2>
                          );
                        },
                        h3: ({ node, children, ...props }) => {
                          const text = String(children);
                          const id = slugify(text) || `heading-${index}-sub`;
                          return (
                            <h3 id={id} {...props}>
                              {children}
                            </h3>
                          );
                        },
                      }}
                    >
                      {section}
                    </ReactMarkdown>

                    {/* Inject Ad if needed */}
                    {adToRender && <AdCard type={adToRender.type} />}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Read Next */}
            {relatedArticles && relatedArticles.length > 0 && (
              <section className="mt-24 border-t border-[#215b69]/30 pt-12">
                <h2 className="text-3xl font-bold text-white mb-8">
                  Read Next
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedArticles.map((related) => (
                    <ArticleCard
                      key={related.id}
                      article={related}
                      isEditMode={false}
                      onEdit={() => {}}
                      onSelectArticle={onSelectArticle}
                      showDescription={false}
                    />
                  ))}
                </div>
              </section>
            )}
          </article>
        </div>
      </div>
    </div>
  );
};
