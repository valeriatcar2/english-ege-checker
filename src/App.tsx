import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock3, ChevronLeft, CheckCircle2, FileText, Mail, Sparkles } from "lucide-react";

type TaskMode = "letter" | "essay" | null;

type VariantConfig = {
  id: number;
  label: string;
  taskText: string;
  prompt: string;
};

type TaskConfig = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  duration: number;
  placeholder: string;
  variants: VariantConfig[];
};

type TaskMap = {
  letter: TaskConfig;
  essay: TaskConfig;
};

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

const TASK_DATA: TaskMap = {
  letter: {
    title: "Письмо",
    icon: Mail,
    duration: 15 * 60,
    placeholder: "Введите здесь свой ответ на задание по письму...",
    variants: Array.from({ length: 15 }, (_, index) => ({
      id: index + 1,
      label: String(index + 1),
      taskText: `Вставьте сюда текст задания для письма, вариант ${index + 1}.`,
      prompt: `Вставьте сюда промпт для проверки письма, вариант ${index + 1}.`
    }))
  },
  essay: {
    title: "Эссе",
    icon: FileText,
    duration: 45 * 60,
    placeholder: "Введите здесь своё эссе...",
    variants: Array.from({ length: 15 }, (_, index) => ({
      id: index + 1,
      label: String(index + 1),
      taskText: `Вставьте сюда текст задания для эссе, вариант ${index + 1}.`,
      prompt: `Вставьте сюда промпт для проверки эссе, вариант ${index + 1}.`
    }))
  }
};

export default function EnglishEGEChecker() {
  return (
    <div className="min-h-screen overflow-hidden bg-neutral-950 text-white selection:bg-teal-300/30 selection:text-white">
      <AnimatedBackground />
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
        <Header />
        <CheckerDemo />
      </main>
    </div>
  );
}

function Header() {
  const title = "English ЕГЭ Checker";

  return (
    <div className="mb-10 md:mb-14">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-400/15 bg-teal-400/10 px-4 py-2 text-sm text-teal-100/90 backdrop-blur">
        <Sparkles className="h-4 w-4" />
        AI-платформа для тренировки письменной части
      </div>

      <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-6xl">
        <AnimatedLetters text={title} />
      </h1>

      <p className="max-w-2xl text-base leading-7 text-white/70 md:text-lg">
        Проверка письменной части ЕГЭ по английскому языку 2026
      </p>
    </div>
  );
}

function CheckerDemo() {
  const [mode, setMode] = useState<TaskMode>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [examMode, setExamMode] = useState(false);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

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

  const handleSubmit = () => {
    if (examMode && timeLeft !== null && timeLeft <= 0) return;
    setSubmitted(true);
  };

  const handleSelectMode = (nextMode: TaskMode) => {
    setMode(nextMode);
    setSelectedVariantId(null);
    setText("");
    setSubmitted(false);
    setExamMode(false);
    setTimeLeft(null);
  };

  const handleSelectVariant = (variantId: number | null) => {
    setSelectedVariantId(variantId);
    setText("");
    setSubmitted(false);
    setTimeLeft(examMode && currentTask ? currentTask.duration : null);
  };

  const resetAll = () => {
    setMode(null);
    setSelectedVariantId(null);
    setText("");
    setSubmitted(false);
    setExamMode(false);
    setTimeLeft(null);
  };

  const resetToVariants = () => {
    setSelectedVariantId(null);
    setText("");
    setSubmitted(false);
    setTimeLeft(null);
  };

  return (
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
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChooseTask({ setMode }: ChooseTaskProps) {
  return (
    <div>
      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-white/45">Старт</p>
      <h2 className="mb-3 text-2xl font-semibold md:text-3xl">Выберите тип задания</h2>
      <p className="mb-8 max-w-xl text-white/65">
        Сначала пользователь выбирает формат письменной части, а затем — конкретный вариант задания.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <TaskCard
          title="Письмо"
          subtitle="Личное письмо в формате ЕГЭ"
          icon={Mail}
          onClick={() => setMode("letter")}
        />
        <TaskCard
          title="Эссе"
          subtitle="Opinion essay в формате ЕГЭ"
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
      <p className="mb-8 text-white/65">
        У каждого варианта будет свой отдельный текст задания и собственный промпт для проверки.
      </p>

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
        <div>
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            К вариантам
          </button>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-400/15 bg-teal-400/10 px-3 py-1.5 text-sm text-teal-100/90">
            <Icon className="h-4 w-4" />
            {currentTask.title} · Вариант {activeVariant.label}
          </div>
          <h2 className="text-2xl font-semibold md:text-3xl">Задание</h2>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <label className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-teal-400/15 bg-teal-400/10 px-4 py-2 text-sm text-teal-100/90">
            <input
              type="checkbox"
              checked={examMode}
              onChange={(e) => setExamMode(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-transparent"
            />
            Перейти в режим экзамена
          </label>

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

      <div className="mb-5 rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-white/78">
        <p className="mb-2 text-xs uppercase tracking-[0.24em] text-white/40">Текст задания</p>
        <p className="whitespace-pre-line leading-7">{activeVariant.taskText}</p>
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

function ResultPanel({ mode, selectedVariant, submitted, examMode, timeLeft }: ResultPanelProps) {
  const expired = examMode && timeLeft !== null && timeLeft <= 0;

  return (
    <div className="h-full">
      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-white/45">Результат</p>
      <h2 className="mb-3 text-2xl font-semibold">Проверка и рекомендации</h2>
      <p className="mb-6 text-white/65">
        Пока это демонстрационный экран. Позже сюда будет подгружаться ответ модели по конкретному выбранному варианту и его отдельному промпту.
      </p>

      {!mode || !selectedVariant ? (
        <PlaceholderCard text="Сначала откройте конкретный вариант задания." />
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
            — комментарии по ошибкам внутри общего ответа модели
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-[24px] border border-teal-400/15 bg-teal-500/10 p-5">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-teal-300/15 bg-teal-300/10 px-3 py-1 text-sm text-teal-100">
              <CheckCircle2 className="h-4 w-4" />
              Ответ получен
            </div>
            <p className="text-sm leading-7 text-white/75">
              Здесь будет вывод проверки по критериям ЕГЭ: баллы, рекомендации и комментарии по ошибкам внутри общего блока ответа модели.
            </p>
          </div>

          <DemoScoreBlock />
        </motion.div>
      )}
    </div>
  );
}

function DemoScoreBlock() {
  const items: Array<[string, string]> = [
    ["Содержание", "3/3"],
    ["Организация", "2/3"],
    ["Лексика", "2/3"],
    ["Грамматика", "2/3"],
    ["Орфография и пунктуация", "2/2"]
  ];

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-white/55">Пример отображения</span>
        <span className="rounded-full border border-teal-400/15 bg-teal-400/10 px-3 py-1 text-sm text-teal-100/90">
          11 / 14
        </span>
      </div>

      <div className="space-y-3">
        {items.map(([label, score]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/15 px-4 py-3 text-sm"
          >
            <span className="text-white/70">{label}</span>
            <span className="font-medium text-white">{score}</span>
          </div>
        ))}
      </div>
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
