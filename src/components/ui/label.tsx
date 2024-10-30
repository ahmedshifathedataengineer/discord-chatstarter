import * as React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, ...props }, ref) => (
    <label ref={ref} className="label" {...props}>
      {children}
    </label>
  ),
);

Label.displayName = "Label";
