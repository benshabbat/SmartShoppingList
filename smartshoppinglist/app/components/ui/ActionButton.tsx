/**
 * Centralized action buttons component following DRY principles
 * Enhanced with accessibility features
 */

import { getButtonClasses, CSS_CONSTANTS } from "../../utils";
import { ActionButtonProps } from "../../types";

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
  ariaLabel,
  ariaDescribedBy,
  type = "button"
}: ActionButtonProps) => {
  const buttonClass = getButtonClasses(variant, size, disabled || loading);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      className={`${buttonClass} ${className} flex items-center ${CSS_CONSTANTS.GAP.SMALL} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
    >
      {loading ? (
        <div 
          className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
          role="status"
          aria-label="טוען..."
        />
      ) : (
        Icon ? <Icon size={iconSize} aria-hidden="true" /> : null
      )}
      {children}
    </button>
  );
};


