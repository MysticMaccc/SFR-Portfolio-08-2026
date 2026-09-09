export interface Profile {
  id: string;
  user_id: string;
  name: string;
  title: string;
  bio: string;
  phone: string;
  email: string;
  github: string;
  linkedin?: string;
  portfolio_url?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  category: string;
  url?: string;
  github_url?: string;
  image_url?: string;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  level: string;
  order_index: number;
  created_at: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description: string[];
  order_index: number;
  created_at: string;
}

export interface Training {
  id: string;
  title: string;
  provider: string;
  year?: string;
  certificate_url?: string;
  order_index: number;
  created_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  url: string;
  storage_path?: string;
  order_index: number;
  created_at: string;
}

export interface PortfolioData {
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  trainings: Training[];
}
