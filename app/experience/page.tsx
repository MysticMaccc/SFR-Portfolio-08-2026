import { fetchProfile, fetchExperiences } from '@/lib/fetchPortfolioData';
import Navigation from '@/components/portfolio/Navigation';
import Experience from '@/components/portfolio/Experience';
import Footer from '@/components/portfolio/Footer';

export default async function ExperiencePage() {
  const [profile, experiences] = await Promise.all([
    fetchProfile(),
    fetchExperiences(),
  ]);

  return (
    <>
      <Navigation profile={profile} />
      <main className="pt-14 min-h-screen bg-white">
        <Experience experiences={experiences} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
