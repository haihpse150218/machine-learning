# PCA (Principal Component Analysis — Phân tích thành phần chính)

> Tóm tắt 1 câu: PCA **xoay hệ trục** của dữ liệu sang các hướng có phương sai lớn nhất (các vector riêng của ma trận hiệp phương sai), rồi **giữ lại vài hướng quan trọng nhất** để giảm số chiều mà mất ít thông tin.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh B (Đại số TT → PCA) · #3 ← cần [[ma-tran-hiep-phuong-sai]] + [[tri-rieng-vector-rieng]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #giam-chieu #dai-so-tuyen-tinh #unsupervised
**Hình minh hoạ:** `eigenvector-pca.excalidraw` (xem `eigenvector-pca.png`)

---

## 💡 Ý chính
> Diễn đạt lại bằng lời của bạn — nếu giải thích được thì mới thật sự hiểu.

- Trong trục gốc (x1, x2, ...) ta **không biết chiều nào mang nhiều thông tin**. Nhiều đặc trưng còn trùng lặp (tương quan cao).
- PCA tìm một **hệ trục mới** sao cho:
  - Trục 1 (PC1) = hướng dữ liệu **trải rộng nhất** (phương sai lớn nhất).
  - Trục 2 (PC2) = hướng trải rộng nhì, **vuông góc** với PC1. Và cứ thế.
- Giữ vài PC đầu (λ lớn), bỏ các PC sau (λ nhỏ ≈ nhiễu) → **giảm chiều** mà giữ phần lớn thông tin.

## ⚙️ Quy trình (các bước)

```
1. Chuẩn hoá: trừ trung bình mỗi cột (và thường scale về cùng đơn vị)
2. Tính ma trận hiệp phương sai  Σ
3. Tìm trị riêng λ và vector riêng v của Σ   (Av = λv)
4. Xếp vector riêng theo λ giảm dần
5. Chọn k vector riêng đầu  → ma trận chiếu W (d × k)
6. Chiếu dữ liệu: Z = Xᶜ · W   (dữ liệu mới chỉ còn k chiều)
```

| Bước | Vai trò |
|------|---------|
| Σ | Đo các trục biến thiên cùng nhau → xem [[ma-tran-hiep-phuong-sai]] |
| λ, v | Trục chính + mức quan trọng → xem [[tri-rieng-vector-rieng]] |
| k | Số chiều muốn giữ (siêu tham số) |

## 🔢 Chọn k bao nhiêu? (Explained Variance)

```
Tỉ lệ phương sai giữ lại = (λ1 + ... + λk) / (λ1 + ... + λd)
```

- Thường chọn k sao cho giữ **≥ 90–95%** tổng phương sai.
- Vẽ "scree plot" (λ theo thứ tự) → tìm "khuỷu tay" (elbow) nơi λ tụt mạnh.

## 🧩 Trực giác / Ví dụ
- Đám mây dữ liệu hình elip nghiêng: PC1 = trục dài của elip, PC2 = trục ngắn. Bỏ trục ngắn ≈ "ép phẳng" elip về một đường mà vẫn giữ hình dạng chính.
- Ảnh khuôn mặt (eigenfaces), nén dữ liệu, trực quan hoá dữ liệu nhiều chiều xuống 2D/3D.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Quên scale đặc trưng:** đặc trưng có đơn vị lớn (vd lương tính bằng đồng) sẽ "nuốt" phương sai → PC1 chỉ phản ánh đơn vị, không phản ánh cấu trúc. Dùng **standardization** trước.
- PCA là **tuyến tính**: không bắt được cấu trúc cong (dùng Kernel PCA / t-SNE / UMAP cho phi tuyến).
- PC mới **khó diễn giải**: chúng là tổ hợp của các đặc trưng gốc, không còn ý nghĩa trực tiếp.
- PCA cho **giảm chiều / trực quan hoá**, không phải để chọn đặc trưng gốc (feature selection) — nó tạo đặc trưng mới.
- PCA **unsupervised**: không dùng nhãn y → hướng phương sai lớn chưa chắc là hướng phân loại tốt nhất (khác với LDA).

---

## 🔗 Liên kết
- **Liên quan tới:** [[svd]] · [[giam-chieu-du-lieu]] · [[t-sne]]
- **Tiền đề (cần biết trước):** [[ma-tran-hiep-phuong-sai]] · [[tri-rieng-vector-rieng]] · [[chuan-hoa-du-lieu]]
- **Dẫn tới (học tiếp):** [[kernel-pca]] · [[he-goi-y-recommender]]

## ❓ Câu hỏi mở
- Khi nào PCA làm hại mô hình (vứt mất chiều ít phương sai nhưng quan trọng để phân loại)?
- Khác biệt thực tế giữa làm PCA qua eigen-decomposition của Σ và làm trực tiếp bằng [[svd]] trên dữ liệu?

## 📚 Nguồn
- StatQuest — "PCA Step-by-Step".
- scikit-learn — `sklearn.decomposition.PCA` (tài liệu chính thức).
