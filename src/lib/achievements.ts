
export type Achievement = {
    id: number;
    title: string;
    issuer: string;
    date: string;
    description: string;
    category: 'Award' | 'Certification' | 'Academic' | 'Leadership';
    icon?: React.ReactNode;
    link?: string;
    imageUrl?: string;
    imageAiHint?: string;
};

export const achievements: Achievement[] = [
    {
        id: 1,
        title: 'National Science Fair Winner',
        issuer: 'Ministry of Science and Technology',
        date: '2018',
        description: 'Awarded first place for an innovative project on renewable energy solutions for rural areas.',
        category: 'Award',
        imageUrl: 'https://placehold.co/600x400.png',
        imageAiHint: 'award ceremony',
    },
    {
        id: 2,
        title: 'Inter-University Debate Champion',
        issuer: 'National Debate Federation',
        date: '2019',
        description: 'Recognized for outstanding performance, critical thinking, and persuasive speaking skills in the national championship.',
        category: 'Leadership',
        imageUrl: 'https://placehold.co/600x400.png',
        imageAiHint: 'debate competition',
    },
    {
        id: 3,
        title: 'Google Certified UX Designer',
        issuer: 'Google',
        date: '2022',
        description: 'Completed the professional certificate for UX Design, covering the entire design process from research to high-fidelity prototyping.',
        category: 'Certification',
        link: '#',
        imageUrl: 'https://placehold.co/600x400.png',
        imageAiHint: 'certificate document',
    },
     {
        id: 4,
        title: 'Top Rated Freelancer',
        issuer: 'Upwork',
        date: '2021',
        description: 'Achieved Top Rated status for consistently delivering high-quality work and maintaining excellent client satisfaction.',
        category: 'Award',
        imageUrl: 'https://placehold.co/600x400.png',
        imageAiHint: 'freelancer award',
    },
     {
        id: 5,
        title: 'Academic Scholarship for Excellence',
        issuer: 'Dhaka University',
        date: '2020',
        description: 'Received a merit-based scholarship for outstanding academic performance in the computer science department.',
        category: 'Academic',
        imageUrl: 'https://placehold.co/600x400.png',
        imageAiHint: 'scholarship letter',
    },
     {
        id: 6,
        title: 'Certified JavaScript Developer',
        issuer: 'FreeCodeCamp',
        date: '2021',
        description: 'Successfully completed the "JavaScript Algorithms and Data Structures" certification, demonstrating proficiency in core JS concepts.',
        category: 'Certification',
        link: '#',
        imageUrl: 'https://placehold.co/600x400.png',
        imageAiHint: 'javascript certificate',
    }
];
