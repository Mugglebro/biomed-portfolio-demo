import Link from "next/link";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f7faf9] px-5 py-12">
      <div className="mx-auto grid min-h-[calc(100vh-96px)] max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_0.8fr]">
        <section className="hidden lg:block">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-zinc-950">
            BioEvent <span className="text-teal-700">Intelligence</span>
          </Link>
          <h1 className="mt-16 max-w-2xl text-[64px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
            生物医疗活动线索管理工具
          </h1>
          <p className="mt-8 max-w-xl text-xl leading-9 text-zinc-600">
            整理会议、论坛、展会、沙龙等公开活动信息，形成可检索、可追溯、可跟进的活动记录。
          </p>
        </section>

        <section className="border border-zinc-200 bg-white p-8 shadow-sm md:p-10">
          <Link href="/" className="text-xl font-semibold tracking-tight text-zinc-950 lg:hidden">
            BioEvent <span className="text-teal-700">Intelligence</span>
          </Link>
          <div className="mt-4 lg:mt-0">
            <h2 className="text-[34px] font-semibold tracking-[-0.035em] text-zinc-950">{title}</h2>
            <p className="mt-3 text-base leading-7 text-zinc-600">{description}</p>
          </div>
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-7 border-t border-zinc-100 pt-6">{footer}</div> : null}
        </section>
      </div>
    </main>
  );
}
