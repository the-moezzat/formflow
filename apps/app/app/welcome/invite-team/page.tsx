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

export default function Page() {
  const inviteInputRef = useRef<{
    getInvitees: () => { email: string; role: string }[];
    validate: () => boolean;
  }>(null);
  const [hasEmail, setHasEmail] = useState(false);

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

  const handleInvite = () => {
    if (inviteInputRef.current) {
      const isValid = inviteInputRef.current.validate();
      if (!isValid) return;
      const invitees = inviteInputRef.current
        .getInvitees()
        .filter((i) => i.email.trim() !== '');
      console.log('Invited invitees:', invitees);
    }
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
        <Button className="mt-4" onClick={handleInvite} disabled={!hasEmail}>
          Invite
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/">Skip for now</Link>
        </Button>
      </div>
    </div>
  );
}

export const InviteMemberEmailInput = forwardRef(
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
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const errs = invitees.map((i) =>
            i.email && !emailRegex.test(i.email) ? 'Invalid email' : ''
          );
          setErrors(errs);
          return errs.every((e) => !e);
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
