export type Project = {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  imageAiHint: string;
  images: string[];
};

export const projects: Project[] = [
  {
    id: 1,
    slug: 'aura-app',
    title: 'Aura Health App',
    category: 'UI/UX Design',
    description: 'A conceptual mobile application designed to promote mental well-being through guided meditations and mindfulness exercises. The focus was on creating a calming and intuitive user interface.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'mobile app',
    images: ['https://placehold.co/800x600.png', 'https://placehold.co/800x600.png'],
  },
  {
    id: 2,
    slug: 'nova-branding',
    title: 'Nova Branding Identity',
    category: 'Branding',
    description: 'A complete branding identity for a fictional tech startup, Nova. The project included logo design, color palette selection, typography, and marketing material templates.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'brand identity',
    images: ['https://placehold.co/800x600.png', 'https://placehold.co/800x600.png'],
  },
  {
    id: 3,
    slug: 'horizon-website',
    title: 'Horizon E-commerce',
    category: 'Web Design',
    description: 'A responsive e-commerce website design for a modern furniture store. The layout is clean, minimalist, and focuses on high-quality product imagery to enhance the shopping experience.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'website design',
    images: ['https://placehold.co/800x600.png', 'https://placehold.co/800x600.png'],
  },
  {
    id: 4,
    slug: 'origin-packaging',
    title: 'Origin Coffee Packaging',
    category: 'Packaging Design',
    description: 'Packaging design for a premium coffee brand. The design uses earthy tones and minimalist typography to convey the brand\'s commitment to organic and high-quality beans.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'coffee packaging',
    images: ['https://placehold.co/800x600.png', 'https://placehold.co/800x600.png'],
  },
  {
    id: 5,
    slug: 'nexus-dashboard',
    title: 'Nexus Analytics Dashboard',
    category: 'UI/UX Design',
    description: 'A data visualization dashboard for a business analytics platform. The UI is designed to be data-dense yet easy to navigate, with customizable widgets and clear visual hierarchies.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'dashboard ui',
    images: ['https://placehold.co/800x600.png', 'https://placehold.co/800x600.png'],
  },
  {
    id: 6,
    slug: 'folio-photography',
    title: 'Folio Photography Portfolio',
    category: 'Web Design',
    description: 'A personal portfolio website for a photographer, featuring a full-screen, image-forward design. The user experience is focused on creating an immersive visual journey through the artist\'s work.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'photography portfolio',
    images: ['https://placehold.co/800x600.png', 'https://placehold.co/800x600.png'],
  },
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((project) => project.slug === slug);
};
