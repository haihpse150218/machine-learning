# Gradient & Đạo hàm riêng (nhiều chiều)

> Tóm tắt 1 câu: Khi hàm có **N tham số**, mỗi trục có một **đạo hàm riêng** (độ dốc theo trục đó); gom tất cả lại thành vector **gradient ∇f** — vector này vừa chỉ **hướng dốc nhất**, vừa cho biết **bước đi trên từng trục**.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh A (Giải tích → Tối ưu) · #3 ← cần [[dao-ham]] · → kế tiếp [[gradient-descent]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #toan #giai-tich #toi-uu-hoa #nhieu-chieu

---

## 💡 Ý chính
> Diễn đạt lại bằng lời của bạn — nếu giải thích được thì mới thật sự hiểu.

- **1 chiều:** hàm `f(x)` chỉ có **một** độ dốc `f'(x)` — một con số.
- **N chiều:** hàm `f(x₁, x₂, ..., xₙ)` (mô hình thật có hàng nghìn–triệu tham số) không còn một độ dốc duy nhất.
- **Đạo hàm riêng `∂f/∂xᵢ`:** giữ mọi trục khác **cố định**, chỉ hỏi "nếu nhúc nhích riêng trục `xᵢ` thì sai số đổi bao nhiêu?" → độ dốc **theo trục đó**.
- **Gradient `∇f`:** xếp tất cả đạo hàm riêng thành một vector.

## 🔢 Công thức / Định nghĩa

```
∇f = ( ∂f/∂x₁ ,  ∂f/∂x₂ ,  ... ,  ∂f/∂xₙ )
```

| Thành phần | Ý nghĩa |
|------------|---------|
| `∂f/∂xᵢ` | Độ dốc theo trục `xᵢ` (đạo hàm riêng) — **bước cần đi trên trục đó** |
| vector `∇f` (toàn bộ) | **Hướng** sai số tăng nhanh nhất |
| `−∇f` | Hướng sai số **giảm** nhanh nhất → hướng ta muốn đi |

**Cập nhật tham số (gradient descent N chiều):**
```
θᵢ ← θᵢ − η · ∂f/∂xᵢ      (cho mọi trục i)
⇔  θ  ← θ  − η · ∇f         (viết gọn dạng vector)
```

## 🧩 Trực giác & làm rõ thứ tự
> Mạch nghĩ "có hướng đi → rồi tính step từng trục" gần đúng, nhưng thứ tự thực ra là:

```
Tính đạo hàm riêng TỪNG trục:  ∂f/∂x₁, ∂f/∂x₂, ...
        │  (ghép lại)
        ▼
Gradient ∇f  =  vector các đạo hàm riêng đó
        │
        ├──►  HƯỚNG đi   = hướng của ∇f (đi ngược: −∇f)
        └──►  STEP mỗi trục = từng thành phần ∂f/∂xᵢ (× η)
```

- Không phải "đạo hàm chung trước, rồi mới đạo hàm riêng sau". **Đạo hàm riêng chính là nguyên liệu tạo ra gradient.**
- Một lần tính gradient → có **cả hướng lẫn độ lớn bước** cho mọi trục cùng lúc.
- Ẩn dụ: đứng trên đồi N chiều, bạn lần lượt thử nghiêng theo từng trục để đo dốc; ghép các kết quả lại → biết hướng dốc nhất và đi bao xa mỗi trục.

## ⚙️ Khi nào dùng / Ứng dụng trong ML
- Là dạng tổng quát của [[dao-ham]] dùng trong [[gradient-descent]] thực tế (mô hình luôn nhiều tham số).
- **Backpropagation** = cách tính gradient hiệu quả qua nhiều lớp mạng nơ-ron (nhờ [[chain-rule]]).

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- Gradient là **vector**, không phải số. Mỗi tham số có một thành phần riêng.
- `∂f/∂xᵢ` lớn → trục đó ảnh hưởng mạnh tới sai số → bước theo trục đó nhiều hơn (đúng tỉ lệ).
- Hướng `−∇f` là dốc nhất **cục bộ** (ngay tại điểm hiện tại), không đảm bảo đường thẳng tới đáy toàn cục.
- Cần **feature scaling**: nếu các trục khác thang đo, gradient lệch → đường hội tụ zig-zag.

---

## 🔗 Liên kết
- **Liên quan tới:** [[dao-ham-rieng]] · [[backpropagation]]
- **Tiền đề (cần biết trước):** [[dao-ham]]
- **Dẫn tới (học tiếp):** [[gradient-descent]] · [[chain-rule]]

## ❓ Câu hỏi mở
- Vì sao hướng `−∇f` lại là hướng giảm nhanh **nhất** (chứ không phải một hướng giảm bất kỳ)?
- Với hàng triệu tham số, tính toàn bộ gradient mỗi bước có tốn không? (→ SGD, mini-batch)

## 📚 Nguồn
- 3Blue1Brown — "Gradient descent" & "Backpropagation calculus".
- Khan Academy — Partial derivatives & gradient.
