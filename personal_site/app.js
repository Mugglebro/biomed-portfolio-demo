const header = document.querySelector("#siteHeader");
const navLinks = document.querySelector("#navLinks");
const menuToggle = document.querySelector(".menu-toggle");
const copyEmailBtn = document.querySelector("#copyEmailBtn");
const copyContactBtn = document.querySelector("#copyContactBtn");
const emailText = document.querySelector("#emailText");
const contactNumber = document.querySelector("#contactNumber");
const welcomeScreen = document.querySelector("#welcomeScreen");
const revealItems = document.querySelectorAll(".reveal, .reveal-left");
const projectItems = document.querySelectorAll(".project-item");

const timelineData = {
  carbon: {
    time: "2025.06 - 2026.04",
    title: "基于 CEEMDAN 分解与鲁棒集成学习的碳价预测框架",
    summary:
      "围绕区域碳市场价格预测搭建完整数据分析流程，整合碳价、宏观、能源和金融市场数据，完成数据清洗、变量分析、模型比较和策略效果评估。",
    points: ["多源数据清洗与时间对齐", "碳价影响因素拆解", "预测模型对比与复盘"]
  },
  tongji: {
    time: "2026.03 - 2026.05",
    title: "上海同济工程咨询有限公司｜项目实习生",
    summary:
      "参与政策与产业案例研究，围绕中央预算内投资、专项债、长三角一体化和职业教育产教融合等方向，整理项目材料、政策边界和推进节点。",
    points: ["政策与案例资料整理", "项目问题清单维护", "汇报材料支持"]
  },
  yanyin: {
    time: "2026.05 - 2026.08",
    title: "上海衍因科技有限公司｜运营实习生",
    summary:
      "围绕生物医药行业信息服务场景，参与 AI 产品建设、用户运营和内容运营工作。从需求发现、流程设计、产品原型到 MVP 迭代，同时开展行业用户触达、社群运营和内容生产，推动产品与用户需求持续匹配。",
    points: ["AI 产品建设与 MVP 迭代", "行业用户触达与社群运营", "内容生产与需求反馈沉淀"]
  }
};

const workflowData = {
  business: {
    step: "01",
    verb: "理解",
    caption: "从场景到问题",
    angle: 0,
    kicker: "阶段 01 / 04",
    title: "业务理解",
    summary:
      "从行业场景和用户需求出发，理解业务目标和实际问题，明确产品需要解决的核心方向。",
    keywords: ["用户需求分析", "行业调研", "场景梳理"],
    practice: "对应实践：生物医药行业用户运营、同济咨询项目研究、行业信息整理。",
    output: "明确问题边界与需求优先级"
  },
  design: {
    step: "02",
    verb: "设计",
    caption: "从需求到路径",
    angle: 90,
    kicker: "阶段 02 / 04",
    title: "产品设计",
    summary:
      "将模糊需求转化为清晰流程、需求文档和产品原型，让方案更容易沟通、评估和推进。",
    keywords: ["流程设计", "产品原型", "PRD 梳理"],
    practice: "对应实践：医药情报工作台、BioEvent Intelligence。",
    output: "形成流程、原型与可验证需求"
  },
  ai: {
    step: "03",
    verb: "验证",
    caption: "从方案到 MVP",
    angle: 180,
    kicker: "阶段 03 / 04",
    title: "AI 快速验证",
    summary:
      "利用 Codex、Claude Code 等 AI 工具降低开发成本，快速完成 MVP 验证，并根据反馈调整产品方向。",
    keywords: ["MVP 验证", "AI 辅助开发", "快速迭代"],
    practice: "对应实践：两个行业产品 Demo 的快速搭建与多轮修改。",
    output: "以较低成本完成可用性验证"
  },
  data: {
    step: "04",
    verb: "复盘",
    caption: "从反馈到下一轮",
    angle: 270,
    kicker: "阶段 04 / 04",
    title: "数据反馈",
    summary:
      "通过用户反馈、数据分析和运营复盘判断优化方向，推动产品和运营策略持续调整。",
    keywords: ["用户反馈", "数据分析", "运营复盘"],
    practice: "对应实践：用户需求记录、社群运营、内容运营。",
    output: "沉淀优化项并回到新的业务判断"
  }
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

function revealHashTarget() {
  if (!window.location.hash) return;

  const target = document.querySelector(window.location.hash);
  if (!target) return;

  target.classList.add("visible");
  target.querySelectorAll(".reveal, .reveal-left").forEach((item) => {
    item.classList.add("visible");
    revealObserver.unobserve(item);
  });
}

revealHashTarget();
requestAnimationFrame(revealHashTarget);
window.addEventListener("load", revealHashTarget);
window.addEventListener("hashchange", revealHashTarget);

const projectObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("in-view", entry.isIntersecting);
    });
  },
  { threshold: 0.28, rootMargin: "0px 0px -12% 0px" }
);

projectItems.forEach((item) => projectObserver.observe(item));

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.classList.add("show"), 10);
  window.setTimeout(() => {
    toast.classList.remove("show");
    window.setTimeout(() => toast.remove(), 220);
  }, 1600);
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch {
    showToast("复制失败，请手动复制");
  }
}

function setHeaderState() {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 18);
}

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".nav-links a").forEach((link) => {
        link.classList.toggle("active", link.dataset.section === entry.target.id);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
);

document.querySelectorAll(".section-anchor[id]").forEach((section) => {
  sectionObserver.observe(section);
});

document.querySelectorAll(".axis-point").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.timeline;
    const item = timelineData[key];
    if (!item) return;

    document.querySelectorAll(".axis-point").forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    document.querySelector("#timelineTime").textContent = item.time;
    document.querySelector("#timelineTitle").textContent = item.title;
    document.querySelector("#timelineSummary").textContent = item.summary;
    document.querySelector("#timelinePoints").innerHTML = item.points
      .map((point) => `<span>${point}</span>`)
      .join("");
  });
});

const workflowNodes = document.querySelectorAll(".workflow-node");
const workflowArcs = document.querySelectorAll("[data-workflow-arc]");
const workflowOrbit = document.querySelector(".workflow-orbit");
const workflowWrap = document.querySelector(".workflow-wrap");
const workflowKicker = document.querySelector("#workflowKicker");
const workflowTitle = document.querySelector("#workflowTitle");
const workflowSummary = document.querySelector("#workflowSummary");
const workflowKeywords = document.querySelector("#workflowKeywords");
const workflowPractice = document.querySelector("#workflowPractice");
const workflowOutput = document.querySelector("#workflowOutput");
const workflowStep = document.querySelector("#workflowStep");
const workflowVerb = document.querySelector("#workflowVerb");
const workflowCaption = document.querySelector("#workflowCaption");
const workflowPanel = document.querySelector("#workflowPanel");
const workflowProgress = document.querySelector(".workflow-progress");
const workflowOrder = Array.from(workflowNodes)
  .map((node) => node.dataset.workflow)
  .filter(Boolean);
let workflowIndex = 0;
let workflowTimer = null;
let workflowVisible = false;
let workflowPaused = false;
let markerAngle = 0;
let currentWorkflowKey = "business";
const workflowDelay = 5200;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (welcomeScreen) {
  const finishWelcome = () => {
    document.body.classList.add("welcome-done");
    welcomeScreen.remove();
  };

  if (reducedMotion.matches) {
    finishWelcome();
  } else {
    welcomeScreen.addEventListener("animationend", (event) => {
      if (event.animationName === "welcomeFadeOut") finishWelcome();
    });
    window.setTimeout(finishWelcome, 5600);
  }
}

function resetWorkflowProgress() {
  if (!workflowProgress) return;
  workflowProgress.classList.remove("running");
  void workflowProgress.offsetWidth;
  if (workflowVisible && !workflowPaused && !reducedMotion.matches) {
    workflowProgress.classList.add("running");
  }
}

function setWorkflow(key, shouldAnimate = true) {
  const item = workflowData[key];
  if (!item || !workflowTitle || !workflowSummary || !workflowKeywords || !workflowPractice) return;
  workflowIndex = Math.max(0, workflowOrder.indexOf(key));

  workflowNodes.forEach((node) => {
    const active = node.dataset.workflow === key;
    node.classList.toggle("active", active);
    node.setAttribute("aria-selected", String(active));
  });

  workflowArcs.forEach((arc) => {
    arc.classList.toggle("active", arc.dataset.workflowArc === key);
  });

  if (workflowOrbit) {
    let targetAngle = item.angle;
    if (key !== currentWorkflowKey) {
      while (targetAngle <= markerAngle) targetAngle += 360;
      markerAngle = targetAngle;
    }
    workflowOrbit.style.setProperty("--workflow-angle", `${markerAngle}deg`);
  }

  if (shouldAnimate && workflowPanel) {
    workflowPanel.classList.add("switching");
    window.setTimeout(() => workflowPanel.classList.remove("switching"), 180);
  }

  if (workflowKicker) workflowKicker.textContent = item.kicker || "";
  if (workflowStep) workflowStep.textContent = item.step;
  if (workflowVerb) workflowVerb.textContent = item.verb;
  if (workflowCaption) workflowCaption.textContent = item.caption;
  workflowTitle.textContent = item.title;
  workflowSummary.textContent = item.summary;
  workflowKeywords.innerHTML = item.keywords.map((keyword) => `<span>${keyword}</span>`).join("");
  workflowPractice.textContent = item.practice;
  if (workflowOutput) workflowOutput.textContent = item.output;
  currentWorkflowKey = key;
  resetWorkflowProgress();
}

function advanceWorkflow() {
  if (!workflowOrder.length) return;
  workflowIndex = (workflowIndex + 1) % workflowOrder.length;
  setWorkflow(workflowOrder[workflowIndex]);
}

function stopWorkflowCycle() {
  window.clearInterval(workflowTimer);
  workflowTimer = null;
}

function startWorkflowCycle() {
  stopWorkflowCycle();
  if (!workflowOrder.length || !workflowVisible || workflowPaused || reducedMotion.matches) return;
  resetWorkflowProgress();
  workflowTimer = window.setInterval(advanceWorkflow, workflowDelay);
}

workflowNodes.forEach((node) => {
  const key = node.dataset.workflow;
  node.addEventListener("mouseenter", () => {
    setWorkflow(key);
  });
  node.addEventListener("focus", () => {
    setWorkflow(key);
  });
  node.addEventListener("click", () => {
    setWorkflow(key);
    if (!workflowPaused) startWorkflowCycle();
  });
});

if (workflowWrap) {
  workflowWrap.addEventListener("mouseenter", () => {
    workflowPaused = true;
    stopWorkflowCycle();
    workflowProgress?.classList.remove("running");
  });
  workflowWrap.addEventListener("mouseleave", () => {
    workflowPaused = false;
    startWorkflowCycle();
  });
  workflowWrap.addEventListener("focusin", () => {
    workflowPaused = true;
    stopWorkflowCycle();
  });
  workflowWrap.addEventListener("focusout", (event) => {
    if (workflowWrap.contains(event.relatedTarget)) return;
    workflowPaused = false;
    startWorkflowCycle();
  });

  const workflowObserver = new IntersectionObserver(
    ([entry]) => {
      workflowVisible = entry.isIntersecting;
      if (workflowVisible) startWorkflowCycle();
      else stopWorkflowCycle();
    },
    { threshold: 0.3 }
  );
  workflowObserver.observe(workflowWrap);
}

if (typeof reducedMotion.addEventListener === "function") {
  reducedMotion.addEventListener("change", startWorkflowCycle);
}

setWorkflow("business", false);

if (copyEmailBtn && emailText) {
  copyEmailBtn.addEventListener("click", () => {
    copyText(emailText.textContent.trim(), "邮箱已复制");
  });
}

if (copyContactBtn && contactNumber) {
  copyContactBtn.addEventListener("click", () => {
    copyText(contactNumber.textContent.trim(), "联系方式已复制");
  });
}
