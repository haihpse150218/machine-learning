# Machine Learning — Second Brain & Demos

Ghi chú học Machine Learning (tiếng Việt, kiểu atomic note / Obsidian) + các demo code tự cài từ đầu. Khóa học của **TS. Cao Tiến Dũng** (FPT School of Business & Technology).

## Cấu trúc

| Thư mục | Nội dung |
|---|---|
| `note/` | "Second Brain" — ghi chú atomic theo lộ trình; bắt đầu từ [`SECOND_BRAIN.md`](note/SECOND_BRAIN.md) (Map of Content). |
| `note/template-checklist/` | 📋 **Plan/checklist 8 bước** xử lý dữ liệu ML — kiến thức cô đọng, "lần sau cứ theo đây mà làm". |
| `code-practice/` | Notebook & demo tự cài (không dùng `sklearn.metrics` cho phần lõi): hồi quy logistic, softmax đa lớp, đánh giá phân loại, xử lý dữ liệu thiếu (missingno), feature scaling; app web tương tác `classification-demo/`. |
| `slide/` | Slide bài giảng (PDF) L1–L5 + đề cương. |
| `secondbrain-app/` | App web (Node + vanilla JS) để xem/sửa/track các note theo lộ trình. |

## Định hướng học (90/10)

Tập trung **data-centric**: 90% công việc thật là tìm + làm sạch + xử lý dữ liệu, 10% thuật toán. Học toán/thuật toán để **hiểu** model làm gì, trọng tâm thực hành là xử lý dữ liệu đúng + dùng lại model có sẵn. Chi tiết: [`note/dinh-huong-hoc.md`](note/dinh-huong-hoc.md).

## Chạy demo

```bash
# Notebook (cần Python 3.12 + numpy + matplotlib + scikit-learn + missingno)
cd code-practice && jupyter notebook

# App web second brain
cd secondbrain-app && npm install && npm start   # http://localhost:5173

# App visualize phân loại (tĩnh, không cần server)
# mở code-practice/classification-demo/index.html
```
