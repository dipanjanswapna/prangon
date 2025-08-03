
import { getAboutPageContent } from './actions';
import { AboutPageForm } from '@/components/admin/about-page-form';
import { AboutPageData } from '@/lib/types';

export default async function AdminAboutPage() {
  const aboutPageData: AboutPageData = await getAboutPageContent();

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Manage About Page</h2>
        <p className="text-muted-foreground mb-8">
          Update the content for the 'About' page here. Changes will be reflected live.
        </p>
        <AboutPageForm initialData={aboutPageData} />
      </div>
    </div>
  );
}
