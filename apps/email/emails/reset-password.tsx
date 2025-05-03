import  ResetPasswordTemplate  from '@repo/email/templates/reset-password';

const ExampleResetPasswordEmail = () => (
  <ResetPasswordTemplate
    userFirstname="John Doe"
    resetPasswordLink="https://example.com/reset/123"
  />
);

export default ExampleResetPasswordEmail;
