"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardCopy } from "lucide-react";

export default function CopyUrlComponent({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <Input
          type="text"
          readOnly
          value={url}
          onClick={(e) => (e.target as HTMLInputElement).select()}
          className="pr-10"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
          onClick={copyToClipboard}
          aria-label="Copy to clipboard"
        >
          <ClipboardCopy className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={copyToClipboard}
        className="whitespace-nowrap"
      >
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  );
}
