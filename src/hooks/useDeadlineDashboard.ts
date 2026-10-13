import { useDeferredValue, useMemo, useState } from 'react';
import type { Deadline, DeadlineFilter } from '../features/deadlines/types';

function isOverdue(deadline: Deadline): boolean {
  if (deadline.completed) return false;
  const [year, month, day] = deadline.dueDate.split('-').map(Number);
  const dueDate = Date.UTC(year, month - 1, day);
  const today = new Date();
  const todayStart = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return dueDate < todayStart;
}

export function useDeadlineDashboard<T extends Deadline>(deadlines: T[]) {
  const [filter, setFilter] = useState<DeadlineFilter>('all');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase('vi'));

  const counts = useMemo<Record<DeadlineFilter, number>>(
    () => ({
      all: deadlines.length,
      pending: deadlines.filter((deadline) => !deadline.completed && !isOverdue(deadline)).length,
      overdue: deadlines.filter(isOverdue).length,
      completed: deadlines.filter((deadline) => deadline.completed).length,
    }),
    [deadlines],
  );

  const visibleDeadlines = useMemo(() => {
    return deadlines
      .filter((deadline) => {
        const matchesFilter =
          filter === 'all' ||
          (filter === 'pending' && !deadline.completed && !isOverdue(deadline)) ||
          (filter === 'overdue' && isOverdue(deadline)) ||
          (filter === 'completed' && deadline.completed);
        const searchableText = `${deadline.title} ${deadline.subject}`.toLocaleLowerCase('vi');
        return matchesFilter && searchableText.includes(deferredQuery);
      })
      .sort((first, second) => first.dueDate.localeCompare(second.dueDate));
  }, [deadlines, deferredQuery, filter]);

  return { counts, filter, query, setFilter, setQuery, visibleDeadlines };
}

export function getDaysRemaining(dueDate: string): number {
  const [year, month, day] = dueDate.split('-').map(Number);
  const dueDateUtc = Date.UTC(year, month - 1, day);
  const today = new Date();
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((dueDateUtc - todayUtc) / 86_400_000);
}
