# Xác suất có điều kiện & Định lý Bayes

> Tóm tắt 1 câu: **Xác suất có điều kiện $P(A \mid B)$** = khả năng A xảy ra **khi đã biết** B. **Bayes** là công thức *đảo ngược* điều kiện: từ cái dễ đo $P(B \mid A)$ suy ra cái ta cần $P(A \mid B)$ — nền tảng của Naive Bayes (lọc spam, phân loại).

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh C (Xác suất → Thống kê) · nhánh phụ Bayes ← cần [[xac-suat]] · → ứng dụng [[naive-bayes]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #toan #xac-suat #bayes #phan-loai

---

## 💡 Ý chính
> Diễn đạt lại bằng lời của bạn — nếu giải thích được thì mới thật sự hiểu.

- **Xác suất có điều kiện $P(A \mid B)$:** thu hẹp thế giới lại chỉ còn những trường hợp **B đã xảy ra**, rồi hỏi trong đó A chiếm bao nhiêu.
- **Bayes:** nhiều khi ta biết chiều dễ $P(B \mid A)$ nhưng cần chiều ngược $P(A \mid B)$. Bayes cho phép "lật" lại.
  - Ví dụ: biết `P(có triệu chứng | bị bệnh)`, nhưng điều ta thật sự cần là `P(bị bệnh | có triệu chứng)`.

## 🔢 Công thức / Định nghĩa
> Ký hiệu ML: **h** = giả thuyết (hypothesis), **d** = dữ liệu quan sát (data).

Xác suất có điều kiện:

$$P(h \mid d) = \frac{P(h \cap d)}{P(d)}$$

Định lý Bayes:

$$\underbrace{P(h \mid d)}_{\text{posterior}} = \frac{\overbrace{P(d \mid h)}^{\text{likelihood}} \cdot \overbrace{P(h)}^{\text{prior}}}{\underbrace{P(d)}_{\text{evidence}}}$$

| Thành phần | Tên | Ý nghĩa |
|------------|-----|---------|
| $P(h)$ | Tiên nghiệm (prior) | Niềm tin về giả thuyết **trước khi** thấy dữ liệu |
| $P(d \mid h)$ | Khả năng (likelihood) | Nếu giả thuyết đúng thì quan sát được dữ liệu d dễ thế nào |
| $P(d)$ | Bằng chứng (evidence) | Xác suất biên của dữ liệu — chuẩn hóa cho tổng = 1 |
| $P(h \mid d)$ | Hậu nghiệm (posterior) | Niềm tin về giả thuyết **sau khi** thấy dữ liệu |

> Tinh thần: **hậu nghiệm = tiên nghiệm × khả năng / bằng chứng**. Thấy thêm dữ liệu → cập nhật niềm tin.
>
> Tính $P(d)$ bằng cách cộng mọi đường dẫn tới d:  $P(d) = P(d \mid h)\cdot P(h) + P(d \mid \neg h)\cdot P(\neg h)$

## 🧩 Ví dụ tính bằng số: xét nghiệm bệnh hiếm

**Đề bài:** Bệnh hiếm, 1% dân số mắc. Xét nghiệm rất tốt: đúng 99% cả hai chiều. Bạn xét nghiệm **dương tính** → khả năng bạn **thật sự bị bệnh** là bao nhiêu?

**Đặt biến:**
- $h$ = "bị bệnh", $d$ = "xét nghiệm dương tính"
- $P(h) = 0.01$ — tiên nghiệm (bệnh hiếm)
- $P(d \mid h) = 0.99$ — khả năng (bệnh thì 99% ra dương)
- $P(d \mid \neg h) = 0.01$ — dương giả 1% (người khỏe vẫn dương 1%)

**Bước 1 — tính bằng chứng $P(d)$:**

$$\begin{aligned}
P(d) &= P(d \mid h)\cdot P(h) + P(d \mid \neg h)\cdot P(\neg h) \\
     &= 0.99 \times 0.01 + 0.01 \times 0.99 \\
     &= 0.0099 + 0.0099 = 0.0198
\end{aligned}$$

**Bước 2 — áp Bayes:**

$$P(h \mid d) = \frac{P(d \mid h)\cdot P(h)}{P(d)} = \frac{0.0099}{0.0198} = 0.5 \Rightarrow 50\%$$

**Kết quả gây sốc:** xét nghiệm đúng tới 99% mà dương tính chỉ **thật sự bị bệnh 50%**!
- **Vì sao:** bệnh quá hiếm (prior 1%) → trong 99 người khỏe vẫn có ~1 người dương giả, ngang số người bệnh thật dương → 50/50.
- **Bài học:** $P(h \mid d) \neq P(d \mid h)$. Prior (độ hiếm) ảnh hưởng cực mạnh — không đoán bằng cảm tính, phải tính.

> 💡 **Liên hệ ML:** y hệt lọc spam — `P(spam | chứa từ "khuyến mãi")` phụ thuộc cả vào việc spam phổ biến cỡ nào (prior), không chỉ vào "từ đó hay xuất hiện trong spam" (likelihood).

## ⚙️ Ứng dụng trong ML
- **Naive Bayes** ([[naive-bayes]]) — phân loại spam, văn bản:
  - Tính `P(spam | các từ trong mail)` cho mỗi lớp → chọn lớp xác suất cao nhất.
  - **"Naive"** = giả định các đặc trưng (từ) **độc lập** với nhau cho gọn — sai thực tế nhưng chạy tốt bất ngờ.
- Khung **Bayesian** nói chung: cập nhật niềm tin về tham số model khi có thêm dữ liệu.

## 📏 Phạm vi dùng & giới hạn (Bayes hợp case nào?)
> Phân biệt quan trọng: **"Naive Bayes" (một model)** ≠ **"Định lý Bayes" (nguyên lý)**.

| | Naive Bayes (bộ phân loại) | Định lý Bayes (nguyên lý) |
|---|---|---|
| Quy mô | Model **nhỏ, nhẹ**, ít dữ liệu | Dùng ở **mọi quy mô** |
| Hợp với | Case cụ thể: spam, phân loại văn bản, baseline | Cả bài toán lớn |
| Ví dụ lớn | — | Bayesian optimization (tinh siêu tham số), Gaussian Process, Bayesian neural net, A/B test |

- ✅ **Đúng một phần:** *Naive Bayes* đúng là hợp model nhỏ / case cụ thể, cần ít dữ liệu, làm baseline tốt.
- ⚠️ **Nhưng:** *định lý Bayes* không chỉ cho model nhỏ. Lý do nó **ít xuất hiện dạng đầy đủ** ở model khổng lồ:
  - Tính chính xác `P(d)` + hậu nghiệm trên hàng triệu tham số **cực tốn** → phải **xấp xỉ** (variational inference, MCMC) hoặc chỉ lấy **điểm ước lượng** (MLE/MAP).
  - Tư tưởng Bayes vẫn **ẩn bên trong**: ví dụ **regularization = đặt prior lên tham số** (MAP).

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **$P(h \mid d) \neq P(d \mid h)$** — lỗi đảo điều kiện, phổ biến nhất.
- **Quên prior:** bỏ qua "bệnh hiếm cỡ nào" → kết luận sai nặng (base rate fallacy).
- Naive Bayes giả định độc lập — biết là giả định, đừng tin nó luôn đúng.

---

## 🔗 Liên kết
- **Liên quan tới:** [[phan-phoi-xac-suat]] · [[maximum-likelihood]]
- **Tiền đề (cần biết trước):** [[xac-suat]]
- **Dẫn tới (học tiếp):** [[naive-bayes]] · [[logistic-regression]]

## ❓ Câu hỏi mở
- Vì sao Naive Bayes vẫn chính xác cao dù giả định độc lập gần như luôn sai?
- Prior nên lấy từ đâu khi ta không có thông tin trước?

## 📚 Nguồn
- 3Blue1Brown — "Bayes theorem, the geometry of changing beliefs".
- StatQuest — "Naive Bayes, clearly explained".
