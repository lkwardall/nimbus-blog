
import React from 'react';
import { SocialIcon } from './icons';

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} className="text-gray-400 hover:text-[#308271] transition-colors text-sm">{children}</a>
);

const FooterHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{children}</h3>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#010202] text-gray-300 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Learn */}
          <div className="space-y-4">
            <FooterHeader>Learn</FooterHeader>
            <div className="flex flex-col space-y-2">
              <FooterLink href="#">Weight Loss</FooterLink>
              <FooterLink href="#">Sexual Health</FooterLink>
              <FooterLink href="#">Hormone Therapy</FooterLink>
              <FooterLink href="#">Hair & Skin</FooterLink>
              <FooterLink href="#">Longevity</FooterLink>
            </div>
          </div>
          {/* Tools */}
          <div className="space-y-4">
            <FooterHeader>Tools</FooterHeader>
            <div className="flex flex-col space-y-2">
              <FooterLink href="#">BMI Calculator</FooterLink>
              <FooterLink href="#">TDEE Calculator</FooterLink>
              <FooterLink href="#">Calorie Deficit Calculator</FooterLink>
              <FooterLink href="#">Protein Calculator</FooterLink>
              <FooterLink href="#">Water Intake Calculator</FooterLink>
            </div>
          </div>
          {/* Popular */}
          <div className="space-y-4 col-span-2 sm:col-span-1">
            <FooterHeader>Popular Topics</FooterHeader>
            <div className="flex flex-col space-y-2">
                <FooterLink href="#">Testosterone</FooterLink>
                <FooterLink href="#">Peptides</FooterLink>
                <FooterLink href="#">GLP-1s</FooterLink>
                <FooterLink href="#">Diet & Nutrition</FooterLink>
                <FooterLink href="#">Mental Health</FooterLink>
            </div>
          </div>
          {/* Company */}
          <div className="space-y-4">
            <FooterHeader>Discover Wellness</FooterHeader>
            <div className="flex flex-col space-y-2">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">How It Works</FooterLink>
              <FooterLink href="#">Medical Experts</FooterLink>
              <FooterLink href="#">FAQs</FooterLink>
            </div>
          </div>
          {/* Careers */}
          <div className="space-y-4">
            <FooterHeader>Careers</FooterHeader>
            <div className="flex flex-col space-y-2">
              <FooterLink href="#">Professionals</FooterLink>
              <FooterLink href="#">Providers</FooterLink>
            </div>
          </div>
          {/* Connect */}
          <div className="space-y-4">
            <FooterHeader>Connect</FooterHeader>
            <div className="flex flex-col space-y-2">
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Press Center</FooterLink>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#215b69]/50 flex flex-col md:flex-row items-center justify-between">
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition"><SocialIcon name="facebook" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition"><SocialIcon name="twitter" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition"><SocialIcon name="instagram" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition"><SocialIcon name="tiktok" /></a>
          </div>
          <p className="text-gray-500 text-sm mt-6 md:mt-0">
            &copy; {new Date().getFullYear()} Discover Wellness. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
