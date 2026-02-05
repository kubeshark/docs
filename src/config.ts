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
  Record<string, { text: string; link: string; icon?: string }[]>
>;
export const SIDEBAR: Sidebar = {
  en: {
    'Getting Started': [
      { text: 'Introduction', link: 'en/introduction' },
      { text: 'Installation', link: 'en/install' },
      { text: 'Why Network Data Matters', link: 'en/why_network_data' },
    ],
    'Core Concepts': [
      // { text: 'Network Sniffing', link: 'en/network_sniffing' },
      { text: 'Raw Capture', link: 'en/v2/raw_capture' },
      { text: 'Traffic Snapshots', link: 'en/v2/traffic_snapshots' },
      { text: 'API (L7) Dissection', link: 'en/v2/l7_api_dissection' },
      { text: 'Real-time Dissection', link: 'en/v2/l7_api_realtime' },
      { text: 'Delayed Dissection', link: 'en/v2/l7_api_delayed' },
      { text: 'Protocol Support', link: 'en/protocols' },
      { text: 'AI-Powered Analysis', link: 'en/v2/ai_powered_analysis' },
      // { text: 'Running Headless', link: 'en/headless' },
      // { text: 'Pod-to-pod   Connection Analysis', link: 'en/pod_to_pod_connections' },
      // { text: 'Network Error Detection & Analysis', link: 'en/half_connections' },
      // { text: 'PCAP Dumper (Capturing Raw Traffic)', link: 'en/raw_traffic_capture' },
      // { text: 'Envoy/Istio Support', link: 'en/envoy' },
    ],
    'Dashboard': [
      { text: 'Overview', link: 'en/ui' },
      { text: 'L4/L7 Workload Map', link: 'en/v2/service_map' },
      { text: 'L7 API Stream', link: 'en/api_stream' },
      { text: 'L4 to L7 & PCAP Viewer', link: 'en/v2/l4_to_l7' },
      { text: 'Display Filters / KFL', link: 'en/display_filters' },
      { text: 'Decrypt TLS/HTTPS', link: 'en/encrypted_traffic' },
      { text: 'Snapshots', link: 'en/dashboard_snapshots' },
      { text: 'Targeted Pod List', link: 'en/targeted_pods' },
      { text: 'Settings', link: 'en/dashboard_settings' },
      { text: 'Disabling API Dissection', link: 'en/on_off_switch' },
    ],
    'Helm Configuration': [
      { text: 'Internet Connectivity', link: 'en/air_gapped' },
      { text: 'Ingress', link: 'en/ingress' },
      { text: 'Capture Filters', link: 'en/pod_targeting' },
      { text: 'Raw Capture & Snapshots', link: 'en/v2/raw_capture_config' },
      { text: 'Workload Resources', link: 'en/workload_resources' },
      { text: 'SAML', link: 'en/saml' },
      { text: 'OIDC w/ DEX', link: 'en/oidc' },
      { text: 'Reverse Proxy w/ Custom Path', link: 'en/custom_path' },
      { text: 'EFS Persistent Volume', link: 'en/efs' },
      { text: 'Node Scheduling', link: 'en/node_scheduling' },
      { text: 'Reference', link: 'en/helm_reference' },
    ],
    'AI Integration': [
      { text: 'Introduction', link: 'en/mcp_use_cases' },
      { text: 'Conversational Debugging', link: 'en/mcp/troubleshooting' },
      { text: 'Autonomous Development', link: 'en/mcp/autonomous_development' },
      { text: 'MCP in Action', link: 'en/mcp_in_action' },
      { text: 'How It Works', link: 'en/mcp' },
      { text: 'Claude Code', link: 'en/mcp/claude_code', icon: '/claude-icon.svg' },
      { text: 'MCP CLI', link: 'en/mcp/cli' },
      { text: 'L7 API Calls', link: 'en/mcp/l7_tools' },
      { text: 'L4 Traffic Flows', link: 'en/mcp/l4_tools' },
      { text: 'Snapshots & Raw Capture', link: 'en/mcp/raw_capture_tools' },
      { text: 'Delayed Dissection', link: 'en/mcp/delayed_dissection' },
    ],
    'Traffic Filters': [
      { text: 'Capture Filters', link: 'en/pod_targeting' },
      { text: 'Display Filters (KFL2)', link: 'en/v2/kfl2' },
      { text: 'Legend Filters', link: 'en/v2/legend_filters' },
      // { text: 'Display Filters (KFL)', link: 'en/filtering' },
    ],
    // 'Traffic Recording': [
    //   { text: 'Full-context Traffic Recorder', link: 'en/traffic_recorder' },
    //   { text: 'Cluster-wide Traffic Snapshot', link: 'en/pcapdump' },
    //   { text: 'Offline Analysis', link: 'en/offline_analysis' },
    //   // { text: 'Recordings Management', link: 'en/recordings_management' },
    //   { text: 'Long Term Retention', link: 'en/long_term_retention' },
    //   // { text: 'PCAP & API metadata', link: 'en/pcap' },
    //   { text: 'Data Persistency', link: 'en/data_persistency' },
    // ],
    // 'Network Agents': [
    //   { text: 'Introduction', link: 'en/automation_introduction' },
    //   { text: 'Creating', link: 'en/agent_create' },
    //   { text: 'Activating', link: 'en/agents_run' },
    //   { text: 'Agent Logic', link: 'en/automation_scripting' },
    //   { text: 'Synchronizing Local Files', link: 'en/automation_scripts_cmd' },
      // { text: 'Hooks', link: 'en/automation_hooks' },
      // { text: 'Helpers', link: 'en/automation_helpers' },
      // // { text: 'Wrappers', link: 'en/automation_wrappers' },
      // { text: 'Jobs', link: 'en/automation_jobs' },
      // { text: 'Logs & Alerts', link: 'en/automation_logs_alerts' },
    // ],
    // 'Integrations': [
      // { text: 'Log Aggregation', link: 'en/integration_kubeshark_logs' },
      // { text: 'Prometheus', link: 'en/metrics' },
      // { text: 'Necessary Credentials', link: 'en/integrations_credentials' },
      // { text: 'InfluxDB & Grafana', link: 'en/integrations_influxdb' },
      // { text: 'Elasticsearch', link: 'en/integrations_elastic' },
      // { text: 'AWS S3', link: 'en/integrations_aws_s3' },
      // { text: 'Google Cloud Storage', link: 'en/integrations_gcs' },
      // { text: 'Slack', link: 'en/integrations_slack' },
      // { text: 'Webhook', link: 'en/integrations_webhook' },
      // { text: 'K8s Lens', link: 'en/integrations_lens' },
      // { text: 'Websocket API endpoints', link: 'en/api_endpoints' },
    // ],
    'Commercial': [
      { text: 'License Portal & License Key', link: 'en/license_portal' },
      { text: 'Community vs Pro vs Enterprise', link: 'en/plans' },
      { text: 'License', link: 'en/license' },
      { text: 'Security & Compliance', link: 'en/security' },
      { text: 'POC Checklist', link: 'en/poc' },
    ],
    'DevOps Stuff': [
      { text: 'Anatomy of Kubeshark', link: 'en/anatomy_of_kubeshark' },
      { text: 'Best Practices', link: 'en/best_practice' },
      { text: 'Performance', link: 'en/v2/performance' },
      { text: 'Data Time To Live (TTL)', link: 'en/traffic_retention' },
      // { text: 'CPU & Memory Consumption', link: 'en/performance' },
      // { text: 'Packet Capture (eBPF, AF_PACKET)', link: 'en/packet_capture' },
      { text: 'Installing Older Releases', link: 'en/tag_release' },
      // { text: 'EKS, ALB, Ingress & TLS', link: 'en/aws_ingress_auth' },
      // { text: 'EKS & IRSA', link: 'en/irsa' },
      { text: 'Openshift', link: 'en/openshift' },
      { text: 'Istio', link: 'en/service_mesh' },
      { text: 'Troubleshooting', link: 'en/troubleshooting' },
      // { text: 'Performance Benchmark', link: 'en/performance_benchmark' },
    ],
  },
};
