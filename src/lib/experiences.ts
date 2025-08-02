
export type Experience = {
    id: number;
    role: string;
    entity: string;
    period: string;
    category: 'Professional' | 'Freelance' | 'Content Creation' | 'Leadership';
    description: string[];
    achievements?: string[];
    link?: string;
};

export const experiences: Experience[] = [
    {
        id: 1,
        role: 'Founder & Lead Designer',
        entity: 'Prangon’s Ecosystem',
        period: '2021 - Present',
        category: 'Leadership',
        description: [
            'Leading a team to develop EdTech tools and creative learning content for students and educators globally.',
            'Overseeing all aspects of product design, from initial concept to final user interface.',
            'Developing branding and marketing strategies to grow the ecosystem.'
        ],
        achievements: [
            'Successfully launched two educational mobile apps with over 10,000+ downloads combined.',
            'Grew the community to over 5,000 active members across various platforms.'
        ],
    },
    {
        id: 2,
        role: 'Freelance UI/UX Designer',
        entity: 'Upwork & Fiverr',
        period: '2019 - Present',
        category: 'Freelance',
        description: [
            'Delivered over 50+ projects for international clients, focusing on user-centric design and branding.',
            'Specialized in creating responsive web designs and intuitive mobile app interfaces.',
            'Managed client communication, project timelines, and final asset delivery.'
        ],
        achievements: [
            'Maintained a 5-star rating across both platforms with excellent client feedback.',
            'Helped a startup client secure seed funding with a compelling app prototype designed in Figma.'
        ],
    },
    {
        id: 3,
        role: 'YouTube Content Creator',
        entity: 'The Untold',
        period: '2020 - Present',
        category: 'Content Creation',
        description: [
            'Creating educational and thought-provoking content on socio-political issues, technology, and design.',
            'Handling all aspects of video production: research, scripting, filming, editing, and promotion.',
            'Engaging with the community through comments and live streams to foster a positive and informative environment.'
        ],
        achievements: [
            'Grew the channel to 100K subscribers and over 5 million total views.',
            'Collaborated with other creators and organizations to produce impactful content.'
        ],
        link: 'https://www.youtube.com/@dipanjanswapna',
    },
    {
        id: 4,
        role: 'UI/UX Designer',
        entity: 'Tech Innovators Ltd.',
        period: 'Jan 2022 - Dec 2023',
        category: 'Professional',
        description: [
            'Worked within the product team to design new features for a flagship SaaS application.',
            'Conducted user research and usability testing to validate design concepts.',
            'Created wireframes, mockups, and interactive prototypes using Figma.',
            'Collaborated closely with developers to ensure faithful implementation of the designs.'
        ],
        achievements: [
            'Led the redesign of the user onboarding flow, resulting in a 20% increase in user retention.',
            'Contributed to a design system that improved consistency and development speed across the company.'
        ],
    },
];
