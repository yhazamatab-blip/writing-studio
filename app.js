/**
 * オールインワン個人執筆スタジオ | Personal Writing Studio
 * Complete Multi-Project Application Logic
 */

// Global Application Data
const appData = {
  activeProjectId: "proj-sample-1",
  globalSettings: {
    aiProvider: "gemini",
    apiKey: "",
    modelName: "gemini-2.5-flash",
    ollamaUrl: "http://localhost:11434/api/generate",
    previewFontSize: 16,
    googleClientId: "",
    lastGoogleSyncTime: null
  },
  projects: [
    {
      id: "proj-sample-1",
      title: "星屑の旅人と失われた記号",
      activeChapterId: "chap-1",
      viewMode: "split",
      writingMode: "vertical",
      targetWords: 50000,
      updatedAt: Date.now(),
      chapters: [
        {
          id: "chap-1",
          title: "第1章 旅立ちの夜",
          content: "夜空を見上げると、群青色の空に｜星砂《ほしずな》のような光の粒子が舞っていた。\n\n「本当に、行ってしまうんだね」\n\n少女ルークは、ランタンのほのかな明かりの下で囁くように尋ねた。\n風が吹き抜け、彼女の長い銀髪をさやさやと揺らす。\n\n僕は小さく頷き、胸元の古びた羅針盤をギュッと握りしめた。\n《《静寂》》が二人を包み込む。この街での思い出が走馬灯のように脳裏を駆け巡った。\n\n「ああ、約束だからね。世界の果てにあるという『真実の書』を見つけ出すまでは、足を止めるわけにはいかないんだ」\n\n夜明けの鐘が、遠くの教会から響き渡ろうとしていた。"
        },
        {
          id: "chap-2",
          title: "第2章 霧の森と古びた羅針盤",
          content: "朝靄が立ち込める大森林の入口で、僕は足を止めた。\n幾重にも重なる巨大な樹木の枝が空を覆い、日光を遮っている。"
        }
      ],
      plotNodes: [
        { id: "p-1", phase: "起", title: "旅立ちと出会い", desc: "主人公が故郷を離れ、不思議な少女ルークから『古代の羅針盤』を受け取る。" },
        { id: "p-2", phase: "承", title: "試練の森と謎の襲撃者", desc: "幻影の森を抜ける途中、黒い影の獣に襲われるが、羅針盤が眩しい光を放ち退ける。" },
        { id: "p-3", phase: "転", title: "世界の真実と羅針盤の正体", desc: "真実の書があるはずの古代遺跡に到達するが、そこにあったのは予期せぬ真実だった。" },
        { id: "p-4", phase: "結", title: "新たな誓いと未来へ", desc: "過去の謎を解き明かし、世界を救うための新たな旅が始まる。" }
      ],
      memos: [
        { id: "m-1", category: "character", title: "主人公（カイ）", content: "17歳の少年。記憶の大部分を失っているが、古代語を読む力を持つ。理知的だが情に厚い。" },
        { id: "m-2", category: "character", title: "ルーク", content: "故郷の幼馴染。不思議な予知能力を宿す神秘的な少女。静かで落ち着いた口調。" },
        { id: "m-3", category: "world", title: "真実の書", content: "かつて世界を破滅から救ったとされる伝説の大魔導書。世界の裏側「天穹」に眠る。" },
        { id: "m-4", category: "item", title: "古代の羅針盤", content: "方位ではなく『所有者が真に求める場所』を指し示す魔法道具。金色の精巧な細密装飾。" }
      ],
      aiChatHistory: [
        { role: "assistant", content: "こんにちは！執筆パートナーAIです。現在書いている作品のコンテキスト（プロットや設定メモ）を踏まえて、展開の提案や表現のアドバイスを行います。何でも聞いてくださいね！" }
      ]
    }
  ]
};

// Storage Keys
const STORAGE_KEY = "writing_studio_state_v2";
const LEGACY_STORAGE_KEY = "writing_studio_state_v1";

// DOM Element References
const elements = {
  projectSelectorBtn: document.getElementById("btn-project-manager"),
  projectSelectorLabel: document.getElementById("project-selector-label"),
  projectTitleInput: document.getElementById("project-title-input"),
  saveStatus: document.getElementById("save-status"),
  totalCharCount: document.getElementById("total-char-count"),
  genkoPageCount: document.getElementById("genko-page-count"),
  chapterTreeContainer: document.getElementById("chapter-tree-container"),
  plotCardsContainer: document.getElementById("plot-cards-container"),
  memosListContainer: document.getElementById("memos-list-container"),
  chapterTitleInput: document.getElementById("chapter-title-input"),
  mainEditor: document.getElementById("main-editor"),
  previewPane: document.getElementById("preview-pane"),
  previewContent: document.getElementById("preview-content"),
  previewChapterTitle: document.getElementById("preview-chapter-title"),
  chapterCharCount: document.getElementById("chapter-char-count"),
  targetProgressPercent: document.getElementById("target-progress-percent"),
  targetProgressBar: document.getElementById("target-progress-bar"),
  aiChatMessages: document.getElementById("ai-chat-messages"),
  aiInputText: document.getElementById("ai-input-text"),
  btnSendAi: document.getElementById("btn-send-ai"),
  aiPersonaSelect: document.getElementById("ai-persona-select"),
  splitContainer: document.getElementById("split-container"),
  editorPane: document.getElementById("editor-pane"),
  
  // Modals
  modalSettings: document.getElementById("modal-settings"),
  modalMemoEdit: document.getElementById("modal-memo-edit"),
  modalProjectManager: document.getElementById("modal-project-manager"),
  projectListContainer: document.getElementById("project-list-container"),
  btnCreateNewProject: document.getElementById("btn-create-new-project"),

  aiProviderSelect: document.getElementById("ai-provider-select"),
  inputApiKey: document.getElementById("input-api-key"),
  inputModelName: document.getElementById("input-model-name"),
  inputOllamaUrl: document.getElementById("input-ollama-url"),
  inputTargetWords: document.getElementById("input-target-words"),
  inputPreviewFontSize: document.getElementById("input-preview-fontsize"),

  // Google Cloud Sync Elements
  btnGoogleSync: document.getElementById("btn-google-sync"),
  modalGoogleSync: document.getElementById("modal-google-sync"),
  inputGoogleClientId: document.getElementById("input-google-client-id"),
  syncAccountName: document.getElementById("sync-account-name"),
  syncLastTime: document.getElementById("sync-last-time"),
  btnGoogleLoginAction: document.getElementById("btn-google-login-action"),
  btnGoogleRestoreAction: document.getElementById("btn-google-restore-action"),
  btnSaveGoogleSettings: document.getElementById("btn-save-google-settings"),
  importJsonFile: document.getElementById("import-json-file"),
  btnImportProject: document.getElementById("btn-import-project"),

  // Workspace & Mobile Navigation
  workspace: document.querySelector(".workspace"),
  mobileBottomNav: document.getElementById("mobile-bottom-nav"),

  // Memo modal fields
  editMemoId: document.getElementById("edit-memo-id"),
  editMemoTitle: document.getElementById("edit-memo-title"),
  editMemoCategory: document.getElementById("edit-memo-category"),
  editMemoContent: document.getElementById("edit-memo-content")
};

// Current Project Getter
function getCurrentProject() {
  const proj = appData.projects.find(p => p.id === appData.activeProjectId);
  if (proj) return proj;
  if (appData.projects.length > 0) {
    appData.activeProjectId = appData.projects[0].id;
    return appData.projects[0];
  }
  // Fallback create empty project if none exists
  const fallback = createDefaultProject("無題の作品");
  appData.projects.push(fallback);
  appData.activeProjectId = fallback.id;
  return fallback;
}

// Current Chapter Getter
function getCurrentChapter() {
  const proj = getCurrentProject();
  return proj.chapters.find(c => c.id === proj.activeChapterId) || proj.chapters[0];
}

// Update Project Selector Label
function updateProjectSelectorLabel() {
  if (!elements.projectSelectorLabel) return;
  const proj = getCurrentProject();
  const isMobile = window.innerWidth <= 768;
  const maxLen = isMobile ? 8 : 12;
  elements.projectSelectorLabel.textContent = proj.title.length > maxLen
    ? proj.title.substring(0, maxLen - 1) + "…"
    : proj.title;
}

// Initialize App
function init() {
  loadFromStorage();
  setupEventListeners();
  renderAll();
  setMobileView("editor");
}

// Load State from LocalStorage
function loadFromStorage() {
  try {
    const savedV2 = localStorage.getItem(STORAGE_KEY);
    if (savedV2) {
      const parsed = JSON.parse(savedV2);
      if (parsed.projects && parsed.projects.length > 0) {
        appData.projects = parsed.projects;
        appData.activeProjectId = parsed.activeProjectId || parsed.projects[0].id;
        if (parsed.globalSettings) {
          Object.assign(appData.globalSettings, parsed.globalSettings);
        }
        return;
      }
    }

    // Check Legacy V1 Storage
    const savedV1 = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (savedV1) {
      const parsed = JSON.parse(savedV1);
      if (parsed.chapters) {
        appData.projects = [{
          id: "proj-1",
          title: parsed.projectTitle || "星屑の旅人と失われた記号",
          activeChapterId: parsed.activeChapterId || parsed.chapters[0]?.id || "chap-1",
          viewMode: parsed.viewMode || "split",
          writingMode: parsed.writingMode || "vertical",
          targetWords: parsed.targetWords || 50000,
          updatedAt: Date.now(),
          chapters: parsed.chapters,
          plotNodes: parsed.plotNodes || [],
          memos: parsed.memos || [],
          aiChatHistory: parsed.aiChatHistory || []
        }];
        appData.activeProjectId = "proj-1";
        if (parsed.settings) {
          Object.assign(appData.globalSettings, parsed.settings);
        }
      }
    }
  } catch (e) {
    console.warn("Failed to load local storage:", e);
  }
}

// Save State to LocalStorage
function saveState() {
  try {
    const proj = getCurrentProject();
    if (proj) {
      proj.updatedAt = Date.now();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    showSaveStatus();
  } catch (e) {
    console.error("Save state failed:", e);
  }
}

function showSaveStatus() {
  if (!elements.saveStatus) return;
  elements.saveStatus.style.opacity = "1";
  elements.saveStatus.innerHTML = '<i class="ri-cloud-line"></i> 自動保存完了';
  setTimeout(() => {
    elements.saveStatus.style.opacity = "0.7";
  }, 2000);
}

// Render All Components
function renderAll() {
  const proj = getCurrentProject();

  // Update Header Project Titles
  elements.projectTitleInput.value = proj.title;
  updateProjectSelectorLabel();

  // Update Mode buttons
  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === (proj.viewMode || "split"));
  });

  // Update Writing Mode class
  if (proj.writingMode === "horizontal") {
    elements.previewPane.classList.remove("vertical-mode");
  } else {
    elements.previewPane.classList.add("vertical-mode");
  }

  renderChapters();
  renderEditorAndPreview();
  renderPlot();
  renderMemos();
  renderStats();
  renderAiChat();
  updateViewMode();
}

// Render Chapter List
function renderChapters() {
  const proj = getCurrentProject();
  elements.chapterTreeContainer.innerHTML = "";
  proj.chapters.forEach((chap, idx) => {
    const item = document.createElement("div");
    item.className = `chapter-item ${chap.id === proj.activeChapterId ? "active" : ""}`;
    const charLen = chap.content.length;
    item.innerHTML = `
      <div class="chapter-item-left">
        <i class="ri-article-line"></i>
        <span>${chap.title || `第${idx + 1}章`}</span>
      </div>
      <span class="chapter-count">${charLen}字</span>
    `;
    item.onclick = () => switchChapter(chap.id);
    elements.chapterTreeContainer.appendChild(item);
  });
}

// Switch Active Chapter
function switchChapter(chapId) {
  const currentChap = getCurrentChapter();
  if (currentChap) {
    currentChap.content = elements.mainEditor.value;
    currentChap.title = elements.chapterTitleInput.value;
  }

  const proj = getCurrentProject();
  proj.activeChapterId = chapId;
  renderChapters();
  renderEditorAndPreview();
  saveState();
}

// Render Editor & Preview Content
function renderEditorAndPreview() {
  const current = getCurrentChapter();
  if (!current) return;

  elements.chapterTitleInput.value = current.title;
  elements.mainEditor.value = current.content;
  elements.previewChapterTitle.textContent = current.title;

  updatePreviewHTML(current.content);
  updateStats();
}

// Parse Japanese Novel Formatting (Ruby & Emphasis) into HTML
function parseJapaneseFormatting(text) {
  if (!text) return '<p class="empty-hint" style="color:var(--text-dark);">本文を入力してください...</p>';

  // Replace Ruby: ｜漢字《かんじ》 -> <ruby>漢字<rt>かんじ</rt></ruby>
  let html = text.replace(/｜([^《\n]+)《([^》\n]+)》/g, '<ruby>$1<rt>$2</rt></ruby>');

  // Replace Emphasis: 《《言葉》》 -> <span style="text-emphasis: filled dot; -webkit-text-emphasis: filled dot; color: var(--accent-amber);">$1</span>
  html = html.replace(/《《([^》\n]+)》》/g, '<span style="text-emphasis: filled dot; -webkit-text-emphasis: filled dot; color: var(--accent-amber);">$1</span>');

  // Split lines faithfully by newline (\n) so every line break and empty line is strictly preserved
  const lines = html.split(/\r?\n/);
  return lines.map(line => {
    if (line === '') {
      return '<p class="empty-line"><br></p>';
    }

    // Convert leading half-width spaces into full-width spaces (1 space = 1マス)
    // so indentation is accurately rendered as full character widths in Japanese novel typography
    let processedLine = line.replace(/^[ \t]+/g, match => '　'.repeat(match.length));

    // Also convert 2 or more consecutive spaces into full-width spaces so manual pauses/gaps are preserved
    processedLine = processedLine.replace(/ {2,}/g, match => '　'.repeat(match.length));

    return `<p>${processedLine}</p>`;
  }).join('');
}

function updatePreviewHTML(text) {
  elements.previewContent.innerHTML = parseJapaneseFormatting(text);
}

// Calculate Statistics
function updateStats() {
  const proj = getCurrentProject();
  let totalChars = 0;
  proj.chapters.forEach(c => totalChars += c.content.length);

  const currentChap = getCurrentChapter();
  const chapChars = currentChap ? currentChap.content.length : 0;
  const genkoPages = Math.ceil(totalChars / 400);
  const targetWords = proj.targetWords || 50000;
  const progressPercent = Math.min(100, Math.round((totalChars / targetWords) * 100));

  elements.totalCharCount.textContent = totalChars.toLocaleString();
  elements.genkoPageCount.textContent = genkoPages;
  elements.chapterCharCount.textContent = chapChars.toLocaleString();
  elements.targetProgressPercent.textContent = `${progressPercent}%`;
  elements.targetProgressBar.style.width = `${progressPercent}%`;
}

function renderStats() {
  updateStats();
}

// Render Plot Cards
function renderPlot() {
  const proj = getCurrentProject();
  elements.plotCardsContainer.innerHTML = "";
  proj.plotNodes.forEach(node => {
    const card = document.createElement("div");
    card.className = "plot-card";
    card.innerHTML = `
      <div class="plot-card-header">
        <span>[${node.phase}] ${node.title}</span>
      </div>
      <div class="plot-card-body">${node.desc}</div>
    `;
    elements.plotCardsContainer.appendChild(card);
  });
}

// Render Memo Cards
function renderMemos(filter = "all") {
  const proj = getCurrentProject();
  elements.memosListContainer.innerHTML = "";
  const filtered = filter === "all" ? proj.memos : proj.memos.filter(m => m.category === filter);
  
  filtered.forEach(memo => {
    const card = document.createElement("div");
    card.className = "memo-card";
    card.onclick = () => openMemoEditModal(memo);
    card.innerHTML = `
      <span class="memo-tag ${memo.category}">${getCategoryLabel(memo.category)}</span>
      <div class="memo-title">${memo.title}</div>
      <div class="memo-snippet">${memo.content}</div>
    `;
    elements.memosListContainer.appendChild(card);
  });
}

function getCategoryLabel(cat) {
  switch(cat) {
    case "character": return "人物";
    case "world": return "世界観";
    case "item": return "伏線・アイテム";
    default: return "メモ";
  }
}

// Render AI Chat History
function renderAiChat() {
  const proj = getCurrentProject();
  elements.aiChatMessages.innerHTML = "";
  (proj.aiChatHistory || []).forEach(msg => {
    const msgDiv = document.createElement("div");
    msgDiv.className = `ai-message ${msg.role}`;
    msgDiv.innerHTML = `
      <div class="avatar"><i class="ri-${msg.role === 'user' ? 'user-line' : 'sparkles-line'}"></i></div>
      <div class="message-content">${escapeHTML(msg.content).replace(/\n/g, '<br>')}</div>
    `;
    elements.aiChatMessages.appendChild(msgDiv);
  });
  elements.aiChatMessages.scrollTop = elements.aiChatMessages.scrollHeight;
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Helper: Create Blank New Project
function createDefaultProject(title = "新しい作品") {
  return {
    id: `proj-${Date.now()}`,
    title: title,
    activeChapterId: "chap-1",
    viewMode: "split",
    writingMode: "vertical",
    targetWords: 50000,
    updatedAt: Date.now(),
    chapters: [
      { id: "chap-1", title: "第1章", content: "" }
    ],
    plotNodes: [
      { id: "p-1", phase: "起", title: "導入", desc: "物語の始まりと日常の提示..." },
      { id: "p-2", phase: "承", title: "展開", desc: "事件の発生と試練..." },
      { id: "p-3", phase: "転", title: "転換", desc: "最大の危機と真実の発覚..." },
      { id: "p-4", phase: "結", title: "結末", desc: "結末と新たな旅立ち..." }
    ],
    memos: [],
    aiChatHistory: [
      { role: "assistant", content: `『${title}』の執筆スタジオへようこそ！プロットやキャラクター設定の壁打ちから、本文の表現チェックまで何でもご相談ください。` }
    ]
  };
}

// Project Manager Modal Rendering
function openProjectManagerModal() {
  renderProjectList();
  elements.modalProjectManager.classList.add("active");
}

function renderProjectList() {
  elements.projectListContainer.innerHTML = "";

  appData.projects.forEach(proj => {
    const isActive = proj.id === appData.activeProjectId;
    let totalChars = 0;
    (proj.chapters || []).forEach(c => totalChars += (c.content || "").length);

    const dateStr = new Date(proj.updatedAt || Date.now()).toLocaleDateString("ja-JP", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });

    const card = document.createElement("div");
    card.className = `project-card-item ${isActive ? "active" : ""}`;
    card.innerHTML = `
      <div class="project-card-info">
        <div class="project-card-title-row">
          <span class="project-card-title">${escapeHTML(proj.title)}</span>
          ${isActive ? '<span class="active-project-badge">執筆中</span>' : ''}
        </div>
        <div class="project-card-meta">
          <span><i class="ri-file-text-line"></i> ${proj.chapters.length} 章</span>
          <span><i class="ri-font-size"></i> ${totalChars.toLocaleString()} 字</span>
          <span><i class="ri-time-line"></i> ${dateStr}</span>
        </div>
      </div>
      <div class="project-card-actions">
        ${!isActive ? `<button class="btn-card-action btn-open" data-id="${proj.id}"><i class="ri-check-line"></i> 開く</button>` : ''}
        <button class="btn-card-action btn-duplicate" data-id="${proj.id}" title="作品を複製"><i class="ri-file-copy-line"></i> 複製</button>
        ${appData.projects.length > 1 ? `<button class="btn-card-action danger btn-delete" data-id="${proj.id}" title="作品を削除"><i class="ri-delete-bin-line"></i></button>` : ''}
      </div>
    `;

    // Button Events
    const openBtn = card.querySelector(".btn-open");
    if (openBtn) {
      openBtn.onclick = () => {
        // Sync before switching
        syncCurrentChapter();
        appData.activeProjectId = proj.id;
        renderAll();
        saveState();
        elements.modalProjectManager.classList.remove("active");
      };
    }

    const dupBtn = card.querySelector(".btn-duplicate");
    if (dupBtn) {
      dupBtn.onclick = () => {
        const copy = JSON.parse(JSON.stringify(proj));
        copy.id = `proj-${Date.now()}`;
        copy.title = `${proj.title} (コピー)`;
        copy.updatedAt = Date.now();
        appData.projects.push(copy);
        renderProjectList();
        saveState();
      };
    }

    const delBtn = card.querySelector(".btn-delete");
    if (delBtn) {
      delBtn.onclick = () => {
        if (confirm(`作品『${proj.title}』を完全に削除しますか？\n（この操作は元に戻せません）`)) {
          appData.projects = appData.projects.filter(p => p.id !== proj.id);
          if (appData.activeProjectId === proj.id) {
            appData.activeProjectId = appData.projects[0].id;
          }
          renderProjectList();
          renderAll();
          saveState();
        }
      };
    }

    elements.projectListContainer.appendChild(card);
  });
}

function syncCurrentChapter() {
  const currentChap = getCurrentChapter();
  if (currentChap) {
    currentChap.content = elements.mainEditor.value;
    currentChap.title = elements.chapterTitleInput.value;
  }
}

// Event Listeners Setup
function setupEventListeners() {
  // Project Manager Button
  if (elements.projectSelectorBtn) {
    elements.projectSelectorBtn.onclick = openProjectManagerModal;
  }

  // Create New Project Button
  if (elements.btnCreateNewProject) {
    elements.btnCreateNewProject.onclick = () => {
      const name = prompt("新しい作品のタイトルを入力してください:", "無題の新作");
      if (name && name.trim()) {
        syncCurrentChapter();
        const newProj = createDefaultProject(name.trim());
        appData.projects.push(newProj);
        appData.activeProjectId = newProj.id;
        renderAll();
        saveState();
        elements.modalProjectManager.classList.remove("active");
      }
    };
  }

  // Title edits
  elements.projectTitleInput.oninput = (e) => {
    const proj = getCurrentProject();
    proj.title = e.target.value;
    updateProjectSelectorLabel();
    saveState();
  };

  elements.chapterTitleInput.oninput = (e) => {
    const current = getCurrentChapter();
    if (current) {
      current.title = e.target.value;
      elements.previewChapterTitle.textContent = e.target.value;
      renderChapters();
      saveState();
    }
  };

  // Editor Input Event (Auto live-preview & statistics update)
  elements.mainEditor.oninput = (e) => {
    const current = getCurrentChapter();
    if (current) {
      current.content = e.target.value;
      updatePreviewHTML(e.target.value);
      updateStats();
      renderChapters();
      saveState();
    }
  };

  // Mode Switchers
  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const proj = getCurrentProject();
      proj.viewMode = btn.dataset.mode;
      updateViewMode();
      saveState();
    };
  });

  // Toggle Writing Mode (Vertical / Horizontal)
  document.getElementById("btn-toggle-writing-mode").onclick = () => {
    const proj = getCurrentProject();
    proj.writingMode = proj.writingMode === "vertical" ? "horizontal" : "vertical";
    if (proj.writingMode === "vertical") {
      elements.previewPane.classList.add("vertical-mode");
    } else {
      elements.previewPane.classList.remove("vertical-mode");
    }
    saveState();
  };

  // Sidebar Tabs Switching
  document.querySelectorAll(".sidebar-tabs .tab-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".sidebar-tabs .tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      document.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));
      document.getElementById(btn.dataset.tab).classList.add("active");
    };
  });

  // Filter Chips for Memos
  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.onclick = () => {
      document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      renderMemos(chip.dataset.filter);
    };
  });

  // Add Chapter Button
  document.getElementById("btn-add-chapter").onclick = () => {
    const proj = getCurrentProject();
    const newId = `chap-${Date.now()}`;
    const newNum = proj.chapters.length + 1;
    proj.chapters.push({
      id: newId,
      title: `第${newNum}章 新しい章`,
      content: ""
    });
    switchChapter(newId);
  };

  // Add Plot Node Button
  document.getElementById("btn-add-plot-node").onclick = () => {
    const title = prompt("プロットのタイトルを入力してください:", "新展開");
    if (title) {
      const proj = getCurrentProject();
      proj.plotNodes.push({
        id: `p-${Date.now()}`,
        phase: "展開",
        title: title,
        desc: "詳細なプロット内容を記述してください..."
      });
      renderPlot();
      saveState();
    }
  };

  // Add Memo Button
  document.getElementById("btn-add-memo").onclick = () => {
    openMemoEditModal({ id: "", title: "", category: "character", content: "" });
  };

  // Format Helper Buttons (Ruby, Dash, Ellipsis)
  document.getElementById("tool-ruby").onclick = () => insertFormatAroundSelection("｜", "《よみ》");
  document.getElementById("tool-bouten").onclick = () => insertFormatAroundSelection("《《", "》》");
  document.getElementById("tool-dash").onclick = () => insertTextAtCursor("──");
  document.getElementById("tool-ellipsis").onclick = () => insertTextAtCursor("……");

  // Focus Mode Toggle
  document.getElementById("btn-focus-mode").onclick = toggleFocusMode;

  // Settings Modal Open/Close
  document.getElementById("btn-settings").onclick = openSettingsModal;
  document.querySelectorAll("[data-close]").forEach(el => {
    el.onclick = () => {
      const modalId = el.dataset.close;
      document.getElementById(modalId).classList.remove("active");
    };
  });

  document.getElementById("btn-save-settings").onclick = saveSettings;

  // AI Chat Send & Quick Action
  elements.btnSendAi.onclick = handleAiSend;
  elements.aiInputText.onkeydown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAiSend();
    }
  };

  document.querySelectorAll(".ai-chip-btn").forEach(btn => {
    btn.onclick = () => {
      const action = btn.dataset.action;
      if (action === "review-plot") {
        elements.aiInputText.value = "現在進行中のプロットと展開についてアドバイスをください。改善できる点はありますか？";
      } else if (action === "paraphrase") {
        elements.aiInputText.value = "現在選択中の章の描写を、より情緒的で読み応えのある表現にブラッシュアップしたいです。";
      } else if (action === "check-inconsistency") {
        elements.aiInputText.value = "設定メモの人物設定や世界観と、現在の本文に矛盾や不自然な点がないか確認してください。";
      }
      handleAiSend();
    };
  });

  // Export JSON / Markdown Button
  document.getElementById("btn-export").onclick = exportProjectData;

  // Google Drive Sync Modal & Actions
  if (elements.btnGoogleSync) {
    elements.btnGoogleSync.onclick = openGoogleSyncModal;
  }
  if (elements.btnSaveGoogleSettings) {
    elements.btnSaveGoogleSettings.onclick = saveGoogleSettings;
  }
  if (elements.btnGoogleLoginAction) {
    elements.btnGoogleLoginAction.onclick = triggerGoogleSync;
  }
  if (elements.btnGoogleRestoreAction) {
    elements.btnGoogleRestoreAction.onclick = triggerGoogleRestore;
  }

  // Quick Zero-Console Drive Save & Restore
  const quickSave = document.getElementById("btn-quick-drive-save");
  if (quickSave) quickSave.onclick = exportProjectData;
  const quickRestore = document.getElementById("btn-quick-drive-restore");
  if (quickRestore) quickRestore.onclick = () => {
    elements.modalGoogleSync.classList.remove("active");
    elements.importJsonFile?.click();
  };

  // JSON Import
  if (elements.btnImportProject && elements.importJsonFile) {
    elements.btnImportProject.onclick = () => elements.importJsonFile.click();
    elements.importJsonFile.onchange = handleJsonImport;
  }

  // Mobile Bottom Navigation Buttons
  document.querySelectorAll(".mobile-nav-btn").forEach(btn => {
    btn.onclick = () => {
      setMobileView(btn.dataset.view);
    };
  });
}

// Mobile View Mode Switcher
function setMobileView(viewName) {
  const ws = elements.workspace || document.querySelector(".workspace");
  if (!ws) return;

  // Clear existing mobile view classes
  ws.classList.remove("view-editor", "view-preview", "view-notes", "view-ai");
  ws.classList.add(`view-${viewName}`);

  // Update active status on bottom nav buttons
  document.querySelectorAll(".mobile-nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });

  // Action based on view
  if (viewName === "editor") {
    setTimeout(() => elements.mainEditor?.focus(), 50);
  } else if (viewName === "preview") {
    updatePreviewHTML(elements.mainEditor.value);
  }
}

// Update UI Layout based on viewMode
function updateViewMode() {
  const proj = getCurrentProject();
  const mode = proj.viewMode || "split";
  if (mode === "editor") {
    elements.editorPane.style.display = "flex";
    elements.previewPane.style.display = "none";
  } else if (mode === "preview") {
    elements.editorPane.style.display = "none";
    elements.previewPane.style.display = "flex";
  } else {
    // Split Mode
    elements.editorPane.style.display = "flex";
    elements.previewPane.style.display = "flex";
  }
}

// Text Formatting Helpers
function insertTextAtCursor(text) {
  const editor = elements.mainEditor;
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const val = editor.value;

  editor.value = val.substring(0, start) + text + val.substring(end);
  editor.selectionStart = editor.selectionEnd = start + text.length;
  editor.focus();
  
  editor.dispatchEvent(new Event('input'));
}

function insertFormatAroundSelection(prefix, suffix) {
  const editor = elements.mainEditor;
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selected = editor.value.substring(start, end) || "言葉";

  const formatted = `${prefix}${selected}${suffix}`;
  editor.value = editor.value.substring(0, start) + formatted + editor.value.substring(end);
  editor.selectionStart = start + prefix.length;
  editor.selectionEnd = start + prefix.length + selected.length;
  editor.focus();

  editor.dispatchEvent(new Event('input'));
}

// Focus Mode
function toggleFocusMode() {
  document.body.classList.toggle("focus-mode-active");
  const isFocus = document.body.classList.contains("focus-mode-active");
  const leftSidebar = document.getElementById("left-sidebar");
  const rightSidebar = document.getElementById("right-sidebar");

  if (isFocus) {
    leftSidebar.style.display = "none";
    rightSidebar.style.display = "none";
  } else {
    leftSidebar.style.display = "flex";
    rightSidebar.style.display = "flex";
  }
}

// Settings Modal
function openSettingsModal() {
  const proj = getCurrentProject();
  elements.aiProviderSelect.value = appData.globalSettings.aiProvider;
  elements.inputApiKey.value = appData.globalSettings.apiKey;
  elements.inputModelName.value = appData.globalSettings.modelName;
  elements.inputOllamaUrl.value = appData.globalSettings.ollamaUrl;
  elements.inputTargetWords.value = proj.targetWords || 50000;

  elements.modalSettings.classList.add("active");
}

function saveSettings() {
  const proj = getCurrentProject();
  appData.globalSettings.aiProvider = elements.aiProviderSelect.value;
  appData.globalSettings.apiKey = elements.inputApiKey.value;
  appData.globalSettings.modelName = elements.inputModelName.value;
  appData.globalSettings.ollamaUrl = elements.inputOllamaUrl.value;
  proj.targetWords = parseInt(elements.inputTargetWords.value) || 50000;

  saveState();
  updateStats();
  elements.modalSettings.classList.remove("active");
}

// Memo Modal Edit/Create
function openMemoEditModal(memo) {
  elements.editMemoId.value = memo.id || "";
  elements.editMemoTitle.value = memo.title || "";
  elements.editMemoCategory.value = memo.category || "character";
  elements.editMemoContent.value = memo.content || "";

  elements.modalMemoEdit.classList.add("active");
}

document.getElementById("btn-save-memo").onclick = () => {
  const proj = getCurrentProject();
  const id = elements.editMemoId.value;
  const title = elements.editMemoTitle.value.trim();
  const category = elements.editMemoCategory.value;
  const content = elements.editMemoContent.value.trim();

  if (!title) return alert("タイトルを入力してください。");

  if (id) {
    const existing = proj.memos.find(m => m.id === id);
    if (existing) {
      existing.title = title;
      existing.category = category;
      existing.content = content;
    }
  } else {
    proj.memos.push({
      id: `m-${Date.now()}`,
      title, category, content
    });
  }

  renderMemos();
  saveState();
  elements.modalMemoEdit.classList.remove("active");
};

document.getElementById("btn-delete-memo").onclick = () => {
  const proj = getCurrentProject();
  const id = elements.editMemoId.value;
  if (id && confirm("この設定メモを削除しますか？")) {
    proj.memos = proj.memos.filter(m => m.id !== id);
    renderMemos();
    saveState();
    elements.modalMemoEdit.classList.remove("active");
  }
};

// AI Advisory Chat Handler
async function handleAiSend() {
  const promptText = elements.aiInputText.value.trim();
  if (!promptText) return;

  const proj = getCurrentProject();
  if (!proj.aiChatHistory) proj.aiChatHistory = [];

  // Append user message
  proj.aiChatHistory.push({ role: "user", content: promptText });
  elements.aiInputText.value = "";
  renderAiChat();

  // Prepare context payload from manuscript & memos
  const contextSummary = buildProjectContextSummary();
  const persona = elements.aiPersonaSelect.value;
  const personaInstruction = getPersonaSystemPrompt(persona);

  const fullPrompt = `${personaInstruction}\n\n【作品コンテキスト情報】\n${contextSummary}\n\n【ユーザーの相談内容】\n${promptText}`;

  // Call API depending on provider
  try {
    const aiResponse = await callAiProvider(fullPrompt);
    proj.aiChatHistory.push({ role: "assistant", content: aiResponse });
  } catch (err) {
    console.error("AI API Error:", err);
    proj.aiChatHistory.push({
      role: "assistant",
      content: `⚠️ AIとの接続中にエラーが発生しました。\n詳細: ${err.message}\n(設定画面でAPIキーやモデル名が正しく設定されているかご確認ください)`
    });
  }
  
  renderAiChat();
  saveState();
}

function buildProjectContextSummary() {
  const proj = getCurrentProject();
  const currChap = getCurrentChapter();
  const chapTitle = currChap ? currChap.title : "未選択";
  const manuscriptExcerpt = currChap ? currChap.content.substring(0, 800) : "";

  const memosSummary = proj.memos.map(m => `- [${getCategoryLabel(m.category)}] ${m.title}: ${m.content}`).join("\n");
  const plotSummary = proj.plotNodes.map(p => `- [${p.phase}] ${p.title}: ${p.desc}`).join("\n");

  return `作品タイトル: ${proj.title}\n現在執筆中の章: ${chapTitle}\n\n■ 現在の本文抜粋 (先頭800字):\n${manuscriptExcerpt}\n\n■ プロット要約:\n${plotSummary}\n\n■ 主な設定資料メモ:\n${memosSummary}`;
}

function getPersonaSystemPrompt(persona) {
  switch (persona) {
    case "critic":
      return "あなたはプロの文芸編集者・批評家です。伏線の整合性、プロットの論理的破綻、キャラクターの行動の説得力を厳しくかつ建設的にチェック・アドバイスしてください。";
    case "brainstorm":
      return "あなたは創意工夫に富んだストーリーテラー・ブレストパートナーです。読者を驚かせる展開やドラマチックな演出、魅力的なアイデアを提案してください。";
    case "paraphrase":
      return "あなたは文章の達人・リライトのスペシャリストです。より情緒的で視覚的、かつ日本語として美しい表現や言い換え案を提示してください。";
    default:
      return "あなたは執筆者の最高のパートナーAIです。親切かつ鋭い洞察力で、執筆者の作品世界に寄り添ったアドバイスをしてください。";
  }
}

// Call AI Provider API
async function callAiProvider(prompt) {
  const provider = appData.globalSettings.aiProvider;
  const apiKey = appData.globalSettings.apiKey;

  if (provider === "gemini") {
    if (!apiKey) {
      throw new Error("Gemini APIキーが設定されていません。ヘッダーの「歯車アイコン」から設定してください。");
    }
    const model = appData.globalSettings.modelName || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${resp.status} ${resp.statusText}`);
    }

    const data = await resp.json();
    return data.candidates[0].content.parts[0].text;
  } 
  else if (provider === "openai") {
    if (!apiKey) {
      throw new Error("OpenAI APIキーが設定されていません。");
    }
    const model = appData.globalSettings.modelName || "gpt-4o-mini";
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${resp.status}`);
    }

    const data = await resp.json();
    return data.choices[0].message.content;
  }
  else if (provider === "ollama") {
    const url = appData.globalSettings.ollamaUrl || "http://localhost:11434/api/generate";
    const model = appData.globalSettings.modelName || "llama3";

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false
      })
    });

    if (!resp.ok) throw new Error("ローカルLLM (Ollama) に接続できませんでした。");
    const data = await resp.json();
    return data.response;
  }

  throw new Error("未対応のAIプロバイダーです。");
}

// Export / Share Project Data (Web Share API for Google Drive/Files with fallback to download)
async function exportProjectData() {
  const proj = getCurrentProject();
  const exportPayload = {
    project: proj,
    projects: appData.projects,
    activeProjectId: appData.activeProjectId,
    globalSettings: appData.globalSettings,
    exportDate: new Date().toISOString()
  };
  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const fileName = `${proj.title}_執筆データ_${new Date().toISOString().slice(0,10)}.json`;

  // Try Web Share API (Direct OS Share to Google Drive, Files, AirDrop, LINE)
  if (navigator.canShare) {
    try {
      const file = new File([jsonStr], fileName, { type: "application/json" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${proj.title} 執筆データ`,
          text: `執筆スタジオの原稿データ: ${proj.title}`,
          files: [file]
        });
        return;
      }
    } catch (err) {
      if (err.name === 'AbortError') return; // User cancelled share sheet
      console.warn("Share failed, falling back to download:", err);
    }
  }

  // Fallback: Standard browser file download
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", url);
  downloadAnchor.setAttribute("download", fileName);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Google Drive Cloud Sync & JSON Import Implementation
let googleAccessToken = null;

function openGoogleSyncModal() {
  if (elements.inputGoogleClientId) {
    elements.inputGoogleClientId.value = appData.globalSettings.googleClientId || "";
  }
  updateGoogleSyncUI();
  elements.modalGoogleSync.classList.add("active");
}

function updateGoogleSyncUI() {
  const syncBtn = elements.btnGoogleSync;
  const label = document.getElementById("google-sync-label");
  const lastTime = appData.globalSettings.lastGoogleSyncTime;

  if (elements.syncLastTime) {
    elements.syncLastTime.textContent = lastTime 
      ? `最終同期: ${new Date(lastTime).toLocaleString("ja-JP")}` 
      : "最終同期: なし";
  }

  if (googleAccessToken) {
    if (elements.syncAccountName) elements.syncAccountName.textContent = "Googleアカウント接続中（同期有効）";
    if (syncBtn) syncBtn.classList.add("synced");
    if (label) label.textContent = "同期有効";
  } else {
    if (elements.syncAccountName) elements.syncAccountName.textContent = "未接続 (ローカル保存中)";
    if (syncBtn) syncBtn.classList.remove("synced");
    if (label) label.textContent = "クラウド同期";
  }
}

function saveGoogleSettings() {
  if (elements.inputGoogleClientId) {
    appData.globalSettings.googleClientId = elements.inputGoogleClientId.value.trim();
  }
  saveState();
  updateGoogleSyncUI();
  elements.modalGoogleSync.classList.remove("active");
  alert("Google連携設定を保存しました。");
}

function triggerGoogleSync() {
  const clientId = appData.globalSettings.googleClientId?.trim();
  if (!clientId) {
    alert("まずは「Google OAuth クライアントID」を入力して設定を保存してください。\n(Google Cloud Consoleから無料で取得できます)");
    return;
  }

  if (!window.google || !google.accounts || !google.accounts.oauth2) {
    alert("Google Identity Services ライブラリを読み込み中です。インターネット接続を確認して再試行してください。");
    return;
  }

  const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: 'https://www.googleapis.com/auth/drive.file',
    callback: async (resp) => {
      if (resp.error) {
        alert("Googleログインに失敗しました: " + resp.error);
        return;
      }
      googleAccessToken = resp.access_token;
      updateGoogleSyncUI();
      await uploadToGoogleDrive();
    }
  });

  tokenClient.requestAccessToken({ prompt: 'consent' });
}

async function uploadToGoogleDrive() {
  if (!googleAccessToken) return;

  try {
    elements.syncAccountName.textContent = "Googleドライブへ保存中...";
    const fileName = "writing-studio-data.json";
    const fileContent = JSON.stringify(appData, null, 2);

    // 1. Search for existing file
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${fileName}'+and+trashed=false`, {
      headers: { Authorization: `Bearer ${googleAccessToken}` }
    });
    const searchData = await searchRes.json();
    const existingFile = searchData.files && searchData.files.length > 0 ? searchData.files[0] : null;

    if (existingFile) {
      // Update existing file
      await fetch(`https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
          "Content-Type": "application/json"
        },
        body: fileContent
      });
    } else {
      // Create new file
      const metadata = {
        name: fileName,
        mimeType: "application/json"
      };
      const form = new FormData();
      form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
      form.append("file", new Blob([fileContent], { type: "application/json" }));

      await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: { Authorization: `Bearer ${googleAccessToken}` },
        body: form
      });
    }

    appData.globalSettings.lastGoogleSyncTime = Date.now();
    saveState();
    updateGoogleSyncUI();
    alert("Googleドライブへの同期が完了しました！\n専用ファイル「writing-studio-data.json」にすべての作品が保存されました。");
  } catch (err) {
    console.error("Google Drive upload error:", err);
    alert("Googleドライブへの保存中にエラーが発生しました: " + err.message);
  }
}

function triggerGoogleRestore() {
  const clientId = appData.globalSettings.googleClientId?.trim();
  if (!clientId) {
    alert("まずは「Google OAuth クライアントID」を入力してください。");
    return;
  }

  const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: 'https://www.googleapis.com/auth/drive.file',
    callback: async (resp) => {
      if (resp.error) return alert("Googleログインに失敗しました: " + resp.error);
      googleAccessToken = resp.access_token;
      updateGoogleSyncUI();
      await downloadFromGoogleDrive();
    }
  });

  tokenClient.requestAccessToken({ prompt: '' });
}

async function downloadFromGoogleDrive() {
  try {
    elements.syncAccountName.textContent = "Googleドライブから読み込み中...";
    const fileName = "writing-studio-data.json";

    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${fileName}'+and+trashed=false`, {
      headers: { Authorization: `Bearer ${googleAccessToken}` }
    });
    const searchData = await searchRes.json();
    if (!searchData.files || searchData.files.length === 0) {
      alert("Googleドライブ上に「writing-studio-data.json」が見つかりませんでした。まだ一度も保存されていない可能性があります。");
      updateGoogleSyncUI();
      return;
    }

    const fileId = searchData.files[0].id;
    const downloadRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${googleAccessToken}` }
    });
    const importedData = await downloadRes.json();

    if (importedData.projects) {
      appData.projects = importedData.projects;
      appData.activeProjectId = importedData.activeProjectId || importedData.projects[0].id;
      if (importedData.globalSettings) {
        Object.assign(appData.globalSettings, importedData.globalSettings);
      }
      appData.globalSettings.lastGoogleSyncTime = Date.now();
      saveState();
      renderAll();
      updateGoogleSyncUI();
      elements.modalGoogleSync.classList.remove("active");
      alert("Googleドライブから最新の執筆データを正常に復元しました！");
    }
  } catch (err) {
    console.error("Download error:", err);
    alert("Googleドライブからの読み込みに失敗しました: " + err.message);
  }
}

// JSON Import File Handler
function handleJsonImport(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.project) {
        // Single project export format
        const proj = data.project;
        proj.id = `proj-${Date.now()}`;
        proj.title = `${proj.title} (復元)`;
        appData.projects.push(proj);
        appData.activeProjectId = proj.id;
      } else if (data.projects) {
        // Full workspace export format
        appData.projects = data.projects;
        appData.activeProjectId = data.activeProjectId || data.projects[0].id;
      } else if (data.chapters) {
        // Legacy single project format
        const proj = {
          id: `proj-${Date.now()}`,
          title: data.projectTitle || "復元作品",
          activeChapterId: data.chapters[0]?.id || "chap-1",
          viewMode: "split",
          writingMode: "vertical",
          targetWords: 50000,
          updatedAt: Date.now(),
          chapters: data.chapters,
          plotNodes: data.plotNodes || [],
          memos: data.memos || [],
          aiChatHistory: []
        };
        appData.projects.push(proj);
        appData.activeProjectId = proj.id;
      } else {
        throw new Error("有効な執筆データファイルではありません。");
      }

      saveState();
      renderAll();
      if (elements.modalProjectManager) {
        elements.modalProjectManager.classList.remove("active");
      }
      alert("執筆データの復元・インポートが完了しました！");
    } catch (err) {
      alert("ファイルの読み込みに失敗しました: " + err.message);
    }
    event.target.value = "";
  };
  reader.readAsText(file, "UTF-8");
}

// Start Application on Load
window.addEventListener("DOMContentLoaded", init);
