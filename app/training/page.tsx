import { fetchProfile, fetchTrainings } from '@/lib/fetchPortfolioData';
import Navigation from '@/components/portfolio/Navigation';
import Trainings from '@/components/portfolio/Trainings';
import Footer from '@/components/portfolio/Footer';

export default async function TrainingPage() {
  const [profile, trainings] = await Promise.all([
    fetchProfile(),
    fetchTrainings(),
  ]);

  return (
    <>
      <Navigation profile={profile} />
      <main className="pt-14 min-h-screen bg-white">
        <Trainings trainings={trainings} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
