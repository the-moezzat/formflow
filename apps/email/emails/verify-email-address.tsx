import  VerifyEmailAddressTemplate  from '@repo/email/templates/verify-email';

const ExampleVerifyEmailAddressEmail = () => (
  <VerifyEmailAddressTemplate
    userFirstname="John Doe"
    verificationLink="https://example.com/verify/123"
  />
);

export default ExampleVerifyEmailAddressEmail;
