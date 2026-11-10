import { PortfolioData } from '../types';

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  // ── Hero ──────────────────────────────────────────────────────────────────
  heroTitle: "System Architect",
  heroSubtitle:
    "13+ years across automotive software, system validation, and architecture, with recent work in AI-enabled applications and engineering tools.",

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
      demoUrl: "https://smart-receipt-reader.vercel.app",
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
      id: "agent-skills-usage-tracking",
      title: "Agent Skill Usage Tracker",
      description:
        "Local-only observability tool that tracks which skills coding agents load across sessions to identify unused tools.",
      longDescription:
        "A privacy-focused, local-only developer tool that monitors skill and tool utilization across coding agents " +
        "including GitHub Copilot, Claude Code, Antigravity, Pi Agent, Hermes Agent, and Codex. " +
        "Features dual-path ingestion via non-blocking real-time hooks and historical transcript synchronization, " +
        "multi-strategy detection, and an interactive standalone HTML dashboard to audit and prune unused skills.",
      tags: ["Python", "AI Agents", "Observability", "SQLite", "Analytics", "Developer Tools"],
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
      githubUrl: "https://github.com/SophiaSama/agent-skills-usage-tracking",
      features: [
        "Multi-agent support across GitHub Copilot, Claude Code, Antigravity, Pi Agent, Hermes Agent, and Codex",
        "Dual-path ingestion via non-blocking live lifecycle hooks and historical transcript log synchronization",
        "Multi-strategy skill detection via SKILL.md reads, user slash commands, tool invocations, and session baselines",
        "Interactive standalone HTML dashboard to inspect skill usage frequency and clean up unobserved skills",
        "Privacy-preserving architecture running 100% locally with zero external network or cloud dependencies"
      ]
    },
    {
      id: "meeting-notes-generator",
      title: "Meeting Notes Helper",
      description:
        "Multimodal meeting intelligence pipeline transforming video recordings and transcripts into structured minutes, visual reports, and interactive Q&A.",
      longDescription:
        "A local Gradio application and Model Context Protocol (MCP) server that ingests meeting video recordings or text transcripts " +
        "to produce structured Markdown minutes, visual HTML reports, and interactive Q&A grounded in transcript evidence. " +
        "Features concurrent OCR video frame extraction and audio transcription, overlap-aware chunking, map-reduce summarization, " +
        "and deep reasoning model integration.",
      tags: ["Python", "FastMCP", "Gemini", "OpenAI", "Gradio", "Docker", "Multimodal", "OCR"],
      imageUrl:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2670&auto=format&fit=crop",
      githubUrl: "https://github.com/SophiaSama/meeting-notes-generator",
      features: [
        "Multimodal video and transcript ingestion with automatic slide extraction and concurrent OCR text recognition",
        "Native Google GenAI audio transcription (Gemini 3.5 with diarization) and OpenAI-compatible speech endpoints",
        "Interactive meeting Q&A chatbot grounded in minutes, per-frame OCR metadata, and transcript evidence",
        "Scalable map-reduce summarization pipeline with sync execution and OpenAI Batch API support",
        "First-class Model Context Protocol (MCP) server providing stdio and SSE transports for AI assistants",
        "Production-ready Docker containerization with multi-stage uv caching and GitHub Actions CI"
      ]
    },
    {
      id: "Manufacturing-Assistant-Agent-Framework",
      title: "Manufacturing Assistant Agent Framework",
      description:
        "Production-grade, role-aware agentic decision support framework for manufacturing featuring LangGraph orchestration and deterministic RAG.",
      longDescription:
        "An enterprise agentic decision support framework engineered for mission-critical manufacturing operations (Apex Automotive flagship benchmark). " +
        "Features domain-adaptive LangGraph state machine orchestration, AST-validated text-to-SQL execution via SQLGlot, " +
        "multi-format document ingestion, GraphRAG hybrid retrieval, System One semantic reranking, and human-in-the-loop (HITL) safety policy gates.",
      tags: ["Python", "LangGraph", "LangChain", "RAG", "GraphRAG", "SQLGlot", "FastAPI", "Enterprise AI"],
      imageUrl:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop",
      githubUrl: "https://github.com/SophiaSama/Manufacturing-Assistant-Agent-Framework",
      features: [
        "Domain-adaptive LangGraph state machine orchestration with declarative domain packs and HITL policy gates",
        "AST-validated read-only text-to-SQL engine via SQLGlot and SQLite adapter preventing injection risks",
        "Multi-format document ingestion pipeline for SOPs, machine specs, and fault codes with path-based RBAC clearance",
        "Hybrid GraphRAG retrieval combining vector search, NetworkX knowledge graph BFS, and semantic reranking",
        "Multi-tier caching, Headroom context compression, and OpenTelemetry distributed tracing and token telemetry",
        "Automated evaluation suite with deterministic grounding verification, DeepEval metrics, and multi-model arena"
      ]
    },
    {
      id: "multi-agent-medical-assistant",
      title: "HealthAgent AI - Multi-Agent Medical Assistant",
      description:
        "Medical consultation web app that orchestrates six Gemini agents to triage symptoms, suggest OTC care, find nearby clinics, and persist patient history.",
      longDescription:
        "A full-stack TypeScript application that coordinates specialized medical-support agents across a structured consultation flow. " +
        "The system combines React 19 and Vite on the frontend with an Express backend, Gemini 2.5 Flash Lite for orchestration, " +
        "Supabase for authentication and patient-history persistence, and Google Maps Places for clinic discovery. " +
        "It produces typed JSON medical-advice responses and includes integration-test and containerized deployment support.",
      tags: ["TypeScript", "React", "Gemini", "Express", "Supabase", "Google Maps", "Vercel"],
      imageUrl:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2670&auto=format&fit=crop",
      githubUrl: "https://github.com/SophiaSama/Multi-agent-Medical-Assistant",
      demoUrl: "https://multi-agent-medical-assistant-lilac.vercel.app/",
      features: [
        "Six-agent consultation pipeline with sequential intake, parallel specialist analysis, and synthesized structured output",
        "Gemini-powered risk assessment, OTC guidance, follow-up planning, and typed JSON response validation",
        "Supabase-backed email authentication plus patient-history read/write for repeat consultations",
        "Google Places integration for nearby clinic discovery within the consultation experience",
        "Production-minded TypeScript stack with Express API, Vercel deployment, Docker support, and integration tests"
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
        "system designs. Location AI agent champion — advocate the team in AI adoption, integrate LLM-based tools into engineering workflows.",
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
      details: "Core focus on systems, control, and signal processing, FYP in Machine Learning application in Bioinformatics"
    }
  ],

  // ── Certifications ────────────────────────────────────────────────────────
  certifications: [
    // AI / ML
    "AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents (2026)",
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
    "Python", "LLMs", "LLM Engineering", "RAG", "QLoRA", "AI Agents", "Keras", "Machine Learning",
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
      items: ["Python", "LLMs", "LLM Engineering", "RAG", "QLoRA", "AI Agents", "Keras", "Machine Learning"]
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