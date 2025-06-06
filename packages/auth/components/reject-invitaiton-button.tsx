'use client';
import { authClient } from '@repo/auth/client';
import { Button } from '@repo/design-system/components/ui/button';
import { log } from '@repo/observability/log';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RejectInvitationButton({
  invitationId,
}: {
  invitationId: string;
}) {
  const router = useRouter();
  const handleReject = async () => {
    const { error } = await authClient.organization.rejectInvitation(
      {
        invitationId,
      },
      {
        onRequest: () => {
          toast.loading('Rejecting invitation...', {
            id: 'reject-invitation',
          });
        },
        onSuccess: () => {
          toast.success('Invitation rejected', {
            id: 'reject-invitation',
          });

          router.push('/');
        },
        onError: () => {
          toast.error('Failed to reject invitation', {
            id: 'reject-invitation',
          });
        },
      }
    );

    if (error) {
      log.error(error?.message ?? 'Unknown error');
    }
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleReject}>
      Reject
    </Button>
  );
}
