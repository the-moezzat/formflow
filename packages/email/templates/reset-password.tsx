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

interface ResetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordLink?: string;
}

// const baseUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : '';

export const ResetPasswordEmail = ({
  userFirstname,
  resetPasswordLink,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Formflow password reset</Preview>
        <Container style={container}>
          {/* <Img
            src={`${baseUrl}/static/dropbox-logo.png`}
            width="40"
            height="33"
            alt="Dropbox"
          /> */}
          <Section>
            <Text style={text}>Hi {userFirstname},</Text>
            <Text style={text}>
              We received a request to reset your password for your Formflow
              account. If you made this request, you can set a new password by
              clicking the button below:
            </Text>
            <Button style={button} href={resetPasswordLink}>
              Reset your password
            </Button>
            <Text style={text}>
              If you did not request a password reset, you can safely ignore
              this email. Your password will remain unchanged.
            </Text>
            <Text style={text}>
              For your security, please do not share this email or your reset
              link with anyone. If you have any questions, feel free to contact
              our support team.
            </Text>
            <Text style={text}>Thank you for using Formflow</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  userFirstname: 'User',
  resetPasswordLink: 'https://www.formflowai.me',
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;

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
