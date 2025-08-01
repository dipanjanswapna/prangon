import { AIDescriptionForm } from '@/components/ai-description-form';
import { BotMessageSquare } from 'lucide-react';

export default function AIDescriptionPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-primary/10 p-3 rounded-full mb-4">
             <BotMessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-headline">
            AI Description Assistant
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Struggling with words? Provide your project's name and details, and let our AI craft a compelling description for you.
          </p>
        </div>
        <AIDescriptionForm />
      </div>
    </div>
  );
}
