import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronDown, CheckCircle2, FileText, Mail, Sparkles, Camera, Loader2 } from "lucide-react";
import {
  TASK_DATA,
  type TaskMode,
  type VariantConfig,
  type TaskConfig
} from "./data/tasks";

type ChooseTaskProps = {
  setMode: (mode: TaskMode) => void;
};

type TaskCardProps = {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
};

type ChooseVariantProps = {
  mode: Exclude<TaskMode, null>;
  variants: VariantConfig[];
  onBack: () => void;
  onSelect: (variantId: number | null) => void;
};

type TaskViewProps = {
  currentTask: TaskConfig;
  activeVariant: VariantConfig;
  examMode: boolean;
  setExamMode: React.Dispatch<React.SetStateAction<boolean>>;
  timeLeft: number | null;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  onBack: () => void;
  onSubmit: () => void;
};

type ResultPanelProps = {
  mode: TaskMode;
  selectedVariant: VariantConfig | null;
  submitted: boolean;
  examMode: boolean;
  timeLeft: number | null;
  result: CheckResult | null;
  isChecking: boolean;
  error: string;
};

type PlaceholderCardProps = {
  text: string;
};

type StatusPillProps = {
  label: string;
  danger?: boolean;
};

type AnimatedLettersProps = {
  text: string;
};

type CheckResult = {
  wordCount: number;
  lengthStatus: "underlength" | "acceptable" | "overlength";
  truncatedTo154: boolean;
  scores: {
    content: number;
    organization: number;
    language?: number;
    vocabulary?: number;
    grammar?: number;
    spelling?: number;
  };
  maxScores: {
    content: number;
    organization: number;
    language?: number;
    vocabulary?: number;
    grammar?: number;
    spelling?: number;
  };
  total: number;
  maxTotal: number;
  aspects?: Array<{
    aspect: string;
    status: "done" | "partial" | "missing";
    comment: string;
  }>;
  organizationErrorsCount?: number;
  organizationIssues?: string[];
  lexGramErrorsCount?: number;
  lexGramIssues?: string[];
  spellingPunctuationErrorsCount?: number;
  spellingPunctuationIssues?: string[];
  feedback: {
    strengths: string;
    improvements: string;
  };
};


export default function EnglishEGEChecker() {
  return (
    <div className="min-h-screen overflow-hidden bg-neutral-950 text-white selection:bg-teal-300/30 selection:text-white">
      <AnimatedBackground />
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">
        <CheckerDemo />
      </main>
    </div>
  );
}


type TopBarProps = {
  onHomeClick: () => void;
};

function TopBar({ onHomeClick }: TopBarProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <button
        onClick={onHomeClick}
        className="inline-flex items-center gap-2 rounded-full border border-teal-400/15 bg-white/[0.03] px-3 py-2 text-sm text-white/70 transition hover:border-teal-300/30 hover:text-teal-200 sm:px-4"
      >
        <Sparkles className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">English ЕГЭ Checker</span>
      </button>
      <a
        href="https://vk.com/lera_tsareva"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-teal-400/15 bg-white/[0.03] px-3 py-2 text-sm text-white/70 transition hover:border-teal-300/30 hover:text-teal-200 sm:px-4"
      >
        <span className="hidden text-white/55 sm:inline">Обратная связь:</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5 shrink-0"
          aria-hidden="true"
        >
          <path d="M12.785 15.14s.288-.032.436-.19c.136-.145.131-.418.131-.418s-.019-1.278.574-1.466c.584-.185 1.333 1.235 2.128 1.781.602.413 1.059.322 1.059.322l2.127-.03s1.112-.069.585-.944c-.043-.072-.306-.645-1.573-1.819-1.326-1.23-1.148-1.031.449-3.16.973-1.297 1.361-2.088 1.239-2.427-.116-.323-.832-.238-.832-.238l-2.395.015s-.178-.024-.309.055c-.128.077-.21.257-.21.257s-.379 1.01-.883 1.87c-1.062 1.814-1.487 1.91-1.661 1.798-.405-.261-.304-1.047-.304-1.605 0-1.744.264-2.471-.514-2.659-.258-.063-.448-.104-1.108-.11-.847-.008-1.564.003-1.969.2-.27.131-.478.423-.351.44.157.021.513.096.701.352.242.33.233 1.07.233 1.07s.138 2.053-.323 2.308c-.316.175-.75-.182-1.683-1.831-.478-.845-.839-1.781-.839-1.781s-.07-.172-.196-.264c-.154-.112-.369-.148-.369-.148l-2.276.015s-.342.01-.467.159c-.111.132-.009.404-.009.404s1.782 4.171 3.799 6.268c1.85 1.923 3.95 1.796 3.95 1.796h.952z" />
        </svg>
        <span>Валерия Царева</span>
      </a>
    </div>
  );
}

function Header() {
  const title = "English ЕГЭ Checker";

  return (
    <div className="mb-6 md:mb-8">
      <div className="mb-4 text-xs uppercase tracking-wide text-white/30">
        Дипломный проект · ИМО МПГУ · 2026
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          <AnimatedLetters text={title} />
        </h1>

        <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/15 bg-teal-400/10 px-4 py-2 text-sm text-teal-100/90 backdrop-blur">
          <Sparkles className="h-4 w-4" />
          AI-платформа
        </div>
      </div>

      <div className="mt-3 max-w-5xl text-[15px] leading-7 text-white/68 md:text-base">
        <p className="mb-3">
          Добро пожаловать на платформу English ЕГЭ Checker!
        </p>

        <p className="mb-3">
          На этой платформе вы сможете выполнять задания письменной части ЕГЭ по английскому языку, актуальные на 2026 год, получать автоматическую проверку с помощью искусственного интеллекта и рекомендации по улучшению своей работы.
        </p>

        <p className="mb-3">
          Надеемся, что платформа поможет вам увереннее готовиться к экзамену и шаг за шагом совершенствовать свои письменные навыки.
        </p>
      </div>
    </div>
  );
}

function CheckerDemo() {
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<TaskMode>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [examMode, setExamMode] = useState(false);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");

  const currentTask = mode ? TASK_DATA[mode] : null;
  const variants = useMemo(() => currentTask?.variants ?? [], [currentTask]);
  const activeVariant = useMemo(
    () => variants.find((variant) => variant.id === selectedVariantId) ?? null,
    [variants, selectedVariantId]
  );
  const showResultsPanel = Boolean(activeVariant);

  useEffect(() => {
    if (!examMode || !currentTask || !activeVariant) {
      setTimeLeft(null);
      return;
    }

    setTimeLeft(currentTask.duration);
  }, [examMode, currentTask, activeVariant]);

  useEffect(() => {
    if (!examMode || timeLeft === null || timeLeft <= 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [examMode, timeLeft]);

const handleSubmit = async () => {
  if (!activeVariant || !text.trim()) return;

  resultRef.current?.scrollIntoView({
  behavior: "smooth",
  block: "start",
});

  try {
    setIsChecking(true);
    setError("");
    setResult(null)
    setSubmitted(false);

    const response = await fetch("/api/check-writing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: activeVariant.prompt,
        studentText: text
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Request failed");
    }

    const parsed = JSON.parse(data.output);
    setResult(parsed);
    setSubmitted(true);
  } catch (err) {
    console.error(err);
    setError("Не удалось выполнить проверку. Попробуйте ещё раз.");
  } finally {
    setIsChecking(false);
  }
};

  const handleSelectMode = (nextMode: TaskMode) => {
    setMode(nextMode);
    setSelectedVariantId(null);
    setText("");
    setSubmitted(false);
    setExamMode(false);
    setTimeLeft(null);
    setResult(null);
    setError("");
    setIsChecking(false);
  };

  const handleSelectVariant = (variantId: number | null) => {
    setSelectedVariantId(variantId);
    setText("");
    setSubmitted(false);
    setTimeLeft(examMode && currentTask ? currentTask.duration : null);
    setResult(null);
    setError("");
    setIsChecking(false);
  };

  const resetAll = () => {
    setMode(null);
    setSelectedVariantId(null);
    setText("");
    setSubmitted(false);
    setExamMode(false);
    setTimeLeft(null);
    setResult(null);
    setError("");
    setIsChecking(false);
  };

  const resetToVariants = () => {
    setSelectedVariantId(null);
    setText("");
    setSubmitted(false);
    setTimeLeft(null);
    setResult(null);
    setError("");
    setIsChecking(false);
  };

  return (
    <>
      <TopBar onHomeClick={resetAll} />
      {!mode && <Header />}

      {!mode ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <ChooseTask setMode={handleSelectMode} />
        </motion.div>
      ) : (
        <div className={`grid gap-6 ${showResultsPanel ? "lg:grid-cols-[1.1fr_0.9fr]" : "lg:grid-cols-1"}`}>
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className={`rounded-[28px] border bg-white/[0.04] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-7 transition-colors duration-500 ${activeVariant && examMode && !(timeLeft !== null && timeLeft <= 0) ? "border-amber-400/25" : activeVariant && (timeLeft !== null && timeLeft <= 0) ? "border-red-400/30" : "border-teal-400/10"}`}
          >
            {!activeVariant && currentTask ? (
              <ChooseVariant
                mode={mode}
                variants={variants}
                onBack={resetAll}
                onSelect={handleSelectVariant}
              />
            ) : currentTask && activeVariant ? (
              <TaskView
                currentTask={currentTask}
                activeVariant={activeVariant}
                examMode={examMode}
                setExamMode={setExamMode}
                timeLeft={timeLeft}
                text={text}
                setText={setText}
                onBack={resetToVariants}
                onSubmit={handleSubmit}
              />
            ) : null}
          </motion.section>

          <AnimatePresence>
            {showResultsPanel && (
              <motion.aside
                ref={resultRef}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.3 }}
                className="rounded-[28px] border border-teal-400/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-7"
              >
                <ResultPanel
                  mode={mode}
                  selectedVariant={activeVariant}
                  submitted={submitted}
                  examMode={examMode}
                  timeLeft={timeLeft}
                  result={result}
                  isChecking={isChecking}
                  error={error}
                />
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

function ChooseTask({ setMode }: ChooseTaskProps) {
  const [openFaq, setOpenFaq] = useState<number[]>([]);

  const faqItems = [
    {
      question: "Насколько эффективна платформа?",
      answer:
        "Платформа помогает тренировать навыки выполнения заданий письменной части ЕГЭ по английскому языку, получать быструю обратную связь и видеть рекомендации по улучшению работы. Она особенно полезна для регулярной практики, самопроверки и подготовки к экзамену в удобном формате.",
    },
    {
      question: "Собираете ли вы мои данные?",
      answer:
        "Нет. Все работы проверяются анонимно. Платформа не запрашивает у вас персональные данные и не требует регистрации для выполнения заданий.",
    },
    {
      question: "Актуальны ли задания и критерии проверки на этот год?",
      answer:
        "Да. Задания соответствуют актуальным материалам ФИПИ на 2026 год, а проверка производится с учётом действующих критериев оценивания письменной части ЕГЭ по английскому языку.",
    },
    {
      question: "Можно ли использовать платформу для самостоятельной подготовки?",
      answer:
        "Да. Платформа подходит для самостоятельной тренировки, поскольку позволяет выполнять задания, получать автоматическую проверку и отслеживать, на какие аспекты письменной работы стоит обратить особое внимание.",
    },
    {
      question: "Проверяет ли платформа письмо и эссе одинаково?",
      answer:
        "Нет. Для личного письма и эссе используются разные параметры оценивания, соответствующие требованиям каждого формата.",
    },
    {
      question: "Можно ли полностью полагаться на результат проверки?",
      answer:
        "Платформа даёт полезную и быструю обратную связь, однако её лучше использовать как инструмент поддержки в подготовке. Для максимального результата рекомендуется сочетать работу с платформой с самостоятельным анализом и, при необходимости, консультацией учителя.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  return (
    <>
      <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/10 backdrop-blur-md md:p-7">
        <p className="mb-2 text-sm uppercase tracking-[0.24em] text-white/45">Старт</p>
        <h2 className="mb-3 text-2xl font-semibold md:text-3xl">Выберите тип задания</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <TaskCard
            title="Письмо"
            subtitle="Электронное письмо личного характера"
            icon={Mail}
            onClick={() => setMode("letter")}
          />
          <TaskCard
            title="Эссе"
            subtitle="Аналитическое эссе"
            icon={FileText}
            onClick={() => setMode("essay")}
          />
        </div>
      </section>

      <section className="mt-14 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/10 backdrop-blur-md md:mt-16 md:p-7">
        <p className="mb-2 text-sm uppercase tracking-[0.24em] text-white/45">FAQ</p>
        <h2 className="mb-5 text-2xl font-semibold md:text-3xl">Часто задаваемые вопросы</h2>

        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openFaq.includes(index);

            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between px-4 py-4 text-left text-white transition hover:bg-white/[0.03]"
                >
                  <span className="pr-4 font-medium">{item.question}</span>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-white/55 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-teal-200" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 pb-4 text-sm leading-7 text-white/65">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function TaskCard({ title, subtitle, icon: Icon, onClick }: TaskCardProps) {
  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.005 }}
      whileTap={{ scale: 0.998 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      onClick={onClick}
      className="group rounded-[24px] border border-white/10 bg-white/[0.02] p-6 text-left transition-all hover:bg-white/[0.04] hover:border-teal-400/25"
    >
      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/[0.08] transition-colors group-hover:bg-teal-400/[0.14]">
        <Icon className="h-7 w-7 text-teal-200" />
      </div>

      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="text-sm leading-6 text-white/60">{subtitle}</p>
      <div className="mt-6 text-sm text-white/45 transition group-hover:text-teal-200">
        Открыть →
      </div>
    </motion.button>
  );
}

function ChooseVariant({ mode, variants, onBack, onSelect }: ChooseVariantProps) {
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-2 text-sm text-white/55 hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
        Назад
      </button>

      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-white/45">
        {mode === "letter" ? "Письмо" : "Эссе"}
      </p>
      <h2 className="mb-3 text-2xl font-semibold md:text-3xl">Выберите вариант</h2>
      

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {variants.map((variant) => (
          <button
          key={variant.id}
          onClick={() => onSelect(variant.id)}
          className="rounded-2xl border border-teal-400/12 bg-teal-400/[0.08] px-4 py-5 text-lg font-medium transform-gpu transition-all duration-150 ease-out hover:scale-[1.02] hover:bg-teal-400/[0.14] active:scale-[0.99]"
          >
          {variant.label}
          </button>
        ))}
      </div>

      <p className="mt-5 text-sm text-white/35 text-center">
        Нажмите на вариант, чтобы открыть задание
      </p>
    </div>
  );
}

function TaskView({
  currentTask,
  activeVariant,
  examMode,
  setExamMode,
  timeLeft,
  text,
  setText,
  onBack,
  onSubmit
}: TaskViewProps) {
  const expired = examMode && timeLeft !== null && timeLeft <= 0;
  const Icon = currentTask.icon;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState("");
  const [showOcrNotice, setShowOcrNotice] = useState(false);

  const resizeImage = (file: File, maxSize: number): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.6).split(",")[1]);
      };
      img.onerror = reject;
      img.src = url;
    });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOcrLoading(true);
    setOcrError("");
    setShowOcrNotice(true);

    try {
      const base64 = await resizeImage(file, 600);

      const response = await fetch("/api/ocr-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType: "image/jpeg" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "OCR failed");
      }

      setText(data.text);
    } catch {
      setOcrError("Не удалось распознать текст. Попробуйте ещё раз.");
    } finally {
      setIsOcrLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const progress = currentTask.duration > 0 ? ((timeLeft ?? currentTask.duration) / currentTask.duration) * 100 : 0;
  const barColor = progress > 50 ? "bg-teal-400/50" : progress > 20 ? "bg-amber-400/60" : "bg-red-400/70";

  return (
    <div>
      <AnimatePresence>
        {showOcrNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-[24px] border border-teal-400/20 bg-neutral-900 p-6 shadow-2xl"
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-400/15 bg-teal-400/10 px-3 py-1.5 text-sm text-teal-100/90">
                <Camera className="h-3.5 w-3.5" />
                Распознавание текста
              </div>
              <p className="mb-2 font-semibold text-white">
                Текст распознаётся с помощью ИИ
              </p>
              <p className="mb-5 text-sm leading-6 text-white/55">
                Искусственный интеллект может допускать ошибки при распознавании рукописного текста. Обязательно проверьте результат перед отправкой на проверку.
              </p>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowOcrNotice(false)}
                className="w-full rounded-full border border-teal-300/20 bg-teal-300 py-2.5 text-sm font-medium text-black transition hover:bg-teal-200"
              >
                Понятно
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-5 flex items-center gap-2 sm:gap-3">
        <button
          onClick={onBack}
          className="inline-flex shrink-0 items-center gap-1 text-xs text-white/55 transition hover:text-white sm:gap-2 sm:text-sm"
        >
          <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          К вариантам
        </button>
        <div className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-teal-400/15 bg-teal-400/10 px-2.5 py-1.5 text-xs text-teal-100/90 sm:gap-2 sm:px-3 sm:text-sm">
          <Icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          <span className="truncate">{currentTask.title} · Вариант {activeVariant.label}</span>
        </div>
      </div>

      <AnimatePresence>
        {examMode && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="relative mb-5 h-[3px] w-full rounded-full bg-white/[0.06]"
          >
            <div
              className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
              style={{ width: `${progress}%` }}
            />
            <span
              className="absolute -top-5 text-[11px] text-white/30 tabular-nums transition-all duration-1000"
              style={{ left: `${Math.max(0, Math.min(progress, 96))}%`, transform: "translateX(-50%)" }}
            >
              {formatTime(timeLeft ?? currentTask.duration)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="mb-6 text-2xl font-semibold md:text-3xl">Задание</h2>

<div className="mb-6 rounded-[24px] border border-white/10 bg-black/20 p-5">
  {activeVariant.taskTextTop && (
    <div className="mb-5 whitespace-pre-line text-sm leading-7 text-white/85">
      {activeVariant.taskTextTop}
    </div>
  )}

{activeVariant.image && (
  <img
    src={activeVariant.image}
    alt={`Task ${activeVariant.label}`}
    className="mb-5 w-full rounded-2xl border border-white/10 object-cover"
    style={{ filter: "invert(1) brightness(0.85)" }}
  />
)}

{activeVariant.taskTextBottom && (
  <div className="whitespace-pre-line text-sm leading-7 text-white/75">
    {activeVariant.taskTextBottom}
  </div>
)}

<div className="mt-5 text-[11px] text-white/40">
  Источник:{" "}
  <a
    href="https://ege.fipi.ru/bank/"
    target="_blank"
    rel="noopener noreferrer"
    className="underline hover:text-white/70 transition"
  >
    ФИПИ
  </a>
</div>

</div>

      <div className="mb-4 flex items-center justify-between gap-3 rounded-[20px] border border-white/8 bg-white/[0.02] px-4 py-3">
        <div>
          <p className="text-sm font-medium text-white/80">Режим экзамена</p>
          <p className="text-xs text-white/40">Таймер {Math.floor(currentTask.duration / 60)} мин, подсчёт слов скрыт</p>
        </div>
        <button
          type="button"
          onClick={() => setExamMode((prev) => !prev)}
          aria-pressed={examMode}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${examMode ? "bg-teal-300" : "bg-white/15"}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${examMode ? "left-[22px]" : "left-0.5"}`} />
        </button>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="block text-sm text-white/60">
            Поле для ввода ответа
          </label>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isOcrLoading}
              className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1.5 text-xs text-teal-100/90 transition hover:bg-teal-400/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isOcrLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Распознаю...
                </>
              ) : (
                <>
                  <Camera className="h-3.5 w-3.5" />
                  Загрузить фото
                </>
              )}
            </button>
          </div>
        </div>

        {ocrError && (
          <div className="mb-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {ocrError}
          </div>
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={currentTask.placeholder}
          readOnly={expired}
          className={`min-h-[260px] w-full resize-none rounded-[24px] border border-white/10 bg-black/20 px-5 py-4 text-base outline-none transition placeholder:text-white/25 focus:border-white/20 focus:bg-black/30 ${expired ? "cursor-not-allowed opacity-60" : ""}`}
        />

        {!examMode && (
          <div className="mt-3 text-left text-sm text-white/50">
            Words:{" "}
            <span className="font-medium text-white/80">
              {text.trim().split(/\s+/).filter(Boolean).length}
            </span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {expired && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25 }}
            className="mb-4 rounded-[20px] border border-red-400/25 bg-red-500/10 p-5"
          >
            <p className="mb-1 font-semibold text-red-200">Время вышло</p>
            <p className="mb-4 text-sm text-white/55">
              Вы не можете изменить текст, но можете отправить написанное на проверку.
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSubmit}
                disabled={!text.trim()}
                className="rounded-full border border-teal-300/20 bg-teal-300 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/35"
              >
                Отправить на проверку
              </motion.button>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm text-white/60 transition hover:bg-white/[0.08] hover:text-white"
              >
                Назад к вариантам
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!expired && <div className="flex items-center justify-between gap-3">
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSubmit}
          className="rounded-full border border-teal-300/20 bg-teal-300 px-5 py-3 text-sm font-medium text-black transition hover:bg-teal-200"
        >
          Отправить
        </motion.button>
      </div>}
    </div>
  );
}

function ResultPanel({
  mode,
  selectedVariant,
  submitted,
  examMode,
  timeLeft,
  result,
  isChecking,
  error
}: ResultPanelProps) {

  const expired = examMode && timeLeft !== null && timeLeft <= 0;

  return (
    <div className="h-full">
      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-white/45">Результат</p>
      <h2 className="mb-3 text-2xl font-semibold">Проверка и рекомендации</h2>

      {!mode || !selectedVariant ? (
        <PlaceholderCard text="Сначала откройте конкретный вариант задания." />
      ) : isChecking ? (
            <div className="flex min-h-[300px] max-h-[calc(100vh-160px)] flex-col items-center justify-center rounded-[24px] border border-white/10 bg-white/5 px-6 text-center overflow-y-auto">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/15 border-t-teal-300"></div>
              <p className="text-base font-medium text-white">Идёт проверка работы...</p>
              <p className="mt-2 text-sm text-white/50">Пожалуйста, подождите несколько секунд</p>
            </div>
          ) : error ? (
        <PlaceholderCard text={error} />
      ) : !submitted ? (
        <div className="space-y-4">
          <StatusPill label={`Тип задания: ${mode === "letter" ? "Письмо" : "Эссе"}`} />
          <StatusPill label={`Выбран вариант: ${selectedVariant.label}`} />
          <StatusPill label={`Режим экзамена: ${examMode ? "включён" : "выключен"}`} />
          {examMode && expired ? <StatusPill label="Время вышло" danger /> : null}

          <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-white/52">
            После нажатия на кнопку «Отправить» здесь появятся:
            <br />
            — баллы по критериям
            <br />
            — подробные рекомендации
            <br />
            — комментарии по ошибкам 
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-[24px] border border-teal-400/15 bg-teal-500/10 p-5">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-teal-300/15 bg-teal-300/10 px-3 py-1 text-sm text-teal-100">
              <CheckCircle2 className="h-4 w-4" />
              Ответ получен
            </div>

            <div className="space-y-4 text-sm leading-7 text-white/75">
              <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
                <span className="font-semibold text-white">Общий балл:</span> {result?.total ?? 0} / {result?.maxTotal ?? 0}
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
                <span className="font-semibold text-white">Количество слов:</span> {result?.wordCount ?? 0}
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
                <span className="font-semibold text-white">Статус объёма:</span>{" "}
                {result?.lengthStatus === "underlength"
                  ? "Недостаточный объём"
                  : result?.lengthStatus === "overlength"
                  ? "Превышен объём"
                  : "Объём в норме"}
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
                <div className="mb-3 font-semibold text-white">Баллы по критериям</div>

                <div className="space-y-2">
                  {mode === "letter" ? (
                    <>
                      <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                        <span>Решение коммуникативной задачи</span>
                        <span className="font-medium">
                          {result?.scores.content ?? 0} / {result?.maxScores.content ?? 2}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                        <span>Организация текста</span>
                        <span className="font-medium">
                          {result?.scores.organization ?? 0} / {result?.maxScores.organization ?? 2}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                        <span>Языковое оформление текста</span>
                        <span className="font-medium">
                          {result?.scores.language ?? 0} / {result?.maxScores.language ?? 2}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                        <span>Решение коммуникативной задачи</span>
                        <span className="font-medium">
                          {result?.scores.content ?? 0} / {result?.maxScores.content ?? 3}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                        <span>Организация текста</span>
                        <span className="font-medium">
                          {result?.scores.organization ?? 0} / {result?.maxScores.organization ?? 3}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                        <span>Лексика</span>
                        <span className="font-medium">
                          {result?.scores.vocabulary ?? 0} / {result?.maxScores.vocabulary ?? 3}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                        <span>Грамматика</span>
                        <span className="font-medium">
                          {result?.scores.grammar ?? 0} / {result?.maxScores.grammar ?? 3}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                        <span>Орфография и пунктуация</span>
                        <span className="font-medium">
                          {result?.scores.spelling ?? 0} / {result?.maxScores.spelling ?? 2}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {mode === "letter" && (
                <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
                  <div className="mb-3 font-semibold text-white">Детали проверки</div>

                  <div className="space-y-3 text-white/75">
                    <div>
                      <span className="font-medium text-white">Ошибки в организации:</span>{" "}
                      {result?.organizationErrorsCount ?? 0}
                    </div>

                    {result?.organizationIssues && result.organizationIssues.length > 0 && (
                      <div>
                        <div className="mb-1 font-medium text-white">Что найдено по организации:</div>
                        <ul className="space-y-1 pl-5">
                          {result.organizationIssues.map((issue, index) => (
                            <li key={index} className="list-disc">
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <span className="font-medium text-white">Лексико-грамматические ошибки:</span>{" "}
                      {result?.lexGramErrorsCount ?? 0}
                    </div>

                    {result?.lexGramIssues && result.lexGramIssues.length > 0 && (
                      <div>
                        <div className="mb-1 font-medium text-white">Примеры лексико-грамматических ошибок:</div>
                        <ul className="space-y-1 pl-5">
                          {result.lexGramIssues.map((issue, index) => (
                            <li key={index} className="list-disc">
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <span className="font-medium text-white">Орфографические и пунктуационные ошибки:</span>{" "}
                      {result?.spellingPunctuationErrorsCount ?? 0}
                    </div>

                    {result?.spellingPunctuationIssues && result.spellingPunctuationIssues.length > 0 && (
                      <div>
                        <div className="mb-1 font-medium text-white">Примеры орфографических и пунктуационных ошибок:</div>
                        <ul className="space-y-1 pl-5">
                          {result.spellingPunctuationIssues.map((issue, index) => (
                            <li key={index} className="list-disc">
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
                <span className="font-semibold text-white">Сильные стороны:</span>
                <p className="mt-2 text-white/75">{result?.feedback.strengths || "—"}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
                <span className="font-semibold text-white">Что улучшить:</span>
                <p className="mt-2 text-white/75">{result?.feedback.improvements || "—"}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}


function PlaceholderCard({ text }: PlaceholderCardProps) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-white/52">
      {text}
    </div>
  );
}

function StatusPill({ label, danger = false }: StatusPillProps) {
  return (
    <div
      className={`inline-flex rounded-full border px-3 py-1.5 text-sm ${
        danger
          ? "border-red-400/20 bg-red-500/10 text-red-200"
          : "border-teal-400/15 bg-teal-400/10 text-teal-100/90"
      }`}
    >
      {label}
    </div>
  );
}

function AnimatedLetters({ text }: AnimatedLettersProps) {
  return (
    <span className="inline-block">
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.02 }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

const SPARKLE_POSITIONS = [
  { top: "8%",  left: "12%", duration: 2.8, delay: 0,   size: 9  },
  { top: "15%", left: "78%", duration: 3.6, delay: 1.1, size: 7  },
  { top: "32%", left: "5%",  duration: 3.2, delay: 0.6, size: 11 },
  { top: "28%", left: "91%", duration: 4.5, delay: 2.0, size: 7  },
  { top: "55%", left: "22%", duration: 3.8, delay: 0.3, size: 9  },
  { top: "62%", left: "65%", duration: 2.9, delay: 1.7, size: 7  },
  { top: "75%", left: "88%", duration: 4.2, delay: 0.9, size: 10 },
  { top: "82%", left: "38%", duration: 3.4, delay: 1.4, size: 7  },
  { top: "45%", left: "50%", duration: 3.7, delay: 2.5, size: 9  },
  { top: "90%", left: "15%", duration: 2.6, delay: 0.5, size: 7  },
  { top: "18%", left: "45%", duration: 4.8, delay: 1.8, size: 8  },
  { top: "70%", left: "55%", duration: 3.1, delay: 3.1, size: 7  },
  { top: "5%",  left: "55%", duration: 3.9, delay: 0.8, size: 9  },
  { top: "48%", left: "82%", duration: 2.7, delay: 2.2, size: 7  },
];

function TwinkleStar({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 0 C5 0 5.3 3.5 5.5 4.5 C6.5 4.7 10 5 10 5 C10 5 6.5 5.3 5.5 5.5 C5.3 6.5 5 10 5 10 C5 10 4.7 6.5 4.5 5.5 C3.5 5.3 0 5 0 5 C0 5 3.5 4.7 4.5 4.5 C4.7 3.5 5 0 5 0 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
        className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-teal-300/10 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
        className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-teal-400/[0.08] blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
        className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-teal-200/[0.07] blur-3xl"
      />

      {SPARKLE_POSITIONS.map((s, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0, 0.75, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          style={{
            top: s.top,
            left: s.left,
            willChange: "opacity, transform",
            filter: "drop-shadow(0 0 6px rgb(153 246 228 / 0.9)) drop-shadow(0 0 12px rgb(94 234 212 / 0.5))",
          }}
          className="absolute text-teal-100"
        >
          <TwinkleStar size={s.size} />
        </motion.div>
      ))}
    </div>
  );
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}
