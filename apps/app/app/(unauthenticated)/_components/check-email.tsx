import { Alert } from '@repo/design-system/components/ui/alert';
import { Mail } from 'lucide-react';
import type React from 'react';

interface CheckEmailProps {
  headline?: string;
  description?: string;
  email?: string;
  className?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export const CheckEmail: React.FC<CheckEmailProps> = ({
  headline = 'Check your email',
  description = 'We have sent an email to your inbox. Please check your email to continue.',
  email,
  className = '',
  actions,
  children,
}) => {
  return (
    <Alert className={`mx-auto max-w-md p-6 ${className}`}>
      <div className="flex items-start gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border "
          aria-hidden="true"
        >
          <Mail className=" opacity-80" size={20} strokeWidth={2} />
        </div>
        <div className="flex grow flex-col gap-3">
          <div className="space-y-1">
            <p className="font-semibold text-base">{headline}</p>
            <p className="text-muted-foreground text-sm">
              {description}
              {email && (
                <span className="mt-1 block break-all font-medium text-primary">
                  {email}
                </span>
              )}
            </p>
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
          {children}
        </div>
      </div>
    </Alert>
  );
};

export default CheckEmail;
