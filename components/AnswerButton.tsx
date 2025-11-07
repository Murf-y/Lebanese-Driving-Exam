import React from "react";

interface AnswerButtonProps {
  answer: string;
  correctAnswer: string;
  selectedAnswer: string | null;
  isAnswered: boolean;
  onClick: (answer: string) => void;
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const AnswerButton: React.FC<AnswerButtonProps> = ({
  answer,
  correctAnswer,
  selectedAnswer,
  isAnswered,
  onClick,
}) => {
  const isSelected = selectedAnswer === answer;
  const isCorrect = answer === correctAnswer;

  const getButtonClass = () => {
    if (isAnswered) {
      if (isCorrect) {
        return "bg-green-500 border-green-600 text-white";
      }
      if (isSelected && !isCorrect) {
        return "bg-red-500 border-red-600 text-white";
      }
      return "bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400 cursor-not-allowed";
    }
    return "bg-white border-slate-300 hover:bg-sky-100 hover:border-sky-400 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-sky-900 dark:hover:border-sky-700 text-slate-700 dark:text-slate-300";
  };

  return (
    <button
      onClick={() => onClick(answer)}
      disabled={isAnswered}
      className={`w-full p-4 my-2 text-sm sm:text-lg text-right border-2 rounded-lg shadow-sm transition-all duration-300 flex justify-between items-center ${getButtonClass()}`}
    >
      <span className="flex-grow">{answer}</span>
      {isAnswered && isCorrect && (
        <CheckIcon className="w-6 h-6 ms-4 text-white" />
      )}
      {isAnswered && isSelected && !isCorrect && (
        <XIcon className="w-6 h-6 ms-4 text-white" />
      )}
    </button>
  );
};

export default AnswerButton;
