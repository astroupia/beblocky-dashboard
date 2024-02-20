"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    value: string;
    src?: string;

}

export async function copyToClipboardWithMeta(value: string, _meta?: Record<string, unknown>) {
    navigator.clipboard.writeText(value);
}

export function CopyButton({ value, className, src, children, ...props }: CopyButtonProps) {
    const [hasCopied, setHasCopied] = React.useState(false);

    React.useEffect(() => {
        setTimeout(() => {
            setHasCopied(false);
        }, 2000);
    }, [hasCopied]);

    return (
        <button
            type="button"
            className={cn(
                "relative z-20 inline-flex h-8 gap-2 px-2 bg-zinc-50 items-center justify-center rounded-md border-zinc-200 p-2 text-sm font-medium text-zinc-900 transition-all hover:bg-zinc-100 focus:outline-none dark:text-zinc-100 dark:hover:bg-zinc-800",
                className,
            )}
            onClick={() => {
                copyToClipboardWithMeta(value, {
                    component: src,
                });
                setHasCopied(true);
            }}
            {...props}
        >
            {hasCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {children || "Copy"}
        </button>
    );
}
