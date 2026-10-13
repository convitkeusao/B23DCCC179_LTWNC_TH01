export const PRIORITIES = ['high', 'medium', 'low'] as const;

export type Priority = (typeof PRIORITIES)[number];
export type DeadlineFilter = 'all' | 'pending' | 'overdue' | 'completed';

export interface Deadline {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
}

export type NewDeadline = Omit<Deadline, 'id' | 'completed'>;

export function isOneOf<const T extends readonly string[]>(
  values: T,
  value: unknown,
): value is T[number] {
  return typeof value === 'string' && values.some((candidate) => candidate === value);
}

export function isPriority(value: unknown): value is Priority {
  return isOneOf(PRIORITIES, value);
}

export function isDeadline(value: unknown): value is Deadline {
  if (typeof value !== 'object' || value === null) return false;

  const deadline = value as Record<string, unknown>;
  return (
    typeof deadline.id === 'string' &&
    typeof deadline.subject === 'string' &&
    typeof deadline.title === 'string' &&
    typeof deadline.dueDate === 'string' &&
    isPriority(deadline.priority) &&
    typeof deadline.completed === 'boolean'
  );
}
