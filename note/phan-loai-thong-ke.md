# Phân loại Thống kê: Mô tả vs Suy diễn

> Tóm tắt 1 câu: Thống kê chia 2 nhánh — **Mô tả (Descriptive)** tóm tắt dữ liệu *đang có*; **Suy diễn (Inferential)** rút kết luận *vượt ra ngoài mẫu* dựa trên xác suất, cho phép **dự đoán**.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh C (Thống kê) ← mở rộng [[thong-ke]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #thong-ke #eda #inference
**Nguồn slide:** `L1_Math_Overview.pdf` trang 30–31 (Thống kê mô tả + Mô tả dữ liệu bằng thống kê) — TS. Cao Tiến Dũng

---

## 🌳 Hai nhánh

```
THỐNG KÊ
├── MÔ TẢ (Descriptive)    → tóm tắt, mô tả dữ liệu ĐANG CÓ (trong mẫu)
└── SUY DIỄN (Inferential) → rút kết luận VƯỢT RA NGOÀI mẫu (dựa xác suất) → dự đoán
```

## 📊 1. Thống kê mô tả (Descriptive)
> Mô tả lại những gì **đang diễn ra** trong dữ liệu — không kết luận gì ngoài mẫu.

### Dữ liệu SỐ (numeric) → mô tả 3 mặt (slide trang 31):

**① Trung tâm (central tendency)** — "điểm đại diện":
| Thước đo | Là gì | Lưu ý |
|----------|-------|-------|
| **Trung bình (Mean)** | Cộng hết / số lượng | Nhạy outlier |
| **Trung vị (Median)** | Giá trị đứng giữa khi sắp xếp | Chống outlier → dùng cho dữ liệu lệch |
| **Yếu vị (Mode)** | Giá trị hay gặp nhất | Dùng được cả cho dữ liệu phân loại |

**② Độ biến thiên (spread)** — dữ liệu dao động rộng/hẹp:
| Thước đo | Là gì |
|----------|-------|
| **Khoảng biến thiên (Range)** | Max − Min (nhạy outlier) |
| **Khoảng tứ phân vị (IQR)** | Q3 − Q1 (giữa 50% dữ liệu, chống outlier) |
| **Phương sai (Variance)** | TB bình phương độ lệch khỏi mean → [[phuong-sai]] |
| **Độ lệch chuẩn (Std)** | Căn của phương sai (cùng đơn vị dữ liệu) |

**③ Hình dạng (shape)** — phân phối trông thế nào → [[phan-phoi-xac-suat]]:
| Thước đo | Là gì |
|----------|-------|
| **Độ lệch (Skewness)** | Phân phối **nghiêng về bên nào**: lệch phải (đuôi dài bên phải, mean > median) / lệch trái / đối xứng (≈0) |
| **Độ nhọn (Kurtosis)** | Phân phối **nhọn hay bẹt**, đuôi dày/mỏng (nhiều giá trị cực đoan không) |

> 💡 **Ví dụ phân tích khách hàng (skewness):** vẽ histogram tần suất khách theo mức chi tiêu. Phân phối **nghiêng về bên nào** cho biết nhóm khách **tập trung/thu hút cao** ở đâu.
> - Lệch phải: đa số khách chi **ít**, một số ít VIP chi nhiều kéo đuôi → biết để chăm nhóm đông + nhóm VIP riêng.
> - Đối xứng quanh một mức: khách phân bố đều quanh đó.

> ❗ Cả 3 mặt phải đi cùng nhau: 2 lớp cùng mean 7 nhưng std khác (ai cũng ~7 vs nửa 4 nửa 10), hoặc lệch khác nhau → là dữ liệu khác hẳn.

### Dữ liệu PHÂN LOẠI (categorical) → đếm:
- **Tần suất (frequency):** mỗi nhóm xuất hiện bao nhiêu lần.
- **Phần trăm (%) / Tỷ lệ (proportion):** chiếm bao nhiêu phần.
- Trình bày: bảng tần suất, biểu đồ cột, biểu đồ tròn.

## 🔮 2. Thống kê suy diễn (Inferential)
> Từ **mẫu** → suy ra **tổng thể** (population), dựa trên **xác suất** → cho phép **dự đoán**.

- Công cụ: lấy mẫu ([[lay-mau]]), khoảng tin cậy, kiểm định giả thuyết ([[kiem-dinh-gia-thuyet]] · [[p-value]]), hồi quy.
- Luôn kèm **độ không chắc chắn** (vì chỉ nhìn 1 mẫu, không thấy hết tổng thể).

## ⚙️ Liên hệ ML (quan trọng)
| Nhánh | Vai trò trong ML |
|-------|------------------|
| **Mô tả** | = **EDA**: hiểu dữ liệu trước khi train (phân phối, outlier, % thiếu) |
| **Suy diễn** | = **bản chất của ML**: học từ mẫu (train) để **dự đoán dữ liệu mới** (tổng thể) |

> 💡 ML về cốt lõi là **suy diễn**: dùng mẫu để nói về cái chưa thấy. Vì vậy mẫu phải **đại diện** ([[lay-mau]]) và tránh học thuộc mẫu ([[overfitting]]).

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Dùng thống kê mô tả để kết luận về tổng thể** — mô tả chỉ nói về *mẫu*, muốn nói rộng hơn phải dùng suy diễn.
- **Chỉ nhìn trung bình** mà bỏ qua độ biến thiên + hình dạng → bức tranh sai (2 dữ liệu cùng mean nhưng phân phối khác hẳn).
- Suy diễn từ **mẫu lệch / quá nhỏ** → kết luận sai.

---

## 🔗 Liên kết
- **Tiền đề (cần biết trước):** [[thong-ke]]
- **Mô tả dùng:** [[ky-vong-trung-binh]] · [[phuong-sai]] · [[phan-phoi-xac-suat]]
- **Suy diễn dùng:** [[lay-mau]] · [[kiem-dinh-gia-thuyet]] · [[p-value]]

## ❓ Câu hỏi mở
- Hai tập dữ liệu cùng trung bình có thể khác nhau thế nào? (cùng mean, khác variance/shape)
- Vì sao nói Machine Learning bản chất là thống kê suy diễn?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng.
- StatQuest — "Statistics Fundamentals".
