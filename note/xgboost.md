# Gradient Boosting (GBM · XGBoost · LightGBM · CatBoost)

> Tóm tắt 1 câu: Xây **hàng loạt cây NỐI TIẾP nhau** — mỗi cây mới **sửa lỗi (sai số còn lại)** của các cây trước → tổ hợp ngày càng chính xác. "Gradient" vì mỗi cây là một **bước giảm sai số** (như [[gradient-descent]] nhưng trên không gian hàm).

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh E (Thuật toán) · #5 ← cần [[decision-tree]] · [[gradient-descent]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #thuat-toan #ensemble #boosting

---

## 💡 Ý chính (đúng mạch của bạn)
- Xây **nhiều mô hình tuần tự**: cây 1 → còn sai → cây 2 học **phần sai đó** → vẫn sai → cây 3 sửa tiếp → ...
- Mỗi cây mới **tập trung vào chỗ các cây trước làm sai** → cộng dồn lại càng lúc càng đúng.
- Khác hẳn [[random-forest]] (các cây độc lập, vote).

## ⚙️ Cách hoạt động (boosting)
```
1. Bắt đầu: 1 mô hình yếu (cây nông) → dự đoán thô
2. Tính SAI SỐ còn lại (residual = thật − dự đoán)
3. Train cây mới để ĐOÁN ĐÚNG phần sai số đó
4. Cộng cây mới vào tổ hợp (nhân learning rate η để bước nhỏ, an toàn)
5. Lặp lại → sai số giảm dần
```
> 🔁 **"Gradient" ở đâu?** Mỗi cây đi theo hướng **giảm loss** ([[loss-function]]) — chính là [[gradient-descent]] nhưng "bước đi" là **thêm một cây**, không phải chỉnh số.

## 🆚 Bagging (Random Forest) vs Boosting
| | Random Forest (Bagging) | Gradient Boosting |
|---|---|---|
| Các cây | **độc lập, song song** | **nối tiếp**, cây sau sửa cây trước |
| Gộp | bỏ phiếu / trung bình | cộng dồn (có learning rate) |
| Mục tiêu chính | giảm **variance** | giảm **bias** (sửa lỗi dần) |
| Rủi ro | ít overfit | **dễ overfit** nếu nhiều cây / không regularize |

## 👨‍👩‍👧 Gia đình (slide)
| Thư viện | Điểm nổi bật |
|----------|--------------|
| **GBM** | Gradient Boosting gốc |
| **XGBoost** ⭐ | Tối ưu tốc độ + **regularization** ([[regularization]]), nuốt **NaN** natively; vua các **cuộc thi (Kaggle)** & dữ liệu bảng |
| **LightGBM** | Rất **nhanh**, mọc lá theo leaf-wise; hợp **dữ liệu lớn** |
| **CatBoost** | Xử lý **categorical** tốt (tên Cat = Categorical) |

## ✅ Mạnh / ❌ Yếu
| ✅ Mạnh | ❌ Yếu |
|--------|-------|
| **Mạnh nhất cho dữ liệu bảng** (thường thắng giải) | **Dễ overfit** nếu không tinh chỉnh |
| Độ chính xác cao, có feature importance | **Nhiều siêu tham số** (η, depth, n_estimators...) |
| XGBoost nuốt NaN, không cần scale | Train **tuần tự** → khó song song như RF; kém giải thích |

> ⚖️ Đánh đổi cốt lõi: **learning rate η nhỏ + nhiều cây** = chính xác nhưng chậm & dễ overfit → cần [[overfitting]] kiểm soát (early stopping, regularization).

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Để quá nhiều cây + η lớn → overfit** nặng (học thuộc cả nhiễu).
- **Nhầm với Random Forest:** RF = song song giảm variance; Boosting = nối tiếp giảm bias.
- Mặc định "XGBoost luôn tốt nhất" → dữ liệu nhỏ/đơn giản thì Logistic ([[logistic-regression]]) đã đủ.

---

## 🔗 Liên kết
- **Tiền đề:** [[decision-tree]] · [[gradient-descent]] · [[loss-function]] · [[regularization]]
- **So với:** [[random-forest]] (bagging) · [[logistic-regression]] (baseline đơn giản)
- **Thuộc:** [[phan-loai-hoc-may]] · [[chon-mo-hinh]]

## ❓ Câu hỏi mở
- Vì sao boosting giảm bias còn bagging giảm variance?
- Early stopping chống overfit trong boosting hoạt động thế nào?

## 📚 Nguồn
- StatQuest — "Gradient Boost" & "XGBoost".
- Tài liệu XGBoost / LightGBM / CatBoost.
