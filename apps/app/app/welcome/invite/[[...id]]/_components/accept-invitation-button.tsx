'use client';
import { authClient } from '@repo/auth/client';
import { Button } from '@repo/design-system/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AcceptInvitationButton({
  invitationId,
}: {
  invitationId: string;
}) {
  console.log(invitationId);
  const router = useRouter();
  const handleAccept = async () => {
    toast.loading('Accepting invitation...', {
      id: 'accept-invitation',
    });
    const { data, error } = await authClient.organization.acceptInvitation(
      {
        invitationId,
      },

      {
        onSuccess: () => {
          toast.success('Invitation accepted', {
            id: 'accept-invitation',
          });
        },
      }
    );

    if (error) {
      console.error(error);
      toast.error('Failed to accept invitation', {
        id: 'accept-invitation',
        description: error.message,
      });
      return;
    }

    await authClient.organization.setActive(
      {
        organizationId: data.member.organizationId,
      },
      {
        onSuccess: () => {
          router.push('/');
        },
      }
    );
  };

  return (
    <Button className="w-full" onClick={handleAccept}>
      Accept
    </Button>
  );
}
