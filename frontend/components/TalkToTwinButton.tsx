"use client";

import { useState, type ReactNode } from "react";
import ChatModal from "./ChatModal";

export default function TalkToTwinButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      {open && <ChatModal onClose={() => setOpen(false)} />}
    </>
  );
}
