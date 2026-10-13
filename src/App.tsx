import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  CalendarDays,
  Check,
  CheckCheck,
  Circle,
  Clock3,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  addDeadline,
  deleteDeadline,
  fetchDeadlines,
  toggleDeadline,
} from './features/deadlines/deadlinesSlice';
import { PRIORITIES, isPriority, type NewDeadline, type Priority } from './features/deadlines/types';
import { FilterTabs } from './components/FilterTabs';
import { getDaysRemaining, useDeadlineDashboard } from './hooks/useDeadlineDashboard';

const filterLabels = {
  all: 'Tất cả',
  pending: 'Chưa xong',
  overdue: 'Quá hạn',
  completed: 'Đã xong',
} as const;

const priorityLabels: Record<Priority, string> = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

const subjectColors = ['lavender', 'peach', 'mint', 'blue', 'rose'];
const todayLabel = new Intl.DateTimeFormat('vi-VN', {
  day: 'numeric',
  month: 'long',
}).format(new Date());

function formatDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}

function App() {
  const dispatch = useAppDispatch();
  const { items: deadlines, status, error } = useAppSelector((state) => state.deadlines);
  const { counts, filter, query, setFilter, setQuery, visibleDeadlines } =
    useDeadlineDashboard(deadlines);
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    void dispatch(fetchDeadlines());
  }, [dispatch]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!subject.trim() || !title.trim()) {
      setFormError('Vui lòng nhập môn học và tên bài tập.');
      return;
    }
    if (!isPriority(priority)) {
      setFormError('Vui lòng chọn mức độ ưu tiên hợp lệ.');
      return;
    }

    const newDeadline: NewDeadline = {
      subject: subject.trim(),
      title: title.trim(),
      dueDate,
      priority,
    };
    dispatch(addDeadline(newDeadline));
    setSubject('');
    setTitle('');
    setDueDate('');
    setPriority('medium');
    setFormError('');
  }

  return (
    <div className="app-shell">
      <main className="main-content" id="dashboard">
        <header className="topbar">
          <a className="brand" href="#dashboard" aria-label="Trang chủ Deadline">
            <span className="brand__mark"><CheckCheck size={19} strokeWidth={2.5} /></span>
            <span className="brand__name">nộp<span>đúng</span>hạn</span>
          </a>
          <div className="today-label"><CalendarDays size={16} /> {todayLabel}</div>
        </header>

        <div className="dashboard">
          <section className="welcome-row">
            <div>
              <h1>Quản lý deadline</h1>
              <p className="welcome-copy">Theo dõi bài tập và hạn nộp của bạn.</p>
            </div>
            <button
              className="desktop-add-button"
              onClick={() => document.getElementById('subject')?.focus()}
              type="button"
            >
              <Plus size={16} /> Thêm bài tập
            </button>
          </section>

          <div className="content-grid">
            <section className="deadline-panel" id="deadlines">
              <div className="panel-heading">
                <div className="panel-title-row">
                  <h2>Danh sách bài tập</h2>
                  <span className="panel-count">{deadlines.length}</span>
                </div>
                <button
                  className="mobile-add-button"
                  onClick={() => document.getElementById('subject')?.focus()}
                  type="button"
                >
                  <Plus size={16} /> Thêm mới
                </button>
              </div>

              <label className="search-box">
                <Search size={17} />
                <input
                  aria-label="Tìm kiếm bài tập hoặc môn học"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tìm kiếm bài tập, môn học..."
                  value={query}
                />
                {query && (
                  <button
                    aria-label="Xóa nội dung tìm kiếm"
                    className="search-clear"
                    onClick={() => setQuery('')}
                    type="button"
                  >
                    <X size={15} />
                  </button>
                )}
              </label>

              <FilterTabs onValueChange={setFilter} value={filter}>
                <FilterTabs.List>
                  {(Object.keys(filterLabels) as Array<keyof typeof filterLabels>).map((key) => (
                    <FilterTabs.Trigger key={key} value={key}>
                      {filterLabels[key]} <span className="filter-count">{counts[key]}</span>
                    </FilterTabs.Trigger>
                  ))}
                </FilterTabs.List>
              </FilterTabs>

              <div className="deadline-list">
                {status === 'loading' && (
                  <div className="loading-state"><span className="spinner" /> Đang tải danh sách bài tập...</div>
                )}
                {status === 'failed' && (
                  <div className="error-state">
                    <p>{error}</p>
                    <button
                      className="retry-button"
                      onClick={() => dispatch(fetchDeadlines())}
                      type="button"
                    >
                      Thử tải lại
                    </button>
                  </div>
                )}
                {status === 'succeeded' && visibleDeadlines.length === 0 && (
                  <div className="empty-state">
                    <span className="empty-state__icon"><BookOpen size={22} /></span>
                    <strong>{query ? 'Không tìm thấy bài tập' : 'Chưa có bài tập nào ở đây'}</strong>
                    <span>{query ? 'Thử từ khóa khác xem sao nhé.' : 'Thêm deadline mới để bắt đầu theo dõi nhé.'}</span>
                  </div>
                )}
                {visibleDeadlines.map((deadline) => {
                  const daysRemaining = getDaysRemaining(deadline.dueDate);
                  const overdue = !deadline.completed && daysRemaining < 0;
                  const subjectColor = subjectColors[
                    Array.from(deadline.subject).reduce((total, character) => total + character.charCodeAt(0), 0) %
                      subjectColors.length
                  ];

                  return (
                    <article
                      className={`deadline-item${deadline.completed ? ' is-completed' : ''}`}
                      key={deadline.id}
                    >
                      <button
                        aria-label={
                          deadline.completed
                            ? `Đánh dấu chưa xong: ${deadline.title}`
                            : `Đánh dấu hoàn thành: ${deadline.title}`
                        }
                        className={`task-check${deadline.completed ? ' is-checked' : ''}`}
                        onClick={() => dispatch(toggleDeadline(deadline.id))}
                        type="button"
                      >
                        {deadline.completed
                          ? <Check size={15} strokeWidth={3} />
                          : <Circle size={20} strokeWidth={1.7} />}
                      </button>
                      <div className={`subject-icon subject-icon--${subjectColor}`}>
                        <BookOpen size={17} />
                      </div>
                      <div className="deadline-item__body">
                        <div className="deadline-item__subject">{deadline.subject}</div>
                        <h3>{deadline.title}</h3>
                        <div className="deadline-item__meta">
                          <span><CalendarDays size={14} /> {formatDate(deadline.dueDate)}</span>
                          <span className={`priority priority--${deadline.priority}`}>
                            {deadline.priority === 'high'
                              ? <ArrowUp size={12} />
                              : deadline.priority === 'low'
                                ? <ArrowDown size={12} />
                                : <span className="priority__dash" />}
                            {priorityLabels[deadline.priority]}
                          </span>
                        </div>
                      </div>
                      <div className="deadline-item__right">
                        <span className={`due-badge${overdue ? ' due-badge--overdue' : ''}${deadline.completed ? ' due-badge--done' : ''}`}>
                          {deadline.completed
                            ? <><Check size={12} /> Hoàn thành</>
                            : overdue
                              ? <><Clock3 size={12} /> Quá hạn {Math.abs(daysRemaining)} ngày</>
                              : <><Clock3 size={12} /> Còn {daysRemaining} ngày</>}
                        </span>
                        <button
                          aria-label={`Xóa bài tập ${deadline.title}`}
                          className="delete-button"
                          onClick={() => dispatch(deleteDeadline(deadline.id))}
                          type="button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <aside className="right-column">
              <section className="add-card">
                <div className="add-card__heading">
                  <span className="add-card__icon"><Plus size={18} /></span>
                  <div>
                    <h2>Thêm bài tập</h2>
                    <p>Nhập thông tin deadline mới.</p>
                  </div>
                </div>
                <form className="deadline-form" onSubmit={handleSubmit}>
                  <label htmlFor="subject">Môn học</label>
                  <input
                    autoComplete="off"
                    id="subject"
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="VD: Lập trình Web"
                    required
                    value={subject}
                  />
                  <label htmlFor="title">Tên bài tập</label>
                  <input
                    id="title"
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Bạn cần hoàn thành gì?"
                    required
                    value={title}
                  />
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="dueDate">Hạn nộp</label>
                      <input
                        id="dueDate"
                        onChange={(event) => setDueDate(event.target.value)}
                        required
                        type="date"
                        value={dueDate}
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="priority">Ưu tiên</label>
                      <select
                        id="priority"
                        onChange={(event) => {
                          if (isPriority(event.target.value)) setPriority(event.target.value);
                        }}
                        value={priority}
                      >
                        {PRIORITIES.map((option) => (
                          <option key={option} value={option}>{priorityLabels[option]}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {formError && <p className="form-error" role="alert">{formError}</p>}
                  <button className="submit-button" type="submit">
                    <Plus size={16} /> Thêm vào danh sách
                  </button>
                </form>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
