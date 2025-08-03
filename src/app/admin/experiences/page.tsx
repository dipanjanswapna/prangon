
import { getExperiences } from './actions';
import { ExperienceForm, DeleteExperienceButton } from '@/components/admin/experiences-form';
import { Briefcase, Award, Users, Wand2, Calendar, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const categoryStyles: any = {
    Professional: { icon: Briefcase, color: 'text-blue-500' },
    Freelance: { icon: Wand2, color: 'text-green-500' },
    'Content Creation': { icon: Users, color: 'text-red-500' },
    Leadership: { icon: Award, color: 'text-yellow-500' },
};

export default async function AdminExperiencesPage() {
  const experiences = await getExperiences();

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Manage Experiences</h2>
                <p className="text-muted-foreground">
                Add, edit, or delete your professional experiences.
                </p>
            </div>
            <ExperienceForm />
        </div>

        <div className="relative">
            <div className="absolute left-6 top-0 h-full w-px bg-border" />
             <div className="space-y-12">
                {experiences.length > 0 ? (
                    experiences.map(exp => {
                        const CategoryIcon = categoryStyles[exp.category]?.icon || Briefcase;
                        const categoryColor = categoryStyles[exp.category]?.color || 'text-primary';

                        return (
                            <div key={exp.id} className="flex items-start gap-4 md:gap-8">
                                <div className="flex flex-col items-center">
                                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-full bg-muted", categoryColor)}>
                                        <CategoryIcon className="h-6 w-6" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle>{exp.role}</CardTitle>
                                                    <CardDescription>{exp.entity}</CardDescription>
                                                </div>
                                                <div className="flex gap-2">
                                                    <ExperienceForm experienceToEdit={exp} />
                                                    <DeleteExperienceButton id={exp.id} />
                                                </div>
                                            </div>
                                             <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                                                <Badge variant="secondary">{exp.category}</Badge>
                                               <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /><span>{exp.period}</span></div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="list-disc space-y-2 pl-5">
                                                {exp.description.map((desc, index) => (
                                                    <li key={index}>{desc}</li>
                                                ))}
                                            </ul>
                                            {exp.achievements && exp.achievements.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="font-semibold mb-2">Key Achievements:</h4>
                                                    <ul className="list-disc space-y-2 pl-5">
                                                        {exp.achievements.map((ach, index) => (
                                                            <li key={index}>{ach}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {exp.link && (
                                                <div className="mt-4">
                                                <Link href={exp.link} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="outline" size="sm">
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        View Project
                                                    </Button>
                                                </Link>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="pl-16">
                        <p className="text-muted-foreground text-center">No experiences found.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
