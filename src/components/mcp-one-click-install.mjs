const cursorConfig = Buffer.from(
	JSON.stringify({ command: 'kubeshark', args: ['mcp'] })
).toString('base64');

const vscodeQuery = encodeURIComponent(
	JSON.stringify({ name: 'kubeshark', command: 'kubeshark', args: ['mcp'] })
);

const links = {
	cursor: `cursor://anysphere.cursor-deeplink/mcp/install?name=kubeshark&config=${cursorConfig}`,
	vscode: `vscode:mcp/install?${vscodeQuery}`,
	insiders: `vscode-insiders:mcp/install?${vscodeQuery}`,
	claudeDesktop: 'https://github.com/kubeshark/kubeshark/releases/latest',
};

function escAttr(value) {
	return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

const cursorIcon = `<svg class="mcp-install__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23"/></svg>`;

const vscodeIcon = `<svg class="mcp-install__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/></svg>`;

const claudeIcon = `<svg class="mcp-install__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg>`;

function button(href, icon, label) {
	return `<a class="mcp-install__btn" href="${escAttr(href)}">${icon}<span>${label}</span></a>`;
}

export const mcpOneClickInstallHtml = `<div class="mcp-install">
<p class="mcp-install__note">The <a href="/en/install#homebrew">Kubeshark CLI</a> must be installed first (for example <code>brew install kubeshark</code>). These options add an MCP server that runs <code>kubeshark mcp</code>.</p>
<div class="mcp-install__buttons">
${button(links.cursor, cursorIcon, 'Add to Cursor')}
${button(links.vscode, vscodeIcon, 'Install in VS Code')}
${button(links.insiders, vscodeIcon, 'Install in VS Code Insiders')}
${button(links.claudeDesktop, claudeIcon, 'Add to Claude Desktop')}
</div>
<p class="mcp-install__note">The Claude Desktop button opens the <a href="https://github.com/kubeshark/kubeshark/releases/latest">latest release</a>. Download the <code>.mcpb</code> bundle for your OS (<code>kubeshark-mcp_&lt;os&gt;_&lt;arch&gt;.mcpb</code>) and double-click it, or add it in Claude Desktop's extensions settings.</p>
<p class="mcp-install__label">${claudeIcon}<span>Claude Code</span></p>
<pre><code>claude mcp add kubeshark -- kubeshark mcp</code></pre>
<p class="mcp-install__label">Other clients</p>
<p class="mcp-install__note">Windsurf, Gemini CLI, and Codex use a config file for a local MCP server.</p>
<p class="mcp-install__client">Windsurf <a href="https://docs.windsurf.com/windsurf/cascade/mcp"><code>mcp_config.json</code></a></p>
<pre><code>{
  "mcpServers": {
    "kubeshark": {
      "command": "kubeshark",
      "args": ["mcp"]
    }
  }
}</code></pre>
<p class="mcp-install__client">Gemini CLI <a href="https://geminicli.com/docs/tools/mcp-server/"><code>settings.json</code></a></p>
<pre><code>{
  "mcpServers": {
    "kubeshark": {
      "command": "kubeshark",
      "args": ["mcp"]
    }
  }
}</code></pre>
<p class="mcp-install__client">Codex <a href="https://developers.openai.com/codex/mcp"><code>~/.codex/config.toml</code></a></p>
<pre><code>[mcp_servers.kubeshark]
command = "kubeshark"
args = ["mcp"]</code></pre>
</div>`;
