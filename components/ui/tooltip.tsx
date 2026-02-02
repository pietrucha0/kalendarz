import React, { useState } from "react";
import { cn } from "../../utils/helpers";

// SHADCN REQUIREMENT 4: Tooltip
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const Tooltip = ({ children, content }: { children?: React.ReactNode; content: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 px-2 py-1 mb-2 text-xs text-white bg-pink-900 rounded-md -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap animate-fade-in">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-pink-900" />
        </div>
      )}
    </div>
  );
};

// SHADCN REQUIREMENT 4: Popover / Dropdown Menu simplified implementation
export const Popover = ({ trigger, content }: { trigger: React.ReactNode; content: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative inline-block text-left">
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
            {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in">
                    <div className="py-1" onClick={() => setIsOpen(false)}>
                        {content}
                    </div>
                </div>
            )}
        </div>
    )
}