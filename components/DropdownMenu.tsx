"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { DropdownMenuProps } from "@/types/types";

export default function DropdownMenu({
  value,
  options,
  onChange,
}: DropdownMenuProps) {
  // Tracks open/closed dropdown state
  const [open, setOpen] = useState(false);

  // Ref used to detect outside clicks
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Find the currently selected option by value
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    // Close dropdown when user clicks outside of it
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
      {/* Dropdown trigger button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-left text-xs text-slate-800 transition hover:border-slate-300 focus:border-black"
      >
        <span className="truncate">{selected?.label}</span>

        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown options */}
      {open && (
        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-xs text-slate-800 transition hover:bg-slate-50"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}