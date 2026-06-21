# Mất cân bằng lớp (Class Imbalance)

> Tóm tắt 1 câu: Khi **một lớp áp đảo** (vd 99% âm, 1% dương), model "đoán âm mọi lúc" vẫn được **Accuracy 99%** nhưng **vô dụng** vì bỏ sót toàn bộ lớp hiếm — phải xử lý ở **dữ liệu**, **ngưỡng** và **độ đo**.

**Ngày tạo:** 2026-06-21
**Trạng thái:** 🟢 Trọng tâm (Lớp LÀM)
**📖 Lộ trình:** Nhánh D (Xử lý dữ liệu) · #6 ← cần [[lay-mau]] · [[danh-gia-mo-hinh]] · liên quan [[logistic-regression]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #lop-lam #du-lieu #phan-loai #danh-gia
**Nguồn slide:** `L4_LogisticsReg.pdf` (slide Mất cân bằng lớp) — TS. Cao Tiến Dũng

---

## 💡 Ý chính
> ✍️ **Lời của mình:** *Lớp hiếm (gian lận, bệnh, lỗi) mới là cái ta cần bắt, nhưng nó quá ít nên model "lười" chỉ cần đoán theo lớp đa số là đã đúng gần hết. Accuracy cao mà chẳng bắt được ca nào quan trọng → phải ép model chú ý tới lớp hiếm.*

- **Vấn đề:** một lớp áp đảo (99% âm) → Accuracy cao **đánh lừa**, model bỏ sót toàn bộ lớp hiếm.
- Rất phổ biến ở các bài **đáng giá nhất**: phát hiện gian lận, chẩn đoán bệnh hiếm, lỗi thiết bị, churn.
- Đây là vấn đề **của dữ liệu** → đúng tinh thần 90/10 ([[dinh-huong-hoc]]): xử lý dữ liệu đúng quan trọng hơn đổi thuật toán.

## 🛠️ 4 nhóm cách xử lý
| Nhóm | Làm gì | Ghi chú |
|------|--------|---------|
| **① Lấy mẫu lại (resampling)** | **Oversampling** lớp hiếm (vd **SMOTE** sinh mẫu tổng hợp) hoặc **undersampling** lớp đa số | SMOTE nội suy giữa các mẫu hiếm; chỉ resample trên **tập train**, không đụng test → [[lay-mau]] |
| **② Trọng số lớp (class weight)** | `class_weight='balanced'` — **phạt nặng** lỗi ở lớp hiếm trong hàm mất mát | Không đổi dữ liệu, chỉ đổi loss; nhanh, hay dùng đầu tiên |
| **③ Dịch ngưỡng** | **Hạ ngưỡng** quyết định để tăng **Recall** cho lớp dương | "Núm vặn" của [[logistic-regression]] |
| **④ Đúng độ đo** | Dùng **F1 / PR-AUC / balanced accuracy** — **KHÔNG** dùng Accuracy | Xem [[danh-gia-mo-hinh]] |

> ⚠️ **Rò rỉ dữ liệu (data leakage):** resample/SMOTE phải nằm **bên trong** vòng cross-validation và **chỉ trên train** — nếu oversample trước khi chia thì mẫu tổng hợp lọt vào test → điểm ảo. Nối [[cross-validation]] · [[chuan-hoa-du-lieu]].

## 📏 Đo thế nào khi lệch lớp?
```
KHÔNG dùng:  Accuracy          (99% âm → "đoán âm" đã 99%, vô dụng)
NÊN dùng:    Recall            (bắt được bao nhiêu ca dương thật?)
             Precision / F1    (cân chất lượng cảnh báo vs độ phủ)
             PR-AUC            (phản ánh thật hơn ROC-AUC khi lệch NẶNG)
             balanced accuracy (trung bình recall mỗi lớp)
```
- Câu hỏi vàng vẫn là: **sai lầm nào tốn kém hơn — FP hay FN?** → chọn Precision/Recall tương ứng ([[danh-gia-mo-hinh]]).

## 🧪 Thí nghiệm: thấy tận mắt cái bẫy (3000 mẫu, 98% âm / 2% dương)
```
all-negative  : Acc=0.980  Recall=0.000   ← bỏ sót SẠCH 60 ca dương, vẫn 98%!
logistic 0.5  : Acc=0.980  Recall=0.133   ← Accuracy y hệt nhưng chỉ bắt 8/60
```
> ⚠️ Accuracy 98% nghe hoàn hảo nhưng **Recall = 13%** → model gần như vô dụng cho mục tiêu thật. Đây là lý do **bỏ Accuracy, soi Recall/F1**.

**Kết quả 4 cách xử lý** (đo trên cùng dữ liệu lệch — minh họa rõ đánh đổi Recall ↑ / Precision ↓):
```
GỐC 0.5       : Recall=0.133  Precision=0.533   (bắt  8/60)
① oversample  : Recall=0.867  Precision=0.103   (bắt 52/60)
② class_weight: Recall=0.867  Precision=0.103   (bắt 52/60)
③ ngưỡng 0.2  : Recall=0.383  Precision=0.383   (bắt 23/60, dịu hơn)
```
> 🔑 Cả 3 cách đều **kéo Recall lên** (bắt nhiều ca hiếm hơn), đổi lại **Precision giảm** (báo nhầm nhiều hơn) — không có bữa trưa miễn phí. Chọn mức đánh đổi theo chi phí FP vs FN của bài toán ([[xac-dinh-van-de]]). Chi tiết code: `code-practice/logistic-regression-oop.ipynb` Mục 13.

## 💻 Thực hành (Python)
```python
# ② Trọng số lớp — nhanh nhất, thử đầu tiên
clf = LogisticRegression(class_weight="balanced", max_iter=1000)

# ① SMOTE (imbalanced-learn) — CHỈ fit trên train, đặt trong pipeline
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline
pipe = Pipeline([("smote", SMOTE()), ("clf", LogisticRegression())])
pipe.fit(X_tr, y_tr)        # SMOTE chỉ tác động lúc fit, không đụng test

# ③ Dịch ngưỡng để tăng Recall lớp hiếm
proba = clf.predict_proba(X_te)[:, 1]
y_pred = (proba >= 0.3).astype(int)
```

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Khoe Accuracy 99%** trên dữ liệu lệch → ảo tưởng, model có thể bắt 0 ca dương.
- **SMOTE/oversample trước khi split** → rò rỉ dữ liệu → điểm test ảo cao.
- **Oversample quá tay** → model overfit lớp hiếm ([[overfitting]]).
- **Quên** rằng đổi ngưỡng/trọng số làm **đánh đổi** Precision ↔ Recall — phải chốt theo bài toán ([[xac-dinh-van-de]]).

---

## 🔗 Liên kết
- **Tiền đề:** [[lay-mau]] (kỹ thuật lấy mẫu) · [[danh-gia-mo-hinh]] (chọn độ đo đúng)
- **Liên quan:** [[logistic-regression]] (dịch ngưỡng, class_weight) · [[cross-validation]] (resample đúng chỗ) · [[overfitting]] · [[xac-dinh-van-de]]
- **Thuộc:** [[xu-ly-du-lieu]] (Lớp LÀM, 90%) · [[dinh-huong-hoc]]

## ❓ Câu hỏi mở
- SMOTE nội suy thế nào, và khi nào nó hại (lớp hiếm phân tán/đa cụm)?
- Trọng số lớp vs resampling — cái nào nên thử trước cho bài của mình?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L4_LogisticsReg.pdf`).
- 💻 **Demo tự cài** (cái bẫy + 4 giải pháp, số liệu thật): `code-practice/logistic-regression-oop.ipynb` Mục 13.
