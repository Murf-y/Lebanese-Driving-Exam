import React from "react";
import type { Question } from "../types";
import AnswerButton from "./AnswerButton";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  isAnswered: boolean;
  onAnswerSelect: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
  correctAnswers: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  isAnswered,
  onAnswerSelect,
  questionNumber,
  totalQuestions,
  correctAnswers,
}) => {
  if (!question) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6 text-center flex flex-col space-y-2">
        <p className="text-sm sm:text-lg font-semibold text-sky-600 dark:text-sky-400">{`Question ${questionNumber} from ${totalQuestions}`}</p>
        <div className="flex items-center justify-center gap-2 text-xs sm:text-lg text-slate-500 dark:text-slate-400">
          <span className="bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400 px-2.5 py-0.5 rounded-full text-xs font-medium">
            Category: {question.category}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
            Correct Answers: {correctAnswers}
          </span>
        </div>
      </div>

      {question.category === "Signs" && (
        <div className="mb-6 flex justify-center">
          <img
            src={`signs/${question.id}.png`}
            alt={`Traffic sign for question ${question.id}`}
            className="h-48 w-48 object-contain bg-white rounded-lg shadow-md p-2"
          />
        </div>
      )}

      <h2 className="mb-8 text-lg sm:text-2xl font-bold text-center text-slate-800 dark:text-slate-100">
        {question.question}
      </h2>

      <div>
        {question.answers.map((answer, index) => (
          <AnswerButton
            key={index}
            answer={answer}
            correctAnswer={question.correctAnswer}
            selectedAnswer={selectedAnswer}
            isAnswered={isAnswered}
            onClick={onAnswerSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
