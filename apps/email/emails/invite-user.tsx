import  InviteUserTemplate  from '@repo/email/templates/invite-user';

const ExampleInviteUserEmail = () => (
  <InviteUserTemplate
    invitedByUsername="John Doe"
    invitedByEmail="john.doe@example.com"
    teamName="Acme Inc."
    inviteLink="https://example.com/invite/123"
  />
);

export default ExampleInviteUserEmail;
