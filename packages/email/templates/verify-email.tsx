import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface VerifyEmailProps {
  userFirstname?: string;
  verificationLink?: string;
}

// const baseUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : '';

export const VerifyEmail = ({
  userFirstname,
  verificationLink,
}: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Verify your email address for Formflow</Preview>
        <Container style={container}>
          {/* <Img
            src={`${baseUrl}/static/formflow-logo.png`}
            width="40"
            height="33"
            alt="Formflow"
          /> */}
          <Section>
            <Text style={text}>Hi {userFirstname},</Text>
            <Text style={text}>
              Thank you for signing up for Formflow! To complete your
              registration and activate your account, please verify your email
              address by clicking the button below:
            </Text>
            <Button style={button} href={verificationLink}>
              Verify your email address
            </Button>
            <Text style={text}>
              If you did not create a Formflow account, you can safely ignore
              this email.
            </Text>
            <Text style={text}>
              For your security, please do not share this email or your
              verification link with anyone. If you have any questions, feel
              free to contact our support team.
            </Text>
            <Text style={text}>Welcome to Formflow!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

VerifyEmail.PreviewProps = {
  userFirstname: 'User',
  verificationLink: 'https://www.formflowai.me/verify',
} as VerifyEmailProps;

export default VerifyEmail;

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
};

const button = {
  backgroundColor: '#EF523E',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
};

const anchor = {
  textDecoration: 'underline',
};
