export type ProjectLink = {
  label: "Live" | "Code" | "Download";
  href: string;
};

/** Which section of the page a project is listed under. */
export type ProjectCategory = "internship" | "freelance" | "personal";

export type Project = {
  /**
   * Stable slug. Used to reference a project from places that must not break
   * when copy is edited — notably the story-mode artifact map in
   * `lib/story/script.ts`. Never rename an existing id.
   */
  id: string;
  title: string;
  category: ProjectCategory;
  /** Short line describing my part, shown above the description. */
  role?: string;
  description: string;
  image?: string;
  /** What the image actually shows, for screen readers. */
  imageAlt?: string;
  tags: string[];
  links: ProjectLink[];
};

export const projects: Project[] = [
  // ── Internship · Flutter Frog ─────────────────────────────────────────
  {
    id: "redstar",
    title: "RedStar Rewardz",
    category: "internship",
    role: "Lead developer",
    description:
      "A B2B loyalty and field-sales platform for RedStar Edgebands: a web admin dashboard plus retailer and field-sales mobile apps. It serves 256 retailers and 48 sales reps, and has processed ₹1.8 Cr+ in collections and order bookings.",
    image: "/assets/projects/redstar.webp",
    imageAlt: "RedStar Rewardz logo above its three apps: admin dashboard, retailer app and field-sales app",
    tags: ["Flutter", "Next.js", "Firebase", "Cloud Functions"],
    links: [],
  },
  {
    id: "veby",
    title: "VeBy",
    category: "internship",
    role: "Delivery-app lead",
    description:
      "A quick-commerce grocery platform with customer, seller, delivery-partner and admin apps, serving 2,600+ customers. I led the delivery-partner app end to end and contributed heavily to the customer and seller apps.",
    image: "/assets/projects/veby.webp",
    imageAlt: "VeBy banner: a delivery rider on a red scooter beside the VeBy logo",
    tags: ["Flutter", "Firebase", "PhonePe", "Maps"],
    links: [],
  },
  {
    id: "quika",
    title: "Quika",
    category: "internship",
    role: "Rider, admin & payments",
    description:
      "An on-demand delivery platform. I set up the rider and super-admin apps, moved the customer app to GoRouter with deep links, and wrote the Cloud Functions behind PhonePe payments and Adloggs delivery webhooks.",
    image: "/assets/projects/quika.webp",
    imageAlt: "Quika logo above its customer, rider, super-admin and Cloud Functions components",
    tags: ["Flutter", "Next.js", "Cloud Functions", "Webhooks"],
    links: [],
  },
  {
    id: "annadhanaseva",
    title: "AnnaDhanaSeva",
    category: "internship",
    description:
      "A server-rendered donation platform integrating Razorpay pay-ins and IDFC MultiPayout, with payment callbacks and payout reconciliation. It has processed ₹2.8L+ for 200+ users.",
    image: "/assets/projects/annadhanaseva.webp",
    imageAlt: "AnnaDhanaSeva title card listing Next.js, Razorpay, IDFC MultiPayout and Firebase",
    tags: ["Next.js", "Firebase", "Razorpay", "Payouts API"],
    links: [],
  },
  {
    id: "feelflow",
    title: "FeelFlow AI",
    category: "internship",
    description:
      "An NLP sentiment-analysis dashboard that sorts a client's customer feedback by sentiment, so staff no longer read every review by hand.",
    image: "/assets/projects/feelflow.webp",
    imageAlt: "FeelFlow AI title card: sentiment analysis dashboard for customer feedback",
    tags: ["NLP", "Sentiment analysis", "Dashboard"],
    links: [],
  },

  // ── Freelance ─────────────────────────────────────────────────────────
  {
    id: "diocese-registry",
    title: "Diocese Employment Registry",
    category: "freelance",
    role: "Consultant · ERP rebuild",
    description:
      "A diocese's teacher-appointment registry whose source code had been lost. I recovered the seniority rules from the SQL Server database (finding three errors in the client's own requirements) and am building the replacement Next.js admin that ranks candidates by those rules.",
    image: "/assets/projects/diocese-registry.webp",
    imageAlt: "Registry dashboard, shown with demo data: roll size, renewals outstanding and a chart of candidates by cohort",
    tags: ["Next.js", "TypeScript", "SQL Server", "T-SQL"],
    links: [],
  },
  {
    id: "kidss",
    title: "KIDSS Website & CMS",
    category: "freelance",
    description:
      "The public website and admin CMS for KIDSS, a social-development NGO. Staff manage programmes, events, news and the gallery from a browser, and public pages render from Firestore on the server.",
    image: "/assets/projects/kidss.webp",
    imageAlt: "KIDSS homepage hero reading \"Service is Love Made Visible\" with programme photos",
    tags: ["Next.js", "Firestore", "JWT auth", "Zod"],
    links: [],
  },

  // ── Personal ──────────────────────────────────────────────────────────
  {
    id: "iris",
    title: "Iris",
    category: "personal",
    description:
      "A self-hosted chat app with end-to-end encrypted messages (AES-GCM keys wrapped with RSA-OAEP) and WebRTC voice and video calls. Spring Boot backend with JWT-checked WebSockets, and an installable React PWA.",
    image: "/assets/projects/iris.webp",
    imageAlt: "Two phones showing both sides of the same encrypted Iris conversation",
    tags: ["Spring Boot", "React", "WebRTC", "Web Crypto"],
    links: [
      { label: "Code", href: "https://github.com/arulebin/Iris-E2EE-Chat-Application" },
    ],
  },
  {
    id: "warden",
    title: "Warden",
    category: "personal",
    description:
      "An Android app that blocks unwanted sites across the whole phone, using a local VPN that filters DNS. It has category blocklists, an allowlist, a PIN lock, a daily auto-arm schedule and IPv6 support.",
    image: "/assets/projects/warden.webp",
    imageAlt: "Warden on Android: the armed shield with sites blocked today, and the blocklist and allowlist screen",
    tags: ["Kotlin", "Jetpack Compose", "VpnService", "DNS"],
    links: [{ label: "Code", href: "https://github.com/arulebin/warden-dns-blocker" }],
  },
  {
    id: "leetcode-visualizer",
    title: "LeetCode Visualizer",
    category: "personal",
    description:
      "A Chrome extension that animates Java LeetCode solutions step by step. A hand-written lexer, parser and interpreter trace arrays, maps, trees, DP tables and the call stack, fully offline and backed by 75 tests.",
    image: "/assets/projects/leetcode-visualizer.webp",
    imageAlt: "Visualizer panel stepping through a longest-common-subsequence solution, its DP table filling in as a heatmap",
    tags: ["JavaScript", "Chrome Extension", "Interpreter"],
    links: [],
  },
  {
    id: "agribiotrace",
    title: "AgriBioTrace",
    category: "personal",
    role: "IEEE Xplore · co-author",
    description:
      "An AI dashboard that predicts how fast biodegradable farm film breaks down in soil, with weather and soil data auto-filled from location, field-robot sensor input, and downloadable PDF risk reports.",
    image: "/assets/projects/agribiotrace.webp",
    imageAlt: "AgriBioTrace dashboard predicting 73% film degradation, marked high risk",
    tags: ["React", "Vite", "Flask API", "IoT"],
    links: [{ label: "Code", href: "https://github.com/akashroshans/AgriBioTrace_Web" }],
  },
  {
    id: "rag-assistant",
    title: "Local RAG Assistant",
    category: "personal",
    description:
      "Offline question-answering over a 60+ note knowledge base: hybrid BM25 and vector search, exposed to AI coding agents as an MCP server. It scores 97% recall@1 on its eval set, against 89% for keyword search alone.",
    image: "/assets/projects/rag-assistant.webp",
    imageAlt: "Local RAG Assistant title card listing Node.js, BM25 and vector search, Ollama and MCP",
    tags: ["Node.js", "Ollama", "MCP", "RAG"],
    links: [],
  },
];

/** Look up a project by its stable id. */
export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

/** Projects for one section of the page, in listed order. */
export function projectsIn(category: ProjectCategory): Project[] {
  return projects.filter((p) => p.category === category);
}
