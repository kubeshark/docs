import { mcpOneClickInstallHtml } from '../components/mcp-one-click-install.mjs';

function visit(node, fn) {
	fn(node);
	if (node.children) {
		for (const child of node.children) visit(child, fn);
	}
}

export function remarkMcpInstall() {
	return (tree) => {
		visit(tree, (node) => {
			if (node.type !== 'html' || typeof node.value !== 'string' || !node.value.includes('mcp-one-click-install')) {
				return;
			}
			const opening = node.value.includes('<mcp-one-click-install');
			node.value = opening ? mcpOneClickInstallHtml : '';
		});
	};
}
