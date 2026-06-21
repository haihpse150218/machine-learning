# p-value

> Tóm tắt 1 câu: p-value = **xác suất quan sát được dữ liệu (hoặc cực đoan hơn) NẾU H₀ đúng** — tức mức "bất ngờ" của dữ liệu khi giả sử *không có hiệu ứng*. p càng nhỏ → dữ liệu càng khó giải thích bằng "chỉ may rủi".

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh C (Thống kê) ← cần [[kiem-dinh-gia-thuyet]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #thong-ke #inference #de-hieu-sai

---

## 💡 Định nghĩa cho dễ
- Giả sử H₀ đúng (không có hiệu ứng gì). p-value trả lời: *"nếu thật sự không có gì, thì khả năng tôi thấy dữ liệu (lệch) như thế này hoặc hơn là bao nhiêu?"*
- **p nhỏ** (vd 0.01) → dữ liệu **rất khó xảy ra** nếu H₀ đúng → nghi ngờ H₀ → bác bỏ.
- **p lớn** (vd 0.4) → dữ liệu **bình thường** dù H₀ đúng → không có cớ bác bỏ.

```
p < α (thường 0.05)  → bác bỏ H₀  ("có ý nghĩa thống kê")
p ≥ α                → không đủ bằng chứng bác bỏ H₀
```
> Ngưỡng 0.05 chỉ là **quy ước**, không thiêng liêng. Tùy lĩnh vực có thể 0.01 hay 0.001.

## ❌ p-value KHÔNG phải là gì (4 hiểu lầm chí mạng)
| Hiểu lầm | Sự thật |
|----------|---------|
| "p = xác suất H₀ đúng" | ❌ KHÔNG. p tính **giả sử H₀ đúng**, không phải xác suất của H₀ |
| "p = xác suất kết quả do may rủi" | ❌ Không đúng theo nghĩa đó |
| "p nhỏ → hiệu ứng lớn / quan trọng" | ❌ p chỉ nói **có hay không**, không nói **lớn cỡ nào** (xem effect size) |
| "p ≥ 0.05 → H₀ đúng / không có hiệu ứng" | ❌ Chỉ là *chưa đủ bằng chứng*, không chứng minh H₀ |

## 🧩 Trực giác
- p-value giống "độ bất ngờ": tung đồng xu 10 lần ra **10 mặt ngửa** → p rất nhỏ → nghi đồng xu không cân (bác bỏ H₀ "xu cân").
- Ra **6 ngửa 4 sấp** → p lớn → bình thường → không kết luận gì.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **p-hacking:** thử nhiều biến / nhiều cách cho tới khi p < 0.05 rồi báo cáo → kết quả giả. Phải định giả thuyết & cách test **trước**.
- **Multiple testing:** test 20 giả thuyết, kiểu gì cũng có 1 cái p < 0.05 do ngẫu nhiên → cần hiệu chỉnh.
- **Bỏ qua effect size & khoảng tin cậy:** p-value nên đi kèm **độ lớn hiệu ứng** mới đủ nghĩa.
- **Significant ≠ quan trọng:** mẫu khổng lồ làm mọi chênh lệch tí hon thành "significant".

---

## 🔗 Liên kết
- **Tiền đề (cần biết trước):** [[kiem-dinh-gia-thuyet]] · [[xac-suat]]
- **Liên quan tới:** [[gauss-va-nhi-thuc]] (A/B test) · [[thong-ke]]

## ❓ Câu hỏi mở
- Vì sao cộng đồng khoa học chỉ trích việc lạm dụng ngưỡng 0.05?
- Effect size + confidence interval bổ sung cho p-value thế nào?

## 📚 Nguồn
- StatQuest — "p-values, clearly explained".
- ASA Statement on p-values (2016).
