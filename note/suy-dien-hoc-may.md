# Thống kê suy diễn → Machine Learning

> Tóm tắt 1 câu: **Học máy về bản chất CHÍNH LÀ thống kê suy diễn** — học từ **mẫu (dữ liệu train)** để rút ra quy luật và **dự đoán trên tổng thể (dữ liệu chưa thấy)**, dựa trên xác suất và chấp nhận độ không chắc chắn.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟢 Cây cầu khái niệm (đọc để nối các mảnh)
**📨 Loại:** Bridge — nối [[thong-ke]] ↔ toàn bộ ML
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #meta #thong-ke #inference #learning #core

---

## 💡 Ý chính
- **Thống kê suy diễn** ([[phan-loai-thong-ke]]): từ **mẫu** → suy ra **tổng thể**, dựa xác suất → **dự đoán**.
- **Machine Learning = chính điều đó, được tự động hóa & mở rộng:** "learning" = **ước lượng** quy luật/tham số từ dữ liệu mẫu, rồi áp lên dữ liệu mới.
- Nói cách khác: **train model = làm suy diễn thống kê** ở quy mô lớn, nhiều tham số, bằng máy.

## 🔗 Bảng ánh xạ (cùng một việc, hai tên gọi)
| Thống kê suy diễn | Machine Learning |
|-------------------|------------------|
| Mẫu (sample) | Tập huấn luyện (training data) |
| Tổng thể (population) | Dữ liệu thật / phân phối thật khi triển khai |
| Ước lượng tham số từ mẫu | **Train** model (fit tham số) → [[gradient-descent]] |
| Suy ra tổng thể (generalization) | Dự đoán đúng trên dữ liệu **chưa thấy** |
| Sai số ước lượng / độ không chắc | Lỗi mô hình, độ tin của dự đoán |
| Mẫu không đại diện | Sampling bias → model lệch ([[lay-mau]]) |
| "Học thuộc mẫu" | **Overfitting** → không suy diễn được ([[overfitting]]) |

## 🧩 Vì sao "learning" = "suy diễn"
- Ta **không bao giờ** thấy hết tổng thể → chỉ có mẫu.
- Học = **đoán quy luật chung** từ mẫu sao cho áp được lên cái chưa thấy.
- Đó đúng là định nghĩa của suy diễn: *kết luận vượt ra ngoài dữ liệu đang có*.
- → Mọi thứ ở Nhánh C (lấy mẫu đại diện, phân phối, độ phân tán, kiểm định) đều phục vụ để **suy diễn cho đúng** = để **học cho đúng**.

## ⚖️ Khác biệt nhấn mạnh (thống kê cổ điển vs ML)
| | Thống kê cổ điển | Machine Learning |
|---|---|---|
| Ưu tiên | **Giải thích** + kiểm định giả thuyết | **Dự đoán chính xác** trên dữ liệu mới |
| Mô hình | Đơn giản, dễ diễn giải | Có thể phức tạp, "black box" |
| Câu hỏi | "Quan hệ này có thật không?" | "Đoán đúng được không?" |
> ML = **suy diễn (inference)** + **tối ưu hóa (optimization)** [[gradient-descent]] + nhiều dữ liệu/tham số.

## ⚠️ Hệ quả thực hành
- Vì là suy diễn → **mẫu phải đại diện** ([[lay-mau]]) và **tránh học thuộc** ([[overfitting]]), nếu không "học" ra thứ vô dụng.
- Đánh giá model = đánh giá khả năng **suy diễn** (test trên dữ liệu chưa thấy), không phải điểm trên mẫu train.
- Đây là lý do nền tảng thống kê (Nhánh C) quan trọng với ML — đúng [[dinh-huong-hoc]].

---

## 🔗 Liên kết
- **Tiền đề:** [[thong-ke]] · [[phan-loai-thong-ke]] · [[xac-suat]]
- **Nối tới:** [[gradient-descent]] (tối ưu) · [[overfitting]] (suy diễn hỏng) · [[lay-mau]] (mẫu đại diện)
- **Định hướng:** [[dinh-huong-hoc]]

## ❓ Câu hỏi mở
- Khi nào ML "đánh đổi giải thích lấy độ chính xác" là chấp nhận được?
- Bao nhiêu dữ liệu là "đủ" để suy diễn (học) đáng tin?

## 📚 Nguồn
- "An Introduction to Statistical Learning" (ISLR) — học máy nhìn từ góc thống kê.
- StatQuest — Statistical learning.
