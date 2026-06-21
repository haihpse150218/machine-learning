# Định hướng học ML — Học để làm gì & tập trung vào đâu

> Tóm tắt 1 câu: Học toán/thuật toán **không phải để tự train model khổng lồ từ đầu** (cần phần cứng + tiền), mà để **HIỂU model đang làm gì** — từ đó tập trung vào thứ ta kiểm soát được: **xử lý dữ liệu "thả vào" cho đúng** và **dùng lại model có sẵn** sao cho hiệu quả.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟢 Kim chỉ nam (đọc thường xuyên)
**📨 Loại:** Định hướng / Meta — không nằm trong chuỗi dependency
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #meta #dinh-huong #data #mlops

---

## 💡 Lập luận cốt lõi

```
1. Train model lớn từ đầu  →  cần GPU + tiền + dữ liệu khổng lồ  →  cá nhân khó
2. Thực tế: ta ỨNG DỤNG & DÙNG LẠI model có sẵn (pretrained, fine-tune, API)
3. Vậy học toán/thuật toán để làm gì?  →  để HIỂU bên trong, không phải để build lại
4. Thứ ta thật sự kiểm soát & quyết định kết quả  →  DỮ LIỆU thả vào
=> Mục tiêu: hiểu đủ sâu để xử lý dữ liệu đúng và chọn/dùng model hiệu quả
```

## 📊 Thực tế doanh nghiệp: quy tắc 90/10
> Lời thầy (ghi nhớ): *"Tụi mày chết :)"* — và đây là lý do.

```
90%  =  TÌM dữ liệu + XỬ LÝ dữ liệu   (bục mặt ra)
10%  =  thuật toán / model
```

- **Bài tập trên lớp** chỉ cho sẵn **keyword + thuật toán** → tưởng dễ.
- **Về nhà mới sốc:** phải **tự đi tìm dữ liệu**, rồi **làm sạch/xử lý mệt nghỉ** → xong xuôi thuật toán mới chạy được.
- Đây chính là lý do toàn bộ second brain này ưu tiên **Lớp LÀM** (xử lý dữ liệu) hơn là học thuộc thuật toán.

## 🧩 Hai lớp học (đừng lẫn mục đích)

| Lớp | Học cái gì | Để làm gì |
|-----|------------|-----------|
| **Lớp HIỂU** (nền tảng) | đạo hàm, gradient, PCA, xác suất... | Biết model "đi mò" cái gì, vì sao cần dữ liệu tốt, biết chọn/chỉnh/đánh giá model |
| **Lớp LÀM** (thực hành) | xử lý dữ liệu, feature engineering, dùng lại model | Ra kết quả thật — đây là nơi tạo giá trị |

> Học Lớp HIỂU **vừa đủ** để phục vụ Lớp LÀM — không sa đà chứng minh toán hàn lâm.

## ⚙️ Vì sao "dữ liệu thả vào" mới là then chốt
- **Garbage in, garbage out:** model dù mạnh, dữ liệu bẩn/lệch thì kết quả vẫn sai.
- Trong thực tế, **chất lượng + cách xử lý dữ liệu thường quyết định hiệu quả nhiều hơn việc đổi thuật toán.**
- Việc "đi mò" của model (xem [[gradient-descent]]) chỉ tốt khi **đầu vào được chuẩn hóa, sạch, đúng định dạng** — đây là lý do PCA/chuẩn hóa quan trọng (xem [[pca]]).

## 🎯 Hệ quả cho lộ trình học
- Nền tảng toán (Nhánh A, B): học để **hiểu**, không cần thuộc lòng chứng minh.
- Ưu tiên kỹ năng **Lớp LÀM**: làm sạch dữ liệu, feature engineering, transfer learning, fine-tune, gọi API model.
- Khi gặp khái niệm toán → hỏi: *"cái này giúp mình xử lý/hiểu dữ liệu hay chọn model tốt hơn thế nào?"*

## ⚠️ Điều dễ nhầm / Cảnh báo
- "Dùng lại model" **không** = không cần hiểu gì. Hiểu nền tảng giúp: chọn đúng model, biết khi nào fine-tune, đọc được lỗi, đánh giá kết quả đáng tin hay không.
- Đừng rơi vào bẫy học toán vô tận mà không động tới dữ liệu thật. **Học tới đâu, áp dụng tới đó.**

---

## 🔗 Liên kết
- **Liên quan tới:** [[gradient-descent]] · [[pca]]
- **Dẫn tới (kỹ năng Lớp LÀM):** [[xu-ly-du-lieu]] · [[feature-engineering]] · [[transfer-learning]] · [[fine-tuning]]

## ❓ Câu hỏi mở
- Khi nào nên fine-tune model có sẵn, khi nào chỉ cần dùng API / prompt?
- Với một bài toán cụ thể, bao nhiêu phần kết quả đến từ dữ liệu, bao nhiêu từ chọn model?

## 📚 Nguồn
- Andrew Ng — phong trào "Data-Centric AI".
