
import { PortfolioData } from '../types';

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  heroTitle: "Systems Architecture, Secure Connectivity",
  heroSubtitle: "Welcome to my technical portfolio. I am a System Architect specializing in secure mobile-to-vehicle connectivity and automotive ecosystems.",
  email: "wang.ruiping0720@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/ruiping-wang-02322252/",
  location: "Singapore",
  projects: [
    {
      id: 'carkeydemo',
      title: 'CarKeyDemo',
      description: 'A comprehensive iOS implementation of digital car key technology using Apple CarKey and CCC Digital Key standards.',
      longDescription: 'This project demonstrates high-security handshakes between mobile devices and vehicles using BLE and NFC. It covers the full digital key lifecycle, including secure pairing, authentication, and encrypted communication protocols for next-generation vehicle access.',
      tags: ['iOS', 'Swift', 'BLE', 'NFC', 'Automotive Security', 'CCC Standards'],
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop',
      githubUrl: 'https://github.com/SophiaSama/CarKeyDemo',
      features: [
        'Secure NFC/BLE handshake protocol implementation',
        'Digital Key provisioning and revocation lifecycle',
        'Compliance with Car Connectivity Consortium (CCC) standards',
        'Swift-based modular architecture for automotive SDKs'
      ]
    }
  ],
  workExperience: [
    {
      company: "Aumovio Automotive",
      role: "System Architect",
      period: "2025 - Present",
      description: "Leading the architectural design for secure connectivity modules. Specialized in UWB/BLE integration for major OEMs.",
      tech: "UML, SysML, Python, C++, Automotive Security"
    }
  ],
  education: [
    {
      degree: "Bachelor of Engineering",
      school: "Nanyang Technological University",
      year: "2013",
      details: "Focus on Systems and Control"
    }
  ],
  certifications: ["ISTQB Certified Tester", "Certified System Architect"],
  skills: ['Systems Design', 'MBSE', 'Automotive Security', 'UWB', 'BLE', 'NFC']
};
