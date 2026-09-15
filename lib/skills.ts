export type SkillGroup = {
  label: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "JavaScript", "Java", "C++", "C"],
  },
  {
    label: "Web",
    items: ["React", "Next.js", "Node.js", "Tailwind CSS", "Bootstrap", "HTML", "CSS"],
  },
  {
    label: "Tools & Platforms",
    items: ["Git", "Firestore", "Vercel"],
  },
];
