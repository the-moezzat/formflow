'use client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import Link from 'next/link';
import { authClient } from '@repo/auth/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

export default function Page() {
  const router = useRouter();
  const inviteInputRef = useRef<{
    getInvitees: () => { email: string; role: string }[];
    validate: () => boolean;
  }>(null);
  const [hasEmail, setHasEmail] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  useEffect(() => {
    const checkEmails = () => {
      if (inviteInputRef.current) {
        const invitees = inviteInputRef.current.getInvitees();
        setHasEmail(invitees.some((i) => i.email.trim() !== ''));
      }
    };
    checkEmails();
    const interval = setInterval(checkEmails, 200);
    return () => clearInterval(interval);
  }, []);

  const handleInvite = async () => {
    if (!inviteInputRef.current) {
      return;
    }

    const isValid = inviteInputRef.current.validate();
    if (!isValid) {
      return;
    }

    const invitees = inviteInputRef.current
      .getInvitees()
      .filter((i) => i.email.trim() !== '');

    for (const member of invitees) {
      const { error } = await authClient.organization.inviteMember({
        email: member.email,
        role: member.role as 'member' | 'admin' | 'owner',
      });

      if (error) {
        console.error(error);
        toast.error(`Failed to invite ${member.email}`, {
          description: error.message,
        });
        return;
      }
    }

    toast.success('Invitations sent successfully');

    setIsInviting(false);
    router.push('/');
  };

  return (
    <div className="flex w-[450px] flex-col gap-6">
      <div className="space-y-2">
        <h1 className="font-semibold text-xl">Collaborate with your team</h1>
        <p className="text-muted-foreground text-sm">
          The more your teammates use Formflow, the more powerful it becomes. We
          make it incredibly easy to collaborate with your team.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-medium text-gray-700 text-sm">
          Invite people to collaborate
        </p>
        <div className="max-h-[250px] overflow-y-auto overflow-x-visible p-0.5 pr-4">
          <InviteMemberEmailInput ref={inviteInputRef} />
        </div>
        <Button
          className="mt-4"
          onClick={handleInvite}
          disabled={!hasEmail || isInviting}
        >
          {isInviting ? 'Inviting...' : 'Invite'}
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/">Skip for now</Link>
        </Button>
      </div>
    </div>
  );
}

const inviteeSchema = z.object({
  email: z.string().email('Invalid email'),
  role: z.enum(['member', 'admin'], {
    invalid_type_error: 'Invalid role',
  }),
});

const InviteMemberEmailInput = forwardRef(
  function InviteMemberEmailInput(_, ref) {
    const [invitees, setInvitees] = useState([
      { email: '', role: 'member' },
      { email: '', role: 'member' },
    ]);
    const [errors, setErrors] = useState<string[]>([]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useImperativeHandle(
      ref,
      () => ({
        getInvitees: () => invitees,
        validate: () => {
          const validationResults = invitees.map((invitee) => {
            if (!invitee.email) return '';
            const result = inviteeSchema.safeParse(invitee);
            return result.success ? '' : result.error.errors[0].message;
          });
          setErrors(validationResults);
          return validationResults.every((e) => !e);
        },
      }),
      [invitees]
    );

    // Add a new invitee if the last input is focused
    const handleFocus = (idx: number) => {
      if (idx === invitees.length - 1) {
        setInvitees((prev) => [...prev, { email: '', role: 'member' }]);
      }
    };

    // Update email or role
    const handleChange = (
      idx: number,
      field: 'email' | 'role',
      value: string
    ) => {
      setInvitees((prev) =>
        prev.map((invitee, i) =>
          i === idx ? { ...invitee, [field]: value } : invitee
        )
      );
      if (field === 'email') {
        setErrors((prev) => prev.map((err, i) => (i === idx ? '' : err)));
      }
    };

    return (
      <div className="*:not-first:mt-2">
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {invitees.map((invitee, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex flex-col rounded-md shadow-xs"
                layout
              >
                <div className="flex">
                  <Input
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    className={`-me-px rounded-e-none shadow-none focus-visible:z-10 ${errors[idx] ? 'border-red-500' : ''}`}
                    placeholder="example@email.com"
                    type="text"
                    value={invitee.email}
                    onChange={(e) => handleChange(idx, 'email', e.target.value)}
                    onFocus={() => handleFocus(idx)}
                    autoComplete="off"
                  />
                  <Select
                    value={invitee.role}
                    onValueChange={(val) => handleChange(idx, 'role', val)}
                  >
                    <SelectTrigger className="w-32 rounded-s-none">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors[idx] && (
                  <span className="mt-1 text-red-500 text-xs">
                    {errors[idx]}
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);
