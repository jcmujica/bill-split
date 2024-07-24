export const AccordionStep = (props) => {
  const { step, currentStep, setStep, title, children, disabled } = props
  const isOpen = step === currentStep;

  const handleSetStep = (step) => {
    if (disabled) {
      return
    }
    setStep(step)
  }

  return (
    <div className="border-b border-slate-300 dark:border-slate-800">
      <div
        className={`w-full text-left p-4 font-bold focus:outline-none cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => handleSetStep(step)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-center gap-2">
            <StepNumber step={step} currentStep={currentStep} />
            <span className={`text-left text-xl font-[RobotoSlab] ${isOpen ? 'text-orange-500' : 'text-gray-500'}`}>
              {title}
            </span>
          </div>
          <span className={`text-orange-500 ${isOpen ? 'text-orange-500' : 'text-gray-500'}`}>{isOpen ? '-' : '+'}</span>
        </div>
      </div>
      {isOpen && <div className="p-4 border bg-orange-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800 rounded-xl">
        {children}
      </div>}
    </div>
  );
};

const StepNumber = ({ step, currentStep }) => {
  const isActive = step === currentStep;

  return (
    <div className="flex items-center justify-center text-xs font-bold text-slate-100 dark:text-slate-800">
      <span className={`rounded-full text-bold text-lg flex items-center justify-center w-6 h-6 ${isActive ? 'bg-orange-500' : 'bg-gray-500'}`}>
        {step}
      </span>
    </div>
  );
}