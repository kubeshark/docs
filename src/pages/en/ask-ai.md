---
title: Ask AI
description: Get instant answers about Kubeshark from our AI assistant.
layout: ../../layouts/MainLayout.astro
---

<div data-aiembed-inline></div>

<div id="ai-chat" style="max-width: 800px; margin: 20px 0;"></div>

<script is:inline>
  (function() {
    var isDev = location.hostname === 'localhost';
    var s = document.createElement('script');
    s.src = isDev ? 'http://localhost:3001/widget/aiembed.js' : 'https://d1o6rummm3fnkp.cloudfront.net/aiembed.js';
    s.setAttribute('data-agent', 'docs-agent');
    s.setAttribute('data-api-url', isDev ? 'http://localhost:3001/aiembed' : 'https://aiembed.admin.kubeshark.com/aiembed');
    s.setAttribute('data-mode', 'inline');
    document.getElementById('ai-chat').appendChild(s);
  })();
</script>
