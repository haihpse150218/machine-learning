# Phương sai & Độ lệch chuẩn (Variance & Std)

> Tóm tắt 1 câu: **Phương sai** đo dữ liệu **dao động xa trung bình bao nhiêu** — trung bình của bình phương khoảng cách tới mean. **Độ lệch chuẩn** = căn của phương sai (cùng đơn vị dữ liệu, dễ đọc hơn).

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh C (Thống kê) · nền tảng ← cần [[ky-vong-trung-binh]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #toan #thong-ke #spread #nen-tang

---

## 💡 Ý chính
- **Trung bình (mean)** cho biết "tâm". **Phương sai** cho biết dữ liệu **bám sát tâm** hay **tản rộng**.
- Cách tính: với mỗi điểm, đo khoảng cách tới mean → **bình phương** → lấy trung bình.
- **Vì sao bình phương?**
  - Để khoảng cách âm/dương **không triệt tiêu** nhau.
  - **Phạt nặng** điểm ở xa (xa gấp đôi → đóng góp gấp 4).

## 🔢 Công thức / Định nghĩa
```
Phương sai:      Var(X) = (1/n) · Σ (xᵢ − μ)²
Độ lệch chuẩn:   σ = √Var(X)
```
| Ký hiệu | Ý nghĩa |
|---------|---------|
| μ | trung bình ([[ky-vong-trung-binh]]) |
| xᵢ − μ | độ lệch của điểm i khỏi tâm |
| bình phương | bỏ dấu + phạt nặng điểm xa |

> **Std vs Variance:** phương sai có đơn vị **bình phương** (vd "đồng²" — khó hiểu); std đưa về **cùng đơn vị** dữ liệu (đồng) → thường dùng std để diễn giải.

## 🧩 Trực giác
- 2 lớp cùng **mean = 7 điểm**:
  - Lớp A: ai cũng ~7 → phương sai **nhỏ** (đồng đều).
  - Lớp B: nửa 4, nửa 10 → phương sai **lớn** (phân hóa).
- Cùng tâm nhưng **khác hẳn nhau** — đó là lý do mean luôn cần đi kèm phương sai/std.

## 🔢 Chia n hay n−1?
- **Population variance:** chia **n** (khi có cả tổng thể).
- **Sample variance:** chia **n−1** (Bessel's correction) — khi chỉ có mẫu, để ước lượng không lệch cho tổng thể.

## ⚙️ Ứng dụng trong ML
- **Mô tả/EDA:** đo độ phân tán từng cột ([[phan-loai-thong-ke]]).
- **Chuẩn hóa z-score:** `z = (x−μ)/σ` dùng thẳng std → [[chuan-hoa-du-lieu]] · [[gauss-va-nhi-thuc]].
- **PCA:** phương sai theo mỗi trục = **lượng thông tin** giữ lại; trục phương sai lớn = quan trọng → [[pca]] · [[tri-rieng-vector-rieng]].
- **Covariance:** mở rộng phương sai cho **2 biến** (chúng cùng dao động ra sao) → [[ma-tran-hiep-phuong-sai]].
- **Bias–variance tradeoff:** "variance" của model cao = nhạy nhiễu = [[overfitting]].

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Rất nhạy outlier:** vì bình phương khuếch đại điểm xa → 1 outlier làm phương sai vọt. Cân nhắc IQR nếu nhiều outlier.
- **Lẫn đơn vị:** đừng so phương sai (đơn vị²) trực tiếp với dữ liệu gốc — dùng std.
- **Quên n vs n−1** khi tính trên mẫu.

---

## 🔗 Liên kết
- **Tiền đề (cần biết trước):** [[ky-vong-trung-binh]]
- **Liên quan tới:** [[phan-phoi-xac-suat]] · [[ma-tran-hiep-phuong-sai]] · [[chuan-hoa-du-lieu]]
- **Dùng trong:** [[pca]] · [[gauss-va-nhi-thuc]] · [[overfitting]]

## ❓ Câu hỏi mở
- Vì sao chia n−1 lại cho ước lượng không lệch (unbiased)?
- Khi nào nên dùng IQR thay cho std để đo độ phân tán?

## 📚 Nguồn
- StatQuest — "Variance and Standard Deviation".
- Khan Academy — Variance & standard deviation.
