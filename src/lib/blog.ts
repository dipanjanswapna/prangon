
export type Post = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  coverImage: string;
  author: {
      name: string;
      imageUrl: string;
  };
  date: string;
  content: string; // HTML content
};

export const posts: Post[] = [
  {
    slug: 'the-future-of-edtech',
    title: 'The Future of EdTech: Trends to Watch in 2025',
    description: 'A deep dive into the emerging technologies and pedagogical shifts that are shaping the future of education.',
    tags: ['EdTech', 'Innovation', 'Future'],
    coverImage: 'https://placehold.co/1200x600.png',
    author: {
        name: 'Dipanjan "Swapna Prangon" Prangon',
        imageUrl: 'https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg'
    },
    date: '2025-07-20',
    content: `
      <h2>The Personalized Learning Revolution</h2>
      <p>One of the most significant trends is the move towards hyper-personalized learning paths. AI-powered platforms can now adapt to individual student needs in real-time, offering tailored content and assessments. This is a game-changer for classrooms with diverse learning styles.</p>
      
      <h2>Gamification and Immersive Learning</h2>
      <p>Virtual and Augmented Reality are no longer science fiction. These technologies are creating immersive learning experiences that were previously impossible. Imagine a history class where students can walk through ancient Rome or a biology class where they can dissect a virtual frog. Gamification elements are also being integrated to increase engagement and motivation.</p>

      <blockquote>"The goal of education is not to increase the amount of knowledge but to create the possibilities for a child to invent and discover, to create men who are capable of doing new things." - Jean Piaget</blockquote>
      
      <h2>The Role of Data Analytics</h2>
      <p>Data is the new oil, and in education, it's fueling a new wave of data-driven instruction. Teachers can now track student progress with incredible detail, identify learning gaps early, and intervene with targeted support. This not only improves student outcomes but also empowers educators to refine their teaching strategies.</p>
    `
  },
  {
    slug: 'creative-design-in-branding',
    title: 'Why Creative Design is Crucial for Modern Branding',
    description: 'Exploring the intersection of art and commerce, and how powerful visual storytelling can elevate a brand from ordinary to iconic.',
    tags: ['Design', 'Branding', 'Marketing'],
    coverImage: 'https://placehold.co/1200x600.png',
    author: {
        name: 'Dipanjan "Swapna Prangon" Prangon',
        imageUrl: 'https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg'
    },
    date: '2025-06-15',
    content: `
        <h2>First Impressions Matter</h2>
        <p>In a crowded marketplace, your brand's visual identity is often the first point of contact with a potential customer. A strong, cohesive design language immediately communicates professionalism and builds trust. It's not just about a pretty logo; it's about creating an entire visual ecosystem that tells your brand's story.</p>

        <h2>Emotional Connection Through Visuals</h2>
        <p>Great design evokes emotion. The colors, shapes, and typography you choose all contribute to the personality of your brand. Are you playful and energetic? Minimalist and sophisticated? Your design choices should reflect this and resonate with your target audience on an emotional level.</p>
        
        <p>Consider iconic brands like Apple or Nike. Their design is so deeply ingrained in their identity that you can recognize them from a single element. That's the power of consistent, creative branding.</p>
    `
  },
  {
    slug: 'bridging-divides-with-technology',
    title: 'How Technology Can Bridge Social and Political Divides',
    description: 'An optimistic look at how digital tools and platforms can foster dialogue, understanding, and collaboration across different communities.',
    tags: ['Technology', 'Society', 'Politics'],
    coverImage: 'https://placehold.co/1200x600.png',
    author: {
        name: 'Dipanjan "Swapna Prangon" Prangon',
        imageUrl: 'https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg'
    },
    date: '2025-05-30',
    content: `
        <h2>The Challenge of the Echo Chamber</h2>
        <p>Social media algorithms are often criticized for creating echo chambers, where we are only exposed to opinions that confirm our own biases. However, new platforms are emerging that are designed to do the opposite. They intentionally connect people with different viewpoints in structured, moderated conversations.</p>

        <h2>Citizen Journalism and Transparency</h2>
        <p>Technology has empowered ordinary citizens to report on events in their communities, providing a check on traditional media and government narratives. While this comes with its own set of challenges, like the spread of misinformation, it also has the potential to increase transparency and hold power to account.</p>

        <h2>Collaborative Problem-Solving</h2>
        <p>From crowdsourcing crisis response during natural disasters to online platforms for participatory budgeting, technology is enabling new forms of collaboration. These tools can help build a sense of shared purpose and collective efficacy, which are essential for bridging divides and building stronger communities.</p>
    `
  },
];

export const getPostBySlug = (slug: string): Post | undefined => {
  return posts.find((post) => post.slug === slug);
};
