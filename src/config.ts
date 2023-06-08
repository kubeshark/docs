export const SITE = {
  title: 'Kubeshark',
  description: 'Kubernetes deep visibility.',
  defaultLanguage: 'en_US',
};

export const OPEN_GRAPH = {
  image: {
    src: 'https://github.com/withastro/astro/blob/main/assets/social/banner.jpg?raw=true',
    alt:
      'astro logo on a starry expanse of space,' +
      ' with a purple saturn-like planet floating in the right foreground',
  },
  twitter: 'astrodotbuild',
};

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
  title: string;
  description: string;
  layout: string;
  image?: { src: string; alt: string };
  dir?: 'ltr' | 'rtl';
  ogLocale?: string;
  lang?: string;
  mascot?: string;
  mascotSize: number;
};

export const KNOWN_LANGUAGES = {
  English: 'en',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/kubeshark/docs/tree/master`;

export const DISCORD_SERVER_INVITE = `https://discord.gg/WkvRGMUcx7`;
export const SLACK_WORKSPACE_INVITE = `https://join.slack.com/t/kubeshark/shared_invite/zt-1m90td3n7-VHxN_~V5kVp80SfQW3SfpA`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: 'main',
  appId: 'JS4V288LOI',
  apiKey: 'e0614ede1abb0d9f1e03350b5dfb1114',
};

export type Sidebar = Record<
  typeof KNOWN_LANGUAGE_CODES[number],
  Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
  en: {
    'Getting Started': [
      { text: 'Introduction', link: 'en/introduction' },
      { text: 'Anatomy of Kubeshark', link: 'en/anatomy_of_kubeshark' },
      { text: 'Install & Run', link: 'en/install' },
      { text: 'Ingress & Authentication', link: 'en/self_hosting' },
    ],
    'Network Analysis': [
      { text: 'Network Sniffing', link: 'en/network_sniffing' },
      { text: 'Service Map', link: 'en/service_map' },
      { text: 'Dashboard', link: 'en/ui' },
      { text: 'Filtering', link: 'en/filtering' },
      { text: 'eBPF & Encryption', link: 'en/encrypted_traffic' },
      { text: 'PCAPs', link: 'en/pcap' },
      // { text: 'Pods & Namespaces', link: 'en/scope' },
      { text: 'DNS', link: 'en/dns' },
      { text: 'Configuration', link: 'en/config' },
    ],
    'Automation': [
      { text: 'Introduction', link: 'en/automation_introduction' },
      { text: 'Scripting', link: 'en/automation_scripting' },
      { text: 'Hooks', link: 'en/automation_hooks' },
      { text: 'Helpers', link: 'en/automation_helpers' },
      { text: 'Wrappers', link: 'en/automation_wrappers' },
      { text: 'Jobs', link: 'en/automation_jobs' },
      { text: 'Logs & Alerts', link: 'en/automation_logs_alerts' }

    ],
    'Integrations': [
      { text: 'Necessary Credentials', link: 'en/integrations_credentials' },
      { text: 'InfluxDB & Grafana', link: 'en/integrations_influxdb' },
      { text: 'Elasticsearch', link: 'en/integrations_elastic' },
      { text: 'AWS S3', link: 'en/integrations_aws_s3' },
      { text: 'Slack', link: 'en/integrations_slack' },
      { text: 'Webhook', link: 'en/integrations_webhook' },
    ],
    'Use Cases': [
      { text: 'Investigation & Debugging', link: 'en/traffic_investigation' },
      { text: 'Observability & Telemetry', link: 'en/observability' },
      { text: 'Cloud Forensics', link: 'en/cloud_forensics' },
      { text: 'Detection Engineering', link: 'en/actionable_detection' }
    ],
    'The Pro Edition': [
      { text: 'Pro vs. Community', link: 'en/pro' },
      { text: 'Upgrading & Downgrading', link: 'en/pro_upgrade' },
      { text: 'License', link: 'en/license' },
    ],
    'Misc': [
      { text: 'Service Mesh', link: 'en/service_mesh' },
      { text: 'Troubleshooting', link: 'en/troubleshooting' },
      { text: 'Permissions', link: 'en/permissions' },
    ],
  },
};
