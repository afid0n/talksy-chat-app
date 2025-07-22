interface Props {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: Props) => {
  return (
    <div className="flex items-center justify-between mb-6">
      {[...Array(totalSteps)].map((_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 mx-1 rounded-full ${
            i < currentStep ? "bg-yellow-500" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default ProgressBar;
