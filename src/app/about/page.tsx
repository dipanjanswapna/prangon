import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
  const skills = ['UI/UX Design', 'Web Design', 'Branding', 'Figma', 'Next.js', 'Tailwind CSS', 'Prototyping'];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <Avatar className="h-32 w-32 border-4 border-background ring-4 ring-primary">
                <AvatarImage src="https://placehold.co/200x200.png" alt="Designer's profile picture" data-ai-hint="profile picture" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-4xl font-bold font-headline tracking-tight">About Me</h1>
            <p className="text-xl text-muted-foreground mt-2">I'm Jane Doe, a passionate designer and developer.</p>
          </CardHeader>
          <CardContent className="text-lg text-foreground/80 space-y-6 px-6 md:px-12 pb-12">
            <p>
              I specialize in creating beautiful, functional, and user-centered digital experiences. With a background in both design and front-end development, I bridge the gap between aesthetics and technology to build products that are not only visually stunning but also intuitive and performant.
            </p>
            <p>
              My design philosophy is rooted in minimalism and clarity. I believe that great design is about removing the unnecessary, allowing the core message and functionality to shine. I'm constantly learning and exploring new technologies to push the boundaries of what's possible on the web.
            </p>
            <div>
              <h3 className="text-2xl font-semibold font-headline mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
