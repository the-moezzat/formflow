'use client';

import { CheckEmail } from '@repo/design-system/components/check-email';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@repo/auth/client';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Input } from '@repo/design-system/components/ui/input';
import { cn } from '@repo/design-system/lib/utils';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Turnstile } from '@marsidev/react-turnstile';
import { keys } from '@repo/auth/keys';

const formSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  turnstileToken: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function SendResetEmail({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      turnstileToken: '',
    },
  });

  async function onSubmit(values: FormValues) {
    if (!turnstileToken) {
      setError('Please complete the CAPTCHA verification');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await authClient.forgetPassword({
        email: values.email,
        redirectTo: '/reset-password',
        fetchOptions: {
          headers: {
            'x-captcha-response': values.turnstileToken,
          },
        },
      });

      console.log('data', data, error);

      if (error) {
        console.error('Reset password error:', error);
        toast.error(
          'An error occurred while requesting password reset. Please try again.'
        );
        setError(
          error.message || 'Failed to request password reset. Please try again.'
        );
        return;
      }
      setSuccess(true);
      setSentEmail(values.email);
    } catch (err) {
      console.error('Reset password exception:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  if (success && sentEmail) {
    return (
      <CheckEmail
        headline="Check your email for a reset link"
        description={` We've sent a password reset link to your email ${sentEmail}. Please check your inbox.`}
        actions={
          <Button
            variant={'outline'}
            size={'sm'}
            onClick={() => {
              setSuccess(false);
              setSentEmail(null);
              form.reset();
            }}
          >
            Change Email
          </Button>
        }
      />
    );
  }

  return (
    <div className={cn('flex w-full flex-col gap-6', className)} {...props}>
      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Email address</FormLabel>
                <FormControl>
                  <Input placeholder="m@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full justify-center">
            <Turnstile
              siteKey={keys().NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              options={{
                size: 'flexible',
                theme: 'auto',
              }}
              onSuccess={(token) => {
                console.log('Token:', token);
                setTurnstileToken(token);
                form.setValue('turnstileToken', token);
              }}
              onError={() => {
                setError('CAPTCHA verification failed. Please try again.');
                setTurnstileToken(null);
                form.setValue('turnstileToken', '');
              }}
              onExpire={() => {
                setError('CAPTCHA verification expired. Please try again.');
                setTurnstileToken(null);
                form.setValue('turnstileToken', '');
              }}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? 'Resetting password...' : 'Reset password'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
