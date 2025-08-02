
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ProjectsTable } from '@/components/admin/projects-table';
import Link from 'next/link';
import { getProjects } from './actions';

export default async function AdminProjectsPage() {
    const projects = await getProjects();
    
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
                <div className="flex items-center space-x-2">
                    <Button asChild>
                        <Link href="/admin/projects/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Project
                        </Link>
                    </Button>
                </div>
            </div>
            <ProjectsTable projects={projects} />
        </div>
    );
}
