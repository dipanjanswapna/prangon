

export type Project = {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  imageAiHint: string;
  images: string[];
  tags: string[];
  createdAt?: FirebaseFirestore.Timestamp;
  updatedAt?: FirebaseFirestore.Timestamp;
};
