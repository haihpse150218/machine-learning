# Encode dữ liệu phân loại (Categorical Encoding)

> Tóm tắt 1 câu: Model chỉ hiểu **số**, không hiểu chữ ("Hà Nội", "đỏ") — phải chuyển dữ liệu phân loại thành số, nhưng **chuyển sai cách sẽ bịa ra thứ tự giả** làm model hiểu nhầm.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟢 Trọng tâm (Lớp LÀM)
**📖 Lộ trình:** Nhánh D (Xử lý dữ liệu) · #4 ← cần [[xu-ly-du-lieu]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #data #encoding #lop-lam
**Nguồn slide:** `L5_Regularization_FeatureSelection.pdf` Phần 01 (slide 6) — TS. Cao Tiến Dũng

---

## 💡 Trước tiên: 2 loại dữ liệu phân loại
| Loại | Có thứ tự? | Ví dụ |
|------|-----------|-------|
| **Nominal (định danh)** | ❌ Không | màu sắc, thành phố, giới tính |
| **Ordinal (thứ bậc)** | ✅ Có | size S/M/L, thấp/vừa/cao, hạng sao |

> Chọn cách encode **dựa vào loại này** — đây là gốc của mọi lỗi.

## 🔧 Các cách encode

| Cách | Làm gì | Dùng cho |
|------|--------|----------|
| **Label / Ordinal** | gán số 0,1,2... theo thứ tự | **Ordinal** (có thứ tự thật) |
| **One-hot** | mỗi giá trị → 1 cột 0/1 | **Nominal**, ít giá trị |
| **Target / Mean** | thay bằng trung bình target của nhóm | Nominal **nhiều giá trị** (cẩn thận leakage) |
| **Frequency / Count** | thay bằng tần suất xuất hiện | Nominal nhiều giá trị |
| **Hashing / Binary** | nén thành ít cột | Cardinality rất cao |
| **Embedding** | học vector số (neural net) | Cardinality cực cao (text, ID) |

## ⚠️ Lỗi kinh điển: Label encoding cho Nominal
```
Màu:  đỏ→0, xanh→1, vàng→2
Model hiểu nhầm:  đỏ < xanh < vàng,  và (đỏ+vàng)/2 = xanh  ← VÔ NGHĨA!
```
- Với **nominal**, gán số tạo **thứ tự giả** → model (nhất là tuyến tính, KNN) học sai.
- *Cơ chế vì sao sai* (model nhân ma trận + trọng số, tin con số là độ lớn thật): xem [[tu-vung-thong-ke]].
- ✅ Cách đúng cho nominal: **one-hot** (mỗi màu một cột 0/1, không có thứ tự).
- ❗ Ngoại lệ: **cây quyết định / Random Forest** ít nhạy với label encoding hơn (chia theo ngưỡng).

## 🎯 Mục tiêu encode theo loại (AI "thấy" gì?)
> Mấu chốt: encode = quyết định **model được phép thấy quan hệ gì** giữa các giá trị.

| Loại | Mục tiêu khi map sang số | Cách đạt |
|------|--------------------------|----------|
| **Định danh (Nominal)** | ❌ **KHÔNG** để AI thấy độ lớn/thứ tự (vì không có) → tránh nhân ma trận ra quan hệ giả | **One-hot**: mỗi loại 1 cột 0/1, độc lập, "khoảng cách" giữa mọi loại bằng nhau |
| **Thứ bậc (Ordinal)** | ✅ **CÓ**: muốn AI thấy **thứ tự & độ lớn** để **so sánh** (nhẹ < vừa < nặng) | **Label/Ordinal**: gán số **giữ đúng thứ tự**; cân khoảng cách nếu cần (vd nhẹ=1, vừa=2, nặng=4 nếu bước cuối nặng hơn) |

- **Nominal:** cần *phân tích* để gom/đặt nhóm hợp lý trước khi one-hot (vd "ha noi"="Hà Nội"), tránh bùng nổ cột.
- **Ordinal:** chính vì muốn AI **compare được độ lớn**, phải map số sao cho phép nhân `W·x` phản ánh đúng mức chênh giữa các bậc.

## 🧭 Chọn nhanh
```
Có thứ tự thật?  → Label/Ordinal
Không, ít giá trị (≤ ~10-15)?  → One-hot
Không, RẤT nhiều giá trị?  → Target / Frequency / Hashing / Embedding
```
> 📌 **Ví dụ One-Hot (slide):** Màu ∈ {Đỏ, Xanh, Vàng} → 3 cột `is_Đỏ, is_Xanh, is_Vàng`, mỗi hàng đúng **một cột = 1**, còn lại 0 → không có thứ tự giả.

## ⚠️ Lỗi thường gặp khác
- **One-hot cột cardinality cao** (vd 10.000 mã sản phẩm) → bùng nổ 10.000 cột → chậm + [[overfitting]]. Dùng target/hashing/embedding.
- **Target encoding rò rỉ nhãn (leakage):** tính trung bình target phải **chỉ trên train** (hoặc theo fold trong cross-validation) + smoothing. Tính trên cả tập = gian lận → điểm ảo.
- **Giá trị lạ ở test** (category chưa thấy lúc train) → phải xử lý (gán "unknown", hoặc 0). Không thì lỗi/ NaN.
- **Đừng scale cột one-hot 0/1** một cách vô nghĩa ([[chuan-hoa-du-lieu]]).
- **Dummy variable trap** (model tuyến tính): one-hot k giá trị → bỏ bớt 1 cột để tránh đa cộng tuyến (`drop_first`).

---

## 🔗 Liên kết
- **Tiền đề (cần biết trước):** [[xu-ly-du-lieu]]
- **Liên quan tới:** [[feature-engineering]] · [[chuan-hoa-du-lieu]]
- **Cảnh báo:** [[overfitting]] (target encoding leakage)

## ❓ Câu hỏi mở
- Ngưỡng "nhiều giá trị" để chuyển từ one-hot sang target/embedding là bao nhiêu?
- Target encoding cần smoothing thế nào để vừa mạnh vừa không leakage?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L5_Regularization_FeatureSelection.pdf` Phần 01, slide 6).
- scikit-learn — `OneHotEncoder`, `OrdinalEncoder`; thư viện `category_encoders`.
- Kaggle — "Categorical Encoding" tutorials.
