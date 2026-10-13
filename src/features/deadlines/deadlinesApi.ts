import type { Deadline } from './types';

function dateFromToday(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const sampleDeadlines: Deadline[] = [
  {
    id: 'deadline-1',
    subject: 'Lập trình Web',
    title: 'Xây dựng giao diện trang thương mại điện tử',
    dueDate: dateFromToday(1),
    priority: 'high',
    completed: false,
  },
  {
    id: 'deadline-2',
    subject: 'Cơ sở dữ liệu',
    title: 'Thiết kế ERD và chuẩn hóa dữ liệu',
    dueDate: dateFromToday(3),
    priority: 'medium',
    completed: false,
  },
  {
    id: 'deadline-3',
    subject: 'Trí tuệ nhân tạo',
    title: 'Báo cáo thuật toán tìm kiếm A*',
    dueDate: dateFromToday(-2),
    priority: 'high',
    completed: false,
  },
  {
    id: 'deadline-4',
    subject: 'Tiếng Anh chuyên ngành',
    title: 'Thuyết trình chủ đề công nghệ xanh',
    dueDate: dateFromToday(5),
    priority: 'low',
    completed: false,
  },
  {
    id: 'deadline-5',
    subject: 'Toán rời rạc',
    title: 'Bài tập chương 4 — Quan hệ và đồ thị',
    dueDate: dateFromToday(-1),
    priority: 'medium',
    completed: true,
  },
  {
    id: 'deadline-6',
    subject: 'Lập trình Web',
    title: 'Hoàn thành bản phác thảo thiết kế',
    dueDate: dateFromToday(-4),
    priority: 'low',
    completed: true,
  },
];

export const deadlinesApi = {
  getDeadlines(): Promise<unknown> {
    return new Promise((resolve) => {
      window.setTimeout(() => resolve(sampleDeadlines), 450);
    });
  },
};
