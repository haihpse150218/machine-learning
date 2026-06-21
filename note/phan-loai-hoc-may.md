# Phân loại Học máy (4 loại)

> Tóm tắt 1 câu: Chia theo **dữ liệu có nhãn hay không** — Có giám sát (có nhãn), Không giám sát (không nhãn), Bán giám sát (ít nhãn + nhiều không nhãn), và Tăng cường (học qua thưởng/phạt).

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh F (Nhập môn ML) · #2 ← cần [[ai-ml-dl]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #tong-quan #nhap-mon
**Nguồn slide:** `L2_Intro_ML_DL_GenAI.pdf` slide 3–4 — TS. Cao Tiến Dũng

---

## 🌳 4 loại
| Loại | Dữ liệu | Ví von | Ví dụ thực tế |
|------|---------|--------|----------------|
| **Có giám sát (Supervised)** | **có nhãn** (biết kết quả) | học với **đáp án có sẵn** | lọc thư rác, dự đoán giá nhà, phát hiện ung thư |
| **Không giám sát (Unsupervised)** | **không nhãn** | phân loại đống đồ vật **không ai hướng dẫn** | phân khúc khách hàng, mô hình chủ đề, phát hiện bất thường |
| **Bán giám sát (Semi-supervised)** | **ít nhãn + nhiều không nhãn** | học ngoại ngữ: 10 câu dịch + 10.000 câu bản ngữ | gom nhóm mặt trong Google Photos, gán nhãn ảnh y khoa |
| **Tăng cường (Reinforcement)** | **thưởng / phạt** | huấn luyện chó bằng thưởng & uốn nắn | AlphaGo, xe tự lái, robot di chuyển |

## 🎯 Có giám sát → 2 nhánh con
> Loại hay gặp nhất; chia theo **kiểu của nhãn**:

| | **Phân loại (Classification)** | **Hồi quy (Regression)** |
|---|---|---|
| Nhãn | **rời rạc** (lớp) | **số liên tục** |
| Ví dụ | chó/mèo, spam/không | giá nhà, nhiệt độ |
| Hàm chi phí | Cross-Entropy | MSE → [[loss-function]] |
| Mô hình | [[decision-tree]], logistic regression | linear regression, cây hồi quy |

> 📏 **Quy tắc nhanh (slide 6):** tập nhãn **hữu hạn** → Phân loại; giá trị **số bất kỳ** → Hồi quy.
> 🖼️ Hồi quy không chỉ "1 con số": dự đoán **toạ độ khung bao (bounding box)** quanh vật thể cũng là hồi quy (đoán nhiều số liên tục).

## 🎯 Biến mục tiêu (Target) vs Đặc trưng (Features) — slide 7
| | Nghĩa |
|---|---|
| **Mục tiêu (Target / Y)** | cột **cần dự đoán** |
| **Đặc trưng (Features / X)** | các cột **dùng để dự đoán** (mọi cột không phải target) |

> Ví dụ Iris: `dài đài, rộng đài, dài cánh, rộng cánh` = **features (X)** → dự đoán `Loài` = **target (Y)**.
> - Đây là cấu trúc `X → Y` của mọi bài có giám sát. Chọn đúng target = [[xac-dinh-van-de]]; chế biến X tốt = [[feature-engineering]].

## 🔍 Không giám sát — 5 nhóm việc (slide 10)
| Nhóm việc | Làm gì | Note |
|-----------|--------|------|
| **Phân cụm (Clustering)** | tự gom nhóm theo hành vi giống nhau (vd phân khúc KH: VIP / trung thành / nguy cơ rời bỏ) | — |
| **Phát hiện bất thường (Anomaly)** | tìm điểm lạ (gian lận, lỗi) | — |
| **Giảm chiều (Dim. Reduction)** | gom cột tương quan → trục đại diện | [[pca]] |
| **Biểu diễn thưa (Sparse)** | mã hóa bằng ít thành phần khác 0 | — |
| **Biểu diễn độc lập (Independent)** | tách thành các yếu tố độc lập | — |

## 🔗 Nối với những gì đã học
- **Có giám sát:** [[decision-tree]] (cây), hồi quy ([[maximum-likelihood]]) → tối thiểu [[loss-function]] bằng [[gradient-descent]].
- **Không giám sát:** [[pca]] (giảm chiều), phân cụm (clustering) — không có nhãn, tự tìm cấu trúc.
- **Mọi loại:** vẫn cần xử lý dữ liệu sạch ([[xu-ly-du-lieu]]) và mẫu đại diện ([[lay-mau]]).

## 🧭 Chọn loại nào? (theo dữ liệu — đúng định hướng [[dinh-huong-hoc]])
```
Có nhãn đầy đủ?        → Có giám sát
Không có nhãn?         → Không giám sát
Ít nhãn, nhiều không?  → Bán giám sát
Học qua tương tác/thử-sai + thưởng? → Tăng cường
```

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Nhãn rất đắt:** gán nhãn tốn người + tiền → đó là lý do bán giám sát & không giám sát quan trọng thực tế.
- **Chọn sai loại bài toán:** dùng phân loại cho bài cần hồi quy (hay ngược lại) → sai từ gốc ([[xac-dinh-van-de]]).
- **Tưởng "không nhãn = vô dụng":** unsupervised vẫn rút được cấu trúc quý (phân khúc, bất thường).
- **Bán giám sát vẫn tổng quát ra population:** nó dùng ít nhãn + nhiều dữ liệu không nhãn để học tốt hơn, rồi dự đoán trên dữ liệu mới — **không phải** chỉ gán nhãn cho đúng tập có sẵn.

---

## 🔗 Liên kết
- **Tiền đề (cần biết trước):** [[ai-ml-dl]]
- **Dẫn tới:** [[decision-tree]] (supervised) · [[pca]] (unsupervised) · [[loss-function]]
- **Liên quan:** [[xac-dinh-van-de]] · [[dinh-huong-hoc]]

## ❓ Câu hỏi mở
- Bán giám sát hoạt động thế nào để tận dụng dữ liệu không nhãn?
- Khi nào reinforcement learning là lựa chọn đúng (vs supervised)?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L2_Intro_ML_DL_GenAI.pdf` slide 3–4).
