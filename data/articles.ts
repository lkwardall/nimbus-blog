import { Category } from '../types';

let idCounter = 1;

const createArticleBody = () => {
  return `
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
  `;
};


const createPublishedArticle = (title: string, subcategory: string, body: string = '') => {
  const cleanTitle = title.replace(/\*\*/g, '');
  // Provide a default body if one isn't passed, but allow override for specific articles.
  const articleBody = body || createArticleBody(); 
  return {
    id: idCounter++,
    title: cleanTitle,
    published: true,
    subcategory,
    imageUrl: `https://source.unsplash.com/random/800x600?sig=${idCounter}&query=health,wellness,science`,
    alt: `An image related to the article: ${cleanTitle}`,
    author: 'Wellness Expert',
    description: `An in-depth look at "${cleanTitle}". Key insights and research from Discover Wellness.`,
    link: '#',
    body: articleBody,
  };
};

const createUnpublishedArticle = (title: string, subcategory: string) => ({
  id: idCounter++,
  title: title.replace(/"/g, ''),
  published: false,
  subcategory,
});

export const blogData: Category[] = [
  {
    name: 'Hair & Skin',
    subcategories: [
      { name: 'Hair Loss', articles: [createUnpublishedArticle('Can Hair Loss Pills Cause ED?', 'Hair Loss')] },
      { name: 'Skin Conditions', articles: [] },
    ],
  },
  {
    name: 'Hormone Therapy',
    subcategories: [
      {
        name: "Men's Hormone Health",
        articles: [
          createPublishedArticle('**The Testosterone Decline: Why Modern Men Need Hormone Optimization More Than Ever**', "Men's Hormone Health"),
          createPublishedArticle('**Peptides: The Secret Weapon in Men’s Health & Longevity**', "Men's Hormone Health"),
          createUnpublishedArticle('TRT and Depression?', "Men's Hormone Health"),
          createUnpublishedArticle('Beyond Love: Unpacking the Science of Oxytocin', "Men's Hormone Health"),
          createUnpublishedArticle('Hormone Therapy: Myths, Facts, and the Power of Personalization', "Men's Hormone Health"),
        ],
      },
      {
        name: "Women's Hormone Health",
        articles: [
          createUnpublishedArticle('TRT and Depression?', "Women's Hormone Health"),
          createUnpublishedArticle('Understanding the Women’s Health Initiative: What Every Woman Should Know About Hormone Therapy', "Women's Hormone Health"),
          createUnpublishedArticle('Women’s Health - Testosterone Trepidation', "Women's Hormone Health"),
          createUnpublishedArticle('Beyond Love: Unpacking the Science of Oxytocin', "Women's Hormone Health"),
          createUnpublishedArticle('Hormone Therapy: Myths, Facts, and the Power of Personalization', "Women's Hormone Health"),
        ],
      },
    ],
  },
  {
    name: 'Technology',
    subcategories: [
      {
        name: 'AI in Healthcare',
        articles: [
          createPublishedArticle('**Notes from Me on the 3AM CEO Pitch**', 'AI in Healthcare'),
        ],
      },
    ],
  },
  {
    name: 'Lifestyle',
    subcategories: [
      {
        name: 'Diet',
        articles: [
          createPublishedArticle('**Ultra-Processed Foods Associated With Depression and The Label Accuracy Of Performance Enhancing Supplements**', 'Diet'),
          createPublishedArticle('**Processed Foods, Life Expectancy, & Food Labels - Oh My!**', 'Diet'),
          createUnpublishedArticle("How to Choose an Omega-3 Supplement: A Pharmacist's Guide", 'Diet'),
        ],
      },
      {
        name: 'Exercise',
        articles: [
          createUnpublishedArticle('Sitting Too Long is Associated With Dementia, and Deaths Attributable to Obesity-related Cardiovascular Disease Has Increased Since 1999', 'Exercise'),
          createPublishedArticle('**NAD⁺ and Glutathione: Two Powerhouse Molecules Every Man Should Know About**', 'Exercise'),
          createPublishedArticle('**BPC-157 in Sports Medicine: Promise, Precaution, and the Need for Responsible Stewardship**', 'Exercise'),
        ],
      },
    ],
  },
  {
    name: 'Longevity',
    subcategories: [
      {
        name: 'Longevity',
        articles: [
          createPublishedArticle('**Sitting Too Long is Associated With Dementia, and Deaths Attributable to Obesity-related Cardiovascular Disease Has Increased Since 1999**', 'Longevity'),
          createPublishedArticle('**Ultra-Processed Foods Associated With Depression and The Label Accuracy Of Performance Enhancing Supplements**', 'Longevity'),
          createPublishedArticle('**Processed Foods, Life Expectancy, & Food Labels - Oh My!**', 'Longevity'),
          createPublishedArticle('**NAD⁺ and Glutathione: Two Powerhouse Molecules Every Man Should Know About**', 'Longevity'),
          createPublishedArticle('**Peptides: The Secret Weapon in Men’s Health & Longevity**', 'Longevity'),
          createPublishedArticle('**BPC-157 in Sports Medicine: Promise, Precaution, and the Need for Responsible Stewardship**', 'Longevity'),
          createUnpublishedArticle('Whoop is our ally but….', 'Longevity'),
          createUnpublishedArticle("How to Choose an Omega-3 Supplement: A Pharmacist's Guide", 'Longevity'),
        ],
      },
    ],
  },
  {
    name: 'Mood & Memory',
    subcategories: [
      { name: 'Memory Support', articles: [createUnpublishedArticle("How to Choose an Omega-3 Supplement: A Pharmacist's Guide", 'Memory Support')] },
      {
        name: 'Mental Health',
        articles: [
          createPublishedArticle('**Young And Not Healthy & Probiotics Appear Safe In Depression**', 'Mental Health'),
          createPublishedArticle('**Ultra-Processed Foods Associated With Depression and The Label Accuracy Of Performance Enhancing Supplements**', 'Mental Health'),
          createUnpublishedArticle('TRT and Depression?', 'Mental Health'),
        ],
      },
    ],
  },
  {
    name: 'Sexual Health',
    subcategories: [
      {
        name: "Men's Sexual Health",
        articles: [
          createUnpublishedArticle('Can Hair Loss Pills Cause ED?', "Men's Sexual Health"),
          createPublishedArticle('**The Testosterone Decline: Why Modern Men Need Hormone Optimization More Than Ever**', "Men's Sexual Health"),
          createUnpublishedArticle('TRT and Depression?', "Men's Sexual Health"),
          createUnpublishedArticle('Beyond Love: Unpacking the Science of Oxytocin', "Men's Sexual Health"),
          createUnpublishedArticle('Hormone Therapy: Myths, Facts, and the Power of Personalization', "Men's Sexual Health"),
        ],
      },
      {
        name: "Women's Sexual Health",
        articles: [
          createUnpublishedArticle('TRT and Depression?', "Women's Sexual Health"),
          createUnpublishedArticle('Understanding the Women’s Health Initiative: What Every Woman Should Know About Hormone Therapy', "Women's Sexual Health"),
          createUnpublishedArticle('Women’s Health - Testosterone Trepidation', "Women's Sexual Health"),
          createUnpublishedArticle('Beyond Love: Unpacking the Science of Oxytocin', "Women's Sexual Health"),
          createUnpublishedArticle('Hormone Therapy: Myths, Facts, and the Power of Personalization', "Women's Sexual Health"),
        ],
      },
    ],
  },
  {
    name: 'Weight Loss',
    subcategories: [
      { name: 'Medications', articles: [createPublishedArticle('**Beyond the First Six Months: Why GLP-1s Alone Aren’t Enough for Lasting Weight Loss**', 'Medications')] },
      {
        name: 'Lifestyle',
        articles: [
          createPublishedArticle('**Sitting Too Long is Associated With Dementia, and Deaths Attributable to Obesity-related Cardiovascular Disease Has Increased Since 1999**', 'Lifestyle'),
          createPublishedArticle('**Processed Foods, Life Expectancy, & Food Labels - Oh My!**', 'Lifestyle'),
          createPublishedArticle('**Beyond the First Six Months: Why GLP-1s Alone Aren’t Enough for Lasting Weight Loss**', 'Lifestyle'),
        ],
      },
    ],
  },
  {
    name: 'Podcasts & News',
    subcategories: [
      { name: 'Podcasts', articles: [] },
      {
        name: 'News',
        articles: [
          createPublishedArticle('**Notes from Me on the 3AM CEO Pitch**', 'News'),
          createUnpublishedArticle('Whoop is our ally but….', 'News'),
        ],
      },
    ],
  },
];
