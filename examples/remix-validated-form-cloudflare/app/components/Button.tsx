import classNames from "classnames";
import { cloneElement, forwardRef, ReactElement } from "react";

const variantStyles = {
  primary: "button-primary",
  secondary: "button-secondary",
  tertiary: "button-tertiary",
  destructiveSecondary: "button-destructive-secondary",
  destructivePrimary: "button-destructive-primary",
  custom: "",
} as const;

const buttonStyles = (
  variant: keyof typeof variantStyles,
  className?: string
) => classNames("button-base", variantStyles[variant], className);

export type ButtonProps = {
  label: string;
  variant?: keyof typeof variantStyles;
  icon?: ReactElement;
  rightIcon?: ReactElement;
} & JSX.IntrinsicElements["button"];

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      disabled,
      label,
      icon,
      rightIcon,
      ...rest
    },
    ref
  ) => (
    <button
      className={buttonStyles(variant, className)}
      type="button"
      disabled={disabled}
      ref={ref}
      {...rest}
    >
      {icon && cloneElement(icon, { className: "h-4 w-4 mr-2" })}
      {label}
      {rightIcon &&
        cloneElement(rightIcon, {
          className: "h-4 w-4 ml-2",
        })}
    </button>
  )
);
