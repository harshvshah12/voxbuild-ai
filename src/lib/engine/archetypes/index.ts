import { ProjectSpecification } from '@/types';
import {
  getHospitalityNavbar,
  getHospitalityFooter,
  getHospitalityHomePage,
  getHospitalityExplorePage,
  getHospitalityDashboardPage
} from './hospitality';
import {
  getSaaSNavbar,
  getSaaSFooter,
  getSaaSHomePage,
  getSaaSExplorePage,
  getSaaSDashboardPage
} from './saas';
import {
  getEcommerceNavbar,
  getEcommerceFooter,
  getEcommerceHomePage,
  getEcommerceExplorePage,
  getEcommerceDashboardPage
} from './ecommerce';
import {
  getAgencyNavbar,
  getAgencyFooter,
  getAgencyHomePage,
  getAgencyExplorePage,
  getAgencyDashboardPage
} from './agency';

export type Archetype = 'hospitality' | 'saas' | 'ecommerce' | 'agency';

export function detectArchetype(spec: ProjectSpecification): Archetype {
  const query = `${spec.projectName} ${spec.slug} ${spec.projectType} ${spec.description} ${spec.features.join(' ')}`.toLowerCase();

  if (
    query.includes('saas') ||
    query.includes('analytic') ||
    query.includes('metric') ||
    query.includes('telemetry') ||
    query.includes('cloud') ||
    query.includes('monitoring') ||
    query.includes('pulse') ||
    query.includes('infra')
  ) {
    return 'saas';
  }

  if (
    query.includes('shop') ||
    query.includes('store') ||
    query.includes('ecommerce') ||
    query.includes('commerce') ||
    query.includes('cart') ||
    query.includes('product') ||
    query.includes('gadget') ||
    query.includes('hardware') ||
    query.includes('retail')
  ) {
    return 'ecommerce';
  }

  if (
    query.includes('agency') ||
    query.includes('studio') ||
    query.includes('portfolio') ||
    query.includes('design') ||
    query.includes('creative') ||
    query.includes('freelance') ||
    query.includes('consultancy')
  ) {
    return 'agency';
  }

  return 'hospitality';
}

export function getArchetypeGenerator(archetype: Archetype) {
  switch (archetype) {
    case 'saas':
      return {
        getNavbar: getSaaSNavbar,
        getFooter: getSaaSFooter,
        getHomePage: getSaaSHomePage,
        getExplorePage: getSaaSExplorePage,
        getDashboardPage: getSaaSDashboardPage,
      };
    case 'ecommerce':
      return {
        getNavbar: getEcommerceNavbar,
        getFooter: getEcommerceFooter,
        getHomePage: getEcommerceHomePage,
        getExplorePage: getEcommerceExplorePage,
        getDashboardPage: getEcommerceDashboardPage,
      };
    case 'agency':
      return {
        getNavbar: getAgencyNavbar,
        getFooter: getAgencyFooter,
        getHomePage: getAgencyHomePage,
        getExplorePage: getAgencyExplorePage,
        getDashboardPage: getAgencyDashboardPage,
      };
    case 'hospitality':
    default:
      return {
        getNavbar: getHospitalityNavbar,
        getFooter: getHospitalityFooter,
        getHomePage: getHospitalityHomePage,
        getExplorePage: getHospitalityExplorePage,
        getDashboardPage: getHospitalityDashboardPage,
      };
  }
}
