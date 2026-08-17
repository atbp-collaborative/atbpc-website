import { StudioSubpageData } from './our-services';
import { ROUTES } from '@/lib/navigation/routes';

export const OUR_SERVICES_PROCESS_DATA: Record<string, StudioSubpageData> = {
  'designing-with-values': {
    id: 'designing-with-values',
    title: 'designing with values',
    section: 'process | paraán',
    tagline: 'purpose-driven spatial concepts anchored in environmental & social context',
    description: 'Our design methodology begins with deep contextual listening—ensuring every spatial form respects microclimates, community heritage, resource stewardship, and long-term utility.',
    extraDescription: 'Every decision we make in the design phase is guided by a commitment to environmental stewardship and human-centric ergonomics. We strive to build enduring structures that act as positive forces within their respective ecologies and communities.',
    image: '/images/contact_case_study_house_img_1785469986420.jpg',
    pillars: [
      {
        title: 'Passive Environmental Response',
        desc: 'Optimizing natural light, cross-ventilation, and solar orientation to minimize operational energy loads.'
      },
      {
        title: 'Material Integrity & Circularity',
        desc: 'Prioritizing non-toxic, locally harvested, and enduring building materials that age with grace.'
      },
      {
        title: 'Human-Centric Spatial Ergonomics',
        desc: 'Crafting spaces that nurture emotional wellbeing, intuitive navigation, and multi-generational adaptability.'
      },
      {
        title: 'Vernacular & Cultural Adaptation',
        desc: 'Harmonizing contemporary spatial minimalism with regional architectural heritage and micro-histories.'
      }
    ],
    parentTab: 'services',
    parentTabLabel: 'Process Overview',
    subtext: 'Designing spaces that respect context, microclimate, and the human experience.'
  },
  'managing-with-integrity': {
    id: 'managing-with-integrity',
    title: 'managing with integrity',
    section: 'process | paraán',
    tagline: 'uncompromising fiscal clarity, transparent procurement & rigorous oversight',
    description: 'A discipline of project stewardship built on open-book budgeting, transparent contractor bidding, strict schedule milestones, and zero hidden markups.',
    extraDescription: 'We champion full transparency throughout the lifecycle of every project. By enforcing open-book budgeting and uncompromised quality standards, we protect our clients\' investments and deliver spaces exactly as envisioned, without hidden surprises.',
    image: '/images/contact_headquarters_img_1785470005846.jpg',
    pillars: [
      {
        title: 'Open-Book Financial Reporting',
        desc: 'Real-time cost tracking and transparent line-item breakdowns with complete client visibility.'
      },
      {
        title: 'Competitive Vendor Bidding',
        desc: 'Unbiased contractor evaluation and transparent bid comparisons to protect project capital.'
      },
      {
        title: 'Milestone Verification',
        desc: 'Strict payment releases tied directly to verified site completion and quality benchmarks.'
      },
      {
        title: 'Proactive Risk Mitigation',
        desc: 'Pre-emptive issue resolution, delay tracking, and safety compliance protocols.'
      }
    ],
    parentTab: 'services',
    parentTabLabel: 'Process Overview',
    subtext: 'Ensuring project success through transparent procurement and uncompromising oversight.'
  },
  'building-with-culture': {
    id: 'building-with-culture',
    title: 'building with culture',
    section: 'process | paraán',
    tagline: 'synthesizing regional craftsmanship with modern architectural technology',
    description: 'Bridging time-honored local artisan techniques with modern structural standards to craft buildings deeply rooted in place, character, and tactile permanence.',
    extraDescription: 'We believe that true sustainability involves preserving cultural heritage and empowering local artisans. By integrating time-honored building techniques with contemporary standards, we create spaces that resonate with history while serving modern needs.',
    image: '/images/studio_process_img_1785469980353.jpg',
    pillars: [
      {
        title: 'Artisan & Guild Collaboration',
        desc: 'Partnering directly with local woodcarvers, stonemasons, weavers, and metal fabricators.'
      },
      {
        title: 'Regional Material Sourcing',
        desc: 'Utilizing indigenous timbers, volcanic stone, bamboo composites, and local aggregates.'
      },
      {
        title: 'Hybrid Construction Technology',
        desc: 'Pairing modern engineered steel and concrete with hand-crafted natural finishes.'
      },
      {
        title: 'Community Skill Empowerment',
        desc: 'Investing in local labor force training and supporting traditional building guilds.'
      }
    ],
    parentTab: 'services',
    parentTabLabel: 'Process Overview',
    subtext: 'Honoring regional craftsmanship by integrating traditional artisan techniques with modern standards.'
  }
};

export const OUR_PROCESS_CARDS = [
  {
    id: 'designing-with-values',
    href: ROUTES.designingWithValues,
    title: 'designing with values',
    tagline: 'purpose-driven spatial concepts anchored in environmental & social context',
    subtext: 'designing spaces that respect context, microclimate, and the human experience.',
    image: '/images/contact_case_study_house_img_1785469986420.jpg',
  },
  {
    id: 'managing-with-integrity',
    href: ROUTES.managingWithIntegrity,
    title: 'managing with integrity',
    tagline: 'uncompromising fiscal clarity, transparent procurement & rigorous oversight',
    subtext: 'ensuring project success through transparent procurement and uncompromising oversight.',
    image: '/images/contact_headquarters_img_1785470005846.jpg',
  },
  {
    id: 'building-with-culture',
    href: ROUTES.buildingWithCulture,
    title: 'building with culture',
    tagline: 'synthesizing regional craftsmanship with modern architectural technology',
    subtext: 'honoring regional craftsmanship by integrating traditional artisan techniques with modern standards.',
    image: '/images/studio_process_img_1785469980353.jpg',
  },
];

