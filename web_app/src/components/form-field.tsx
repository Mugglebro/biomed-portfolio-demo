export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
      {label}
      {children}
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}

export const inputClass =
  "h-11 rounded-none border-0 border-b border-zinc-200 bg-white px-0 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-300 focus:border-teal-700";
