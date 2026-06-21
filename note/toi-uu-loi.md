# Tối ưu lồi (Convex Optimization)

> Tóm tắt 1 câu: **Hàm lồi** (hình cái bát) chỉ có **MỘT đáy** → cực tiểu cục bộ = cực tiểu toàn cục → gradient descent luôn về đúng đáy đó, **train bao nhiêu lần cũng ra kết quả như nhau**.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh A (Tối ưu) ← liên quan [[gradient-descent]] · [[loss-function]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #toan #toi-uu-hoa #convex
**Nguồn slide:** `L1_Math_Overview.pdf` slide 50 — TS. Cao Tiến Dũng

---

## 💡 Ý chính
- **Hàm lồi (convex):** đoạn thẳng nối **2 điểm bất kỳ** trên đồ thị **luôn nằm phía trên** đồ thị → hình **cái bát**.
- Hệ quả vàng: **chỉ có 1 đáy** → **cực tiểu cục bộ = cực tiểu toàn cục**.
- → Gradient descent ([[gradient-descent]]) **chắc chắn** tìm được đáy thật, **không kẹt** local minimum.

## 🔁 Tính tái lập (insight của bạn — rất đúng)
| | Loss LỒI (convex) | Loss KHÔNG lồi (non-convex) |
|---|---|---|
| Số đáy | **1** (toàn cục) | **nhiều** đáy cục bộ + điểm yên ngựa |
| Gradient descent | luôn về cùng 1 đáy, **bất kể điểm xuất phát** | về đáy nào **tùy điểm khởi tạo ngẫu nhiên** |
| **Train 10 lần** | kết quả **GIỐNG NHAU** (ổn định, tái lập) | kết quả **KHÁC NHAU** (không đoán trước) |

- **Lồi** → yên tâm, 1 lần train là đủ, ai chạy cũng ra như nhau.
- **Không lồi** → mỗi lần khởi tạo khác → đáy khác → cần **set random seed** để tái lập, hoặc train nhiều lần lấy tốt nhất.

## 🧩 Làm rõ thuật ngữ "lõm"
- Đối lập thực sự của "lồi" trong ML là **"không lồi" (non-convex)** — bề mặt **gồ ghề, nhiều đáy** (như đồi núi).
- "Lõm (concave)" đúng nghĩa toán = cái **vòm úp ngược** (∩) → không có đáy để cực tiểu. Cái ta thật sự nói tới khi train là **non-convex**.
- Bề mặt loss của **mạng nơ-ron** là non-convex điển hình (nhiều đáy + yên ngựa).

## ⚙️ Mô hình nào lồi / không lồi?
| Lồi (dễ tối ưu, tái lập) | Không lồi (khó, ngẫu nhiên) |
|--------------------------|------------------------------|
| Hồi quy tuyến tính (MSE) | Mạng nơ-ron / Deep Learning |
| Hồi quy logistic | nhiều mô hình phức tạp |
| SVM | |

> Vì sao SVM/hồi quy "đáng tin": loss lồi → nghiệm duy nhất, không phụ thuộc may rủi khởi tạo.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- Tưởng mọi loss đều lồi → thực ra deep learning **không lồi**, nên 2 lần train ra model khác nhau là **bình thường**.
- Không set seed khi báo cáo kết quả non-convex → người khác **không tái lập** được.
- Nhầm "non-convex" với "lõm (concave)" — xem mục trên.

---

## 🔗 Liên kết
- **Liên quan tới:** [[gradient-descent]] (local vs global minimum) · [[loss-function]]
- **Tiền đề:** [[dao-ham]] · [[gradient]]

## ❓ Câu hỏi mở
- Vì sao deep learning vẫn hoạt động tốt dù loss không lồi (nhiều đáy)?
- Làm sao "thoát" local minimum khi loss không lồi? (SGD nhiễu, momentum, nhiều khởi tạo)

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (slide 50).
- Boyd & Vandenberghe — Convex Optimization.
