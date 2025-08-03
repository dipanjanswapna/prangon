
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
