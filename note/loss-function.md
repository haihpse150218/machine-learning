# Hàm chi phí / Hàm mất mát (Cost / Loss Function)

> Tóm tắt 1 câu: Hàm toán học **đo model sai bao nhiêu** — thấp = tốt. Huấn luyện = **cực tiểu hóa** hàm này (bằng [[gradient-descent]]) để model ngày càng đúng.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh A (Tối ưu) — cái mà [[gradient-descent]] đi tìm cực tiểu
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #toi-uu-hoa #loss #core
**Nguồn slide:** `L1_Math_Overview.pdf` slide 48 — TS. Cao Tiến Dũng

---

## 💡 Ý chính
- **Hàm chi phí** = thước đo khoảng cách giữa **dự đoán (ŷ)** và **thực tế (y)** → cho 1 con số "sai cỡ nào".
- **Mục tiêu: cực tiểu hóa** hàm này → model hoạt động tốt hơn.
- Đây chính là "bề mặt thung lũng" mà [[gradient-descent]] **đi mò** xuống đáy.

> *Thuật ngữ:* **Loss** thường chỉ sai số 1 mẫu; **Cost** là trung bình loss trên toàn bộ dữ liệu. Hay dùng lẫn nhau.

## 🔢 Hai hàm chi phí kinh điển (theo slide)

### ① MSE — Sai số toàn phương trung bình (hồi quy)
```
MSE = (1/n) · Σ (ŷᵢ − yᵢ)²
```
- Trung bình **bình phương** sai số. Bình phương để: bỏ dấu + **phạt nặng** sai số lớn ([[phuong-sai]]).
- Dùng cho **hồi quy** (dự đoán số: giá nhà, nhiệt độ).
- 🔁 Bắt nguồn từ [[maximum-likelihood]] với giả định **nhiễu Gaussian** (tối thiểu MSE ⟺ tối đa likelihood).

### ② Cross-Entropy — Entropy chéo (phân loại)
```
CE = − Σ yᵢ · log(ŷᵢ)
```
- Đo phân phối **dự đoán** lệch bao nhiêu so với **thật** → [[entropy]].
- Dùng cho **phân loại** (spam/không, chó/mèo).
- 🔁 Chính là **−log-likelihood** của phân loại → tối thiểu CE ⟺ làm [[maximum-likelihood]].

## 🧮 Ví dụ tính bằng số (slide 49)
**MSE (hồi quy):**
```
y_true = [3.0, 5.0, 7.0],  y_pred = [2.8, 5.2, 6.5]
errors = [(0.2)², (0.2)², (0.5)²] = [0.04, 0.04, 0.25]
MSE = (0.04+0.04+0.25)/3 = 0.11      # nhỏ = model tốt
```
**Cross-Entropy nhị phân (phân loại):**
```
y_true=1 (mèo), y_pred=0.9 (tự tin & đúng):  L = −log(0.9) = 0.105   # mất mát NHỎ
y_true=1 (mèo), y_pred=0.1 (sai mà vẫn tự tin): L = −log(0.1) = 2.303 # mất mát LỚN!
```
> 💡 **Cross-Entropy phạt rất nặng dự đoán SAI mà lại TỰ TIN** → ép model vừa chính xác vừa **hiệu chỉnh độ tin cậy** đúng (không "chém gió" 99% rồi sai).

## 🔗 Bức tranh lớn (mọi thứ nối vào đây)
```
Chọn hàm chi phí  (MSE / Cross-Entropy)
   → đo model sai bao nhiêu
   → [[gradient-descent]] đi ngược gradient để GIẢM chi phí
   → tham số tốt dần  → model học xong
   (cực tiểu chi phí ⟺ [[maximum-likelihood]])
```

## ⚠️ Loss vs Metric (đừng lẫn)
- **Loss/Cost:** để **tối ưu** (phải khả vi, mượt cho gradient descent) — vd MSE, Cross-Entropy.
- **Metric:** để **đánh giá & báo cáo** cho người (dễ hiểu) — vd Accuracy, Precision/Recall, RMSE.
- Có thể tối thiểu cross-entropy nhưng vẫn báo cáo accuracy.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Dùng sai loss:** MSE cho phân loại → mặt lỗi xấu, học kém; phân loại nên dùng Cross-Entropy.
- **MSE nhạy outlier:** bình phương khuếch đại điểm lệch xa (cân nhắc MAE nếu nhiều outlier).
- **Tối ưu sai thước đo:** loss giảm nhưng metric kinh doanh không cải thiện → xem lại bài toán ([[xac-dinh-van-de]]).

---

## 🔗 Liên kết
- **Nối tới:** [[gradient-descent]] (tối thiểu hóa) · [[maximum-likelihood]] (−log-likelihood) · [[entropy]] (cross-entropy)
- **Tiền đề:** [[phuong-sai]] (bình phương sai số) · [[giai-tich]] (cực tiểu)
- **Ứng dụng:** [[linear-regression]] (MSE) · [[logistic-regression]] (cross-entropy)

## ❓ Câu hỏi mở
- Khi nào dùng MAE thay MSE? (dữ liệu nhiều outlier)
- Vì sao cross-entropy hợp phân loại hơn MSE?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (slide 48).
- StatQuest — "Loss functions".
