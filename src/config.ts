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
      // { text: 'Benefits', link: 'en/benefits' },
      { text: 'Anatomy of Kubeshark', link: 'en/anatomy_of_kubeshark' },
      { text: 'Install & Run', link: 'en/install' },
      { text: 'Clean Up', link: 'en/clean_up' },
    ],
    'Features': [
      { text: 'Web UI', link: 'en/ui' },
      { text: 'Network Sniffing', link: 'en/network_sniffing' },
      { text: 'Service Map', link: 'en/service_map' },
      { text: 'Encrypted Traffic', link: 'en/encrypted_traffic' },
      { text: 'Pods & Namespaces', link: 'en/scope' },
      { text: 'Filtering', link: 'en/filtering' },
      { text: 'PCAP Export/Import', link: 'en/pcap_export_import' },
      { text: 'TCP/UDP Streams', link: 'en/tcp_streams' },
      { text: 'DNS', link: 'en/dns' },
      { text: 'Configuration', link: 'en/config' },
    ],
    'Automation': [
      { text: 'Introduction', link: 'en/automation_introduction' },
      { text: 'Scripting', link: 'en/automation_scripting' },
      { text: 'Hooks', link: 'en/automation_hooks' },
      { text: 'Job Scheduler', link: 'en/automation_job_scheduler' }
      // { text: 'CLI Commands', link: 'en/scripting_cli_commands' },
      // { text: 'Integrations', link: 'en/scripting_integrations' },

    ],
    'Integrations': [
      { text: 'Actions', link: 'en/integration_actions' },
      { text: 'Console Log', link: 'en/integrations_console' },
      { text: 'Slack', link: 'en/integrations_slack' },
      { text: 'InfluxDB & Grafana', link: 'en/integrations_influxdb' },
      { text: 'AWS S3', link: 'en/integration_aws_s3' }
      // { text: 'Webhook Anything', link: 'en/TBD' },
      // { text: 'Fail/Pass', link: 'en/TBD' },
      // { text: 'File Operations', link: 'en/TBD' },
    ],
    'API Reference': [
      { text: 'Helpers', link: 'en/scripting_api_reference' },
      //{ text: 'Network Hooks', link: 'en/scripting_hooks_reference' },
      { text: 'KFL', link: 'en/kfl_reference' },
    ],
    'Misc': [
      { text: 'Service Mesh', link: 'en/service_mesh' },
      { text: 'Troubleshooting', link: 'en/troubleshooting' },
      // { text: 'Permissions', link: 'en/permissions' },
      // { text: 'Helm chart', link: 'en/TBD' },
    ],
  },
};
