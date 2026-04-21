import { Mail, FileText } from "lucide-react";
import type { ComponentType } from "react";


import letterImage1 from "../assets/letters/letter-1.jpg";
import letterImage2 from "../assets/letters/letter-2.jpg";
import letterImage3 from "../assets/letters/letter-3.jpg";
import letterImage4 from "../assets/letters/letter-4.jpg";
import letterImage5 from "../assets/letters/letter-5.jpg";
import letterImage6 from "../assets/letters/letter-6.jpg";
import letterImage7 from "../assets/letters/letter-7.jpg";
import letterImage8 from "../assets/letters/letter-8.jpg";
import letterImage9 from "../assets/letters/letter-9.jpg";
import letterImage10 from "../assets/letters/letter-10.jpg";
import letterImage11 from "../assets/letters/letter-11.jpg";
import letterImage12 from "../assets/letters/letter-12.jpg";
import letterImage13 from "../assets/letters/letter-13.jpg";
import letterImage14 from "../assets/letters/letter-14.jpg";
import letterImage15 from "../assets/letters/letter-15.jpg";

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
        prompt: "LETTER_CHECK_VARIANT_1",
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
      },
      {
        id: 3,
        label: "3",
        taskTextTop: `You have received an email message from your English speaking pen-friend Victoria:`, 
        taskTextBottom: `Write an email to Victoria.
        In your message:
        - answer her questions;
        - ask 3 questions about the exam.
         
        Write 100–140 words.
        Remember the rules of email writing.`,
        prompt: `LETTER_CHECK_VARIANT_3`,
        image: letterImage3
      },
      {
        id: 4,
        label: "4",
        taskTextTop: `You have received an email message from your English-speaking pen-friend Ella:`, 
        taskTextBottom: `Write an email to Ella.
        In your message:
        - answer her questions;
        - ask 3 questions about her trip to London.
         
        Write 100–140 words.
        Remember the rules of email writing.`,
        prompt: `LETTER_CHECK_VARIANT_4`,
        image: letterImage4
      },
      {
        id: 5,
        label: "5",
        taskTextTop: `You have received an email message from your English-speaking pen-friend Jerry:`, 
        taskTextBottom: `Write an email to Jerry.
        In your message:
        - answer his questions;
        - ask 3 questions about his trip to London.
         
        Write 100–140 words.
        Remember the rules of email writing.`,
        prompt: `LETTER_CHECK_VARIANT_5`,
        image: letterImage5
      },
      {
        id: 6,
        label: "6",
        taskTextTop: `You have received an email message from your English-speaking pen-friend Olivia:`, 
        taskTextBottom: `Write an email to Olivia.
        In your message:
        - answer her questions;
        - ask 3 questions about her school exams.
         
        Write 100–140 words.
        Remember the rules of email writing.`,
        prompt: `LETTER_CHECK_VARIANT_6`,
        image: letterImage6
      },
      {
        id: 7,
        label: "7",
        taskTextTop: `You have received an email message from your English-speaking pen-friend Carol:`, 
        taskTextBottom: `Write an email to Carol.
        In your message:
         
        - answer her questions;
        - ask 3 questions about the hiking trip.
         
        Write 100–140 words.
        Remember the rules of email writing.`,
        prompt: `LETTER_CHECK_VARIANT_7`,
        image: letterImage7
      },
      {
        id: 8,
        label: "8",
        taskTextTop: `You have received an email message from your English-speaking pen-friend Oscar:`, 
        taskTextBottom: `Write an email to Oscar.
        In your message:

        - answer his questions;
        - ask 3 questions about the present.
         
        Write 100–140 words.
        Remember the rules of email writing.`,
        prompt: `LETTER_CHECK_VARIANT_8`,
        image: letterImage8
      },
      {
        id: 9,
        label: "9",
        taskTextTop: `You have received an email message from your English-speaking pen-friend Jack:`, 
        taskTextBottom: `Write an email to Jack.
        In your message:
         
        - answer his questions;
        - ask 3 questions about the computer game.
         
        Write 100–140 words.
        Remember the rules of email writing.`,
        prompt: `LETTER_CHECK_VARIANT_9`,
        image: letterImage9
      },
      {
        id: 10,
        label: "10",
        taskTextTop: `You have received an email message from your English-speaking pen-friend Emily:`, 
        taskTextBottom: `Write an email to Emily.
        In your message:
         
        - answer her questions;
        - ask 3 questions about the changes she made in her room.
         
        Write 100–140 words.
        Remember the rules of email writing.`,
        prompt: `LETTER_CHECK_VARIANT_10`,
        image: letterImage10
      },
      {
        id: 11,
        label: "11",
        taskTextTop: `You have received an email message from your English-speaking pen-friend Patrick:`, 
        taskTextBottom: `Write an email to Patrick.
        In your message:
         
        - answer his questions;
        - ask 3 questions about the local environment protection organizations.
         
        Write 100–140 words.
        Remember the rules of email writing.`,
        prompt: `LETTER_CHECK_VARIANT_11`,
        image: letterImage11
      },
      {
        id: 12,
        label: "12",
        taskTextTop: `You have received an email message from your English-speaking pen-friend Kevin:`, 
        taskTextBottom: `Write an email to Kevin.
        In your message:
         
        - answer his questions;
        - ask 3 questions about the film.
         
        Write 100–140 words.
        Remember the rules of email writing.`,
        prompt: `LETTER_CHECK_VARIANT_12`,
        image: letterImage12
      },
      {
        id: 13,
        label: "13",
        taskTextTop: `You have received an email message from your English-speaking pen-friend Marion:`, 
        taskTextBottom: `Write an email to Marion.
        In your message:
         
        - answer her questions;
        - ask 3 questions about the book she has just finished reading.
         
        Write 100–140 words.
        Remember the rules of email writing.`,
        prompt: `LETTER_CHECK_VARIANT_13`,
        image: letterImage13
      },
      {
        id: 14,
        label: "14",
        taskTextTop: `You have received an email message from your English-speaking pen-friend Simon:`, 
        taskTextBottom: `Write an email to Simon.
        In your message:
         
        - answer his questions;
        - ask 3 questions about his school sports club.
         
        Write 100–140 words.
        Remember the rules of email writing.`,
        prompt: `LETTER_CHECK_VARIANT_14`,
        image: letterImage14
      },
      {
        id: 15,
        label: "15",
        taskTextTop: `You have received an email message from your English-speaking pen-friend Sandra:`, 
        taskTextBottom: `Write an email to Sandra.
        In your message:
         
        - answer her questions;
        - ask 3 questions about her letters to Santa.
         
        Write 100–140 words.
        Remember the rules of email writing.`,
        prompt: `LETTER_CHECK_VARIANT_15`,
        image: letterImage15
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
      },
      

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