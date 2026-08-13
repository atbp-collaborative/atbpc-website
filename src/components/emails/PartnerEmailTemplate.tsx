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

export const PartnerEmailTemplate: React.FC<any> = (data) => (
  <Html>
    <Head />
    <Preview>New Partner Application from {data.companyName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Heading style={h1}>New Partner Application</Heading>
          <Hr style={hr} />
          
          <Heading style={h2}>Company Information</Heading>
          <Text style={text}><strong>Company Name:</strong> {data.companyName}</Text>
          {data.category && <Text style={text}><strong>Category:</strong> {data.category}</Text>}
          {data.specialty && <Text style={text}><strong>Specialty:</strong> {data.specialty}</Text>}
          {data.typology && <Text style={text}><strong>Typology:</strong> {data.typology}</Text>}
          
          <Text style={text}><strong>Message:</strong></Text>
          <Text style={messageStyle}>{data.message}</Text>

          <Hr style={hr} />
          <Heading style={h2}>Contact Person</Heading>
          <Text style={text}><strong>Name:</strong> {data.firstName} {data.middleName || ''} {data.lastName} {data.titles || ''}</Text>
          <Text style={text}><strong>Pseudonym:</strong> {data.pseudonym}</Text>
          <Text style={text}><strong>Pronoun:</strong> {data.pronoun}</Text>
          
          {data.emails?.length > 0 && (
            <>
              <Heading style={h3}>Emails</Heading>
              {data.emails.map((e: any, i: number) => (
                <Text key={i} style={text}>- {e.email} ({e.description})</Text>
              ))}
            </>
          )}

          {data.contacts?.length > 0 && (
            <>
              <Heading style={h3}>Contact Numbers</Heading>
              {data.contacts.map((c: any, i: number) => (
                <Text key={i} style={text}>- {c.number} ({c.description})</Text>
              ))}
            </>
          )}

          <Hr style={hr} />
          <Heading style={h2}>Links</Heading>
          <Text style={text}><strong>Profile Link:</strong> {data.profileLink}</Text>
          {data.coverVideoLink && <Text style={text}><strong>Cover Video:</strong> {data.coverVideoLink}</Text>}
          <Text style={text}><strong>Map Link:</strong> {data.mapLink}</Text>
          <Text style={text}><strong>License Link:</strong> {data.licenseLink}</Text>
          {data.websiteLink && <Text style={text}><strong>Website:</strong> {data.websiteLink}</Text>}
          {data.facebook && <Text style={text}><strong>Facebook:</strong> {data.facebook}</Text>}
          {data.instagram && <Text style={text}><strong>Instagram:</strong> {data.instagram}</Text>}

          <Hr style={hr} />
          <Text style={footer}>
            Review attachments directly in the submitted application.
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
const h3 = { color: '#555', fontSize: '16px', fontWeight: '600', lineHeight: '24px', margin: '5px 0' };
const text = { color: '#525f7f', fontSize: '16px', lineHeight: '24px', textAlign: 'left' as const };
const messageStyle = { color: '#525f7f', fontSize: '16px', lineHeight: '24px', textAlign: 'left' as const, backgroundColor: '#f6f9fc', padding: '12px', borderRadius: '4px', whiteSpace: 'pre-wrap' as const };
const footer = { color: '#8898aa', fontSize: '12px', lineHeight: '16px' };
