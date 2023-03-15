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
      { text: 'Install & Run', link: 'en/install' }
      // { text: 'Community Vs Pro', link: 'en/community_vs_pro' },
      //{ text: 'Clean Up', link: 'en/clean_up' },
    ],
    'Network Analysis': [
      { text: 'Traffic Sniffing', link: 'en/network_sniffing' },
      { text: 'Encrypted Traffic', link: 'en/encrypted_traffic' },
      { text: 'Pods & Namespaces', link: 'en/scope' },
      { text: 'Web UI', link: 'en/ui' },
      { text: 'Service Map', link: 'en/service_map' },
      { text: 'Filtering', link: 'en/filtering' },
      { text: 'PCAPs', link: 'en/pcap_export_import' },
      { text: 'TCP/UDP Streams', link: 'en/tcp_streams' },
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
      { text: 'Console Log', link: 'en/integrations_console' },
      { text: 'Web UI Alerts', link: 'en/integrations_webui' },    
      // { text: 'CLI Commands', link: 'en/scripting_cli_commands' },
      // { text: 'Integrations', link: 'en/scripting_integrations' },

    ],
    'Integrations': [
      // { text: 'Actions', link: 'en/integration_actions' },

      { text: 'Necessary Credentials', link: 'en/integration_credentials' },    
      { text: 'InfluxDB & Grafana', link: 'en/integrations_influxdb' },
      { text: 'AWS S3', link: 'en/integration_aws_s3' },
      { text: 'Slack', link: 'en/integrations_slack' },
      { text: 'Webhook', link: 'en/integration_webhook' },
    ],
    'Use Cases': [
      { text: 'Cloud Forensics', link: 'en/kfl_pcap_s3' },
      { text: 'Actionable Detection', link: 'en/actionable_detection' },
      { text: 'Traffic Investigation', link: 'en/traffic_investigation' },
    ],
    'References': [
      { text: 'KFL Syntax Reference', link: 'en/kfl_syntax_reference' },
    ],
    'Misc': [
      { text: 'Service Mesh', link: 'en/service_mesh' },
      { text: 'Troubleshooting', link: 'en/troubleshooting' },
    ],
  },
};
