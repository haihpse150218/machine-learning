# Kiểm định chéo (Cross-Validation) & Chia Train/Test

> Tóm tắt 1 câu: Để biết model giỏi thật hay **học vẹt**, phải đo trên dữ liệu nó **chưa thấy** — chia Train/Test; và để con số **đáng tin** (không may/rủi), dùng **K-Fold**: luân phiên mỗi phần làm test → lấy trung bình K điểm.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟢 Trọng tâm (Lớp LÀM)
**📖 Lộ trình:** Nhánh D/E *(L2 Mục 04)* ← cần [[overfitting]] · [[huan-luyen-vs-suy-luan]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #danh-gia #cross-validation #lop-lam
**Nguồn slide:** `L2_Intro_ML_DL_GenAI.pdf` slide 34–39 — TS. Cao Tiến Dũng

---

## ⚠️ Vấn đề: đo trên chính tập train = ảo
- Dữ liệu thật (chưa thấy) **không có sẵn** lúc train.
- Đo trên **chính dữ liệu train** → điểm cao giả tạo (model đã thấy rồi) → che giấu [[overfitting]].
- 🎓 Ví von sinh viên: học vẹt "thuộc lòng trang 47" → hoàn hảo khi học, **tạch khi thi đề mới**.

## ✂️ Giải pháp 1: Chia Train / Test (slide 36)
```
[████████ Train (~70–80%) ████████][██ Test (~20–30%) ██]
```
- **Train:** dùng để **cập nhật trọng số** (model "thấy" cả đặc trưng lẫn nhãn).
- **Test:** **KHÔNG dùng khi train** → đo hiệu năng trên dữ liệu "chưa thấy" → mô phỏng **suy luận thực tế** ([[huan-luyen-vs-suy-luan]]).

### 🎲 Phải chia NGẪU NHIÊN / đan xen (cực quan trọng)
> Cả train lẫn test phải **rải đều, có câu khó có câu dễ, đủ các lớp** → mỗi tập là **mẫu đại diện** ([[lay-mau]]).
- ❌ **Chia tuần tự** trên dữ liệu đã sắp xếp → hỏng: vd data sắp theo lớp (rác trước, không rác sau) → lấy 20% cuối làm test → **test toàn 1 lớp** → vô nghĩa.
- ✅ **Shuffle (xáo trộn) rồi mới cắt** → train/test cùng đại diện → đánh giá công bằng.
- ✅ Lớp lệch → **stratified split** (giữ tỉ lệ lớp ở cả 2 tập).
- ⚠️ **Ngoại lệ — dữ liệu chuỗi thời gian:** KHÔNG shuffle; chia theo **thời gian** (train quá khứ → test tương lai), nếu không **rò rỉ tương lai** vào train.

## 🔄 Vấn đề của 1 lần chia → K-Fold (slide 38–39)
- **1 lần chia train/test:** điểm số tùy **may/rủi** chọn 30% nào làm test → chỉ **1 con số, khó tin**.
- **K-Fold Cross-Validation (K=5):** chia 5 phần, **luân phiên** mỗi phần làm test, 4 phần còn lại train:
```
Lần 1: [TEST ][Train][Train][Train][Train]
Lần 2: [Train][TEST ][Train][Train][Train]
Lần 3: [Train][Train][TEST ][Train][Train]
Lần 4: [Train][Train][Train][TEST ][Train]
Lần 5: [Train][Train][Train][Train][TEST ]
→ mỗi điểm dữ liệu được test ĐÚNG 1 LẦN
```
- Thu **K điểm** → lấy **trung bình ± độ lệch**: `[91, 89, 93, 88, 90] → 90.2% ± 1.7%`.
- Đáng tin hơn nhiều vì không phụ thuộc 1 lần chia may rủi. **Chuẩn thực hành: K = 5 hoặc 10.**

## ⏱️ Cái giá: chậm (train K lần)
- K-Fold phải **train lại model K lần** (K=5 → train 5 model) → **tốn gấp K lần** compute.
- Đánh đổi: **đáng tin hơn** nhưng **chậm hơn** → thực tế hay chọn **K=5** (thay vì 10) khi dữ liệu lớn / model nặng.

## 🎯 Ứng dụng SỐ 1: tìm siêu tham số tối ưu (hyperparameter tuning)
> Đây là lý do chính người ta dùng CV.
```
Với mỗi bộ siêu tham số (vd λ của [[regularization]], K của [[k-means]], max_depth của cây):
   → chạy K-Fold CV → ra điểm trung bình
→ chọn bộ siêu tham số cho điểm CV cao nhất
```
- Công cụ: **GridSearchCV** (thử mọi tổ hợp) / **RandomizedSearchCV** (thử ngẫu nhiên) trong scikit-learn.
- Vì sao dùng CV chứ không 1 lần chia: chọn siêu tham số dựa trên **trung bình K lần** → ít bị may rủi → không lỡ chọn bộ tham số "may mắn trên 1 tập test".

## 🧩 Train / Validation / Test (mở rộng)
- Khi cần **tinh chỉnh siêu tham số** (vd K của [[k-means]], λ của [[regularization]]): tách thêm **Validation**.
- **Train** học trọng số · **Validation** chọn siêu tham số · **Test** đo lần cuối (chỉ 1 lần, không đụng tới trước đó).

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Data leakage:** fit scaler/imputer ([[chuan-hoa-du-lieu]]) trên **toàn bộ** rồi mới chia → test bị "nhìn trộm". Đúng: fit **trong từng fold** trên phần train của fold đó.
- **Chấm điểm trên Test nhiều lần để chỉnh model** → Test thành Train trá hình → điểm ảo. Test chỉ dùng **1 lần cuối**.
- **Lớp mất cân bằng:** dùng **stratified K-fold** (giữ tỉ lệ lớp mỗi fold) → [[lay-mau]].

---

## 🔗 Liên kết
- **Tiền đề:** [[overfitting]] · [[huan-luyen-vs-suy-luan]]
- **Liên quan:** [[danh-gia-mo-hinh]] (đo bằng metric gì) · [[chuan-hoa-du-lieu]] (leakage) · [[regularization]] (chọn λ) · [[lay-mau]] (stratified)

## ❓ Câu hỏi mở
- Chọn K bao nhiêu? (5/10 phổ biến; K lớn → tin hơn nhưng tốn hơn)
- Khi nào dùng Leave-One-Out CV (K = số mẫu)?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L2_Intro_ML_DL_GenAI.pdf` slide 34–39).
- StatQuest — "Cross Validation".
