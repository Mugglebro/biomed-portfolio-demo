"use client";

export function PreferenceChips({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() =>
              onChange(active ? selected.filter((item) => item !== option) : [...selected, option])
            }
            className={`rounded-full border px-3 py-2 text-sm font-medium ${
              active
                ? "border-teal-600 bg-teal-50 text-teal-800"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-teal-600"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
