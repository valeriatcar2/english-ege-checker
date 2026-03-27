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
        taskTextTop: `Imagine that you are doing a project on what helped Zetland teenagers the most in preparing for final exams. You have found some data on the subject — the results of a survey.

Comment on the survey data and give your opinion on the subject of the project.

Write 200–250 words.

Use the following plan:
– make an opening statement on the subject of the project;
– select and report 2–3 facts;
– make 1–2 comparisons where relevant and give your comments;
– outline a problem that can arise with preparing for final exams and suggest a way of solving it;
– conclude by giving and explaining your opinion on the importance of preparing well for exams.`,
        prompt: `ESSAY_CHECK_VARIANT_1`,
        image: essayImage1
      },
      {
        id: 2,
        label: "2",
        taskTextTop: `Imagine that you are doing a project on how Zetland teenagers usually spend their weekends. You have found some data on the subject — the results of a survey.

Comment on the survey data and give your opinion on the subject of the project.

Write 200–250 words.

Use the following plan:
– make an opening statement on the subject of the project;
– select and report 2–3 facts;
– make 1–2 comparisons where relevant and give your comments;
– outline a problem that can arise when teenagers plan their weekends and suggest a way of solving it;
– conclude by giving and explaining your opinion on the importance of having free time.`,
        prompt: `ESSAY_CHECK_VARIANT_2`,
        image: essayImage2
      }
    ]
  }
};