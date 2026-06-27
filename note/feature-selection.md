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

> 🔑 **Mẹo nhớ theo tên (tên = quan hệ với model):** **Filter** = lọc *trước cửa* (độc lập model) · **Wrapper** = *bọc* quanh model (dùng hiệu năng chấm điểm, train nhiều lần) · **Embedded** = *nhúng* trong model (tự chọn lúc học).
> **Phổ tốc độ↔chính xác:** Filter (nhanh, thô) → Embedded (cân bằng) → Wrapper (chậm, tinh).
> **Thực hành:** Filter vứt rác trước → Embedded (Lasso/RF) cho phần còn lại → Wrapper (RFE) khi cần ép số đặc trưng cụ thể & có thời gian.

## ① Filter — lọc bằng thống kê (nhanh, độc lập mô hình)
- **Missing Value Ratio:** thiếu quá nhiều → ít thông tin → loại theo ngưỡng ([[xu-ly-du-lieu-thieu]]).
- **Low Variance Filter:** đặc trưng **gần như hằng** → vô dụng để phân biệt mẫu → loại. ⚠️ **2 bẫy:** (1) **Chuẩn hóa TRƯỚC** vì phương sai phụ thuộc thang đo ([[chuan-hoa-du-lieu]]) — cột "lương" variance to hơn cột "tỉ lệ" chỉ vì đơn vị. (2) **Cột hiếm-nhưng-quan-trọng:** cờ gian lận 99% = 0 có variance thấp nhưng **chính 1% đó cần bắt** → đừng bỏ máy móc khi lớp dương hiếm ([[class-imbalance]]).
- **High Correlation:** cặp biến **tương quan cao** → thông tin trùng lặp → giữ lại **MỘT** (giữ cột **tương quan với y mạnh hơn** / dễ giải thích hơn, bỏ cột kia) ([[tuong-quan]]). Chọn kiểm định theo kiểu cặp biến:

| Kiểu cặp biến | Kiểm định phù hợp | sklearn score_func |
|---|---|---|
| Số ↔ Số | **Pearson** (tuyến tính) / **Spearman** (đơn điệu, bền outlier) | `r_regression`/`f_regression` |
| Phân loại ↔ Phân loại | **Chi-square (χ²)** | `chi2` |
| Số ↔ Phân loại | **ANOVA F-test** | `f_classif` |

> 💡 **Cùng bộ test, 2 mục đích:** đo **đặc trưng ↔ đặc trưng** → tìm cặp trùng để bỏ 1 (mục này) · đo **đặc trưng ↔ nhãn y** → chấm độ liên quan để chọn cột (`SelectKBest(score_func=)`). Pearson chỉ bắt tuyến tính → quan hệ phi tuyến dùng **Mutual Information** (xem dưới).

- **Mutual Information (MI):** đo **lượng thông tin chia sẻ** giữa đặc trưng và y. ⭐ Ưu điểm lớn: **bắt được quan hệ PHI TUYẾN** (correlation chỉ bắt tuyến tính). Vd `y = x²`: Pearson ≈ 0 nhưng MI > 0. (MI ≥ 0, **không dấu**; MI = 0 ⟺ độc lập.)
  - 🔗 **Bản chất ([[entropy]]):** `MI(x;y) = H(y) − H(y|x)` = biết x thì **giảm bao nhiêu bất định của y**. Giảm nhiều → x đóng góp nhiều → giữ; giảm ~0 → x vô dụng → bỏ.
  - ⚠️ **Bẫy:** MI chấm **từng cột riêng** (univariate) → 2 cột MI cao nhưng **trùng nhau** vẫn bị giữ cả hai (thừa). Khắc phục: **mRMR** (MI cao với y NHƯNG ít trùng cột khác — xem Wrapper).
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
- **Boruta:** tạo **"shadow features"** = bản **xáo trộn** của mỗi cột (phá quan hệ với y → "nhiễu thuần"), train (thường RF), rồi hỏi: importance cột **thật** có **vượt cột bóng tốt nhất** không? Không vượt nổi nhiễu → bỏ. 🔑 Hay: cho **mốc khách quan** ("đánh bại được phiên bản random của chính nó không?") thay vì ngưỡng tùy ý.
- **mRMR** (Max-Relevance, Min-Redundancy): chọn cột **liên quan y mạnh** NHƯNG **ít trùng** cột đã chọn → đúng lời giải cho **bẫy MI univariate** (2 cột MI cao nhưng trùng nhau).
> ⚠️ Cả Forward/Backward đều **TỐN THỜI GIAN** — phải huấn luyện mô hình rất nhiều lần.
> ⚠️ **Đều THAM LAM (greedy)** → chọn tốt-nhất-từng-bước → **không đảm bảo tập tối ưu toàn cục** (chỉ vét cạn 2ⁿ tập mới chắc, bất khả thi). Forward dễ "khóa" vào cột sớm hóa thừa; Backward dễ bỏ cột chỉ mạnh khi kết hợp.
> 🤔 **Chọn hướng:** **Forward** rẻ, hợp khi cần **ít** đặc trưng / n lớn · **Backward** đắt (start với n biến, bất khả thi nếu n quá lớn) nhưng **bắt tương tác giữa biến tốt hơn**. Muốn nhanh hơn cả hai → **RFE** (loại theo trọng số, khỏi thử từng cột).
```python
from sklearn.feature_selection import RFE, RFECV
RFE(est, n_features_to_select=5).fit(X, y)   # .support_ (mặt nạ), .ranking_ (1 = chọn)
RFECV(est, step=1, cv=5).fit(X, y)           # tự chọn số đặc trưng bằng CV
```

## ③ Embedded — chọn ngay khi huấn luyện (cân bằng)
- **LASSO (L1):** phạt `α·Σ|hệ số|` đẩy nhiều hệ số về **đúng 0** → đặc trưng bị loại **tự động** ([[regularization]]). α lớn → giữ ít đặc trưng. `LassoCV` tự dò α. 🌉 **Cầu nối 2 hướng:** Lasso vừa regularize (hướng 1) vừa chọn biến (hướng 2). ⚠️ **Không ổn định với cột tương quan** (chọn đại 1, zero cái kia, đổi mẫu là đổi) → có nhóm biến tương quan thì dùng **Elastic Net** (L2 giữ cả nhóm); và **scale trước**.
- **Random Forest importance** (`feature_importances_`): theo mức giảm impurity khi tách — nhanh, có sẵn sau train. ⚠️ **Thiên vị** đặc trưng nhiều giá trị (high-cardinality) ([[random-forest]]).
- **Permutation Importance:** **xáo trộn 1 cột**, đo mức **GIẢM hiệu năng** — không thiên vị, dùng cho **MỌI** mô hình, đo trên **test**. Cặp đôi đề xuất: RF (nhanh, khám phá) + Permutation (đáng tin, kết luận); **SHAP** để giải thích từng dự đoán.
```python
from sklearn.feature_selection import SelectFromModel
from sklearn.linear_model import Lasso
SelectFromModel(Lasso(alpha=0.01).fit(X, y), prefit=True).transform(X)  # hệ số 0 → loại
from sklearn.inspection import permutation_importance
permutation_importance(model, X_test, y_test, n_repeats=10)  # .importances_mean / _std
```

## 🧰 Cheat sheet — `sklearn.feature_selection`
```
① FILTER
   VarianceThreshold(threshold=)         # bỏ cột variance thấp
   SelectKBest(score_func, k=)           # chọn k cột điểm cao · SelectPercentile (theo %)
     score_func: chi2 (phân loại, feature≥0) · f_classif (ANOVA, số↔phân loại)
                 f_regression/r_regression (hồi quy) · mutual_info_classif/regression (PHI TUYẾN)
   SelectFpr/SelectFdr/SelectFwe         # lọc theo p-value
② WRAPPER
   SequentialFeatureSelector(est, direction='forward'/'backward')   # = Forward/Backward
   RFE(est, n_features_to_select=)       # loại đệ quy theo trọng số
   RFECV(est, cv=)                       # RFE + tự chọn SỐ cột bằng CV
③ EMBEDDED
   SelectFromModel(est)                  # chọn theo coef/importance (Lasso→0, RF importance)
```
> 🔑 `SequentialFeatureSelector` = chính Forward/Backward (đổi `direction`). `score_func` của `SelectKBest` = đúng bảng test theo kiểu biến (chi²/ANOVA/Pearson/MI) — chỉ truyền hàm, không gõ tay.

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
- scikit-learn — [module `feature_selection`](https://scikit-learn.org/stable/api/sklearn.feature_selection.html) (VarianceThreshold, SelectKBest, RFE/RFECV, SequentialFeatureSelector, SelectFromModel).
