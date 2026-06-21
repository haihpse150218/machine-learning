# Trung bình & Kỳ vọng (Mean & Expectation)

> Tóm tắt 1 câu: **Trung bình** là "tâm" của dữ liệu (cộng hết chia số lượng); **Kỳ vọng E[X]** là trung bình **lý thuyết** của một biến ngẫu nhiên — trung bình có **trọng số theo xác suất**. Trung bình mẫu chính là ước lượng của kỳ vọng.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh C (Thống kê) · nền tảng gốc (không cần tiền đề)
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #toan #thong-ke #xac-suat #nen-tang

---

## 💡 Ý chính
- **Trung bình (mean) của dữ liệu:** cộng tất cả giá trị rồi chia số lượng → "điểm giữa".
- **Kỳ vọng E[X] của biến ngẫu nhiên:** giá trị trung bình ta **kỳ vọng nhận được** nếu lặp lại phép thử vô số lần — là trung bình **có trọng số theo xác suất**.
- **Cầu nối:** lấy mẫu càng nhiều, **trung bình mẫu → kỳ vọng** (Luật số lớn).

## 🔢 Công thức / Định nghĩa
```
Trung bình mẫu:        x̄ = (1/n) · Σ xᵢ

Kỳ vọng (rời rạc):     E[X] = Σ xᵢ · P(xᵢ)
Kỳ vọng (liên tục):    E[X] = ∫ x · f(x) dx
```
> Trung bình thường = kỳ vọng khi mọi điểm có **trọng số bằng nhau** (1/n). Kỳ vọng tổng quát hơn: mỗi giá trị cân theo **xác suất** của nó.

## 🧩 Trực giác: trung bình có trọng số
- Tung xúc xắc cân: `E[X] = 1·(1/6) + 2·(1/6) + ... + 6·(1/6) = 3.5`.
- 3.5 không phải mặt nào cả — nó là "trung tâm kỳ vọng" nếu tung vô số lần.

## 🆚 Mean vs Median vs Mode (3 loại "tâm")
| Đại lượng | Là gì | Khi nào dùng |
|-----------|-------|--------------|
| **Mean (trung bình)** | Cộng / số lượng | Dữ liệu cân đối, ít outlier |
| **Median (trung vị)** | Giá trị đứng giữa | Dữ liệu **lệch / có outlier** (an toàn hơn) |
| **Mode (yếu vị)** | Giá trị hay gặp nhất | Dữ liệu **phân loại** |

> Lệch phải (vài giá trị lớn kéo đuôi) → **mean > median**. Đó là dấu hiệu nên dùng median (xem skewness trong [[phan-loai-thong-ke]]).

## ⚙️ Ứng dụng trong ML
- **Điền dữ liệu thiếu** bằng mean/median → [[xu-ly-du-lieu-thieu]].
- **Centering** (trừ mean) trước khi tính [[ma-tran-hiep-phuong-sai]] / [[pca]] / z-score.
- **Nền của phương sai:** `Var(X) = E[(X − μ)²]` → [[phuong-sai]].
- **Kỳ vọng nền tảng cho hàm mất mát:** "rủi ro kỳ vọng" = E[loss]; trung bình loss trên dữ liệu là ước lượng của nó → [[loss-function]].

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Mean bị outlier kéo lệch:** 1 tỉ phú vào phòng → "thu nhập trung bình" vô nghĩa; dùng **median**.
- **Mean của dữ liệu phân loại là vô nghĩa** (trung bình của "đỏ, xanh"?) → dùng mode.
- Lẫn trung bình mẫu (số cụ thể từ dữ liệu) với kỳ vọng (đại lượng lý thuyết của phân phối).

---

## 🔗 Liên kết
- **Liên quan tới:** [[phuong-sai]] · [[phan-phoi-xac-suat]] · [[xac-suat]]
- **Dùng trong:** [[phan-loai-thong-ke]] · [[pca]] · [[xu-ly-du-lieu-thieu]] · [[loss-function]]

## ❓ Câu hỏi mở
- Luật số lớn phát biểu chính xác thế nào?
- Vì sao centering (trừ mean) lại cần thiết trước PCA?

## 📚 Nguồn
- StatQuest — "The Mean, Median and Mode".
- Khan Academy — Expected value.
