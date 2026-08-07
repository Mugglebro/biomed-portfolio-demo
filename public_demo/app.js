const demoItems = [
  {
    id: "IR-001",
    title: "映川生物 ADC 资产完成海外授权合作",
    source: "上市公司公告",
    sourceType: "公告",
    date: "2026-07-24",
    category: "BD/授权/出海",
    company: "映川生物",
    score: 5,
    status: "建议推送",
    risk: "待核验",
    topicReady: true,
    recommendedAction: "入选重点。发送前核对交易结构、权益范围和里程碑口径。",
    contentAngle: "国产 ADC 资产出海授权，观察交易结构和海外权益。",
    verifyReason: "涉及交易金额、里程碑付款和海外权益划分，需要以企业公告或原始新闻稿为准。",
    summary: "该事件体现国内创新药资产继续通过海外授权进入全球开发体系，适合作为 BD 出海方向的重点观察样本。",
    url: "https://www.hkexnews.hk/"
  },
  {
    id: "IR-002",
    title: "澜新医药 LX-102 双抗新适应症获 CDE 受理",
    source: "CDE 公开信息",
    sourceType: "监管",
    date: "2026-07-24",
    category: "NMPA/CDE",
    company: "澜新医药",
    score: 5,
    status: "建议推送",
    risk: "待核验",
    topicReady: true,
    recommendedAction: "入选重点。发送前核对受理状态、适应症和登记口径。",
    contentAngle: "双抗管线审评进展，观察适应症竞争节奏。",
    verifyReason: "审评状态、适应症表述和受理号容易被二次报道误写，需要回到 CDE 原始记录核对。",
    summary: "该信息可用于跟踪国内双抗管线审评节奏，以及重点适应症竞争格局变化。",
    url: "https://www.cde.org.cn/"
  },
  {
    id: "IR-003",
    title: "启衡细胞完成 C 轮融资，继续推进实体瘤管线",
    source: "企业新闻稿",
    sourceType: "企业",
    date: "2026-07-23",
    category: "融资并购",
    company: "启衡细胞",
    score: 4,
    status: "待确认",
    risk: "待核验",
    topicReady: true,
    recommendedAction: "先入核验区。确认金额、投资方和资金用途后再推送。",
    contentAngle: "细胞治疗融资事件，观察资金流向和管线投入。",
    verifyReason: "融资金额、投资方名单和资金用途属于高风险事实，需要企业原文和工商信息交叉确认。",
    summary: "融资事件反映细胞治疗赛道仍有结构性资金流入，但应避免过度解读为行业全面回暖。",
    url: "https://www.prnewswire.com/news-releases/biotechnology-latest-news/"
  },
  {
    id: "IR-004",
    title: "国产创新药进入地方医保支付试点",
    source: "医保局公开信息",
    sourceType: "政策",
    date: "2026-07-22",
    category: "商业化/医保",
    company: "瑞启医药",
    score: 4,
    status: "可发布",
    risk: "常规",
    topicReady: true,
    recommendedAction: "入选重点。归入商业化政策板块。",
    contentAngle: "创新药支付落地，观察商业化路径。",
    verifyReason: "",
    summary: "该事件可观察创新药从获批到支付落地之间的商业化路径，适合放入商业化政策观察。",
    url: "https://www.nhsa.gov.cn/"
  },
  {
    id: "IR-005",
    title: "港股 18A 药企披露核心产品商业化进展",
    source: "港交所公告",
    sourceType: "公告",
    date: "2026-07-21",
    category: "商业化/医保",
    company: "港股 18A 药企",
    score: 4,
    status: "建议推送",
    risk: "待核验",
    topicReady: true,
    recommendedAction: "入选重点。引用销售和财务表述前核对公告原文。",
    contentAngle: "18A 药企商业化进展，观察兑现能力。",
    verifyReason: "上市公司公告包含财务、销售和产品进展，引用前需核对公告日期、口径和风险提示。",
    summary: "该信息适合作为商业化兑现能力观察案例，重点关注销售进展是否与费用投入匹配。",
    url: "https://www.hkexnews.hk/"
  },
  {
    id: "IR-006",
    title: "行业会议发布 AI 制药趋势观察",
    source: "会议报道",
    sourceType: "媒体",
    date: "2026-07-24",
    category: "会议报道",
    company: "",
    score: 2,
    status: "不推送",
    risk: "常规",
    topicReady: false,
    recommendedAction: "归档。不进入今日重点。",
    contentAngle: "趋势信息缺少明确事件，暂不作为本项目优先内容。",
    verifyReason: "",
    summary: "缺少明确产业事件和原始公告，暂不进入重点候选。",
    url: "https://www.phirda.com/"
  },
  {
    id: "IR-007",
    title: "华南 IVD 企业披露伴随诊断产品注册进展",
    source: "NMPA 公示",
    sourceType: "监管",
    date: "2026-07-20",
    category: "NMPA/CDE",
    company: "岭南诊断",
    score: 4,
    status: "待确认",
    risk: "待核验",
    topicReady: true,
    recommendedAction: "核对注册证编号、适用检测项目和获批日期。",
    contentAngle: "伴随诊断注册进展，观察肿瘤精准治疗配套能力。",
    verifyReason: "注册信息需要与 NMPA 原始数据库中的产品名称和适用范围一致。",
    summary: "该信息适合放入医疗器械与精准诊断方向，关注伴随诊断与创新药商业化的衔接。",
    url: "https://www.nmpa.gov.cn/"
  },
  {
    id: "IR-008",
    title: "医药流通企业宣布与创新药企共建患者服务网络",
    source: "企业官网新闻",
    sourceType: "企业",
    date: "2026-07-19",
    category: "商业化/医保",
    company: "安合医药商业",
    score: 3,
    status: "待确认",
    risk: "常规",
    topicReady: true,
    recommendedAction: "可作为商业化配套线索，暂不放在日报头条。",
    contentAngle: "创新药上市后服务网络建设，观察院外渠道和患者管理。",
    verifyReason: "",
    summary: "商业化服务网络通常影响创新药放量效率，但需要结合真实产品和覆盖地区判断价值。",
    url: "https://www.phirda.com/"
  },
  {
    id: "IR-009",
    title: "药企宣布终止一项早期肿瘤免疫管线",
    source: "上市公司公告",
    sourceType: "公告",
    date: "2026-07-18",
    category: "上市公司公告",
    company: "泰和生科",
    score: 4,
    status: "建议推送",
    risk: "待核验",
    topicReady: true,
    recommendedAction: "核对终止原因、会计影响和后续资源分配。",
    contentAngle: "管线调整与研发资源再分配，观察企业战略收缩信号。",
    verifyReason: "管线终止容易被解读为失败，需要引用公司对终止原因的完整表述。",
    summary: "该事件可作为研发管线调整案例，适合与同赛道企业的资源配置变化一起观察。",
    url: "https://www.hkexnews.hk/"
  },
  {
    id: "IR-010",
    title: "创新药企与海外 CRO 签署临床开发合作框架",
    source: "企业新闻稿",
    sourceType: "企业",
    date: "2026-07-17",
    category: "BD/授权/出海",
    company: "佑明医药",
    score: 3,
    status: "待确认",
    risk: "常规",
    topicReady: true,
    recommendedAction: "作为出海准备动作记录，等待后续具体项目节点。",
    contentAngle: "海外临床能力建设，观察从授权出海到临床执行的链条。",
    verifyReason: "",
    summary: "合作框架本身不是强产业事件，但可作为企业出海前置能力建设的线索。",
    url: "https://www.prnewswire.com/news-releases/biotechnology-latest-news/"
  },
  {
    id: "IR-011",
    title: "某创新药纳入城市惠民保特药目录",
    source: "地方公开信息",
    sourceType: "政策",
    date: "2026-07-16",
    category: "商业化/医保",
    company: "泽源医药",
    score: 4,
    status: "可发布",
    risk: "常规",
    topicReady: true,
    recommendedAction: "纳入商业化支付观察，补充覆盖城市和保障范围。",
    contentAngle: "惠民保特药目录更新，观察创新药多层次支付路径。",
    verifyReason: "",
    summary: "该线索适合与医保谈判、商保和院外支付结合分析，体现创新药支付路径的分层变化。",
    url: "https://www.nhsa.gov.cn/"
  },
  {
    id: "IR-012",
    title: "产业园发布生物医药企业出海服务计划",
    source: "园区公告",
    sourceType: "园区",
    date: "2026-07-15",
    category: "BD/授权/出海",
    company: "华东生物医药园",
    score: 2,
    status: "不推送",
    risk: "常规",
    topicReady: false,
    recommendedAction: "归档为园区服务信息，不进入今日重点。",
    contentAngle: "园区服务计划，不构成具体产业事件。",
    verifyReason: "",
    summary: "信息偏服务通知，缺少企业、产品或交易节点，当前不进入日报。",
    url: "https://www.phirda.com/"
  },
  {
    id: "IR-013",
    title: "青禾药业 GLP-1 口服制剂完成 II 期入组",
    source: "企业新闻稿",
    sourceType: "企业",
    date: "2026-07-15",
    category: "临床研究/RWE",
    company: "青禾药业",
    score: 4,
    status: "建议推送",
    risk: "待核验",
    topicReady: true,
    recommendedAction: "纳入临床进展观察。发送前核对试验登记号、入组规模和主要终点。",
    contentAngle: "GLP-1 口服剂型进入关键临床节点，观察差异化剂型竞争。",
    verifyReason: "临床阶段、入组人数和终点设置容易被营销稿简化，需要回到登记平台或公司原文核验。",
    summary: "该线索可用于观察代谢疾病领域口服剂型竞争，以及国内企业在给药便利性上的研发推进。",
    url: "https://www.chinadrugtrials.org.cn/"
  },
  {
    id: "IR-014",
    title: "罕见病基因治疗项目被纳入突破性治疗程序",
    source: "CDE 公开信息",
    sourceType: "监管",
    date: "2026-07-14",
    category: "NMPA/CDE",
    company: "启明基因",
    score: 5,
    status: "建议推送",
    risk: "待核验",
    topicReady: true,
    recommendedAction: "入选重点。核对适应症、认定日期和申请企业。",
    contentAngle: "基因治疗审评提速信号，观察罕见病赛道政策窗口。",
    verifyReason: "突破性治疗认定需准确引用 CDE 公示名称，避免把资格认定误写成获批上市。",
    summary: "该动态适合进入监管进展板块，重点说明认定本身代表审评沟通加速，不等同于产品获批。",
    url: "https://www.cde.org.cn/"
  },
  {
    id: "IR-015",
    title: "博睿器械三类影像导航系统获批上市",
    source: "NMPA 公示",
    sourceType: "监管",
    date: "2026-07-14",
    category: "医疗器械/精准诊断",
    company: "博睿器械",
    score: 4,
    status: "可发布",
    risk: "常规",
    topicReady: true,
    recommendedAction: "纳入器械审批观察，补充适用科室和注册证信息。",
    contentAngle: "高端医疗设备获批，观察国产影像导航设备的临床应用场景。",
    verifyReason: "",
    summary: "该事件可用于跟踪国产三类医疗器械审批进展，以及影像导航技术在手术场景中的商业化落地。",
    url: "https://www.nmpa.gov.cn/"
  },
  {
    id: "IR-016",
    title: "华东创新药企与跨国药企签署双抗联合开发协议",
    source: "企业官网新闻",
    sourceType: "企业",
    date: "2026-07-13",
    category: "BD/授权/出海",
    company: "嘉辰生物",
    score: 5,
    status: "建议推送",
    risk: "待核验",
    topicReady: true,
    recommendedAction: "入选重点。核对合作区域、费用结构和后续开发责任。",
    contentAngle: "双抗资产联合开发，观察国内创新药企从单点授权走向共同开发。",
    verifyReason: "合作协议容易混淆授权、联合开发和商业化分工，需要以双方公告为准。",
    summary: "该线索可作为 BD 合作模式变化的样例，重点关注国内企业是否保留中国区权益和后续开发话语权。",
    url: "https://www.prnewswire.com/news-releases/biotechnology-latest-news/"
  },
  {
    id: "IR-017",
    title: "区域真实世界研究平台启动肿瘤用药队列",
    source: "医院联合公告",
    sourceType: "医疗机构",
    date: "2026-07-12",
    category: "临床研究/RWE",
    company: "长三角肿瘤研究协作组",
    score: 3,
    status: "待确认",
    risk: "常规",
    topicReady: true,
    recommendedAction: "作为 RWE 基础设施线索记录，等待项目数据和合作方进一步披露。",
    contentAngle: "真实世界研究平台建设，观察临床数据与药企后上市研究协同。",
    verifyReason: "",
    summary: "该信息更适合作为后续跟踪线索，价值在于观察医院、药企和数据平台之间的合作边界。",
    url: "https://www.chinadrugtrials.org.cn/"
  },
  {
    id: "IR-018",
    title: "CDMO 企业披露海外生产基地 GMP 检查进展",
    source: "上市公司公告",
    sourceType: "公告",
    date: "2026-07-11",
    category: "上市公司公告",
    company: "远航生物制造",
    score: 4,
    status: "建议推送",
    risk: "待核验",
    topicReady: true,
    recommendedAction: "纳入供应链观察。核对检查机构、基地范围和后续整改表述。",
    contentAngle: "生物制造出海合规进展，观察 CDMO 国际订单承接能力。",
    verifyReason: "GMP 检查进展容易被误读为完全通过，需要核对公告中的检查结论和整改要求。",
    summary: "该动态适合放入供应链与出海合规板块，重点关注海外基地对商业化订单释放的影响。",
    url: "https://www.hkexnews.hk/"
  },
  {
    id: "IR-019",
    title: "创新药医保谈判续约目录完成地方落地",
    source: "地方医保公开信息",
    sourceType: "政策",
    date: "2026-07-10",
    category: "商业化/医保",
    company: "多家药企",
    score: 4,
    status: "可发布",
    risk: "常规",
    topicReady: true,
    recommendedAction: "纳入商业化支付板块，补充落地省份和执行时间。",
    contentAngle: "医保续约后的地方执行，观察创新药支付可及性的真实落地。",
    verifyReason: "",
    summary: "该线索有助于把医保谈判结果与地方执行节奏连接起来，适合做支付端持续跟踪。",
    url: "https://www.nhsa.gov.cn/"
  },
  {
    id: "IR-020",
    title: "基因检测企业发布伴随诊断联合开发项目",
    source: "企业新闻稿",
    sourceType: "企业",
    date: "2026-07-09",
    category: "医疗器械/精准诊断",
    company: "曜石诊断",
    score: 3,
    status: "待确认",
    risk: "常规",
    topicReady: true,
    recommendedAction: "记录为精准诊断合作线索，等待注册路径或药企伙伴披露。",
    contentAngle: "伴随诊断与创新药研发协同，观察检测企业项目来源。",
    verifyReason: "",
    summary: "该信息适合作为精准诊断生态的候选线索，但需要更多注册路径和合作产品信息后再重点推送。",
    url: "https://www.nmpa.gov.cn/"
  },
  {
    id: "IR-021",
    title: "港股药企披露核心产品 III 期达到主要终点",
    source: "港交所公告",
    sourceType: "公告",
    date: "2026-07-08",
    category: "上市公司公告",
    company: "海岚生物",
    score: 5,
    status: "建议推送",
    risk: "待核验",
    topicReady: true,
    recommendedAction: "入选重点。核对试验设计、主要终点和后续注册计划。",
    contentAngle: "核心管线进入注册前关键节点，观察 18A 药企价值兑现能力。",
    verifyReason: "临床终点结果需准确引用公告，避免把达到主要终点扩大解释为已经获批。",
    summary: "该事件适合进入今日重点，重点说明 III 期读出对后续申报、融资能力和商业化预期的影响。",
    url: "https://www.hkexnews.hk/"
  },
  {
    id: "IR-022",
    title: "生物医药专项基金完成首关，重点投向合成生物与高端制剂",
    source: "产业基金公告",
    sourceType: "投资机构",
    date: "2026-07-07",
    category: "融资并购",
    company: "华源生命基金",
    score: 3,
    status: "待确认",
    risk: "常规",
    topicReady: true,
    recommendedAction: "作为资金流向观察线索，补充基金规模和 LP 构成。",
    contentAngle: "产业资本投向变化，观察合成生物和高端制剂的资金热度。",
    verifyReason: "",
    summary: "该线索适合在投融资板块作为背景信息，价值在于呈现资金偏好而非单一企业事件。",
    url: "https://www.pedata.cn/"
  },
  {
    id: "IR-023",
    title: "细胞治疗企业获得海外临床试验许可",
    source: "ClinicalTrials.gov",
    sourceType: "注册平台",
    date: "2026-07-06",
    category: "BD/授权/出海",
    company: "瑞程细胞",
    score: 4,
    status: "建议推送",
    risk: "待核验",
    topicReady: true,
    recommendedAction: "纳入出海临床板块。核对国家、适应症和试验阶段。",
    contentAngle: "细胞治疗海外临床推进，观察国内细胞疗法国际化路径。",
    verifyReason: "海外临床许可的监管机构、适应症和阶段需要准确引用，避免与国内 IND 混淆。",
    summary: "该动态可用于跟踪细胞治疗企业从国内研发走向海外临床验证的路径和合规门槛。",
    url: "https://clinicaltrials.gov/"
  },
  {
    id: "IR-024",
    title: "行业白皮书发布会开放报名",
    source: "会议活动页",
    sourceType: "活动",
    date: "2026-07-05",
    category: "会议报道",
    company: "产业研究机构",
    score: 1,
    status: "不推送",
    risk: "常规",
    topicReady: false,
    recommendedAction: "归档为活动信息，不进入产业动态日报。",
    contentAngle: "活动报名信息，缺少明确公司事件或监管节点。",
    verifyReason: "",
    summary: "该信息可留作活动日历线索，但不适合作为医药产业动态日报的候选事件。",
    url: "https://www.phirda.com/"
  }
];

const defaultDigestIds = ["IR-001", "IR-002", "IR-004", "IR-014", "IR-021"];
const pageSize = { candidates: 5, digest: 3, feedback: 4, history: 5, sourceRules: 4 };

const defaultRules = {
  priority: ["中国创新药", "NMPA / CDE", "BD / 授权 / 出海", "融资并购", "ADC / 双抗 / 细胞治疗", "商业化 / 医保", "上市公司公告"],
  muted: ["泛科普文章", "基础生物医学研究", "会议报道", "白皮书下载", "单纯趋势解读", "无明确事件新闻稿"],
  sources: [
    { name: "CDE / NMPA", level: "高", note: "审评审批和监管状态" },
    { name: "港交所 / 上市公司公告", level: "高", note: "财务、交易、商业化进展" },
    { name: "企业官网新闻", level: "中高", note: "BD、融资、产品进展" },
    { name: "产业媒体", level: "中", note: "线索来源，需回到原始来源核验" },
    { name: "医保局公开信息", level: "高", note: "医保准入、地方支付和商保目录" },
    { name: "医学会议摘要", level: "中", note: "临床数据线索，需核对原始摘要" }
  ]
};

const historyRecords = [
  { date: "2026-07-24", title: "生物医药产业资讯简报", recipient: "产业研究组", count: 0, verify: 0, status: "待推送" },
  { date: "2026-07-23", title: "创新药审评与商业化观察", recipient: "产业研究组", count: 7, verify: 2, status: "已推送" },
  { date: "2026-07-22", title: "BD 出海与融资并购日报", recipient: "BD 拓展组", count: 8, verify: 3, status: "已推送" },
  { date: "2026-07-21", title: "上市药企公告追踪", recipient: "内容运营组", count: 6, verify: 1, status: "已推送" },
  { date: "2026-07-20", title: "医疗器械与精准诊断简报", recipient: "产业研究组", count: 5, verify: 2, status: "已推送" },
  { date: "2026-07-19", title: "商业化与支付动态", recipient: "内容运营组", count: 6, verify: 1, status: "已推送" },
  { date: "2026-07-18", title: "管线调整与研发进展", recipient: "BD 拓展组", count: 4, verify: 2, status: "已推送" }
];

const defaultRecipients = [
  { name: "产业研究组", email: "research.ops@biovista.cn" },
  { name: "BD 拓展组", email: "bd.team@biovista.cn" },
  { name: "内容运营组", email: "content@biovista.cn" }
];

const state = {
  items: demoItems,
  selectedId: demoItems[0].id,
  filter: "全部",
  search: "",
  verifyOnly: false,
  digestIds: new Set(JSON.parse(localStorage.getItem("digestIds") || JSON.stringify(defaultDigestIds))),
  reactions: JSON.parse(localStorage.getItem("radarReactions") || "{}"),
  rules: loadRules(),
  recipients: loadRecipients(),
  selectedRecipient: localStorage.getItem("selectedRecipient") || defaultRecipients[0].email,
  pushHistory: loadPushHistory(),
  analyticsView: "effectiveness",
  pages: { candidates: 1, digest: 1, feedback: 1, history: 1, sourceRules: 1 }
};

const categoryWeights = {
  "BD/授权/出海": 94,
  "NMPA/CDE": 88,
  "融资并购": 72,
  "商业化/医保": 83,
  "医疗器械/精准诊断": 79,
  "临床研究/RWE": 76,
  "上市公司公告": 76,
  "会议报道": 28
};

const nodes = {
  newsList: document.querySelector("#newsList"),
  detailView: document.querySelector("#detailView"),
  searchInput: document.querySelector("#searchInput"),
  verifyOnly: document.querySelector("#verifyOnly"),
  digestPreview: document.querySelector("#digestPreview"),
  digestCount: document.querySelector("#digestCount"),
  preferenceBars: document.querySelector("#preferenceBars"),
  learningLog: document.querySelector("#learningLog"),
  toast: document.querySelector("#toast"),
  priorityRules: document.querySelector("#priorityRules"),
  mutedRules: document.querySelector("#mutedRules"),
  sourceRules: document.querySelector("#sourceRules"),
  feedbackInsights: document.querySelector("#feedbackInsights"),
  feedbackLogList: document.querySelector("#feedbackLogList"),
  historyList: document.querySelector("#historyList"),
  recipientSelect: document.querySelector("#recipientSelect"),
  sendSummary: document.querySelector("#sendSummary"),
  analyticsMetrics: document.querySelector("#analyticsMetrics"),
  analyticsTitle: document.querySelector("#analyticsTitle"),
  analyticsVisual: document.querySelector("#analyticsVisual"),
  analyticsInsight: document.querySelector("#analyticsInsight")
};

function init() {
  bindEvents();
  const initialView = window.location.hash.replace("#", "");
  if (["candidates", "digest", "analytics", "feedback", "rules", "history"].includes(initialView)) showView(initialView, false);
  persistDigest();
  render();
}

function loadRules() {
  try {
    const stored = JSON.parse(localStorage.getItem("radarRules") || "null");
    if (!stored) return clone(defaultRules);
    return {
      priority: Array.isArray(stored.priority) ? stored.priority : [...defaultRules.priority],
      muted: Array.isArray(stored.muted) ? stored.muted : [...defaultRules.muted],
      sources: Array.isArray(stored.sources) ? stored.sources : clone(defaultRules.sources)
    };
  } catch {
    return clone(defaultRules);
  }
}

function loadRecipients() {
  try {
    const stored = JSON.parse(localStorage.getItem("radarRecipients") || "null");
    return Array.isArray(stored) && stored.length ? stored : clone(defaultRecipients);
  } catch {
    return clone(defaultRecipients);
  }
}

function loadPushHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem("radarPushHistory") || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function bindEvents() {
  document.querySelectorAll("[data-view-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showView(link.dataset.viewLink);
      document.querySelector("main.container").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      state.pages.candidates = 1;
      document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");
      renderList();
    });
  });

  nodes.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    state.pages.candidates = 1;
    renderList();
  });

  nodes.verifyOnly.addEventListener("change", (event) => {
    state.verifyOnly = event.target.checked;
    state.pages.candidates = 1;
    renderList();
  });

  document.querySelector(".reset-button").addEventListener("click", () => {
    state.filter = "全部";
    state.search = "";
    state.verifyOnly = false;
    state.pages.candidates = 1;
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
    state.digestIds = new Set(defaultDigestIds);
    state.reactions = {};
    state.pages = { candidates: 1, digest: 1, feedback: 1, history: 1, sourceRules: 1 };
    persistDigest();
    toast("演示状态已重置");
    render();
  });

  document.querySelector("#exportBtn").addEventListener("click", copyDigestText);
  document.querySelector("#exportBtnDigest").addEventListener("click", copyDigestText);
  document.querySelector("#downloadDigestBtn").addEventListener("click", downloadDigestText);
  document.querySelector("#exportCandidatesBtn").addEventListener("click", () => toast("已整理当前候选清单"));
  document.querySelector("#newItemBtn").addEventListener("click", () => toast("公开演示版不接入真实采集服务"));
  document.querySelector("#exportHistoryBtn").addEventListener("click", () => toast("已生成推送导出"));
  document.querySelector("#recipientSelect").addEventListener("change", (event) => {
    state.selectedRecipient = event.target.value;
    localStorage.setItem("selectedRecipient", state.selectedRecipient);
    renderHistory();
  });
  document.querySelector("#addRecipientBtn").addEventListener("click", addRecipient);
  document.querySelector("#sendDigestBtn").addEventListener("click", sendDigest);
  document.querySelector("#saveRulesBtn").addEventListener("click", () => {
    persistRules();
    toast("规则已保存到本地浏览器");
  });
  document.querySelector("#restoreRulesBtn").addEventListener("click", () => {
    state.rules = clone(defaultRules);
    state.pages.sourceRules = 1;
    persistRules();
    renderRules();
    toast("已恢复默认规则");
  });
  document.querySelector("#addPriorityRuleBtn").addEventListener("click", () => addRule("priority", "#priorityRuleInput"));
  document.querySelector("#addMutedRuleBtn").addEventListener("click", () => addRule("muted", "#mutedRuleInput"));
  document.querySelector("#addSourceRuleBtn").addEventListener("click", addSourceRule);
  document.querySelectorAll("[data-analytics-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.analyticsView = button.dataset.analyticsView;
      document.querySelectorAll("[data-analytics-view]").forEach((item) => item.classList.toggle("active", item === button));
      renderAnalytics();
    });
  });

  document.querySelector("#selectAllDigest").addEventListener("change", (event) => {
    getPageItems(getVisibleItems(), "candidates").forEach((item) => {
      if (event.target.checked) {
        if (item.score >= 4 && item.status !== "不推送") state.digestIds.add(item.id);
      } else {
        state.digestIds.delete(item.id);
      }
    });
    persistDigest();
    render();
    toast(event.target.checked ? "当前页可推送资讯已加入日报" : "当前页资讯已移出日报");
  });

  document.querySelector("#bulkPublishable").addEventListener("click", () => mutateDigestItems((item) => { item.status = "可发布"; }, "已将入选资讯设为可发布"));
  document.querySelector("#bulkNeedSummary").addEventListener("click", () => mutateDigestItems((item) => { if (!item.summary || item.summary.length < 24) item.status = "待补摘要"; }, "已检查摘要完整度"));
  document.querySelector("#bulkVerify").addEventListener("click", () => mutateDigestItems((item) => { item.risk = "待核验"; if (!item.verifyReason) item.verifyReason = "由运营人员批量标记，需要在发送前补充来源核验原因。"; }, "已标记为待核验"));
  document.querySelector("#bulkRemove").addEventListener("click", () => {
    state.digestIds.clear();
    persistDigest();
    render();
    toast("已清空日报候选");
  });

  bindPager("candidate", renderList, "candidates");
  bindPager("digest", renderDigest);
  bindPager("feedback", renderFeedback);
  bindPager("history", renderHistory);
  bindPager("sourceRule", renderRules, "sourceRules");
}

function showView(viewName, updateHash = true) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.dataset.view === viewName));
  document.querySelectorAll("[data-view-link]").forEach((link) => link.classList.toggle("active", link.dataset.viewLink === viewName));
  if (updateHash) window.location.hash = viewName;
}

function bindPager(prefix, renderFn, pageKey = prefix) {
  const prev = document.querySelector(`#${prefix}PrevBtn`);
  const next = document.querySelector(`#${prefix}NextBtn`);
  const input = document.querySelector(`#${prefix}PageInput`);
  if (!prev || !next || !input) return;
  prev.addEventListener("click", () => {
    state.pages[pageKey] = Math.max(1, state.pages[pageKey] - 1);
    renderFn();
  });
  next.addEventListener("click", () => {
    state.pages[pageKey] += 1;
    renderFn();
  });
  input.addEventListener("change", () => {
    state.pages[pageKey] = Math.max(1, Number(input.value) || 1);
    renderFn();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") input.blur();
  });
}

function getPageItems(items, pageKey) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize[pageKey]));
  state.pages[pageKey] = Math.min(Math.max(1, state.pages[pageKey]), totalPages);
  const start = (state.pages[pageKey] - 1) * pageSize[pageKey];
  return items.slice(start, start + pageSize[pageKey]);
}

function updatePager(prefix, pageKey, totalItems) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize[pageKey]));
  const current = Math.min(Math.max(1, state.pages[pageKey]), totalPages);
  state.pages[pageKey] = current;
  const text = document.querySelector(`#${prefix}PageText`);
  const input = document.querySelector(`#${prefix}PageInput`);
  const prev = document.querySelector(`#${prefix}PrevBtn`);
  const next = document.querySelector(`#${prefix}NextBtn`);
  if (text) text.textContent = `${current} / ${totalPages}`;
  if (input) {
    input.max = String(totalPages);
    input.value = String(current);
  }
  if (prev) prev.disabled = current <= 1;
  if (next) next.disabled = current >= totalPages;
}

function render() {
  renderMetrics();
  renderList();
  renderDetail();
  renderDigest();
  renderAnalytics();
  renderFeedback();
  renderRules();
  renderHistory();
}

function renderMetrics() {
  document.querySelector("#metricTotal").textContent = state.items.length;
  document.querySelector("#metricDigest").textContent = state.digestIds.size;
  document.querySelector("#metricVerify").textContent = state.items.filter((item) => item.risk === "待核验").length;
  document.querySelector("#metricTopic").textContent = state.items.filter((item) => item.topicReady).length;
}

function renderAnalytics() {
  if (!nodes.analyticsMetrics || !nodes.analyticsVisual) return;
  const analytics = buildAnalytics();
  nodes.analyticsMetrics.innerHTML = analytics.metrics.map((metric) => `
    <button class="${state.analyticsView === metric.key ? "active" : ""}" type="button" data-analytics-view="${metric.key}">
      <span>${metric.label}</span>
      <strong>${metric.value}</strong>
      <small>${metric.note}</small>
    </button>
  `).join("");
  nodes.analyticsMetrics.querySelectorAll("[data-analytics-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.analyticsView = button.dataset.analyticsView;
      document.querySelectorAll("[data-analytics-view]").forEach((item) => item.classList.toggle("active", item.dataset.analyticsView === state.analyticsView));
      renderAnalytics();
    });
  });

  document.querySelectorAll(".analytics-switcher [data-analytics-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.analyticsView === state.analyticsView);
  });

  const active = analytics.views[state.analyticsView] || analytics.views.effectiveness;
  nodes.analyticsTitle.textContent = active.title;
  nodes.analyticsVisual.innerHTML = renderAnalyticsChart(active);
  nodes.analyticsInsight.innerHTML = active.insights.map((item) => `
    <article>
      <b>${item.label}</b>
      <span>${item.text}</span>
    </article>
  `).join("");
}

function renderAnalyticsChart(active) {
  const chartType = active.chartType || (state.analyticsView === "effectiveness" ? "line" : "donut");
  const chart = chartType === "line" ? renderAnalyticsLine(active) : renderAnalyticsDonut(active);
  return `
    <div class="analytics-chart-layout">
      <div class="analytics-chart-box">${chart}</div>
      <div class="analytics-legend" aria-label="${escapeHtml(active.title)}图例">
        ${active.items.map((item, index) => `
          <div class="analytics-legend-row" style="--legend-color:${analyticsColor(index)}">
            <span></span>
            <b>${item.label}</b>
            <strong>${item.value}${active.suffix}</strong>
            <small>${item.note}</small>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderAnalyticsDonut(active) {
  const total = active.items.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const segments = active.items.map((item, index) => {
    const length = (item.value / total) * circumference;
    const currentOffset = -offset;
    offset += length;
    return `
      <circle class="analytics-donut-segment" cx="110" cy="110" r="${radius}" fill="none"
        stroke="${analyticsColor(index)}" stroke-width="24"
        stroke-dasharray="${length} ${circumference - length}"
        stroke-dashoffset="${currentOffset}" transform="rotate(-90 110 110)">
        <title>${item.label}: ${item.value}${active.suffix}，${item.note}</title>
      </circle>
    `;
  }).join("");
  const lead = active.items[0];
  return `
    <svg class="analytics-donut-svg" viewBox="0 0 220 220" role="img" aria-label="${escapeHtml(active.title)}环形图">
      <circle cx="110" cy="110" r="${radius}" fill="none" stroke="#edf2f7" stroke-width="24"></circle>
      ${segments}
      <text x="110" y="102" text-anchor="middle" class="analytics-center-label">${lead ? lead.label : ""}</text>
      <text x="110" y="132" text-anchor="middle" class="analytics-center-value">${lead ? lead.value + active.suffix : "-"}</text>
    </svg>
  `;
}

function renderAnalyticsLine(active) {
  const width = 720;
  const height = 300;
  const pad = { left: 54, right: 28, top: 28, bottom: 44 };
  const values = active.items.map((item) => item.value);
  const max = Math.min(100, Math.max(...values) + 8);
  const min = Math.max(0, Math.min(...values) - 8);
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  const points = active.items.map((item, index) => {
    const x = pad.left + (index / Math.max(active.items.length - 1, 1)) * plotWidth;
    const y = pad.top + ((max - item.value) / Math.max(max - min, 1)) * plotHeight;
    return { ...item, x, y };
  });
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${pad.left},${height - pad.bottom} ${line} ${width - pad.right},${height - pad.bottom}`;
  return `
    <svg class="analytics-line-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(active.title)}趋势图">
      <defs>
        <linearGradient id="publicAnalyticsLineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0f766e" stop-opacity="0.2"></stop>
          <stop offset="100%" stop-color="#0f766e" stop-opacity="0"></stop>
        </linearGradient>
      </defs>
      ${[0, 1, 2].map((lineIndex) => {
        const y = pad.top + (lineIndex / 2) * plotHeight;
        return `<line x1="${pad.left}" x2="${width - pad.right}" y1="${y}" y2="${y}" stroke="#e2e8f0" stroke-width="1"></line>`;
      }).join("")}
      <polygon points="${area}" fill="url(#publicAnalyticsLineFill)"></polygon>
      <polyline points="${line}" fill="none" stroke="#0f766e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>
      ${points.map((point) => `
        <g class="analytics-line-point">
          <circle cx="${point.x}" cy="${point.y}" r="6" fill="#fff" stroke="#0f766e" stroke-width="4"></circle>
          <circle cx="${point.x}" cy="${point.y}" r="18" fill="transparent">
            <title>${point.label}: ${point.value}${active.suffix}，${point.note}</title>
          </circle>
          <text x="${point.x}" y="${height - 15}" text-anchor="middle">${point.label}</text>
        </g>
      `).join("")}
    </svg>
  `;
}

function analyticsColor(index) {
  return ["#0f766e", "#14b8a6", "#64748b", "#f59e0b", "#94a3b8", "#a78bfa", "#cbd5e1"][index % 7];
}

function buildAnalytics() {
  const total = state.items.length;
  const digestItems = state.items.filter((item) => state.digestIds.has(item.id));
  const effective = state.items.filter((item) => item.score >= 4 && item.status !== "不推送").length;
  const verified = state.items.filter((item) => item.risk !== "待核验").length;
  const useful = state.items.filter((item) => item.summary && item.source && item.company).length;
  const reactions = Object.values(state.reactions);
  const reactionMap = {
    "重点关注": reactions.filter((item) => item === "like").length + 6,
    "可做选题": reactions.filter((item) => item === "topic").length + 5,
    "无需关注": reactions.filter((item) => item === "skip").length + 3,
    "待复核": buildFeedbackItems().filter((item) => item.status === "待复核").length
  };
  const sourceMap = countBy(state.items, (item) => normalizeSourceType(item.source));
  const topicMap = countBy(state.items, (item) => item.category);
  const effectiveRate = Math.round((effective / Math.max(total, 1)) * 100);
  const verifiedRate = Math.round((verified / Math.max(total, 1)) * 100);
  const digestRate = Math.round((digestItems.length / Math.max(total, 1)) * 100);
  const usefulRate = Math.round((useful / Math.max(total, 1)) * 100);
  const sourceItems = toDistribution(sourceMap, total, "条");
  const topicItems = toDistribution(topicMap, total, "条").slice(0, 7);
  const feedbackItems = toDistribution(reactionMap, Object.values(reactionMap).reduce((sum, value) => sum + value, 0), "次");
  const effectivenessItems = [
    { label: "资讯有效率", value: effectiveRate, note: `${effective} / ${total} 条可进入人工判断` },
    { label: "来源核验通过率", value: verifiedRate, note: `${verified} 条来源明确或风险较低` },
    { label: "候选入报率", value: digestRate, note: `${digestItems.length} 条已纳入日报草稿` },
    { label: "有效信息率", value: usefulRate, note: "具备标题、来源、公司和摘要字段" }
  ];

  return {
    metrics: [
      { key: "effectiveness", label: "资讯有效率", value: `${effectiveRate}%`, note: "候选可用程度" },
      { key: "sources", label: "来源核验通过率", value: `${verifiedRate}%`, note: "来源可追溯" },
      { key: "topics", label: "有效信息率", value: `${usefulRate}%`, note: "字段完整" },
      { key: "feedback", label: "反馈类型", value: `${feedbackItems.length}`, note: "复盘类别" }
    ],
    views: {
      effectiveness: {
        chartType: "line",
        title: "资讯有效率",
        suffix: "%",
        total: effectivenessItems.reduce((sum, item) => sum + item.value, 0),
        items: effectivenessItems,
        insights: [
          { label: "先筛后写", text: "评分 4 分以上、来源清晰且具备具体事件的资讯优先进入日报草稿。" },
          { label: "发前复核", text: "待核验内容不直接推送，需要补充公告、官网或企业原始稿件作为依据。" },
          { label: "信息完整", text: "摘要、公司、来源和主题字段完整时，后续编辑成本最低。" }
        ]
      },
      sources: {
        chartType: "donut",
        title: "信息来源分布",
        suffix: "%",
        total: sourceItems.reduce((sum, item) => sum + item.value, 0),
        items: sourceItems,
        insights: [
          { label: "来源结构", text: "监管、公告和企业新闻稿适合确认事实，产业媒体适合补充背景和趋势。" },
          { label: "核验顺序", text: "涉及交易、审批、医保或临床结果时，优先回到官方渠道确认。" },
          { label: "规则优化", text: "低质量来源连续命中但不入报时，应进入来源降权清单。" }
        ]
      },
      topics: {
        chartType: "donut",
        title: "主题结构",
        suffix: "%",
        total: topicItems.reduce((sum, item) => sum + item.value, 0),
        items: topicItems,
        insights: [
          { label: "主题集中度", text: "BD、监管、商业化和融资主题适合作为日报主线，会议报道只作补充线索。" },
          { label: "选题延展", text: "重复出现的主题可进一步沉淀为专栏、客户跟进清单或研究议题。" },
          { label: "避免偏科", text: "单一主题占比过高时，运营需要检查关键词是否过窄。" }
        ]
      },
      feedback: {
        chartType: "donut",
        title: "用户反馈类型分布",
        suffix: "%",
        total: feedbackItems.reduce((sum, item) => sum + item.value, 0),
        items: feedbackItems,
        insights: [
          { label: "保留信号", text: "重点关注和可做选题代表内容继续保留或上调优先级。" },
          { label: "降权信号", text: "无需关注不直接覆盖规则，先累计到复盘记录中再判断是否降权。" },
          { label: "复核信号", text: "待复核反馈用于调整主题词、排除词和来源优先级。" }
        ]
      }
    }
  };
}

function countBy(items, getter) {
  return items.reduce((acc, item) => {
    const key = getter(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function toDistribution(map, total, unit) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({
      label,
      value: Math.max(1, Math.round((count / Math.max(total, 1)) * 100)),
      note: `${count} ${unit}`
    }));
}

function normalizeSourceType(source) {
  if (source.includes("CDE") || source.includes("医保") || source.includes("局") || source.includes("公开信息")) return "监管/政务公开";
  if (source.includes("公告") || source.includes("港交所") || source.includes("上市")) return "上市公司公告";
  if (source.includes("企业") || source.includes("官网") || source.includes("新闻稿")) return "企业官网/新闻稿";
  if (source.includes("会议")) return "会议/协会发布";
  return "行业媒体";
}

function getVisibleItems() {
  return state.items.filter((item) => {
    const matchFilter = state.filter === "全部" || item.category === state.filter;
    const haystack = `${item.title} ${item.source} ${item.company} ${item.category}`.toLowerCase();
    const matchSearch = !state.search || haystack.includes(state.search);
    const matchVerify = !state.verifyOnly || item.risk === "待核验";
    return matchFilter && matchSearch && matchVerify;
  });
}

function renderList() {
  const visible = getVisibleItems();
  const pageItems = getPageItems(visible, "candidates");
  nodes.newsList.innerHTML = "";
  document.querySelector("#visibleCountText").textContent = `共 ${visible.length} 条`;
  updatePager("candidate", "candidates", visible.length);

  if (!visible.length) {
    nodes.newsList.innerHTML = '<div class="empty-row"><strong>没有匹配候选</strong><span>可以调整分类、搜索词或核验筛选条件。</span></div>';
    return;
  }

  pageItems.forEach((item) => {
    const row = document.createElement("article");
    row.className = `news-row ${item.id === state.selectedId ? "selected" : ""}`;
    row.innerHTML = `
      <input type="checkbox" ${state.digestIds.has(item.id) ? "checked" : ""} data-digest="${item.id}" aria-label="加入日报" />
      <span class="row-id">${item.id}</span>
      <div class="title-cell">
        <span class="badge ${getCategoryClass(item.category)}">${item.category}</span>
        <button type="button" data-select="${item.id}">${item.title}</button>
      </div>
      <span>${item.source}</span>
      <span class="badge ${getStatusClass(item.status)}">${item.status}</span>
      <span class="badge ${item.risk === "待核验" ? "badge-risk" : "badge-good"}">${item.risk}</span>
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
  nodes.newsList.querySelectorAll("[data-digest]").forEach((button) => button.addEventListener("click", () => toggleDigest(button.dataset.digest)));

  const eligible = pageItems.filter((item) => item.score >= 4 && item.status !== "不推送");
  document.querySelector("#selectAllDigest").checked = eligible.length > 0 && eligible.every((item) => state.digestIds.has(item.id));
}

function renderDetail() {
  const item = state.items.find((entry) => entry.id === state.selectedId);
  if (!item) {
    nodes.detailView.innerHTML = "<p>请选择一条资讯查看详情。</p>";
    return;
  }
  const reaction = state.reactions[item.id] || "";
  nodes.detailView.innerHTML = `
    <h3>${item.title}</h3>
    <div class="detail-meta">
      <span class="badge ${getCategoryClass(item.category)}">${item.category}</span>
      <span class="badge ${getStatusClass(item.status)}">${item.status}</span>
      <span class="badge ${item.risk === "待核验" ? "badge-risk" : "badge-good"}">${item.risk}</span>
      <span class="badge badge-low">评分 ${item.score}</span>
    </div>
    <div class="summary-box"><strong>运营摘要：</strong>${item.summary}</div>
    <div class="summary-box"><strong>选题角度：</strong>${item.contentAngle}</div>
    ${item.verifyReason ? `<div class="verify-box"><strong>核验原因：</strong>${item.verifyReason}</div>` : ""}
    <div class="summary-box"><strong>处理建议：</strong>${item.recommendedAction}</div>
    <p class="source-line"><strong>原始来源：</strong><a class="source-link" href="${item.url}" target="_blank" rel="noopener noreferrer">${item.source}</a></p>
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
      toast("反馈已记录");
      renderDetail();
      renderFeedback();
    });
  });
}

function renderDigest() {
  const picked = state.items.filter((item) => state.digestIds.has(item.id));
  const pageItems = getPageItems(picked, "digest");
  nodes.digestCount.textContent = `${picked.length} 条`;
  document.querySelector("#selectedCount").textContent = picked.length;
  document.querySelector("#tableFooterText").textContent = `${picked.length} 条入选日报`;
  document.querySelector("#bulkBar").classList.toggle("show", picked.length > 0);
  document.querySelector("#digestFooterText").textContent = `共 ${picked.length} 条`;
  updatePager("digest", "digest", picked.length);
  nodes.digestPreview.textContent = buildDigestText();
  renderDigestItems(pageItems, (state.pages.digest - 1) * pageSize.digest);
}

function renderDigestItems(items, offset = 0) {
  const container = document.querySelector("#digestItemsList");
  if (!items.length) {
    container.innerHTML = '<div class="empty-row"><strong>尚未选择资讯</strong><span>回到候选页，将合适资讯加入日报。</span></div>';
    return;
  }
  container.innerHTML = items.map((item, index) => `
    <article class="digest-item">
      <strong>${offset + index + 1}. ${item.title}</strong>
      <span>${item.source} / ${item.category} / 评分 ${item.score}</span>
      <small>${item.recommendedAction}</small>
    </article>
  `).join("");
}

function renderFeedback() {
  const feedbackItems = buildFeedbackItems();
  const reactions = Object.values(state.reactions);
  const positive = reactions.filter((value) => value === "like" || value === "topic").length;
  const negative = reactions.filter((value) => value === "skip").length;
  document.querySelector("#feedbackTotal").textContent = reactions.length;
  document.querySelector("#feedbackPositive").textContent = positive;
  document.querySelector("#feedbackNegative").textContent = negative;
  document.querySelector("#feedbackReview").textContent = feedbackItems.filter((item) => item.status === "待复核").length;

  const adjusted = { ...categoryWeights };
  state.items.forEach((item) => {
    const reaction = state.reactions[item.id];
    if (reaction === "like") adjusted[item.category] = Math.min(100, (adjusted[item.category] || 50) + 5);
    if (reaction === "topic") adjusted[item.category] = Math.min(100, (adjusted[item.category] || 50) + 3);
    if (reaction === "skip") adjusted[item.category] = Math.max(0, (adjusted[item.category] || 50) - 8);
  });

  nodes.preferenceBars.innerHTML = Object.entries(adjusted)
    .filter(([category]) => category !== "会议报道")
    .sort((a, b) => b[1] - a[1])
    .map(([category, value]) => `
      <article class="priority-card" style="--score:${value}%">
        <div>
          <h3>${category}</h3>
          <p>${getPriorityLabel(value)}</p>
        </div>
        <strong>${value}</strong>
        <span class="priority-meter"><i></i></span>
      </article>
    `).join("");

  nodes.learningLog.innerHTML = `
    <strong>本轮判断</strong>
    <span>${positive ? "正向反馈集中在高确定性产业事件，优先保持当前主题顺序。" : "尚未形成足够反馈，继续观察。"}${negative ? " 已出现降权信号，相关主题暂不自动上调。" : ""}</span>
  `;

  nodes.feedbackInsights.innerHTML = [
    ["保留", "BD/授权/出海与审评审批仍是日报核心入口。"],
    ["调整", "会议报道只作为线索池，不默认进入推送清单。"],
    ["补充", "商业化/医保类资讯需要补齐地区、支付范围和原始来源。"],
    ["观察", "融资并购主题需要区分金额确认、投资方确认和公司口径。"]
  ].map(([label, text]) => `<article><b>${label}</b><span>${text}</span></article>`).join("");

  const pageItems = getPageItems(feedbackItems, "feedback");
  updatePager("feedback", "feedback", feedbackItems.length);
  document.querySelector("#feedbackFooterText").textContent = `共 ${feedbackItems.length} 条`;
  nodes.feedbackLogList.innerHTML = pageItems.map((item) => `
    <article class="feedback-log-item">
      <div><strong>${item.topic}</strong><small>反馈主题</small></div>
      <div><strong>${item.title}</strong><small>${item.action}</small></div>
      <span>${item.status === "待复核" ? "需要检查规则影响，确认后再调整优先级。" : "已进入本地复盘记录，用于下次候选排序参考。"}</span>
      <strong class="reaction ${item.status === "待复核" ? "badge-risk" : "badge-good"}">${item.status}</strong>
    </article>
  `).join("");
}

function buildFeedbackItems() {
  const userFeedback = Object.entries(state.reactions).map(([id, reaction]) => {
    const item = state.items.find((entry) => entry.id === id);
    return {
      title: item ? item.title : id,
      topic: item ? item.category : "未归类",
      action: reactionLabel(reaction),
      status: reaction === "skip" ? "待复核" : "已记录"
    };
  });
  return [
    ...userFeedback,
    { title: "ADC 出海授权类信息连续入选", topic: "BD/授权/出海", action: "维持高优先级", status: "已记录" },
    { title: "会议趋势报道缺少具体产业事件", topic: "会议报道", action: "维持降权", status: "已记录" },
    { title: "医保支付线索需要补充地区范围", topic: "商业化/医保", action: "补充字段", status: "待复核" },
    { title: "融资事件需要核对金额与投资方", topic: "融资并购", action: "增加核验项", status: "待复核" },
    { title: "上市公司公告保留为高可信来源", topic: "上市公司公告", action: "维持来源等级", status: "已记录" }
  ];
}

function renderRules() {
  renderRuleChips(nodes.priorityRules, "priority");
  renderRuleChips(nodes.mutedRules, "muted");
  const pageItems = getPageItems(state.rules.sources, "sourceRules");
  updatePager("sourceRule", "sourceRules", state.rules.sources.length);
  document.querySelector("#sourceRuleFooterText").textContent = `共 ${state.rules.sources.length} 条`;
  const offset = (state.pages.sourceRules - 1) * pageSize.sourceRules;
  nodes.sourceRules.innerHTML = pageItems.map((source, localIndex) => {
    const index = offset + localIndex;
    return `
      <div>
        <input value="${escapeHtml(source.name)}" data-source-field="name" data-source-index="${index}" aria-label="来源名称" />
        <select data-source-field="level" data-source-index="${index}" aria-label="来源等级">
          ${["高", "中高", "中", "低"].map((level) => `<option value="${level}" ${level === source.level ? "selected" : ""}>${level}</option>`).join("")}
        </select>
        <input value="${escapeHtml(source.note)}" data-source-field="note" data-source-index="${index}" aria-label="适用场景" />
        <button type="button" data-remove-source="${index}">删除</button>
      </div>
    `;
  }).join("");
  nodes.sourceRules.querySelectorAll("[data-source-field]").forEach((field) => {
    field.addEventListener("change", () => {
      const index = Number(field.dataset.sourceIndex);
      state.rules.sources[index][field.dataset.sourceField] = field.value.trim();
      persistRules();
      toast("来源规则已更新");
    });
  });
  nodes.sourceRules.querySelectorAll("[data-remove-source]").forEach((button) => {
    button.addEventListener("click", () => {
      state.rules.sources.splice(Number(button.dataset.removeSource), 1);
      persistRules();
      renderRules();
      toast("来源规则已删除");
    });
  });
}

function renderHistory() {
  const picked = state.items.filter((item) => state.digestIds.has(item.id));
  const verifyCount = picked.filter((item) => item.risk === "待核验").length;
  const selectedRecipient = state.recipients.find((recipient) => recipient.email === state.selectedRecipient) || state.recipients[0];
  historyRecords[0].count = picked.length;
  historyRecords[0].verify = verifyCount;
  historyRecords[0].recipient = selectedRecipient.name;

  nodes.recipientSelect.innerHTML = state.recipients.map((recipient) => `
    <option value="${recipient.email}" ${recipient.email === state.selectedRecipient ? "selected" : ""}>
      ${recipient.name} · ${recipient.email}
    </option>
  `).join("");
  document.querySelector("#sendDigestCount").textContent = `${picked.length} 条`;
  nodes.sendSummary.innerHTML = `
    <span><b>${picked.length}</b> 条入选日报</span>
    <span><b>${verifyCount}</b> 条待发前核验</span>
    <span><b>${selectedRecipient.name}</b> ${selectedRecipient.email}</span>
    <span>推送后会写入下方记录，并记住本次收件人。</span>
  `;

  const records = [...state.pushHistory, ...historyRecords];
  const pageItems = getPageItems(records, "history");
  updatePager("history", "history", records.length);
  document.querySelector("#historyFooterText").textContent = `共 ${records.length} 条`;
  nodes.historyList.innerHTML = pageItems.map((record) => `
    <div><span>${record.date}</span><b>${record.title}</b><span>${record.recipient}</span><span>${record.count}</span><span>${record.verify}</span><span class="badge ${record.status === "待推送" ? "badge-risk" : "badge-good"}">${record.status}</span></div>
  `).join("");
}

function renderRuleChips(container, type) {
  container.innerHTML = state.rules[type].map((rule, index) => `
    <span>
      <input value="${escapeHtml(rule)}" data-rule-type="${type}" data-rule-index="${index}" aria-label="规则内容" />
      <button type="button" data-remove-rule="${type}:${index}" aria-label="删除 ${escapeHtml(rule)}">×</button>
    </span>
  `).join("");
  container.querySelectorAll("[data-rule-type]").forEach((input) => {
    input.addEventListener("change", () => {
      const index = Number(input.dataset.ruleIndex);
      const value = input.value.trim();
      if (!value) state.rules[input.dataset.ruleType].splice(index, 1);
      else state.rules[input.dataset.ruleType][index] = value;
      persistRules();
      renderRules();
      toast("规则已更新");
    });
  });
  container.querySelectorAll("[data-remove-rule]").forEach((button) => {
    button.addEventListener("click", () => {
      const [ruleType, ruleIndex] = button.dataset.removeRule.split(":");
      state.rules[ruleType].splice(Number(ruleIndex), 1);
      persistRules();
      renderRules();
      toast("规则已删除");
    });
  });
}

function addRule(type, inputSelector) {
  const input = document.querySelector(inputSelector);
  const value = input.value.trim();
  if (!value) return toast("请先输入规则内容");
  if (state.rules[type].includes(value)) return toast("这条规则已存在");
  state.rules[type].push(value);
  input.value = "";
  persistRules();
  renderRules();
  toast("规则已添加");
}

function addSourceRule() {
  const nameInput = document.querySelector("#sourceNameInput");
  const levelInput = document.querySelector("#sourceLevelInput");
  const noteInput = document.querySelector("#sourceNoteInput");
  const name = nameInput.value.trim();
  const note = noteInput.value.trim();
  if (!name || !note) return toast("请补全来源名称和适用场景");
  state.rules.sources.push({ name, level: levelInput.value, note });
  nameInput.value = "";
  noteInput.value = "";
  state.pages.sourceRules = Math.ceil(state.rules.sources.length / pageSize.sourceRules);
  persistRules();
  renderRules();
  toast("来源规则已添加");
}

function addRecipient() {
  const nameInput = document.querySelector("#recipientNameInput");
  const emailInput = document.querySelector("#recipientEmailInput");
  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  if (!name || !email) return toast("请补全收件人名称和邮箱");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast("请输入有效邮箱");
  if (state.recipients.some((recipient) => recipient.email === email)) return toast("这个邮箱已在推送人列表中");
  state.recipients.push({ name, email });
  state.selectedRecipient = email;
  persistRecipients();
  localStorage.setItem("selectedRecipient", email);
  nameInput.value = "";
  emailInput.value = "";
  renderHistory();
  toast("已新增推送人");
}

function sendDigest() {
  const picked = state.items.filter((item) => state.digestIds.has(item.id));
  if (!picked.length) return toast("请先在候选资讯中选择要推送的内容");
  const recipient = state.recipients.find((entry) => entry.email === state.selectedRecipient) || state.recipients[0];
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  state.pushHistory.unshift({
    date,
    title: "生物医药产业资讯简报",
    recipient: recipient.name,
    count: picked.length,
    verify: picked.filter((item) => item.risk === "待核验").length,
    status: "已推送"
  });
  state.pages.history = 1;
  persistPushHistory();
  localStorage.setItem("selectedRecipient", recipient.email);
  renderHistory();
  toast(`已记录推送给 ${recipient.name}`);
}

function toggleDigest(id) {
  if (state.digestIds.has(id)) {
    state.digestIds.delete(id);
    toast("已从日报移出");
  } else {
    state.digestIds.add(id);
    toast("已加入日报");
  }
  persistDigest();
  renderList();
  renderDigest();
  renderMetrics();
}

function mutateDigestItems(mutator, message) {
  state.items.forEach((item) => {
    if (state.digestIds.has(item.id)) mutator(item);
  });
  render();
  toast(message);
}

function buildDigestText() {
  const picked = state.items.filter((item) => state.digestIds.has(item.id));
  if (!picked.length) return "今日暂无重点资讯。";
  const verifyItems = picked.filter((item) => item.risk === "待核验");
  const normalItems = picked.filter((item) => item.risk !== "待核验");
  const topicItems = picked.filter((item) => item.topicReady);
  const lines = ["【生物医药产业资讯简报】", "", "一、重点资讯"];
  normalItems.forEach((item, index) => {
    lines.push("", `${index + 1}. ${item.title}`, `来源：${item.source}`, `时间：${item.date}`, `类别：${item.category}`, `摘要：${item.summary}`, item.verifyReason ? `核验说明：${item.verifyReason}` : "核验说明：暂无高风险事实标记。", `原始来源：${item.url}`);
  });
  if (!normalItems.length) lines.push("", "暂无已完成核验的重点资讯。");
  lines.push("", "二、可展开选题");
  topicItems.forEach((item, index) => lines.push("", `选题 ${index + 1}：${item.contentAngle}`, `关联资讯：${item.title}`, `建议动作：${item.recommendedAction}`));
  if (!topicItems.length) lines.push("", "暂无可展开选题。");
  lines.push("", "三、待核验信息");
  verifyItems.forEach((item, index) => lines.push("", `${index + 1}. ${item.title}`, `来源：${item.source}`, `链接：${item.url}`, `核验原因：${item.verifyReason || "需补充核验原因"}`));
  if (!verifyItems.length) lines.push("", "暂无待核验信息。");
  lines.push("", "四、今日统计", `入选日报：${picked.length} 条`, `待核验：${verifyItems.length} 条`, `选题线索：${topicItems.length} 条`);
  return lines.join("\n");
}

async function copyDigestText() {
  try {
    await navigator.clipboard.writeText(buildDigestText());
    toast("日报文本已复制");
  } catch {
    toast("浏览器限制复制，请在日报预览中手动选择文本");
  }
}

function downloadDigestText() {
  const blob = new Blob([buildDigestText()], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "biomed-digest-demo.txt";
  link.click();
  URL.revokeObjectURL(link.href);
  toast("TXT 草稿已生成");
}

function getCategoryClass(category) {
  if (category === "BD/授权/出海" || category === "商业化/医保") return "badge-bd";
  if (category === "NMPA/CDE") return "badge-review";
  if (category === "融资并购") return "badge-finance";
  if (category === "上市公司公告") return "badge-announcement";
  return "badge-low";
}

function getStatusClass(status) {
  if (status === "建议推送" || status === "可发布") return "badge-good";
  if (status === "待确认") return "badge-risk";
  return "badge-low";
}

function getPriorityLabel(value) {
  if (value >= 90) return "优先处理";
  if (value >= 80) return "稳定关注";
  if (value >= 70) return "条件入选";
  return "低频观察";
}

function reactionLabel(value) {
  return ({ like: "重点关注", topic: "可做选题", skip: "无需关注" })[value] || "已记录";
}

function persistDigest() {
  localStorage.setItem("digestIds", JSON.stringify([...state.digestIds]));
}

function persistRules() {
  localStorage.setItem("radarRules", JSON.stringify(state.rules));
}

function persistRecipients() {
  localStorage.setItem("radarRecipients", JSON.stringify(state.recipients));
}

function persistPushHistory() {
  localStorage.setItem("radarPushHistory", JSON.stringify(state.pushHistory));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function toast(message) {
  nodes.toast.textContent = message;
  nodes.toast.classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => nodes.toast.classList.remove("show"), 1800);
}

init();


