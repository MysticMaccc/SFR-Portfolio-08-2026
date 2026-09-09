import { fetchProfile, fetchExperiences } from '@/lib/fetchPortfolioData';
import Navigation from '@/components/portfolio/Navigation';
import About from '@/components/portfolio/About';
import Footer from '@/components/portfolio/Footer';

export default async function AboutPage() {
  const [profile, experiences] = await Promise.all([
    fetchProfile(),
    fetchExperiences(),
  ]);

  return (
    <>
      <Navigation profile={profile} />
      <main className="pt-14 min-h-screen bg-white">
        <About profile={profile} experiences={experiences} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
