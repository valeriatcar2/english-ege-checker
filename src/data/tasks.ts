import { Mail, FileText } from "lucide-react";
import type { ComponentType } from "react";


import letterImage1 from "../assets/letters/letter-1.jpg";
import letterImage2 from "../assets/letters/letter-2.jpg";

import essayImage1 from "../assets/essays/essay-1.jpg";
import essayImage2 from "../assets/essays/essay-2.jpg";

export type TaskMode = "letter" | "essay" | null;

export type VariantConfig = {
  id: number;
  label: string;
  taskTextTop: string;
  taskTextBottom?: string;
  prompt: string;
  image?: string;
};

export type TaskConfig = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  duration: number;
  placeholder: string;
  variants: VariantConfig[];
};

export type TaskMap = {
  letter: TaskConfig;
  essay: TaskConfig;
};

export const TASK_DATA: TaskMap = {
  letter: {
    title: "Письмо",
    icon: Mail,
    duration: 15 * 60,
    placeholder: "Введите здесь свой ответ на задание по письму...",
    variants: [
      {
        id: 1,
        label: "1",
        taskTextTop: `You have received an email message from your English-speaking pen-friend Charles:`, 
        taskTextBottom: `Write an email to Charles.
        In your message: 
        – answer his questions; 
        – ask 3 questions about the school trip. 
        
        Write 100–140 words. 
        Remember the rules of email writing.`,
        prompt: `LETTER_CHECK_VARIANT_1`,
        image: letterImage1
      },
      {
        id: 2,
        label: "2",
        taskTextTop: `You have received an email message from your English speaking pen-friend George:`, 
        taskTextBottom: `Write an email to George.
        In your message:
         
        – answer his questions;
        – ask 3 questions about the youth camp.
         
        Write 100 – 140 words.
        Remember the rules of email writing.`,
        prompt: `LETTER_CHECK_VARIANT_2`,
        image: letterImage2
      }
    ]
  },

  essay: {
    title: "Эссе",
    icon: FileText,
    duration: 40 * 60,
    placeholder: "Введите здесь своё эссе...",
    variants: [
      {
        id: 1,
        label: "1",
        taskTextTop: `Imagine that you are doing a project on why some Zetlanders are not keen on theatre-going. You have found some data on the subject – the results of the opinion polls (see the table below) .
        Comment on the data in the table and give your opinion on the subject of the project.`,
        taskTextBottom: `Write 200–250 words.

        Use the following plan:
        – make an opening statement on the subject of the project;
        – select and report 2–3 facts;
        – make 1–2 comparisons where relevant and give your comments;
        – outline a problem that can arise with choosing a play to watch at the theatre and suggest a way of solving it;
        – conclude by giving and explaining your opinion on the importance of theatre-going.`,
        prompt: `ESSAY_CHECK_VARIANT_1`,
        image: essayImage1
      },
      {
        id: 2,
        label: "2",
        taskTextTop: `Imagine that you are doing a project on studying foreign languages in Zetland. You have found some data on the subject – the results оf the opinion polls (see the pie chart below) .
        Comment on the data in the pie chart and give your opinion on the subject of the project.`,
        taskTextBottom: `Write 200–250 words.

        Use the following plan:
        –  make an opening statement on the subject of the project;
        –  select and report 2–3 facts;
        –  make 1–2 comparisons where relevant and give your comments;
        –  outline a problem that one can face when self-studying a foreign language and suggest a way of solving it;
        –  conclude by giving and explaining your opinion on what matters most in learning a foreign language.`,
        prompt: `ESSAY_CHECK_VARIANT_2`,
        image: essayImage2
      }
    ]
  }
};

export type CriterionConfig = {
  key: string;
  label: string;
  max: number;
};

export const SCORE_CONFIG = {
  letter: [
    { key: "content", label: "Решение коммуникативной задачи", max: 2 },
    { key: "organization", label: "Организация текста", max: 2 },
    { key: "language", label: "Языковое оформление текста", max: 2 }
  ],
  essay: [
    { key: "content", label: "Решение коммуникативной задачи", max: 3 },
    { key: "organization", label: "Организация текста", max: 3 },
    { key: "vocabulary", label: "Лексика", max: 3 },
    { key: "grammar", label: "Грамматика", max: 3 },
    { key: "spelling", label: "Орфография и пунктуация", max: 2 }
  ]
};