
'use client';

import { ProjectForm } from '@/components/admin/project-form';
import { getProjectBySlug } from '@/lib/projects';
import { notFound } from 'next/navigation';

export default function EditProjectPage({ params }: { params: { slug: string } }) {
    const project = getProjectBySlug(params.slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Edit Project</h2>
            </div>
            <ProjectForm project={project} />
        </div>
    );
}
