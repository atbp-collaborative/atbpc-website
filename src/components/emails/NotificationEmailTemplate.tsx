import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Preview,
} from '@react-email/components';

interface NotificationEmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const NotificationEmailTemplate: React.FC<Readonly<NotificationEmailTemplateProps>> = ({
  name,
  email,
  message,
}) => (
  <Html>
    <Head />
    <Preview>New message from {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Heading style={h1}>New Notification</Heading>
          <Hr style={hr} />
          <Text style={text}>
            <strong>Name:</strong> {name}
          </Text>
          <Text style={text}>
            <strong>Email:</strong> {email}
          </Text>
          <Text style={text}>
            <strong>Message:</strong>
          </Text>
          <Text style={messageStyle}>{message}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Reply directly to {email} to respond to this user.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const box = {
  padding: '0 48px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const messageStyle = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
  backgroundColor: '#f6f9fc',
  padding: '12px',
  borderRadius: '4px',
  whiteSpace: 'pre-wrap' as const,
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};
