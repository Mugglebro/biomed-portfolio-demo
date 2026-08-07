import { ExternalLink } from "lucide-react";
import { withBasePath } from "@/lib/paths";

export function ExternalRegistration({ url }: { url: string }) {
  const resolvedUrl = withBasePath(url);

  return (
    <div className="border border-teal-100 bg-teal-50/60 p-5">
      <a
        href={resolvedUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800"
      >
        前往原始报名页面
        <ExternalLink className="size-4" />
      </a>
      <p className="mt-4 text-sm leading-6 text-teal-900">
        将跳转至主办方或原始发布渠道，报名结果以对方页面为准。
      </p>
      <details className="group mt-3 text-sm text-zinc-600">
        <summary className="cursor-pointer list-none font-medium text-teal-700">
          查看跳转说明
          <span className="ml-2 text-zinc-400 group-open:hidden">展开</span>
          <span className="ml-2 hidden text-zinc-400 group-open:inline">收起</span>
        </summary>
        <div className="mt-3 space-y-2 border-t border-teal-100 pt-3 leading-6">
          <p>作品集演示中使用脱敏预览页，不收集报名信息。</p>
          <p>真实产品会记录跳转来源，便于后续追踪活动转化。</p>
        </div>
      </details>
    </div>
  );
}
