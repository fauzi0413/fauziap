"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button 
      onClick={() => window.print()}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full shadow-lg print:hidden"
    >
      <Printer className="h-5 w-5" />
      Cetak PDF
    </Button>
  );
}
