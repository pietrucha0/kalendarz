import React from "react";
import { cn } from "../utils/helpers";

// A generic list component that can render any type of item
interface GenericListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  className?: string;
  emptyMessage?: string;
}

export const GenericList = <T,>({
  items,
  renderItem,
  keyExtractor,
  className,
  emptyMessage = "No items found.",
}: GenericListProps<T>) => {
  if (items.length === 0) {
    return <div className="text-center p-4 text-pink-300 italic">{emptyMessage}</div>;
  }

  return (
    <ul className={cn("space-y-2", className)}>
      {items.map((item) => (
        <li key={keyExtractor(item)} className="animate-fade-in">
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
};
