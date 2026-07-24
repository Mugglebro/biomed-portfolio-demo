const demoItems = [
  {
    id: "CN-20260724-001",
    title: "国内创新药企业公布ADC海外授权合作",
    source: "上市公司公告",
    sourceType: "公告",
    date: "2026-07-24",
    category: "BD授权出海",
    company: "某创新药企业",
    score: 5,
    status: "建议推送",
    risk: "需核验",
    verifyReason: "涉及交易金额、里程碑付款和海外权益划分，需要以企业公告或原始新闻稿为准。",
    summary: "该事件体现国内创新药资产继续通过海外授权进入全球开发体系，适合作为BD出海方向的重点观察样本。",
    url: "https://example.com/original-announcement-1"
  },
  {
    id: "CN-20260724-002",
    title: "CDE受理某双抗新适应症上市申请",
    source: "CDE公开信息",
    sourceType: "监管",
    date: "2026-07-24",
    category: "NMPA/CDE",
    company: "某生物技术公司",
    score: 5,
    status: "建议推送",
    risk: "需核验",
    verifyReason: "审评状态、适应症表述和受理号容易被二次报道误写，需要回到CDE原始记录核对。",
    summary: "该信息可用于跟踪国内双抗管线审评节奏，以及重点适应症竞争格局变化。",
    url: "https://example.com/cde-record-2"
  },
  {
    id: "CN-20260724-003",
    title: "本土细胞治疗公司完成新一轮融资",
    source: "企业新闻稿",
    sourceType: "企业",
    date: "2026-07-23",
    category: "融资并购",
    company: "某细胞治疗公司",
    score: 4,
    status: "待确认",
    risk: "需核验",
    verifyReason: "融资金额、投资方名单和资金用途属于高风险事实，需以企业原文和工商信息交叉确认。",
    summary: "融资事件反映细胞治疗赛道仍有结构性资金流入，但应避免过度解读为行业全面回暖。",
    url: "https://example.com/company-financing-3"
  },
  {
    id: "CN-20260724-004",
    title: "国产创新药纳入地方医保支付试点",
    source: "医保局公开信息",
    sourceType: "政策",
    date: "2026-07-22",
    category: "商业化医保集采",
    company: "某药企",
    score: 4,
    status: "可发帖",
    risk: "普通",
    verifyReason: "",
    summary: "该事件可观察创新药从获批到支付落地之间的商业化路径，适合放入商业化政策观察。",
    url: "https://example.com/insurance-policy-4"
  },
  {
    id: "CN-20260724-005",
    title: "港股生物科技公司披露核心产品商业化进展",
    source: "港交所公告",
    sourceType: "公告",
    date: "2026-07-21",
    category: "上市公司公告",
    company: "某港股18A公司",
    score: 4,
    status: "建议推送",
    risk: "需核验",
    verifyReason: "上市公司公告包含财务、销售和产品进展，引用前需核对公告日期、口径和风险提示。",
    summary: "该信息适合作为商业化兑现能力观察案例，重点关注销售进展是否与费用投入匹配。",
    url: "https://example.com/hkex-disclosure-5"
  },
  {
    id: "CN-20260724-006",
    title: "行业会议发布AI制药趋势观察",
    source: "会议报道",
    sourceType: "媒体",
    date: "2026-07-24",
    category: "会议论坛",
    company: "",
    score: 2,
    status: "不推送",
    risk: "普通",
    verifyReason: "",
    summary: "缺少明确产业事件和原始公告，暂不进入重点候选。",
    url: "https://example.com/conference-trend-6"
  }
];

const state = {
  items: demoItems,
  selectedId: demoItems[0].id,
  filter: "全部",
  search: "",
  verifyOnly: false,
  digestIds: new Set(JSON.parse(localStorage.getItem("digestIds") || "[]")),
  reactions: JSON.parse(localStorage.getItem("radarReactions") || "{}")
};

const categoryWeights = {
  "BD授权出海": 94,
  "NMPA/CDE": 88,
  "融资并购": 72,
  "ADC双抗细胞治疗": 79,
  "商业化医保集采": 83,
  "上市公司公告": 76,
  "会议论坛": 28
};

const nodes = {
  newsList: document.querySelector("#newsList"),
  detailView: document.querySelector("#detailView"),
  searchInput: document.querySelector("#searchInput"),
  verifyOnly: document.querySelector("#verifyOnly"),
  digestPreview: document.querySelector("#digestPreview"),
  digestCount: document.querySelector("#digestCount"),
  preferenceBars: document.querySelector("#preferenceBars"),
  toast: document.querySelector("#toast")
};

function init() {
  bindEvents();
  render();
}

function bindEvents() {
  document.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");
      renderList();
    });
  });

  nodes.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    renderList();
  });

  nodes.verifyOnly.addEventListener("change", (event) => {
    state.verifyOnly = event.target.checked;
    renderList();
  });

  document.querySelector(".reset-button").addEventListener("click", () => {
    state.filter = "全部";
    state.search = "";
    state.verifyOnly = false;
    nodes.searchInput.value = "";
    nodes.verifyOnly.checked = false;
    document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("active"));
    document.querySelector('[data-filter="全部"]').classList.add("active");
    renderList();
    toast("筛选条件已清除");
  });

  document.querySelector("#resetBtn").addEventListener("click", () => {
    localStorage.removeItem("digestIds");
    localStorage.removeItem("radarReactions");
    state.digestIds = new Set();
    state.reactions = {};
    toast("演示状态已重置");
    render();
  });

  document.querySelector("#exportBtn").addEventListener("click", async () => {
    const text = buildDigestText();
    try {
      await navigator.clipboard.writeText(text);
      toast("日报文本已复制");
    } catch {
      toast("浏览器限制复制，请在日报预览中手动选择文本");
    }
  });
}

function getVisibleItems() {
  return state.items.filter((item) => {
    const matchFilter = state.filter === "全部" || item.category === state.filter;
    const haystack = `${item.title} ${item.source} ${item.company}`.toLowerCase();
    const matchSearch = !state.search || haystack.includes(state.search);
    const matchVerify = !state.verifyOnly || item.risk === "需核验";
    return matchFilter && matchSearch && matchVerify;
  });
}

function render() {
  renderList();
  renderDetail();
  renderDigest();
  renderPreferenceBars();
}

function renderList() {
  const visible = getVisibleItems();
  nodes.newsList.innerHTML = "";

  if (!visible.length) {
    nodes.newsList.innerHTML = '<div class="empty-row"><strong>没有匹配候选</strong><span>可以调整分类、搜索词或核验筛选条件。</span></div>';
    return;
  }

  visible.forEach((item) => {
    const row = document.createElement("article");
    row.className = `news-row ${item.id === state.selectedId ? "selected" : ""}`;
    row.innerHTML = `
      <input type="checkbox" ${state.digestIds.has(item.id) ? "checked" : ""} data-digest="${item.id}" aria-label="加入日报" />
      <span class="row-id">${item.id.replace("CN-20260724-", "IR-")}</span>
      <div class="title-cell">
        <span class="badge ${getCategoryClass(item.category)}">${item.category}</span>
        <button type="button" data-select="${item.id}">${item.title}</button>
      </div>
      <span>${item.source}</span>
      <span class="badge ${getStatusClass(item.status)}">${item.status}</span>
      <span class="badge ${item.risk === "需核验" ? "badge-risk" : "badge-good"}">${item.risk}</span>
      <strong class="score-cell">${item.score}</strong>
      <button class="row-action ${state.digestIds.has(item.id) ? "added" : ""}" type="button" data-digest="${item.id}">
        ${state.digestIds.has(item.id) ? "移出" : "加入"}
      </button>
    `;
    nodes.newsList.appendChild(row);
  });

  nodes.newsList.querySelectorAll("[data-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedId = button.dataset.select;
      renderList();
      renderDetail();
    });
  });

  nodes.newsList.querySelectorAll("[data-digest]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleDigest(button.dataset.digest);
    });
  });
}

function getCategoryClass(category) {
  if (category === "BD授权出海" || category === "商业化医保集采") return "badge-bd";
  if (category === "NMPA/CDE") return "badge-review";
  if (category === "融资并购") return "badge-finance";
  if (category === "上市公司公告") return "badge-announcement";
  return "badge-low";
}

function getStatusClass(status) {
  if (status === "建议推送" || status === "可发帖") return "badge-good";
  if (status === "待确认") return "badge-risk";
  return "badge-low";
}

function renderDetail() {
  const item = state.items.find((entry) => entry.id === state.selectedId);
  if (!item) {
    nodes.detailView.innerHTML = "<p>请选择一条资讯查看审核详情。</p>";
    return;
  }

  const reaction = state.reactions[item.id] || "";
  nodes.detailView.innerHTML = `
    <h3>${item.title}</h3>
    <div class="detail-meta">
      <span class="badge ${getCategoryClass(item.category)}">${item.category}</span>
      <span class="badge ${getStatusClass(item.status)}">${item.status}</span>
      <span class="badge ${item.risk === "需核验" ? "badge-risk" : "badge-good"}">${item.risk}</span>
      <span class="badge badge-low">评分 ${item.score}</span>
    </div>
    <div class="summary-box">
      <strong>运营摘要：</strong>${item.summary}
    </div>
    ${item.verifyReason ? `<div class="verify-box"><strong>为什么需要人工核验：</strong>${item.verifyReason}</div>` : ""}
    <p><strong>原始来源：</strong><a class="source-link" href="${item.url}" target="_blank" rel="noreferrer">${item.url}</a></p>
    <div class="detail-actions">
      <button type="button" data-reaction="like" class="${reaction === "like" ? "active" : ""}">重点关注</button>
      <button type="button" data-reaction="topic" class="${reaction === "topic" ? "active" : ""}">可做选题</button>
      <button type="button" data-reaction="skip" class="${reaction === "skip" ? "active" : ""}">无需关注</button>
    </div>
  `;

  nodes.detailView.querySelectorAll("[data-reaction]").forEach((button) => {
    button.addEventListener("click", () => {
      state.reactions[item.id] = button.dataset.reaction;
      localStorage.setItem("radarReactions", JSON.stringify(state.reactions));
      toast("反馈已记录，偏好权重已更新");
      renderDetail();
      renderPreferenceBars();
    });
  });
}

function toggleDigest(id) {
  if (state.digestIds.has(id)) {
    state.digestIds.delete(id);
    toast("已从日报移除");
  } else {
    state.digestIds.add(id);
    toast("已加入日报候选");
  }
  localStorage.setItem("digestIds", JSON.stringify([...state.digestIds]));
  renderList();
  renderDigest();
}

function buildDigestText() {
  const picked = state.items.filter((item) => state.digestIds.has(item.id));
  if (!picked.length) {
    return "今日暂无达到推送标准的重点资讯。";
  }

  const lines = ["【生物医药产业资讯简报】", "", "一、重点资讯"];
  picked.forEach((item, index) => {
    lines.push(
      "",
      `${index + 1}. ${item.title}`,
      `来源：${item.source}`,
      `时间：${item.date}`,
      `类别：${item.category}`,
      `摘要：${item.summary}`,
      item.verifyReason ? `核验原因：${item.verifyReason}` : "核验原因：无特殊高风险标记",
      `原文链接：${item.url}`
    );
  });
  lines.push("", "二、今日统计", `建议推送：${picked.length} 条`, `需人工核验：${picked.filter((item) => item.risk === "需核验").length} 条`);
  return lines.join("\n");
}

function renderDigest() {
  const picked = state.items.filter((item) => state.digestIds.has(item.id));
  nodes.digestCount.textContent = `${picked.length} 条`;
  document.querySelector("#selectedCount").textContent = picked.length;
  document.querySelector("#tableFooterText").textContent = `${picked.length} 条入选日报。`;
  document.querySelector("#bulkBar").classList.toggle("show", picked.length > 0);
  nodes.digestPreview.textContent = buildDigestText();
}

function renderPreferenceBars() {
  const reactions = Object.values(state.reactions);
  const adjusted = { ...categoryWeights };
  state.items.forEach((item) => {
    const reaction = state.reactions[item.id];
    if (reaction === "like") adjusted[item.category] = Math.min(100, (adjusted[item.category] || 50) + 5);
    if (reaction === "topic") adjusted[item.category] = Math.min(100, (adjusted[item.category] || 50) + 3);
    if (reaction === "skip") adjusted[item.category] = Math.max(0, (adjusted[item.category] || 50) - 8);
  });

  nodes.preferenceBars.innerHTML = Object.entries(adjusted)
    .filter(([category]) => category !== "会议论坛")
    .map(([category, value]) => {
      return `
        <div class="bar-row">
          <header><span>${category}</span><strong>${value}</strong></header>
          <div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div>
        </div>
      `;
    })
    .join("");

  if (reactions.length >= 4 && new Set(reactions).size === 1) {
    toast("检测到反馈过于集中，真实系统会进入人工复核");
  }
}

function toast(message) {
  nodes.toast.textContent = message;
  nodes.toast.classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => nodes.toast.classList.remove("show"), 1800);
}

init();
