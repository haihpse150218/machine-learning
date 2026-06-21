# 🧠 Second Brain — Machine Learning

> Trang trung tâm (Map of Content) tổ chức toàn bộ kiến thức Machine Learning.
> Từ đây liên kết tới mọi ghi chú, chủ đề và tài nguyên.

**Cập nhật lần cuối:** 2026-06-21
**Trạng thái:** 🌱 Đang phát triển
**Nguồn đã học:** ✅ `L1_Math_Overview.pdf` (5 mảng toán — [[note]]) · ✅ `L2_Intro_ML_DL_GenAI.pdf` (6 mục) · ✅ `slide/L3_LinearReg.pdf` (Hồi quy tuyến tính → [[linear-regression]] · [[metric-hoi-quy]]) · ✅ `slide/L4_LogisticsReg.pdf` (Hồi quy Logistic & phân loại → [[logistic-regression]] · [[softmax]] · [[class-imbalance]] · [[danh-gia-mo-hinh]]) · ✅ `slide/L5_Regularization_FeatureSelection.pdf` (Tiền xử lý · Regularization · Chọn đặc trưng → [[regularization]] · [[feature-selection]] · [[bias-variance]])

> 🎯 **Kim chỉ nam (quy tắc 90/10):** Thực tế doanh nghiệp = **90% tìm + xử lý dữ liệu, 10% thuật toán**. Học toán/thuật toán để **HIỂU** model làm gì — trọng tâm thực hành là **xử lý dữ liệu "thả vào" cho đúng** + **dùng lại model có sẵn**. Chi tiết: [[dinh-huong-hoc]].
> 📋 **Plan/Checklist xử lý dữ liệu (lần sau cứ theo đây mà làm):** [[template-checklist]] — quy trình 8 bước từ xác định vấn đề → EDA → làm sạch → biến đổi → đặc trưng → chia → train → đánh giá.

---

## 🧭 Lộ trình đọc (đọc theo thứ tự này)
> Đánh số theo **dependency** — note sau cần kiến thức của note trước. Đọc từ trên xuống.

**Nhánh A · Giải tích → Tối ưu hóa**
1. [[giai-tich]] — bức tranh lớn: học = tìm hàm f, vì sao cần đạo hàm
2. [[dao-ham]] — đạo hàm: đo tốc độ thay đổi (độ dốc), 1 chiều
3. [[gradient]] — nhiều chiều: đạo hàm riêng từng trục → gradient (hướng + step)
4. [[gradient-descent]] — dùng gradient để "đi mò" huấn luyện mô hình
5. [[loss-function]] — hàm chi phí (MSE / Cross-Entropy): cái mà gradient descent tối thiểu
6. [[toi-uu-loi]] — hàm lồi: 1 đáy → train nhiều lần ra kết quả giống nhau (tái lập)
7. [[regularization]] — *(L5)* Ridge(L2)/Lasso(L1)/ElasticNet: phạt độ lớn trọng số → chống overfit (hướng 1); Lasso còn chọn biến
   - [[bias-variance]] — *(L5)* khung lý thuyết: tăng độ phức tạp → bias↓ variance↑ → chữ U có điểm tối ưu

**Nhánh B · Đại số tuyến tính → Giảm chiều (PCA)**
1. [[ma-tran-hiep-phuong-sai]] — các đặc trưng biến thiên cùng nhau thế nào (Σ)
2. [[tri-rieng-vector-rieng]] — Av = λv: tìm hướng quan trọng
3. [[pca]] — gộp 1+2: xoay trục, giảm chiều
   - *(tiếp theo, chưa viết)* → `[[svd]]` → `[[he-goi-y-recommender]]` (Netflix)

**Nhánh C · Xác suất → Thống kê** 🔴 bắt buộc
1. [[xac-suat]] — vì sao ML cần xác suất + các khái niệm cốt lõi
2. [[phan-phoi-xac-suat]] — biến ngẫu nhiên & phân phối: hiểu từng cột để xử lý/sinh dữ liệu đúng
   - [[gauss-va-nhi-thuc]] — Gauss → chuẩn hóa đặc trưng · Nhị thức → test A/B
   - *nhánh phụ Bayes:* [[dinh-ly-bayes]] — xác suất có điều kiện + Bayes → `[[naive-bayes]]` (lọc spam)
3. [[thong-ke]] — rút hiểu biết từ dữ liệu: mô tả, suy diễn, kiểm định (A/B test), EDA
   - [[tu-vung-thong-ke]] — từ vựng: tổng thể/mẫu/biến + phân loại biến (ý nghĩa khoảng cách)
   - [[phan-loai-thong-ke]] — mô tả (EDA) vs suy diễn (dự đoán): số vs phân loại
   - [[overfitting]] — tổng thể vs mẫu: model học thuộc mẫu → hỏng trên dữ liệu thật ⭐
   - [[lay-mau]] — kỹ thuật lấy mẫu (xác suất vs phi xác suất): mẫu có đại diện population?
   - [[kiem-dinh-gia-thuyet]] + [[p-value]] — chênh lệch là thật hay may rủi? (A/B test)
   - [[ky-vong-trung-binh]] + [[phuong-sai]] — tâm & độ phân tán (nền tảng mô tả dữ liệu)
   - [[tuong-quan]] — 2 biến đi cùng nhau chặt cỡ nào · tương quan ≠ nhân quả
   - [[entropy]] — đo độ hỗn tạp/bất định (bit) → cầu sang cây quyết định
   - [[suy-dien-hoc-may]] — 🌉 cầu khái niệm: thống kê suy diễn = bản chất của Machine Learning
   - [[maximum-likelihood]] — MLE: ước lượng tham số = đường cong ôm nhiều điểm nhất (= hồi quy)
   - *tiếp theo:* `[[khoang-tin-cay]]` · `[[loss-function]]`

**Nhánh D · Xử lý dữ liệu (Lớp LÀM — 90% công việc thật)** ⭐
0. [[xac-dinh-van-de]] — 🚦 Bước 0: chốt rõ vấn đề + mẫu chuẩn TRƯỚC khi làm (giải sai bài = vứt)
1. [[xu-ly-du-lieu]] — quy trình: thu thập → EDA → làm sạch → biến đổi → chia dữ liệu
2. [[feature-engineering]] — tạo đặc trưng tốt (domain knowledge = vũ khí)
3. [[chuan-hoa-du-lieu]] — scaling/normalization: đưa cột về cùng thang đo (tránh leakage)
4. [[encode-categorical]] — biến dữ liệu chữ → số đúng cách (nominal vs ordinal)
5. [[xu-ly-du-lieu-thieu]] — xử lý ô trống (NaN): xóa / điền / đánh dấu; 3 kiểu thiếu
6. [[class-imbalance]] — *(L4)* lệch lớp (99% âm/1% dương): SMOTE/resampling, class_weight, dịch ngưỡng, đo bằng F1/PR-AUC ⭐
7. [[feature-selection]] — *(L5)* chọn đặc trưng: Filter (thống kê) / Wrapper (RFE) / Embedded (Lasso, RF importance) ⭐

**Nhánh E · Thuật toán & Mô hình**
1. [[decision-tree]] — cây quyết định: if/else chia dữ liệu, giảm entropy (white-box, dễ hiểu)
2. [[linear-regression]] — 📈 *(L3)* đoán SỐ: đường thẳng tối thiểu RSS; Normal Eq vs GD; giả định + đa cộng tuyến
3. [[logistic-regression]] — 🎯 *(L4)* tên "regression" nhưng để PHÂN LOẠI (sigmoid → xác suất → ngưỡng); Log Loss vì lồi; gradient (σ−y)x
   - [[softmax]] — *(L4)* đa lớp (>2): chuẩn hóa K logits → K xác suất (tổng=1); OvR vs Softmax
4. [[random-forest]] — nhiều cây (mẫu+đặc trưng ngẫu nhiên) gom ý kiến → ổn định, ít overfit
5. [[xgboost]] — Gradient Boosting: cây nối tiếp, cây sau sửa lỗi cây trước (mạnh nhất cho dữ liệu bảng)
6. [[svm]] — tìm khe (margin) rộng nhất giữa các lớp; kernel bắt phi tuyến
7. [[k-means]] — *(không giám sát)* phân cụm: gán điểm vào tâm gần nhất → cập nhật tâm → lặp
   - [[meanshift]] — *(không giám sát)* trôi về vùng đậm đặc; không cần chọn K
8. [[chon-mo-hinh]] — 🧭 cheat sheet: chọn thuật toán nào? yếu tố cân nhắc + sơ đồ quyết định
9. [[danh-gia-mo-hinh]] — 📊 *(L2 Mục 03)* độ đo PHÂN LOẠI: Accuracy/Precision/Recall/F1/AUC + confusion matrix
10. [[metric-hoi-quy]] — 📏 *(L3)* độ đo HỒI QUY: MAE/MSE/RMSE/R²/Adjusted R² (khi nào dùng cái nào)
    - *(tiếp theo, chưa viết)* → `[[knn]]` · `[[naive-bayes]]`

**Nhánh F · Nhập môn ML / DL / GenAI** 📘 *(L2)*
1. [[ai-ml-dl]] — AI ⊃ ML ⊃ DL: ba vòng lồng nhau; ML = học từ dữ liệu
2. [[phan-loai-hoc-may]] — 4 loại: có/không/bán giám sát + tăng cường (supervised → phân loại/hồi quy)
   - [[cach-chatgpt-hoc]] — ChatGPT kết hợp tự-giám-sát + có-giám-sát + RLHF (thưởng/phạt)
3. [[huan-luyen-vs-suy-luan]] — *(L2 Mục 04)* train (cập nhật trọng số) vs inference (trọng số cố định)
4. [[cross-validation]] — *(L2 Mục 04)* chia Train/Test + K-Fold: đo trên dữ liệu chưa thấy cho tin cậy
5. [[deep-learning]] — *(L2 Mục 05)* mạng nơ-ron nhiều lớp tự học đặc trưng (CNN/RNN/LSTM)
6. [[generative-ai]] — *(L2 Mục 06)* sinh dữ liệu mới: học P(dữ liệu) — GAN/VAE/Diffusion/Transformer
   - [[autoencoder]] — nén → mã → tái tạo (PCA phi tuyến); nền của VAE

> Quy ước: mỗi note ghi sẵn breadcrumb **📖 Lộ trình: Nhánh _ · #_** ở đầu để biết mình đang ở đâu.

---

## 🗺️ Bản đồ kiến thức

### 0. Nhập môn / Tổng quan ML 📘 *(L2)*
- [[ai-ml-dl]] — AI ⊃ ML ⊃ DL (ba vòng lồng nhau)
- [[phan-loai-hoc-may]] — 4 loại học máy (giám sát / không / bán / tăng cường)
- [[cach-chatgpt-hoc]] — ChatGPT kết hợp các loại (self-supervised + SFT + RLHF)

### 1. Nền tảng Toán học
Các lĩnh vực toán cốt lõi cho ML — xem chi tiết tại [[note]].

| Lĩnh vực | Mức độ | Trạng thái |
|----------|--------|------------|
| Đại số tuyến tính — [[tri-rieng-vector-rieng]] | Quan trọng | 🟡 Đang học |
| Giải tích (Calculus) — [[giai-tich]] · [[dao-ham]] · [[gradient]] | Quan trọng | 🟡 Đang học |
| Lý thuyết xác suất (Probability Theory) — [[xac-suat]] | 🔴 Bắt buộc | 🟡 Đang học |
| Thống kê (Statistics) — [[thong-ke]] · [[ma-tran-hiep-phuong-sai]] | 🔴 Bắt buộc | 🟡 Đang học |
| Tối ưu hóa (Optimization) — [[loss-function]] · [[toi-uu-loi]] · [[regularization]] | Quan trọng | 🟡 Đang học |

### 2. Thuật toán & Mô hình
🧭 **Chọn thuật toán nào? → [[chon-mo-hinh]]** (cheat sheet + sơ đồ `chon-mo-hinh.png`)

**Có giám sát (Supervised):**
- [[linear-regression]] — 📈 hồi quy: đoán SỐ bằng đường thẳng (nền của mọi mô hình tuyến tính)
- [[decision-tree]] — cây if/else, white-box, dùng [[entropy]]
- [[logistic-regression]] — phân loại tuyến tính (sigmoid → xác suất) · [[softmax]] (đa lớp)
- [[random-forest]] — nhiều cây vote (bagging), kháng nhiễu
- [[xgboost]] — Gradient Boosting, mạnh nhất cho dữ liệu bảng
- [[svm]] — margin rộng nhất + kernel phi tuyến
- *(chưa viết)* `[[knn]]` · `[[naive-bayes]]`

**Không giám sát (Unsupervised):**
- [[k-means]] — phân cụm theo tâm gần nhất
- [[meanshift]] — phân cụm theo mật độ (không cần K)
- [[pca]] — giảm chiều theo phương sai lớn nhất

**Tối ưu hóa & huấn luyện:**
- [[gradient-descent]] — thuật toán nền tảng tối thiểu [[loss-function]]

### 3. Kỹ thuật thực hành  ⭐ (trọng tâm — xem [[dinh-huong-hoc]])
*(Data preprocessing, Feature engineering, Model evaluation, Cross-validation...)*
- [[xac-dinh-van-de]] — 🚦 Bước 0: xác định vấn đề trước khi làm
- [[xu-ly-du-lieu]] — 🟢 quy trình xử lý dữ liệu (Lớp LÀM, 90%)
- [[feature-engineering]] — 🟢 tạo đặc trưng tốt (domain knowledge)
- [[chuan-hoa-du-lieu]] — 🟢 scaling/normalization đúng cách
- [[encode-categorical]] — 🟢 encode dữ liệu phân loại (nominal vs ordinal)
- [[xu-ly-du-lieu-thieu]] — 🟢 xử lý dữ liệu thiếu (NaN)
- [[class-imbalance]] — 🟢 mất cân bằng lớp (SMOTE, class_weight, dịch ngưỡng)
- [[overfitting]] — 🟡 tổng thể vs mẫu, tránh học thuộc mẫu
- [[danh-gia-mo-hinh]] — 📊 độ đo PHÂN LOẠI (Accuracy/Precision/Recall/F1/AUC)
- [[metric-hoi-quy]] — 📏 độ đo HỒI QUY (MAE/RMSE/R²/Adjusted R²)
- [[cross-validation]] — 🟢 chia Train/Test + K-Fold (đo đáng tin)
- [[feature-selection]] — 🟢 *(L5)* chọn đặc trưng: Filter / Wrapper / Embedded ⭐
- [[regularization]] — 🟡 *(L5)* Ridge/Lasso/ElasticNet chống overfit (hướng 1)
- [[bias-variance]] — 🟡 *(L5)* đánh đổi bias↓ vs variance↑ → độ phức tạp tối ưu
- [[huan-luyen-vs-suy-luan]] — train vs inference
- *(chưa viết)* `[[transfer-learning]]` · `[[fine-tuning]]`

### 4. Công cụ & Thư viện
*(NumPy, Pandas, scikit-learn, PyTorch, TensorFlow...)*

---

## 📥 Inbox (cần xử lý)
> Ý tưởng / câu hỏi mới chưa phân loại — chuyển vào bản đồ ở trên khi đã rõ.

- 🔑 [[tu-khoa-lam-ai]] — **backlog keyword/công cụ** nhặt khi học → để sau lên plan làm AI/đồ án (danh sách sống).
- [ ]

---

## ❓ Câu hỏi mở
> Những điều chưa hiểu rõ, cần đào sâu thêm.

-

---

## 📚 Tài nguyên
> Sách, khóa học, bài viết, video tham khảo.

- 📑 Slide môn học (TS. Cao Tiến Dũng) — thư mục `slide/`: `L1_Math_Overview.pdf` ✅ · `L2_Intro_ML_DL_GenAI.pdf` ✅ · `L3_LinearReg.pdf` ✅ · `L4_LogisticsReg.pdf` ✅ · `L5_Regularization_FeatureSelection.pdf` ✅ · `DeCuong_HocMay_Summer2026.pdf`
- 🖼️ Hình tự vẽ: `eigenvector-pca.png` (Eigenvector & PCA) · `chon-mo-hinh.png` (sơ đồ chọn mô hình)
- 🎥 Tham khảo: StatQuest, 3Blue1Brown (Essence of Linear Algebra/Calculus)

---

## 🔗 Quy ước liên kết
- Dùng `[[tên-file]]` để liên kết tới ghi chú khác (vd: [[note]]).
- Mỗi khái niệm lớn → tách thành 1 file ghi chú riêng, rồi link về trang này.
- Trạng thái: ⬜ Chưa học · 🟡 Đang học · ✅ Đã nắm · 🔁 Cần ôn
