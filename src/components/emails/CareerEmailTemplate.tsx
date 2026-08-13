import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Preview,
  Img,
} from '@react-email/components';

export const CareerEmailTemplate: React.FC<any> = (data) => {
  const roleName = data.structure || data.department || 'role';
  const fullName = `${data.firstName} ${data.lastName}`;
  
  // baseUrl should ideally be passed in as a prop or env var for emails, 
  // defaulting to localhost for local testing
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  return (
    <Html>
      <Head />
      <Preview>New Career Application from {fullName}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img 
              src={`${baseUrl}/charcoal-logo.png`} 
              alt="ATBPC Logo" 
              width="150" 
              style={logo}
            />
            <Heading style={h1}>
              Career Application - {fullName} ({roleName})
            </Heading>
          </Section>

          {/* Body */}
          <Section style={bodySection}>
            <Text style={text}>Hi Team,</Text>
            <Text style={text}>
              A new career application has been successfully submitted via the website.
            </Text>
            
            <Text style={text}>
              <strong>Applicant:</strong> {fullName}<br />
              <strong>Role:</strong> {roleName}<br />
              <strong>Email:</strong> {data.email}<br />
              <strong>Contact:</strong> {data.contactNumber}
            </Text>

            <Text style={text}>
              All of the applicant's submitted information, including their attached files and links, has been automatically processed and appended to your Microsoft Excel database.
            </Text>
            
            <Section style={btnContainer}>
              <Button style={button} href="#">
                View Entry in Excel
              </Button>
            </Section>
            
            <Text style={subtext}>
              Reply directly to {data.email} to respond to this applicant.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              designing with <strong>values</strong>, managing with <strong>integrity</strong>, building with <strong>culture</strong>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#EDEFEF', // Bright Gray
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '40px 0',
};

const container = {
  backgroundColor: '#EDEFEF',
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(0,0,0,0.05)',
};

const header = {
  backgroundColor: '#EDEFEF', // Bright Gray
  padding: '40px 48px 20px',
  borderBottom: '1px solid rgba(51, 52, 54, 0.1)',
};

const logo = {
  marginBottom: '24px',
};

const h1 = {
  color: '#333436', // Vintage Charcoal
  fontSize: '28px',
  fontWeight: '600',
  lineHeight: '36px',
  margin: '0',
};

const bodySection = {
  padding: '48px',
  backgroundColor: '#EDEFEF', // Bright Gray
};

const text = {
  color: '#333436', // Vintage Charcoal
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 20px 0',
};

const btnContainer = {
  textAlign: 'left' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#466263', // Brand Green
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
};

const subtext = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '20px',
  marginTop: '32px',
};

const footer = {
  backgroundColor: '#333436', // Vintage Charcoal
  padding: '24px 48px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#EDEFEF', // Bright Gray
  fontSize: '14px',
  letterSpacing: '0.5px',
  margin: '0',
};
