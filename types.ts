export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  imageUrl: string;
  githubUrl: string;
  demoUrl?: string;
  features: string[];
}

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  description: string;
  tech: string;
}

export interface Education {
  degree: string;
  school: string;
  year: string;
  details?: string;
}

export interface PortfolioData {
  heroTitle: string;
  heroSubtitle: string;
  email: string;
  linkedinUrl: string;
  location: string;
  projects: Project[];
  workExperience: WorkExperience[];
  education: Education[];
  certifications: string[];
  skills: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
}
