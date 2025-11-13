import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Category } from '../types';

interface HeaderProps {
    onGoHome: () => void;
    categories: Category[];
    selectedCategoryName: string | null;
    onSelectCategory: (name: string) => void;
}

const NimbusLogo: React.FC = () => (
    <svg className="h-6 w-auto" viewBox="0 0 132 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="22" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" fontSize="24" fontWeight="bold" fill="white">Nimbus</text>
    </svg>
);

const MenuIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ScrollButton: React.FC<{direction: 'left' | 'right', onClick: () => void, isVisible: boolean}> = ({ direction, onClick, isVisible }) => (
    <button
        onClick={onClick}
        className={`absolute ${direction === 'left' ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l'} from-black via-black to-transparent top-1/2 -translate-y-1/2 z-10 p-2 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
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


export const Header: React.FC<HeaderProps> = ({ onGoHome, categories, selectedCategoryName, onSelectCategory }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    
    const mainNavLinks = ['Weight', 'Hormone', 'Hair', 'Blog', 'About', 'Made by Us'];

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
    }, [categories, checkScrollability]);

    const scroll = (direction: 'left' | 'right') => {
        const el = scrollContainerRef.current;
        if (el) {
            const scrollAmount = el.clientWidth * 0.7;
            el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <header className="sticky top-0 z-50">
            {/* Main Navigation Bar - Opaque Background */}
            <div className="bg-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex-shrink-0">
                            <a href="#" className="flex items-center" aria-label="Nimbus Home">
                                <NimbusLogo />
                            </a>
                        </div>

                        <nav className="hidden lg:flex flex-grow justify-center items-center space-x-8">
                            {mainNavLinks.map(link => (
                                <a 
                                    key={link} 
                                    href="#" 
                                    onClick={link === 'Blog' ? (e) => { e.preventDefault(); onGoHome(); } : undefined} 
                                    className="text-sm font-medium text-white hover:text-gray-300 transition-colors uppercase tracking-wider"
                                >
                                    {link}
                                </a>
                            ))}
                        </nav>

                        <div className="hidden lg:flex items-center space-x-4">
                            <a href="#" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">Login</a>
                            <a href="#" className="bg-white text-black text-sm font-bold px-5 py-2.5 rounded-full hover:bg-gray-200 transition-colors">Get Started</a>
                        </div>
                        
                        <div className="lg:hidden">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white" aria-label="Open main menu">
                               {isMobileMenuOpen ? <CloseIcon className="h-6 w-6"/> : <MenuIcon className="h-6 w-6"/>}
                            </button>
                        </div>
                    </div>
                </div>
                 {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-800">
                        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col space-y-4">
                            {mainNavLinks.map(link => (
                                 <a 
                                    key={link} 
                                    href="#" 
                                    onClick={(e) => {
                                        if(link === 'Blog') {
                                            e.preventDefault();
                                            onGoHome();
                                        }
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="text-base font-medium text-white hover:text-gray-300"
                                >
                                    {link}
                                </a>
                            ))}
                             <div className="border-t border-gray-800 pt-4 flex flex-col space-y-4 items-start">
                                <a href="#" className="text-base font-medium text-white hover:text-gray-300">Login</a>
                                <a href="#" className="bg-white text-black text-sm font-bold px-5 py-2.5 rounded-full hover:bg-gray-200 transition-colors">Get Started</a>
                            </div>
                        </nav>
                    </div>
                )}
            </div>

            {/* Category Navigation - Semi-transparent Background */}
            <div className="bg-black/50 backdrop-blur-md">
                <div className="border-t border-gray-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
                        <h2 onClick={(e) => { e.preventDefault(); onGoHome(); }} className="text-xl font-bold text-white cursor-pointer whitespace-nowrap pr-6">
                            Discover <span className="text-[#308271]">Wellness</span>
                        </h2>
                        <div className="relative flex-grow overflow-hidden">
                            <div 
                                ref={scrollContainerRef}
                                className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto scrollbar-hide"
                            >
                                {categories.map((category) => (
                                    <button
                                    key={category.name}
                                    onClick={() => onSelectCategory(category.name)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                        selectedCategoryName === category.name
                                        ? 'bg-[#308271] text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                    >
                                    {category.name}
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
                </div>
            </div>
        </header>
    );
};