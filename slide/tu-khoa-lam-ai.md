# 🔑 Từ khóa làm AI (Keyword Backlog → lên plan)

> Node gom **keyword / kỹ thuật / công cụ** nhặt được trong lúc học — để **sau này khi bắt tay làm AI / đồ án** thì có sẵn danh sách mà **lên kế hoạch**, không phải nhớ lại từ đầu.

**Ngày tạo:** 2026-06-20
**Trạng thái:** 🌱 Danh sách sống (cập nhật liên tục)
**Loại:** 🗂️ Backlog / Index (không phải atomic note)
**Chủ đề cha:** [[SECOND_BRAIN]]
**Tags:** #backlog #lam-ai #keyword #plan

> Nguồn nhặt keyword: `slide/keywork.txt`, `slide/tools.txt` → chốt vào bảng dưới rồi mới coi là "đã nắm".

---

## 🧠 Kỹ thuật / Khái niệm (để áp dụng khi train/tinh chỉnh)
> Cách dùng: gặp keyword → ghi 1 dòng "để làm gì" → link tới note nếu đã có → đặt trạng thái.

| Keyword | Để làm gì (khi làm AI) | Note | Trạng thái |
|---------|------------------------|------|------------|
| **Learning rate decay** | giảm dần η để model hội tụ êm, dập dao động cuối train | [[gradient-descent]] | ✅ đã nắm |
| **Chuẩn hóa trục (feature scaling)** | ⭐ điều kiện để η hiệu quả: đưa các trục về cùng standard (mean 0, std 1) → loss tròn → 1 η chạy mọi hướng | [[chuan-hoa-du-lieu]] · [[gradient-descent]] | ✅ đã nắm |
| **SGD / Mini-batch** | chọn cách cập nhật trọng số cho dữ liệu lớn (batch 32/64/128) | [[gradient-descent]] | ✅ đã nắm |
| **Normal Equation vs GD** | p nhỏ → giải thẳng; p lớn/dữ liệu lớn → GD | [[linear-regression]] | ✅ đã nắm |
| **Đa cộng tuyến / VIF** | phát hiện đặc trưng trùng lặp trước khi train (VIF > 5–10) | [[linear-regression]] | ✅ đã nắm |
| **Regularization (L1/L2)** | chống overfit, "weight decay" | [[regularization]] | 🟡 |
| **MICE** (IterativeImputer) | ⭐ điền dữ liệu thiếu bằng cách **LẶP**: mỗi vòng **huấn luyện 1 mô hình hồi quy** cho từng cột, dùng các cột khác **dự đoán** cột thiếu, lặp đến hội tụ (học→suy đoán, chính xác hơn điền hằng số) | [[xu-ly-du-lieu-thieu]] | ✅ đã nắm |
| **KNN Imputer** | điền thiếu theo **k mẫu lân cận** (cần scale trước) | [[xu-ly-du-lieu-thieu]] | ✅ đã nắm |
| **missingno** | thư viện visualize thiếu (bar/matrix/heatmap) → đoán MCAR/MAR/MNAR | [[xu-ly-du-lieu-thieu]] | ✅ đã nắm |
| **Feature selection** (Filter/Wrapper/Embedded) | bỏ cột nhiễu/trùng — RFE, Lasso, RF importance, MI | [[feature-selection]] | 🟡 |
| **Cross-validation / K-Fold** | đo hiệu năng đáng tin trên dữ liệu chưa thấy | [[cross-validation]] | 🟡 |
| **Adam optimizer** | optimizer tự chỉnh bước — mặc định tốt khi train | `[[adam-optimizer]]` *(chưa viết)* | ⬜ |
| **Learning rate scheduling** | lịch warmup + decay (Transformer/model lớn) | `[[learning-rate]]` *(chưa viết)* | ⬜ |
| **Transfer learning / Fine-tuning** | ⭐ dùng lại model pretrained (đúng [[dinh-huong-hoc]]) | `[[transfer-learning]]` *(chưa viết)* | ⬜ |

## 🛠️ Công cụ / API (để xây hệ thống)
| Công cụ | Dùng để | Nguồn / Link |
|---------|---------|--------------|
| **Tavily Search API** | cho AI tự search web, **trả JSON** → dễ parse | https://docs.tavily.com/welcome (`slide/tools.txt`) |
| **scikit-learn** | train/đánh giá ML cổ điển (regression, tree, metric) | [[linear-regression]] (ví dụ code) |
| **TensorFlow / Keras** | xây & huấn luyện mạng nơ-ron (Buổi 9) | `[[keras]]` *(chưa viết)* |

## 🚦 Cách dùng node này để lên plan
1. **Học tới đâu, nhặt keyword tới đó** vào bảng (kèm "để làm gì").
2. Khi **bắt đầu đồ án/làm AI** → lọc các keyword trạng thái ✅/🟡 → xếp thành các bước:
   ```
   Dữ liệu  → đặc trưng (đa cộng tuyến/VIF, chuẩn hóa, encode)
   Mô hình  → chọn thuật toán ([[chon-mo-hinh]])
   Train    → optimizer (Adam) + learning rate decay
   Đánh giá → cross-validation + metric đúng ([[metric-hoi-quy]]/[[danh-gia-mo-hinh]])
   Tối ưu   → regularization chống overfit
   ```
3. Keyword nào ⬜ mà cần cho plan → **ưu tiên học/viết note** trước.

---

## 🔗 Liên kết
- **Trung tâm:** [[SECOND_BRAIN]] · **Định hướng:** [[dinh-huong-hoc]] (dùng lại model, xử lý dữ liệu)
- **Quy trình làm:** [[xac-dinh-van-de]] → [[xu-ly-du-lieu]] → [[chon-mo-hinh]] → đánh giá

## 📚 Nguồn
- `slide/keywork.txt` (keyword nhặt khi nghe giảng) · `slide/tools.txt` (công cụ/API).
