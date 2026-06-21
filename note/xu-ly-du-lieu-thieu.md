# Xử lý dữ liệu thiếu (Missing Data)

> Tóm tắt 1 câu: Dữ liệu thật **luôn có ô trống** (NaN), mà nhiều thuật toán không nuốt được — phải **xóa, điền, hoặc đánh dấu** cho đúng; bản thân việc "bị thiếu" đôi khi cũng là một tín hiệu.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟢 Trọng tâm (Lớp LÀM)
**📖 Lộ trình:** Nhánh D (Xử lý dữ liệu) · #5 ← cần [[xu-ly-du-lieu]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #data #missing #lop-lam

---

## 💡 Trước tiên: vì sao thiếu? (3 kiểu)
> Hiểu **lý do thiếu** mới chọn cách xử lý đúng.

| Kiểu | Nghĩa | Ví dụ |
|------|-------|-------|
| **MCAR** (thiếu hoàn toàn ngẫu nhiên) | Thiếu không liên quan gì | máy đo lỗi ngẫu nhiên |
| **MAR** (thiếu ngẫu nhiên có điều kiện) | Thiếu phụ thuộc **cột khác** quan sát được | nam ít khai cân nặng hơn nữ |
| **MNAR** (thiếu không ngẫu nhiên) | Thiếu phụ thuộc **chính giá trị bị giấu** | người thu nhập cao giấu thu nhập |

> MNAR nguy hiểm nhất: bỏ qua → lệch nặng. Việc thiếu mang **tín hiệu** → nên đánh dấu (xem dưới).

## 🔎 Nhận diện: làm sao BIẾT thiếu & đoán cơ chế?
```
df.isnull().sum()      → đếm ô thiếu mỗi cột
df.isnull().mean()     → tỉ lệ thiếu mỗi cột (vd >50% → ứng viên loại cột)
```
**Visualize bằng `missingno`** (trực giác nhanh hơn bảng số):
| Hàm | Thấy gì |
|-----|---------|
| `msno.bar(df)` | tỉ lệ ĐẦY mỗi cột — cột thấp = thiếu nhiều |
| `msno.matrix(df)` | bản đồ thiếu theo dòng — **sắp xếp** theo 1 cột để lộ cấu trúc |
| `msno.heatmap(df)` | **nullity correlation**: các cột có thiếu CÙNG nhau không |
| `msno.dendrogram(df)` | gom nhóm các cột thiếu theo nhau |

**Phân biệt cơ chế từ dữ liệu:**
```
MCAR → vạch thiếu RẢI ĐỀU ngẫu nhiên; heatmap ≈ 0
MAR  → tỉ lệ thiếu KHÁC nhau theo cột KHÁC → kiểm: df.groupby('cot_khac')['x'].apply(lambda s: s.isnull().mean())
MNAR → KHÔNG chứng minh được từ dữ liệu (giá trị đã mất) → dùng hiểu biết nghiệp vụ;
       dấu hiệu gián tiếp: trung bình quan sát được bị lệch (vd điểm thấp hay bị giấu → mean bị kéo lên)
```
> 💻 Demo trực quan đầy đủ: `code-practice/missing-data-missingno.ipynb` (sinh sẵn 3 cơ chế MCAR/MAR/MNAR + 4 biểu đồ missingno).

## 🔧 Các cách xử lý

### 1. Xóa (deletion)
- **Xóa hàng** (listwise): khi thiếu **ít** và là MCAR.
- **Xóa cột:** khi cột thiếu **quá nhiều** (vd > 50–70%) → giữ lại cũng vô dụng.
- ⚠️ Rủi ro: mất dữ liệu; nếu không MCAR → **lệch** kết quả.

### 2. Điền (imputation)
| Loại cột | Điền bằng |
|----------|-----------|
| Số, gần chuẩn | **trung bình (mean)** |
| Số, lệch / có outlier | **trung vị (median)** ✅ an toàn hơn |
| Phân loại | **mode** (hay gặp nhất) hoặc category "Unknown" |
| Chuỗi thời gian | **forward/backward fill** (lấy giá trị kề) |
| Nâng cao | **KNN imputer**, hồi quy, **MICE** (lặp) — chính xác hơn, tốn hơn |

### 3. Đánh dấu (missing indicator)
- Thêm **cột cờ 0/1** "ô này từng thiếu" → giữ lại tín hiệu của việc thiếu (quan trọng với MNAR).

### 4. Để model tự xử lý
- **XGBoost / LightGBM** xử lý NaN **natively** — không cần điền thủ công.

> 🧠 **Điền bằng THUẬT TOÁN học (model-based):** thay vì điền hằng số, **học từ các cột khác rồi suy đoán** giá trị thiếu — KNN (lấy lân cận), **MICE** (`IterativeImputer`: huấn luyện hồi quy/cột, lặp). Chính xác hơn vì tận dụng quan hệ giữa đặc trưng; cần **scale** trước KNN.

## 📋 Checklist / Template (lần sau cứ theo đây mà làm)
```
B0 Nhận diện : df.isnull().mean()  +  missingno (bar/matrix/heatmap) → đoán MCAR/MAR/MNAR
B1 Theo cột  :
   thiếu >50–60%        → XÓA cột
   thiếu <5% & MCAR     → xóa hàng / điền đơn giản
   số gần chuẩn         → mean      ·  số lệch/outlier → median ✅
   phân loại            → mode (most_frequent)
   có quan hệ giữa cột  → KNN       ·  muốn chính xác → MICE
   MNAR                 → thêm cờ is_missing RỒI mới điền
   dùng XGBoost         → để model tự lo
B2 Chống leakage : fit imputer CHỈ trên train → transform test (gói Pipeline)
B3 Kiểm tra      : df.isnull().sum().sum()==0 & phân phối cột không méo bất thường
```
> 💻 **Template code tái dùng** (`handle_missing(df, ...)` + demo missingno 3 cơ chế): `code-practice/missing-data-missingno.ipynb`.

## ⚠️ Lỗi chí mạng
- **Data leakage:** tính mean/median để điền phải **chỉ trên train**, rồi áp lên test. Tính trên cả tập = rò rỉ ([[overfitting]]).
- **Điền mean cho dữ liệu lệch** → kéo lệch thêm; dùng **median** ([[phan-phoi-xac-suat]]).
- **Mean imputation làm phương sai giảm giả tạo** → model tưởng dữ liệu ít dao động hơn thực tế.
- **Bỏ qua missingness có ý nghĩa (MNAR)** → mất tín hiệu; dùng **indicator**.
- **Điền trước khi chia train/test** → leakage. Luôn chia trước, fit imputer trên train.

---

## 🔗 Liên kết
- **Tiền đề (cần biết trước):** [[xu-ly-du-lieu]]
- **Liên quan tới:** [[chuan-hoa-du-lieu]] · [[phan-phoi-xac-suat]] · [[thong-ke]]
- **Cảnh báo:** [[overfitting]] (leakage khi điền)

## ❓ Câu hỏi mở
- Ngưỡng % thiếu bao nhiêu thì nên xóa cột thay vì điền?
- Làm sao đoán dữ liệu thuộc MCAR / MAR / MNAR?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L5_Regularization_FeatureSelection.pdf` Phần 01 — MCAR/MAR/MNAR + impute).
- scikit-learn — `SimpleImputer`, `KNNImputer`, `IterativeImputer` (MICE), `MissingIndicator`.
- StatQuest — "Imputing missing data".
