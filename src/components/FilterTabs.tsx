/* oxlint-disable react/only-export-components */
import { createContext, useContext, type ReactNode } from 'react';
import type { DeadlineFilter } from '../features/deadlines/types';

interface FilterTabsContextValue {
  value: DeadlineFilter;
  onValueChange: (value: DeadlineFilter) => void;
}

const FilterTabsContext = createContext<FilterTabsContextValue | null>(null);

interface RootProps extends FilterTabsContextValue {
  children: ReactNode;
}

function Root({ value, onValueChange, children }: RootProps) {
  return (
    <FilterTabsContext.Provider value={{ value, onValueChange }}>
      <div className="filter-tabs">{children}</div>
    </FilterTabsContext.Provider>
  );
}

function useFilterTabs() {
  const context = useContext(FilterTabsContext);
  if (!context) throw new Error('FilterTabs components must be used inside FilterTabs.Root.');
  return context;
}

function List({ children }: { children: ReactNode }) {
  return (
    <div className="filter-tabs__list" role="tablist" aria-label="Lọc deadline theo trạng thái">
      {children}
    </div>
  );
}

function Trigger({
  value,
  children,
}: {
  value: DeadlineFilter;
  children: ReactNode;
}) {
  const context = useFilterTabs();
  const selected = context.value === value;

  return (
    <button
      aria-selected={selected}
      className={`filter-tabs__trigger${selected ? ' is-active' : ''}`}
      onClick={() => context.onValueChange(value)}
      role="tab"
      type="button"
    >
      {children}
    </button>
  );
}

export const FilterTabs = Object.assign(Root, { List, Trigger });
