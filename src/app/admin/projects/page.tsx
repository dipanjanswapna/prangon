
import { getProjects } from './actions';
import { ProjectForm, DeleteProjectButton } from '@/components/admin/projects-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Manage Projects</h2>
                <p className="text-muted-foreground">
                Add, edit, or delete your professional projects.
                </p>
            </div>
            <ProjectForm />
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Existing Projects</CardTitle>
                <CardDescription>View and manage all your current projects.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Link</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {projects.length > 0 ? (
                            projects.map(project => (
                                <TableRow key={project.id}>
                                    <TableCell>
                                        <Image 
                                            src={project.imageUrl}
                                            alt={project.title}
                                            width={80}
                                            height={50}
                                            className="rounded-sm object-cover"
                                            data-ai-hint={project.imageAiHint}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{project.title}</TableCell>
                                    <TableCell>{project.client}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{project.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {project.link ? (
                                            <Link href={project.link} target="_blank">
                                                <Button variant="ghost" size="icon">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        ) : (
                                            'N/A'
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <ProjectForm projectToEdit={project} />
                                            <DeleteProjectButton id={project.id} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                         ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">No projects found.</TableCell>
                            </TableRow>
                         )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
