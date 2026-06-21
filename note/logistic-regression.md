# Hồi quy Logistic (Logistic Regression)

> Tóm tắt 1 câu: Dù tên có chữ "regression", đây là thuật toán **PHÂN LOẠI** — nó tính một tổ hợp tuyến tính `z` rồi **ép qua hàm sigmoid về (0,1)** thành **XÁC SUẤT**, sau đó cắt ngưỡng để ra lớp. Là **mô hình nền tảng** cho phân loại nhị phân & đa lớp.

**Ngày tạo:** 2026-06-14 · **Cập nhật:** 2026-06-21 (bám slide L4)
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh E (Thuật toán) · #3 ← cần [[linear-regression]] · [[loss-function]] · [[gradient-descent]] · → kế tiếp [[softmax]] (đa lớp) · [[danh-gia-mo-hinh]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #thuat-toan #supervised #phan-loai
**Nguồn slide:** `L4_LogisticsReg.pdf` — TS. Cao Tiến Dũng

---

## 💡 Ý chính
> ✍️ **Lời của mình:** *Lấy đúng cái đường thẳng của [[linear-regression]] (`z = b₀ + b₁x₁ + …`), nhưng đầu ra `z` chạy từ −∞ → +∞ thì không phải xác suất. Nên bóp nó qua **sigmoid** để ép về (0,1) → giờ đọc được là "xác suất thuộc lớp 1". Cắt ngưỡng (mặc định 0.5) → ra nhãn.*

- **Vì sao cần?** Nhiều bài thực tế cần **PHÂN LOẠI vào hạng mục**, không phải đoán số liên tục: lọc thư rác (rác/không), chẩn đoán bệnh (mắc/không), phát hiện gian lận, dự đoán rời bỏ khách hàng (churn).
- **Đừng để cái tên đánh lừa:** phần "regression" nằm ở chỗ nó **hồi quy tuyến tính trên log-odds** (xem dưới), nhưng mục tiêu cuối là **phân loại**.
- Đầu ra **RỜI RẠC**: **nhị phân** (2 lớp) hoặc **đa thức / multinomial** (>2 lớp → [[softmax]]).

## ⚙️ Cách hoạt động (mô hình nhị phân)
```
Đầu vào x → tổ hợp tuyến tính z → sigmoid → xác suất → cắt ngưỡng → lớp
1. Tuyến tính:  z = b₀ + b₁x₁ + … + bₚxₚ        (giống linear regression)
2. Sigmoid:     ŷ = σ(z) = 1 / (1 + e^−z)        = P(lớp 1) ∈ (0,1)
3. Cắt ngưỡng:  σ(z) ≥ 0.5 → lớp 1 ;  σ(z) < 0.5 → lớp 0
```
- **Ranh giới quyết định** là một **đường thẳng / siêu phẳng** (chỗ z = 0 ↔ σ = 0.5).

### Hàm Sigmoid & dạng logit (log-odds)
```
σ(z) = 1/(1+e^−z)   → biến z (∈ ℝ bất kỳ) thành XÁC SUẤT p ∈ (0,1)
logit:  log( p / (1−p) ) = b₀ + b₁x₁ + … + bₚxₚ   ← "log-odds" tuyến tính theo x
```
> 🔑 **Vì sao đẹp:** **log-odds tuyến tính theo x** → hệ số bⱼ **diễn giải được**: x tăng 1 đơn vị thì log-odds tăng bⱼ (odds nhân với e^bⱼ). Đây là lý do logistic vẫn là mô hình **white-box** (giải thích được), khác hộp đen.

## 🎚️ Ngưỡng quyết định (Decision Threshold) — "núm vặn"
- **Quy tắc:** `P(lớp 1) ≥ ngưỡng → lớp 1`, ngược lại lớp 0. **Mặc định 0.5** nhưng **không bắt buộc**.
- **Hạ ngưỡng** (vd 0.3): bắt **nhiều** ca dương hơn → ⬆ **Recall**, ⬇ Precision.
- **Nâng ngưỡng** (vd 0.7): thận trọng hơn → ⬆ **Precision**, ⬇ Recall.
- 👉 Chọn ngưỡng theo **chi phí sai lầm** của bài toán, không mặc định 0.5 → nối [[danh-gia-mo-hinh]] (Precision ↔ Recall) và [[class-imbalance]].

## 🔢 Hàm mất mát — Binary Cross-Entropy (Log Loss)
**Vì sao KHÔNG dùng MSE?** Ghép MSE với sigmoid → mặt chi phí **KHÔNG lồi** (nhiều cực tiểu địa phương), gradient descent dễ kẹt. Dùng **Log Loss** → mặt chi phí **LỒI**: một cực tiểu toàn cục duy nhất, luôn hội tụ, và **phạt nặng** dự đoán SAI mà tự tin.

```
Chi phí 1 mẫu (h = σ(z) = xác suất dự đoán lớp 1):
   y = 1:  −log(h)        (h→0 thì phạt → ∞: đoán sai về lớp 1)
   y = 0:  −log(1−h)      (h→1 thì phạt → ∞: đoán sai về lớp 0)

Gộp lại (Log Loss / Binary Cross-Entropy):
   L = −[ y·log(h) + (1−y)·log(1−h) ]
   J(b) = trung bình L trên toàn bộ mẫu  → cần TỐI THIỂU
```
> 🔁 Đây chính là **−log-likelihood** của phân phối **Bernoulli** → là [[maximum-likelihood]] áp cho phân loại. Cùng mạch với [[loss-function]].

## 📉 Huấn luyện bằng Gradient Descent
Áp **quy tắc chuỗi** cho đạo hàm Log Loss qua sigmoid → rút gọn **rất đẹp** (giống hệt dạng của [[linear-regression]], chỉ khác h là sigmoid):
```
Gradient:      ∂L/∂bⱼ = (σ(z) − y) · xⱼ          ← (sai số) × đặc trưng
Cập nhật:      bⱼ := bⱼ − α · (σ(z) − y) · xⱼ
```
- `σ(z) − y` = **sai số** (xác suất dự đoán − nhãn thật). `α` = tốc độ học.
- Lặp tới khi hội tụ — vì chi phí **lồi** ([[toi-uu-loi]]) nên **đảm bảo về cực tiểu toàn cục** → train nhiều lần ra kết quả như nhau (tái lập).

### 🧪 Ví dụ "Đậu hay Rớt?" (số giờ học → đậu/rớt)
```
Dữ liệu: x = số giờ học, y = 0 (Rớt) / 1 (Đậu)
B1: khởi tạo b₀=0, b₁=0
B2: x=1 → z=0 → σ(0)=0.5
B3: sai số = 0.5 − 0 = 0.5            (mẫu này thật ra Rớt, y=0)
B4: cập nhật b₁ = 0 − 0.1·0.5·1 = −0.05
B5: lặp qua mọi mẫu, nhiều epoch
→ Mô hình học được ranh giới quyết định quanh x ≈ 3.5 giờ
```

## 🌐 Đa lớp (>2 lớp) — chỉ tóm, chi tiết ở [[softmax]]
- **Softmax (multinomial):** MỘT mô hình, chuẩn hóa K logits thành **phân phối xác suất** (tổng = 1) → chọn lớp cao nhất. Khi K=2 suy biến về sigmoid.
- **One-vs-Rest (OvR):** huấn luyện K bộ phân loại nhị phân "lớp i vs phần còn lại", chọn lớp có xác suất cao nhất.

## 💻 Thực hành (Python)
```python
# --- Thuần NumPy: sigmoid + log loss + gradient descent ---
def sigmoid(z):     return 1 / (1 + np.exp(-z))
def log_loss(y, h): return -np.mean(y*np.log(h) + (1-y)*np.log(1-h))

b = np.zeros(X.shape[1]);  alpha, epochs = 0.1, 2000
for _ in range(epochs):
    h = sigmoid(X @ b)
    grad = X.T @ (h - y) / len(y)     # dL/db = (σ − y)·x
    b -= alpha * grad

# --- scikit-learn (thực tế dùng cái này) ---
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2,
                                          stratify=y, random_state=42)
clf = LogisticRegression(max_iter=1000, class_weight="balanced")  # lệch lớp → balanced
clf.fit(X_tr, y_tr)
proba = clf.predict_proba(X_te)[:, 1]      # xác suất lớp 1 → điều chỉnh ngưỡng được
y_pred = (proba >= 0.3).astype(int)        # hạ ngưỡng để tăng Recall
print(classification_report(y_te, y_pred)) # P/R/F1 mỗi lớp
```
- ⚠️ `W·x` ép con số phải có ý nghĩa → cần **encode đúng** ([[encode-categorical]]) & **scale** ([[chuan-hoa-du-lieu]]) trước khi train.

## ✅ Điểm mạnh / ❌ Điểm yếu
| ✅ Mạnh | ❌ Yếu |
|--------|-------|
| Đơn giản, nhanh, **baseline tốt** | Chỉ vẽ **ranh giới tuyến tính** |
| **Giải thích được** (hệ số = ảnh hưởng feature) | Quan hệ phi tuyến → cần [[feature-engineering]] |
| Trả ra **xác suất** (không chỉ nhãn) | Nhạy với feature tương quan mạnh (đa cộng tuyến) |

> 💡 Lời khuyên slide: **bắt đầu đơn giản với Logistic**, rồi nâng độ phức tạp ([[random-forest]], [[xgboost]]) khi cần.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Tưởng là hồi quy** (đoán số) → sai; nó **phân loại** (đoán lớp/xác suất).
- **Dùng MSE làm loss** → mặt chi phí không lồi, GD kẹt → phải dùng **Log Loss**.
- **Quên scale/encode** → gradient lệch, hệ số khó diễn giải.
- **Cứng nhắc ngưỡng 0.5** với dữ liệu lệch lớp → bỏ sót lớp hiếm → chỉnh ngưỡng + xem [[class-imbalance]].
- **Tin mỗi Accuracy** khi lệch lớp → xem [[danh-gia-mo-hinh]] (Precision/Recall/F1/PR-AUC).

---

## 🔗 Liên kết
- **Tiền đề:** [[linear-regression]] (đường thẳng z) · [[loss-function]] (cross-entropy) · [[maximum-likelihood]] · [[gradient-descent]] · [[toi-uu-loi]] (lồi)
- **Dẫn tới:** [[softmax]] (đa lớp) · [[danh-gia-mo-hinh]] (đo phân loại) · [[class-imbalance]] (lệch lớp)
- **So với:** [[linear-regression]] (đoán số) · [[decision-tree]] (white-box phi tuyến)
- **Thuộc:** [[phan-loai-hoc-may]] (có giám sát → phân loại) · [[chon-mo-hinh]]

## ❓ Câu hỏi mở
- Sigmoid biến z thành xác suất chính xác thế nào? Vì sao chọn nó (vs các hàm "bóp" khác)?
- Khi nào logistic thua decision tree / random forest?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L4_LogisticsReg.pdf`).
- StatQuest — "Logistic Regression", "Logistic Regression Details".
