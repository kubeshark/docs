(function() {
  'use strict';

  // document.currentScript is null for dynamically inserted scripts, so fall back
  // to finding the script tag by its data attributes.
  const SCRIPT = document.currentScript
    || document.querySelector('script[data-api-url]')
    || document.querySelector('script[data-agent]');
  const API_URL = SCRIPT?.getAttribute('data-api-url') || '';
  const AGENT_ID = SCRIPT?.getAttribute('data-agent') || 'docs-agent';
  const THEME = SCRIPT?.getAttribute('data-theme') || 'light';
  const POSITION = SCRIPT?.getAttribute('data-position') || 'bottom-right';
  const MODE = SCRIPT?.getAttribute('data-mode') || 'bubble';

  const SVG_CHAT = '<svg class="chat-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>';
  const SVG_CLOSE = '<svg class="close-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
  const SVG_SEND = '<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
  const SVG_EXPAND = '<svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';
  const SVG_COLLAPSE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>';

  class AiEmbed {
    constructor() {
      this.isOpen = false;
      this.isLoading = false;
      this.history = [];
      this.agentConfig = null;
      this.avatars = {};
      this.currentMood = 'inviting';
      this.isInline = MODE === 'inline';
      this.totalInputTokens = 0;
      this.totalOutputTokens = 0;
      this.kbTokens = 0;
      this.createWidget();
      this.loadAgentConfig();
    }

    getAvatarUrl(mood) {
      return this.avatars[mood] || this.avatars['inviting'] || '';
    }

    createAvatarImg(mood, className) {
      const url = this.getAvatarUrl(mood);
      if (!url) return null;
      const img = document.createElement('img');
      img.className = className;
      img.src = url;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      return img;
    }

    updateHeaderAvatar(mood) {
      const existing = this.panel.querySelector('.aiembed-header .aiembed-avatar');
      const url = this.getAvatarUrl(mood);
      if (!url) return;
      if (existing) {
        existing.src = url;
      } else {
        const img = this.createAvatarImg(mood, 'aiembed-avatar');
        if (img) {
          this.panel.querySelector('.aiembed-header').prepend(img);
        }
      }
    }

    updateBubbleAvatar() {
      if (this.isInline) return;
      const url = this.getAvatarUrl('inviting');
      if (!url) return;
      const existing = this.bubble.querySelector('.aiembed-bubble-avatar');
      if (existing) {
        existing.src = url;
      } else {
        const img = document.createElement('img');
        img.className = 'aiembed-bubble-avatar';
        img.src = url;
        img.alt = '';
        this.bubble.prepend(img);
      }
      this.startBubbleCycle();
    }

    startBubbleCycle() {
      if (this.bubbleCycleTimer) return;
      const allMoods = ['inviting', 'happy', 'funny', 'thinking', 'serious'];
      let lastMood = 'inviting';
      this.bubbleCycleTimer = setInterval(() => {
        if (this.isOpen) return;
        const available = allMoods.filter(m => m !== lastMood);
        const mood = available[Math.floor(Math.random() * available.length)];
        lastMood = mood;
        const url = this.getAvatarUrl(mood);
        if (!url) return;
        const img = this.bubble.querySelector('.aiembed-bubble-avatar');
        if (img) {
          img.style.opacity = '0';
          setTimeout(() => {
            img.src = url;
            img.style.opacity = '1';
          }, 200);
        }
      }, 2000);
    }

    startTeaserCycle() {
      const teasers = [
        'Talk to the founder of Kubeshark',
        'Learn about the vision and roadmap',
        "What's my motivation?",
        'Ask me anything about Kubeshark',
        'The story behind Kubeshark',
        'Where are we headed next?',
      ];
      let idx = 0;
      const show = () => {
        if (this.isOpen || !this.teaser) return;
        this.teaser.textContent = teasers[idx];
        this.teaser.classList.add('visible');
        idx = (idx + 1) % teasers.length;
        setTimeout(() => {
          if (this.teaser) this.teaser.classList.remove('visible');
        }, 4000);
      };
      setTimeout(show, 3000);
      setInterval(show, 8000);
    }

    updateInlineAvatar(mood) {
      if (!this.isInline) return;
      const container = this.panel.querySelector('.aiembed-inline-avatar-container');
      if (!container) return;
      const url = this.getAvatarUrl(mood);
      if (!url) return;
      const existing = container.querySelector('.aiembed-inline-avatar');
      if (existing) {
        existing.src = url;
      } else {
        const img = this.createAvatarImg(mood, 'aiembed-inline-avatar');
        if (img) container.appendChild(img);
      }
    }

    createWidget() {
      this.host = document.createElement('div');
      this.shadow = this.host.attachShadow({ mode: 'closed' });

      // Load CSS
      const style = document.createElement('style');
      style.textContent = CSS_CONTENT;
      this.shadow.appendChild(style);

      if (THEME === 'dark') {
        this.host.setAttribute('data-theme', 'dark');
      }

      if (this.isInline) {
        this.createInlineWidget();
      } else {
        this.createBubbleWidget();
      }

      // Refs
      this.messagesEl = this.panel.querySelector('.aiembed-messages');
      this.suggestionsEl = this.panel.querySelector('.aiembed-suggestions');
      this.inputEl = this.panel.querySelector('.aiembed-input');
      this.sendBtn = this.panel.querySelector('.aiembed-send');
      this.headerName = this.panel.querySelector('.aiembed-header-name');

      // Events
      this.sendBtn.addEventListener('click', () => this.send());
      this.inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.send();
        }
      });

      // Preconnect to API
      if (API_URL) {
        try {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = new URL(API_URL).origin;
          document.head.appendChild(link);
        } catch (e) {
          // invalid API_URL — skip preconnect, widget still works
        }
      }
    }

    createBubbleWidget() {
      // Container
      const container = document.createElement('div');
      container.className = 'aiembed-container';
      if (POSITION === 'bottom-left') {
        container.style.right = 'auto';
        container.style.left = '20px';
      }

      // Panel
      this.panel = document.createElement('div');
      this.panel.className = 'aiembed-panel expanded';
      this.panel.innerHTML = `
        <div class="aiembed-header">
          <div class="aiembed-header-name">Assistant</div>
          <div class="aiembed-header-status">Online</div>
          <button class="aiembed-header-expand" title="Collapse">${SVG_COLLAPSE}</button>
          <button class="aiembed-header-close" title="Close">${SVG_CLOSE}</button>
        </div>
        <div class="aiembed-messages"></div>
        <div class="aiembed-suggestions"></div>
        <div class="aiembed-input-area">
          <input class="aiembed-input" type="text" placeholder="Ask anything..." />
          <button class="aiembed-send">${SVG_SEND}</button>
        </div>
        <div class="aiembed-powered">Powered by <a href="https://kubeshark.com" target="_blank" rel="noopener">Kubeshark</a></div>
      `;

      // Expand/collapse toggle
      this.panel.querySelector('.aiembed-header-expand').addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleExpand();
      });

      // Close button
      this.panel.querySelector('.aiembed-header-close').addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });

      // Bubble
      this.bubble = document.createElement('button');
      this.bubble.className = 'aiembed-bubble';
      this.bubble.innerHTML = SVG_CHAT + SVG_CLOSE;
      this.bubble.addEventListener('click', () => this.toggle());

      // Teaser speech bubble
      this.teaser = document.createElement('div');
      this.teaser.className = 'aiembed-bubble-teaser';
      this.teaser.addEventListener('click', () => this.toggle());

      container.appendChild(this.panel);
      container.appendChild(this.bubble);
      container.appendChild(this.teaser);
      this.shadow.appendChild(container);
      document.body.appendChild(this.host);

      this.startTeaserCycle();
    }

    createInlineWidget() {
      // Container
      const container = document.createElement('div');
      container.className = 'aiembed-container inline';

      // Panel (always visible in inline mode)
      this.panel = document.createElement('div');
      this.panel.className = 'aiembed-panel inline visible';
      this.panel.innerHTML = `
        <div class="aiembed-header">
          <div class="aiembed-header-name">Assistant</div>
          <div class="aiembed-header-status">Online</div>
        </div>
        <div class="aiembed-messages"></div>
        <div class="aiembed-suggestions"></div>
        <div class="aiembed-input-area">
          <input class="aiembed-input" type="text" placeholder="Ask anything..." />
          <button class="aiembed-send">${SVG_SEND}</button>
        </div>
        <div class="aiembed-powered">Powered by <a href="https://kubeshark.com" target="_blank" rel="noopener">Kubeshark</a></div>
      `;

      container.appendChild(this.panel);
      this.shadow.appendChild(container);

      // Insert into the script tag's parent element
      const target = SCRIPT?.parentElement || document.body;
      target.appendChild(this.host);
    }

    async loadAgentConfig() {
      if (!API_URL) return;
      try {
        const resp = await fetch(`${API_URL}?action=getAgent&agent_id=${AGENT_ID}`);
        if (resp.ok) {
          this.agentConfig = await resp.json();
          this.headerName.textContent = this.agentConfig.name || 'Assistant';

          // Store avatars
          if (this.agentConfig.avatars) {
            this.avatars = this.agentConfig.avatars;
            this.updateHeaderAvatar('inviting');
            this.updateBubbleAvatar();
            this.updateInlineAvatar('inviting');
          }

          // Show KB context size
          if (this.agentConfig.kb_tokens) {
            this.kbTokens = this.agentConfig.kb_tokens;
            this.updateTokenDisplay();
          }

          this.addWelcomeHero(this.agentConfig.first_message, 'inviting');
          this.showSuggestions(this.agentConfig.opening_questions || []);
        }
      } catch (err) {
        console.error('[aiembed] Failed to load agent config:', err);
      }
    }

    toggle() {
      this.isOpen = !this.isOpen;
      this.panel.classList.toggle('visible', this.isOpen);
      this.bubble.classList.toggle('open', this.isOpen);
      if (this.isOpen) {
        // Restore expanded state when opening
        this.panel.classList.add('expanded');
        const btn = this.panel.querySelector('.aiembed-header-expand');
        if (btn) btn.innerHTML = SVG_COLLAPSE;
        this.inputEl.focus();
      } else {
        this.panel.classList.remove('expanded');
        const btn = this.panel.querySelector('.aiembed-header-expand');
        if (btn) btn.innerHTML = SVG_EXPAND;
      }
    }

    toggleExpand() {
      const expanded = this.panel.classList.toggle('expanded');
      const btn = this.panel.querySelector('.aiembed-header-expand');
      if (btn) btn.innerHTML = expanded ? SVG_COLLAPSE : SVG_EXPAND;
      this.scrollToBottom();
    }

    addUserMessage(text) {
      const msg = document.createElement('div');
      msg.className = 'aiembed-msg user';
      msg.textContent = text;
      this.messagesEl.appendChild(msg);
      this.scrollToBottom();
    }

    addWelcomeHero(text, mood) {
      const hero = document.createElement('div');
      hero.className = 'aiembed-welcome-hero';

      const showHero = this.agentConfig?.show_hero_avatar !== false;
      if (showHero) {
        const avatarUrl = this.getAvatarUrl(mood);
        if (avatarUrl) {
          const img = document.createElement('img');
          img.className = 'aiembed-welcome-hero-avatar';
          img.src = avatarUrl;
          img.alt = '';
          hero.appendChild(img);
        }

        const name = document.createElement('div');
        name.className = 'aiembed-welcome-hero-name';
        name.textContent = this.agentConfig?.name || 'Assistant';
        hero.appendChild(name);

        const role = document.createElement('div');
        role.className = 'aiembed-welcome-hero-role';
        role.textContent = this.agentConfig?.role || '';
        hero.appendChild(role);
      }

      const msg = document.createElement('div');
      msg.className = 'aiembed-welcome-hero-msg';
      msg.innerHTML = this.renderMarkdown(text);
      hero.appendChild(msg);

      this.messagesEl.appendChild(hero);
      this.history.push({ role: 'assistant', content: text });
      this.scrollToBottom();
    }

    addAssistantMessage(text, mood) {
      mood = mood || this.currentMood || 'inviting';
      const row = document.createElement('div');
      row.className = 'aiembed-msg-row assistant';

      const avatarImg = this.createAvatarImg(mood, 'aiembed-msg-avatar');
      if (avatarImg) {
        row.appendChild(avatarImg);
      }

      const msg = document.createElement('div');
      msg.className = 'aiembed-msg assistant';
      msg.innerHTML = this.renderMarkdown(text);
      this.addCopyButtons(msg);
      row.appendChild(msg);

      this.messagesEl.appendChild(row);
      this.scrollToBottom();
      return msg;
    }

    showTyping() {
      const row = document.createElement('div');
      row.className = 'aiembed-msg-row assistant';

      const avatarImg = this.createAvatarImg('thinking', 'aiembed-msg-avatar');
      if (avatarImg) {
        row.appendChild(avatarImg);
      }

      const typing = document.createElement('div');
      typing.className = 'aiembed-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      row.appendChild(typing);

      this.messagesEl.appendChild(row);
      this.scrollToBottom();
      return row;
    }

    hideTyping(el) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    showSuggestions(questions) {
      this.suggestionsEl.innerHTML = '';
      questions.forEach(q => {
        const btn = document.createElement('button');
        btn.className = 'aiembed-suggestion';
        btn.textContent = q;
        btn.addEventListener('click', () => {
          this.inputEl.value = q;
          this.send();
        });
        this.suggestionsEl.appendChild(btn);
      });
    }

    hideSuggestions() {
      this.suggestionsEl.innerHTML = '';
    }

    formatTokens(n) {
      if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
      if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
      return String(n);
    }

    updateTokenDisplay() {
      const statusEl = this.panel.querySelector('.aiembed-header-status');
      if (!statusEl) return;

      const parts = [];
      if (this.kbTokens > 0) {
        parts.push(`${this.formatTokens(this.kbTokens)} context`);
      }
      if (this.totalInputTokens > 0) {
        parts.push(`\u2191${this.formatTokens(this.totalInputTokens)} \u2193${this.formatTokens(this.totalOutputTokens)}`);
      }
      statusEl.textContent = parts.length > 0 ? parts.join(' \u00b7 ') : 'Online';
    }

    scrollToBottom() {
      requestAnimationFrame(() => {
        this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
      });
    }

    async send() {
      const text = this.inputEl.value.trim();
      if (!text || this.isLoading) return;

      this.inputEl.value = '';
      this.isLoading = true;
      this.sendBtn.disabled = true;
      this.hideSuggestions();

      this.addUserMessage(text);
      this.history.push({ role: 'user', content: text });

      const typingEl = this.showTyping();

      try {
        const resp = await fetch(`${API_URL}?action=chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agent_id: AGENT_ID,
            message: text,
            history: this.history.slice(0, -1), // don't duplicate the current message
            page_url: window.location.href,
          }),
        });

        this.hideTyping(typingEl);

        if (!resp.ok) {
          const status = resp.status;
          this.addAssistantMessage(`Something went wrong (error ${status}). Please try again, or contact [support@kubeshark.com](mailto:support@kubeshark.com) for a quick resolution.`, 'serious');
          return;
        }

        const data = await resp.json();
        const answer = data.answer || 'I wasn\'t able to generate a response this time. Please try again, or contact [support@kubeshark.com](mailto:support@kubeshark.com) for help.';
        const mood = data.mood || 'inviting';

        // Track token usage
        if (data.usage) {
          this.totalInputTokens += data.usage.input_tokens || 0;
          this.totalOutputTokens += data.usage.output_tokens || 0;
          this.updateTokenDisplay();
        }

        this.currentMood = mood;
        this.updateHeaderAvatar(mood);
        this.updateInlineAvatar(mood);
        this.addAssistantMessage(answer, mood);
        this.history.push({ role: 'assistant', content: answer });

        // Show follow-up suggestions
        const suggestions = data.suggested_questions;
        if (suggestions && suggestions.length > 0) {
          this.showSuggestions(suggestions);
        }

      } catch (err) {
        console.error('[aiembed] Chat error:', err);
        this.hideTyping(typingEl);
        this.addAssistantMessage('I couldn\'t reach the server — this could be a network issue. Please check your connection and try again, or contact [support@kubeshark.com](mailto:support@kubeshark.com) for a quick resolution.', 'serious');
      } finally {
        this.isLoading = false;
        this.sendBtn.disabled = false;
        this.inputEl.focus();
      }
    }

    renderMarkdown(text) {
      if (!text) return '';
      // Escape HTML first to prevent XSS, then apply markdown transformations
      let html = this.escapeHtml(text)
        // Code blocks (content already escaped)
        .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
          return `<pre><code class="lang-${lang}">${code.trim()}</code></pre>`;
        })
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Links — only allow http(s) and mailto protocols
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
          if (/^https?:\/\/|^mailto:/i.test(url)) {
            return `<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
          }
          return label;
        })
        // Unordered lists
        .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
        // Ordered lists
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        // Paragraphs (double newlines)
        .replace(/\n\n/g, '</p><p>')
        // Single newlines
        .replace(/\n/g, '<br>');

      // Wrap list items
      html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
      // Dedupe nested ul tags
      html = html.replace(/<\/ul>\s*<ul>/g, '');

      return '<p>' + html + '</p>';
    }

    escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    addCopyButtons(container) {
      container.querySelectorAll('pre').forEach(pre => {
        const btn = document.createElement('button');
        btn.className = 'aiembed-copy-btn';
        btn.textContent = 'Copy';
        btn.addEventListener('click', () => {
          const code = pre.querySelector('code')?.textContent || pre.textContent;
          navigator.clipboard.writeText(code).then(() => {
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = 'Copy', 1500);
          });
        });
        pre.appendChild(btn);
      });
    }
  }

  // CSS will be injected by the build step
  const CSS_CONTENT = `:host{--aiembed-primary:#2563eb;--aiembed-primary-hover:#1d4ed8;--aiembed-bg:#ffffff;--aiembed-surface:#f8fafc;--aiembed-border:#e2e8f0;--aiembed-text:#1e293b;--aiembed-text-secondary:#64748b;--aiembed-radius:12px;--aiembed-shadow:0 8px 32px rgba(0,0,0,0.12);--aiembed-bubble-size:56px;--aiembed-font:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}:host([data-theme="dark"]){--aiembed-primary:#3b82f6;--aiembed-primary-hover:#2563eb;--aiembed-bg:#1e293b;--aiembed-surface:#334155;--aiembed-border:#475569;--aiembed-text:#f1f5f9;--aiembed-text-secondary:#94a3b8;--aiembed-shadow:0 8px 32px rgba(0,0,0,0.4);}*{box-sizing:border-box;margin:0;padding:0;}.aiembed-container{font-family:var(--aiembed-font);font-size:14px;line-height:1.5;color:var(--aiembed-text);position:fixed;bottom:20px;right:20px;z-index:999999;}.aiembed-container.inline{position:static;z-index:auto;}.aiembed-bubble{width:var(--aiembed-bubble-size);height:var(--aiembed-bubble-size);border-radius:50%;background:transparent;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.18));transition:transform 0.2s ease;position:absolute;bottom:0;right:0;overflow:visible;}.aiembed-bubble:hover{transform:scale(1.12);}.aiembed-bubble svg{width:28px;height:28px;fill:var(--aiembed-primary);}.aiembed-bubble.open svg.chat-icon{display:none;}.aiembed-bubble.open svg.close-icon{display:block;}.aiembed-bubble:not(.open) svg.chat-icon{display:block;}.aiembed-bubble:not(.open) svg.close-icon{display:none;}.aiembed-bubble-avatar{width:100%;height:100%;border-radius:50%;object-fit:cover;position:absolute;top:0;left:0;transition:opacity 0.4s ease;}.aiembed-bubble.open .aiembed-bubble-avatar{display:none;}.aiembed-bubble:not(.open) .aiembed-bubble-avatar + svg.chat-icon{display:none;}@keyframes aiembed-bounce-wiggle{0%{transform:scale(1) rotate(0deg);}10%{transform:scale(1.2) rotate(-8deg);}20%{transform:scale(1.2) rotate(8deg);}30%{transform:scale(1.2) rotate(-5deg);}40%{transform:scale(1.1) rotate(5deg);}50%{transform:scale(1) rotate(0deg);}60%{transform:scale(1) translateY(-8px);}70%{transform:scale(1) translateY(0);}80%{transform:scale(1) translateY(-4px);}90%{transform:scale(1) translateY(0);}100%{transform:scale(1) rotate(0deg);}}@keyframes aiembed-glow{0%,100%{filter:drop-shadow(0 2px 8px rgba(0,0,0,0.18));}50%{filter:drop-shadow(0 2px 16px rgba(37,99,235,0.5));}}.aiembed-bubble:not(.open){animation:aiembed-bounce-wiggle 1.5s ease-in-out 2s 3,aiembed-glow 2s ease-in-out 2s 6;}.aiembed-panel{position:absolute;bottom:calc(var(--aiembed-bubble-size) + 12px);right:0;width:380px;max-height:560px;background:var(--aiembed-bg);border-radius:var(--aiembed-radius);box-shadow:var(--aiembed-shadow);border:1px solid var(--aiembed-border);display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(12px) scale(0.95);pointer-events:none;transition:opacity 0.2s ease,transform 0.2s ease,width 0.3s ease,max-height 0.3s ease,bottom 0.3s ease,right 0.3s ease;}.aiembed-panel.visible{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}.aiembed-panel.expanded{position:fixed;bottom:20px;right:20px;width:calc(100vw - 40px);max-width:900px;max-height:calc(100vh - 40px);z-index:999999;}.aiembed-panel.inline{position:static;width:100%;max-height:none;box-shadow:none;border-radius:var(--aiembed-radius);border:1px solid var(--aiembed-border);opacity:1;transform:none;pointer-events:auto;}.aiembed-inline-avatar-container{display:flex;justify-content:center;padding:20px 16px 8px;}.aiembed-inline-avatar{width:64px;height:64px;border-radius:50%;object-fit:cover;border:3px solid var(--aiembed-primary);}.aiembed-header{padding:14px 16px;background:var(--aiembed-primary);color:white;display:flex;align-items:center;gap:10px;flex-shrink:0;}.aiembed-header .aiembed-avatar{width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,0.3);flex-shrink:0;}.aiembed-header-name{font-weight:600;font-size:15px;flex:1;}.aiembed-header-status{font-size:11px;opacity:0.85;font-family:'SF Mono',Monaco,Consolas,monospace;letter-spacing:0.02em;}.aiembed-header-expand{background:none;border:none;color:white;cursor:pointer;opacity:0.7;padding:4px;display:flex;align-items:center;justify-content:center;transition:opacity 0.15s;}.aiembed-header-expand:hover{opacity:1;}.aiembed-header-close{background:none;border:none;color:white;cursor:pointer;opacity:0.7;padding:4px;display:flex;align-items:center;justify-content:center;transition:opacity 0.15s;}.aiembed-header-close:hover{opacity:1;}.aiembed-header-close svg{width:18px;height:18px;fill:white;}.aiembed-panel.inline .aiembed-header-expand{display:none;}.aiembed-panel.inline .aiembed-header-close{display:none;}.aiembed-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;min-height:200px;max-height:360px;}.aiembed-panel.expanded .aiembed-messages{max-height:calc(100vh - 200px);}.aiembed-panel.inline .aiembed-messages{max-height:400px;}.aiembed-msg-row{display:flex;align-items:flex-start;gap:8px;animation:aiembed-fade-in 0.2s ease;}.aiembed-msg-row.assistant{align-self:flex-start;max-width:90%;}.aiembed-panel.inline .aiembed-msg-row.assistant{max-width:100%;}.aiembed-panel.inline .aiembed-msg.assistant{max-width:100%;}.aiembed-msg-avatar{width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0;margin-top:2px;}.aiembed-msg{max-width:85%;padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.5;word-wrap:break-word;}.aiembed-msg-row .aiembed-msg{max-width:100%;animation:none;}@keyframes aiembed-fade-in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}.aiembed-msg.assistant{background:var(--aiembed-surface);border:1px solid var(--aiembed-border);border-bottom-left-radius:4px;align-self:flex-start;}.aiembed-msg.user{background:var(--aiembed-primary);color:white;border-bottom-right-radius:4px;align-self:flex-end;animation:aiembed-fade-in 0.2s ease;}.aiembed-msg.assistant p{margin-bottom:8px;}.aiembed-msg.assistant p:last-child{margin-bottom:0;}.aiembed-msg.assistant strong{font-weight:600;}.aiembed-msg.assistant em{font-style:italic;}.aiembed-msg.assistant a{color:var(--aiembed-primary);text-decoration:underline;}.aiembed-msg.assistant code{background:var(--aiembed-border);padding:1px 5px;border-radius:4px;font-size:13px;font-family:'SF Mono',Monaco,Consolas,monospace;}.aiembed-msg.assistant pre{background:var(--aiembed-text);color:#e2e8f0;padding:10px 12px;border-radius:8px;overflow-x:auto;margin:8px 0;position:relative;}.aiembed-msg.assistant pre code{background:none;padding:0;color:inherit;font-size:12px;}.aiembed-copy-btn{position:absolute;top:6px;right:6px;background:rgba(255,255,255,0.15);border:none;color:#94a3b8;cursor:pointer;padding:3px 8px;border-radius:4px;font-size:11px;font-family:var(--aiembed-font);}.aiembed-copy-btn:hover{background:rgba(255,255,255,0.25);}.aiembed-msg.assistant ul,.aiembed-msg.assistant ol{padding-left:20px;margin:6px 0;}.aiembed-msg.assistant li{margin-bottom:4px;}.aiembed-typing{display:flex;gap:4px;padding:10px 14px;align-self:flex-start;}.aiembed-typing span{width:7px;height:7px;background:var(--aiembed-text-secondary);border-radius:50%;animation:aiembed-bounce 1.2s infinite;}.aiembed-typing span:nth-child(2){animation-delay:0.15s;}.aiembed-typing span:nth-child(3){animation-delay:0.3s;}@keyframes aiembed-bounce{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-6px);}}.aiembed-suggestions{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 12px;}.aiembed-suggestion{background:var(--aiembed-surface);border:1px solid var(--aiembed-border);border-radius:20px;padding:6px 14px;font-size:13px;color:var(--aiembed-text);cursor:pointer;font-family:var(--aiembed-font);transition:background 0.15s,border-color 0.15s;}.aiembed-suggestion:hover{background:var(--aiembed-primary);color:white;border-color:var(--aiembed-primary);}.aiembed-input-area{padding:12px 16px;border-top:1px solid var(--aiembed-border);display:flex;gap:8px;flex-shrink:0;}.aiembed-input{flex:1;border:1px solid var(--aiembed-border);border-radius:22px;padding:8px 16px;font-size:14px;font-family:var(--aiembed-font);outline:none;background:var(--aiembed-bg);color:var(--aiembed-text);transition:border-color 0.15s;}.aiembed-input:focus{border-color:var(--aiembed-primary);}.aiembed-input::placeholder{color:var(--aiembed-text-secondary);}.aiembed-send{width:38px;height:38px;border-radius:50%;background:var(--aiembed-primary);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.15s,opacity 0.15s;}.aiembed-send:hover{background:var(--aiembed-primary-hover);}.aiembed-send:disabled{opacity:0.5;cursor:default;}.aiembed-send svg{width:18px;height:18px;fill:white;}.aiembed-powered{text-align:center;font-size:11px;color:var(--aiembed-text-secondary);padding:6px;}.aiembed-powered a{color:var(--aiembed-text-secondary);text-decoration:none;}.aiembed-powered a:hover{text-decoration:underline;}@media (max-width:440px){.aiembed-panel{width:calc(100vw - 24px);right:-8px;max-height:calc(100vh - 100px);}.aiembed-panel.inline{width:100%;right:auto;max-height:none;}}`;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AiEmbed());
  } else {
    new AiEmbed();
  }
})();
