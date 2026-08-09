const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");

test("contact section removes the message form", () => {
  assert.doesNotMatch(html, /id="contactForm"/);
  assert.doesNotMatch(html, /name="message"/);
  assert.doesNotMatch(html, /生成邮件草稿/);
  assert.doesNotMatch(app, /contactForm|formStatus|submitContact/);
});

test("contact copy welcomes direct communication", () => {
  assert.match(html, /欢迎与我交流/);
  assert.match(html, /行业研究、产品运营、AI 工具应用或实习\/岗位机会/);
  assert.match(html, /我会尽快回复/);
});

test("contact actions keep direct email and phone access", () => {
  assert.match(html, /15956827532@163\.com/);
  assert.match(html, /id="copyEmailBtn"/);
  assert.match(html, /id="copyContactBtn"/);
  assert.doesNotMatch(html, /contact-card|发送邮件|可以聊聊这些方向/);
  assert.match(app, /copyEmailBtn/);
  assert.match(app, /copyContactBtn/);
});

test("page shows an opening welcome animation", () => {
  assert.match(html, /id="welcomeScreen"/);
  assert.match(html, /您好，欢迎进入我的个人页面，同时希望您每天开心/);
  assert.match(app, /welcomeScreen/);
  assert.match(app, /welcome-done/);
});
