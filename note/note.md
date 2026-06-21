# 📐 Tóm tắt: 5 mảng toán cốt lõi cho ML
> Nguồn: `L1_Math_Overview.pdf` (TS. Cao Tiến Dũng) — **đã học xong ✅**.
> Trang trung tâm: [[SECOND_BRAIN]]. Mỗi mảng dưới đây map tới các note đã xây.

---

## 1. Đại số tuyến tính (Linear Algebra) — *Nhánh B*
> Biểu diễn dữ liệu dạng vector/ma trận; model nhân `W·x`; gỡ tương quan & giảm chiều.
- [[ma-tran-hiep-phuong-sai]] → [[tri-rieng-vector-rieng]] → [[pca]]
- **Ý chính:** PCA xoay trục theo phương sai lớn nhất để gom cột tương quan → giảm chiều.

## 2. Giải tích (Calculus) — *Nhánh A*
> Đạo hàm = la bàn để "đi mò" tối thiểu sai số.
- [[giai-tich]] → [[dao-ham]] → [[gradient]] → [[gradient-descent]]
- **Ý chính:** học = tìm hàm f; gradient chỉ hướng giảm sai số nhanh nhất.

## 3. Lý thuyết xác suất (Probability) 🔴 *bắt buộc — Nhánh C*
> Đo độ tin/bất định; model trả ra xác suất; nền của loss & ước lượng.
- [[xac-suat]] → [[phan-phoi-xac-suat]] → [[gauss-va-nhi-thuc]]
- [[dinh-ly-bayes]] · [[entropy]] · [[maximum-likelihood]]
- **Ý chính:** MLE = tìm đường cong ôm nhiều điểm nhất = cách nhìn khác của hồi quy.

## 4. Thống kê (Statistics) 🔴 *bắt buộc — Nhánh C*
> Suy diễn = bản chất của ML (học từ mẫu → dự đoán tổng thể).
- Từ vựng & loại biến: [[tu-vung-thong-ke]] · [[phan-loai-thong-ke]]
- Mô tả: [[ky-vong-trung-binh]] · [[phuong-sai]] · [[tuong-quan]]
- Suy diễn: [[lay-mau]] · [[kiem-dinh-gia-thuyet]] · [[p-value]]
- Cầu sang ML: [[suy-dien-hoc-may]] · [[overfitting]]
- **Ý chính:** mẫu phải đại diện, đừng học thuộc mẫu (tương quan ≠ nhân quả).

## 5. Tối ưu hóa (Optimization) — *Nhánh A*
> Train = cực tiểu hóa hàm chi phí.
- [[loss-function]] (MSE / Cross-Entropy) → [[toi-uu-loi]] (lồi) → [[regularization]] (L1/L2)
- **Ý chính:** giảm loss bằng gradient descent; lồi → tái lập; regularization → chống overfit.

---

## 🔗 5 mảng KHÔNG rời rạc — chúng hội tụ vào ML
```
Đại số TT (W·x, PCA) ┐
Giải tích (gradient)  ├─→ HÀM CHI PHÍ ([[loss-function]])
Xác suất (MLE, CE)   ┘     │  cực tiểu hóa bằng
                            ▼
                    [[gradient-descent]]  ← Tối ưu hóa
                            │  học từ mẫu, suy ra tổng thể
                            ▼
                    [[suy-dien-hoc-may]]  ← Thống kê
```
> Định hướng xuyên suốt: [[dinh-huong-hoc]] — học toán để **hiểu**, dồn sức vào **xử lý dữ liệu** (quy tắc 90/10).

## ▶️ Tiếp theo
- Lớp LÀM (xử lý dữ liệu): [[xu-ly-du-lieu]] và Nhánh D.
- Thuật toán & mô hình: [[decision-tree]] và Nhánh E (chưa: linear/logistic regression, random forest...).
- Nguồn kế: `L2_Intro_ML_DL_GenAI.pdf`.
