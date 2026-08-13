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

export const CareerEmailTemplate: React.FC<any> = (data) => (
  <Html>
    <Head />
    <Preview>New Career Application from {data.firstName} {data.lastName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Heading style={h1}>New Career Application</Heading>
          <Hr style={hr} />
          <Text style={text}><strong>Name:</strong> {data.firstName} {data.middleName || ''} {data.lastName} {data.titles || ''}</Text>
          <Text style={text}><strong>Pseudonym:</strong> {data.pseudonym}</Text>
          <Text style={text}><strong>Pronoun:</strong> {data.pronoun}</Text>
          <Text style={text}><strong>Email:</strong> {data.email}</Text>
          <Text style={text}><strong>Contact Number:</strong> {data.contactNumber}</Text>
          
          <Hr style={hr} />
          <Heading style={h2}>Role Information</Heading>
          <Text style={text}><strong>Department:</strong> {data.department}</Text>
          <Text style={text}><strong>Structure:</strong> {data.structure}</Text>
          {data.jobDescription && (
            <>
              <Text style={text}><strong>Job Description:</strong></Text>
              <Text style={messageStyle}>{data.jobDescription}</Text>
            </>
          )}

          <Hr style={hr} />
          <Heading style={h2}>Links & Socials</Heading>
          <Text style={text}><strong>Portfolio:</strong> {data.portfolioLink}</Text>
          <Text style={text}><strong>Cover Video:</strong> {data.coverVideoLink}</Text>
          {data.facebook && <Text style={text}><strong>Facebook:</strong> {data.facebook}</Text>}
          {data.instagram && <Text style={text}><strong>Instagram:</strong> {data.instagram}</Text>}

          <Hr style={hr} />
          <Heading style={h2}>Address Details</Heading>
          <Text style={text}><strong>Region:</strong> {data.address?.regionCode}</Text>
          <Text style={text}><strong>City:</strong> {data.address?.cityCode}</Text>
          <Text style={text}><strong>Barangay:</strong> {data.address?.barangayCode}</Text>
          {data.address?.streetAddress && <Text style={text}><strong>Street:</strong> {data.address?.streetAddress}</Text>}

          <Hr style={hr} />
          <Text style={footer}>
            Reply directly to {data.email} to respond to this applicant.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = { backgroundColor: '#f6f9fc', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px', marginBottom: '64px' };
const box = { padding: '0 48px' };
const hr = { borderColor: '#e6ebf1', margin: '20px 0' };
const h1 = { color: '#333', fontSize: '24px', fontWeight: '600', lineHeight: '40px', margin: '0' };
const h2 = { color: '#333', fontSize: '18px', fontWeight: '600', lineHeight: '30px', margin: '10px 0' };
const text = { color: '#525f7f', fontSize: '16px', lineHeight: '24px', textAlign: 'left' as const };
const messageStyle = { color: '#525f7f', fontSize: '16px', lineHeight: '24px', textAlign: 'left' as const, backgroundColor: '#f6f9fc', padding: '12px', borderRadius: '4px', whiteSpace: 'pre-wrap' as const };
const footer = { color: '#8898aa', fontSize: '12px', lineHeight: '16px' };
