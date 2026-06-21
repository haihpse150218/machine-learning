# Huấn luyện vs Suy luận (Training vs Inference)

> Tóm tắt 1 câu: **Huấn luyện** = đưa dữ liệu CÓ NHÃN, model dự đoán → so với nhãn → tính Lỗi → **cập nhật trọng số** (lặp lại). **Suy luận** = model đã train xong (**trọng số cố định**), đưa dữ liệu MỚI chưa nhãn → **chỉ dự đoán**, không học nữa.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh F (Nhập môn ML) · *(L2 Mục 04)* ← liên quan [[gradient-descent]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #training #inference #nhap-mon
**Nguồn slide:** `L2_Intro_ML_DL_GenAI.pdf` slide 28–30 — TS. Cao Tiến Dũng

---

## 🔁 Huấn luyện (Training) — model HỌC
```
Dữ liệu CÓ NHÃN (X, y)
   → [Forward] model NHÂN MA TRẬN  W·X + b  → dự đoán ŷ      (đại số tuyến tính)
   → tính LỖI: so ŷ với y bằng hàm sai số                    (xác suất / thông tin)
        Cross-Entropy (từ [[entropy]]) cho phân loại · MSE cho hồi quy → [[loss-function]]
   → [Backward] tính gradient của lỗi → CẬP NHẬT trọng số W  (giải tích / tối ưu)
        [[gradient-descent]]
   → lặp lại đến khi lỗi đủ nhỏ
```
> 🎯 Đúng mạch của bạn — vòng lặp này **gói cả 3 mảng toán**: nhân ma trận (đại số TT) → entropy/cross-entropy (xác suất) → cập nhật trọng số (giải tích/tối ưu).
- **Forward:** chạy xuôi để ra dự đoán. **Backward:** lan lỗi ngược lại để chỉnh trọng số (backpropagation).
- Cần **nhãn** (người gán: "Xe đạp", "Dâu tây") để biết đúng/sai.

## ⚡ Suy luận (Inference) — model DÙNG
```
Dữ liệu MỚI (chưa nhãn) → [Forward] → Dự đoán: "Xe đạp!"
   (trọng số ĐÃ CỐ ĐỊNH — KHÔNG cập nhật)
```
- Chỉ chạy **forward**, không backward, **không học thêm**.

## 🆚 So sánh
| | Huấn luyện (Training) | Suy luận (Inference) |
|---|---|---|
| Dữ liệu | có nhãn | mới, **chưa nhãn** |
| Trọng số | **đang cập nhật** | **cố định (đông cứng)** |
| Có tính lỗi? | có (so với nhãn) | không |
| Forward/Backward | cả hai | **chỉ forward** |
| Tốn tài nguyên | nhiều (lặp nhiều vòng) | nhẹ (1 lần chạy) |

> 🎯 **Mục tiêu cuối:** model hoạt động tốt trên **dữ liệu CHƯA THẤY** lúc suy luận → đó là lý do phải tránh [[overfitting]] và đánh giá trên tập test ([[danh-gia-mo-hinh]]).

## 🔗 Liên hệ
- **ChatGPT khi mình chat = đang Suy luận** (trọng số cố định, không học realtime) → [[cach-chatgpt-hoc]].
- Train = làm [[suy-dien-hoc-may]] (ước lượng tham số từ mẫu); Inference = áp lên dữ liệu mới.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Tưởng model học khi đang dùng (inference):** không — nó đã đông cứng; muốn cải thiện phải **train lại** với dữ liệu mới.
- **Đánh giá trên tập train** → ảo (model đã thấy rồi); phải đo lúc inference trên **dữ liệu chưa thấy**.
- **Data leakage:** lỡ để thông tin test lọt vào lúc train → điểm inference ảo cao ([[xu-ly-du-lieu]]).

---

## 🔗 Liên kết
- **Tiền đề:** [[gradient-descent]] · [[loss-function]]
- **Liên quan:** [[overfitting]] · [[suy-dien-hoc-may]] · [[cach-chatgpt-hoc]] · [[danh-gia-mo-hinh]]

## ❓ Câu hỏi mở
- Backpropagation lan lỗi ngược qua nhiều lớp chính xác thế nào? ([[chain-rule]])
- Vì sao inference nhẹ hơn training nhiều?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L2_Intro_ML_DL_GenAI.pdf` slide 28–30).
