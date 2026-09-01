import * as React from 'react';
import { Html, Body, Head, Heading, Container, Text, Section } from '@react-email/components';
import { ProposalFormData } from '@/lib/forms/proposal';

interface ProposalEmailTemplateProps {
  data: ProposalFormData;
}

export const ProposalEmailTemplate: React.FC<ProposalEmailTemplateProps> = ({ data }) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Proposal Request</Heading>

          <Section style={section}>
            <Heading style={h2}>1a. Principal Decision Makers</Heading>
            {data.principalDecisionMakers?.map((person, idx) => (
              <div key={idx} style={itemBox}>
                <Text><strong>Name:</strong> {person.title} {person.firstName} {person.middleName} {person.lastName}</Text>
                <Text><strong>Email:</strong> {person.email}</Text>
                <Text><strong>Contact No:</strong> {person.contactNo}</Text>
                <Text><strong>Address:</strong> {person.address}</Text>
              </div>
            ))}
          </Section>

          <Section style={section}>
            <Heading style={h2}>1b. Authorized Representatives</Heading>
            {data.authorizedRepresentatives?.map((person, idx) => (
              <div key={idx} style={itemBox}>
                <Text><strong>Name:</strong> {person.title} {person.firstName} {person.middleName} {person.lastName}</Text>
                <Text><strong>Email:</strong> {person.email}</Text>
                <Text><strong>Contact No:</strong> {person.contactNo}</Text>
                <Text><strong>Address:</strong> {person.address}</Text>
              </div>
            ))}
          </Section>

          <Section style={section}>
            <Heading style={h2}>2. Project Details</Heading>
            <Text><strong>Typology:</strong> {data.typology}</Text>
            <Text><strong>Services:</strong> {data.services}</Text>
            <Text><strong>Scope:</strong> {data.scope}</Text>
          </Section>

          <Section style={section}>
            <Heading style={h2}>3. Property & Budget</Heading>
            <Text><strong>Area Type:</strong> {data.propertyAreaType}</Text>
            <Text><strong>Area Size:</strong> {data.propertyAreaSize}</Text>
            <Text><strong>Site Address:</strong> {data.siteAddress}</Text>
            <Text><strong>Coordinates:</strong> {data.mapCoordinates ? `${data.mapCoordinates.lat}, ${data.mapCoordinates.lng}` : 'N/A'}</Text>
            <Text><strong>Construction Budget:</strong> {data.constructionBudget}</Text>
            <Text><strong>Target Date:</strong> {data.targetDate}</Text>
          </Section>

          <Section style={section}>
            <Heading style={h2}>4. Additional Information</Heading>
            <Text><strong>Superstitions:</strong> {data.superstitions}</Text>
            <Text><strong>Additional Info:</strong> {data.additionalInfo}</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const section = {
  padding: '0 24px',
  marginBottom: '24px',
};

const itemBox = {
  borderLeft: '4px solid #eaeaea',
  paddingLeft: '12px',
  marginBottom: '16px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
  padding: '0 24px',
};

const h2 = {
  color: '#444',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px',
};
