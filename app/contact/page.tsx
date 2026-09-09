import { fetchProfile } from '@/lib/fetchPortfolioData';
import Navigation from '@/components/portfolio/Navigation';
import Contact from '@/components/portfolio/Contact';
import Footer from '@/components/portfolio/Footer';

export default async function ContactPage() {
  const profile = await fetchProfile();

  return (
    <>
      <Navigation profile={profile} />
      <main className="pt-14 min-h-screen bg-[#FAFAFA]">
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
