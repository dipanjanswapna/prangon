
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
  createdAt?: FirebaseFirestore.Timestamp;
  updatedAt?: FirebaseFirestore.Timestamp;
};
