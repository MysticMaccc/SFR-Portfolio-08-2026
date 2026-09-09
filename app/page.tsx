import { fetchProfile } from '@/lib/fetchPortfolioData';
import Navigation from '@/components/portfolio/Navigation';
import Hero from '@/components/portfolio/Hero';
import Footer from '@/components/portfolio/Footer';

export default async function HomePage() {
  const profile = await fetchProfile();

  return (
    <>
      <Navigation profile={profile} />
      <main>
        <Hero profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
