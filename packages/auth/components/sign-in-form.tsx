'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile } from '@marsidev/react-turnstile';
import { signIn } from '@repo/auth/client';
import { keys } from '@repo/auth/keys';
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
import { PasswordInput } from '@repo/design-system/components/ui/password-input';
import { log } from '@repo/observability/log';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  turnstileToken: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function SignIn({ className, ...props }: React.ComponentProps<'div'>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      turnstileToken: '',
    },
  });

  const handleAuthError = (error: { code?: string; message?: string }) => {
    const errorMessage =
      error.code === 'EMAIL_NOT_VERIFIED'
        ? 'Email not verified. A new verification link has been sent to your inbox.'
        : error.message || 'Failed to login. Please try again.';

    setError(errorMessage);
    toast.error('Login failed', {
      description:
        error.code === 'EMAIL_NOT_VERIFIED'
          ? 'Please verify your email address before signing in.'
          : error.message || 'Failed to login. Please try again.',
    });
    log.error('Login error:', error);
  };

  const performSignIn = async (values: FormValues) => {
    const { error } = await signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: redirect || '/',
      fetchOptions: {
        headers: {
          'x-captcha-response': values.turnstileToken,
        },
      },
    });

    if (error) {
      handleAuthError(error);
      return false;
    }
    return true;
  };

  async function onSubmit(values: FormValues) {
    if (!turnstileToken) {
      setError('Please complete the CAPTCHA verification');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await performSignIn(values);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      log.error(errorMessage);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative grid w-full gap-6"
      >
        {error && (
          <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Email</FormLabel>
              <FormControl>
                <Input placeholder="m@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-end">
                <FormLabel required className="mb-0">
                  Password
                </FormLabel>
                <Link
                  href="forgot-password"
                  className="ml-auto text-primary text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <PasswordInput {...field} />
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
          className="mt-4 w-full"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Form>
  );
}
