
import { getHomePageContent } from './actions';
import { HomePageForm } from '@/components/admin/home-page-form';
import { HomePageData } from '@/lib/types';

export default async function AdminHomePage() {
  const homePageData: HomePageData = await getHomePageContent();

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Manage Home Page</h2>
        <p className="text-muted-foreground mb-8">
          Update the content for the main landing page here. Changes will be reflected live.
        </p>
        <HomePageForm initialData={homePageData} />
      </div>
    </div>
  );
}
