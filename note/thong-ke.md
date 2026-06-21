# Thống kê trong ML — Rút hiểu biết từ dữ liệu

> Tóm tắt 1 câu: Thống kê là **đi ngược với xác suất** — từ **dữ liệu quan sát được**, suy ngược ra quy luật/độ tin cậy. Trong ML, đây là công cụ để **hiểu dữ liệu (EDA)**, **đo độ tin của kết luận** và **kiểm định** (A/B test) trước khi tin vào con số.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh C (Xác suất → Thống kê) · #3 (nửa Thống kê) ← cần [[xac-suat]] · [[phan-phoi-xac-suat]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #toan #thong-ke #data #bat-buoc #eda

---

## 💡 Xác suất vs Thống kê (đừng lẫn)
> Đây là câu hỏi cốt lõi — hai cái ngược chiều nhau:

```
XÁC SUẤT:   đã biết quy luật/phân phối  →  dự đoán dữ liệu sẽ ra sao
            (biết xúc xắc cân → đoán tung ra mặt nào)

THỐNG KÊ:   có dữ liệu quan sát          →  suy ngược ra quy luật + độ tin
            (tung 1000 lần → xúc xắc này có cân không?)
```

- ML thực hành nghiêng về **thống kê**: ta luôn xuất phát từ **dữ liệu**, suy ra mô hình & đánh giá độ tin.

## 🧩 Hai nhánh thống kê

| Nhánh | Làm gì | Khái niệm chính |
|-------|--------|-----------------|
| **Mô tả (Descriptive)** | Tóm tắt dữ liệu đang có | trung bình, trung vị, mode, [[phuong-sai]], độ lệch chuẩn, percentile, histogram |
| **Suy diễn (Inferential)** | Từ **mẫu** suy ra **tổng thể** | lấy mẫu, khoảng tin cậy, kiểm định giả thuyết, p-value, A/B test |

## ⚙️ Các khái niệm cốt lõi (bản đồ con)

| Khái niệm | Ý nghĩa ngắn | Note |
|-----------|--------------|------|
| Tổng thể vs Mẫu (population/sample) | Ta chỉ có mẫu, muốn nói về tổng thể → [[overfitting]] | [[overfitting]] |
| Trung bình / Trung vị / Mode | Đo "tâm" của dữ liệu | [[ky-vong-trung-binh]] |
| Phương sai / Độ lệch chuẩn | Đo độ dao động | [[phuong-sai]] |
| Khoảng tin cậy (confidence interval) | "Đúng giá trị nằm trong khoảng này, tin X%" | [[khoang-tin-cay]] |
| Kiểm định giả thuyết | Chênh lệch là thật hay do may rủi? | [[kiem-dinh-gia-thuyet]] |
| p-value | Mức "bất ngờ" của dữ liệu nếu H₀ đúng | [[p-value]] |
| Tương quan vs Nhân quả | Đi cùng nhau ≠ cái này gây cái kia | [[tuong-quan]] |

## 🎯 Vì sao quan trọng cho ML (data-centric)
> Theo [[dinh-huong-hoc]]: hiểu dữ liệu trước khi quăng vào model.

- **EDA (Exploratory Data Analysis):** thống kê mô tả + biểu đồ để *hiểu dữ liệu* trước khi train — phân phối từng cột, outlier, dữ liệu thiếu.
  - 👉 EDA còn **định hướng chọn model & độ đo**: thấy lệch lớp → dùng Precision/Recall thay Accuracy. Xem [[danh-gia-mo-hinh]].
- **Đánh giá model đáng tin không:** độ chính xác 92% trên 50 mẫu ≠ trên 50.000 mẫu → cần khoảng tin cậy.
- **A/B test:** kiểm định bản B có thật sự tốt hơn A không (xem [[gauss-va-nhi-thuc]] · [[kiem-dinh-gia-thuyet]]).
- **Phát hiện lệch & trôi dữ liệu (bias / drift):** so phân phối tập train vs thực tế.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Tương quan ≠ nhân quả** — kinh điển nhất. Hai biến đi cùng nhau không có nghĩa cái này gây ra cái kia.
- **Trung bình lừa người** với dữ liệu lệch/có outlier → nên xem cả **trung vị**.
- **p-value bị hiểu sai:** p nhỏ ≠ "hiệu ứng lớn" hay "chắc chắn đúng"; chỉ là "khó xảy ra nếu không có hiệu ứng".
- **Mẫu nhỏ / mẫu lệch:** kết luận từ mẫu không đại diện → sai cho tổng thể.

---

## 🔗 Liên kết
- **Tiền đề (cần biết trước):** [[xac-suat]] · [[phan-phoi-xac-suat]]
- **Liên quan tới:** [[phuong-sai]] · [[ma-tran-hiep-phuong-sai]] · [[gauss-va-nhi-thuc]]
- **Dẫn tới (học tiếp):** [[kiem-dinh-gia-thuyet]] · [[p-value]] · [[xu-ly-du-lieu]]

## ❓ Câu hỏi mở
- Khi nào dùng trung bình, khi nào dùng trung vị để mô tả dữ liệu?
- Cỡ mẫu bao nhiêu là "đủ" để kết luận đáng tin?

## 📚 Nguồn
- StatQuest — "Statistics Fundamentals" series.
- Khan Academy — Statistics & Probability.
