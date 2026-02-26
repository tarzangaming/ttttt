import siteConfig from '@/data/site.config.json';

export type SiteConfig = typeof siteConfig;

export function getConfig(): SiteConfig {
  return siteConfig;
}

export function getPhone(): string {
  return siteConfig.phone;
}

export function getPhoneClean(): string {
  return siteConfig.phoneClean;
}

export function getCompanyName(): string {
  return siteConfig.companyName;
}

export function getDomainName(): string {
  return siteConfig.domain;
}
