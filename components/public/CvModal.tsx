"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function CvModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6" onClick={() => setIsOpen(false)}>
          <div 
            className="w-full max-w-5xl h-[85vh] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/10 px-4 py-3 bg-[#f7f7f4]">
              <h2 className="text-sm font-semibold">Curriculum Vitae (ATS Preview)</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1.5 transition hover:bg-black/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <iframe 
              src="/preview-resume" 
              className="w-full flex-1 bg-[#525659]"
              title="CV Preview"
            />
          </div>
        </div>
      )}
    </>
  );
}
