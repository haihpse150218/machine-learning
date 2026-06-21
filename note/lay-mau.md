# Kỹ thuật lấy mẫu (Sampling)

> Tóm tắt 1 câu: Cách chọn một **mẫu (sample)** từ **tổng thể (population)** sao cho mẫu **đại diện** được cho tổng thể — vì mọi kết luận/model chỉ đúng nếu mẫu không lệch. Câu hỏi cuối cùng luôn là: *"mẫu này có đại diện cho population không?"*

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟢 Trọng tâm (Lớp LÀM)
**📖 Lộ trình:** Nhánh C (Thống kê) ↔ Nhánh D · ← cần [[thong-ke]] · liên quan [[xac-dinh-van-de]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #thong-ke #data #sampling #lop-lam

---

## 🌳 Hai họ lấy mẫu

```
LẤY MẪU
├── Xác suất (Probability)      → mọi phần tử có cơ hội ĐO ĐƯỢC → đại diện, tổng quát được
│   ├── Ngẫu nhiên (Random)
│   ├── Hệ thống (Systematic)
│   └── Phân tầng (Stratified)
└── Phi xác suất (Non-Probability) → dựa tiện/phán đoán → nhanh-rẻ nhưng DỄ LỆCH
    ├── Hạn ngạch (Quota)
    ├── Phán đoán (Judgment)
    └── Thuận tiện (Convenience)
```

## 🎲 1. Lấy mẫu xác suất (Probability) — đáng tin
> Mọi phần tử có **cơ hội được chọn đo được (≠ 0)** → suy ra tổng thể có cơ sở thống kê.

| Cách | Làm gì | Lưu ý |
|------|--------|-------|
| **Ngẫu nhiên (Random)** | Mỗi phần tử cơ hội **như nhau** | Chuẩn vàng; cần danh sách đầy đủ |
| **Hệ thống (Systematic)** | Chọn theo **bước cố định** (cứ k bản ghi lấy 1) | ⚠️ Bẫy: nếu dữ liệu có **chu kỳ trùng bước** → lệch |
| **Phân tầng (Stratified)** | Chia tổng thể thành **nhóm con cùng đặc điểm** (strata), lấy ngẫu nhiên trong mỗi nhóm | Đảm bảo nhóm hiếm vẫn có mặt → tốt cho **dữ liệu mất cân bằng** |

> 💡 **Phải hiểu bản chất phân phối** ([[phan-phoi-xac-suat]]): để phân tầng đúng nhóm, và để biết mẫu có khớp phân phối tổng thể không.

## 🤝 2. Lấy mẫu phi xác suất (Non-Probability) — nhanh nhưng rủi ro
| Cách | Làm gì | Rủi ro |
|------|--------|--------|
| **Hạn ngạch (Quota)** | Chọn đủ số lượng mỗi nhóm, nhưng **không ngẫu nhiên** trong nhóm | Lệch trong từng nhóm |
| **Phán đoán (Judgment)** | Chuyên gia chọn cái "thấy hợp lý" | Phụ thuộc thiên kiến người chọn |
| **Thuận tiện (Convenience)** | Lấy cái **dễ với tới** (ai gần thì lấy) | **Lệch nặng nhất** — hay gặp & nguy hiểm |

## 🎯 Câu hỏi chốt: MẪU CÓ ĐẠI DIỆN KHÔNG?
> Phải nhớ — đây là thước đo cuối cùng của mọi cách lấy mẫu.

- Mẫu lệch → model học từ mẫu lệch → ra **population thật là sai** ([[overfitting]] · sampling bias).
- Ví dụ: khảo sát ý kiến cả nước nhưng chỉ hỏi người ở thành phố → không đại diện.
- Kiểm tra: phân phối các đặc trưng quan trọng trong **mẫu** có khớp **tổng thể** không?

## ⚙️ Liên hệ ML (rất thực dụng)
- **Chia train/test cũng là lấy mẫu** → dùng **stratified split** khi lớp mất cân bằng (giữ tỉ lệ lớp).
- **Oversampling/undersampling/SMOTE** = kỹ thuật lấy mẫu để cân bằng lớp.
- **Distribution shift:** mẫu train khác phân phối dữ liệu thật lúc chạy → model tụt → cần mẫu khớp môi trường triển khai.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Convenience sampling** rồi tưởng kết quả đại diện cả tổng thể.
- **Systematic** trên dữ liệu có chu kỳ (vd dữ liệu theo tuần, bước = 7) → dính lệch hệ thống.
- **Mẫu quá nhỏ** → không đủ tin ([[thong-ke]]).
- Quên kiểm: mẫu có khớp **population sẽ triển khai thật** không.

---

## 🔗 Liên kết
- **Tiền đề (cần biết trước):** [[thong-ke]] · [[phan-phoi-xac-suat]]
- **Liên quan tới:** [[xac-dinh-van-de]] (lấy đúng mẫu chuẩn) · [[overfitting]] (sampling bias) · [[xu-ly-du-lieu]]

## ❓ Câu hỏi mở
- Cỡ mẫu bao nhiêu là đủ để đại diện? (phụ thuộc độ biến thiên + độ tin mong muốn)
- Khi nào chấp nhận lấy mẫu phi xác suất (vì không thể làm xác suất)?

## 📚 Nguồn
- StatQuest / Khan Academy — Sampling methods.
- scikit-learn — `train_test_split(stratify=...)`, `imbalanced-learn` (SMOTE).
