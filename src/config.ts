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
      { text: 'Installation', link: 'en/install' },  
      // { text: 'Installation Checklist', link: 'en/verify' },   
      // { text: 'Getting Support', link: 'en/support' },   
    ],
    'Basic Functionality': [
      // { text: 'Network Sniffing', link: 'en/network_sniffing' },
      { text: 'Dashboard', link: 'en/ui' },
      { text: 'TLS/HTTPS', link: 'en/encrypted_traffic' },
      { text: 'Service Map', link: 'en/service_map' },
      // { text: 'Running Headless', link: 'en/headless' },
      { text: 'Display Filters (KFL)', link: 'en/filtering' },
      { text: 'Capture Filters', link: 'en/pod_targeting' },
      { text: 'Protocol Support', link: 'en/protocols' },
      { text: 'Pod-to-pod   Connection Analysis', link: 'en/pod_to_pod_connections' },
      { text: 'Network Error Detection & Analysis', link: 'en/half_connections' },
      // { text: 'PCAP Dumper (Capturing Raw Traffic)', link: 'en/raw_traffic_capture' },
      { text: 'On/Off Switch (Dormant)', link: 'en/on_off_switch' },
      { text: 'Envoy/Istio Support', link: 'en/envoy' },
    ],
    'Traffic Recording': [
      { text: 'Continuos PCAP Recording', link: 'en/pcapdump' },
      { text: 'Traffic Recorder', link: 'en/traffic_recorder' },
      { text: 'Offline Analysis', link: 'en/offline_analysis' },
      { text: 'Recordings Management', link: 'en/recordings_management' },
      { text: 'Long Term Retention', link: 'en/long_term_retention' },
      // { text: 'PCAP & API metadata', link: 'en/pcap' },
      { text: 'Data Persistency', link: 'en/data_persistency' },
    ],
    'Collaboration': [
      { text: 'Ingress', link: 'en/ingress' }, 
      // { text: 'Authentication', link: 'en/authentication' },
      { text: 'Sensitive Data Redaction', link: 'en/redaction' },  
      { text: 'SSO, SAML, Authorization ', link: 'en/saml' }, 
    ],
    'Automation': [
      { text: 'Introduction', link: 'en/automation_introduction' },
      { text: 'Scripting', link: 'en/automation_scripting' },
      { text: 'Hooks', link: 'en/automation_hooks' },
      { text: 'Helpers', link: 'en/automation_helpers' },
      // { text: 'Wrappers', link: 'en/automation_wrappers' },
      { text: 'Jobs', link: 'en/automation_jobs' },
      { text: 'Logs & Alerts', link: 'en/automation_logs_alerts' },
      { text: 'Websocket API endpoints', link: 'en/api_endpoints' },
    ],
    'Integrations': [
      { text: 'Log Aggregation', link: 'en/integration_kubeshark_logs' },
      { text: 'Prometheus', link: 'en/metrics' },
      { text: 'Necessary Credentials', link: 'en/integrations_credentials' },
      { text: 'InfluxDB & Grafana', link: 'en/integrations_influxdb' },
      { text: 'Elasticsearch', link: 'en/integrations_elastic' },
      { text: 'AWS S3', link: 'en/integrations_aws_s3' },
      { text: 'Google Cloud Storage', link: 'en/integrations_gcs' },
      { text: 'Slack', link: 'en/integrations_slack' },
      { text: 'Webhook', link: 'en/integrations_webhook' },
      { text: 'K8s Lens', link: 'en/integrations_lens' },
    ],
    'Commercial': [
      { text: 'Community vs Pro vs Enterprise', link: 'en/pro' },
      { text: 'The License Key', link: 'en/how_to_use_the_license' },
      { text: 'License', link: 'en/license' },
      { text: 'Security & Compliance', link: 'en/security' },
    ],
    'DevOps Stuff': [
      { text: 'Data Time To Live (TTL)', link: 'en/traffic_retention' },
      { text: 'CPU & Memory Consumption', link: 'en/performance' },
      { text: 'Internet Connectivity', link: 'en/air_gapped' },
      { text: 'Packet Capture (eBPF, AF_PACKET)', link: 'en/packet_capture' },
      { text: 'Installing Older Releases', link: 'en/tag_release' },
      { text: 'EKS, ALB, Ingress & TLS', link: 'en/aws_ingress_auth' },
      { text: 'EKS & IRSA', link: 'en/irsa' },
      { text: 'EFS Persistent Volume', link: 'en/efs' },
      { text: 'Openshift', link: 'en/openshift' },
      { text: 'Node Scheduling', link: 'en/node_scheduling' },
      { text: 'Istio', link: 'en/service_mesh' },
      { text: 'Troubleshooting', link: 'en/troubleshooting' },
      // { text: 'Performance Benchmark', link: 'en/performance_benchmark' },
    ],
  },
};
