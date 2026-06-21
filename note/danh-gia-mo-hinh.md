# Đánh giá mô hình & Độ đo (Evaluation Metrics)

> Tóm tắt 1 câu: Đo "model tốt đến đâu" — nhưng **chọn sai độ đo sẽ đánh lừa ta**. Accuracy có thể 98.5% mà vẫn để lọt việc quan trọng; phải nhìn **Precision / Recall / F1** tùy bài toán.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟢 Trọng tâm (Lớp LÀM)
**📖 Lộ trình:** Nhánh E (Thuật toán & Đánh giá) · #9 ← cần [[phan-loai-hoc-may]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #danh-gia #metric #lop-lam
**Nguồn slide:** `L2_Intro_ML_DL_GenAI.pdf` Mục 03 (slide 20–26) + `L4_LogisticsReg.pdf` Phần 04 — TS. Cao Tiến Dũng

---

## ⚠️ Cái bẫy Accuracy (slide 21)
> *"Chọn sai độ đo có thể gây hiểu lầm hoặc không nắm được bài toán thực sự."*
- Bài lọc rác **mất cân bằng**: nếu **99/100 email là rác**, model **luôn đoán "rác"** → Accuracy = **99%**!
- Nhưng nó **vô dụng** (không phân biệt được gì). → Accuracy chỉ hợp khi **lớp cân bằng**.
- **Hệ quả thật:** model "luôn đoán rác" sẽ đẩy **cả email quan trọng (1 cái không rác) vào thư rác** — dù accuracy vẫn 99%. Đây là lỗi **FP** → đo bằng **Precision**, không phải Accuracy.

## 🔭 EDA định hướng chọn model & độ đo
> **EDA (khai phá dữ liệu)** không chỉ để làm sạch — nó **quyết định** chọn thuật toán nào và đo bằng gì.

```
EDA (khám phá dữ liệu)  →  thấy gì?  →  quyết định
─────────────────────────────────────────────────────
Lớp LỆCH (99% rác)      →  đừng dùng Accuracy → Precision/Recall
Nhiều outlier           →  median, robust scaling, MAE thay MSE
Tương quan cao          →  bỏ bớt cột / PCA trước khi train
Phi tuyến rõ            →  cây/boosting thay vì linear
```
- Mạch xuyên suốt: [[thong-ke]] (EDA) → [[chon-mo-hinh]] (chọn thuật toán) → **đo bằng độ đo đúng** (note này).
- Bài học: **nhìn dữ liệu TRƯỚC** rồi mới chốt model + metric, đừng làm ngược ([[xac-dinh-van-de]]).

## 🧩 Ma trận nhầm lẫn (Confusion Matrix) — nền của mọi độ đo
| | Đoán DƯƠNG | Đoán ÂM |
|---|---|---|
| **Thật DƯƠNG** | **TP** (bắt đúng) | **FN** (bỏ lọt) |
| **Thật ÂM** | **FP** (gắn cờ nhầm) | **TN** (đúng, cho qua) |

> 🔁 Nối [[kiem-dinh-gia-thuyet]]: **FP = Lỗi loại I** (báo động giả), **FN = Lỗi loại II** (bỏ sót).

## 📏 Các độ đo phân loại
```
Accuracy  = (TP+TN) / (TP+TN+FP+FN)   → tổng thể đoán đúng bao nhiêu (hợp khi cân bằng)
Precision = TP / (TP+FP)              → trong số ĐOÁN dương, bao nhiêu THẬT đúng?
Recall    = TP / (TP+FN)              → trong số dương THẬT, bắt được bao nhiêu?
F1        = 2·P·R / (P+R)             → trung bình điều hòa, phạt khi P & R lệch nhau
```
| Độ đo | Hỏi gì | Dùng khi |
|-------|--------|----------|
| **Precision** | "gắn cờ rồi thì bao nhiêu cái đúng?" | **FP đắt** — gắn nhầm tốn kém (email quan trọng → spam) |
| **Recall** | "bỏ sót bao nhiêu ca dương thật?" | **FN đắt** — bỏ sót nguy hiểm (bệnh, gian lận) |
| **F1** | cân cả hai | cần **cả** Precision lẫn Recall tốt |

> 🎣 **Nhớ bằng ví dụ câu cá:** **Precision** = trong mẻ kéo lên, bao nhiêu là cá thật (không phải rác)? — *sợ kéo nhầm rác*. **Recall** = trong tất cả cá dưới hồ, bắt được bao nhiêu? — *sợ để sót cá*.
> ⚖️ **Precision ↔ Recall thường đánh đổi:** siết ngưỡng → precision tăng, recall giảm (và ngược lại).

### Vì sao F1 dùng trung bình ĐIỀU HÒA (không phải cộng)?
Trung bình điều hòa **phạt nặng khi P và R lệch nhau** → F1 cao chỉ khi **cả hai** cùng cao:
```
Precision  Recall   TB cộng    F1
   0.95      0.95     0.95     0.95
   0.95      0.50     0.72     0.66
   0.95      0.10     0.53     0.18   ← TB cộng "nghe ổn" nhưng F1 phơi bày: model tệ
```

### 🧭 Lệch lớp → chọn Precision / Recall / F1 thế nào?
> Câu hỏi vàng: **"Sai lầm nào tốn kém hơn — báo nhầm (FP) hay bỏ sót (FN)?"**

| Ưu tiên | Khi | Ví dụ |
|---------|-----|-------|
| **Precision** | sợ **báo động giả** (FP tốn kém) | spam (đừng đẩy email quan trọng vào rác), gợi ý, bắt oan |
| **Recall** | sợ **bỏ sót** (FN nguy hiểm) | ung thư, gian lận, an ninh |
| **F1** | cả hai quan trọng / không rõ cái nào nặng | **mặc định tốt cho dữ liệu lệch** (phạt khi P, R lệch nhau) |

- Mẹo: sợ **bỏ sót** → Recall; sợ **làm phiền/oan** → Precision; muốn **1 số cân bằng** → F1.
- Với dữ liệu lệch, ngoài F1 còn dùng **PR-AUC** (thay ROC-AUC khi lệch nặng).

**🔄 Luồng đọc thực hành (khi chưa chắc cái nào quan trọng):**
```
Lệch lớp → nhìn F1 trước (tổng hợp nhanh)
   → chưa đủ rõ? → tách Precision & Recall RIÊNG (xem model lệch về đâu)
   → nghiêng theo bài toán: sợ FN → Recall · sợ FP → Precision
```
> Nếu **đã biết trước** sai lầm nào tốn kém (vd bắt ung thư → Recall) → đi thẳng tới đó, khỏi cần F1 ([[xac-dinh-van-de]]).

## 🧮 Ví dụ tính (slide 26) — lọc rác 1000 email
```
TP = 90 (bắt đúng rác)   FN = 10 (lọt vào hộp thư)
FP = 5  (gắn cờ nhầm)    TN = 895 (đúng, cho qua)

Accuracy  = (90+895)/1000 = 98.5%
Precision = 90/95         = 94.7%
Recall    = 90/100        = 90.0%
F1        ≈ 92.3%
```
> ⚠️ **98.5% nghe hoàn hảo — nhưng 10 thư rác thật vẫn lọt qua!** → đừng tin mỗi accuracy.

## 📈 AUC – ROC (slide 25)
```
TPR (Độ nhạy / Sensitivity / Recall) = TP / (TP+FN)  → bắt đúng ca DƯƠNG bao nhiêu
FPR (= 1 − Độ đặc hiệu / Specificity) = FP / (TN+FP)  → báo nhầm ca ÂM bao nhiêu
   trong đó  Specificity (độ đặc hiệu) = TN / (TN+FP) → cho qua đúng ca ÂM
```
- **ROC:** đường cong **TPR theo FPR** khi quét hết các **ngưỡng**.
- **AUC** = **diện tích dưới ROC**: 1.0 = hoàn hảo, 0.5 = đoán bừa (đường chéo).
- Đo khả năng **phân tách 2 lớp** — **độc lập với ngưỡng** (khác Precision/Recall vốn cố định 1 ngưỡng).
- 💡 Thuật ngữ y khoa hay dùng **Sensitivity/Specificity**; ML hay dùng **Recall/FPR** — cùng một thứ.
- ⚠️ Lớp **lệch nặng** → **PR-AUC** phản ánh thật hơn ROC-AUC (xem dưới).

> 🆚 **Dùng AUC để SO SÁNH mô hình:** vẽ ROC của cả hai trên cùng hình → đường nào **ôm sát góc trên-trái** hơn (TPR cao, FPR thấp) thì tốt hơn; gọn hơn thì so **AUC lớn hơn = tốt hơn tổng thể**. Nếu **2 đường cắt nhau** → không có model thắng tuyệt đối, chọn theo **vùng ngưỡng thực sự vận hành**. Ưu điểm: AUC **không cần chốt ngưỡng** → chọn model trước, chỉnh ngưỡng sau.

## 📉 Đường cong Precision-Recall (PR) — bạn thân của dữ liệu lệch (L4)
```
PR curve : đồ thị Precision theo Recall khi quét hết các NGƯỠNG
AP / PR-AUC : diện tích dưới PR — tóm tắt chất lượng bằng một số
Đường cơ sở (baseline) = tỉ lệ lớp dương trong dữ liệu
```
- **Ưu tiên PR hơn ROC khi** dữ liệu **MẤT CÂN BẰNG mạnh** (lớp dương hiếm): ROC-AUC có thể **lạc quan quá mức** vì TN khổng lồ kéo FPR xuống thấp giả tạo, còn PR nhìn thẳng vào chất lượng bắt lớp dương.

> 🔍 **Ví dụ số cho thấy ROC đánh lừa thế nào** — bài gian lận: **1.000.000 giao dịch, chỉ 100 gian lận**. Model báo nhầm **5.000** ca (FP):
> ```
> ROC dùng FPR = FP/(FP+TN) = 5000/(5000+995000) = 0.5%  → "model tuyệt vời!" 😍
> PR dùng Precision = TP/(TP+FP) = 100/(100+5000)  = 2.0%  → "98% cảnh báo là SAI!" 😱
> ```
> **TN khổng lồ (995.000) làm mẫu số của FPR phình to** → FPR luôn bé tí dù FP nhiều → ROC đẹp giả tạo. **Precision KHÔNG dùng TN** → phơi bày sự thật. ⇒ lớp dương càng hiếm, **PR càng trung thực**.

- 🔗 Cách xử lý dữ liệu lệch (SMOTE, class_weight, dịch ngưỡng) → [[class-imbalance]].

> 🎚️ **Ngưỡng quyết định là "núm vặn":** ROC/PR sinh ra bằng cách **quét mọi ngưỡng**; chọn 1 điểm trên đường cong = chọn 1 ngưỡng, đánh đổi Precision ↔ Recall. Chi tiết cơ chế ở [[logistic-regression]].

## 📐 Hồi quy: dùng độ đo khác
- **MSE** = trung bình bình phương sai số → [[loss-function]] · [[phuong-sai]]. (MAE, RMSE...)
- Không dùng accuracy/precision cho bài hồi quy.

### R² (Hệ số xác định) — model giải thích được bao nhiêu?
```
R² = 1 − SS_res / SS_tot
   = 1 − Σ(yᵢ − ŷᵢ)²  /  Σ(yᵢ − ȳ)²
       └ tổng sai số ┘   └ tổng độ lệch khỏi trung bình (≈ phương sai × n) ┘
```
- **Ý nghĩa:** tỉ lệ **biến thiên của dữ liệu mà model giải thích được** ([[phuong-sai]]).
- **Gần 1 → tốt** (sai số nhỏ, giải thích gần hết biến thiên). **Gần 0 → xấu** (chỉ ngang "đoán bằng trung bình ȳ").
- **R² < 0:** model còn **tệ hơn** cả việc đoán bừa bằng trung bình.

> 💡 Mẫu số dùng **trung bình ȳ** làm chuẩn so sánh: R² hỏi *"model hơn baseline 'luôn đoán trung bình' bao nhiêu?"*

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Chỉ nhìn Accuracy** với dữ liệu lệch lớp → ảo tưởng (xem cái bẫy trên).
- **Lẫn Precision với Recall:** Precision = chất lượng cảnh báo; Recall = độ phủ.
- **Chọn metric không khớp mục tiêu kinh doanh** → tối ưu nhầm ([[xac-dinh-van-de]]).
- **Lẫn Loss với Metric:** loss để **train** (mượt, khả vi); metric để **đánh giá** cho người → [[loss-function]].

---

## 🔗 Liên kết
- **Tiền đề:** [[phan-loai-hoc-may]] · [[kiem-dinh-gia-thuyet]] (FP/FN = lỗi I/II)
- **Liên quan:** [[logistic-regression]] (ngưỡng quyết định) · [[softmax]] (đo đa lớp) · [[class-imbalance]] (lệch lớp) · [[chon-mo-hinh]] · [[xac-dinh-van-de]] (chọn đúng thước đo) · [[loss-function]] (loss vs metric) · [[overfitting]]

## ❓ Câu hỏi mở
- Khi nào ưu tiên Precision, khi nào Recall? (cho bài cụ thể của mình)
- Vì sao F1 dùng trung bình điều hòa chứ không phải trung bình thường?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L2_Intro_ML_DL_GenAI.pdf` slide 20–26 · `L4_LogisticsReg.pdf` Phần 04).
- StatQuest — "Confusion Matrix", "ROC and AUC", "Precision-Recall".
- 💻 **Demo tự cài** (tường minh, không dùng `sklearn.metrics`): `code-practice/logistic-regression-oop.ipynb` Mục 7–12 — confusion matrix, P/R/F1, ROC/AUC + so sánh model, PR curve.
