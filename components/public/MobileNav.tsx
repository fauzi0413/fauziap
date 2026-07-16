"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

export function MobileNav({ items }: { items: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 -mr-2 text-black/60 hover:text-black transition flex items-center justify-center"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#f7f7f4] border-b border-black/10 p-5 shadow-lg flex flex-col gap-4 z-[60]">
          {items.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              onClick={() => setIsOpen(false)}
              className={`text-base font-medium transition ${
                pathname === item.href ? "text-black font-semibold" : "text-black/60 hover:text-black"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
