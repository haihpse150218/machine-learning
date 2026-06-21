# Cây quyết định (Decision Tree)

> Tóm tắt 1 câu: Một chuỗi câu hỏi **if/else** chia dữ liệu thành các nhánh nhỏ dần, tới khi mỗi nhóm đủ **"thuần"** (cùng nhãn) thì dừng và dự đoán — chọn câu hỏi nào dựa vào việc nó **giảm [[entropy]] nhiều nhất**.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh E (Thuật toán & Mô hình) · #1 ← cần [[entropy]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #thuat-toan #supervised #white-box

---

## 💡 Ý chính
- Giống chơi **"20 câu hỏi"** hoặc sơ đồ chẩn đoán: mỗi nút hỏi 1 đặc trưng → rẽ nhánh → hỏi tiếp → tới **lá** thì kết luận.
- Ví dụ: "Thu nhập > 10tr?" → có → "Đã có nhà?" → không → *cho vay*.
- Mục tiêu: chia sao cho mỗi nhánh càng **thuần** càng tốt (toàn 1 nhãn).

## ⚙️ Cách xây cây (training)
```
Tại mỗi nút:
1. Thử mọi đặc trưng + ngưỡng chia
2. Chọn cái làm GIẢM entropy nhiều nhất  → Information Gain = H(trước) − H(sau)
3. Chia dữ liệu theo cái đó
4. Lặp lại đệ quy cho từng nhánh
5. Dừng khi: nhánh thuần / hết đặc trưng / đạt điều kiện dừng (max_depth...)
```
- Đo độ "không thuần": **Entropy** ([[entropy]]) hoặc **Gini impurity** (nhẹ hơn, hay dùng mặc định).
- **Tham lam (greedy):** chọn tốt nhất **tại mỗi bước**, không tối ưu toàn cục.

## 🌲 Phân loại vs Hồi quy (CART)
| Loại cây | Dự đoán | Tiêu chí chia |
|----------|---------|---------------|
| **Classification** | nhãn (lớp) | entropy / gini |
| **Regression** | số liên tục | giảm phương sai / MSE ([[phuong-sai]]) |

## ✅ Điểm mạnh (vì sao đáng học đầu tiên)
- **Dễ hiểu, dễ giải thích (white-box):** vẽ ra được, nói được "vì sao model quyết định vậy" → hợp khi cần giải thích cho sếp/khách.
- **KHÔNG cần chuẩn hóa/scale** (chia theo ngưỡng, bất biến thang đo) → [[chuan-hoa-du-lieu]].
- Xử lý được **cả số lẫn phân loại**, ít nhạy outlier.
- Bắt được quan hệ **phi tuyến & tương tác** giữa các đặc trưng.

## ❌ Điểm yếu
- **Rất dễ [[overfitting]]:** cây sâu → học thuộc cả nhiễu của mẫu → tệ trên dữ liệu mới.
- **Không ổn định:** đổi chút dữ liệu → cây có thể khác hẳn.
- Greedy → không đảm bảo cây tối ưu nhất.

## 🛡️ Chống overfit
- **Cắt tỉa (pruning):** bỏ nhánh ít giá trị.
- Giới hạn: `max_depth`, `min_samples_leaf`, `min_samples_split`.
- ⭐ **Gộp nhiều cây (ensemble)** → mạnh & ổn định hơn hẳn:
  - **Random Forest** (nhiều cây ngẫu nhiên, lấy vote).
  - **Gradient Boosting / XGBoost** (cây nối tiếp sửa lỗi nhau).

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- Để cây mọc **không giới hạn** → overfit gần như chắc chắn.
- Tin **một cây đơn lẻ** cho bài toán khó → thường nên dùng Random Forest/XGBoost.
- Dữ liệu **mất cân bằng lớp** → cây thiên về lớp đa số (cần xử lý → [[lay-mau]]).

---

## 🔗 Liên kết
- **Tiền đề (cần biết trước):** [[entropy]] · [[phuong-sai]] (cây hồi quy)
- **Liên quan tới:** [[overfitting]] (pruning) · [[chuan-hoa-du-lieu]] (không cần scale)
- **Dẫn tới (học tiếp):** [[random-forest]] · [[xgboost]] · [[feature-engineering]]

## ❓ Câu hỏi mở
- Entropy vs Gini: khi nào chọn cái nào?
- Vì sao gộp nhiều cây (rừng) lại ổn định hơn một cây?

## 📚 Nguồn
- StatQuest — "Decision Trees" & "Random Forests".
- scikit-learn — `DecisionTreeClassifier`, `DecisionTreeRegressor`.
