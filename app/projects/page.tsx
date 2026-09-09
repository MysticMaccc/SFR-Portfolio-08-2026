import { fetchProfile, fetchProjects, fetchProjectImages } from '@/lib/fetchPortfolioData';
import Navigation from '@/components/portfolio/Navigation';
import Projects from '@/components/portfolio/Projects';
import Footer from '@/components/portfolio/Footer';

export default async function ProjectsPage() {
  const [profile, projects, projectImages] = await Promise.all([
    fetchProfile(),
    fetchProjects(),
    fetchProjectImages(),
  ]);

  return (
    <>
      <Navigation profile={profile} />
      <main className="pt-14 min-h-screen bg-[#FAFAFA]">
        <Projects projects={projects} projectImages={projectImages} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
