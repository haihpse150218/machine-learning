# Từ vựng Thống kê & Phân loại biến

> Tóm tắt 1 câu: Bộ từ vựng nền — **Tổng thể, Mẫu, Biến** — và cách phân loại biến (định lượng vs phân loại). Hiểu **loại biến** quyết định cách xử lý: nếu **không rõ ý nghĩa khoảng cách/so sánh** thì rất dễ làm sai.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh C (Thống kê) · từ vựng nền tảng
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #thong-ke #data #nen-tang
**Nguồn slide:** `L1_Math_Overview.pdf` trang 33 — TS. Cao Tiến Dũng

---

## 📖 Ba khái niệm gốc
| Thuật ngữ | Nghĩa |
|-----------|-------|
| **Tổng thể (Population)** | Toàn bộ nhóm cần lấy thông tin |
| **Mẫu (Sample)** | Tập con của tổng thể, được xem là **đại diện** → [[lay-mau]] |
| **Biến (Variable)** | Các đại lượng được **đo** trong mẫu (mỗi cột dữ liệu) |

## 🌳 Phân loại biến
```
BIẾN (Variable)
├── Định lượng (Quantitative) — SỐ
│   ├── Liên tục (continuous)  → pH, cholesterol  (đo, vô số giá trị)
│   └── Rời rạc (discrete)     → số khuẩn lạc      (đếm, giá trị tách rời)
└── Phân loại (Categorical)
    ├── Định danh (Nominal)    → giới tính, nhóm máu  (KHÔNG thứ tự)
    └── Thứ bậc (Ordinal)      → nhẹ/vừa/nặng         (CÓ thứ tự)
```
> Liên tục/rời rạc liên hệ thẳng với [[phan-phoi-xac-suat]]; Nominal/Ordinal liên hệ [[encode-categorical]].

## 🎯 Insight cốt lõi: "ý nghĩa khoảng cách" (level of measurement)
> *"Nếu không rõ ý nghĩa khoảng cách / so sánh thì sẽ dễ sai."* — đây là chìa khóa chọn cách xử lý đúng.

| Thang đo | So sánh được gì | Khoảng cách | Ví dụ |
|----------|-----------------|-------------|-------|
| **Nominal** | chỉ **giống / khác** | ❌ vô nghĩa | nhóm máu A,B,O |
| **Ordinal** | thứ tự (<, >) | ⚠️ **không chắc đều** | nhẹ < vừa < nặng |
| **Interval** | hiệu (−) có nghĩa | ✅ đều, nhưng **0 không tuyệt đối** | nhiệt độ °C |
| **Ratio** | cả tỉ lệ (×, ÷) | ✅ đều + **0 tuyệt đối** | cân nặng, chiều cao |

### ⚠️ Bẫy lớn: mã hóa Ordinal thành số rồi dùng như định lượng
- Mã `nhẹ=1, vừa=2, nặng=3` → tiện, nhưng **giả định ngầm** rằng khoảng cách `nhẹ→vừa` **bằng** `vừa→nặng`.
- Thực tế chưa chắc đều! Bước từ "vừa→nặng" có thể nghiêm trọng hơn nhiều "nhẹ→vừa".
- Tính **trung bình** của ordinal (vd "mức bệnh trung bình = 2.4") → thường **vô nghĩa**.
- → Slide ghi *"Ordinal thường được mã hóa lại thành định lượng"* — **được phép, nhưng phải ý thức giả định khoảng cách đều**; nếu sai giả định đó → kết luận sai.

## 🔧 Vì sao convert sai → model hiểu sai (CƠ CHẾ)
> Mạch nghĩ của bạn: trong flow xử lý phải đánh giá khoảng cách, vì khi đưa sang số mà sai ý nghĩa → model nhân ma trận, đánh trọng số → hiểu sai.

- Model (tuyến tính, neural net...) về cơ bản làm **phép nhân ma trận + trọng số**: `y = W·x + b` ([[gradient]] học ra W).
- Nó **tin con số bạn đưa là độ lớn có thật:** số gấp đôi → ảnh hưởng gấp đôi; khoảng cách giữa 2 số = mức khác biệt.
- **Nếu convert sai ý nghĩa:**
  ```
  Nominal:  đỏ=0, xanh=1, vàng=2
  Model nhân trọng số w:  w·0, w·1, w·2
  → nó "tin": vàng gấp đôi xanh, khoảng đỏ→xanh = xanh→vàng  ← BỊA RA quan hệ không có
  → học trọng số sai → dự đoán sai
  ```
- **Convert đúng ý nghĩa** mới giữ được quan hệ thật:
  - Nominal → **one-hot** (mỗi loại 1 cột độc lập, không có độ lớn/thứ tự giả).
  - Ordinal → giữ **đúng thứ tự**, và ý thức giả định khoảng cách đều.
- 👉 Vì thế: **đánh giá ý nghĩa khoảng cách TRƯỚC khi encode** là bước bắt buộc trong flow xử lý dữ liệu ([[xu-ly-du-lieu]] · [[encode-categorical]]).

## ⚙️ Liên hệ ML
- Chọn cách **encode** theo loại biến → [[encode-categorical]]:
  - Nominal → one-hot (không bịa thứ tự).
  - Ordinal → label/ordinal encoding (giữ thứ tự) — nhưng nhớ giả định khoảng cách.
- Biết loại biến → chọn **thống kê mô tả** đúng ([[phan-loai-thong-ke]]): số → mean/std; phân loại → tần suất/tỷ lệ.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Coi mã số của Nominal là có thứ tự** (đỏ=0,xanh=1,vàng=2 → model tưởng đỏ<vàng). Lỗi kinh điển → [[encode-categorical]].
- **Tính trung bình trên Ordinal** mà không xét khoảng cách → con số gây hiểu nhầm.
- **Rời rạc vs liên tục:** số nhà (rời rạc) khác chiều cao (liên tục) — ảnh hưởng cách vẽ & mô hình hóa.

---

## 🔗 Liên kết
- **Liên quan tới:** [[lay-mau]] (tổng thể/mẫu) · [[encode-categorical]] (nominal/ordinal) · [[phan-phoi-xac-suat]] (liên tục/rời rạc)
- **Dùng trong:** [[phan-loai-thong-ke]] · [[xu-ly-du-lieu]]

## ❓ Câu hỏi mở
- Khi nào mã hóa ordinal thành số là chấp nhận được, khi nào nguy hiểm?
- Làm sao xử lý ordinal "đúng" mà không giả định khoảng cách đều? (ordinal encoding có trọng số, target encoding...)

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L1_Math_Overview.pdf` tr.33).
- Stevens' levels of measurement (Nominal/Ordinal/Interval/Ratio).
