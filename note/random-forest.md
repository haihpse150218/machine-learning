# Rừng ngẫu nhiên (Random Forest)

> Tóm tắt 1 câu: Xây **nhiều cây quyết định**, mỗi cây học từ một **mẫu dữ liệu + tập đặc trưng ngẫu nhiên khác nhau** (nên mỗi cây "nhìn" dữ liệu một góc khác), rồi **gom ý kiến** (vote / trung bình) → ổn định & ít overfit hơn hẳn một cây.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh E (Thuật toán) · #4 ← cần [[decision-tree]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #thuat-toan #ensemble #supervised

---

## 💡 Ý chính (chỉnh nhẹ trực giác của bạn)
- Đúng phần **"gom ý kiến lại"**: nhiều cây cùng bỏ phiếu → kết quả chung.
- Chỉnh nhẹ "mỗi cây take care 1 vùng": thực ra **mỗi cây thấy một MẪU ngẫu nhiên** của dữ liệu + **tập đặc trưng ngẫu nhiên** — không chia vùng cố định, mà mỗi cây có **góc nhìn khác nhau** → các cây **đa dạng**.
- Đa dạng + bỏ phiếu = **triệt tiêu lỗi ngẫu nhiên** của từng cây → "trí tuệ đám đông".

## ⚙️ 2 nguồn "ngẫu nhiên" (vì sao tên Random)
```
1. Bagging (Bootstrap): mỗi cây train trên 1 mẫu lấy-có-hoàn-lại từ dữ liệu  → [[lay-mau]]
2. Feature randomness: mỗi lần chia nút, chỉ xét MỘT TẬP CON ngẫu nhiên các đặc trưng
→ các cây khác nhau, không "giống hệt nhau"
```

## 🗳️ Gom ý kiến (aggregation)
| Bài toán | Cách gộp |
|----------|----------|
| **Phân loại** | **Bỏ phiếu đa số** (cây nào nhiều phiếu hơn) |
| **Hồi quy** | **Trung bình** dự đoán các cây |

## 🎯 Vì sao mạnh hơn 1 cây?
- Một cây đơn lẻ **dễ overfit** (variance cao, không ổn định — xem [[decision-tree]]).
- Gộp nhiều cây đa dạng → **trung bình hóa làm giảm variance** → ổn định, ít [[overfitting]] hơn nhiều.
- Slide mô tả: *"100 cây quyết định cùng bỏ phiếu"* → **đa dụng, kháng nhiễu tốt**.

## ✅ Mạnh / ❌ Yếu
| ✅ Mạnh | ❌ Yếu |
|--------|-------|
| Đa dụng, **kháng nhiễu & overfit tốt** | Chậm hơn 1 cây (train + dự đoán) |
| **Không cần scale** ([[chuan-hoa-du-lieu]]) | **Mất tính giải thích** (khó vẽ như 1 cây) |
| Cho **độ quan trọng đặc trưng** (feature importance) | Model nặng (nhiều cây) |
| Ít cần tinh chỉnh, baseline rất tốt cho dữ liệu bảng | |

## 🆚 Random Forest vs XGBoost
- **Random Forest = Bagging:** các cây **độc lập, song song**, rồi vote.
- **XGBoost = Boosting:** các cây **nối tiếp**, cây sau **sửa lỗi** cây trước → [[xgboost]].

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Tưởng mỗi cây chia một vùng dữ liệu cố định** → thực ra là mẫu + đặc trưng ngẫu nhiên.
- **Tin cây đơn lẻ giải thích được = cả rừng giải thích được** → rừng khó giải thích hơn nhiều (dùng feature importance / SHAP thay thế).
- Dữ liệu **mất cân bằng lớp** vẫn lệch → cần xử lý ([[lay-mau]]).

---

## 🔗 Liên kết
- **Tiền đề:** [[decision-tree]] · [[entropy]]
- **Liên quan:** [[overfitting]] (giảm variance) · [[lay-mau]] (bootstrap) · [[xgboost]] (boosting)
- **Thuộc:** [[phan-loai-hoc-may]] · [[chon-mo-hinh]]

## ❓ Câu hỏi mở
- Vì sao "feature randomness" lại giúp các cây đa dạng hơn (so với chỉ bagging)?
- Bao nhiêu cây là đủ? Thêm cây có hại không?

## 📚 Nguồn
- StatQuest — "Random Forests".
- Slide môn học — TS. Cao Tiến Dũng.
