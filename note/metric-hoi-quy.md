# Độ đo Hồi quy (Regression Metrics)

> Tóm tắt 1 câu: Bài hồi quy đoán **số**, nên **không** dùng Accuracy/Precision — mà đo bằng **sai số** (MAE/MSE/RMSE) và **tỉ lệ biến thiên giải thích được** (R²/Adjusted R²). Mỗi độ đo trả lời một câu hỏi khác nhau → chọn đúng mới khỏi bị đánh lừa.

**Ngày tạo:** 2026-06-20
**Trạng thái:** 🟢 Trọng tâm (Lớp LÀM)
**📖 Lộ trình:** Nhánh E (Đánh giá) · #10 ← cần [[linear-regression]] · → so với [[danh-gia-mo-hinh]] (độ đo PHÂN LOẠI)
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #danh-gia #metric #hoi-quy #lop-lam
**Nguồn slide:** `L3_LinearReg.pdf` (Mục 05 — Đánh giá mô hình) — TS. Cao Tiến Dũng

---

## 💡 Ý chính
- 2 nhóm độ đo, trả lời 2 câu hỏi khác nhau:
  - **Sai số tuyệt đối** (MAE/MSE/RMSE): "dự đoán **lệch bao nhiêu** so với thực tế?" — **càng NHỎ càng tốt**, có **đơn vị**.
  - **Tỉ lệ giải thích** (R²/Adjusted R²): "mô hình giải thích được **bao nhiêu %** biến thiên của Y?" — **càng gần 1 càng tốt**, **không đơn vị** (so sánh giữa bài toán).
- Sai số cho biết **độ lớn lỗi**; R² cho biết **mô hình hơn baseline 'đoán bừa bằng trung bình' bao nhiêu**.

## 🔢 Bộ độ đo đầy đủ
```
MAE  = (1/n) Σ |yᵢ − ŷᵢ|              → sai số tuyệt đối trung bình; ÍT nhạy ngoại lai
MSE  = (1/n) Σ (yᵢ − ŷᵢ)²            → bình phương → PHẠT NẶNG sai số lớn (là hàm mất mát)
RMSE = √MSE                          → căn của MSE: CÙNG ĐƠN VỊ với Y → dễ diễn giải nhất
RSE  = √( RSS / (n−2) )              → sai số chuẩn của phần dư (cùng đơn vị Y)
R²   = 1 − RSS/TSS,  TSS = Σ(yᵢ − ȳ)²  → tỉ lệ phương sai của Y mà mô hình giải thích
R²_adj = 1 − (1−R²)(n−1)/(n−p−1)     → R² hiệu chỉnh theo số đặc trưng p (phạt biến vô ích)
```

| Độ đo | Đơn vị? | Hỏi gì | Đặc tính |
|-------|---------|--------|----------|
| **MAE** | có (như Y) | lệch trung bình bao nhiêu | **bền với outlier** (không bình phương) |
| **MSE** | Y² | — | **phạt nặng** lỗi lớn; dùng làm **loss** để train |
| **RMSE** | có (như Y) | lệch điển hình bao nhiêu | **dễ diễn giải nhất**; vẫn nhạy outlier |
| **R²** | không | giải thích bao nhiêu % | so sánh được giữa bài toán; nhưng **tăng giả** khi thêm biến |
| **Adjusted R²** | không | — | **phạt khi thêm biến vô ích** → so mô hình khác số biến |

## 🧩 Trực giác / Ví dụ
- **R² = 0.85** → mô hình giải thích **85%** biến thiên của Y; 15% còn lại là nhiễu/yếu tố chưa nắm.
- **R² = 0** → chỉ ngang "luôn đoán bằng trung bình ȳ". **R² < 0** → **tệ hơn cả đoán bừa bằng trung bình**.
- **MAE vs RMSE:** có vài điểm ngoại lai sai rất lớn → **RMSE phình to** (vì bình phương), **MAE bình thản hơn**. Nếu RMSE ≫ MAE ⇒ đang có **vài lỗi lớn** (outlier) → xem lại dữ liệu.

> 💡 Mẫu số R² dùng **trung bình ȳ làm baseline**: R² hỏi *"mô hình hơn cái baseline ngu nhất (luôn đoán trung bình) bao nhiêu?"*

## ⚙️ Khi nào dùng cái nào
- **Báo cáo cho người / cùng đơn vị Y** → **RMSE** (hoặc MAE). "Sai số trung bình ~12 triệu VND" dễ hiểu hơn "MSE = 144".
- **Dữ liệu nhiều ngoại lai** → ưu tiên **MAE** (RMSE bị outlier kéo méo) → nối [[danh-gia-mo-hinh]] (mạch "outlier → robust").
- **Train mô hình** → **MSE** (mượt, khả vi) → [[loss-function]].
- **So sánh các mô hình KHÁC số đặc trưng** → **Adjusted R²** (không phải R² thường).
- **Đánh giá tổng thể độ khớp** → **R²**.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Tin R² thô khi thêm biến:** R² **luôn tăng** (hoặc không giảm) khi thêm bất kỳ biến nào, kể cả biến rác → phải dùng **Adjusted R²**.
- **Nhầm Loss với Metric:** MSE dùng để **train** (khả vi); RMSE/MAE/R² dùng để **đánh giá** cho người đọc → [[loss-function]].
- **Đo trên tập train:** R² đẹp trên train mà tệ trên test = **[[overfitting]]** → luôn đo trên **tập test** ([[cross-validation]]).
- **Lẫn lộn với độ đo phân loại:** Accuracy/Precision/Recall là cho **phân loại** ([[danh-gia-mo-hinh]]), KHÔNG dùng cho hồi quy.
- **Chỉ nhìn 1 số:** kết hợp **RMSE (độ lớn lỗi) + R² (độ khớp) + chẩn đoán phần dư** mới đủ ([[linear-regression]]).

---

## 🔗 Liên kết
- **Tiền đề:** [[linear-regression]] · [[loss-function]] (MSE) · [[phuong-sai]] (R² = tỉ lệ phương sai giải thích)
- **Cặp đôi:** [[danh-gia-mo-hinh]] — độ đo **phân loại** (Accuracy/Precision/Recall/F1/AUC); note này là phần **hồi quy**
- **Liên quan:** [[overfitting]] · [[cross-validation]] · [[chon-mo-hinh]] · [[xac-dinh-van-de]] (chọn đúng thước đo theo mục tiêu)

## ❓ Câu hỏi mở
- RMSE hay MAE cho bài cụ thể của mình? (dữ liệu có outlier không?)
- Adjusted R² phạt biến vô ích bằng cơ chế nào trong công thức?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L3_LinearReg.pdf` Mục 05).
- StatQuest — "R-squared clearly explained". · ISLR ch.3.
