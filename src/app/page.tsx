import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/projects';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-headline">
          Creative Works
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          A curated selection of my projects. Each piece reflects my passion for
          clean design and user-centered experiences.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Link href={`/projects/${project.slug}`} key={project.id} className="group">
            <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-2 flex flex-col">
              <CardHeader className="p-0">
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    width={600}
                    height={400}
                    data-ai-hint={project.imageAiHint}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="text-2xl font-semibold font-headline mb-2">{project.title}</CardTitle>
                <p className="text-muted-foreground line-clamp-3">{project.description}</p>
              </CardContent>
              <CardFooter>
                 <Badge variant="secondary">{project.category}</Badge>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
