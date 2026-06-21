# Đạo hàm (Derivative)

> Tóm tắt 1 câu: Đạo hàm đo **tốc độ thay đổi** của một hàm số tại một điểm — tức là hàm tăng/giảm nhanh hay chậm khi ta nhích đầu vào lên một chút.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh A (Giải tích → Tối ưu) · #2 ← cần [[giai-tich]] · → kế tiếp [[gradient]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #toan #giai-tich #nen-tang

---

## 💡 Ý chính
> Diễn đạt lại bằng lời của bạn — nếu giải thích được thì mới thật sự hiểu.

- Đạo hàm tại một điểm = **độ dốc** của đường tiếp tuyến với đồ thị tại điểm đó.
- Dấu của đạo hàm cho biết chiều: **dương** → hàm đang đi lên; **âm** → đang đi xuống; **bằng 0** → đỉnh, đáy hoặc điểm yên ngựa (chỗ phẳng).
- Độ lớn cho biết mức độ: |đạo hàm| càng lớn → hàm thay đổi càng dốc.

## 🧩 Trực giác / Ví dụ
> Một ví dụ cụ thể, hình ảnh ẩn dụ, hoặc trường hợp thực tế.

- **Ẩn dụ vận tốc:** Nếu hàm là *quãng đường theo thời gian*, thì đạo hàm chính là *vận tốc* — quãng đường thay đổi nhanh thế nào theo từng giây.
- **Ví dụ số:** Với $f(x) = x^2$, đạo hàm $f'(x) = 2x$.
  - Tại $x = 3 \Rightarrow f'(3) = 6$ → đồ thị đang dốc lên mạnh.
  - Tại $x = 0 \Rightarrow f'(0) = 0$ → điểm đáy, mặt phẳng.
  - Tại $x = -3 \Rightarrow f'(-3) = -6$ → đang dốc xuống.

## 🔢 Công thức / Định nghĩa
> Định nghĩa giới hạn + vài quy tắc hay dùng.

$$f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}$$

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $f'(x),\ \dfrac{df}{dx}$ | Đạo hàm của f theo x |
| $h$ | Một lượng nhích nhỏ của đầu vào (tiến tới 0) |
| $f(x+h) - f(x)$ | Mức thay đổi của đầu ra |

**Quy tắc thường dùng:**

| Hàm $f(x)$ | Đạo hàm $f'(x)$ |
|----------|---------------|
| $x^n$ | $n \cdot x^{n-1}$ |
| hằng số $c$ | $0$ |
| $e^x$ | $e^x$ |
| $\ln(x)$ | $\dfrac{1}{x}$ |
| $c \cdot f(x)$ | $c \cdot f'(x)$ |
| $f(x) + g(x)$ | $f'(x) + g'(x)$ |

## ⚙️ Khi nào dùng / Ứng dụng trong ML
- Là **viên gạch nền** của [[gradient-descent]]: gradient chính là tập hợp các đạo hàm riêng (partial derivatives) của hàm mất mát theo từng tham số.
- Dùng trong **backpropagation** để lan truyền sai số ngược qua mạng nơ-ron (nhờ chain rule).
- Giúp tìm điểm cực trị (tối ưu): nơi đạo hàm = 0.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- Đạo hàm = 0 **không chắc** là cực tiểu — có thể là cực đại hoặc điểm yên ngựa (saddle point).
- Nhầm **giá trị hàm** với **đạo hàm**: f(x) là độ cao, f'(x) là độ dốc — hai thứ khác nhau.
- Trong ML nhiều biến, phải dùng **đạo hàm riêng** (∂) cho từng biến, không phải đạo hàm thường.

---

## 🔗 Liên kết
- **Liên quan tới:** [[dao-ham-rieng]] · [[chain-rule]]
- **Tiền đề (cần biết trước):** [[ham-so]] · [[gioi-han]]
- **Dẫn tới (học tiếp):** [[gradient-descent]] · [[gradient]] · [[backpropagation]]

## ❓ Câu hỏi mở
- Chain rule hoạt động chính xác thế nào khi có nhiều lớp lồng nhau (như mạng nơ-ron)?
- Khác biệt giữa đạo hàm thường, đạo hàm riêng và gradient là gì?

## 📚 Nguồn
- 3Blue1Brown — "Essence of Calculus" (YouTube), chương về đạo hàm.
- Khan Academy — Derivatives.
