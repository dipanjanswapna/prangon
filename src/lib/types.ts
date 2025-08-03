
import { z } from 'zod';

const testimonialSchema = z.object({
  quote: z.string().min(1, 'Quote is required.'),
  author: z.string().min(1, 'Author is required.'),
  title: z.string().min(1, 'Title is required.'),
  image: z.string().url('Must be a valid URL.'),
  imageAiHint: z.string().optional(),
});

const toolboxItemSchema = z.object({
    name: z.string().min(1, 'Toolbox item name is required.')
});

const videoSchema = z.object({
    title: z.string().min(1, 'Video title is required.'),
    author: z.string().min(1, 'Video author is required.'),
    timestamp: z.string().min(1, 'Video timestamp is required.'),
    thumbnail: z.string().url('Must be a valid URL.'),
    thumbnailAiHint: z.string().optional(),
});


export const homePageSchema = z.object({
  heroWelcomeText: z.string().min(1, 'Welcome text is required.'),
  heroTitle: z.string().min(1, 'Title is required.'),
  heroBackgroundImageUrl: z.string().url('Must be a valid URL.'),
  aboutMeText: z.string().min(1, 'About me text is required.'),
  aboutMeImageUrl: z.string().url('Must be a valid URL.'),
  skills: z.array(z.string().min(1, 'Skill cannot be empty.')).min(1, 'At least one skill is required.'),
  testimonials: z.array(testimonialSchema),
  toolboxItems: z.array(toolboxItemSchema),
  readsImage: z.string().url('Must be a valid URL.'),
  hobbiesImage: z.string().url('Must be a valid URL.'),
  videos: z.array(videoSchema)
});

export type HomePageData = z.infer<typeof homePageSchema>;

export const prangonsLikhaPostSchema = z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string().min(1, 'Title is required.'),
    author: z.string().min(1, 'Author is required.'),
    category: z.string().min(1, 'Category is required.'),
    coverImage: z.string().url('Must be a valid URL.'),
    imageAiHint: z.string().optional().default('book cover'),
    content: z.string().min(10, 'Content must be at least 10 characters.'),
    tags: z.array(z.string().min(1, 'Tag cannot be empty.')),
    isFeatured: z.boolean().default(false),
    isPremium: z.boolean().default(false),
});

export type PrangonsLikhaPost = z.infer<typeof prangonsLikhaPostSchema>;

const promoCodeSchema = z.object({
  code: z.string().min(1, 'Promo code is required.'),
  discount: z.number().min(1, 'Discount must be at least 1%').max(100, 'Discount cannot exceed 100%'),
});

export const subscriptionPlanSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Plan name is required.'),
  description: z.string().min(1, 'Description is required.'),
  priceMonthly: z.number().positive('Monthly price must be positive.'),
  priceYearly: z.number().positive('Yearly price must be positive.'),
  features: z.array(z.string().min(1, 'Feature cannot be empty.')),
  isPopular: z.boolean().default(false),
  promoCodes: z.array(promoCodeSchema).optional().default([]),
});

export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;

export const libraryItemSchema = z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string().min(1, 'Title is required.'),
    author: z.string().min(1, 'Author or publisher is required.'),
    category: z.enum(['Book', 'Weekly Magazine', 'Monthly Magazine', 'Comic Book']),
    coverImage: z.string().url('Must be a valid URL.'),
    imageAiHint: z.string().optional().default('book cover'),
    content: z.string().optional(),
    pdfUrl: z.string().url().optional().or(z.literal('')),
    documentAiHint: z.string().optional().default('document screenshot'),
    tags: z.array(z.string().min(1, 'Tag cannot be empty.')),
    isFeatured: z.boolean().default(false),
    isPremium: z.boolean().default(false),
});

export type LibraryItem = z.infer<typeof libraryItemSchema>;


const gatewaySetting = z.object({
  enabled: z.boolean()
});

export const paymentSettingsSchema = z.object({
  card: gatewaySetting,
  paypal: gatewaySetting,
  mobile: gatewaySetting, // Main toggle for the mobile banking tab
  bkash: gatewaySetting,
  nagad: gatewaySetting,
  upi: gatewaySetting,
});

export type PaymentSettings = z.infer<typeof paymentSettingsSchema>;

export const achievementSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required.'),
    issuer: z.string().min(1, 'Issuer is required.'),
    date: z.string().min(1, 'Date is required.'),
    description: z.string().min(1, 'Description is required.'),
    category: z.enum(['Award', 'Certification', 'Academic', 'Leadership']),
    link: z.string().url().optional().or(z.literal('')),
    imageUrl: z.string().url().optional().or(z.literal('')),
    imageAiHint: z.string().optional(),
});

export type Achievement = z.infer<typeof achievementSchema>;


export const experienceSchema = z.object({
    id: z.string(),
    role: z.string().min(1, 'Role is required.'),
    entity: z.string().min(1, 'Entity is required.'),
    period: z.string().min(1, 'Period is required.'),
    category: z.enum(['Professional', 'Freelance', 'Content Creation', 'Leadership']),
    description: z.array(z.string().min(1, 'Description cannot be empty.')).min(1, 'At least one description point is required.'),
    achievements: z.array(z.string().min(1, 'Achievement cannot be empty.')).optional(),
    link: z.string().url().optional().or(z.literal('')),
});

export type Experience = z.infer<typeof experienceSchema>;
