"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

interface FilterDropdownProps {
  label?: string; // 상단에 보여줄 기본 라벨(선택 전)
  options?: Option[]; // 옵션 목록
  defaultValue?: string; // 기본 선택 value
  onChange?: (value: string) => void;
  className?: string;
}

export default function FilterDropdown({ label = "전체", options, defaultValue = "all", onChange, className = "" }: FilterDropdownProps) {
  const defaultOptions = useMemo<Option[]>(
    () => [
      { label: "전체", value: "all" },
      { label: "지게차 / 중장비", value: "heavy" },
      { label: "탑라이트 / 표시기", value: "toplight" },
      { label: "음성경보장치 / 스피커", value: "speaker" },
      { label: "이동식 에어컨 / 냉각팬", value: "cooling" },
      { label: "카메라 외 기타", value: "etc" },
    ],
    []
  );

  const items = options?.length ? options : defaultOptions;

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option>(items.find((o) => o.value === defaultValue) ?? items[0]);

  const wrapRef = useRef<HTMLDivElement | null>(null);

  // 바깥 클릭 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // options가 바뀌었을 때 selected 보정
  useEffect(() => {
    const next = items.find((o) => o.value === selected.value);
    if (!next) setSelected(items[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const handleSelect = (opt: Option) => {
    setSelected(opt);
    setOpen(false);
    onChange?.(opt.value);
  };

  return (
    <div ref={wrapRef} className={`relative mb-8 md:mb-24 inline-block ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-[200px] md:min-w-[240px] h-[40px] md:h-[62px] px-3 rounded-md border border-gray-300 bg-white
                   flex items-center justify-between text-lg text text-gray-800
                   shadow-sm hover:border-gray-400"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate ml-4">{selected?.label || label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 mt-2 w-[200px] md:w-[240px] rounded-md border border-gray-300 bg-white shadow-lg overflow-hidden z-50" role="listbox">
          {items.map((opt) => {
            const active = opt.value === selected.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-4 py-4 text-lg border-b-2
                  ${active ? "bg-slate-700 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                role="option"
                aria-selected={active}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
