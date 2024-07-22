export const AccordionStep = ({ step, currentStep, setStep, title, children }) => {
  const isOpen = step === currentStep;

  return (
    <div className="border-b border-slate-700">
      <div
        className="w-full text-left p-4 focus:outline-none cursor-pointer"
        onClick={() => setStep(step)}
      >
        <div className="flex justify-between items-center">
          <span className="text-left text-xl">{title}</span>
          <span>{isOpen ? '-' : '+'}</span>
        </div>
      </div>
      {isOpen && <div className="p-4 border bg-slate-950 border-b-0 border-slate-900 rounded-xl">
        {children}
        </div>}
    </div>
  );
};