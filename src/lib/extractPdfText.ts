"use client";

import { MAX_RESUME_CHARS } from "./types";

export interface ExtractResult {
  text: string;
  pages: number;
  truncated: boolean;
}

export async function extractPdfText(file: File): Promise<ExtractResult> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const buffer = await file.arrayBuffer();
  let doc;
  try {
    doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (/password/i.test(msg)) {
      throw new Error("This PDF is password protected. Please upload an unlocked file.");
    }
    throw new Error("We could not read this PDF. It may be corrupted or not a valid PDF file.");
  }

  let text = "";
  const pages = Math.min(doc.numPages, 10);
  for (let i = 1; i <= pages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .filter(Boolean);
    text += strings.join(" ") + "\n\n";
  }

  const cleaned = text.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  if (cleaned.length < 40) {
    throw new Error(
      "No readable text found. This looks like a scanned or image-only PDF — OCR is not supported, so please upload a text-based PDF.",
    );
  }

  return {
    text: cleaned.slice(0, MAX_RESUME_CHARS),
    pages: doc.numPages,
    truncated: cleaned.length > MAX_RESUME_CHARS,
  };
}
