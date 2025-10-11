
import { getAboutPageContent } from './actions';
import { AboutPageForm } from '@/components/admin/about-page-form';
import { AboutPageData } from '@/lib/types';
import { redirect } from 'next/navigation';

export default async function AdminAboutPage() {
  const result = await getAboutPageContent();

  if (!result.success) {
    // This could be a permission error or other issue.
    // For now, redirecting or showing a generic error is a safe bet.
    // In a real app, you might want a more specific error page.
    console.error("Failed to load about page data for admin:", result.error);
    // For a permission error, you might redirect to login
    if (result.error.message === 'permission-denied') {
        redirect('/login');
    }
    return <div className="p-8">Error loading data. Please try again later.</div>;
  }
  
  const aboutPageData: AboutPageData = result.data;

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
