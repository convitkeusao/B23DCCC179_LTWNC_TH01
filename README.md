# Nộp Đúng Hạn — Student Deadline Tracker

Ứng dụng cá nhân giúp sinh viên quản lý deadline bài tập theo môn học, hạn nộp, mức ưu tiên và trạng thái hoàn thành.

## Chạy ứng dụng

Yêu cầu Node.js 20.19+ hoặc 22.12+.

```bash
npm install
npm run dev
```

Mở địa chỉ local do Vite hiển thị trong terminal.

## Tính năng

- Tải danh sách deadline mẫu qua API giả lập khi khởi động.
- Thêm bài tập với môn học, tên, hạn nộp và mức ưu tiên.
- Đánh dấu hoàn thành hoặc chuyển lại trạng thái chưa hoàn thành; xóa bài tập.
- Lọc tất cả, chưa hoàn thành, quá hạn hoặc đã hoàn thành; tìm theo môn học và tên bài.
- Hiển thị số ngày còn lại/quá hạn cùng số lượng bài tập theo từng bộ lọc.
- Giao diện responsive cho màn hình máy tính và điện thoại.

## Cấu trúc triển khai

- `src/features/deadlines/`: kiểu dữ liệu, API giả lập và Redux Toolkit slice/thunk.
- `src/features/deadlines/deadlineUtils.ts`: nhãn, định dạng ngày và màu môn học dùng chung.
- `src/app/`: Redux store và typed hooks.
- `src/hooks/useDeadlineList.ts`: custom hook generic cho lọc, tìm kiếm và thống kê deadline.
- `src/components/FilterTabs.tsx`: compound component cho bộ lọc trạng thái.
- `src/components/deadlines/`: giao diện riêng cho danh sách deadline và form thêm bài tập.

Danh sách ban đầu nằm trong `deadlinesApi.ts`; API giả lập trả dữ liệu sau một khoảng trễ để mô phỏng yêu cầu mạng. Dữ liệu thêm mới được giữ trong Redux trong phiên chạy hiện tại.

## Kiểm tra

```bash
npm run build
npm run lint
```
