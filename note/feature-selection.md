# Chọn đặc trưng (Feature Selection)

> Tóm tắt 1 câu: **Bỏ bớt đặc trưng** nhiễu/trùng lặp/ít liên quan đến mục tiêu → model đơn giản hơn, **bớt quá khớp**, nhanh hơn và **dễ giải thích**. Là **hướng 2** chống [[overfitting]] (GIẢM số đặc trưng — khác [[regularization]] giữ hết rồi co hệ số).

**Ngày tạo:** 2026-06-21
**Trạng thái:** 🟢 Trọng tâm (Lớp LÀM ⭐)
**📖 Lộ trình:** Nhánh D (Xử lý dữ liệu) · #7 ← cần [[feature-engineering]] · [[tuong-quan]] · [[overfitting]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #lop-lam #du-lieu #feature-selection
**Nguồn slide:** `L5_Regularization_FeatureSelection.pdf` Phần 04 — TS. Cao Tiến Dũng

---

## 💡 Ý chính
> ✍️ **Lời của mình:** *Chọn đặc trưng = lọc ra đúng những cột thực sự giúp dự đoán, vứt cột rác. Đây chính là phần "chọn dữ liệu" trong quy tắc 90/10 ([[dinh-huong-hoc]]) — chọn sai cột thì thuật toán xịn đến mấy cũng ra rác.*

- **Khác [[regularization]]:** regularization **giữ MỌI đặc trưng** rồi thu nhỏ hệ số; feature selection **BỎ HẲN** một số cột.
- **Lợi ích:** chống overfit, train nhanh, mô hình gọn, **dễ diễn giải**, giảm chi phí thu thập dữ liệu.

## 🗂️ 3 nhóm phương pháp
| Nhóm | Ý tưởng | Tốc độ / Độ chính xác | Ví dụ |
|------|---------|----------------------|-------|
| **① Filter** | Đánh giá đặc trưng **ĐỘC LẬP** với mô hình, dựa trên **thống kê** | Nhanh – rẻ | Variance, Correlation, χ², Mutual Information |
| **② Wrapper** | Dùng **HIỆU NĂNG mô hình** để chọn tập đặc trưng tốt nhất | Chính xác – tốn thời gian | Forward/Backward, RFE, Boruta, mRMR |
| **③ Embedded** | Chọn đặc trưng diễn ra **NGAY trong lúc huấn luyện** | Cân bằng | LASSO (L1), Random Forest importance |

## ① Filter — lọc bằng thống kê (nhanh, độc lập mô hình)
- **Missing Value Ratio:** thiếu quá nhiều → ít thông tin → loại theo ngưỡng ([[xu-ly-du-lieu-thieu]]).
- **Low Variance Filter:** đặc trưng **gần như hằng** → vô dụng để phân biệt mẫu → loại. ⚠️ **Chuẩn hóa TRƯỚC** vì phương sai phụ thuộc thang đo ([[chuan-hoa-du-lieu]]).
- **High Correlation:** cặp biến **tương quan cao** → thông tin trùng lặp → giữ lại **MỘT** ([[tuong-quan]]). Chọn kiểm định theo kiểu cặp biến:

| Kiểu cặp biến | Kiểm định phù hợp |
|---|---|
| Số ↔ Số | **Pearson** (tuyến tính) / **Spearman** (đơn điệu) |
| Phân loại ↔ Phân loại | **Chi-square (χ²)** |
| Số ↔ Phân loại | **ANOVA F-test** |

- **Mutual Information (MI):** đo **lượng thông tin chia sẻ** giữa đặc trưng và y. ⭐ Ưu điểm lớn: **bắt được quan hệ PHI TUYẾN** (correlation chỉ bắt tuyến tính). Vd `y = x²`: Pearson ≈ 0 nhưng MI > 0. (MI ≥ 0; MI = 0 ⟺ độc lập.)
```python
from sklearn.feature_selection import VarianceThreshold, SelectKBest, chi2, mutual_info_classif
VarianceThreshold(threshold=0.01).fit_transform(X)        # loại gần-hằng
SelectKBest(chi2, k=20).fit_transform(X, y)               # χ²
SelectKBest(mutual_info_classif, k=20).fit_transform(X, y) # MI (classif/regression)
```

## ② Wrapper — chọn theo hiệu năng mô hình (chính xác, tốn thời gian)
- **Forward Selection:** bắt đầu **RỖNG**, thêm dần biến làm **TĂNG hiệu năng** nhiều nhất; lặp đến khi không cải thiện đáng kể.
- **Backward Elimination:** bắt đầu với **TOÀN BỘ** n biến, mỗi lần bỏ thử 1 biến; bỏ hẳn biến mà việc loại **ít/không** làm giảm hiệu năng.
- **RFE** (Recursive Feature Elimination): lặp loại đệ quy đặc trưng **yếu nhất** theo trọng số mô hình. **RFECV** tự chọn **số** đặc trưng tối ưu bằng cross-validation.
- **Boruta:** so importance đặc trưng thật với **"shadow features"** (bản xáo trộn). **mRMR:** Max-Relevance, Min-Redundancy — tránh chọn biến trùng nhau.
> ⚠️ Cả Forward/Backward đều **TỐN THỜI GIAN** — phải huấn luyện mô hình rất nhiều lần.
```python
from sklearn.feature_selection import RFE, RFECV
RFE(est, n_features_to_select=5).fit(X, y)   # .support_ (mặt nạ), .ranking_ (1 = chọn)
RFECV(est, step=1, cv=5).fit(X, y)           # tự chọn số đặc trưng bằng CV
```

## ③ Embedded — chọn ngay khi huấn luyện (cân bằng)
- **LASSO (L1):** phạt `α·Σ|hệ số|` đẩy nhiều hệ số về **đúng 0** → đặc trưng bị loại **tự động** ([[regularization]]). α lớn → giữ ít đặc trưng. `LassoCV` tự dò α.
- **Random Forest importance** (`feature_importances_`): theo mức giảm impurity khi tách — nhanh, có sẵn sau train. ⚠️ **Thiên vị** đặc trưng nhiều giá trị (high-cardinality) ([[random-forest]]).
- **Permutation Importance:** **xáo trộn 1 cột**, đo mức **GIẢM hiệu năng** — không thiên vị, dùng cho **MỌI** mô hình, đo trên **test**. Cặp đôi đề xuất: RF (nhanh, khám phá) + Permutation (đáng tin, kết luận); **SHAP** để giải thích từng dự đoán.
```python
from sklearn.feature_selection import SelectFromModel
from sklearn.linear_model import Lasso
SelectFromModel(Lasso(alpha=0.01).fit(X, y), prefit=True).transform(X)  # hệ số 0 → loại
from sklearn.inspection import permutation_importance
permutation_importance(model, X_test, y_test, n_repeats=10)  # .importances_mean / _std
```

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Chọn đặc trưng dựa trên TOÀN BỘ dữ liệu** (gồm test) → **rò rỉ** → điểm ảo. Phải làm trong CV, chỉ trên train ([[cross-validation]]).
- **Chỉ tin correlation** → bỏ sót quan hệ phi tuyến → dùng thêm **MI**.
- **Tin RF importance tuyệt đối** → bị thiên vị high-cardinality → đối chiếu **Permutation**.
- Nhầm feature selection với [[feature-engineering]] (tạo đặc trưng mới) — đây là **bỏ bớt**, kia là **tạo thêm**.

---

## 🔗 Liên kết
- **Song hành:** [[regularization]] (hướng 1 chống [[overfitting]]) — Lasso (L1) là điểm giao của 2 hướng
- **Tiền đề:** [[feature-engineering]] (tạo đặc trưng) · [[tuong-quan]] (lọc trùng) · [[chuan-hoa-du-lieu]] (scale trước low-variance) · [[xu-ly-du-lieu-thieu]]
- **Liên quan:** [[random-forest]] (importance) · [[cross-validation]] (tránh rò rỉ) · [[pca]] (giảm chiều — khác: PCA tạo trục mới, feature selection giữ cột gốc)
- **Thuộc:** [[xu-ly-du-lieu]] (Lớp LÀM, 90%) · [[dinh-huong-hoc]]

## ❓ Câu hỏi mở
- Filter nhanh nhưng bỏ sót tương tác giữa biến; Wrapper chính xác nhưng chậm — khi nào chọn cái nào cho bài của mình?
- Feature selection vs PCA: khi nào nên giữ cột gốc (giải thích được) thay vì gộp thành trục mới?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L5_Regularization_FeatureSelection.pdf` Phần 04).
