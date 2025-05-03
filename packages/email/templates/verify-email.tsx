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

interface VerifyEmailProps {
  userFirstname?: string;
  verificationLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const VerifyEmail = ({
  userFirstname,
  verificationLink,
}: VerifyEmailProps) => {
  const previewText = `Verify your email address for Formflow`;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              Verify your email address for <strong>Formflow</strong>
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Hello {userFirstname},
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              Thank you for signing up for <strong>Formflow</strong>! To complete your registration and activate your account, please verify your email address by clicking the button below:
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#EF523E] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href={verificationLink}
              >
                Verify your email address
              </Button>
            </Section>
            <Text className="text-[14px] text-black leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link href={verificationLink} className="text-[#EF523E] no-underline">
                {verificationLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              If you did not create a Formflow account, you can safely ignore this email. For your security, please do not share this email or your verification link with anyone. If you have any questions, feel free to contact our support team.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

VerifyEmail.PreviewProps = {
  userFirstname: 'User',
  verificationLink: 'https://www.formflowai.me/verify',
} as VerifyEmailProps;

export default VerifyEmail;
