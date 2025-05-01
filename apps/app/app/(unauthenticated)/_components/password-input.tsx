import { Input } from '@repo/design-system/components/ui/input';
import { cn } from '@repo/design-system/lib/utils';
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react';
import {
  type ChangeEvent,
  type ChangeEventHandler,
  type ComponentProps,
  useMemo,
  useState,
} from 'react';

export function PasswordInput({
  className,
  value,
  onChange,
  showStrengthChecker = false,
  ...props
}: ComponentProps<'input'> & {
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  showStrengthChecker?: boolean;
}) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  // Internal state only used if component is uncontrolled
  const [internalPassword, setInternalPassword] = useState('');

  // Use either controlled or uncontrolled value
  const password = value !== undefined ? value : internalPassword;

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // If component is controlled, use the provided onChange
    if (onChange) {
      onChange(e);
    } else {
      // Otherwise use internal state
      setInternalPassword(e.target.value);
    }
  };

  // Password strength checking logic
  const requirements = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /[0-9]/, text: 'At least 1 number' },
    { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
    { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  ];

  const checkStrength = (pass: string) => {
    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const strength = useMemo(() => {
    return checkStrength(password || '');
  }, [password]);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) {
      return 'bg-border';
    }
    if (score <= 1) {
      return 'bg-red-500';
    }
    if (score <= 2) {
      return 'bg-orange-500';
    }
    if (score === 3) {
      return 'bg-amber-500';
    }
    return 'bg-emerald-500';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) {
      return 'Enter a password';
    }
    if (score <= 2) {
      return 'Weak password';
    }
    if (score === 3) {
      return 'Medium password';
    }
    return 'Strong password';
  };

  return (
    <div>
      {/* Password input field with toggle visibility button */}
      <div className="relative">
        <Input
          className={cn('pe-9', className)}
          placeholder="Password"
          type={isVisible ? 'text' : 'password'}
          value={password}
          onChange={handleChange}
          aria-describedby="password-strength"
          {...props}
        />
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible ? 'true' : 'false'}
        >
          {isVisible ? (
            <EyeOffIcon size={16} aria-hidden="true" />
          ) : (
            <EyeIcon size={16} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Password strength indicator - shown when focused or when showStrengthChecker is true */}
      <div
        className={cn(
          'mt-3 transition-opacity duration-200',
          showStrengthChecker
            ? 'opacity-100'
            : 'hidden h-0 overflow-hidden opacity-0'
        )}
      >
        {/* biome-ignore lint/nursery/useAriaPropsSupportedByRole: <explanation> */}
        <div
          className="mb-4 h-1 w-full overflow-hidden rounded-full bg-border"
          // biome-ignore lint/a11y/useAriaPropsForRole: <explanation>
          role="progressbar"
          tabIndex={0}
          aria-valuenow={strengthScore}
          aria-label="Password strength"
          id="password-strength"
        >
          <div
            className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
            style={{ width: `${(strengthScore / 4) * 100}%` }}
          />
        </div>

        {/* Password strength description */}
        <p className="mb-2 font-medium text-foreground text-sm">
          {getStrengthText(strengthScore)}. Must contain:
        </p>

        {/* Password requirements list */}
        <ul className="space-y-1.5" aria-label="Password requirements">
          {strength.map((req, index) => (
            <li key={index} className="flex items-center gap-2">
              {req.met ? (
                <CheckIcon
                  size={16}
                  className="text-emerald-500"
                  aria-hidden="true"
                />
              ) : (
                <XIcon
                  size={16}
                  className="text-muted-foreground/80"
                  aria-hidden="true"
                />
              )}
              <span
                className={`text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`}
              >
                {req.text}
                <span className="sr-only">
                  {req.met ? ' - Requirement met' : ' - Requirement not met'}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
