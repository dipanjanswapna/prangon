
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

export const subscriptionPlanSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Plan name is required.'),
  description: z.string().min(1, 'Description is required.'),
  priceMonthly: z.number().positive('Monthly price must be positive.'),
  priceYearly: z.number().positive('Yearly price must be positive.'),
  features: z.array(z.string().min(1, 'Feature cannot be empty.')),
  isPopular: z.boolean().default(false),
});

export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;
