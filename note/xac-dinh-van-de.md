# Xác định vấn đề (Bước 0 — trước khi bắt tay)

> Tóm tắt 1 câu: **Định nghĩa rõ vấn đề TRƯỚC khi làm** — vì nếu xác định sai, làm xong cũng sai, mất công vô ích. "Giải đúng bài sai" còn tệ hơn không làm.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟢 Nguyên tắc (đọc trước mọi dự án)
**📨 Loại:** Process / Bước 0 — đứng **trước** [[xu-ly-du-lieu]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #meta #process #data #lop-lam

---

## 💡 Ý chính
> Đúng mạch nghĩ của bạn: từ tổng thể → làm đủ mọi process → lấy đúng mẫu chuẩn, đúng vấn đề → rồi mới làm.

- Vấn đề đến **trước dữ liệu**. Chưa rõ "đang giải cái gì" thì mọi xử lý phía sau là **đoán mò**.
- **Làm sai từ gốc = mất trắng:** thuật toán đúng, code đẹp, nhưng giải sai bài → kết quả vô nghĩa.
- Bỏ công **định nghĩa kỹ ở đầu** rẻ hơn nhiều so với làm lại từ đầu.

## ✅ Cần chốt rõ TRƯỚC khi code

| Câu hỏi | Phải trả lời được |
|---------|-------------------|
| **Mục tiêu là gì?** | Dự đoán/giải quyết cái gì, để phục vụ điều gì (business goal) |
| **Target là cột nào?** | Biến cần dự đoán — định nghĩa chính xác |
| **Loại bài toán?** | Phân loại / hồi quy / phân cụm / gợi ý... |
| **Mẫu chuẩn từ population?** | Đúng đối tượng, đúng phạm vi, **đại diện** ([[overfitting]]) |
| **Thước đo thành công?** | Accuracy? Precision/Recall? RMSE? + chỉ số kinh doanh |
| **Ràng buộc?** | Dữ liệu có sẵn? real-time? cần giải thích được? |

## 🧩 Trực giác: từ Population → đúng vấn đề
```
Population (toàn bộ)
   │  xác định: đang hỏi về AI? phạm vi nào? mục tiêu gì?
   ▼
Lấy ĐÚNG mẫu chuẩn (đại diện, đúng đối tượng)   ← không phải lấy bừa
   │
   ▼
Chốt ĐÚNG vấn đề + thước đo
   │
   ▼
→ rồi mới [[xu-ly-du-lieu]] → model
```

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Nhảy vào code/model ngay** khi chưa rõ mục tiêu → làm lại nhiều lần.
- **Tối ưu sai thước đo:** đạt accuracy 99% nhưng bài toán cần bắt gian lận (cần recall) → vô dụng.
- **Mẫu không khớp câu hỏi:** hỏi về khách VN nhưng lấy mẫu toàn khách nước ngoài.
- **Giải đúng bài sai (solving the wrong problem):** lỗi đắt nhất — không công cụ nào cứu được.

---

## 🔗 Liên kết
- **Liên quan tới:** [[dinh-huong-hoc]] (90/10) · [[overfitting]] (mẫu đại diện) · [[thong-ke]]
- **Dẫn tới (bước sau):** [[xu-ly-du-lieu]] → [[feature-engineering]] → model

## ❓ Câu hỏi mở
- Làm sao chọn đúng thước đo (metric) cho từng loại bài toán?
- Khi nào một mẫu được coi là "đủ đại diện" cho tổng thể?

## 📚 Nguồn
- Andrew Ng — "Structuring Machine Learning Projects".
- CRISP-DM — giai đoạn "Business Understanding" đứng đầu quy trình.
