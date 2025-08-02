
'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Project } from '@/lib/projects';
import { saveProject } from '@/app/admin/projects/actions';
import { useToast } from '@/hooks/use-toast';

interface ProjectFormProps {
    project?: Project;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Project' : 'Create Project')}
        </Button>
    );
}

export function ProjectForm({ project }: ProjectFormProps) {
    const { toast } = useToast();
    const isEditing = !!project;

    const handleSubmit = async (formData: FormData) => {
        await saveProject(formData);
        toast({
            title: `Project ${project ? 'Updated' : 'Created'}!`,
            description: `The project "${formData.get('title')}" has been successfully saved.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{project ? 'Edit Project' : 'Create a new project'}</CardTitle>
                <CardDescription>Fill out the form below to {project ? 'update the' : 'add a new'} project.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-8">
                    {isEditing && <input type="hidden" name="id" value={project.id} />}
                    {isEditing && <input type="hidden" name="slug" value={project.slug} />}
                    
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="Project Title" defaultValue={project?.title} required />
                    </div>

                     <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" name="category" placeholder="e.g., UI/UX Design" defaultValue={project?.category} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="A brief description of the project" defaultValue={project?.description} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Cover Image URL</Label>
                        <Input id="imageUrl" name="imageUrl" placeholder="https://example.com/image.png" defaultValue={project?.imageUrl} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="imageAiHint">Cover Image AI Hint</Label>
                        <Input id="imageAiHint" name="imageAiHint" placeholder="e.g. project image" defaultValue={project?.imageAiHint} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="images">Gallery Images (comma-separated URLs)</Label>
                        <Textarea id="images" name="images" placeholder="https://..., https://..." defaultValue={project?.images?.join(', ')} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input id="tags" name="tags" placeholder="Figma, React, UI/UX" defaultValue={project?.tags?.join(', ')} required />
                    </div>

                    <SubmitButton isEditing={isEditing} />
                </form>
            </CardContent>
        </Card>
    );
}
