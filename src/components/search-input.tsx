import { useRef } from "react";

interface Props {
  onSearchTermChange: (term: string) => void;
  inputPlaceholder: string;
}

export default function SearchInput({
  onSearchTermChange,
  inputPlaceholder,
}: Props) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="relative mt-2">
      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
        <button
          type="submit"
          className="focus:shadow-outline p-1 focus:outline-none"
        >
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            className="h-6 w-6 text-dark-ebony"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
      </span>
      <input
        ref={ref}
        onChange={() => ref.current && onSearchTermChange(ref.current.value)}
        type="search"
        name="q"
        className="rounded-lg bg-blue-50 py-2 pl-10 text-sm focus:outline-none"
        placeholder={inputPlaceholder}
      />
    </div>
  );
}
