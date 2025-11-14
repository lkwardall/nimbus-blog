
import { Category, Article } from '@/types';

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
// This content is generated from your edits. Copy and paste it into data/articles.ts

const allArticles = {
  canHairLossPillsCauseEd: createUnpublishedArticle("Can Hair Loss Pills Cause ED?", "Hair Loss"),
  theTestosteroneDeclineWhyModernMenNeedHormoneOptim: createPublishedArticle(
    'The Testosterone Decline: Why Modern Men Need Hormone Optimization More Than Ever',
    'Men\'s Hormone Health',
    { date: '2024-07-25', isFeatured: true, body: `## **Introduction**

Your grandfather likely had higher testosterone levels than you do today — even with cigars, hard work, and no fancy supplements. Research confirms that men’s testosterone has dropped around **20–30% since the 1970s**, aside from what natural aging would predict.

This isn’t just about getting older faster — it’s a men’s health concern that affects energy, metabolic health, mood, and longevity. Nimbus Healthcare’s [**NimCore®**  protocols](https://nimbushealthcare.com/nimcore/nimcore-men) address this head-on with safe, personalized optimization backed by the latest science.

---

## **The Science Behind the Decline**

While testosterone naturally declines by approximately **1% per year after age 30**, modern men are experiencing even steeper declines.

- Cleveland Clinic notes the typical drop of 1% per year after age 30, which is made worse by lifestyle and environmental factors ([Cleveland Clinic](https://health.clevelandclinic.org/declining-testosterone-levels?utm_source=chatgpt.com)).
- A Boston-area cohort study found substantial declines between the late 1980s and early 2000s **not explained by obesity, smoking, or other health variables** ([PubMed](https://pubmed.ncbi.nlm.nih.gov/17062768/?utm_source=chatgpt.com)).
- Broader research confirms similar secular trends globally ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7063751/?utm_source=chatgpt.com), [Journal of Clinical Endocrinology & Metabolism](https://academic.oup.com/jcem/article/92/12/4696/2597312?utm_source=chatgpt.com)).

---

## **Why It Matters for Modern Men**

Low testosterone isn’t just about libido or masculinity. It deeply affects:

- **Physical health**: loss of muscle mass (3–5% per decade after age 30), increased fat accumulation, reduced bone density ([HSS](https://www.hss.edu/health-library/move-better/muscle-mass-testosterone?utm_source=chatgpt.com)).
- **Mental well-being**: testosterone plays a role in memory, mood, and brain health ([Harvard Health](https://www.health.harvard.edu/newsletter_article/testosterone_aging_and_the_mind?utm_source=chatgpt.com)).
- **Cardiometabolic risks**: low testosterone raises the likelihood of metabolic syndrome, depression, and cardiovascular disease ([Harvard Men’s Health Watch](https://www.health.harvard.edu/mens-health/several-factors-may-cause-testosterone-levels-to-drop?utm_source=chatgpt.com)).

When testosterone falls, men often feel like they’re **aging faster than they should**.

---

## **Why the Decline Has Accelerated**

Beyond aging, several factors are making testosterone loss worse than ever:

- **Obesity and sedentary lifestyles** ([Medichecks](https://www.medichecks.com/blogs/testosterone/why-do-gen-z-and-millennial-men-have-lower-testosterone?srsltid=AfmBOopGdpWvx2byuuVDtS9HVdfdyln6U8NmInxHLLzRqKXWxG1U3-aC&utm_source=chatgpt.com)).
- **Environmental toxins**, including BPA and phthalates, that disrupt hormones ([GQ](https://www.gq.com/story/sperm-count-zero?utm_source=chatgpt.com)).
- **Sleep deprivation, chronic stress, and poor nutrition**, which elevate cortisol and suppress testosterone ([SMS Clinical Research](https://smsclinicalresearch.com/low-testosterone-in-your-30s-its-more-common-than-you-think/?utm_source=chatgpt.com)).

---

## **NimCore®: A Responsible Path Forward**

Hormone optimization is not about chasing “superhuman” levels. It’s about restoring balance, safely and responsibly. The [**NimCore®** protocols](https://nimbushealthcare.com/nimcore/nimcore-men) are designed for modern men.

## **Conclusion**

Declining testosterone among men today isn’t an inevitable part of aging — it’s a **modifiable health issue**. With flexible, scientifically grounded protocols like NimCore®, men can reclaim their vitality, sharpen focus, and protect long-term health.

👉 **Ready to reclaim your edge?** Explore [NimCore®](https://nimbushealthcare.com/nimcore/nimcore-men) and discover the path that fits your life.

---

## **References**

1. Travison TG, et al. “A population-level decline in serum testosterone levels in American men.” *Journal of Clinical Endocrinology & Metabolism.* 2007. [PubMed](https://pubmed.ncbi.nlm.nih.gov/17062768/?utm_source=chatgpt.com)
2. Handelsman DJ, et al. “Trends and determinants of testosterone decline.” *Human Reproduction Update.* 2016. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7063751/?utm_source=chatgpt.com)
3. Cleveland Clinic. “Why Testosterone Declines as Men Age.” [Link](https://health.clevelandclinic.org/declining-testosterone-levels?utm_source=chatgpt.com)
4. Harvard Health. “Testosterone, Aging, and the Mind.” [Link](https://www.health.harvard.edu/newsletter_article/testosterone_aging_and_the_mind?utm_source=chatgpt.com)
5. HSS. “Muscle Mass and Testosterone.” [Link](https://www.hss.edu/health-library/move-better/muscle-mass-testosterone?utm_source=chatgpt.com)
6. GQ. “Sperm Count Zero.” [Link](https://www.gq.com/story/sperm-count-zero?utm_source=chatgpt.com)` }
  ),
  peptidesTheSecretWeaponInMensHealthLongevity: createPublishedArticle(
    'Peptides: The Secret Weapon in Men’s Health & Longevity',
    'Men\'s Hormone Health',
    { date: '2024-07-24', isFeatured: false, body: `
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
  ` }
  ),
  trtAndDepression: createUnpublishedArticle("TRT and Depression?", "Men's Hormone Health"),
  beyondLoveUnpackingTheScienceOfOxytocin: createUnpublishedArticle("Beyond Love: Unpacking the Science of Oxytocin", "Men's Hormone Health"),
  hormoneTherapyMythsFactsAndThePowerOfPersonalizati: createUnpublishedArticle("Hormone Therapy: Myths, Facts, and the Power of Personalization", "Men's Hormone Health"),
  understandingTheWomensHealthInitiativeWhatEveryWom: createUnpublishedArticle("Understanding the Women’s Health Initiative: What Every Woman Should Know About Hormone Therapy", "Women's Hormone Health"),
  womensHealthTestosteroneTrepidation: createUnpublishedArticle("Women’s Health - Testosterone Trepidation", "Women's Hormone Health"),
  notesFromMeOnThe3amCeoPitch: createPublishedArticle(
    'Notes from Me on the 3AM CEO Pitch',
    'AI in Healthcare',
    { date: '2024-07-23', isFeatured: false, body: `
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
  ` }
  ),
  ultraprocessedFoodsAssociatedWithDepressionAndTheL: createPublishedArticle(
    'Ultra-Processed Foods Associated With Depression and The Label Accuracy Of Performance Enhancing Supplements',
    'Diet',
    { date: '2024-07-22', isFeatured: false, body: `
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
  ` }
  ),
  processedFoodsLifeExpectancyFoodLabelsOhMy: createPublishedArticle(
    'Processed Foods, Life Expectancy, & Food Labels - Oh My!',
    'Diet',
    { date: '2024-07-21', isFeatured: false, body: `
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
  ` }
  ),
  howToChooseAnOmega3SupplementAPharmacistsGuide: createUnpublishedArticle("How to Choose an Omega-3 Supplement: A Pharmacist's Guide", "Diet"),
  sittingTooLongIsAssociatedWithDementiaAndDeathsAtt: createPublishedArticle(
    'Sitting Too Long is Associated With Dementia, and Deaths Attributable to Obesity-related Cardiovascular Disease Has Increased Since 1999',
    'Longevity',
    { date: '2024-07-18', isFeatured: false, body: `
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
  ` }
  ),
  nadAndGlutathioneTwoPowerhouseMoleculesEveryManSho: createPublishedArticle(
    'NAD⁺ and Glutathione: Two Powerhouse Molecules Every Man Should Know About',
    'Exercise',
    { date: '2024-07-20', isFeatured: false, body: `
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
  ` }
  ),
  bpc157InSportsMedicinePromisePrecautionAndTheNeedF: createPublishedArticle(
    'BPC-157 in Sports Medicine: Promise, Precaution, and the Need for Responsible Stewardship',
    'Exercise',
    { date: '2024-07-19', isFeatured: false, body: `
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
  ` }
  ),
  whoopIsOurAllyBut: createUnpublishedArticle("Whoop is our ally but….", "Longevity"),
  youngAndNotHealthyProbioticsAppearSafeInDepression: createPublishedArticle(
    'Young And Not Healthy & Probiotics Appear Safe In Depression',
    'Mental Health',
    { date: '2024-07-17', isFeatured: false, body: `
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
  ` }
  ),
  beyondTheFirstSixMonthsWhyGlp1sAloneArentEnoughFor: createPublishedArticle(
    'Beyond the First Six Months: Why GLP-1s Alone Aren’t Enough for Lasting Weight Loss',
    'Medications',
    { date: '2024-07-16', isFeatured: false, body: `
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
  ` }
  ),
};


export const blogData: Category[] = [
  {
    "name": "Hair & Skin",
    "subcategories": [
      {
        "name": "Hair Loss",
        "articles": [
          allArticles.canHairLossPillsCauseEd
        ]
      },
      {
        "name": "Skin Conditions",
        "articles": []
      }
    ]
  },
  {
    "name": "Hormone Therapy",
    "subcategories": [
      {
        "name": "Men's Hormone Health",
        "articles": [
          allArticles.theTestosteroneDeclineWhyModernMenNeedHormoneOptim,
          allArticles.peptidesTheSecretWeaponInMensHealthLongevity,
          allArticles.trtAndDepression,
          allArticles.beyondLoveUnpackingTheScienceOfOxytocin,
          allArticles.hormoneTherapyMythsFactsAndThePowerOfPersonalizati
        ]
      },
      {
        "name": "Women's Hormone Health",
        "articles": [
          allArticles.trtAndDepression,
          allArticles.understandingTheWomensHealthInitiativeWhatEveryWom,
          allArticles.womensHealthTestosteroneTrepidation,
          allArticles.beyondLoveUnpackingTheScienceOfOxytocin,
          allArticles.hormoneTherapyMythsFactsAndThePowerOfPersonalizati
        ]
      }
    ]
  },
  {
    "name": "Technology",
    "subcategories": [
      {
        "name": "AI in Healthcare",
        "articles": [
          allArticles.notesFromMeOnThe3amCeoPitch
        ]
      }
    ]
  },
  {
    "name": "Lifestyle",
    "subcategories": [
      {
        "name": "Diet",
        "articles": [
          allArticles.ultraprocessedFoodsAssociatedWithDepressionAndTheL,
          allArticles.processedFoodsLifeExpectancyFoodLabelsOhMy,
          allArticles.howToChooseAnOmega3SupplementAPharmacistsGuide
        ]
      },
      {
        "name": "Exercise",
        "articles": [
          allArticles.sittingTooLongIsAssociatedWithDementiaAndDeathsAtt,
          allArticles.nadAndGlutathioneTwoPowerhouseMoleculesEveryManSho,
          allArticles.bpc157InSportsMedicinePromisePrecautionAndTheNeedF
        ]
      }
    ]
  },
  {
    "name": "Longevity",
    "subcategories": [
      {
        "name": "Longevity",
        "articles": [
          allArticles.sittingTooLongIsAssociatedWithDementiaAndDeathsAtt,
          allArticles.ultraprocessedFoodsAssociatedWithDepressionAndTheL,
          allArticles.processedFoodsLifeExpectancyFoodLabelsOhMy,
          allArticles.nadAndGlutathioneTwoPowerhouseMoleculesEveryManSho,
          allArticles.peptidesTheSecretWeaponInMensHealthLongevity,
          allArticles.bpc157InSportsMedicinePromisePrecautionAndTheNeedF,
          allArticles.whoopIsOurAllyBut,
          allArticles.howToChooseAnOmega3SupplementAPharmacistsGuide
        ]
      }
    ]
  },
  {
    "name": "Mood & Memory",
    "subcategories": [
      {
        "name": "Memory Support",
        "articles": [
          allArticles.howToChooseAnOmega3SupplementAPharmacistsGuide
        ]
      },
      {
        "name": "Mental Health",
        "articles": [
          allArticles.youngAndNotHealthyProbioticsAppearSafeInDepression,
          allArticles.ultraprocessedFoodsAssociatedWithDepressionAndTheL,
          allArticles.trtAndDepression
        ]
      }
    ]
  },
  {
    "name": "Sexual Health",
    "subcategories": [
      {
        "name": "Men's Sexual Health",
        "articles": [
          allArticles.canHairLossPillsCauseEd,
          allArticles.theTestosteroneDeclineWhyModernMenNeedHormoneOptim,
          allArticles.trtAndDepression,
          allArticles.beyondLoveUnpackingTheScienceOfOxytocin,
          allArticles.hormoneTherapyMythsFactsAndThePowerOfPersonalizati
        ]
      },
      {
        "name": "Women's Sexual Health",
        "articles": [
          allArticles.trtAndDepression,
          allArticles.understandingTheWomensHealthInitiativeWhatEveryWom,
          allArticles.womensHealthTestosteroneTrepidation,
          allArticles.beyondLoveUnpackingTheScienceOfOxytocin,
          allArticles.hormoneTherapyMythsFactsAndThePowerOfPersonalizati
        ]
      }
    ]
  },
  {
    "name": "Weight Loss",
    "subcategories": [
      {
        "name": "Medications",
        "articles": [
          allArticles.beyondTheFirstSixMonthsWhyGlp1sAloneArentEnoughFor
        ]
      },
      {
        "name": "Lifestyle",
        "articles": [
          allArticles.sittingTooLongIsAssociatedWithDementiaAndDeathsAtt,
          allArticles.processedFoodsLifeExpectancyFoodLabelsOhMy,
          allArticles.beyondTheFirstSixMonthsWhyGlp1sAloneArentEnoughFor
        ]
      }
    ]
  },
  {
    "name": "Podcasts & News",
    "subcategories": [
      {
        "name": "Podcasts",
        "articles": []
      },
      {
        "name": "News",
        "articles": [
          allArticles.notesFromMeOnThe3amCeoPitch,
          allArticles.whoopIsOurAllyBut
        ]
      }
    ]
  }
];