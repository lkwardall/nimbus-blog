import { Category, Article } from '../types';

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

interface ArticleOptions {
  date: string;
  isFeatured?: boolean;
  body?: string;
}

const createPublishedArticle = (title: string, subcategory: string, options: ArticleOptions): Article => {
  const cleanTitle = title.replace(/\*\*/g, '');
  const articleBody = options.body || createArticleBody(); 
  return {
    id: idCounter++,
    title: cleanTitle,
    publicationDate: new Date(options.date).toISOString(),
    isFeatured: options.isFeatured ?? false,
    subcategory,
    imageUrl: `https://source.unsplash.com/random/800x600?sig=${idCounter}&query=health,wellness,science`,
    alt: `An image related to the article: ${cleanTitle}`,
    author: 'Wellness Expert',
    description: `An in-depth look at "${cleanTitle}". Key insights and research from Discover Wellness.`,
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
// Define each unique article once to ensure data consistency and enable content syncing.
const allArticles = {
  // Published Articles
  testosteroneDecline: createPublishedArticle('**The Testosterone Decline: Why Modern Men Need Hormone Optimization More Than Ever**', "Men's Hormone Health", { date: '2024-07-25', isFeatured: true }),
  peptidesSecretWeapon: createPublishedArticle('**Peptides: The Secret Weapon in Men’s Health & Longevity**', "Men's Hormone Health", { date: '2024-07-24' }),
  notesOn3AMPitch: createPublishedArticle('**Notes from Me on the 3AM CEO Pitch**', 'AI in Healthcare', { date: '2024-07-23' }),
  ultraProcessedFoods: createPublishedArticle('**Ultra-Processed Foods Associated With Depression and The Label Accuracy Of Performance Enhancing Supplements**', 'Diet', { date: '2024-07-22' }),
  processedFoodsLifeExpectancy: createPublishedArticle('**Processed Foods, Life Expectancy, & Food Labels - Oh My!**', 'Diet', { date: '2024-07-21' }),
  nadAndGlutathione: createPublishedArticle('**NAD⁺ and Glutathione: Two Powerhouse Molecules Every Man Should Know About**', 'Exercise', { date: '2024-07-20' }),
  bpc157: createPublishedArticle('**BPC-157 in Sports Medicine: Promise, Precaution, and the Need for Responsible Stewardship**', 'Exercise', { date: '2024-07-19' }),
  sittingTooLong: createPublishedArticle('**Sitting Too Long is Associated With Dementia, and Deaths Attributable to Obesity-related Cardiovascular Disease Has Increased Since 1999**', 'Longevity', { date: '2024-07-18' }),
  youngAndNotHealthy: createPublishedArticle('**Young And Not Healthy & Probiotics Appear Safe In Depression**', 'Mental Health', { date: '2024-07-17' }),
  beyondSixMonthsGLP1: createPublishedArticle('**Beyond the First Six Months: Why GLP-1s Alone Aren’t Enough for Lasting Weight Loss**', 'Medications', { date: '2024-07-16' }),

  // Unpublished Articles
  hairLossPillsED: createUnpublishedArticle('Can Hair Loss Pills Cause ED?', 'Hair Loss'),
  trtAndDepression: createUnpublishedArticle('TRT and Depression?', "Men's Hormone Health"),
  oxytocinScience: createUnpublishedArticle('Beyond Love: Unpacking the Science of Oxytocin', "Men's Hormone Health"),
  hormoneTherapyMyths: createUnpublishedArticle('Hormone Therapy: Myths, Facts, and the Power of Personalization', "Men's Hormone Health"),
  womensHealthInitiative: createUnpublishedArticle('Understanding the Women’s Health Initiative: What Every Woman Should Know About Hormone Therapy', "Women's Hormone Health"),
  womensHealthTestosterone: createUnpublishedArticle('Women’s Health - Testosterone Trepidation', "Women's Hormone Health"),
  omega3Guide: createUnpublishedArticle("How to Choose an Omega-3 Supplement: A Pharmacist's Guide", 'Diet'),
  whoopAlly: createUnpublishedArticle('Whoop is our ally but….', 'Longevity'),
};


export const blogData: Category[] = [
  {
    name: 'Hair & Skin',
    subcategories: [
      { name: 'Hair Loss', articles: [allArticles.hairLossPillsED] },
      { name: 'Skin Conditions', articles: [] },
    ],
  },
  {
    name: 'Hormone Therapy',
    subcategories: [
      {
        name: "Men's Hormone Health",
        articles: [
          allArticles.testosteroneDecline,
          allArticles.peptidesSecretWeapon,
          allArticles.trtAndDepression,
          allArticles.oxytocinScience,
          allArticles.hormoneTherapyMyths,
        ],
      },
      {
        name: "Women's Hormone Health",
        articles: [
          allArticles.trtAndDepression,
          allArticles.womensHealthInitiative,
          allArticles.womensHealthTestosterone,
          allArticles.oxytocinScience,
          allArticles.hormoneTherapyMyths,
        ],
      },
    ],
  },
  {
    name: 'Technology',
    subcategories: [
      {
        name: 'AI in Healthcare',
        articles: [allArticles.notesOn3AMPitch],
      },
    ],
  },
  {
    name: 'Lifestyle',
    subcategories: [
      {
        name: 'Diet',
        articles: [
          allArticles.ultraProcessedFoods,
          allArticles.processedFoodsLifeExpectancy,
          allArticles.omega3Guide,
        ],
      },
      {
        name: 'Exercise',
        articles: [
          allArticles.sittingTooLong,
          allArticles.nadAndGlutathione,
          allArticles.bpc157,
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
          allArticles.sittingTooLong,
          allArticles.ultraProcessedFoods,
          allArticles.processedFoodsLifeExpectancy,
          allArticles.nadAndGlutathione,
          allArticles.peptidesSecretWeapon,
          allArticles.bpc157,
          allArticles.whoopAlly,
          allArticles.omega3Guide,
        ],
      },
    ],
  },
  {
    name: 'Mood & Memory',
    subcategories: [
      { name: 'Memory Support', articles: [allArticles.omega3Guide] },
      {
        name: 'Mental Health',
        articles: [
          allArticles.youngAndNotHealthy,
          allArticles.ultraProcessedFoods,
          allArticles.trtAndDepression,
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
          allArticles.hairLossPillsED,
          allArticles.testosteroneDecline,
          allArticles.trtAndDepression,
          allArticles.oxytocinScience,
          allArticles.hormoneTherapyMyths,
        ],
      },
      {
        name: "Women's Sexual Health",
        articles: [
          allArticles.trtAndDepression,
          allArticles.womensHealthInitiative,
          allArticles.womensHealthTestosterone,
          allArticles.oxytocinScience,
          allArticles.hormoneTherapyMyths,
        ],
      },
    ],
  },
  {
    name: 'Weight Loss',
    subcategories: [
      { name: 'Medications', articles: [allArticles.beyondSixMonthsGLP1] },
      {
        name: 'Lifestyle',
        articles: [
          allArticles.sittingTooLong,
          allArticles.processedFoodsLifeExpectancy,
          allArticles.beyondSixMonthsGLP1,
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
          allArticles.notesOn3AMPitch,
          allArticles.whoopAlly,
        ],
      },
    ],
  },
];