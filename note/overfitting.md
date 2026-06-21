# Tổng thể vs Mẫu & Overfitting

> Tóm tắt 1 câu: Ta chỉ train trên **mẫu (sample)** nhưng mục tiêu là chạy tốt trên **tổng thể (population)** — dữ liệu thật chưa từng thấy. **Overfitting** = model **học thuộc lòng mẫu** (cả nhiễu) nên điểm cao lúc train mà ra đời thì sai bét.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh C / Lớp LÀM ← cần [[thong-ke]] · liên quan [[dinh-huong-hoc]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #thong-ke #overfitting #generalization #core

---

## 💡 Ý chính
> Diễn đạt lại bằng lời của bạn — nếu giải thích được thì mới thật sự hiểu.

- **Tổng thể (population):** toàn bộ dữ liệu có thể có (vd: *mọi* email spam trên đời). Ta **không bao giờ** thấy hết.
- **Mẫu (sample):** phần dữ liệu ta thu thập được để train — chỉ là **một lát cắt** của tổng thể.
- **Mục tiêu thật:** model giỏi trên **tổng thể** (dữ liệu thật, chưa thấy), **không phải** chỉ giỏi trên mẫu.
- **Overfitting:** model **học thuộc mẫu** — nhớ cả chi tiết vụn & nhiễu riêng của mẫu → ra population thì "éo biết làm" → hỏng.

## 🧩 Trực giác: học thuộc đề vs hiểu bài
- **Overfit = học vẹt:** thuộc lòng đáp án đề cũ → gặp đề cũ điểm tuyệt đối, gặp đề mới tạch.
- **Underfit = lười học:** model quá đơn giản, đến mẫu còn không nắm được → sai cả train lẫn test.
- **Vừa đúng (good fit):** nắm **quy luật chung**, bỏ qua nhiễu → làm tốt cả đề mới.

```
Underfit  ──────  Vừa đúng  ──────  Overfit
quá đơn giản     nắm quy luật      học thuộc nhiễu
sai cả 2 bên     tổng quát tốt     train giỏi, test tệ
```

**Hình dạng đường khớp (slide L2):**
- **Dưới khớp:** đường **quá đơn giản** (vd 1 đường thẳng) → khớp **KÉM cả train lẫn test**, bỏ sót xu hướng.
- **Quá khớp:** đường **quá phức tạp, ngoằn ngoèo** ôm từng điểm → khớp **TỐT train** nhưng **KÉM test** (học cả nhiễu).
- **Vừa đúng:** đường mượt nắm xu hướng chính, bỏ qua nhiễu.

## 📉 Dấu hiệu nhận biết
- **Train accuracy cao** nhưng **validation/test accuracy thấp** → khoảng cách lớn = **overfit**.
- Cả train lẫn test đều thấp → **underfit**.
- Liên quan **bias–variance tradeoff:** overfit = variance cao; underfit = bias cao → [[bias-variance]].

> 🔥 **Nhóm "đáng sợ nhất" (ảo tưởng thành công — con số đẹp nhưng dối trá):**
> | Nỗi sợ | Trông thì | Thật ra | Phòng thủ |
> |---|---|---|---|
> | **Overfitting** | train ~100% | học thuộc nhiễu → test tệ | [[cross-validation]] · [[regularization]] · [[feature-selection]] |
> | **Data leakage** ⚠️ | cả test cũng cao | test nhìn trộm → ra đời mới lộ | fit scaler/imputer/encoder **chỉ trên train** |
> | **Lệch lớp** | Accuracy 99% | Recall 0% | F1/PR-AUC → [[class-imbalance]] |
> | **Sampling bias** | giỏi trên mẫu | mẫu không đại diện | mẫu đủ lớn & đại diện → [[lay-mau]] |
>
> 🔑 **Đáng sợ nhất = Data leakage** vì nó làm hỏng cả **thước đo** (tập test) → bạn không có cách nào biết mình sai cho tới khi deploy.

## ⚙️ Cách tránh overfitting (thực hành)
> Đa số nằm ở **cách xử lý/chia dữ liệu** — đúng tinh thần [[dinh-huong-hoc]].

| Cách | Ý tưởng |
|------|---------|
| **Tách train / validation / test** | Đo trên dữ liệu model **chưa thấy** → ước lượng độ giỏi trên tổng thể |
| **Cross-validation** | Chia nhiều lần, lấy trung bình → đánh giá ổn định hơn |
| **Thêm dữ liệu / augmentation** | Mẫu lớn & đa dạng hơn → khó học thuộc |
| **Regularization (L1/L2)** | *Hướng 1:* giữ MỌI đặc trưng, **co nhỏ hệ số** → đặt **prior** lên tham số → [[regularization]] (nối [[dinh-ly-bayes]]) |
| **Chọn đặc trưng (Feature selection)** | *Hướng 2:* **BỎ BỚT** đặc trưng nhiễu/trùng → [[feature-selection]] |
| **Đơn giản hóa model** | Ít tham số hơn → ít chỗ để "nhớ vẹt" |
| **Early stopping** | Dừng train khi validation bắt đầu tệ đi |

> 🔱 **Hai hướng chống overfitting (slide L5):** ① **Regularization** (giữ hết feature, thu nhỏ θ) · ② **Feature selection** (giảm số feature). Khung lý thuyết chung: [[bias-variance]].

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Mẫu lệch (sampling bias):** mẫu không đại diện tổng thể → model giỏi trên mẫu vẫn vô dụng thật tế (vd train toàn ảnh ban ngày, chạy ban đêm tạch).
- **Data leakage:** lỡ để thông tin tập test lọt vào lúc train → điểm test ảo cao, ra đời sụp.
- **Tin điểm train:** điểm train cao **không** nói lên gì về tổng thể — luôn nhìn **validation/test**.
- Đánh giá phải trên **mẫu đủ lớn & đại diện** (nối [[thong-ke]]).

---

## 🔗 Liên kết
- **Tiền đề (cần biết trước):** [[thong-ke]]
- **Liên quan tới:** [[dinh-huong-hoc]] · [[chuan-hoa-du-lieu]] · [[dinh-ly-bayes]] (regularization = prior)
- **Dẫn tới (học tiếp):** [[bias-variance]] · [[cross-validation]] · [[regularization]]

## ❓ Câu hỏi mở
- Tỉ lệ chia train/validation/test bao nhiêu là hợp lý?
- Làm sao biết mẫu của mình có **đại diện** cho tổng thể hay không?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L5_Regularization_FeatureSelection.pdf` Phần 02).
- StatQuest — "Machine Learning Fundamentals: Bias and Variance".
- Andrew Ng — "Train/dev/test sets" (Deep Learning Specialization).
