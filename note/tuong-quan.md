# Tương quan (Correlation)

> Tóm tắt 1 câu: Tương quan đo **2 biến đi cùng nhau chặt thế nào** (theo hướng tuyến tính), chuẩn hóa về **[−1, +1]**. Nhưng nhớ kỹ: **tương quan ≠ nhân quả**.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh C (Thống kê) ← cần [[phuong-sai]] · [[ma-tran-hiep-phuong-sai]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #thong-ke #eda #feature

---

## 💡 Ý chính
- **Tương quan (r):** khi biến X tăng thì Y có xu hướng tăng/giảm theo không, và chặt cỡ nào.
- Giá trị nằm trong **[−1, +1]**:
  - `+1`: thuận hoàn hảo (X tăng → Y tăng đều).
  - `0`: không tương quan **tuyến tính**.
  - `−1`: nghịch hoàn hảo (X tăng → Y giảm đều).

## 🔢 Tương quan vs Hiệp phương sai
```
Pearson r = cov(X, Y) / (σ_X · σ_Y)
```
- **Hiệp phương sai** ([[ma-tran-hiep-phuong-sai]]) đo cùng dao động nhưng **phụ thuộc đơn vị** → khó so sánh (cov của "đồng × kg" nghĩa gì?).
- **Tương quan** = hiệp phương sai **chuẩn hóa** (chia cho tích độ lệch chuẩn) → bỏ đơn vị, luôn ở [−1,1] → **so sánh được giữa các cặp biến**.

| Loại | Dùng cho |
|------|----------|
| **Pearson** | Quan hệ **tuyến tính**, biến số |
| **Spearman** | Quan hệ **đơn điệu** (theo hạng), hợp dữ liệu **thứ bậc** (ordinal) |

> 💡 **r có đáng tin không?** Dùng **kiểm định tương quan Pearson** (`stats.pearsonr` → trả về cả r lẫn p-value): H₀ = "X, Y độc lập"; nếu **p < 0.05** → tương quan **có ý nghĩa thống kê**, không phải ngẫu nhiên. Chi tiết: [[kiem-dinh-gia-thuyet]].

## ⚠️ Tương quan ≠ Nhân quả (quan trọng nhất)
> Hai biến đi cùng nhau **không** có nghĩa cái này **gây ra** cái kia.

- Kinh điển: **doanh số kem** tương quan với **số vụ chết đuối** → không phải kem gây chết đuối; cả hai do **biến ẩn**: trời nóng (mùa hè).
- 3 khả năng khi thấy X, Y tương quan: X→Y, Y→X, hoặc **biến thứ 3 (confounder)** gây cả hai (hoặc trùng hợp ngẫu nhiên).
- Muốn kết luận nhân quả → cần **thí nghiệm có kiểm soát** (A/B test, [[kiem-dinh-gia-thuyet]]), không chỉ nhìn tương quan.

## 🎯 Mục đích chính: chọn thuộc tính (2 nguyên tắc vàng)
> "Dùng thằng này đánh giá thằng kia" — tương quan giúp biết **cột nào dùng được, cột nào bỏ**.

```
1. RELEVANCE  — mỗi feature xᵢ phải TƯƠNG QUAN với Y (target)
                → có liên hệ với kết quả thì mới giúp dự đoán
                → cột KHÔNG tương quan với Y  →  bỏ (vô dụng)

2. REDUNDANCY — các feature x₁, x₂, x₃... nên ĐỘC LẬP với nhau (tương quan thấp)
                → 2 cột tương quan cao với nhau = trùng thông tin (đa cộng tuyến)
                → giữ 1, bỏ bớt
```
> Đây là nguyên tắc **mRMR**: *Maximum Relevance (với Y) + Minimum Redundancy (giữa các X)* — feature lý tưởng: **liên quan mạnh tới Y, độc lập tối đa với nhau**.

- **Bước đầu nhìn dữ liệu → xét mặt TUYẾN TÍNH trước** (Pearson, scatter, heatmap) cho nhanh & dễ.
- Quan hệ **phi tuyến / nhiều mặt** phức tạp hơn → xử lý sau (mutual information, mô hình phi tuyến).

## 🧱 Khi x₁, x₄ tương quan → GOM thành 1 cột đại diện
> Mục đích: bớt cột trùng lặp → **mô hình đỡ phức tạp**, nhanh hơn, ít [[overfitting]] hơn.

| Cách gom | Khi nào |
|----------|---------|
| **Bỏ bớt 1 cột** | Đơn giản nhất, khi 2 cột gần như trùng |
| **Tạo cột tổng hợp thủ công** | Có ý nghĩa miền: vd cao + cân → **BMI**; thu + chi → tỉ lệ tiết kiệm ([[feature-engineering]]) |
| **PCA** ⭐ | Nhiều cột tương quan → gom thành vài **trục đại diện độc lập** (principal components) → [[pca]] |

> 💡 **Đây chính là PCA:** nó tự động *xoay* các cột tương quan thành ít trục mới — mỗi trục là một "cột đại diện" gom thông tin chung, các trục **độc lập nhau** (giải quyết triệt để redundancy). Vòng tròn khép với Nhánh B: [[ma-tran-hiep-phuong-sai]] → [[tri-rieng-vector-rieng]] → [[pca]].
>
> ⚠️ Đánh đổi: cột đại diện (PCA) **khó diễn giải** hơn cột gốc — gom xong khó nói "cột này nghĩa là gì".

## ⚙️ Ứng dụng trong ML
- **EDA:** vẽ **ma trận tương quan (heatmap)** để thấy cặp biến liên quan.
- **Feature selection** ([[feature-engineering]]): áp 2 nguyên tắc trên (relevance + redundancy).
- Nối [[pca]]: PCA gỡ tương quan giữa các biến thành các trục độc lập (giải quyết redundancy).

## 📊 Minh họa bằng scatter plot (slide tr.38)
> Mỗi mức r trông như thế nào trên đồ thị phân tán:

```
r = +1.0  điểm thẳng tắp, dốc lên       |  r = −1.0  thẳng tắp, dốc xuống
r = +0.8  đám mây bám sát đường lên      |  r = −0.8  bám sát đường xuống
r = +0.4  đám mây lỏng, hơi dốc lên      |  r = −0.4  lỏng, hơi dốc xuống
r =  0.0  đám mây TRÒN, vô hướng
```
- |r| càng gần 1 → điểm càng **bám sát đường thẳng**; dấu = **hướng** (lên/xuống).
- **Ô "Phi tuyến: r ≈ 0":** điểm tạo **hình chữ U** rõ ràng → quan hệ rất chặt **nhưng r ≈ 0**.
  → Bằng chứng sống: r chỉ bắt **tuyến tính**, **mù** với phi tuyến. **Luôn vẽ scatter, đừng tin mỗi con số r.**

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **r = 0 ≠ độc lập:** chỉ nói không quan hệ **tuyến tính**; vẫn có thể quan hệ phi tuyến (vd hình chữ U — xem slide tr.38).
- **Nhạy outlier:** vài điểm lạ làm r méo hẳn.
- **Anscombe's quartet:** 4 tập dữ liệu **cùng r** nhưng hình dạng khác hẳn → luôn **vẽ scatter plot**, đừng tin mỗi con số.
- **Spurious correlation:** tương quan giả do trùng hợp/biến ẩn → đừng vội kết luận.

---

## 🔗 Liên kết
- **Tiền đề (cần biết trước):** [[phuong-sai]] · [[ma-tran-hiep-phuong-sai]]
- **Liên quan tới:** [[feature-engineering]] (chọn/bỏ feature) · [[pca]] · [[kiem-dinh-gia-thuyet]] (kiểm chứng nhân quả)
- **Thuộc:** [[thong-ke]]

## ❓ Câu hỏi mở
- Làm sao phân biệt tương quan thật với spurious correlation?
- Khi nào tương quan cao giữa 2 feature thực sự gây hại cho model?

## 📚 Nguồn
- StatQuest — "Pearson's Correlation".
- Anscombe's quartet (minh họa cùng thống kê, khác hình).
