
import { getProjectBySlug } from '@/app/admin/projects/actions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

type ProjectPageProps = {
  params: {
    slug: string;
  };
};


export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Link href="/work" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Work
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
