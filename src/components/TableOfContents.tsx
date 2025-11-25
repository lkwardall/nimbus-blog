
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

    const container = listRef.current;
    const activeItem = container.querySelector(`li[data-id="${activeHeadingId}"]`) as HTMLElement;

    if (activeItem) {
      // Manual scroll logic to replace scrollIntoView
      // This ensures we only scroll the container, not the whole window
      const itemTop = activeItem.offsetTop;
      const itemBottom = itemTop + activeItem.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      // If the item is above the visible area, scroll up
      if (itemTop < containerTop) {
        container.scrollTop = itemTop;
      } 
      // If the item is below the visible area, scroll down
      else if (itemBottom > containerBottom) {
        container.scrollTop = itemBottom - container.clientHeight;
      }
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
  };


  return (
    <nav aria-label="Table of contents">
        <h3 className="text-base font-semibold text-white uppercase tracking-wider mb-4">On this page</h3>
        {headings.length === 0 ? (
            <p className="text-base text-gray-400 italic">No sections in this article.</p>
        ) : (
            <ul ref={listRef} className="relative space-y-3 max-h-96 lg:max-h-[calc(100vh-21rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
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
