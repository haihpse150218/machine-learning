# Trị riêng & Vector riêng (Eigenvalue & Eigenvector)

> Tóm tắt 1 câu: Vector riêng **v** của ma trận **A** là hướng đặc biệt mà khi A tác động lên nó thì chỉ bị **kéo dài/co lại** (nhân với trị riêng **λ**), **không bị xoay** — đây là nền tảng của PCA và SVD.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh B (Đại số TT → PCA) · #2 ← cần [[ma-tran-hiep-phuong-sai]] · → kế tiếp [[pca]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #toan #dai-so-tuyen-tinh #pca #svd
**Hình minh hoạ:** `eigenvector-pca.excalidraw` (xem `eigenvector-pca.png`)

---

## 💡 Ý chính
> Diễn đạt lại bằng lời của bạn — nếu giải thích được thì mới thật sự hiểu.

- Ma trận A là một **phép biến đổi**: nó nhận một vector và biến nó thành vector khác (thường vừa xoay vừa co giãn).
- **Vector riêng v** là hướng "bất biến": A không làm nó xoay, chỉ kéo dài/co lại.
- **Trị riêng λ** là hệ số co giãn đó: λ lớn → hướng này bị kéo mạnh (nhiều "năng lượng"/phương sai); λ nhỏ → ít quan trọng.

## 🔢 Công thức / Định nghĩa

```
A v = λ v        (v ≠ 0)
```

| Ký hiệu | Ý nghĩa |
|---------|---------|
| A | Ma trận vuông (phép biến đổi) |
| v | Vector riêng — hướng không bị xoay |
| λ (lambda) | Trị riêng — hệ số co giãn theo hướng v |

> Giải bằng: `det(A − λI) = 0` để tìm λ, rồi thế ngược lại tìm v.

## 🧩 Trực giác / Ví dụ
- **Hình ảnh:** hầu hết vector khi qua A đều bị xoay sang hướng khác. Chỉ vài hướng đặc biệt (vector riêng) là "giữ nguyên trục", chỉ dài ra hoặc ngắn lại.
- λ âm → vector bị lật ngược 180° nhưng vẫn trên cùng một đường thẳng.

## ⚙️ Khi nào dùng / Ứng dụng trong ML

### PCA (Principal Component Analysis) — giảm chiều
- **Vấn đề:** trong trục gốc x1, x2 ta không biết chiều nào quan trọng hơn (phương sai gần bằng nhau → mơ hồ).
- **Ý tưởng:** đổi góc nhìn — xoay sang hệ trục mới là các **vector riêng của ma trận hiệp phương sai**.
- Vector riêng có **λ lớn nhất (v1)** = hướng dữ liệu trải rộng nhất = **chiều quan trọng nhất**. λ nhỏ (v2) → ít thông tin, có thể bỏ.
- Quy trình: dữ liệu → ma trận hiệp phương sai → eigenvector/eigenvalue → xếp theo λ → giữ vài chiều top.

### SVD (Singular Value Decomposition) — hệ gợi ý Netflix
- Cùng ý tưởng, tổng quát cho ma trận **không vuông** (vd: ma trận người dùng × phim).

```
A = U · Σ · Vᵀ
```

| Thành phần | Ý nghĩa |
|------------|---------|
| A | Ma trận đánh giá (user × movie), nhiều ô trống |
| U | Đặc trưng ẩn của người dùng |
| Σ (Sigma) | Ma trận đường chéo chứa **giá trị kỳ dị** (họ hàng của trị riêng — đo mức quan trọng của mỗi yếu tố ẩn) |
| Vᵀ | Đặc trưng ẩn của phim |

- Giữ vài giá trị kỳ dị lớn nhất trong Σ → nén dữ liệu + **đoán ô trống** = dự đoán phim người dùng sẽ thích → gợi ý.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Trị riêng (eigenvalue)** ≠ **giá trị kỳ dị (singular value)**: SVD dùng singular value (luôn ≥ 0), liên hệ với eigenvalue của AᵀA. Cùng tinh thần "đo mức quan trọng" nhưng không đồng nhất.
- PCA cần **chuẩn hoá dữ liệu trước** (trừ trung bình, có thể scale), nếu không hướng phương sai bị lệch theo đơn vị đo.
- Vector riêng chỉ xác định **hướng**, độ dài có thể chuẩn hoá tuỳ ý (thường về độ dài 1).

---

## 🔗 Liên kết
- **Liên quan tới:** [[pca]] · [[svd]] · [[ma-tran-hiep-phuong-sai]]
- **Tiền đề (cần biết trước):** [[ma-tran]] · [[vector]] · [[phep-bien-doi-tuyen-tinh]]
- **Dẫn tới (học tiếp):** [[giam-chieu-du-lieu]] · [[he-goi-y-recommender]]

## ❓ Câu hỏi mở
- Quan hệ chính xác giữa eigenvalue của AᵀA và singular value của A là gì?
- Vì sao vector riêng của ma trận hiệp phương sai lại chính là hướng phương sai lớn nhất?

## 📚 Nguồn
- 3Blue1Brown — "Eigenvectors and eigenvalues" (Essence of Linear Algebra).
- StatQuest — PCA & SVD.
