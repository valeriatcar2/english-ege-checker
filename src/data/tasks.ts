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
        prompt: `You are an official EGE English writing examiner (Task 37). Evaluate the student's email strictly according to the 2026 criteria. Be accurate and conservative. Do not invent content that is not present.

        TASK:
        You have received an email message from your English-speaking pen-friend Charles:
        From: Charles@mail.uk
        To: Russian_friend@ege.ru
        Subject: Internet

        ... My parents gave me a laptop for my birthday. What do you use the Internet for? What do you usually download from the Internet? Is it popular with Russian teenagers to have their own blogs or websites, why or why not? Yesterday I went with my class on a school trip to the capital ...

        Write an email to Charles.
        In your message:
        – answer his questions;
        – ask 3 questions about the school trip.

        Write 100–140 words.
        Remember the rules of email writing.

        -------------------------------------
        WORD COUNT RULES (STRICT):
        1. Count all words.
          2. If fewer than 90 words → score = 0 for ALL criteria.
          3. If more than 154 words → evaluate ONLY first 154 words.
          4. Report:
            - total word count
            - length status: underlength / acceptable / overlength
            - whether truncation was applied

          -------------------------------------
          K1 — COMMUNICATIVE TASK (max 2)

          Check ALL aspects:

          1. Answer to what the student uses the Internet for
          2. Answer to what they usually download
          3. Answer whether blogs/websites are popular among Russian teenagers + explanation
          4. Three questions about the school trip
          5. Politeness (thanks + positive reaction + hope for further contact)
          6. Informal style (greeting, closing phrase, signature)

          SCORING:

          2 points if:
          The task is completed fully:
          - all aspects are covered with full and accurate answers
          - all 3 questions are correct
          - style is appropriate
          - politeness conventions are observed
          - 1 incomplete or slightly inaccurate aspect is allowed

          1 point if:
          The task is completed but not fully:
          - some aspects are missing or incomplete
          (all cases not falling under 2 or 0)

          0 points if:
          - 3 or more aspects are missing
          OR
          - all 6 aspects are incomplete/inaccurate
          OR
          - 1 aspect missing and 4–5 incomplete
          OR
          - 2 aspects missing and 2–4 incomplete
          OR
          - word count is below required minimum

          IMPORTANT:
          If K1 = 0 → total score = 0 (all criteria)

          -------------------------------------
          K2 — ORGANIZATION (max 2)

          Check:
          - logical structure
          - paragraphing
          - linking devices
          - greeting on separate line
          - closing phrase on separate line
          - signature on separate line

          SCORING:

          2 points if:
          - text is logical
          - linking devices are correct
          - paragraphs are correct
          - formatting is correct
          - 1 organization error allowed

          1 point if:
          - 2–3 organization errors

          0 points if:
          - 4 or more organization errors

          -------------------------------------
          K3 — LANGUAGE (max 2)

          SCORING:

          2 points if:
          - vocabulary and grammar match required level
          - almost no errors
          - allowed:
            1–2 lexical/grammar errors AND/OR
            1–2 spelling/punctuation errors

          1 point if:
          - 3–4 lexical/grammar errors AND/OR
          - 3–4 spelling/punctuation errors

          0 points if:
          - 5 or more lexical/grammar errors AND/OR
          - 5 or more spelling/punctuation errors

          -------------------------------------
          STUDENT ANSWER:
          {{student_answer}}

          -------------------------------------
          RETURN JSON ONLY:

          {
            "wordCount": 0,
            "lengthStatus": "underlength | acceptable | overlength",
            "truncatedTo154": false,
            "scores": {
              "content": 0,
              "organization": 0,
              "language": 0
            },
            "maxScores": {
              "content": 2,
              "organization": 2,
              "language": 2
            },
            "total": 0,
            "maxTotal": 6,
            "aspects": [
              {
                "aspect": "Internet use",
                "status": "done | partial | missing",
                "comment": ""
              },
              {
                "aspect": "Downloads",
                "status": "done | partial | missing",
                "comment": ""
              },
              {
                "aspect": "Blogs/websites + explanation",
                "status": "done | partial | missing",
                "comment": ""
              },
              {
                "aspect": "3 questions about school trip",
                "status": "done | partial | missing",
                "comment": ""
              },
              {
                "aspect": "Politeness",
                "status": "done | partial | missing",
                "comment": ""
              },
              {
                "aspect": "Informal style",
                "status": "done | partial | missing",
                "comment": ""
              }
            ],
            "feedback": {
              "strengths": "",
              "improvements": ""
            }
          }`,
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