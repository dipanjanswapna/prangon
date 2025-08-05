
import { getFAQPageData } from './actions';
import { FAQPageForm } from '@/components/admin/faq-form';
import { FAQPageData } from '@/lib/types';

export default async function AdminFAQPage() {
  const faqData: FAQPageData = await getFAQPageData();

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Manage FAQ Page</h2>
        <p className="text-muted-foreground mb-8">
          Update the Frequently Asked Questions for the homepage here. Changes will be reflected live.
        </p>
        <FAQPageForm initialData={faqData} />
      </div>
    </div>
  );
}
