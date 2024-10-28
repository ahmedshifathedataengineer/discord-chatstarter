import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

// Dialog Root Component
export const Dialog = DialogPrimitive.Root;

// Trigger to open dialog
export const DialogTrigger = DialogPrimitive.Trigger;

// Content of the dialog
export const DialogContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>(
  (props, ref) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="dialog-overlay" />
      <DialogPrimitive.Content ref={ref} className="dialog-content" {...props} />
    </DialogPrimitive.Portal>
  )
);

DialogContent.displayName = "DialogContent";

// Header Component for Dialog
export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="dialog-header">{children}</div>
);

// Footer Component for Dialog
export const DialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="dialog-footer">{children}</div>
);

// Dialog Title Component
export const DialogTitle = DialogPrimitive.Title;

// Dialog Description Component
export const DialogDescription = DialogPrimitive.Description;
