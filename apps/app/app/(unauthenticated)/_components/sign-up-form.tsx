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
import { Input } from '@repo/design-system/components/ui/input';
import { cn } from '@repo/design-system/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import CheckEmail from './check-email';
import { PasswordInput } from './password-input';
import { Turnstile } from '@marsidev/react-turnstile';
import { env } from '@/env';

const formSchema = z.object({
  firstName: z
    .string({ message: 'First name is required' })
    .min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z
    .string({ message: 'Last name is required' })
    .min(2, { message: 'Last name must be at least 2 characters' }),
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string({ message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(32, { message: 'Password must not exceed 32 characters' }),
  turnstileToken: z.string(),
});
//   .refine((data) => data.password === data.confirmPassword, {
//     message: 'Passwords do not match',
//     path: ['confirmPassword'],
//   });

type FormValues = z.infer<typeof formSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      turnstileToken: '',
    },
  });

  async function onSubmit(values: FormValues) {
    // if (!turnstileToken) {
    //   setError('Please complete the CAPTCHA verification');
    //   return;
    // }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await authClient.signUp.email({
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        password: values.password,
        fetchOptions: {
          headers: {
            'x-captcha-response': values.turnstileToken,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error('An error occurred while signing up. Please try again.');
        setError(error.message || 'Failed to sign up. Please try again.');
        return;
      }

      toast.success(
        'Signup successful! Please check your email to verify your account.'
      );
      console.log('Signup successful:', data);
      setSuccess(true);
      setSentEmail(values.email);
      // Redirect to login page or verification page
      // router.push('/');
    } catch (err) {
      console.error('Signup exception:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  if (success && sentEmail) {
    return (
      <CheckEmail
        headline="Check your email to verify your account"
        description={`We've sent a verification link to your email ${sentEmail}. Please check your inbox to complete your registration.`}
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
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>FirstName</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                <FormLabel required>Password</FormLabel>
                <FormControl>
                  <PasswordInput showStrengthChecker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full justify-center">
            <Turnstile
              siteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
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
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
