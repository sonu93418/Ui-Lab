import type { UIGenConfig } from '@uigen/config';
import {
  navbarTemplate,
  heroTemplate,
  featuresTemplate,
  pricingTemplate,
  testimonialsTemplate,
  faqTemplate,
  footerTemplate,
  ctaTemplate,
  statsTemplate,
  newsletterTemplate,
} from './templates.js';

export type SectionTemplate = string | ((config: UIGenConfig) => string);

export const SECTION_TEMPLATES: Record<string, SectionTemplate> = {
  navbar: navbarTemplate,
  hero: heroTemplate,
  features: featuresTemplate,
  pricing: pricingTemplate,
  testimonials: testimonialsTemplate,
  faq: faqTemplate,
  footer: footerTemplate,
  cta: ctaTemplate,
  stats: statsTemplate,
  newsletter: newsletterTemplate,
};
