import { createClient } from '@/lib/supabase/server';
import { defaultPortfolioData } from '@/lib/defaultData';
import type { Profile, Project, Skill, Experience, Training, ProjectImage } from '@/types';

export async function fetchProfile(): Promise<Profile> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('profiles').select('*').single();
    return data ?? defaultPortfolioData.profile!;
  } catch {
    return defaultPortfolioData.profile!;
  }
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('projects').select('*').order('order_index');
    return data?.length ? data : defaultPortfolioData.projects;
  } catch {
    return defaultPortfolioData.projects;
  }
}

export async function fetchSkills(): Promise<Skill[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('skills').select('*').order('order_index');
    return data?.length ? data : defaultPortfolioData.skills;
  } catch {
    return defaultPortfolioData.skills;
  }
}

export async function fetchExperiences(): Promise<Experience[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('experiences').select('*').order('order_index');
    return data?.length ? data : defaultPortfolioData.experiences;
  } catch {
    return defaultPortfolioData.experiences;
  }
}

export async function fetchTrainings(): Promise<Training[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('trainings').select('*').order('order_index');
    return data?.length ? data : defaultPortfolioData.trainings;
  } catch {
    return defaultPortfolioData.trainings;
  }
}

export async function fetchProjectImages(): Promise<Record<string, ProjectImage[]>> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('project_images')
      .select('*')
      .order('order_index');
    const grouped: Record<string, ProjectImage[]> = {};
    (data ?? []).forEach((img: ProjectImage) => {
      if (!grouped[img.project_id]) grouped[img.project_id] = [];
      grouped[img.project_id].push(img);
    });
    return grouped;
  } catch {
    return {};
  }
}
