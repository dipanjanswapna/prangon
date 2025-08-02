
'use server';

import { getFirestore } from '@/lib/firebaseAdmin';
import { Post } from '@/lib/blog';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import slugify from 'slugify';

const POSTS_COLLECTION = 'posts';
const firestore = getFirestore();

// Helper function to convert Firestore document to Post object
const postConverter = {
    toFirestore: (post: Omit<Post, 'slug' | 'date'> & { slug?: string; date?: string }) => {
        return post;
    },
    fromFirestore: (snapshot: FirebaseFirestore.DocumentSnapshot): Post => {
        const data = snapshot.data()!;
        return {
            slug: snapshot.id,
            title: data.title,
            description: data.description,
            tags: data.tags,
            coverImage: data.coverImage,
            author: data.author,
            date: data.createdAt.toDate().toISOString(), // Convert timestamp to string
            content: data.content,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }
};

export async function savePost(formData: FormData) {
    const title = formData.get('title') as string;
    const existingSlug = formData.get('slug') as string;

    const slug = existingSlug || slugify(title, { lower: true, strict: true });

    const postData = {
        title,
        description: formData.get('description') as string,
        coverImage: formData.get('coverImage') as string,
        content: formData.get('content') as string,
        tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
        author: {
            name: 'Dipanjan "Swapna Prangon" Prangon', // Hardcoded for now
            imageUrl: 'https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg'
        },
        updatedAt: new Date(),
    };

    const postsCollection = firestore.collection(POSTS_COLLECTION);
    const postRef = postsCollection.doc(slug);

    if (existingSlug) {
        await postRef.update(postData);
    } else {
        await postRef.set({
            ...postData,
            createdAt: new Date(),
        });
    }

    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    redirect('/admin/blog');
}


export async function getPosts(): Promise<Post[]> {
    const snapshot = await firestore.collection(POSTS_COLLECTION).orderBy('createdAt', 'desc').withConverter(postConverter).get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => doc.data());
}


export async function getPostBySlug(slug: string): Promise<Post | undefined> {
    const doc = await firestore.collection(POSTS_COLLECTION).doc(slug).withConverter(postConverter).get();
    if (!doc.exists) {
        return undefined;
    }
    return doc.data();
}


export async function deletePost(slug: string) {
    if (!slug) {
        throw new Error('Slug is required to delete a post.');
    }
    await firestore.collection(POSTS_COLLECTION).doc(slug).delete();
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
}
