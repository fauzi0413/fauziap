"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function CvModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between border-b border-black/10 px-4 py-3 bg-[#f7f7f4] shrink-0">
        <h2 className="text-sm font-semibold text-black">Curriculum Vitae (ATS Preview)</h2>
        <button 
          onClick={() => setIsOpen(false)}
          className="rounded-md p-1.5 transition hover:bg-black/10"
        >
          <X className="h-4 w-4 text-black" />
        </button>
      </div>
      <iframe 
        src="/preview-resume" 
        className="w-full h-full flex-1 border-0 bg-[#525659]"
        title="CV Preview"
      />
    </div>
  );

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>
      {mounted && isOpen ? createPortal(modalContent, document.body) : null}
    </>
  );
}
