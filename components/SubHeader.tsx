import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Category } from '../types';

interface SubHeaderProps {
    category: Category;
    selectedSubcategoryName: string | null;
    onSelectSubcategory: (name: string | null) => void;
}

const ScrollButton: React.FC<{direction: 'left' | 'right', onClick: () => void, isVisible: boolean}> = ({ direction, onClick, isVisible }) => (
    <button
        onClick={onClick}
        className={`absolute ${direction === 'left' ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l'} from-black/50 via-black/50 to-transparent top-1/2 -translate-y-1/2 z-10 p-2 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label={direction === 'left' ? 'Scroll left' : 'Scroll right'}
    >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {direction === 'left' 
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            }
        </svg>
    </button>
);

export const SubHeader: React.FC<SubHeaderProps> = ({ category, selectedSubcategoryName, onSelectSubcategory }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScrollability = useCallback(() => {
        const el = scrollContainerRef.current;
        if (el) {
            const hasOverflow = el.scrollWidth > el.clientWidth;
            setCanScrollLeft(el.scrollLeft > 5);
            setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
        }
    }, []);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (el) {
            const handleWheel = (e: WheelEvent) => {
                if (el.scrollWidth > el.clientWidth) {
                    e.preventDefault();
                    el.scrollBy({ left: e.deltaY, behavior: 'auto' });
                }
            };
            
            checkScrollability();
            el.addEventListener('scroll', checkScrollability, { passive: true });
            window.addEventListener('resize', checkScrollability);
            el.addEventListener('wheel', handleWheel, { passive: false });

            return () => {
                el.removeEventListener('scroll', checkScrollability);
                window.removeEventListener('resize', checkScrollability);
                el.removeEventListener('wheel', handleWheel);
            };
        }
    }, [category, checkScrollability]);

    const scroll = (direction: 'left' | 'right') => {
        const el = scrollContainerRef.current;
        if (el) {
            const scrollAmount = el.clientWidth * 0.7;
            el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };
    
    // Don't render if there's only one subcategory with no articles, or none at all.
    if (category.subcategories.length === 0 || (category.subcategories.length === 1 && category.subcategories[0].articles.length === 0)) {
        return null;
    }

    return (
        <nav className="sticky top-[8.5rem] z-40 bg-black/50 backdrop-blur-md -mt-px">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="relative flex-grow overflow-hidden">
                    <div 
                        ref={scrollContainerRef}
                        className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto scrollbar-hide h-14"
                    >
                        <button
                            onClick={() => onSelectSubcategory(null)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                selectedSubcategoryName === null
                                ? 'bg-[#308271] text-white'
                                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80 hover:text-white'
                            }`}
                        >
                            All
                        </button>
                        {category.subcategories.map((subcategory) => (
                            <button
                            key={subcategory.name}
                            onClick={() => onSelectSubcategory(subcategory.name)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                selectedSubcategoryName === subcategory.name
                                ? 'bg-[#308271] text-white'
                                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80 hover:text-white'
                            }`}
                            >
                            {subcategory.name}
                            </button>
                        ))}
                    </div>
                    <ScrollButton direction="left" onClick={() => scroll('left')} isVisible={canScrollLeft} />
                    <ScrollButton direction="right" onClick={() => scroll('right')} isVisible={canScrollRight} />
                </div>
            </div>
             <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </nav>
    );
};