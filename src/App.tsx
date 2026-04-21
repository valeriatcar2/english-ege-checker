import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock3, ChevronLeft, CheckCircle2, FileText, Mail, Sparkles } from "lucide-react";
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
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
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
    <div className="mb-6 flex items-center justify-between">
      <button
        onClick={onHomeClick}
        className="inline-flex items-center gap-2 rounded-full border border-teal-400/15 bg-white/[0.03] px-4 py-2 text-sm text-white/70 transition hover:border-teal-300/30 hover:text-teal-200"
      >
        <Sparkles className="h-4 w-4" />
        English ЕГЭ Checker
      </button>
    </div>
  );
}

function Header() {
  const title = "English ЕГЭ Checker";

  return (
    <div className="mb-10 md:mb-14">
      <div className="mb-4 text-xs uppercase tracking-wide text-white/30">
        Дипломный проект · ИМО МПГУ · 2026
      </div>

      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-400/15 bg-teal-400/10 px-4 py-2.5 text-base text-teal-100/90 backdrop-blur">
        <Sparkles className="h-4 w-4" />
        AI-платформа
      </div>

      <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-6xl">
        <AnimatedLetters text={title} />
      </h1>

      <p className="max-w-2xl text-base leading-7 text-white/70 md:text-lg">
        Проверка письменной части ЕГЭ по английскому языку 2026
      </p>
      
      <div className="mt-6 max-w-3xl rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-white/70">
        <p className="mb-3 text-white font-medium">
          Добро пожаловать в English ЕГЭ Checker!
        </p>

        <p className="mb-3">
          На этой платформе вы сможете выполнять задания письменной части ЕГЭ по английскому языку, актуальные на 2026 год, получать автоматическую проверку с помощью искусственного интеллекта и рекомендации по улучшению своей работы.
        </p>

        <p className="mb-4">
          Надеемся, что платформа поможет вам увереннее готовиться к экзамену и шаг за шагом совершенствовать свои письменные навыки.
        </p>

        <div className="flex flex-wrap items-center gap-2 text-white/60">
          <span className="font-medium">Обратная связь:</span>

          <a
            href="https://vk.com/lera_tsareva"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-teal-200 hover:text-teal-100 transition"
          >
            <span>VK</span>
            <span>Валерия Царёва</span>
          </a>
        </div>
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
  if (examMode && timeLeft !== null && timeLeft <= 0) return;
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

    <div className={`grid gap-6 ${showResultsPanel ? "lg:grid-cols-[1.1fr_0.9fr]" : "lg:grid-cols-1"}`}>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[28px] border border-teal-400/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-7"
      >
        {!mode ? (
          <ChooseTask setMode={handleSelectMode} />
        ) : !activeVariant && currentTask ? (
          <ChooseVariant mode={mode} variants={variants} onBack={resetAll} onSelect={handleSelectVariant} />
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
            transition={{ duration: 0.35 }}
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
  </>
);
}

function ChooseTask({ setMode }: ChooseTaskProps) {
  return (
    <div>
      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-white/45">Старт</p>
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
    </div>
  );
}

function TaskCard({ title, subtitle, icon: Icon, onClick }: TaskCardProps) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onClick={onClick}
      className="group rounded-[24px] border border-teal-400/12 bg-gradient-to-br from-teal-400/10 to-white/[0.03] p-6 text-left"
    >
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-400/15 bg-teal-400/10">
        <Icon className="h-5 w-5 text-white/90" />
      </div>
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="text-sm leading-6 text-white/60">{subtitle}</p>
      <div className="mt-6 text-sm text-white/45 transition group-hover:text-teal-200">Открыть →</div>
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

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
  <div className="min-w-0">
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
        К вариантам
      </button>

      <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/15 bg-teal-400/10 px-3 py-1.5 text-sm text-teal-100/90">
        <Icon className="h-4 w-4" />
        {currentTask.title} · Вариант {activeVariant.label}
      </div>
    </div>

    <h2 className="text-2xl font-semibold md:text-3xl">Задание</h2>
  </div>

  <div className="flex flex-col items-start gap-3 md:items-end">
    <div className="inline-flex items-center gap-3 rounded-full border border-teal-400/15 bg-teal-400/10 px-4 py-2 text-sm text-teal-100/90">
      <span>Режим экзамена</span>

      <button
        type="button"
        onClick={() => setExamMode((prev) => !prev)}
        aria-pressed={examMode}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          examMode ? "bg-teal-300" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
            examMode ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>

    <AnimatePresence>
      {examMode && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
            expired
              ? "border-red-400/30 bg-red-500/10 text-red-200"
              : "border-teal-400/15 bg-teal-400/10 text-teal-100/90"
          }`}
        >
          <Clock3 className="h-4 w-4" />
          {formatTime(timeLeft ?? currentTask.duration)}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</div>

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

      <div className="mb-4">
        <label className="mb-2 block text-sm text-white/60">Поле для ввода ответа</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={currentTask.placeholder}
          className="min-h-[260px] w-full resize-none rounded-[24px] border border-white/10 bg-black/20 px-5 py-4 text-base outline-none transition placeholder:text-white/25 focus:border-white/20 focus:bg-black/30"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-white/45">
          {examMode
            ? expired
              ? "Время вышло — отправка отключена."
              : `Режим экзамена активен: ${Math.floor(currentTask.duration / 60)} минут.`
            : "Режим экзамена выключен — таймер скрыт."}
        </div>

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSubmit}
          disabled={expired}
          className="rounded-full border border-teal-300/20 bg-teal-300 px-5 py-3 text-sm font-medium text-black transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/35"
        >
          Отправить
        </motion.button>
      </div>
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

function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-teal-300/10 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-teal-400/[0.08] blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-teal-200/[0.07] blur-3xl"
      />
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
