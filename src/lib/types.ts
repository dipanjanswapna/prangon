
import { z } from 'zod';

const testimonialSchema = z.object({
  quote: z.string().min(1, 'Quote is required.'),
  author: z.string().min(1, 'Author is required.'),
  title: z.string().min(1, 'Title is required.'),
  image: z.string().url('Must be a valid URL.'),
  imageAiHint: z.string().optional(),
});

const videoSchema = z.object({
    title: z.string().min(1, 'Video title is required.'),
    author: z.string().min(1, 'Video author is required.'),
    timestamp: z.string().min(1, 'Video timestamp is required.'),
    thumbnail: z.string().url('Must be a valid URL.'),
    thumbnailAiHint: z.string().optional(),
});

const statsSchema = z.object({
  happyCustomers: z.number().int().positive('Must be a positive number.'),
  servicesProvided: z.number().int().positive('Must be a positive number.'),
});

const upcomingEventsSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  buttonText: z.string().min(1, 'Button text is required.'),
  buttonLink: z.string().url('Must be a valid URL.'),
  backgroundImageUrl: z.string().url('Must be a valid URL.'),
});

export const homePageSchema = z.object({
  heroWelcomeText: z.string().min(1, 'Welcome text is required.'),
  heroTitle: z.string().min(1, 'Title is required.'),
  heroAnimatedTexts: z.array(z.string().min(1, 'Animated text cannot be empty.')).min(1, 'At least one animated text is required.'),
  heroBackgroundImageUrl: z.string().url('Must be a valid URL.'),
  aboutMeText: z.string().min(1, 'About me text is required.'),
  aboutMeImageUrl: z.string().url('Must be a valid URL.'),
  skills: z.array(z.string().min(1, 'Skill cannot be empty.')).min(1, 'At least one skill is required.'),
  stats: statsSchema,
  testimonials: z.array(testimonialSchema),
  videos: z.array(videoSchema),
  upcomingEvents: upcomingEventsSchema,
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
    imageUrl: z.string().url('Must be a valid URL.'),
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


const aboutPageFeatureSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
});

const aboutPageAccordionItemSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  content: z.string().min(1, 'Content is required.'),
});

const educationItemSchema = z.object({
  institution: z.string().min(1, 'Institution is required.'),
  degree: z.string().min(1, 'Degree or program is required.'),
  period: z.string().min(1, 'Period is required.'),
  details: z.string().optional(),
});

const personalInfoItemSchema = z.object({
    label: z.string().min(1, 'Label is required.'),
    value: z.string().min(1, 'Value is required.'),
});

export const aboutPageSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  tagline: z.string().min(1, 'Tagline is required.'),
  profileImageUrl: z.string().url('Must be a valid URL.'),
  coverPhotoUrl: z.string().url('Must be a valid URL.').optional(),
  backgroundImageUrl: z.string().url('Must be a valid URL.'),
  academia: z.object({
    title: z.string().min(1, 'Title is required.'),
    description: z.string().min(1, 'Description is required.'),
    features: z.array(aboutPageFeatureSchema),
  }),
  services: z.object({
    title: z.string().min(1, 'Title is required.'),
    description: z.string().min(1, 'Description is required.'),
    accordionItems: z.array(aboutPageAccordionItemSchema),
    features: z.array(aboutPageFeatureSchema),
  }),
  biography: z.string().min(1, 'Biography is required.'),
  personalInfo: z.array(personalInfoItemSchema).optional(),
  education: z.array(educationItemSchema).optional(),
});

export type AboutPageData = z.infer<typeof aboutPageSchema>;


export const visualArtSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required.'),
    description: z.string().min(1, 'Description is required.'),
    imageUrl: z.string().url('Must be a valid URL.'),
    imageAiHint: z.string().optional().default('visual art'),
    category: z.enum(['Handmade Art', 'Illustration', 'Photography', 'Graphics Design', 'UI/UX Design']),
    tags: z.array(z.string().min(1, 'Tag cannot be empty.')),
    tools: z.array(z.string().min(1, 'Tool cannot be empty.')),
    date: z.string().min(1, 'Date is required.'),
    likes: z.number().int().nonnegative().default(0),
    comments: z.array(z.object({
        author: z.string().min(1),
        text: z.string().min(1)
    })).default([]),
});

export type VisualArt = z.infer<typeof visualArtSchema>;

export const blogPostSchema = z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string().min(1, 'Title is required.'),
    author: z.string().min(1, 'Author is required.'),
    category: z.string().min(1, 'Category is required.'),
    coverImage: z.string().url('Must be a valid URL.'),
    imageAiHint: z.string().optional().default('blog post cover'),
    content: z.string().min(10, 'Content must be at least 10 characters.'),
    tags: z.array(z.string().min(1, 'Tag cannot be empty.')),
    isFeatured: z.boolean().default(false),
    isPremium: z.boolean().default(false),
    date: z.string().min(1, "Date is required."),
});

export type BlogPost = z.infer<typeof blogPostSchema>;

export const socialWorkInitiativeSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required.'),
    category: z.enum(['Education', 'Environment', 'Humanitarian', 'Health', 'Community']),
    description: z.string().min(1, 'Description is required.'),
    impact: z.string().min(1, 'Impact statement is required.'),
    imageUrl: z.string().url('Must be a valid URL.'),
    imageAiHint: z.string().optional(),
    tags: z.array(z.string().min(1, 'Tag cannot be empty.')),
});

export type SocialWorkInitiative = z.infer<typeof socialWorkInitiativeSchema>;

export const socialWorkTestimonialSchema = z.object({
    id: z.string(),
    quote: z.string().min(1, 'Quote is required.'),
    author: z.string().min(1, 'Author is required.'),
    role: z.string().min(1, 'Role is required.'),
    imageUrl: z.string().url('Must be a valid URL.'),
    imageAiHint: z.string().optional(),
});

export type SocialWorkTestimonial = z.infer<typeof socialWorkTestimonialSchema>;

export const socialWorkPageSchema = z.object({
  initiatives: z.array(socialWorkInitiativeSchema),
  testimonials: z.array(socialWorkTestimonialSchema),
});

export type SocialWorkPageData = z.infer<typeof socialWorkPageSchema>;

export const projectSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required.'),
    client: z.string().min(1, 'Client is required.'),
    description: z.string().min(1, 'Description is required.'),
    imageUrl: z.string().url('Must be a valid URL.'),
    imageAiHint: z.string().optional().default('project screenshot'),
    category: z.string().min(1, 'Category is required.'),
    tags: z.array(z.string().min(1, 'Tag cannot be empty.')),
    link: z.string().url().optional().or(z.literal('')),
});

export type Project = z.infer<typeof projectSchema>;

export const faqItemSchema = z.object({
    id: z.string(),
    question: z.string().min(1, 'Question is required.'),
    answer: z.string().min(1, 'Answer is required.'),
});

export type FAQItem = z.infer<typeof faqItemSchema>;

export const faqPageSchema = z.object({
  faqs: z.array(faqItemSchema),
});

export type FAQPageData = z.infer<typeof faqPageSchema>;

// This combines the Firebase User object with our custom AppUser data
export const appUserSchema = z.object({
    uid: z.string(),
    customId: z.string(),
    email: z.string().email(),
    displayName: z.string(),
    photoURL: z.string().url().nullable(),
    role: z.enum(['admin', 'user']),
    subscription: z.object({
        planName: z.string().default(''),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    }),
});

export type AppUser = z.infer<typeof appUserSchema>;
