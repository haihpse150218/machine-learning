# Maximum Likelihood Estimation (MLE) — Ước lượng hợp lý cực đại

> Tóm tắt 1 câu: MLE tìm **tham số** của một phân phối/mô hình sao cho **khả năng (likelihood) quan sát được đúng bộ dữ liệu này là CAO NHẤT** — tức trượt đường cong phân phối tới vị trí "ôm" được nhiều điểm dữ liệu nhất.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh C (Thống kê) → cầu sang hồi quy ← cần [[xac-suat]] · [[phan-phoi-xac-suat]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #toan #xac-suat #estimation #regression

---

## 💡 Ý chính
> Đúng mạch nghĩ của bạn: dữ liệu thả vào phải "nằm trong" đường phân phối; tìm phương trình xác suất chứa nhiều điểm dữ liệu nhất.

- Giả định dữ liệu **sinh ra từ một phân phối** có tham số θ (vd Gaussian với μ, σ).
- **Likelihood L(θ):** "nếu tham số là θ thì xác suất thấy đúng bộ dữ liệu này là bao nhiêu?"
- **MLE:** chọn θ làm L(θ) **lớn nhất** → đường cong phân phối "khớp/ôm" dữ liệu tốt nhất.

## 🔢 Công thức
```
L(θ) = P(data | θ) = ∏ᵢ P(xᵢ | θ)        (giả định các điểm độc lập)

Log-likelihood:  ℓ(θ) = Σᵢ log P(xᵢ | θ)   (biến tích → tổng, dễ tối ưu)

MLE:  θ* = argmax_θ  ℓ(θ)
```
> Lấy **log** để: (1) tích → tổng dễ tính, (2) tránh tràn số khi nhân nhiều xác suất nhỏ. log đồng biến nên không đổi vị trí cực đại.

## 🧩 Trực giác (trượt đường cong)
- Tưởng tượng các điểm dữ liệu nằm trên trục; ta **trượt + co giãn đường chuông** Gaussian.
- Vị trí nào làm **tổng xác suất các điểm cao nhất** (đường cong ôm sát đám điểm nhất) → tham số đó là MLE.
- Với Gaussian: **MLE của μ = trung bình mẫu** ([[ky-vong-trung-binh]]); **MLE của σ² = phương sai mẫu** ([[phuong-sai]]). Đẹp đúng trực giác!

## 🔁 "Cách nhìn khác của hồi quy" (insight của bạn — rất đúng)
- **Hồi quy tuyến tính = MLE** với giả định **nhiễu Gaussian**:
  - Giả định y = (đường thẳng) + nhiễu chuẩn → **tối đa likelihood ⟺ tối thiểu sai số bình phương (MSE)** = least squares.
  - Tức "tìm đường khớp dữ liệu nhất" (hồi quy) và "tìm tham số likelihood cao nhất" (MLE) là **một**.
- **Hồi quy logistic = MLE** với phân phối **Bernoulli** (0/1).

## 🔗 Nối với hàm mất mát & entropy
- **−log-likelihood = hàm mất mát (loss):** *tối đa likelihood ⟺ tối thiểu (−log L)*.
- **Cross-entropy loss = negative log-likelihood** của phân loại → [[loss-function]] · [[entropy]].
- Vì vậy train model (tối thiểu loss bằng [[gradient-descent]]) thực ra là **làm MLE**.

## ⛓️ Chuỗi sai: mẫu sai → curve sai → population sai
> Mạch nghĩ của bạn — vì MLE khớp đường cong **dựa trên mẫu**, nên mẫu hỏng là hỏng cả chuỗi:

```
Lấy mẫu SAI (lệch, không đại diện)        → [[lay-mau]]
   → MLE ôm theo đám điểm LỆCH đó
   → tìm ra đường cong / tham số θ SAI      (curve khớp mẫu lệch, không khớp thật)
   → đưa vào tổng thể (population) → DỰ ĐOÁN SAI   → [[suy-dien-hoc-may]]
```
- MLE **trung thực với dữ liệu bạn đưa** — nó ôm đúng cái mẫu, kể cả khi mẫu lệch.
- Đây chính là *"garbage in, garbage out"* ở tầng ước lượng tham số: **chọn mẫu đại diện là điều kiện tiên quyết** trước khi nói tới curve hay model.
- Cùng họ với [[overfitting]] (khớp mẫu quá mức) — nhưng đây là lỗi từ **gốc dữ liệu mẫu**, không phải độ phức tạp model.

## ⚖️ MLE vs MAP (Bayes)
- **MLE:** chỉ dùng likelihood `P(data|θ)`.
- **MAP:** thêm **tiên nghiệm** `P(θ)` → `argmax P(data|θ)·P(θ)` = MLE + prior → chính là [[dinh-ly-bayes]].
- Regularization ≈ thêm prior → MAP (chống [[overfitting]]).

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Sai giả định phân phối:** MLE chỉ tốt nếu dạng phân phối giả định gần đúng thực tế.
- **Nhạy outlier:** vài điểm lạ kéo lệch tham số ước lượng.
- **Likelihood ≠ xác suất của θ:** likelihood là hàm theo θ với dữ liệu cố định, không phải P(θ).
- MLE có thể **overfit** nếu model quá phức tạp (nhiều tham số) → cần regularization/MAP.

---

## 🔗 Liên kết
- **Tiền đề (cần biết trước):** [[xac-suat]] · [[phan-phoi-xac-suat]] · [[ky-vong-trung-binh]]
- **Nối tới:** [[loss-function]] · [[gradient-descent]] · [[dinh-ly-bayes]] (MAP)
- **Ứng dụng:** [[linear-regression]] · [[logistic-regression]]

## ❓ Câu hỏi mở
- Vì sao giả định nhiễu Gaussian lại dẫn thẳng tới least squares (MSE)?
- Khi nào nên dùng MAP (thêm prior) thay vì MLE thuần?

## 📚 Nguồn
- StatQuest — "Maximum Likelihood, clearly explained".
- ISLR — Statistical Learning.
