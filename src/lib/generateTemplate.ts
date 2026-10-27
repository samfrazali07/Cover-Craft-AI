import type { LetterInput } from "./types";

function skillList(skills: string): string[] {
  return skills
    .split(/[,\n;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function joinHuman(items: string[]): string {
  if (items.length === 0) return "a range of relevant skills";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function generateTemplate(input: LetterInput): string {
  const { fullName, jobRole, company, tone } = input;
  const skills = skillList(input.skills);
  const skillsText = joinHuman(skills);
  const topSkills = joinHuman(skills.slice(0, 3));
  const years = (input.experience || "").trim();

  const experienceLine = years
    ? `With ${years} ${/^\d+$/.test(years) ? (years === "1" ? "year" : "years") : ""} of hands-on experience, I have repeatedly applied ${topSkills} to deliver work that teams can rely on.`.replace(
        /\s+/g,
        " ",
      )
    : `While my experience is still growing, I have invested serious effort into building practical capability with ${topSkills}.`;

  const openings: Record<string, string> = {
    Professional: `My name is ${fullName}, and I am writing to apply for the ${jobRole} position at ${company}. The role aligns closely with my background, and I would welcome the chance to contribute.`,
    Confident: `My name is ${fullName}, and I am applying for the ${jobRole} role at ${company}. I am confident that my work in ${topSkills} maps directly to what this position demands.`,
    Enthusiastic: `My name is ${fullName}, and I was genuinely excited to see the ${jobRole} opening at ${company}. It is exactly the kind of role and team I have been hoping to join.`,
    "Entry-Level / Fresher": `My name is ${fullName}, and I am writing to express my strong interest in the ${jobRole} position at ${company}. As someone early in my career, I am eager to learn quickly and contribute from day one.`,
  };

  const closings: Record<string, string> = {
    Professional: `Thank you for reviewing my application. I would appreciate the opportunity to discuss how I can support ${company}'s goals in this role.`,
    Confident: `I am ready to bring immediate value to ${company} and would welcome a conversation about the impact I can make in this role.`,
    Enthusiastic: `I would love the chance to talk more about how my energy and skills could help ${company} succeed. Thank you so much for your time and consideration.`,
    "Entry-Level / Fresher": `Thank you for considering my application. I would be grateful for the opportunity to discuss how my motivation and foundational skills could support the team at ${company}.`,
  };

  const jd = (input.jobDescription || "").trim();
  const jdLine = jd
    ? `Reading the job description, I noted the emphasis on the responsibilities outlined for this role, and I have deliberately shaped my recent work around those same priorities.`
    : "";

  const resumeLine = (input.resumeText || "").trim()
    ? `My attached resume provides further detail on the projects and responsibilities behind these skills.`
    : "";

  const paragraphs = [
    `Dear Hiring Manager at ${company},`,
    openings[tone],
    `${experienceLine} My core strengths include ${skillsText}, and I focus on using them to solve real problems rather than simply checking boxes. ${jdLine}`.trim(),
    `What draws me to ${company} specifically is the opportunity to do meaningful work alongside people who care about quality. I want to contribute to a ${jobRole} function where clear communication, ownership and steady improvement are valued. ${resumeLine}`.trim(),
    closings[tone],
    `Sincerely,\n${fullName}`,
  ];

  return paragraphs.join("\n\n");
}
