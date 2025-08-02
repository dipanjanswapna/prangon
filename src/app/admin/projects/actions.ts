
'use server';

import { firestore } from '@/lib/firebaseAdmin';
import { Project } from '@/lib/projects';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import slugify from 'slugify';

const PROJECTS_COLLECTION = 'projects';

// Helper function to convert Firestore document to Project object
const projectConverter = {
    toFirestore: (project: Omit<Project, 'id' | 'slug'> & { id?: number; slug?: string }) => {
        return project;
    },
    fromFirestore: (snapshot: FirebaseFirestore.DocumentSnapshot): Project => {
        const data = snapshot.data()!;
        return {
            id: data.id, // Assuming id is stored in the document
            slug: snapshot.id,
            title: data.title,
            category: data.category,
            description: data.description,
            imageUrl: data.imageUrl,
            imageAiHint: data.imageAiHint,
            images: data.images,
            tags: data.tags,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }
};

export async function saveProject(formData: FormData) {
    const title = formData.get('title') as string;
    const existingId = formData.get('id') as string;
    
    let slug = formData.get('slug') as string;
    if (!slug) {
        slug = slugify(title, { lower: true, strict: true });
    }

    const projectData = {
        title,
        category: formData.get('category') as string,
        description: formData.get('description') as string,
        imageUrl: formData.get('imageUrl') as string,
        imageAiHint: (formData.get('imageAiHint') as string) || 'project image',
        images: (formData.get('images') as string).split(',').map(url => url.trim()),
        tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
        updatedAt: new Date(),
    };

    const projectsCollection = firestore.collection(PROJECTS_COLLECTION);
    const projectRef = projectsCollection.doc(slug);

    if (existingId) {
        await projectRef.update(projectData);
    } else {
        const newId = Date.now(); // Simple way to generate a numeric ID
        await projectRef.set({
            ...projectData,
            id: newId,
            createdAt: new Date(),
        });
    }

    revalidatePath('/admin/projects');
    revalidatePath('/work');
    revalidatePath(`/projects/${slug}`);
    redirect('/admin/projects');
}


export async function getProjects(): Promise<Project[]> {
    const snapshot = await firestore.collection(PROJECTS_COLLECTION).orderBy('createdAt', 'desc').withConverter(projectConverter).get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => doc.data());
}


export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
    const doc = await firestore.collection(PROJECTS_COLLECTION).doc(slug).withConverter(projectConverter).get();
    if (!doc.exists) {
        return undefined;
    }
    return doc.data();
}


export async function deleteProject(slug: string) {
    if (!slug) {
        throw new Error('Slug is required to delete a project.');
    }
    await firestore.collection(PROJECTS_COLLECTION).doc(slug).delete();
    revalidatePath('/admin/projects');
    revalidatePath('/work');
}
