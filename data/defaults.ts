import { PortfolioData } from '../types';

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  // ── Hero ──────────────────────────────────────────────────────────────────
  heroTitle: "AI/ML Engineer & System Architect",
  heroSubtitle:
    "13+ years building robust systems — from automotive embedded software to cloud-native AI. " +
    "Now shipping production LLM applications and exploring the frontier of intelligent systems.",

  // ── Contact ───────────────────────────────────────────────────────────────
  email: "wang.ruiping0720@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/ruiping-wang-02322252/",
  location: "Singapore",

  // ── Projects ──────────────────────────────────────────────────────────────
  projects: [
    {
      id: "ai-receipt-reader",
      title: "AI Smart Receipt Reader",
      description:
        "Cloud-native expense tracker powered by LLM for OCR-based receipt data extraction.",
      longDescription:
        "A full-stack AI application that accepts receipt images and uses Smart OCR Routing to process receipt by Tesseract or vision/language model " +
        "to extract line items, totals, and merchant data. Built with a React/TypeScript frontend, " +
        "Python/Flask backend, and deployed to vercel. Includes a complete Playwright E2E test suite " +
        "integrated into a CI/CD pipeline for automated regression on every commit.",
      tags: ["Python", "Mistral AI", "LLM", "AWS", "React", "TypeScript", "Playwright", "CI/CD"],
      imageUrl:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2672&auto=format&fit=crop",
      githubUrl: "https://github.com/SophiaSama/AI-Receipt-Reader",
      features: [
        "Dynamically switches between Tesseract (free/local), Hybrid, and Vision LLM based on image quality to optimize for speed and cost",
        "LLM integration for intelligent OCR and structured data extraction",
        "React + TypeScript frontend with real-time upload and result display",
        "Python/Flask REST API backend with AWS deployment",
        "Playwright E2E test suite wired into CI/CD for automated quality gates",
        "Production-grade error handling, logging, and monitoring"
      ]
    },
    {
      id: "birs",
      title: "AEO Brand Integrity Robustness Suite (BIRS)",
      description:
        "Sandboxed LLM evaluation framework that tests how AI answer engines respond to adversarial brand data.",
      longDescription:
        "BIRS is a security research tool that creates isolated sandboxes to probe how large language models " +
        "and AI answer engines handle poisoned or adversarially manipulated brand information. " +
        "Runs entirely on local LLMs to prevent contaminating production models during testing. " +
        "Designed for brands and AI teams who need to audit the robustness of their AI-facing content.",
      tags: ["Python", "Local LLMs", "AI Security", "LLM Evaluation", "Prompt Engineering"],
      imageUrl:
        "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2670&auto=format&fit=crop",
      githubUrl: "https://github.com/SophiaSama",
      features: [
        "Isolated sandboxed evaluation environment — no contamination of public models",
        "Adversarial prompt injection testing against brand content",
        "Local LLM runner (Ollama-compatible) for fully offline evaluation",
        "Configurable test suite with scoring and reporting",
        "Applicable to AEO, SEO, and AI content integrity audits"
      ]
    },
    {
      id: "carkeydemo",
      title: "CarKeyDemo",
      description:
        "iOS implementation of digital car key technology using Apple CarKey and CCC Digital Key standards.",
      longDescription:
        "This project demonstrates high-security handshakes between mobile devices and vehicles using BLE and NFC. " +
        "It covers the full digital key lifecycle — secure pairing, authentication, and encrypted communication " +
        "protocols for next-generation vehicle access — fully compliant with Car Connectivity Consortium (CCC) standards.",
      tags: ["iOS", "Swift", "BLE", "NFC", "Automotive Security", "CCC Standards"],
      imageUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop",
      githubUrl: "https://github.com/SophiaSama/CarKeyDemo",
      features: [
        "Secure NFC/BLE handshake protocol implementation",
        "Digital Key provisioning and revocation lifecycle",
        "Compliance with Car Connectivity Consortium (CCC) standards",
        "Swift-based modular architecture for automotive SDKs"
      ]
    }
  ],

  // ── Work Experience ───────────────────────────────────────────────────────
  workExperience: [
    {
      company: "AUMOVIO",
      role: "System Architect",
      period: "Sep 2025 – Present",
      location: "Singapore · Hybrid",
      description:
        "Architecting secure ecosystems connecting vehicles, smart devices, and cloud backends " +
        "using UWB, BLE, and NFC. Translating complex OEM use cases into CCC/MFi/Google-compliant " +
        "system designs. Location AI agent champion — integrating LLM-based tools into engineering workflows.",
      tech: "Python, System Architecture, UWB, BLE, NFC, SysML, UML, LLMs"
    },
    {
      company: "Continental",
      role: "Senior System Engineer",
      period: "Jan 2022 – Sept 2025",
      location: "Singapore · Hybrid",
      description:
        "Developed system architecture for major automotive OEMs using MBSE, SysML, and UML. " +
        "Collaborated with OEM customers to define and customise system requirements; " +
        "designed proof-of-concept solutions via rapid prototyping and conducted design verification.",
      tech: "MBSE, SysML, UML, Python, System Architecture, Embedded Systems"
    },
    {
      company: "Dyson",
      role: "Senior Software Engineer",
      period: "May 2020 – Dec 2021",
      location: "Singapore · Hybrid",
      description:
        "Led test automation for Dyson cleaning robotics in C++ with TDD strategy. " +
        "Served as Scrum Master. Built CI/CD pipeline using Bamboo and " +
        "created Grafana dashboards for nightly build results visualisation.",
      tech: "C++, TDD, CI/CD, Bamboo, Grafana, Python, Agile/Scrum"
    },
    {
      company: "Dyson",
      role: "Advanced Software Test Engineer",
      period: "Jun 2018 – May 2020",
      location: "Singapore",
      description:
        "Designed and built Python automation framework for iOS/Android app integration testing — " +
        "achieved 80%+ automation coverage with high stability for nightly runs.",
      tech: "Python, iOS Testing, Android Testing, Test Automation, CI/CD"
    },
    {
      company: "Dyson",
      role: "Software Test Engineer",
      period: "Jun 2017 – Jun 2018",
      location: "Singapore",
      description:
        "Built embedded system test automation using NI TestStand and LabVIEW; " +
        "designed hardware-in-the-loop test environments achieving 80%+ regression automation.",
      tech: "NI TestStand, LabVIEW, Embedded Systems, Python"
    },
    {
      company: "Continental",
      role: "System Test Engineer",
      period: "Sep 2012 – Jun 2017",
      location: "Singapore",
      description:
        "Validated automotive software for OEM customers; developed and maintained test specifications, " +
        "executed manual and automated tests using CAPL and CANoe.",
      tech: "CAPL, CANoe, Automotive Software, System Testing"
    }
  ],

  // ── Education ─────────────────────────────────────────────────────────────
  education: [
    {
      degree: "Master of Science, Biomedical Engineering",
      school: "Nanyang Technological University",
      year: "2011 – 2012",
      details: "Dissertation in Droplet Microfluidics"
    },
    {
      degree: "Bachelor of Engineering, Electrical & Electronics Engineering",
      school: "Nanyang Technological University",
      year: "2006 – 2010",
      details: "Core focus on systems, control, and signal processing, FYP in Bioinformatics"
    }
  ],

  // ── Certifications ────────────────────────────────────────────────────────
  certifications: [
    // AI / ML
    "Google Prompting Essentials (2025)",
    "Machine Learning with Python — Coursera / IBM",
    "Deep Learning & Neural Networks with Keras — IBM",
    "Data Science Professional Certificate — Coursera",
    // Cloud & Dev
    "AWS Essential Training for Developers (2025)",
    "Developing AI Applications with Python and Flask — IBM",
    "React Basics — Coursera",
    "Web Development with HTML, CSS & JavaScript — IBM",
    // Engineering
    "ISTQB-BCS Certified Tester Foundation Level (CTFL)",
    "UX Design Foundations — Google"
  ],

  // ── Skills ────────────────────────────────────────────────────────────────
  skills: [
    // AI / ML
    "Python", "LLMs", "Keras", "Machine Learning",
    // Cloud & DevOps
    "AWS", "CI/CD", "Docker", "Playwright", "GitHub Actions", "Bamboo", "Grafana",
    // Frontend
    "React.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Flask",
    // Data
    "SQL", "Pandas", "Data Visualization", "Jupyter",
    // Systems
    "System Architecture", "MBSE", "SysML", "UML",
    "Embedded Systems", "C++", "Linux", "Shell Scripting",
    // Connectivity
    "UWB", "BLE", "NFC", "Automotive Security",
    // Methodology
    "Agile / Scrum", "TDD", "ISTQB CTFL"
  ],

  // ── Skills grouped by category (optional — for categorised skill display) ─
  skillCategories: [
    {
      category: "AI / ML",
      items: ["Python", "LLMs", "Keras", "Machine Learning"]
    },
    {
      category: "Cloud & DevOps",
      items: ["AWS", "CI/CD", "Docker", "Playwright", "GitHub Actions", "Bamboo", "Grafana"]
    },
    {
      category: "Frontend",
      items: ["React.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Flask"]
    },
    {
      category: "Systems & Architecture",
      items: ["System Architecture", "MBSE", "SysML", "UML", "Embedded Systems", "C++", "Linux", "Shell Scripting"]
    },
    {
      category: "Connectivity",
      items: ["UWB", "BLE", "NFC", "CCC Standards"]
    },
    {
      category: "Methodology",
      items: ["Agile / Scrum", "TDD", "ISTQB CTFL", "Scrum Master"]
    }
  ]
};