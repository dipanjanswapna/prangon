
'use client';
import { getProjectBySlug } from '@/app/admin/projects/actions';
import { Project } from '@/lib/projects';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type ProjectPageProps = {
  params: {
    slug: string;
  };
};

const LoadingSkeleton = () => (
  <div className="max-w-4xl mx-auto">
    <div className="mb-8">
      <Skeleton className="h-6 w-32" />
    </div>
    <main>
      <div className="text-center mb-12">
          <Skeleton className="h-6 w-24 rounded-full mx-auto mb-4" />
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-8 w-full max-w-2xl mx-auto" />
      </div>
      <div className="space-y-8">
        <Card className="overflow-hidden"><Skeleton className="h-[500px] w-full" /></Card>
        <Card className="overflow-hidden"><Skeleton className="h-[500px] w-full" /></Card>
      </div>
    </main>
  </div>
);

export default function ProjectPage({ params }: ProjectPageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const fetchedProject = await getProjectBySlug(params.slug);
        if (fetchedProject) {
          setProject(fetchedProject);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to fetch project", error);
        // Handle error state if necessary
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [params.slug]);


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!project) {
    // This will be handled by notFound() in useEffect, but as a fallback
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Link href="/work/projects" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </div>

      <main>
        <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">{project.category}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 font-headline">{project.title}</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">{project.description}</p>
        </div>

        <div className="space-y-8">
          {project.images.map((image, index) => (
            <Card key={index} className="overflow-hidden">
                <Image
                src={image}
                alt={`${project.title} image ${index + 1}`}
                width={1200}
                height={800}
                data-ai-hint="project image"
                className="w-full h-auto object-cover"
                />
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
