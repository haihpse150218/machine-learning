# Feature Engineering — Tạo đặc trưng tốt

> Tóm tắt 1 câu: Biến dữ liệu thô thành **đặc trưng (feature) mang nhiều tín hiệu** để model học dễ hơn. Câu thần chú: **"đặc trưng tốt > thuật toán phức tạp"** — đây là nơi đưa **hiểu biết về bài toán (domain knowledge)** vào dữ liệu.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟢 Trọng tâm (Lớp LÀM)
**📖 Lộ trình:** Nhánh D (Xử lý dữ liệu) · #2 ← cần [[xu-ly-du-lieu]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #data #feature #lop-lam #core

---

## 💡 Ý chính
> Diễn đạt lại bằng lời của bạn — nếu giải thích được thì mới thật sự hiểu.

- Model học từ **đặc trưng**, không từ dữ liệu thô. Đặc trưng nghèo tín hiệu → model dù mạnh cũng bó tay.
- **Feature engineering = giúp model "nhìn" thấy điều quan trọng** mà nó không tự suy ra được.
- Ví dụ: cho ngày sinh + ngày mua → model khó dùng; nhưng tạo "tuổi lúc mua" → tín hiệu rõ ngay.

## 🛠️ Các kỹ thuật chính

| Kỹ thuật | Ví dụ |
|----------|-------|
| **Tạo từ cái có sẵn** | ngày sinh → tuổi; giá + diện tích → giá/m² |
| **Tách (split)** | datetime → năm/tháng/thứ/giờ; địa chỉ → tỉnh/quận |
| **Cuối tuần? Ngày lễ?** | từ ngày → cờ 0/1 (mua cuối tuần khác ngày thường) |
| **Tỉ lệ / hiệu / tổng** | thu nhập/chi tiêu; nợ/tài sản |
| **Tương tác (interaction)** | nhân 2 đặc trưng để bắt quan hệ kết hợp |
| **Binning (chia nhóm)** | tuổi → "trẻ/trung niên/già" |
| **Biến đổi toán** | log/sqrt cho cột lệch ([[phan-phoi-xac-suat]]) |
| **Gộp nhóm (aggregation)** | mỗi user → số đơn TB, tổng chi 30 ngày |
| **Encode phân loại** | one-hot, label, target encoding → [[encode-categorical]] |
| **Text → số** | bag-of-words, TF-IDF, embeddings |

## 🎯 Domain knowledge = vũ khí
- Hiểu **ngành/bài toán** → biết đặc trưng nào quan trọng.
  - Bán lẻ: "số ngày từ lần mua gần nhất" (recency) cực mạnh để dự đoán rời bỏ.
  - Tín dụng: tỉ lệ "nợ / thu nhập" quan trọng hơn từng con số riêng.
- Đây là phần **AI chưa tự làm tốt** → nơi con người tạo giá trị (đúng [[dinh-huong-hoc]]).

## ✂️ Feature engineering vs Feature selection
| | Feature **engineering** | Feature **selection** |
|---|---|---|
| Làm gì | **Tạo** đặc trưng mới | **Chọn/bỏ** đặc trưng có sẵn |
| Mục tiêu | Thêm tín hiệu | Bỏ nhiễu/dư thừa, gọn model |
| Cách | các kỹ thuật ở trên | tương quan ([[tuong-quan]]), độ quan trọng, [[pca]] (giảm chiều) |

> Lưu ý: [[pca]] tạo đặc trưng **mới** (tổ hợp) chứ không chọn đặc trưng gốc — khó diễn giải hơn.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Data leakage (nguy hiểm nhất):**
  - *Target encoding* / thống kê tính trên **cả tập** → rò nhãn vào đặc trưng. Phải tính **trong train** (hoặc trong fold cross-validation).
  - Dùng **thông tin tương lai** mà lúc dự đoán thật chưa có (vd: "tổng chi cả năm" để dự đoán giữa năm).
- **Tạo quá nhiều đặc trưng** → model học thuộc nhiễu → [[overfitting]]. Thêm có chọn lọc.
- **Quên áp cùng phép biến đổi lên tập test** (phải dùng pipeline nhất quán).
- Đặc trưng vô nghĩa với bài toán → chỉ làm loãng, tốn tài nguyên.

---

## 🔗 Liên kết
- **Tiền đề (cần biết trước):** [[xu-ly-du-lieu]]
- **Liên quan tới:** [[encode-categorical]] · [[chuan-hoa-du-lieu]] · [[pca]] · [[tuong-quan]]
- **Cảnh báo:** [[overfitting]] (quá nhiều đặc trưng / leakage)

## ❓ Câu hỏi mở
- Khi nào nên tự tạo đặc trưng vs để model phức tạp (deep learning) tự học đặc trưng?
- Làm sao đo một đặc trưng mới có thật sự giúp ích (không chỉ tăng điểm train)?

## 📚 Nguồn
- "Feature Engineering for Machine Learning" — Alice Zheng.
- Kaggle — các notebook feature engineering thắng giải.
