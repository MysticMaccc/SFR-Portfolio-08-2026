import { fetchProfile, fetchSkills } from '@/lib/fetchPortfolioData';
import Navigation from '@/components/portfolio/Navigation';
import Skills from '@/components/portfolio/Skills';
import Footer from '@/components/portfolio/Footer';

export default async function SkillsPage() {
  const [profile, skills] = await Promise.all([
    fetchProfile(),
    fetchSkills(),
  ]);

  return (
    <>
      <Navigation profile={profile} />
      <main className="pt-14 min-h-screen bg-[#FAFAFA]">
        <Skills skills={skills} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
