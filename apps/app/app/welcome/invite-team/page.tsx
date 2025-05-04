'use client';
import { useRouter } from 'next/navigation';
import TeamInviteForm from '@repo/auth/components/team-invite-form';

export default function Page() {
  const router = useRouter();

  const handleSuccess = () => {
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
      <TeamInviteForm onSuccess={handleSuccess} />
    </div>
  );
}
