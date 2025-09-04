import { HiCheck } from "react-icons/hi"

type Step = {
  number: number
  title: string
  description: string
}

type StepIndicatorProps = {
  steps: Step[]
  currentStep: number
}

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step.number < currentStep
                    ? "bg-green-500 text-white"
                    : step.number === currentStep
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {step.number < currentStep ? <HiCheck className="w-5 h-5" /> : step.number}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={`text-sm font-medium ${
                    step.number <= currentStep ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{step.description}</div>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  step.number < currentStep ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default StepIndicator
