# Chính quy hóa (Regularization) — Ridge · Lasso · Elastic Net

> Tóm tắt 1 câu: Thay vì để tham số **tự do uốn đường cong ôm hết dữ liệu** (kể cả nhiễu & ca ngoài rìa), ta **thêm hình phạt độ lớn trọng số** vào hàm chi phí → model đơn giản, mượt hơn, **không nhớ vẹt** → tổng quát tốt hơn. Là **hướng 1** chống [[overfitting]] (giữ MỌI đặc trưng, thu nhỏ hệ số).

**Ngày tạo:** 2026-06-14 · **Cập nhật:** 2026-06-21 (bám slide L5)
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh A (Tối ưu) — vũ khí chống [[overfitting]] · song hành [[feature-selection]] (hướng 2)
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #toi-uu-hoa #regularization #overfitting
**Nguồn slide:** `L5_Regularization_FeatureSelection.pdf` Phần 03 — TS. Cao Tiến Dũng

---

> ⚠️ **ĐỪNG NHẦM TÊN — Chính quy hóa ≠ Chuẩn hóa:**
> - **Chính quy hóa (Regularization)** = *note này* — phạt độ lớn hệ số để chống overfit (hướng 1).
> - **Chuẩn hóa (Scaling/Normalization)** = [[chuan-hoa-du-lieu]] — đưa cột về cùng thang đo (tiền xử lý). KHÔNG phải để chống overfit, chỉ là **tiền đề** (scale trước thì phạt mới công bằng).
> Tên gần giống nhưng là 2 việc khác hẳn.

## 💡 Ý chính (intuition "khuôn khổ")
- **Quá khớp (overfitting):** model **quá phức tạp** → AI **nhớ thuộc lòng** dữ liệu train (cả nhiễu, ca rìa), `J(θ) ≈ 0` trên train nhưng **tổng quát kém** → [[overfitting]].
- **Trực giác slide:** hệ số bậc cao (θ₃, θ₄…) **lớn** → đường cong **vặn vẹo** ôm từng điểm. Thêm phạt (vd `+1000·θ₃² + 1000·θ₄²`) ép chúng **≈ 0** → đường **mượt** → giả thuyết "đơn giản" hơn → bớt quá khớp.
- **Regularization = thêm "hình phạt độ phức tạp" vào chi phí:**
```
Chi phí mới = Loss (sai số gốc)  +  λ · Penalty(trọng số)
```

## 🎚️ λ (lambda) — núm điều khiển mức phạt
| λ | Hệ quả |
|---|--------|
| **λ quá lớn** (vd 10¹⁰) | mọi θⱼ ≈ 0 → model thành **đường ngang** → **dưới khớp** (high bias) |
| **λ quá nhỏ** | phạt yếu → **vẫn quá khớp** |
| **λ vừa** | cân bằng → tổng quát tốt |
> Chọn λ bằng **cross-validation** (`RidgeCV`, `LassoCV`) để cân bằng **bias–variance** ([[overfitting]]). λ là **siêu tham số**, không học từ dữ liệu.
> 🔧 **Chỉnh thực hành:** đang **overfit → TĂNG λ** (phạt mạnh, model đơn giản hơn); đang **underfit / phạt quá tay → GIẢM λ**. λ = "núm độ phức tạp **đảo ngược**" — λ nhỏ = phức tạp (variance), λ lớn = đơn giản (bias), λ vừa = đáy chữ U ([[bias-variance]]).
> ⚠️ **θ₀ (bias/intercept) KHÔNG bị phạt** — chỉ phạt θ₁…θₙ.

## 🔵 Ridge (L2) — phạt tổng bình phương hệ số
```
J(θ) = (1/2m) [ Σ (hθ(xᵢ) − yᵢ)²  +  λ Σ θⱼ² ]
```
- Phạt `Σθⱼ²` → **co đều** mọi hệ số nhỏ lại nhưng **KHÔNG về 0** (giữ hết đặc trưng).
- **Gradient Descent = Weight Decay:** bước cập nhật cho θⱼ (j≥1):
```
θⱼ := θⱼ(1 − α·λ/m) − α·(1/m) Σ (hθ(xᵢ) − yᵢ)·xⱼ
        └── hệ số co < 1 ──┘   └──── gradient gốc ────┘
```
> Thừa số `(1 − αλ/m) < 1` chính là **weight decay**: mỗi bước **co nhỏ** trọng số một chút TRƯỚC khi cập nhật theo gradient. (So với bản thường: chỉ thêm thừa số co; θ₀ vẫn cập nhật như cũ.)
> 🧠 *Trực giác:* trọng số nào **gradient đẩy đủ mạnh** (đặc trưng quan trọng) thì sống sót lớn; trọng số **vô dụng** bị decay dần về ~0 → L2 tự lọc độ phức tạp.
> ⚠️ **Đừng nhầm 2 loại "decay":** **Weight decay** (đây) = co **trọng số θ** do phạt L2 · **Learning-rate decay** = co **tốc độ học α** theo lịch thời gian (vd notebook softmax). Cùng tên, khác mục tiêu.

## 🔶 Lasso (L1) — phạt tổng trị tuyệt đối → CHỌN BIẾN
```
J(θ) = (1/2m) Σ (hθ(xᵢ) − yᵢ)²  +  λ Σ |θⱼ|
```
- **LASSO** = *Least Absolute Shrinkage and Selection Operator*.
- L1 đẩy **nhiều hệ số về ĐÚNG 0** → đặc trưng tương ứng **bị loại tự động** → vừa regularize vừa **chọn biến** (cầu sang [[feature-selection]] hướng embedded).

### 🔷 Vì sao L1 tạo số 0 còn L2 thì không? (hình học)
> 🔑 **"L1/L2" = chuẩn 1 / chuẩn 2 (norm)** — hai cách đo độ lớn: **L1 = Σ|θ| (khoảng cách Manhattan, trị tuyệt đối)** · **L2 = Σθ² (khoảng cách Euclidean, bình phương)**. Hình ràng buộc chính là **quả cầu đơn vị** của mỗi chuẩn:
> Nghiệm = nơi đường đồng mức của Loss **chạm** vùng ràng buộc của penalty:
- **Ridge (L2) = hình TRÒN** (Σθ² ≤ t) → Loss thường chạm ở **cạnh cong** → θ nhỏ nhưng **hiếm khi = 0**.
- **Lasso (L1) = hình KIM CƯƠNG** (Σ|θ| ≤ t) → có **góc nhọn nằm trên trục** → Loss hay chạm đúng **góc** → một số θ = **0** (thưa). *Đây là lý do hình học vì sao Lasso chọn biến.*
- **Elastic Net = kim cương BO TRÒN** (kết hợp).

## 🟣 Elastic Net (L1 + L2) — kết hợp
```
J(θ) = MSE  +  λ [ α Σ|θⱼ|  +  (1−α) Σθⱼ² ]
```
- **Kết hợp ưu điểm:** L1 cho tính **THƯA** (chọn biến) + L2 cho tính **ỔN ĐỊNH** (xử lý đa cộng tuyến / nhóm biến tương quan).
- **α** điều phối tỷ trọng L1/L2: **α=1 → Lasso thuần**; **α=0 → Ridge thuần**.
- Hợp khi có **nhiều đặc trưng tương quan theo nhóm** — Lasso thuần dễ chọn lệch 1 biến tùy ý, Elastic Net giữ cả nhóm.

## 📊 So sánh Ridge / Lasso / Elastic Net
| Tiêu chí | **Ridge (L2)** | **Lasso (L1)** | **Elastic Net** |
|---|---|---|---|
| Phạt | `Σθⱼ²` | `Σ|θⱼ|` | `α·L1 + (1−α)·L2` |
| Đưa hệ số về 0? | **Không** (co nhỏ) | **Có** (thưa) | Có |
| Chọn biến | Không | **Có** | Có |
| Đa cộng tuyến | **Tốt** | Kém (chọn 1 tùy ý) | **Tốt** |
| Nghiệm | dạng đóng | lặp | lặp |
> 🔁 **Đường co hệ số theo λ:** Lasso đưa nhiều hệ số về **đúng 0** khi λ tăng; Ridge chỉ **co nhỏ dần**, không chạm 0.

## 🧮 Regularized Logistic Regression
- Cùng dạng phạt `λ/2m · Σθⱼ²` thêm vào hàm chi phí **cross-entropy** ([[logistic-regression]]).
- Tác dụng: **ranh giới quyết định MƯỢT hơn**, bớt ngoằn ngoèo → tổng quát tốt hơn. Quy tắc cập nhật GD giống Ridge, chỉ khác h là **sigmoid**.

## 🔁 Nối với Bayes (góc nhìn sâu)
- Regularization = **đặt prior lên trọng số** (tin rằng trọng số nên nhỏ) → biến MLE thành **MAP** → [[maximum-likelihood]] · [[dinh-ly-bayes]].
  - L2 ⟺ prior **Gaussian**; L1 ⟺ prior **Laplace**.

## 💻 Thực hành (Python)
```python
from sklearn.linear_model import Ridge, Lasso, ElasticNet, RidgeCV, LassoCV
Ridge(alpha=1.0).fit(X, y)        # coef_ đều nhỏ, khác 0
Lasso(alpha=0.1).fit(X, y)        # coef_ có nhiều số 0 → chọn biến
ElasticNet(alpha=0.1, l1_ratio=0.5).fit(X, y)   # l1_ratio = α
LassoCV(cv=5).fit(X, y).alpha_    # tự dò λ tốt nhất bằng cross-validation
```

### 🔗 Bản đồ ký hiệu → sklearn
| Lý thuyết | sklearn |
|---|---|
| **λ** mức phạt | **`Ridge(alpha=)`** — alpha lớn = phạt mạnh; `alpha=0` = OLS |
| θ₀ không phạt | `fit_intercept=True` (Ridge tự không phạt intercept) |
| θ₁…θₙ / θ₀ | `coef_` / `intercept_` |
| chọn λ bằng CV | `RidgeCV(alphas=[...])` · `LassoCV(cv=5)` |
| Normal Eq vs GD | `solver='cholesky'/'svd'` (đóng) vs `'sag'/'saga'/'lsqr'` (lặp) |

> ⚠️ **Bẫy `C` ngược hướng:** `LogisticRegression`/`SVM` chỉnh regularization bằng **`C = 1/λ`** → **`C` NHỎ = phạt MẠNH** (ngược với `alpha` của Ridge). Nhớ: Ridge→alpha (thuận), Logistic/SVM→C (nghịch).

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Quên scale đặc trưng trước khi regularize:** phạt theo độ lớn θ → cột thang đo lớn bị phạt oan → phải [[chuan-hoa-du-lieu]] trước.
- **λ quá lớn → underfit** (đường ngang); **λ quá nhỏ → vẫn overfit**.
- Nhầm L1/L2: **L1 tạo số 0** (thưa, chọn feature), **L2 không tạo 0** (chỉ co nhỏ).
- Phạt cả **θ₀ (intercept)** → sai; chỉ phạt θ₁…θₙ.

---

## 🔗 Liên kết
- **Chống:** [[overfitting]] (hướng 1: giữ hết feature, co hệ số)
- **Song hành:** [[feature-selection]] (hướng 2: bỏ bớt feature) — Lasso là cầu nối giữa hai hướng
- **Nối tới:** [[loss-function]] (thêm vào chi phí) · [[maximum-likelihood]] (MAP = MLE + prior) · [[gradient-descent]] (weight decay) · [[linear-regression]] · [[logistic-regression]]
- **Tiền đề:** [[chuan-hoa-du-lieu]] (scale trước) · [[cross-validation]] (chọn λ)

## ❓ Câu hỏi mở
- Chọn λ thế nào cho tối ưu? (grid search + cross-validation; RidgeCV/LassoCV)
- Khi nào dùng Lasso, khi nào Ridge, khi nào Elastic Net cho bài của mình?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L5_Regularization_FeatureSelection.pdf` Phần 03).
- StatQuest — "Ridge, Lasso and Elastic-Net Regression".
- scikit-learn docs: [Ridge](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html) (chuẩn 2/L2) · [Lasso](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Lasso.html) (chuẩn 1/L1) · [ElasticNet](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.ElasticNet.html) (`l1_ratio` = α).
