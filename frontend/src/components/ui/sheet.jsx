"use client";
import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetContent = React.forwardRef(({ className, side = "right", ...props }, ref) => (
  <SheetPrimitive.Portal>
    <SheetPrimitive.Overlay className="fixed inset-0 bg-black/50" />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        "fixed top-0 bottom-0 z-50 bg-white shadow-lg transition-transform",
        side === "left" ? "left-0 w-64" : "right-0 w-64",
        className
      )}
      {...props}
    />
  </SheetPrimitive.Portal>
));
SheetContent.displayName = "SheetContent";

export { Sheet, SheetTrigger, SheetContent };
