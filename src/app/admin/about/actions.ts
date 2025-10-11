
'use server';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { aboutPageSchema, AboutPageData } from '@/lib/types';
import { initializeFirebase } from '@/firebase';

async function getFirestoreInstance() {
  const { firestore } = await initializeFirebase();
  return firestore;
}

const docRef = async () => doc(await getFirestoreInstance(), 'pages', 'about');

type ActionResult<T> = { success: true; data: T; } | { success: false; error: { message: string; context?: any } };

export async function getAboutPageContent(): Promise<ActionResult<AboutPageData>> {
  const reference = await docRef();
  try {
    const docSnap = await getDoc(reference);

    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() as AboutPageData };
    } else {
      console.log("No 'about' page document found! Using default data.");
      const defaultData: AboutPageData = {
          name: "Dipanjan Swapna Prangon",
          tagline: "A passionate student, writer, and EdTech innovator from Dhaka, Bangladesh, dedicated to bridging creative design with education.",
          profileImageUrl: "https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg",
          coverPhotoUrl: "https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg",
          backgroundImageUrl: "https://cdnb.artstation.com/p/assets/images/images/057/331/063/large/srabon-arafat-uploded-file-x.jpg?1671322270",
          academia: {
              title: "Why I'm a Strong Candidate for Your University",
              description: "My goal is to leverage higher education to create impactful technological solutions for the developing world.",
              features: [
                  { title: "Academic Excellence", description: "Achieved a CGPA of 3.9/4.0, complemented by multiple academic awards and honors for outstanding performance." },
                  { title: "Research & Innovation", description: "Contributed to a significant research project on [Your Research Topic], leading to [Outcome or Publication]." },
                  { title: "Leadership & Teamwork", description: "Led a team of 5 in [Project Name], fostering collaboration and achieving our goals ahead of schedule." },
                  { title: "Problem-Solving & Adaptability", description: "Developed a novel solution for [A Specific Problem], demonstrating adaptability in a fast-paced environment." },
                  { title: "Future Goals & Motivation", description: "Aiming to pursue a PhD in [Your Field] to contribute to [Your Ultimate Goal], driven by a passion for discovery." },
                  { title: "Awards & Recognition", description: "Recipient of the 'Innovator of the Year' award for developing a groundbreaking EdTech tool." }
              ]
          },
          services: {
              title: "How I Deliver Value to My Clients",
              description: "I combine creative design with strategic thinking to help brands and educators make a lasting impact.",
              accordionItems: [
                  { title: "Portfolio & Past Projects", content: "I have successfully completed over 50 projects ranging from brand identity design to web development for clients worldwide. You can view my selected works on the \"Work\" page to see the quality and creativity I bring to the table." },
                  { title: "Unique Selling Proposition (USP)", content: "My key differentiator is the blend of educational insight with design excellence. I don't just create visuals; I create learning experiences and brand stories that educate, engage, and inspire action." }
              ],
              features: [
                  { title: "Client Testimonials", description: "My clients consistently praise my work for its quality, creativity, and impact on their business." },
                  { title: "Efficient Working Process", description: "I follow a streamlined process: Discovery > Strategy > Design > Feedback > Delivery, ensuring clarity and quality." },
                  { title: "Transparent Pricing", description: "Clear and upfront pricing with no hidden fees. I offer packages tailored to your specific needs and budget." },
                  { title: "Timely Delivery", description: "I am committed to delivering high-quality work on time, every time, helping you meet your launch deadlines." }
              ]
          },
          biography: "Everyone knows Dipanjan Swapna Prangon as Prangon. Prangon (born 10 July 2007) is a Bangladeshi student, artist. He attended Government Science College in Class 12. Prangon was born on 10 july to the Bengali Hindu \"das\" family of Bhandaria in Bangladesh. His father is Dipankar Das and his mother is Sabita Biswas. Prangon grew up in Bhandaria during her early childhood under the care of her mother and relatives. He has no brother and sister.",
          personalInfo: [
              { label: "Native name", value: "দীপanjan স্বপ্ন প্রাঙ্গন" },
              { label: "Born", value: "10 July 2007" },
              { label: "Occupation", value: "Student\nWriter\nEdTech Innovator\nUI/UX Designer" },
              { label: "Years active", value: "2019-present" },
              { label: "Parents", value: "Dipankar Das (father)\nSabita Biswas (mother)" }
          ],
          education: [
              { institution: "Government Science College", degree: "Higher Secondary Certificate (HSC)", period: "2022 - 2024", details: "Science Group, Class 11-12" },
              { institution: "Bhandaria Bihari Pilot High School", degree: "Secondary School Certificate (SSC)", period: "2017 - 2022", details: "Science Group, Class 6-10" }
          ]
      };
      return { success: true, data: defaultData };
    }
  } catch(error: any) {
     if (error.code === 'permission-denied') {
        return { success: false, error: { message: 'permission-denied', context: { path: reference.path, operation: 'get' } } };
     }
     console.error("Error getting document: ", error);
     return { success: false, error: { message: error.message || 'An unknown error occurred' } };
  }
}

export async function updateAboutPageContent(data: AboutPageData): Promise<ActionResult<{}>> {
  const validation = aboutPageSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, error: { message: "Validation failed", context: validation.error.flatten() } };
  }

  const reference = await docRef();
  
  try {
    await setDoc(reference, validation.data, { merge: true });
    revalidatePath('/about');
    revalidatePath('/admin/about');
    return { success: true, data: {} };
  } catch (serverError: any) {
    if (serverError.code === 'permission-denied') {
      return { 
        success: false, 
        error: { 
          message: 'permission-denied', 
          context: { 
            path: reference.path,
            operation: 'update',
            requestResourceData: validation.data
          } 
        } 
      };
    }
    console.error("Error setting document: ", serverError);
    return { success: false, error: { message: serverError.message || 'An unknown error occurred' } };
  }
}
