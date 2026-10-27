export type Tone = "Professional" | "Confident" | "Enthusiastic" | "Entry-Level / Fresher";

export const TONES: Tone[] = [
  "Professional",
  "Confident",
  "Enthusiastic",
  "Entry-Level / Fresher",
];

export interface LetterInput {
  fullName: string;
  jobRole: string;
  company: string;
  skills: string;
  experience?: string;
  jobDescription?: string;
  tone: Tone;
  resumeText?: string;
}

export const MAX_RESUME_CHARS = 6000;
export const MAX_JD_CHARS = 4000;
