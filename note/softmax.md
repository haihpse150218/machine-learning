# Softmax & Phân loại đa lớp (Multiclass Classification)

> Tóm tắt 1 câu: Khi có **>2 lớp**, ta cần biến K con số thô (logits) thành **K xác suất cộng lại = 1** rồi chọn lớp cao nhất — đó là việc của hàm **Softmax**. Là phần mở rộng đa lớp của [[logistic-regression]].

**Ngày tạo:** 2026-06-21
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh E (Thuật toán) · #3b ← cần [[logistic-regression]] · [[entropy]] · → dùng lại trong [[deep-learning]] (lớp output)
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #thuat-toan #supervised #phan-loai #da-lop
**Nguồn slide:** `L4_LogisticsReg.pdf` Phần 03 — TS. Cao Tiến Dũng

---

## 💡 Ý chính
> ✍️ **Lời của mình:** *Sigmoid trả 1 xác suất cho bài 2 lớp. Khi có nhiều lớp (A/B/C…), mỗi lớp có 1 bộ trọng số riêng → ra K điểm số `z`. Softmax dùng `e^z` (luôn dương) rồi **chia cho tổng** để chuẩn hóa thành K xác suất cộng lại đúng = 1. Lớp nào xác suất cao nhất thì chọn.*

- **Softmax = hồi quy Logistic đa thức (multinomial).** Khi **K = 2, softmax suy biến về sigmoid**.
- Mỗi lớp có **một bộ trọng số riêng**; toàn bộ huấn luyện **đồng thời (joint)** trên K lớp.

## 🔢 Công thức Softmax
```
σ(z)ᵢ = e^(zᵢ) / Σⱼ e^(zⱼ)        (i = 1 … K)

Ví dụ logits z = [2.0, 1.0, 0.1]  → softmax ≈ [0.66, 0.24, 0.10]   (tổng = 1)
                  Lớp A  B    C        chọn Lớp A (cao nhất)
```
- Nhận véc-tơ **K logits** → **phân phối xác suất** gồm K xác suất, **tổng = 1**.
- `e^z` đảm bảo **dương** và **phóng đại** khoảng cách → lớp trội càng nổi bật.

## ⚙️ Luồng bộ phân loại đa lớp
```
Mô hình tuyến tính (z = Wx+b) → SOFTMAX S(z) → Cross-Entropy D(S, L) → nhãn One-Hot L
```
- Đầu ra **K xác suất** → so với **nhãn one-hot** (vd lớp B = [0,1,0]) bằng hàm **Cross-Entropy** ([[entropy]]) → cập nhật trọng số bằng [[gradient-descent]].
- **One-hot:** biến nhãn lớp thành véc-tơ 0/1 (1 ở đúng lớp) — khác encode ordinal, xem [[encode-categorical]].

## 🆚 One-vs-Rest (OvR) vs Softmax
| | **One-vs-Rest (OvR)** | **Softmax (Multinomial)** |
|---|---|---|
| Cách làm | Huấn luyện **K bộ nhị phân** "lớp i vs phần còn lại" | **MỘT** mô hình, tối ưu chung trên K lớp |
| Chọn lớp | Lớp có xác suất cao nhất | Lớp có xác suất cao nhất |
| Xác suất | Mỗi bộ riêng → **tổng ≠ 1** | **Nhất quán** (tổng = 1) |
| Ưu | Đơn giản, **dùng được với mọi** bộ phân loại nhị phân | Thường **chính xác hơn** cho bài **loại trừ lẫn nhau** |

> 💡 Lớp **loại trừ lẫn nhau** (mỗi mẫu đúng 1 lớp) → ưu tiên **Softmax**. Lớp **chồng nhau / đa nhãn** (một mẫu nhiều nhãn) → dùng kiểu OvR với sigmoid riêng từng lớp.

## ⚙️ Khi nào dùng / Ứng dụng
- Phân loại ảnh chữ số (0–9), phân loại văn bản nhiều chủ đề, nhận dạng loài hoa…
- 🔁 **Softmax là lớp output chuẩn của mạng nơ-ron phân loại** → nối thẳng [[deep-learning]].

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Dùng softmax cho bài đa nhãn** (một mẫu có thể thuộc nhiều lớp) → sai; softmax ép tổng = 1 (loại trừ). Đa nhãn → sigmoid từng lớp.
- **Quên one-hot nhãn** trước khi tính cross-entropy.
- Nhầm "K xác suất softmax" với "độ tin cậy thật" — chúng chỉ là tỉ lệ tương đối giữa các lớp.

---

## 🔗 Liên kết
- **Tiền đề:** [[logistic-regression]] (sigmoid → mở rộng) · [[entropy]] (cross-entropy) · [[gradient-descent]]
- **Liên quan:** [[encode-categorical]] (one-hot) · [[danh-gia-mo-hinh]] (đo phân loại đa lớp)
- **Dẫn tới:** [[deep-learning]] (softmax = lớp output)

## ❓ Câu hỏi mở
- Cross-entropy đa lớp tính cụ thể thế nào với nhãn one-hot?
- Vì sao softmax phóng đại bằng e^z mà không chuẩn hóa tuyến tính (chia tổng thẳng)?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L4_LogisticsReg.pdf` Phần 03).
