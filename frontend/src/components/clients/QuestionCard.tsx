import { type FC } from "react";

interface Domain {
  name: string;
  key: string;
}

interface Question {
  id: string;
  question: string;
  type: string;
  required: boolean;
  placeholder?: string;
  domains?: Domain[];
}

interface Props {
  question: Question;
  value: any;
  onChange: (val: any) => void;
}

const QuestionCard: FC<Props> = ({ question, value, onChange }) => {
  if (question.type === "textarea") {
    return (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        className="w-full px-6 py-4 border border-gray-200 rounded-2xl bg-white/70 backdrop-blur-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none resize-none text-gray-800 placeholder-gray-500"
        rows={4}
      />
    );
  }

  if (question.type === "scale_multiple" && question.domains) {
    return (
      <div className="w-full space-y-6">
        {question.domains.map((domain) => (
          <div
            key={domain.key}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-800">{domain.name}</h4>
              <span className="text-2xl font-bold text-blue-600">
                {value?.[domain.key] || 0}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">1</span>
              <input
                type="range"
                min="1"
                max="10"
                value={value?.[domain.key] || 1}
                onChange={(e) =>
                  onChange({
                    ...value,
                    [domain.key]: parseInt(e.target.value),
                  })
                }
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-500">10</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default QuestionCard;
