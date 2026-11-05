"use client";

import * as React from "react";
import { Check, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type StepState = "active" | "completed" | "inactive" | "loading";

type StepperContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  orientation: "horizontal" | "vertical";
};

type StepItemContextValue = {
  step: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
};

const StepperContext = React.createContext<StepperContextValue | undefined>(undefined);
const StepItemContext = React.createContext<StepItemContextValue | undefined>(undefined);

function useStepper() {
  const context = React.useContext(StepperContext);
  if (!context) throw new Error("Stepper components must be used inside Stepper.");
  return context;
}

function useStepItem() {
  const context = React.useContext(StepItemContext);
  if (!context) throw new Error("Stepper item components must be used inside StepperItem.");
  return context;
}

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    { defaultValue = 1, value, onValueChange, orientation = "horizontal", className, ...props },
    ref,
  ) => {
    const [internalStep, setInternalStep] = React.useState(defaultValue);
    const setActiveStep = React.useCallback(
      (step: number) => {
        if (value === undefined) setInternalStep(step);
        onValueChange?.(step);
      },
      [value, onValueChange],
    );

    return (
      <StepperContext.Provider
        value={{ activeStep: value ?? internalStep, setActiveStep, orientation }}
      >
        <div
          ref={ref}
          className={cn(
            "group/stepper inline-flex w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
            className,
          )}
          data-orientation={orientation}
          {...props}
        />
      </StepperContext.Provider>
    );
  },
);
Stepper.displayName = "Stepper";

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  (
    { step, completed = false, disabled = false, loading = false, className, children, ...props },
    ref,
  ) => {
    const { activeStep } = useStepper();
    const state: StepState =
      completed || step < activeStep ? "completed" : activeStep === step ? "active" : "inactive";
    const isLoading = loading && step === activeStep;

    return (
      <StepItemContext.Provider value={{ step, state, isDisabled: disabled, isLoading }}>
        <div
          ref={ref}
          className={cn(
            "group/step flex items-center data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
            className,
          )}
          data-state={isLoading ? "loading" : state}
          data-loading={isLoading || undefined}
          {...props}
        >
          {children}
        </div>
      </StepItemContext.Provider>
    );
  },
);
StepperItem.displayName = "StepperItem";

interface StepperTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
  ({ asChild = false, className, children, onClick, ...props }, ref) => {
    const { setActiveStep } = useStepper();
    const { step, isDisabled } = useStepItem();
    if (asChild) return <div className={className}>{children}</div>;
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center gap-3 disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) setActiveStep(step);
        }}
        disabled={isDisabled}
        {...props}
      >
        {children}
      </button>
    );
  },
);
StepperTrigger.displayName = "StepperTrigger";

interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const StepperIndicator = React.forwardRef<HTMLDivElement, StepperIndicatorProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const { state, step, isLoading } = useStepItem();
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex size-8 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-semibold text-muted-foreground transition-colors data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:ring-4 data-[state=active]:ring-brand-gold/25 data-[state=completed]:border-primary data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground",
          className,
        )}
        data-state={isLoading ? "loading" : state}
        aria-hidden="true"
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            <span className="transition-all group-data-[state=completed]/step:scale-0 group-data-[state=completed]/step:opacity-0">
              {step}
            </span>
            <Check
              className="absolute size-4 scale-0 opacity-0 transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100"
              strokeWidth={2.5}
            />
            {isLoading && <LoaderCircle className="absolute size-4 animate-spin" />}
          </>
        )}
      </div>
    );
  },
);
StepperIndicator.displayName = "StepperIndicator";

const StepperTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-sm font-medium", className)} {...props} />
  ),
);
StepperTitle.displayName = "StepperTitle";

const StepperDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
));
StepperDescription.displayName = "StepperDescription";

const StepperSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mx-3 my-0.5 h-0.5 w-full flex-1 rounded-full bg-muted group-data-[orientation=vertical]/stepper:h-12 group-data-[orientation=vertical]/stepper:w-0.5 group-data-[state=completed]/step:bg-primary",
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  ),
);
StepperSeparator.displayName = "StepperSeparator";

export {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
};
