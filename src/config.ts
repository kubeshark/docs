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

export const GITHUB_EDIT_URL = `https://github.com/withastro/astro/tree/main/examples/docs`;

export const COMMUNITY_INVITE_URL = `https://astro.build/chat`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
	indexName: 'XXXXXXXXXX',
	appId: 'XXXXXXXXXX',
	apiKey: 'XXXXXXXXXX',
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
			{ text: 'Install', link: 'en/install' },
      { text: 'Deploy', link: 'en/deploy' },
      { text: 'Clean Up', link: 'en/clean_up' },
		],
    'Basics': [
			{ text: 'Network Sniffing', link: 'en/page-2' },
			{ text: 'Querying', link: 'en/page-2' },
			{ text: 'Kernel Tracing', link: 'en/page-3' },
      { text: 'Validation', link: 'en/page-3' },
      { text: 'Service Map', link: 'en/page-3' },
      { text: 'Redaction', link: 'en/page-3' },
		],
    'Advanced': [
			{ text: 'Installing plugins', link: 'en/page-2' },
			{ text: 'Developing plugins', link: 'en/page-2' },
      { text: 'Hooks reference', link: 'en/page-2' },
      { text: 'Integrations', link: 'en/page-2' },
		],
	},
};
