import { chromium } from "playwright";

const baseUrl = process.env.BIOEVENT_BASE_URL ?? "http://127.0.0.1:3000";
const routes = [
  { name: "活动发现页", path: "/" },
  { name: "活动详情页", path: "/activities/act-adc-forum-2026" },
  { name: "行业日历", path: "/calendar" },
  { name: "我的活动", path: "/my-events" },
  { name: "主办方详情", path: "/organizers/org-biofuture" },
  { name: "脱敏原始页", path: "/original/act-adc-forum-2026" },
  { name: "登录页", path: "/login" },
  { name: "注册页", path: "/register" },
  { name: "找回密码", path: "/forgot-password" },
  { name: "首次偏好", path: "/onboarding" },
  { name: "设置页", path: "/settings" },
  { name: "资料设置", path: "/settings/profile" },
  { name: "偏好设置", path: "/settings/preferences" },
  { name: "通知设置", path: "/settings/notifications" },
  { name: "安全设置", path: "/settings/security" },
  { name: "后台登录", path: "/admin/login" },
  { name: "后台质量看板", path: "/admin" },
  { name: "后台活动审核", path: "/admin/activities" },
  { name: "后台来源文章", path: "/admin/articles" },
  { name: "后台来源账号", path: "/admin/sources" },
  { name: "后台合并处理", path: "/admin/dedupe" },
  { name: "后台更新确认", path: "/admin/updates" },
  { name: "后台采集规则", path: "/admin/rules" },
];

const bannedTerms = [
  "已报名确认",
  "确认号",
  "取消报名",
  "订单",
  "票种",
  "二维码",
  "下载确认函",
  "官方认证主办方",
];

const invalidHrefPatterns = [
  /preview\.superdesign\.dev/i,
  /example\.com/i,
  /undefined/i,
  /null/i,
  /^#$/,
  /^javascript:/i,
];

const report = {
  pages: [],
  consoleErrors: [],
  pageErrors: [],
  badResponses: [],
  bannedMatches: [],
  invalidLinks: [],
  overflow: [],
  buttonIssues: [],
};

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});
const context = await browser.newContext({
  viewport: { width: 1365, height: 768 },
});

context.on("page", (page) => {
  attachPageListeners(page);
});

const page = await context.newPage();
attachPageListeners(page);
await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.evaluate(() => window.localStorage.clear());

for (const route of routes) {
  const url = `${baseUrl}${route.path}`;
  const response = await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const title = await page.title();
  const status = response?.status() ?? 0;
  const bodyText = await page.locator("body").innerText();
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  const links = await page.locator("a").evaluateAll((anchors) =>
    anchors.map((anchor) => ({
      text: anchor.textContent?.trim() ?? "",
      href: anchor.getAttribute("href") ?? "",
    })),
  );

  report.pages.push({ name: route.name, path: route.path, status, title });

  for (const term of bannedTerms) {
    if (bodyText.includes(term)) {
      report.bannedMatches.push({ route: route.path, term });
    }
  }

  if (route.path.startsWith("/admin")) {
    const userShellTerms = ["用户登录", "活动发现\n行业日历\n我的活动", "DEMO PORTFOLIO BUILD"];
    for (const term of userShellTerms) {
      if (bodyText.includes(term)) {
        report.buttonIssues.push({
          route: route.path,
          action: "admin independence",
          detail: `user shell text found: ${term}`,
        });
      }
    }
  }

  if (scrollWidth > clientWidth + 2) {
    report.overflow.push({ route: route.path, scrollWidth, clientWidth });
  }

  for (const link of links) {
    if (!link.href) {
      report.invalidLinks.push({ route: route.path, text: link.text, href: link.href });
      continue;
    }
    if (invalidHrefPatterns.some((pattern) => pattern.test(link.href))) {
      report.invalidLinks.push({ route: route.path, text: link.text, href: link.href });
    }
    if (link.href.startsWith("/")) {
      const linkResponse = await page.request.get(`${baseUrl}${link.href}`);
      if (linkResponse.status() >= 400) {
        report.invalidLinks.push({
          route: route.path,
          text: link.text,
          href: link.href,
          status: linkResponse.status(),
        });
      }
    }
  }
}

await runInteractions(page);
await runMobileOverflowCheck(context);
await browser.close();

console.log(JSON.stringify(report, null, 2));

if (
  report.consoleErrors.length ||
  report.pageErrors.length ||
  report.badResponses.length ||
  report.bannedMatches.length ||
  report.invalidLinks.length ||
  report.overflow.length ||
  report.buttonIssues.length
) {
  process.exitCode = 1;
}

function attachPageListeners(pageInstance) {
  pageInstance.on("console", (message) => {
    if (message.type() === "error") {
      report.consoleErrors.push({
        url: pageInstance.url(),
        text: message.text(),
      });
    }
  });
  pageInstance.on("pageerror", (error) => {
    report.pageErrors.push({
      url: pageInstance.url(),
      message: error.message,
    });
  });
  pageInstance.on("response", (response) => {
    const url = response.url();
    const status = response.status();
    if (status >= 400 && !url.includes("chrome.devtools")) {
      report.badResponses.push({ url, status });
    }
  });
}

async function runInteractions(pageInstance) {
  await pageInstance.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await pageInstance.getByPlaceholder("搜索活动、主办方、城市或主题").fill("ADC");
  await pageInstance.waitForTimeout(500);
  const adcVisible = await pageInstance.getByText(/ADC/).first().isVisible();
  if (!adcVisible) {
    report.buttonIssues.push({ route: "/", action: "search", detail: "ADC search result not visible" });
  }

  await pageInstance.getByRole("button", { name: /收藏活动|取消收藏活动/ }).first().click();
  const loginPromptVisible = await pageInstance.getByText("登录后可保存收藏、工作标签、备注和活动更新提醒。").isVisible();
  if (!loginPromptVisible) {
    report.buttonIssues.push({ route: "/", action: "guest save", detail: "login prompt not visible" });
  }
  await pageInstance.getByRole("button", { name: "暂时不用" }).click();

  await pageInstance.goto(`${baseUrl}/activities/act-adc-forum-2026`, { waitUntil: "networkidle" });
  const externalLink = await pageInstance.getByRole("link", { name: /前往原始报名页面/ }).getAttribute("href");
  if (!externalLink || !externalLink.startsWith("/original/")) {
    report.buttonIssues.push({
      route: "/activities/act-adc-forum-2026",
      action: "external registration",
      detail: externalLink ?? "missing href",
    });
  }
  await pageInstance.getByText("查看跳转说明").click();
  const jumpInfoVisible = await pageInstance.getByText("作品集演示中使用脱敏预览页，不收集报名信息。").isVisible();
  if (!jumpInfoVisible) {
    report.buttonIssues.push({
      route: "/activities/act-adc-forum-2026",
      action: "registration details",
      detail: "jump details not expanded",
    });
  }

  await pageInstance.getByRole("button", { name: "打开更新通知" }).click();
  const notificationVisible = await pageInstance.getByText(/活动更新|更新通知/).first().isVisible();
  if (!notificationVisible) {
    report.buttonIssues.push({ route: "/", action: "notification drawer", detail: "drawer not visible" });
  }
  await pageInstance.keyboard.press("Escape");

  await pageInstance.goto(`${baseUrl}/settings/security`, { waitUntil: "networkidle" });
  const protectedVisible = await pageInstance.getByText(/需要登录|登录后/).first().isVisible();
  if (!protectedVisible) {
    report.buttonIssues.push({
      route: "/settings/security",
      action: "protected route",
      detail: "not blocked while logged out",
    });
  }

  await pageInstance.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
  await pageInstance.getByLabel("工作邮箱").fill("demo@bioevent.local");
  await pageInstance.locator('input[autocomplete="current-password"]').fill("Bioevent2026");
  await pageInstance.getByRole("button", { name: "登录" }).click();
  await pageInstance.waitForURL("**/my-events", { timeout: 10000 });

  await pageInstance.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await pageInstance.getByRole("button", { name: /收藏活动|取消收藏活动/ }).first().click();
  await pageInstance.goto(`${baseUrl}/my-events`, { waitUntil: "networkidle" });
  const savedVisible = await pageInstance.getByText(/ADC/).first().isVisible();
  if (!savedVisible) {
    report.buttonIssues.push({ route: "/my-events", action: "save after login", detail: "saved item not visible" });
  }

  await pageInstance.goto(`${baseUrl}/settings/profile`, { waitUntil: "networkidle" });
  const profileVisible = await pageInstance.getByRole("heading", { name: "基本资料" }).isVisible();
  if (!profileVisible) {
    report.buttonIssues.push({
      route: "/settings/profile",
      action: "login protected route",
      detail: "profile not visible after login",
    });
  }

  await pageInstance.goto(`${baseUrl}/admin/login`, { waitUntil: "networkidle" });
  await pageInstance.getByLabel("管理员邮箱").fill("admin@bioevent.local");
  await pageInstance.locator('input[autocomplete="current-password"]').fill("BioAdmin2026");
  await pageInstance.getByRole("button", { name: "进入后台" }).click();
  await pageInstance.waitForURL("**/admin", { timeout: 10000 });
  const adminDashboardVisible = await pageInstance.getByRole("heading", { name: "质量看板" }).isVisible();
  if (!adminDashboardVisible) {
    report.buttonIssues.push({ route: "/admin/login", action: "admin login", detail: "admin dashboard not visible" });
  }

  await pageInstance.goto(`${baseUrl}/admin/activities`, { waitUntil: "networkidle" });
  await pageInstance.getByRole("button", { name: "驳回" }).first().click();
  const adminActivitiesText = await pageInstance.locator("body").innerText();
  if (!adminActivitiesText.includes("已驳回")) {
    report.buttonIssues.push({ route: "/admin/activities", action: "review status", detail: "rejected state not visible" });
  }

  await pageInstance.goto(`${baseUrl}/admin/dedupe`, { waitUntil: "networkidle" });
  await pageInstance.getByRole("button", { name: "合并" }).first().click();
  const mergedVisible = await pageInstance.getByText("已合并").first().isVisible();
  if (!mergedVisible) {
    report.buttonIssues.push({ route: "/admin/dedupe", action: "merge", detail: "merged state not visible" });
  }

  await pageInstance.goto(`${baseUrl}/admin/rules`, { waitUntil: "networkidle" });
  await pageInstance.getByRole("button", { name: /暂停规则|启用规则/ }).first().click();
  const ruleStateVisible = await pageInstance.getByText(/启用|暂停/).first().isVisible();
  if (!ruleStateVisible) {
    report.buttonIssues.push({ route: "/admin/rules", action: "rule toggle", detail: "rule state not visible" });
  }
}

async function runMobileOverflowCheck(browserContext) {
  const mobilePage = await browserContext.newPage();
  await mobilePage.setViewportSize({ width: 390, height: 844 });
  for (const route of routes) {
    await mobilePage.goto(`${baseUrl}${route.path}`, { waitUntil: "networkidle" });
    const scrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await mobilePage.evaluate(() => document.documentElement.clientWidth);
    if (scrollWidth > clientWidth + 2) {
      report.overflow.push({
        route: `${route.path} mobile`,
        scrollWidth,
        clientWidth,
      });
    }
  }
  await mobilePage.close();
}
