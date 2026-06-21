# Đánh đổi Bias – Variance (Bias–Variance Tradeoff)

> Tóm tắt 1 câu: Lỗi của model tách thành **Bias** (sai do quá đơn giản) + **Variance** (sai do quá nhạy với mẫu cụ thể). Tăng độ phức tạp → bias giảm nhưng variance tăng → có một điểm **"vừa phải"** tối ưu. Đây là khung lý thuyết của [[overfitting]].

**Ngày tạo:** 2026-06-21
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh C / Lớp LÀM ← cần [[overfitting]] · [[phuong-sai]] · → dẫn tới [[regularization]] · [[feature-selection]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #overfitting #bias-variance #core
**Nguồn slide:** `L5_Regularization_FeatureSelection.pdf` Phần 02 — TS. Cao Tiến Dũng

---

## 💡 Ý chính
- **Bias (độ chệch):** chênh giữa **kỳ vọng học được** và **sự thật** — model **quá đơn giản** bỏ sót quy luật. **GIẢM** khi mô hình phức tạp hơn.
- **Variance (phương sai):** độ **nhạy với tập dữ liệu cụ thể** — đổi mẫu một chút thì model đổi nhiều. **TĂNG** khi mô hình phức tạp hơn.
- **Dưới khớp = bias cao** · **Quá khớp = variance cao** ([[overfitting]]).

## 🎯 Trực giác bia bắn (4 ô)
```
Bias thấp · Var thấp  → chụm + trúng tâm   (lý tưởng)
Bias thấp · Var cao   → quanh tâm nhưng tản (overfit: đúng trung bình, lệch từng lần)
Bias cao  · Var thấp  → chụm nhưng lệch tâm (underfit: nhất quán nhưng sai)
Bias cao  · Var cao   → vừa tản vừa lệch    (tệ nhất)
```

## 🔢 Phân rã lỗi (decomposition)
```
E[(y − f̂)²]  =  Bias[f̂]²  +  Var[f̂]  +  σ²
   tổng lỗi       (chệch)     (phương sai)   nhiễu không thể giảm
```
- **σ²** = nhiễu nội tại của dữ liệu — **không** model nào khử được.
- Ta chỉ điều khiển được **Bias** và **Variance** qua độ phức tạp mô hình.

## 📉 Đường cong chữ U
```
Lỗi
 │\                      ╱  Variance (tăng theo độ phức tạp)
 │ \                   ╱
 │  \___           ___╱
 │      ‾‾‾●‾‾‾‾‾‾        ← Tổng lỗi: dạng chữ U → có ĐỘ PHỨC TẠP TỐI ƯU
 │       ╱   ‾‾‾───___
 │     ╱  Bias² (giảm theo độ phức tạp)
 └────────────────────────→ Độ phức tạp mô hình
```
- Tăng độ phức tạp: **Bias² giảm**, **Variance tăng** → **Tổng lỗi** có dạng **chữ U** → tồn tại điểm "vừa phải" tối thiểu tổng lỗi.
- **Mục tiêu:** cân bằng — không quá đơn giản cũng không quá phức tạp.

## 🛠️ Điều khiển đánh đổi thế nào
| Muốn giảm... | Cách |
|---|---|
| **Variance** (đang overfit) | [[regularization]] · [[feature-selection]] · thêm dữ liệu · đơn giản hóa model · [[cross-validation]] · **Bagging** ([[random-forest]]) |
| **Bias** (đang underfit) | model phức tạp hơn · thêm đặc trưng / [[feature-engineering]] · giảm regularization · **Boosting** ([[xgboost]]) |

## 🤝 Ensemble — "thuốc" theo từng bệnh (cầu sang Buổi 7)
> 🔑 **Mapping cốt lõi:**
> - **Variance cao (overfit)** → **Bagging**: train nhiều model **độc lập, song song** rồi **trung bình/vote** → triệt tiêu dao động ngẫu nhiên → ↓ variance. Vd [[random-forest]].
> - **Bias cao (underfit)** → **Boosting**: train **nối tiếp**, mỗi model **sửa lỗi** model trước → xây dần độ phức tạp → ↓ bias. Vd [[xgboost]].
> - **Kết hợp cả hai / nhiều model khác nhau** → **Stacking / Blending**: một "meta-model" học cách **gộp dự đoán** của nhiều model đa dạng → có thể giảm **cả** bias lẫn variance.

- 👉 Thực tế (Kaggle, hệ thống lớn): **hiếm khi dùng 1 model** — người ta **ensemble rất nhiều** model để cân bias–variance tốt nhất. Đây là nội dung **Buổi 7 (Ensemble)** `[[ensemble]]` *(chưa có slide)*.
- ⚠️ Lưu ý: boosting xây phức tạp dần → nếu quá tay vẫn **tăng variance** (overfit); cần early stopping + [[regularization]].

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Tưởng cứ phức tạp hơn là tốt hơn** → quá điểm tối ưu thì variance nuốt hết lợi ích.
- **Quên σ²:** không thể đạt lỗi 0 — luôn còn nhiễu nội tại.
- Nhầm bias (chệch hệ thống) với variance (dao động theo mẫu).

---

## 🔗 Liên kết
- **Tiền đề:** [[overfitting]] (hiện tượng) · [[phuong-sai]] (variance)
- **Dẫn tới:** [[regularization]] (giảm variance, hướng 1) · [[feature-selection]] (giảm variance, hướng 2) · [[cross-validation]]
- **Liên quan:** [[linear-regression]] (polynomial degree = núm độ phức tạp) · [[dinh-huong-hoc]]

## ❓ Câu hỏi mở
- Làm sao biết đang ở bên nào của chữ U (underfit hay overfit) cho bài cụ thể?
- Thêm dữ liệu giúp giảm variance tới đâu thì bão hòa?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L5_Regularization_FeatureSelection.pdf` Phần 02).
- StatQuest — "Machine Learning Fundamentals: Bias and Variance".
