import React, {
  useEffect,
  useReducer,
  useMemo,
  useCallback,
  useState,
} from "react";
import type { Question } from "./types";
import QuestionCard from "./components/QuestionCard";

import questionsArabicData from "./questions/questions_ar.json";
import questionsEnglishData from "./questions/questions_en.json";
import questionsFrenchData from "./questions/questions_fr.json";

// --- Types and Helper Functions ---

type Language = "ar" | "en" | "fr";

interface QuizState {
  allQuestions: Question[];
  unansweredIds: number[];
  correctAnswersCount: number;
  selectedAnswer: string | null;
  isAnswered: boolean;
}

type QuizAction =
  | { type: "ANSWER_QUESTION"; payload: { answer: string; isCorrect: boolean } }
  | { type: "NEXT_QUESTION" }
  | { type: "RESET_QUIZ"; payload: { questions: Question[] } };

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const questionsByLang: Record<Language, Question[]> = {
  ar: questionsArabicData.questions,
  en: questionsEnglishData.questions,
  fr: questionsFrenchData.questions,
};

// --- Reducer ---

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  // ... (reducer logic remains the same)
  switch (action.type) {
    case "ANSWER_QUESTION":
      return {
        ...state,
        isAnswered: true,
        selectedAnswer: action.payload.answer,
        correctAnswersCount:
          state.correctAnswersCount + (action.payload.isCorrect ? 1 : 0),
      };
    case "NEXT_QUESTION": {
      const nextUnansweredIds = state.unansweredIds.slice(1);
      if (nextUnansweredIds.length === 0 && state.allQuestions.length > 0) {
        return {
          ...state,
          unansweredIds: shuffleArray(state.allQuestions.map((q) => q.id)),
          isAnswered: false,
          selectedAnswer: null,
        };
      }
      return {
        ...state,
        unansweredIds: nextUnansweredIds,
        isAnswered: false,
        selectedAnswer: null,
      };
    }
    case "RESET_QUIZ": {
      const newQuestions = action.payload.questions;
      return {
        allQuestions: newQuestions,
        unansweredIds: shuffleArray(newQuestions.map((q) => q.id)),
        correctAnswersCount: 0,
        selectedAnswer: null,
        isAnswered: false,
      };
    }
    default:
      return state;
  }
};

// --- Component ---

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>("ar");

  const createInitialState = (lang: Language): QuizState => {
    const initialQuestions = questionsByLang[lang];
    return {
      allQuestions: initialQuestions,
      unansweredIds: shuffleArray(initialQuestions.map((q) => q.id)),
      correctAnswersCount: 0,
      selectedAnswer: null,
      isAnswered: false,
    };
  };

  const [state, dispatch] = useReducer(
    quizReducer,
    createInitialState(language)
  );

  const {
    allQuestions,
    unansweredIds,
    correctAnswersCount,
    selectedAnswer,
    isAnswered,
  } = state;

  // Effect to reset the quiz when the language changes
  useEffect(() => {
    dispatch({
      type: "RESET_QUIZ",
      payload: { questions: questionsByLang[language] },
    });
  }, [language]);

  // *** NEW: Effect to update the HTML tag attributes ***
  useEffect(() => {
    const html = document.documentElement;
    const isRtl = language === "ar";

    html.lang = language;
    html.dir = isRtl ? "rtl" : "ltr";
  }, [language]); // This effect runs whenever the language state changes

  // Derived State (calculations based on state)
  const currentQuestionId = useMemo(() => unansweredIds[0], [unansweredIds]);
  // ... (rest of the component is the same)
  const currentQuestion = useMemo(
    () => allQuestions.find((q) => q.id === currentQuestionId) || null,
    [allQuestions, currentQuestionId]
  );
  const totalQuestions = allQuestions.length;
  const questionNumber = totalQuestions - unansweredIds.length + 1;

  const handleAnswerSelect = useCallback(
    (answer: string) => {
      if (isAnswered || !currentQuestion) return;
      dispatch({
        type: "ANSWER_QUESTION",
        payload: {
          answer,
          isCorrect: answer === currentQuestion.correctAnswer,
        },
      });
    },
    [isAnswered, currentQuestion]
  );

  const handleNextQuestion = useCallback(() => {
    dispatch({ type: "NEXT_QUESTION" });
  }, []);

  const renderContent = () => {
    if (!currentQuestion) {
      return (
        <p className="text-center text-slate-500">No questions available.</p>
      );
    }
    return (
      <QuestionCard
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        isAnswered={isAnswered}
        onAnswerSelect={handleAnswerSelect}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        correctAnswers={correctAnswersCount}
      />
    );
  };

  const LanguageSwitcher = () => (
    <div className="flex justify-center gap-2 mb-6">
      {(Object.keys(questionsByLang) as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
            language === lang
              ? "bg-sky-500 text-white"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-10 transition-shadow">
        <header className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 dark:text-white">
            Driving Test
          </h1>
        </header>
        <LanguageSwitcher />
        <main>{renderContent()}</main>
      </div>
      {isAnswered && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-10">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleNextQuestion}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow-md"
            >
              Next Question
            </button>
          </div>
        </div>
      )}
      {isAnswered && <div className="h-24"></div>}
      <footer className="absolute bottom-0 left-0 right-0 text-center py-4 z-0">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Made with 🩵 by{" "}
          <a
            href="https://github.com/Murf-y/"
            className="font-semibold underline"
          >
            Murf-y
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
