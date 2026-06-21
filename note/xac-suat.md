# Xác suất trong ML — Vì sao cần & các khái niệm cốt lõi

> Tóm tắt 1 câu: ML luôn làm việc với **sự không chắc chắn** (dữ liệu nhiễu, dự đoán không tuyệt đối) — xác suất là ngôn ngữ để **đo độ tin**, model "tin 90% đây là mèo" thay vì trả lời cứng đúng/sai.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh C (Xác suất → Thống kê) · #1 → kế tiếp [[phan-phoi-xac-suat]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #toan #xac-suat #bat-buoc #nen-tang

---

## 💡 Vì sao ML cần xác suất
> Theo định hướng [[dinh-huong-hoc]]: hiểu để xử lý dữ liệu & đọc kết quả model cho đúng.

- **Dữ liệu nhiễu, không hoàn hảo** → không thể chắc chắn 100%, phải nói "khả năng bao nhiêu".
- **Model trả ra xác suất:** phân loại ảnh → "85% chó, 15% mèo"; lọc spam → "P(spam) = 0.97".
- **Hàm mất mát đến từ xác suất:** cross-entropy = bắt nguồn từ likelihood (xem [[loss-function]]).
- Đọc kết quả đúng = hiểu con số xác suất model đưa ra **có đáng tin không**.

## 🧩 Các khái niệm cốt lõi (bản đồ con)

| Khái niệm | Ý nghĩa ngắn | Note |
|-----------|--------------|------|
| Xác suất `P(A)` | Khả năng biến cố A xảy ra, từ 0 → 1 | (mục dưới) |
| Xác suất có điều kiện `P(A\|B)` | Khả năng A **khi đã biết** B | [[xac-suat-co-dieu-kien]] |
| Định lý Bayes | Đảo ngược điều kiện: từ `P(B\|A)` ra `P(A\|B)` | [[dinh-ly-bayes]] |
| Biến ngẫu nhiên & phân phối | Mô tả dữ liệu dao động thế nào | [[phan-phoi-xac-suat]] |
| Kỳ vọng `E[X]` & phương sai | Trung bình & mức dao động | [[ky-vong-trung-binh]] · [[phuong-sai]] |
| Độc lập | Hai biến không ảnh hưởng nhau | — |
| Maximum Likelihood (MLE) | Chọn tham số làm dữ liệu "dễ xảy ra nhất" | [[maximum-likelihood]] |

## 🔢 Vài luật nền tảng

```
0 ≤ P(A) ≤ 1                       (xác suất nằm trong [0,1])
P(A) + P(không A) = 1              (luật bù)
P(A và B) = P(A) · P(B)           (nếu A, B độc lập)
P(A | B) = P(A và B) / P(B)        (xác suất có điều kiện)
```

## ⚙️ Ứng dụng trong ML
- **Naive Bayes** — lọc spam, phân loại văn bản (dựa thẳng vào [[dinh-ly-bayes]]).
- **Logistic Regression / Softmax** — đầu ra là xác suất các lớp.
- **Cross-entropy loss** — đo "model dự đoán phân phối xác suất lệch bao nhiêu so với thật".
- **Mô hình sinh (generative)** — học phân phối của dữ liệu để tạo mẫu mới.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **`P(A|B) ≠ P(B|A)`** — lẫn hai cái này là lỗi kinh điển (xem nghịch lý trong [[dinh-ly-bayes]]).
- Xác suất cao **không** = chắc chắn đúng; model "tự tin 99%" vẫn có thể sai (over-confidence).
- "Độc lập" là giả định mạnh — Naive Bayes giả định độc lập để đơn giản, đời thực hiếm khi đúng hẳn.

---

## 🔗 Liên kết
- **Liên quan tới:** [[thong-ke]] · [[loss-function]]
- **Dẫn tới (học tiếp):** [[xac-suat-co-dieu-kien]] · [[dinh-ly-bayes]] · [[phan-phoi-xac-suat]]
- **Ứng dụng:** [[naive-bayes]] · [[logistic-regression]]

## ❓ Câu hỏi mở
- Khác nhau giữa xác suất (probability) và thống kê (statistics) là gì?
- Vì sao tối thiểu hóa cross-entropy lại tương đương tối đa hóa likelihood?

## 📚 Nguồn
- StatQuest — Probability & Bayes.
- 3Blue1Brown — "Bayes theorem".
