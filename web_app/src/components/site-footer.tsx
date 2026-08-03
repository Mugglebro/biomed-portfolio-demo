import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-6 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr]">
        <div>
          <div className="text-2xl font-bold tracking-tight text-zinc-950">
            BioEvent <span className="text-teal-700">Intelligence</span>
          </div>
          <p className="mt-6 max-w-md text-sm leading-7 text-zinc-500">
            面向生物医疗产业研究、BD 拓展与内容运营的公开活动情报演示项目。
          </p>
          <div className="mt-8 flex gap-6 text-sm font-medium text-zinc-500">
            <span>LinkedIn</span>
            <span>微信公众号</span>
            <span>订阅简报</span>
          </div>
        </div>
        <FooterGroup
          title="导航"
          items={[
            ["活动检索", "/app"],
            ["行业日历", "/calendar"],
            ["我的活动", "/my-events"],
          ]}
        />
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-950">
            数据
          </h2>
          <div className="mt-6 space-y-4 text-sm text-zinc-500">
            <p>脱敏演示快照</p>
            <p>多来源聚合</p>
            <p>更新记录</p>
          </div>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-950">
            语言
          </h2>
          <div className="mt-6 border-b border-zinc-400 pb-2 text-sm font-medium text-zinc-950">
            简体中文 / 中国
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl justify-between border-t border-zinc-100 px-4 py-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-300 md:px-6">
        <span>2026 BioEvent Intelligence</span>
        <span>Demo Portfolio Build</span>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  items,
}: {
  title: string;
  items: Array<[string, string]>;
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-950">
        {title}
      </h2>
      <div className="mt-6 space-y-4">
        {items.map(([label, href]) => (
          <Link key={href} href={href} className="block text-sm text-zinc-500 hover:text-teal-700">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
