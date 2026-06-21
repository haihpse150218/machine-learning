# Xử lý dữ liệu — Quy trình thực tế (Lớp LÀM, 90%)

> Tóm tắt 1 câu: Đây là **90% công việc thật** (quy tắc 90/10 trong [[dinh-huong-hoc]]): biến dữ liệu thô bẩn, thiếu, lệch → thành dữ liệu **sạch, đúng định dạng** mà thuật toán nuốt được. Thuật toán chỉ chạy tốt khi dữ liệu "thả vào" đã đúng.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟢 Trọng tâm (Lớp LÀM)
**📖 Lộ trình:** Nhánh D (Xử lý dữ liệu / Lớp LÀM) · #1 ← nền tảng [[thong-ke]] · [[phan-phoi-xac-suat]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #data #pipeline #core #lop-lam

---

## 🔄 Quy trình tổng thể (pipeline)

```
[Bước 0: XÁC ĐỊNH VẤN ĐỀ]  →  1. Thu thập  →  2. Khám phá (EDA)  →  3. Làm sạch
   →  4. Biến đổi  →  5. Feature engineering  →  6. Chia dữ liệu  →  (model)
```
> ❗ Bước 0 [[xac-dinh-van-de]] đứng trước tất cả — chốt sai vấn đề thì cả pipeline vô nghĩa.

> Vòng lặp, không thẳng tuột: EDA xong thường quay lại làm sạch, thêm đặc trưng rồi EDA tiếp.

## 1. 📥 Thu thập + CHỌN LỌC dữ liệu
- Nguồn: file CSV/Excel, database (SQL), API, web scraping, dữ liệu công khai (Kaggle...).
- **Đây là phần "bục mặt"** thầy nói — bài tập thật thường không cho sẵn dữ liệu.

> 🎓 **Dạng bài tập thầy giao:** cho **bối cảnh + nhiều tệp dữ liệu + chỉ vài keyword** → **tự chọn lọc** tệp/cột nào liên quan, ghép lại → rồi mới chạy thuật toán. Chọn sai dữ liệu = thuật toán đúng vẫn ra rác.

- **Lấy mẫu đại diện:** chọn mẫu từ population sao cho không lệch → xem [[lay-mau]].
- **Kỹ năng chọn lọc dữ liệu (data selection):**
  - Đọc bối cảnh → xác định **mục tiêu dự đoán (target)** là gì.
  - Từ keyword → dò xem **tệp/cột nào chứa thông tin liên quan** tới target.
  - Loại tệp/cột **nhiễu, trùng, không liên quan** (giữ lại thì làm loãng tín hiệu).
  - Ghép nhiều tệp (join theo khóa chung: id, ngày...) cho đúng.
- Lưu ý bản quyền, tính đại diện (mẫu có lệch không → [[overfitting]]).

## 2. 🔍 Khám phá (EDA — Exploratory Data Analysis)
> Hiểu dữ liệu **trước khi** đụng vào — dùng [[thong-ke]].
- Xem `head()`, kiểu dữ liệu, kích thước.
- Thống kê mô tả từng cột: trung bình, trung vị, min/max, % thiếu.
- **Vẽ histogram** xem phân phối ([[phan-phoi-xac-suat]]) — lệch? có outlier?
- Xem tương quan giữa các cột ([[ma-tran-hiep-phuong-sai]] · [[tuong-quan]]).

## 3. 🧹 Làm sạch (cleaning)
| Vấn đề | Cách xử lý |
|--------|-----------|
| **Dữ liệu thiếu (missing)** | Xóa hàng/cột nếu thiếu nhiều; hoặc **điền**: trung vị (số, lệch), trung bình (số, chuẩn), mode (phân loại), forward-fill (chuỗi thời gian), hoặc model dự đoán |
| **Trùng lặp (duplicates)** | Bỏ bản ghi lặp |
| **Outlier** | Xem là lỗi → sửa/bỏ; hay tín hiệu thật → giữ. Dựa vào phân phối ([[gauss-va-nhi-thuc]]) |
| **Sai kiểu/định dạng** | Ngày tháng, số bị lưu thành chữ, đơn vị lẫn lộn → chuẩn hóa |
| **Sai chính tả / nhãn lệch** | "Hà Nội" vs "ha noi" → gộp về một |

## 4. 🔧 Biến đổi (transformation)
- **Encode dữ liệu phân loại (categorical):**
  - *One-hot:* mỗi giá trị → 1 cột 0/1 (không có thứ tự: màu sắc, thành phố).
  - *Label/Ordinal:* gán số khi **có thứ tự** (thấp/vừa/cao → 0/1/2).
- **Scale / chuẩn hóa số:** → [[chuan-hoa-du-lieu]]
  - *Z-score* (gần chuẩn) · *Min-max* (về [0,1]).
  - **Log-transform** cho cột lệch nặng ([[phan-phoi-xac-suat]]).
- Vì sao cần: model dựa trên khoảng cách/gradient bị cột thang đo lớn lấn át.

## 5. 🛠️ Feature engineering
- Tạo đặc trưng mới giàu thông tin hơn (vd: từ "ngày sinh" → "tuổi"; gộp, tách, tỉ lệ).
- Giảm chiều nếu quá nhiều đặc trưng → [[pca]].
- Chi tiết: [[feature-engineering]].

## 6. ✂️ Chia dữ liệu (cực kỳ quan trọng)
- Tách **train / validation / test** → đánh giá trên dữ liệu chưa thấy ([[overfitting]]).
- Mất cân bằng lớp (imbalanced) → oversample/undersample/SMOTE.

## ⚠️ Lỗi chí mạng (nhớ kỹ)
- **Data leakage:** fit scaler / điền thiếu / chọn đặc trưng tính **trên cả tập** rồi mới chia → test bị "nhìn trộm" → điểm ảo cao, ra đời sụp. **Luôn fit trên train, áp lên test.**
- **Điền thiếu bằng trung bình cho dữ liệu lệch** → kéo lệch thêm; dùng trung vị.
- **One-hot cột có quá nhiều giá trị** → bùng nổ số cột (high cardinality).
- **Bỏ outlier vô tội vạ** — có khi đó là tín hiệu quan trọng (gian lận, lỗi hệ thống).
- **Quên kiểm mẫu có đại diện không** → mô hình lệch ngay từ dữ liệu.

---

## 🔗 Liên kết
- **Nền tảng:** [[thong-ke]] · [[phan-phoi-xac-suat]] · [[dinh-huong-hoc]]
- **Đi sâu từng bước:** [[chuan-hoa-du-lieu]] · [[feature-engineering]] · [[xu-ly-du-lieu-thieu]] · [[encode-categorical]]
- **Dẫn tới:** [[overfitting]] (chia dữ liệu) · [[pca]] (giảm chiều)

## ❓ Câu hỏi mở
- Khi nào nên xóa hàng thiếu, khi nào nên điền? Ngưỡng % thiếu bao nhiêu?
- Làm sao phát hiện data leakage trong pipeline của mình?

## 📚 Nguồn
- scikit-learn — `preprocessing`, `impute`, `Pipeline` (fit trên train, tránh leakage).
- Andrew Ng — Data-Centric AI.
