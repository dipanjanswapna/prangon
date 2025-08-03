
import { getSocialWorkPageData, updateSocialWorkPageData } from './actions';
import { SocialWorkPageForm } from '@/components/admin/social-work-form';
import { SocialWorkPageData } from '@/lib/types';

export default async function AdminSocialWorkPage() {
  const socialWorkData: SocialWorkPageData = await getSocialWorkPageData();

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Manage Social Work Page</h2>
        <p className="text-muted-foreground mb-8">
          Update the content for the 'Social Work' page here. Changes will be reflected live.
        </p>
        <SocialWorkPageForm initialData={socialWorkData} />
      </div>
    </div>
  );
}
