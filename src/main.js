// OYLA Studio - Cognitive Workspace & Reasoning Engine

const TEMPLATES = {
  architect: {
    prompt: "Design a high-performance web architecture for real-time collaborative idea synthesis with automated deployment to Netlify.",
    system: "You are OYLA, an advanced cognitive architectural agent powered by Gemini. You decompose complex requirements into clear, elegant, and modular software specifications.",
    reasoning: [
      "Analyzing distributed state management and sync latency targets...",
      "Structuring edge compute boundaries and regional storage...",
      "Formulating static asset pipeline with Vite and Netlify Edge...",
      "Drafting architecture specification and deployment topology..."
    ],
    output: `### OYLA High-Performance Collaborative Architecture

1. Client Layer:
   - Framework: Reactive ESM modules compiled via Vite.
   - Design System: Syne display typography with obsidian glass surfaces.
   - State Sync: Local optimistic state engine backed by WebSocket/WebRTC channels.

2. Edge & Functions Layer:
   - Netlify Edge Functions for ultra-low latency geolocation routing and session authentication.
   - Standard Netlify Functions for serverless API operations and AI model orchestration.

3. Persistence & Relational Schema:
   - Managed Postgres via @netlify/database with Drizzle ORM.
   - Schema defined in db/schema.ts with automatic deploy-time migrations.
   - Netlify Blobs for unstructured document snapshots and canvas export bundles.

4. Continuous Deployment Pipeline:
   - Build Manifest: Single-command 'npm run build' generating optimized static chunks into 'dist'.
   - Edge Distribution: Automated Netlify CDN deployment with instant global invalidation.`
  },
  cot: {
    prompt: "Analyze the trade-offs between Edge-rendered serverless computing versus static pre-rendering for an AI-assisted creative studio.",
    system: "You are a senior systems engineer specializing in serverless primitives, cold starts, and distributed edge infrastructure.",
    reasoning: [
      "Evaluating TTFB metrics across edge nodes versus multi-region origins...",
      "Assessing cold start latency profiles for model inference...",
      "Benchmarking cache hit rates on dynamic synthesis streams...",
      "Synthesizing architectural recommendation matrix..."
    ],
    output: `### Comparative Trade-Off Analysis: Edge Computing vs Static Pre-rendering

1. Time to First Byte (TTFB):
   - Static Pre-rendering: ~15-30ms globally from CDN edge cache. Unbeatable for landing surfaces, canvas viewers, and documentation.
   - Edge Functions: ~60-120ms including compute hop and SSL handshake. Necessary for personalized prompts and authenticated state.

2. Inference & Stream Handling:
   - Edge functions support HTTP streaming (Transfer-Encoding: chunked), essential for perceived low latency during generative text token streaming.

3. Hybrid Recommendation:
   - Host the application shell as a statically bundled Vite SPA on Netlify CDN ('dist').
   - Delegate real-time token synthesis and database mutations to Netlify Edge Functions.`
  },
  schema: {
    prompt: "Define a clean Drizzle ORM PostgreSQL schema for users, canvas workspaces, thought nodes, and AI prompt histories.",
    system: "You are a database architect focusing on normalized PostgreSQL schemas and type-safe Drizzle ORM definitions.",
    reasoning: [
      "Defining UUID primary keys and relational foreign constraints...",
      "Adding timestamp audit fields and JSONB node positioning coordinates...",
      "Configuring indexing strategy for fast user workspace lookups..."
    ],
    output: `import { pgTable, text, timestamp, uuid, jsonb, integer } from 'drizzle-orm/pg-core';

export const workspaces = pgTable('workspaces', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull().default('Untitled Studio'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const thoughtNodes = pgTable('thought_nodes', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }),
  tag: text('tag').notNull().default('architecture'),
  title: text('title').notNull(),
  content: text('content').notNull(),
  position: jsonb('position').default({ x: 0, y: 0 }),
  tokens: integer('tokens').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});`
  },
  explain: {
    prompt: "Explain how Netlify's build configuration hierarchy prioritizes netlify.toml over UI settings when build commands fail.",
    system: "You are a DevOps and CI/CD specialist explaining cloud platform configuration semantics.",
    reasoning: [
      "Mapping Netlify build lifecycle from trigger to deployment...",
      "Analyzing configuration precedence rules...",
      "Validating repo-level overrides for UI values..."
    ],
    output: `### Netlify Build Precedence Hierarchy

1. Configuration Hierarchy:
   - Repository netlify.toml (Highest Priority for Build Settings):
     Any setting defined in netlify.toml under [build] (such as 'command' and 'publish') takes precedence over settings entered via the Netlify dashboard UI.
   - Netlify Dashboard UI (Fallback):
     If no netlify.toml is present or if specific fields are omitted, Netlify falls back to the UI values.

2. Resolution in Action:
   - Problem: Netlify UI was set to 'bun run build ya npm run build', triggering an error because 'ya' was interpreted as an argument.
   - Fix: Adding netlify.toml with 'command = "npm run build"' instructs @netlify/build to immediately execute npm without relying on the malformed dashboard entry.`
  }
};

let defaultNodes = [
  {
    id: "node-1",
    tag: "architecture",
    title: "1. Client Shell & Vite Pipeline",
    content: "Vite builds optimized static bundles into 'dist/'. Zero runtime overhead, clean ES module imports, fast compilation.",
    tokens: 142
  },
  {
    id: "node-2",
    tag: "workflow",
    title: "2. Netlify Continuous Delivery",
    content: "netlify.toml defines build command 'npm run build' and publish directory 'dist'. Overrides any malformed UI commands.",
    tokens: 98
  },
  {
    id: "node-3",
    tag: "schema",
    title: "3. Cognitive Thought Graph",
    content: "Modular canvas blocks allowing developers to break down system architecture into structured relational representations.",
    tokens: 115
  }
];

// DOM Elements
const navTabs = document.querySelectorAll('.nav-tab');
const viewPanels = document.querySelectorAll('.view-panel');
const templateSelect = document.getElementById('templateSelect');
const tempSlider = document.getElementById('tempSlider');
const tempVal = document.getElementById('tempVal');
const topPSlider = document.getElementById('topPSlider');
const topPVal = document.getElementById('topPVal');
const systemInstruction = document.getElementById('systemInstruction');
const promptInput = document.getElementById('promptInput');
const runBtn = document.getElementById('runBtn');
const runBtnText = document.getElementById('runBtnText');
const btnSpinner = document.getElementById('btnSpinner');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const copyFeedback = document.getElementById('copyFeedback');
const pushCanvasBtn = document.getElementById('pushCanvasBtn');
const reasoningSteps = document.getElementById('reasoningSteps');
const outputContent = document.getElementById('outputContent');
const streamPill = document.getElementById('streamPill');
const tokenCount = document.getElementById('tokenCount');
const nodesContainer = document.getElementById('nodesContainer');
const addNodeBtn = document.getElementById('addNodeBtn');
const exportMarkdownBtn = document.getElementById('exportMarkdownBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');

// Navigation Tab Switching
navTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-view');
    navTabs.forEach(t => t.classList.remove('active'));
    viewPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const activePanel = document.getElementById(`view-${target}`);
    if (activePanel) activePanel.classList.add('active');
  });
});

// Slider updates
if (tempSlider && tempVal) {
  tempSlider.addEventListener('input', (e) => {
    tempVal.textContent = e.target.value;
  });
}

if (topPSlider && topPVal) {
  topPSlider.addEventListener('input', (e) => {
    topPVal.textContent = e.target.value;
  });
}

// Template selection
if (templateSelect) {
  templateSelect.addEventListener('change', (e) => {
    const tpl = TEMPLATES[e.target.value];
    if (tpl) {
      promptInput.value = tpl.prompt;
      systemInstruction.value = tpl.system;
    }
  });
}

// Clear prompt
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    promptInput.value = '';
    promptInput.focus();
  });
}

// Run synthesis simulation
let isGenerating = false;
if (runBtn) {
  runBtn.addEventListener('click', async () => {
    if (isGenerating) return;
    const query = promptInput.value.trim();
    if (!query) return;

    isGenerating = true;
    runBtn.disabled = true;
    btnSpinner.style.display = 'inline-block';
    runBtnText.textContent = 'Synthesizing...';
    streamPill.textContent = 'Active Stream';
    streamPill.classList.add('active');
    reasoningSteps.innerHTML = '';
    outputContent.textContent = '';

    const tplKey = templateSelect.value;
    const tpl = TEMPLATES[tplKey] || TEMPLATES.architect;
    const steps = tpl.reasoning;

    // Stream reasoning steps
    for (let i = 0; i < steps.length; i++) {
      await sleep(350);
      const stepEl = document.createElement('div');
      stepEl.className = 'reason-step';
      stepEl.textContent = `• ${steps[i]}`;
      reasoningSteps.appendChild(stepEl);
      if (i > 0) {
        reasoningSteps.children[i - 1].classList.add('done');
      }
    }

    if (reasoningSteps.lastElementChild) {
      reasoningSteps.lastElementChild.classList.add('done');
    }

    // Stream output text
    const fullText = tpl.output;
    let currentIdx = 0;
    const chunkSize = 6;
    
    while (currentIdx < fullText.length) {
      await sleep(20);
      currentIdx = Math.min(currentIdx + chunkSize, fullText.length);
      outputContent.textContent = fullText.slice(0, currentIdx);
      tokenCount.textContent = `${Math.round(currentIdx / 4)} tokens`;
      outputContent.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    streamPill.textContent = 'Complete';
    streamPill.classList.remove('active');
    runBtn.disabled = false;
    btnSpinner.style.display = 'none';
    runBtnText.textContent = 'Synthesize Idea';
    isGenerating = false;
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Copy output
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    const text = outputContent.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      copyFeedback.textContent = 'Copied!';
      setTimeout(() => {
        copyFeedback.textContent = 'Copy';
      }, 2000);
    });
  });
}

// Push to canvas
if (pushCanvasBtn) {
  pushCanvasBtn.addEventListener('click', () => {
    const text = outputContent.textContent.trim();
    if (!text || text.startsWith('Click "Synthesize')) return;

    const newNode = {
      id: `node-${Date.now()}`,
      tag: 'architecture',
      title: `Synthesis: ${promptInput.value.slice(0, 32)}...`,
      content: text,
      tokens: Math.round(text.length / 4)
    };
    defaultNodes.unshift(newNode);
    renderNodes();

    // Switch to canvas tab
    const canvasTab = document.querySelector('[data-view="canvas"]');
    if (canvasTab) canvasTab.click();
  });
}

// Render canvas nodes
function renderNodes() {
  if (!nodesContainer) return;
  nodesContainer.innerHTML = '';

  defaultNodes.forEach(node => {
    const card = document.createElement('div');
    card.className = 'node-card';
    card.id = node.id;

    const tagClass = `tag-${node.tag}`;

    card.innerHTML = `
      <div class="node-header">
        <span class="node-tag ${tagClass}">${node.tag}</span>
        <div class="node-actions">
          <button class="node-btn delete-node-btn" title="Delete node" data-id="${node.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
      <input class="node-title-input" value="${escapeHtml(node.title)}" />
      <textarea class="node-content-textarea">${escapeHtml(node.content)}</textarea>
      <div class="node-meta">~${node.tokens} tokens &bull; ID: ${node.id}</div>
    `;

    // Listeners for changes
    const titleInput = card.querySelector('.node-title-input');
    titleInput.addEventListener('input', (e) => {
      node.title = e.target.value;
    });

    const contentInput = card.querySelector('.node-content-textarea');
    contentInput.addEventListener('input', (e) => {
      node.content = e.target.value;
      node.tokens = Math.round(e.target.value.length / 4);
      card.querySelector('.node-meta').textContent = `~${node.tokens} tokens • ID: ${node.id}`;
    });

    const delBtn = card.querySelector('.delete-node-btn');
    delBtn.addEventListener('click', () => {
      defaultNodes = defaultNodes.filter(n => n.id !== node.id);
      renderNodes();
    });

    nodesContainer.appendChild(card);
  });
}

function escapeHtml(text) {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Add Node Button
if (addNodeBtn) {
  addNodeBtn.addEventListener('click', () => {
    const newNode = {
      id: `node-${Date.now()}`,
      tag: 'workflow',
      title: 'New Thought Block',
      content: 'Define architecture component, logic sequence, or cognitive rule.',
      tokens: 16
    };
    defaultNodes.unshift(newNode);
    renderNodes();
  });
}

// Export Markdown
if (exportMarkdownBtn) {
  exportMarkdownBtn.addEventListener('click', () => {
    let md = `# OYLA Cognitive Thought Export\n\n`;
    md += `*Generated on ${new Date().toISOString()} via OYLA Studio*\n\n`;
    defaultNodes.forEach(node => {
      md += `## [${node.tag.toUpperCase()}] ${node.title}\n\n`;
      md += `${node.content}\n\n`;
      md += `---\n\n`;
    });

    downloadBlob(md, 'oyla-canvas-export.md', 'text/markdown');
  });
}

// Export JSON
if (exportJsonBtn) {
  exportJsonBtn.addEventListener('click', () => {
    const jsonStr = JSON.stringify(defaultNodes, null, 2);
    downloadBlob(jsonStr, 'oyla-canvas-nodes.json', 'application/json');
  });
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Initial render
renderNodes();
