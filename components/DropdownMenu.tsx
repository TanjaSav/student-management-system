"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type DropdownMenuProps = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

export default function DropdownMenu({
  value,
  options,
  onChange,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-full rounded-xl border border-slate-200 px-4 py-2 text-sm
          text-left text-slate-800 bg-white
          flex items-center justify-between
          transition hover:border-slate-300 focus:border-emerald-500
        "
      >
        <span>{selected?.label}</span>

        <ChevronDown
          className={`h-5 w-5 text-slate-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-20 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-slate-800 cursor-pointer transition hover:bg-slate-50"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}