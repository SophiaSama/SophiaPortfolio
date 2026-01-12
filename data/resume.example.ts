import { Project } from '../types';

/**
 * THIS IS A TEMPLATE FILE.
 * 
 * To run the app locally with real data:
 * 1. Duplicate this file and rename it to 'resume.ts' inside the 'data' folder.
 * 2. Fill in your real information in 'resume.ts'.
 * 3. 'resume.ts' is ignored by git, keeping your data private.
 */

export const EMAIL = "contact@example.com";
export const LINKEDIN_URL = "https://www.linkedin.com/";
export const LOCATION = "City, Country";

export const HERO_TITLE = "Showcasing Systems Architecture";
export const HERO_SUBTITLE = "I'm [Name]. This space is dedicated to my technical side projects and explorations.";

export const PROJECTS: Project[] = [
  {
    id: 'demo-project',
    title: 'Demo Project',
    description: 'A demonstration project showcasing technical skills.',
    longDescription: 'This is a placeholder description for a project.',
    tags: ['Tech 1', 'Tech 2'],
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop',
    githubUrl: 'https://github.com',
    features: [
      'Feature 1',
      'Feature 2'
    ]
  }
];

export const WORK_EXPERIENCE = [
  {
    company: "Tech Corp",
    role: "Senior Engineer",
    period: "2020 - Present",
    description: "Leading system design and implementation.",
    tech: "System Design, Cloud, AI"
  }
];

export const EDUCATION = [
  {
    degree: "B.Sc. Computer Science",
    school: "University Name",
    year: "2020",
    details: "Honors"
  }
];

export const CERTIFICATIONS = [
  "Certification A",
  "Certification B"
];

export const SKILLS = [
  "Languages: English",
  "Tools: Git, VS Code"
];