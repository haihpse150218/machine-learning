# Máy vector hỗ trợ (SVM — Support Vector Machine)

> Tóm tắt 1 câu: SVM vẽ ranh giới phân tách 2 lớp sao cho **khe hở (margin) giữa hai lớp RỘNG NHẤT** — chọn đường "an toàn" nhất, cách đều điểm gần nhất của mỗi bên.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh E (Thuật toán) · #6 ← liên quan [[logistic-regression]] · [[toi-uu-loi]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #thuat-toan #supervised #phan-loai

---

## 💡 Ý chính
- Có nhiều đường tách được 2 lớp; SVM chọn đường có **lề (margin) rộng nhất** tới điểm gần nhất mỗi lớp → slide: *"tìm khe rộng nhất giữa các lớp"*.
- Lề rộng = "đệm an toàn" lớn → **tổng quát tốt hơn**, ít nhạy với điểm mới.

## 🧩 Các khái niệm
| Khái niệm | Nghĩa |
|-----------|-------|
| **Siêu phẳng (hyperplane)** | đường/mặt phân tách giữa các lớp |
| **Margin (lề)** | khoảng cách từ đường biên tới điểm gần nhất — SVM **tối đa hóa** nó |
| **Support vectors** | **vài điểm sát lề nhất** — chính chúng "đỡ" đường biên; điểm ở xa **không ảnh hưởng** |

> 💡 Chỉ một **số ít điểm (support vectors)** quyết định đường biên → SVM gọn, không bị cả đám dữ liệu chi phối.

## 🌀 Kernel trick — bắt quan hệ phi tuyến
- Dữ liệu **không tách được bằng đường thẳng**? → **kernel** "nâng" dữ liệu lên **chiều cao hơn**, nơi có thể tách bằng siêu phẳng.
- Kernel hay dùng: **RBF (Gaussian)**, **Polynomial**.
- → SVM **không chỉ tuyến tính** (khác [[logistic-regression]]): kernel cho phép ranh giới cong.

## ⚙️ Soft margin (tham số C)
- Dữ liệu thật thường lẫn lộn → cho phép **vài điểm nằm sai lề** để tránh overfit.
- **C lớn:** phạt nặng điểm sai → lề hẹp, dễ [[overfitting]]. **C nhỏ:** lề rộng, khoan dung hơn.

## ✅ Mạnh / ❌ Yếu
| ✅ Mạnh | ❌ Yếu |
|--------|-------|
| Tốt cho **dữ liệu nhỏ, nhiều chiều** (slide) | **Chậm** trên dữ liệu lớn |
| Kernel **bắt phi tuyến** mạnh | **PHẢI scale** đặc trưng → [[chuan-hoa-du-lieu]] |
| Loss **lồi** → nghiệm ổn định ([[toi-uu-loi]]) | Khó tinh chỉnh (kernel, C); kém giải thích |
| Hiệu quả khi ranh giới rõ | Không cho xác suất tự nhiên (cần hiệu chỉnh) |

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Quên scale đặc trưng** → SVM dựa trên khoảng cách nên hỏng nặng (lỗi phổ biến nhất).
- Dùng SVM cho **dữ liệu rất lớn** → train cực chậm (chọn cây/boosting thay thế).
- **Chọn kernel/C bừa** → over/underfit; nên dùng cross-validation.

---

## 🔗 Liên kết
- **So với:** [[logistic-regression]] (cũng vẽ ranh giới, nhưng SVM tối đa lề) · [[decision-tree]]
- **Tiền đề:** [[chuan-hoa-du-lieu]] (bắt buộc scale) · [[toi-uu-loi]] (loss lồi)
- **Liên quan:** [[pca]] (dữ liệu nhiều chiều) · [[chon-mo-hinh]]

## ❓ Câu hỏi mở
- Kernel trick "nâng chiều" hoạt động chính xác thế nào mà không tính tường minh?
- Khi nào SVM thắng Random Forest / XGBoost?

## 📚 Nguồn
- StatQuest — "Support Vector Machines".
- Slide môn học — TS. Cao Tiến Dũng.
