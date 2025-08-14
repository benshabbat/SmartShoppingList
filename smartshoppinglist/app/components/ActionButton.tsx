/**
 * Centralized action buttons component following DRY principles
 */

import { getButtonClasses, CSS_CONSTANTS } from "../utils";
import { ActionButtonProps } from "../types";

export const ActionButton = ({
  onClick,
  icon: Icon,
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  iconSize = 16,
}: ActionButtonProps) => {
  const buttonClass = getButtonClasses(variant, size, disabled || loading);

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${buttonClass} ${className} flex items-center ${CSS_CONSTANTS.GAP.SMALL}`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
      ) : (
        Icon ? <Icon size={iconSize} /> : null
      )}
      {children}
    </button>
  );
};


