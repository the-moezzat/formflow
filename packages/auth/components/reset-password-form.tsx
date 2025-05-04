'use client';

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
import { PasswordInput } from '@repo/design-system/components/ui/password-input';
import { cn } from '@repo/design-system/lib/utils';
import { log } from '@repo/observability/log';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z
  .object({
    password: z
      .string({ message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(32, { message: 'Password must not exceed 32 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type FormValues = z.infer<typeof formSchema>;

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const token = useSearchParams().get('token') as string;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: values.password,
        token: token,
      });

      if (error) {
        log.error('Reset password error:', error);
        toast.error(
          'An error occurred while resetting your password. Please try again.',
          {
            description:
              error.message || 'Failed to reset password. Please try again.',
          }
        );
        setError(
          error.message || 'Failed to reset password. Please try again.'
        );
        return;
      }

      toast.success(
        'Password reset successfully! Please sign in with your new password.'
      );
      router.push('/sign-in');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      log.error('Reset password exception:', { message: errorMessage });
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Password</FormLabel>
                <FormControl>
                  <PasswordInput showStrengthChecker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className=" w-full" disabled={isLoading}>
            {isLoading ? 'Resetting password...' : 'Reset password'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
