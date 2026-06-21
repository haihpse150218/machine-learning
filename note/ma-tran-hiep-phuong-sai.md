# Ma trận hiệp phương sai (Covariance Matrix)

> Tóm tắt 1 câu: Ma trận hiệp phương sai mô tả **các đặc trưng cùng biến thiên với nhau như thế nào** — đường chéo là phương sai của từng đặc trưng, ngoài đường chéo là mức "đi cùng nhau" giữa các cặp đặc trưng. Đây là đầu vào để PCA tìm vector riêng.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh B (Đại số TT → PCA) · #1 → kế tiếp [[tri-rieng-vector-rieng]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #toan #thong-ke #dai-so-tuyen-tinh #pca

---

## 💡 Ý chính
> Diễn đạt lại bằng lời của bạn — nếu giải thích được thì mới thật sự hiểu.

- **Phương sai (variance):** một đặc trưng dao động mạnh hay yếu quanh giá trị trung bình.
- **Hiệp phương sai (covariance):** hai đặc trưng có xu hướng tăng/giảm **cùng nhau** không.
  - Dương → cùng tăng cùng giảm. Âm → ngược chiều. ≈ 0 → không liên quan tuyến tính.
- Gom tất cả phương sai + hiệp phương sai của mọi cặp đặc trưng vào một bảng vuông → **ma trận hiệp phương sai Σ**.

## 🔢 Công thức / Định nghĩa

```
Σ = (1 / (n−1)) · Xᶜᵀ · Xᶜ
```

| Ký hiệu | Ý nghĩa |
|---------|---------|
| X | Ma trận dữ liệu (n hàng = mẫu, d cột = đặc trưng) |
| Xᶜ | X đã **trừ trung bình** mỗi cột (centered) |
| n | Số mẫu |
| Σ | Ma trận d×d, đối xứng |

**Ví dụ 2 đặc trưng (x1, x2):**

```
Σ = | var(x1)      cov(x1,x2) |
    | cov(x1,x2)   var(x2)    |
```

- Đường chéo: phương sai từng trục.
- Ngoài đường chéo: chúng "nghiêng" theo nhau bao nhiêu → giải thích vì sao đám mây dữ liệu bị **xoay nghiêng**.

## 🧩 Trực giác / Ví dụ
- Đám mây dữ liệu nghiêng 45° lên = x1 và x2 có **hiệp phương sai dương lớn** (cao cái này thì cao cái kia).
- Đám mây tròn = hiệp phương sai ≈ 0, hai trục độc lập.
- Chính độ nghiêng này là thứ PCA "gỡ" ra bằng cách xoay trục.

## ⚙️ Khi nào dùng / Ứng dụng trong ML
- Là **đầu vào trực tiếp của PCA**: tìm [[tri-rieng-vector-rieng]] của Σ.
  - Vector riêng của Σ = các trục chính (principal components).
  - Trị riêng λ = phương sai dữ liệu theo trục đó → λ lớn = trục quan trọng.
- Dùng trong phân tích tương quan, phát hiện đặc trưng dư thừa (tương quan cao).

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Quên trừ trung bình (centering):** ra ma trận sai, PCA lệch hoàn toàn.
- **Hiệp phương sai ≠ tương quan:** covariance phụ thuộc đơn vị đo; tương quan (correlation) là covariance đã chuẩn hoá về [−1, 1].
- Cov ≈ 0 chỉ nói "không liên quan **tuyến tính**" — vẫn có thể liên quan phi tuyến.

---

## 🔗 Liên kết
- **Liên quan tới:** [[phuong-sai]] · [[tuong-quan]]
- **Tiền đề (cần biết trước):** [[ky-vong-trung-binh]] · [[ma-tran]]
- **Dẫn tới (học tiếp):** [[tri-rieng-vector-rieng]] · [[pca]]

## ❓ Câu hỏi mở
- Vì sao vector riêng của ma trận hiệp phương sai lại đúng bằng hướng phương sai lớn nhất?
- Khi nào nên dùng ma trận tương quan thay cho ma trận hiệp phương sai trong PCA?

## 📚 Nguồn
- StatQuest — "PCA Step-by-Step".
- 3Blue1Brown — Essence of Linear Algebra.
