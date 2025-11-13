import React, { useRef, useEffect } from 'react';

export interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
  activeHeadingId: string | null;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ headings, activeHeadingId }) => {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!activeHeadingId || !listRef.current) return;

    const activeItem = listRef.current.querySelector(`li[data-id="${activeHeadingId}"]`);
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeHeadingId]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);

    // If element isn't found, gracefully exit to prevent crashing.
    if (!element) {
      console.warn(`TOC link clicked but element with id "${id}" was not found.`);
      return;
    }

    const headerOffset = 196; // As defined in index.html for h2/h3 scroll-margin-top
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    // Manually scroll to the calculated position
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // NOTE: Removed history.pushState and window.location.hash manipulation
    // to prevent potential security errors in sandboxed environments.
  };


  return (
    <nav aria-label="Table of contents">
        <h3 className="text-base font-semibold text-white uppercase tracking-wider mb-4">On this page</h3>
        {headings.length === 0 ? (
            <p className="text-base text-gray-400 italic">No sections in this article.</p>
        ) : (
            <ul ref={listRef} className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
                {headings.map(heading => (
                    <li key={heading.id} data-id={heading.id}>
                        <a 
                            href={`#${heading.id}`}
                            onClick={(e) => handleLinkClick(e, heading.id)}
                            className={`
                                block text-base transition-colors duration-200
                                ${heading.level === 3 ? 'pl-4' : ''}
                                ${activeHeadingId === heading.id 
                                    ? 'text-[#308271] font-semibold border-l-2 border-[#308271] pl-3' 
                                    : 'text-gray-400 hover:text-white border-l-2 border-transparent hover:border-gray-500 pl-3'}
                            `}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        )}
    </nav>
  );
};
