# Hồi quy Tuyến tính (Linear Regression)

> Tóm tắt 1 câu: Vẽ **một đường thẳng** (siêu phẳng) đi xuyên đám dữ liệu để **đoán một con SỐ** (Y) từ các đặc trưng (X) — chọn đường sao cho **tổng bình phương sai số nhỏ nhất**. Đây là mô hình **gốc** mà mọi thứ khác ([[logistic-regression]], mạng nơ-ron) mở rộng ra.

**Ngày tạo:** 2026-06-20
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh E (Thuật toán) · #2 ← cần [[gradient-descent]] · [[loss-function]] · → dẫn tới [[logistic-regression]] · [[metric-hoi-quy]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #thuat-toan #supervised #hoi-quy #lop-lam
**Nguồn slide:** `L3_LinearReg.pdf` — TS. Cao Tiến Dũng

---

## 💡 Ý chính
> ✍️ **Lời của mình:** *Tuyến tính = giả sử dùng một **mặt phẳng** (`y = ax + b`). Hồi quy = đi tìm **a, b** của mặt phẳng đó sao cho **tổng BÌNH PHƯƠNG sai số (RSS)** nhỏ nhất.* (Bình phương để hết dấu âm — nếu cộng thẳng thì +5 và −5 triệt tiêu, đánh lừa.) → ghép lại = "hồi quy tuyến tính bằng bình phương tối thiểu" (OLS).

- **Hồi quy** = xác định **MỨC ĐỘ liên hệ** giữa một biến phụ thuộc **Y** (cái muốn đoán) và một/nhiều biến độc lập **X** (cái đã biết).
- **Tuyến tính** = giả định Y phụ thuộc X theo **đường thẳng**: `Y = β₀ + β₁X`. Thực tế hiếm khi thẳng hoàn hảo → ta chấp nhận một **sai số ε**.
- "Học" ở đây = **tìm bộ hệ số β** từ dữ liệu (X, Y) sao cho đường khớp nhất, rồi dùng nó **dự đoán Y tương lai**.
- Đoán **SỐ** (giá nhà, lương, doanh số) → khác [[logistic-regression]] vốn đoán **LỚP**.

## 🧩 Trực giác / Ví dụ
```
Giá nhà = 50 + 0.8 × Diện tích
→ nhà 100 m²  ⇒  Giá = 50 + 0.8×100 = 130 (triệu VND)
```
- **β₀ = 50** (intercept): giá "khởi điểm" khi diện tích = 0.
- **β₁ = 0.8** (slope/độ dốc): cứ thêm 1 m² thì giá tăng 0.8 triệu.
- Ví dụ thực tế khác: lương ← số năm kinh nghiệm · doanh số ← ngân sách quảng cáo.

> 📊 **Bài học chọn đặc trưng (slide):** quảng cáo TV liên hệ tuyến tính **MẠNH** với doanh số, Radio **trung bình**, Báo giấy **yếu**. → **Không phải đặc trưng nào cũng hữu ích như nhau** — đây chính là phần [[feature-engineering]] / chọn lọc đặc trưng (Lớp LÀM, đúng [[dinh-huong-hoc]]).

## 🔢 Mô hình & Hàm mất mát

**Đơn biến:** `Y = β₀ + β₁X + ε` · **Bội (nhiều đặc trưng):** `Y = β₀ + β₁X₁ + … + βₚXₚ + ε` → dạng ma trận **y = Xβ + ε**.

```
Dự đoán:      ŷᵢ = β₀ + β₁xᵢ
Phần dư:      eᵢ = yᵢ − ŷᵢ              (sai số của 1 điểm)
RSS:          RSS = Σ (yᵢ − ŷᵢ)²        (tổng bình phương phần dư)
Hàm mất mát:  MSE = RSS / n            (trung bình → hàm chi phí chuẩn của hồi quy)
```
> **Phương pháp bình phương tối thiểu (OLS):** chọn β để **TỐI THIỂU RSS** (hay MSE).

**Vì sao bình phương sai số?** → ① **phạt nặng** sai số lớn · ② **khả vi** (dễ lấy đạo hàm để tối ưu) · ③ có **nghiệm dạng đóng**. (Chi tiết các độ đo: [[metric-hoi-quy]].)

| Ký hiệu | Ý nghĩa |
|---------|---------|
| β₀ | hệ số chặn (intercept) |
| β₁…βₚ | độ dốc theo từng đặc trưng (slope) |
| ε | sai số ngẫu nhiên (error term) |
| eᵢ | phần dư = chênh lệch thực tế − dự đoán |

## ⚙️ Tìm β: 2 cách — Normal Equation vs Gradient Descent

**① Normal Equation (nghiệm dạng đóng)** — cho đạo hàm riêng theo β = 0, giải ra trực tiếp:
```
        β̂₁ = Σ(xᵢ−x̄)(yᵢ−ȳ) / Σ(xᵢ−x̄)²        (= hiệp phương sai(X,Y) / phương sai(X))
        β̂₀ = ȳ − β̂₁·x̄                          (đường hồi quy luôn đi qua điểm trung bình x̄, ȳ)
Bội:    β̂  = (XᵀX)⁻¹ Xᵀy
```
> 🔁 Nối lại: độ dốc β₁ chính là **[[tuong-quan]]/[[phuong-sai]]** đóng gói lại — hồi quy = thống kê suy diễn ([[suy-dien-hoc-may]]).

**② [[gradient-descent]]** — "đi mò" lặp dần: `w := w − η·∇C(w)`.

| Tiêu chí | Normal Equation | Gradient Descent |
|----------|-----------------|------------------|
| Cách tìm | công thức đóng, 1 bước | lặp dần đến hội tụ |
| Tốc độ học η | không cần | phải chọn/điều chỉnh |
| Chuẩn hóa đặc trưng | không bắt buộc | **nên có** (hội tụ nhanh) → [[chuan-hoa-du-lieu]] |
| Số đặc trưng p lớn | **chậm** — O(p³) nghịch đảo ma trận | **tốt** — O(p) mỗi bước |
| XᵀX không khả nghịch | **thất bại** (đa cộng tuyến hoàn toàn) | vẫn chạy được |
| Hợp khi | p nhỏ, dữ liệu vừa | p lớn, dữ liệu rất lớn |

- **SGD / Mini-batch:** GD "batch" tính gradient trên **toàn bộ** N mẫu mỗi bước → chậm khi N lớn. Thay bằng ước lượng gradient từ **1 mẫu (SGD)** hoặc **lô nhỏ B mẫu (mini-batch 32/64/128)** → nhanh hơn nhiều, hỗ trợ học online. Mini-batch = **dung hòa phổ biến nhất**.
- ✅ Với hồi quy tuyến tính + MSE, hàm chi phí **LỒI** → chỉ **1 cực tiểu toàn cục**, train nhiều lần ra kết quả như nhau ([[toi-uu-loi]]).

## ✅ 5 Giả định của hồi quy tuyến tính (slide — phần quan trọng nhất cho dân xử lý dữ liệu)
1. **Tuyến tính** — quan hệ X↔Y thực sự là tuyến tính (theo tham số).
2. **Độc lập** — các phần dư không tự tương quan với nhau.
3. **Phương sai đồng nhất (homoscedasticity)** — độ phân tán phần dư **không đổi** theo X.
4. **Phần dư chuẩn** — phần dư ≈ phân phối chuẩn (quan trọng cho **suy diễn** thống kê: khoảng tin cậy, p-value).
5. **Không đa cộng tuyến** — các đặc trưng không tương quan mạnh với nhau.

> ⚠️ Vi phạm giả định → hệ số β **sai lệch / không tin được**, dù MSE nhìn vẫn ổn. Đây là lý do phải **chẩn đoán** chứ không chỉ nhìn 1 con số.

### Đa cộng tuyến (Multicollinearity) — bẫy chọn đặc trưng
- **Là gì?** 2+ đặc trưng **tương quan mạnh** với nhau (vd Diện tích ↔ Số phòng = 0.93).
- **Hệ quả:** hệ số β **không ổn định**, đảo dấu thất thường, **khó diễn giải**, sai số chuẩn lớn.
- **Phát hiện:** ma trận tương quan ([[tuong-quan]]) · chỉ số **VIF** = `1/(1−Rⱼ²)` → **VIF > 5–10 là đáng lo**.
- **Khắc phục:** bỏ bớt đặc trưng / gộp lại · dùng **[[regularization]] (Ridge)** · **[[pca]]**.

### Chẩn đoán phần dư (Residual Analysis)
- **Phần dư vs giá trị dự đoán:** phân tán **ngẫu nhiên quanh 0** → tốt. Có **hình phễu** → phương sai không đồng nhất (vi phạm GĐ 3).
- **Q-Q plot:** điểm bám sát đường chéo → phần dư chuẩn. Lệch nhiều → vi phạm → cần **biến đổi dữ liệu** (vd log) hoặc đổi mô hình.

## 💻 Thực hành (Python)
```python
# --- Thuần NumPy ---
X_b = np.c_[np.ones((m, 1)), X]              # thêm cột bias x0 = 1
beta = np.linalg.inv(X_b.T @ X_b) @ X_b.T @ y  # Normal Equation
# hoặc Gradient Descent:
for _ in range(epochs):
    grad = (2/m) * X_b.T @ (X_b @ beta - y)  # đạo hàm MSE
    beta -= eta * grad

# --- scikit-learn (thực tế dùng cái này) ---
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)
reg = LinearRegression().fit(X_tr, y_tr)     # huấn luyện
y_pred = reg.predict(X_te)                    # dự đoán trên dữ liệu CHƯA thấy
rmse = np.sqrt(mean_squared_error(y_te, y_pred));  r2 = r2_score(y_te, y_pred)
```
> 🥇 **Nguyên tắc vàng:** chỉ đánh giá trên **tập test** (dữ liệu mô hình chưa thấy) để ước lượng hiệu năng thật → [[cross-validation]] · [[overfitting]].

## ➕ Mở rộng: Hồi quy đa thức (Polynomial)
- Khi quan hệ X–Y **không tuyến tính**: thêm số hạng bậc cao `Y = β₀ + β₁X + β₂X² + … + βₐXᵈ`.
- Vẫn là "tuyến tính theo **tham số** β" → giải y như cũ, chỉ thêm cột đặc trưng X², X³…

> ✍️ **Lời của mình:** *tăng số mũ → "nhớ" được nhiều dữ liệu hơn, nhưng tăng số mũ → dễ bị overfit.*
> 🔑 Chỉnh cho sắc: **"nhớ được nhiều" = HỌC THUỘC từng điểm (kể cả nhiễu) ≠ HIỂU quy luật.** Khớp hoàn hảo trên train nhưng sai bét trên dữ liệu mới (test) → model giỏi là model **tổng quát hóa**, không phải model nhớ.

| Bậc | Hình (slide) | Vấn đề |
|---|---|---|
| 1 | đường thẳng | **dưới khớp (underfit)** — quá cứng, **bias cao** |
| 3 | cong vừa vặn | ✅ **khớp tốt** — nắm quy luật |
| 15 | rắn lượn ôm nhiễu | **quá khớp ([[overfitting]])** — học thuộc, **variance cao** |

- ⚠️ **Bậc càng cao càng dễ [[overfitting]]** → đây là **đánh đổi Bias–Variance**: bậc thấp = bias cao (underfit), bậc cao = variance cao (overfit) → tìm điểm giữa.
- **Chọn bậc:** [[cross-validation]]. **Ghìm overfit:** [[regularization]] (phạt hệ số lớn).

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Nhầm với [[logistic-regression]]:** linear đoán **số**, logistic đoán **lớp**.
- **Bỏ qua giả định** → tin hệ số β trong khi dữ liệu vi phạm (đa cộng tuyến, phương sai lệch).
- **Không scale** khi dùng GD → hội tụ chậm/lệch ([[chuan-hoa-du-lieu]]).
- **R² cao = mô hình tốt?** Không hẳn — R² luôn tăng khi thêm biến vô ích → phải nhìn **Adjusted R²** ([[metric-hoi-quy]]).
- **Đa cộng tuyến** làm β đảo dấu vô lý → đừng diễn giải hệ số khi VIF cao.

---

## 🔗 Liên kết
- **Tiền đề:** [[gradient-descent]] · [[loss-function]] (MSE) · [[phuong-sai]] · [[tuong-quan]] · [[chuan-hoa-du-lieu]]
- **Đánh giá bằng:** [[metric-hoi-quy]] (MAE/RMSE/R²/Adjusted R²)
- **So với:** [[logistic-regression]] (đoán lớp) · [[decision-tree]] (phi tuyến, white-box)
- **Chống overfit:** [[regularization]] (Ridge/Lasso) · [[cross-validation]] · [[pca]] (khi đa cộng tuyến)
- **Thuộc:** [[phan-loai-hoc-may]] (có giám sát → hồi quy) · [[chon-mo-hinh]]

## ❓ Câu hỏi mở
- Khi nào nên chuyển từ Normal Equation sang Gradient Descent trong thực tế? (ngưỡng p bao nhiêu?)
- Đa cộng tuyến: nên bỏ đặc trưng hay dùng Ridge? Quyết định dựa trên gì?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L3_LinearReg.pdf`).
- StatQuest — "Linear Regression", "R-squared". · ISLR ch.3 (Linear Regression).
