
'use server';

import { getFirestore } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import { homePageSchema, HomePageData } from '@/lib/types';


const defaultHomePageData: HomePageData = {
    heroWelcomeText: "WELCOME TO PRANGON CENTRE",
    heroTitle: "SMILE FOR MILES",
    heroBackgroundImageUrl: "https://scontent.fdac138-1.fna.fbcdn.net/v/t39.30808-6/489643954_1207618031366053_6391368232504397889_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=bybr_YZJzsUQ7kNvwFkUVAN&_nc_oc=AdknBg_ukuAGHBLRTJ3Z23JbDfxZOAVYo6-Kh_2pziZc2q3gqRlUagLlkiogSv0V5dU&_nc_zt=23&_nc_ht=scontent.fdac138-1.fna&_nc_gid=Ep4pWuNIWrzdeH-MHntHnw&oh=00_AfR85qb8KAeVlYCXXzNw4eT8e7SX-_Hejf8RFCRoD84ZFA&oe=6892201F",
    aboutMeText: "Hi! I’m Dipanjan “Swapna Prangon” Prangon from Dhaka, Bangladesh. As a passionate student, writer, and EdTech innovator, I founded Prangon’s Ecosystem to bridge creative design with education. I help students and educators through digital tools, branding, and movement-building learning content. With a keen eye for brand identity design, I craft logos, thumbnails, and visual stories that resonate.",
    aboutMeImageUrl: "https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg",
    skills: ["Web Development", "Programming Languages", "Graphic Design", "UI/UX Design", "Branding", "SEO"],
    testimonials: [
        {
          quote: "Dipanjan's branding work took our EdTech startup to the next level. The logo and visual identity perfectly capture our mission.",
          author: "Aarav Sharma",
          title: "CEO, Edufy",
          image: "https://placehold.co/100x100.png",
          imageAiHint: "man face",
        },
        {
          quote: "The learning materials designed by Prangon’s Ecosystem are both beautiful and effective. Our student engagement has skyrocketed.",
          author: "Nadia Islam",
          title: "Head of Curriculum, Shikho",
          image: "https://placehold.co/100x100.png",
          imageAiHint: "woman face",
        },
        {
          quote: "As a student, the digital tools he developed have been a game-changer for my study routine. Incredibly intuitive and helpful.",
          author: "Priya Das",
          title: "Student, University of Dhaka",
          image: "https://placehold.co/100x100.png",
          imageAiHint: "woman smiling",
        },
    ],
    toolboxItems: [
        { name: 'Express' }, { name: 'Node.js' }, { name: 'Flask' }, { name: 'Tailwind' },
        { name: 'Mongoose' }, { name: 'jQuery' }, { name: 'MySQL' }, { name: 'PostgreSQL' }
    ],
    readsImage: "https://placehold.co/400x600.png",
    hobbiesImage: "https://placehold.co/800x400.png",
    videos: [
      {
        title: "কে জিতবে আগামী সংসদ নির্বাচনে? Dipanjan Swapna || The Untold",
        author: "Dipanjan Swapna",
        timestamp: "15 hours ago",
        thumbnail: "https://placehold.co/400x225.png",
        thumbnailAiHint: "youtube thumbnail politics",
      },
      {
        title: "ইউনুস সরকার আমেরিকার বাম্বু খাইতেছে কি? Dipanjan Swapna || The Untold",
        author: "Dipanjan Swapna",
        timestamp: "July 29, 2025 7:21 pm",
        thumbnail: "https://placehold.co/400x225.png",
        thumbnailAiHint: "youtube thumbnail news",
      },
      {
        title: "বিএনপির শেষ যাত্রা — কে রুখবে এই পতন? Dipanjan Swapna || The Untold",
        author: "Dipanjan Swapna",
        timestamp: "July 27, 2025 7:49 pm",
        thumbnail: "https://placehold.co/400x225.png",
        thumbnailAiHint: "youtube thumbnail analysis",
      },
    ]
};

export async function getHomePageContent(): Promise<HomePageData> {
  try {
    const db = getFirestore();
    const docRef = db.collection('pages').doc('home');
    const doc = await docRef.get();

    if (!doc.exists) {
      // If the document doesn't exist, create it with default data
      await docRef.set(defaultHomePageData);
      return defaultHomePageData;
    }

    // merge with default data to avoid missing fields issues
    return { ...defaultHomePageData, ...doc.data() as HomePageData };
  } catch (error) {
    console.warn('Failed to fetch home page content from Firestore, returning default data.', error);
    return defaultHomePageData;
  }
}

export async function updateHomePageContent(data: HomePageData) {
  const validation = homePageSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, error: validation.error.flatten() };
  }

  try {
    const db = getFirestore();
    const docRef = db.collection('pages').doc('home');
    await docRef.set(validation.data, { merge: true });
    revalidatePath('/');
    revalidatePath('/admin/home');
    return { success: true };
  } catch (error) {
    console.error('Error updating home page content:', error);
    return { success: false, error: 'Failed to update content in database. Admin SDK might not be configured.' };
  }
}
