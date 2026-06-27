# Chuẩn hóa dữ liệu (Scaling / Normalization)

> Tóm tắt 1 câu: Đưa các cột số về **cùng thang đo** để không cột nào (vì đơn vị lớn) lấn át cột khác — giúp thuật toán dựa trên **khoảng cách** hoặc **gradient** học đúng và nhanh.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟢 Trọng tâm (Lớp LÀM)
**📖 Lộ trình:** Nhánh D (Xử lý dữ liệu) · #3 ← cần [[xu-ly-du-lieu]] · [[phan-phoi-xac-suat]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #data #scaling #lop-lam

---

## 💡 Vì sao cần
- Cột "lương" (hàng triệu) và cột "tuổi" (vài chục) khác thang đo → model tưởng lương **quan trọng hơn** chỉ vì số to.
- Ảnh hưởng tới:
  - **Thuật toán khoảng cách** (KNN, K-means, SVM): khoảng cách bị cột lớn thống trị.
  - **Gradient descent** ([[gradient-descent]]): đường hội tụ **zig-zag**, chậm.
  - **[[pca]]**: hướng phương sai lớn bị quyết định bởi đơn vị đo, không phải cấu trúc.
- ❗ **Không cần** với cây quyết định / Random Forest / XGBoost — chúng chia theo **ngưỡng**, bất biến với việc đổi thang đo.

> 🔑 **Quy tắc gốc (lời của mình):** *cần scale khi thuật toán so sánh các cột bằng **ĐỘ LỚN** (magnitude) — khoảng cách (KNN/SVM/K-means), gradient/đạo hàm (GD/NN), độ lớn hệ số (regularization), phương sai (PCA). **KHÔNG cần** khi nó chỉ xét **THỨ TỰ** trong từng cột riêng (cây/RF/XGBoost) — đổi thang đo thì ngưỡng đổi theo nhưng rank không đổi → kết quả y hệt.*
> 💻 Demo trực quan (distance domination + MinMax/Standard/Robust + outlier): `code-practice/feature-scaling-demo.ipynb`.

## 🔧 Các cách chính

| Cách | Công thức | Kết quả | Bền ngoại lai? | Dùng khi |
|------|-----------|---------|----------------|----------|
| **Standardization (z-score)** | `(x − μ) / σ` | mean 0, std 1 | **Khá** | ✅ Mặc định; đa số mô hình tuyến tính, SVM, NN; dữ liệu gần [[gauss-va-nhi-thuc]] |
| **Min-Max** | `(x − min) / (max − min)` | về [0, 1] | **Kém** | Cần biên rõ ràng; ảnh/pixel; mạng nơ-ron |
| **Robust scaling** | `(x − median) / IQR` | theo median & IQR | **Tốt** | Dữ liệu **nhiều ngoại lai** |
| **Log / power transform** | `log(x)`, Box-Cox... | bớt lệch | — | Cột **lệch nặng (skewed)**, đuôi dài → làm trước rồi mới z-score |

> 📉 **Log cho dữ liệu LỆCH (skewed ≠ mất cân bằng lớp!):** phân phối đuôi dài (giá nhà, thu nhập) → `log` nén đuôi → cân đối hơn (gần chuẩn) → model tuyến tính học tốt hơn. *Lệch = cột số đuôi dài (note này) · Mất cân bằng = lớp 99/1 ([[class-imbalance]], dùng SMOTE) — 2 bài khác nhau, đừng nhầm.*
> 🔁 **Nếu log cả NHÃN y → phải nghịch đảo prediction:**
> ```python
> y_log = np.log1p(y)                 # log(1+y): log1p chịu được y=0
> pred  = np.expm1(model.predict(X))  # exp(.)−1: ĐƯA VỀ target gốc rồi mới đánh giá
> ```
> ⚠️ Quên `expm1` → so prediction (đang ở thang log) với target thật = sai bét. (Back-transform thiên lệch nhẹ do Jensen — nâng cao.)

> 🧨 **Vì sao "bền ngoại lai" khác nhau** = do dùng **thống kê nào**:
> - **Min-Max (Kém):** dùng `min/max` → **1 outlier** ở biên kéo cả thang → mọi giá trị thường dồn về gần 0 (demo: std phần thường bị bóp còn 0.003).
> - **Standard (Khá):** dùng `μ, σ` → outlier có ảnh hưởng nhưng **bị chia đều**, không cực đoan như min/max.
> - **Robust (Tốt):** dùng `median, IQR` → **bỏ qua đuôi** (10% trên/dưới) → gần như miễn nhiễm outlier (demo: giữ spread 0.739).

## 🧩 Scaling (theo cột) vs Normalization (theo hàng)
- **Scaling / Standardization:** xử lý **từng cột** (mỗi đặc trưng về cùng thang) — thường gặp nhất.
- **Normalization L2 (theo hàng):** đưa **mỗi vector mẫu** về độ dài 1 — dùng cho text/TF-IDF, khi quan tâm **hướng** hơn độ lớn.
> Hai cái tên hay bị lẫn — hỏi rõ "chuẩn hóa theo cột hay theo hàng?".

## ⚠️ Lỗi chí mạng — Data leakage
```
ĐÚNG:   fit (tính μ, σ / min, max) CHỈ trên tập TRAIN
        → rồi transform cả train và test bằng tham số đó

SAI:    tính μ, σ trên TOÀN BỘ dữ liệu rồi mới chia train/test
        → test "nhìn trộm" thống kê → điểm ảo cao, ra đời sụp
```
- Trong scikit-learn: `scaler.fit(X_train)` → `scaler.transform(X_train)` & `scaler.transform(X_test)`. Gói trong **Pipeline** để khỏi quên.
- Outlier cực mạnh làm hỏng z-score và min-max → cân nhắc Robust scaling hoặc xử lý outlier trước.
- Đừng scale cột **nhãn (target)** hay cột **one-hot 0/1** một cách vô nghĩa.

---

## 🔗 Liên kết
- **Tiền đề (cần biết trước):** [[xu-ly-du-lieu]] · [[phan-phoi-xac-suat]]
- **Liên quan tới:** [[gauss-va-nhi-thuc]] (z-score) · [[gradient-descent]] · [[pca]] · [[feature-engineering]]
- **Cảnh báo:** [[overfitting]] (data leakage)

## ❓ Câu hỏi mở
- Khi nào chọn z-score, khi nào min-max, khi nào robust?
- Có nên scale trước hay sau khi tạo đặc trưng mới ([[feature-engineering]])?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L5_Regularization_FeatureSelection.pdf` Phần 01 — Standardization vs Min-Max vs Robust).
- scikit-learn — `StandardScaler`, `MinMaxScaler`, `RobustScaler`, `Pipeline`.
- StatQuest — "Normalization vs Standardization".
