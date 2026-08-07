"use client";

export function ListPagination({
  total,
  pageSize,
  currentPage,
  onPageChange,
}: {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (page) => page === 1 || page === pageCount || Math.abs(page - currentPage) <= 1,
  );

  function goToPage(page: number) {
    onPageChange(Math.min(pageCount, Math.max(1, page)));
  }

  if (total <= pageSize) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-200 bg-white px-4 py-4 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between md:px-5">
      <span>
        共 {total} 条 · 第 {currentPage} / {pageCount} 页
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
          className="h-9 rounded-md border border-zinc-200 px-3 font-medium text-zinc-600 transition hover:border-teal-600 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          上一页
        </button>
        {pages.map((page, index) => {
          const previous = pages[index - 1];
          return (
            <span key={page} className="inline-flex items-center gap-2">
              {previous && page - previous > 1 ? <span className="text-zinc-300">...</span> : null}
              <button
                type="button"
                onClick={() => goToPage(page)}
                className={`h-9 min-w-9 rounded-md border px-3 font-medium ${
                  page === currentPage
                    ? "border-teal-700 bg-teal-700 text-white"
                    : "border-zinc-200 text-zinc-600 hover:border-teal-600 hover:text-teal-700"
                }`}
              >
                {page}
              </button>
            </span>
          );
        })}
        <button
          type="button"
          disabled={currentPage >= pageCount}
          onClick={() => goToPage(currentPage + 1)}
          className="h-9 rounded-md border border-zinc-200 px-3 font-medium text-zinc-600 transition hover:border-teal-600 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          下一页
        </button>
        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const input = event.currentTarget.elements.namedItem("page") as HTMLInputElement | null;
            const value = Number(input?.value);
            if (Number.isFinite(value)) goToPage(value);
          }}
        >
          <span>跳至</span>
          <input
            name="page"
            type="number"
            min={1}
            max={pageCount}
            placeholder="页码"
            className="h-9 w-20 rounded-md border border-zinc-200 px-2 text-center text-sm text-zinc-700 outline-none focus:border-teal-700"
          />
          <span>页</span>
          <button
            type="submit"
            className="h-9 rounded-md border border-zinc-200 px-3 font-medium text-zinc-600 hover:border-teal-600 hover:text-teal-700"
          >
            跳转
          </button>
        </form>
      </div>
    </div>
  );
}
