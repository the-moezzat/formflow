import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface ResetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const ResetPasswordEmail = ({
  userFirstname,
  resetPasswordLink,
}: ResetPasswordEmailProps) => {
  const previewText = `Formflow password reset`;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              Reset your <strong>Formflow</strong> password
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Hello {userFirstname},
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              We received a request to reset your password for your <strong>Formflow</strong> account. If you made this request, you can set a new password by clicking the button below:
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#EF523E] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href={resetPasswordLink}
              >
                Reset your password
              </Button>
            </Section>
            <Text className="text-[14px] text-black leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link href={resetPasswordLink} className="text-[#EF523E] no-underline">
                {resetPasswordLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged. If you have any questions, feel free to contact our support team.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  userFirstname: 'User',
  resetPasswordLink: 'https://www.formflowai.me',
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;
