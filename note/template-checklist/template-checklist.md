# 📋 Template / Checklist — Plan xử lý dữ liệu ML

> Quy trình chuẩn "lần sau cứ theo đây mà làm" cho một bài ML. Trọng tâm **Lớp LÀM (90%)** — chọn + làm sạch + biến đổi dữ liệu đúng trước khi chạy thuật toán ([[dinh-huong-hoc]]). Tick `[x]` từng mục khi xong.

**Cập nhật:** 2026-06-21 (bổ sung: quy tắc scale theo ĐỘ LỚN · 4 nỗi sợ leakage · ensemble bias/variance · chính quy hóa ≠ chuẩn hóa) · **Liên quan:** [[xu-ly-du-lieu]] · [[SECOND_BRAIN]]

> 🥇 **Nguyên tắc xuyên suốt — CHỐNG RÒ RỈ (leakage):** mọi thứ "học từ dữ liệu" (μ/σ để scale, median để điền, danh mục để encode, cột để chọn) phải **fit CHỈ trên train** rồi transform test. Gói trong `Pipeline` để khỏi quên. Sai chỗ này = điểm test ảo cao, ra đời sụp.

---

## ✅ Bước 0 — Xác định vấn đề  → [[xac-dinh-van-de]]
- [ ] Mục tiêu là gì? **Hồi quy** (đoán số) hay **Phân loại** (đoán lớp)?
- [ ] Đâu là cột **nhãn (y)**? Đâu là đặc trưng (X)?
- [ ] Sai lầm nào **tốn kém hơn** (FP hay FN)? → chốt **độ đo** từ đầu ([[danh-gia-mo-hinh]]).
- [ ] Với bài "nhiều file + vài từ khóa": **chọn đúng file/cột liên quan** trước (giải sai bài = vứt).

## ✅ Bước 1 — Nạp & Khám phá (EDA)  → [[thong-ke]] · [[phan-loai-thong-ke]]
- [ ] `df.shape`, `df.dtypes`, `df.head()`, `df.describe()`
- [ ] `df.isnull().mean()` — tỉ lệ thiếu mỗi cột · `missingno` (bar/matrix/heatmap)
- [ ] Phân phối từng cột (hist), phát hiện **lệch (skew)** & **outlier** (boxplot)
- [ ] Ma trận **tương quan** ([[tuong-quan]]) — phát hiện cột trùng/đa cộng tuyến
- [ ] Cân bằng lớp? (bài phân loại) → nếu lệch nặng xem [[class-imbalance]]

## ✅ Bước 2 — Làm sạch

### 2a. Dữ liệu thiếu  → [[xu-ly-du-lieu-thieu]]
- [ ] Nhận diện cơ chế: **MCAR** (ngẫu nhiên) / **MAR** (phụ thuộc cột khác) / **MNAR** (phụ thuộc chính nó)
```
thiếu >50–60%        → XÓA cột
thiếu <5% & MCAR     → xóa hàng / điền đơn giản
số gần chuẩn         → mean    ·  số lệch/outlier → median ✅
phân loại            → mode (most_frequent)
có quan hệ giữa cột  → KNN     ·  muốn chính xác → MICE (học→suy đoán)
MNAR                 → thêm cờ is_missing RỒI mới điền
dùng XGBoost         → để model tự lo
```
- [ ] Imputer **fit trên train** rồi transform test (leakage!)
- [ ] 💻 Template code: `code-practice/missing-data-missingno.ipynb` → `handle_missing(df, ...)`

> 🔑 **Keyword MICE** (`IterativeImputer`) = điền thiếu bằng cách **LẶP**: mỗi vòng huấn luyện một mô hình hồi quy cho từng cột, dùng các cột khác **dự đoán** cột thiếu, lặp đến hội tụ. Khác điền hằng số (median/mode) — đây là "**học một vùng rồi suy đoán thả vào**". Cùng họ model-based: **KNN Imputer** (theo lân cận). Nhận diện thiếu: thư viện **missingno**.

### 2b. Ngoại lai (outliers) & trùng lặp
- [ ] Phát hiện outlier: IQR / z-score / boxplot → xóa, cắt (clip), hoặc giữ + dùng **Robust scaling**
- [ ] `df.drop_duplicates()` — bỏ hàng trùng

## ✅ Bước 3 — Biến đổi

### 3a. Chuẩn hóa (scaling)  → [[chuan-hoa-du-lieu]]
- [ ] **Có cần không?** 🔑 Quy tắc gốc: **cần khi thuật toán so sánh cột bằng ĐỘ LỚN** (khoảng cách: KNN/SVM/K-means · gradient: GD/NN · hệ số: Regularization · phương sai: PCA). **KHÔNG cần** khi chỉ xét THỨ TỰ trong từng cột (cây/RF/XGBoost).
```
mặc định            → Standardization (z-score)  ← phổ biến nhất, bền outlier "khá"
cần biên [0,1]      → Min-Max (ảnh, NN)           ← NHẠY outlier
nhiều outlier       → Robust (median/IQR)         ← bền outlier "tốt"
cột lệch nặng       → log/Box-Cox TRƯỚC rồi mới z-score
```
- [ ] Scaler **fit trên train** (leakage!) · chỉ scale cột số (đừng đụng nhãn / one-hot 0/1)
- [ ] 💻 Demo: `code-practice/feature-scaling-demo.ipynb`

### 3b. Mã hóa biến phân loại  → [[encode-categorical]]
```
danh nghĩa (không thứ tự)   → One-Hot
CÓ thứ tự (Nhỏ<Vừa<Lớn)     → Ordinal/Label
high-cardinality            → Target/Mean encoding (⚠️ rò rỉ → dùng CV)
nhãn đa lớp (output)        → one-hot cho softmax ([[softmax]])
```

## ✅ Bước 4 — Đặc trưng

### 4a. Tạo đặc trưng  → [[feature-engineering]]
- [ ] Dùng **domain knowledge** tạo cột mới hữu ích (tỉ lệ, ngày→thứ/mùa, gộp nhóm...)

### 4b. Chọn đặc trưng  → [[feature-selection]]
```
Filter (nhanh)    → bỏ low-variance · bỏ cột tương quan cao · MI (bắt phi tuyến)
Wrapper (chính xác) → RFE / RFECV
Embedded          → Lasso (L1) tự bỏ cột · RF importance + Permutation
```
- [ ] Chọn đặc trưng **trong CV / chỉ trên train** (leakage!)

## ✅ Bước 5 — Chia dữ liệu  → [[cross-validation]] · [[overfitting]]
- [ ] `train_test_split(..., stratify=y)` (phân loại) — chia TRƯỚC mọi bước fit ở trên
- [ ] Cân nhắc **K-Fold cross-validation** để đánh giá ổn định
- [ ] Gói toàn bộ tiền xử lý + model vào **`Pipeline`** → fit/transform đúng chỗ

## ✅ Bước 6 — Chọn & Huấn luyện mô hình  → [[chon-mo-hinh]]
- [ ] Bắt đầu **baseline đơn giản** ([[linear-regression]] / [[logistic-regression]]) rồi nâng dần ([[random-forest]] → [[xgboost]])
- [ ] Bài đoán SỐ → hồi quy · bài đoán LỚP → phân loại
- [ ] Dữ liệu bảng → cây/boosting thường thắng; phi tuyến rõ → đừng dùng tuyến tính thuần

## ✅ Bước 7 — Chống Overfitting  → [[overfitting]] · [[bias-variance]]
```
Hướng 1: Regularization ([[regularization]]) — Ridge/Lasso/ElasticNet (GIỮ feature, CO hệ số → "đưa vào khung")
Hướng 2: Feature selection ([[feature-selection]]) — BỎ BỚT feature (nhiễu/trùng/ít liên quan y)
Ensemble: Bagging↓variance ([[random-forest]]) · Boosting↓bias ([[xgboost]]) · Stacking gộp nhiều model
Khác: thêm dữ liệu · đơn giản hóa model · early stopping · cross-validation
```
- [ ] Chọn λ / độ phức tạp tối ưu bằng **cross-validation** (RidgeCV/LassoCV) — tìm **đáy chữ U** của tổng lỗi ([[bias-variance]]: tổng lỗi GIẢM rồi mới TĂNG, không phải đi lên thẳng)
- [ ] ⚠️ **Đừng nhầm tên:** Chính quy hóa (regularization, chống overfit) ≠ Chuẩn hóa (scaling, tiền xử lý — Bước 3a)

> 🔥 **4 NỖI SỢ "ảo tưởng thành công" (con số đẹp nhưng dối trá) — kiểm trước khi tin kết quả:**
> | Nỗi sợ | Trông thì | Thật ra | Phòng thủ |
> |---|---|---|---|
> | **Overfitting** | train ~100% | học thuộc nhiễu → test tệ | CV · regularization · feature selection |
> | **Data leakage** ⚠️ đáng sợ NHẤT | cả **test** cũng cao | hỏng luôn thước đo → không biết mình sai | fit (scale/impute/encode/select) **chỉ trên train** |
> | **Lệch lớp** | Accuracy 99% | Recall 0% | F1/PR-AUC ([[class-imbalance]]) |
> | **Sampling bias** | giỏi trên mẫu | mẫu không đại diện | mẫu đủ lớn & đại diện ([[lay-mau]]) |
> 💡 *Kết quả đẹp bất thường → nghi RÒ RỈ trước tiên.*

## ✅ Bước 8 — Đánh giá  → [[danh-gia-mo-hinh]] · [[metric-hoi-quy]]
```
Phân loại cân bằng   → Accuracy
Phân loại lệch       → Precision/Recall/F1 · PR-AUC (KHÔNG Accuracy)
So sánh model        → AUC-ROC
Hồi quy              → MAE/RMSE/R²/Adjusted R²
```
- [ ] Chỉ đánh giá trên **tập test** (dữ liệu model chưa thấy)
- [ ] Nhìn confusion matrix + chốt theo chi phí FP/FN của bài toán

---

## 🧭 Tóm tắt 1 dòng
**Xác định vấn đề → EDA → làm sạch (thiếu/outlier) → biến đổi (scale/encode) → đặc trưng (tạo/chọn) → chia (chống leakage) → train baseline→mạnh → chống overfit → đánh giá đúng độ đo.**

## 📚 Nguồn
- Tổng hợp slide L1–L5 (TS. Cao Tiến Dũng) + các note atomic trong [[SECOND_BRAIN]].
- Template code: `code-practice/` (missing-data-missingno · logistic/softmax demos).
