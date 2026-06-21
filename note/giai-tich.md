# Giải tích trong ML — Tại sao cần đạo hàm?

> Tóm tắt 1 câu: Học máy = **đi tìm hàm f** sao cho `y = f(x)`. Ta không giải f bằng công thức, mà **mò dần**: dùng **đạo hàm f'** để biết nên chỉnh f theo hướng nào cho bớt sai, rồi lặp lại.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh A (Giải tích → Tối ưu) · #1 → kế tiếp [[dao-ham]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #toan #giai-tich #nen-tang #intuition

---

## 💡 Ý chính
> Diễn đạt lại bằng lời của bạn — nếu giải thích được thì mới thật sự hiểu.

- **Bài toán gốc:** có dữ liệu `(x, y)`, nhiệm vụ là **tìm hàm `f`** sao cho `y = f(x)` — tức mô hình dự đoán đúng nhất.
- Không có công thức "giải thẳng" ra f. Thay vào đó ta **đoán f, đo độ sai, rồi chỉnh dần** cho tới khi sai ít nhất.
- **Đạo hàm `f'` là la bàn:** nó cho biết tại điểm hiện tại, chỉnh tham số theo hướng nào thì sai số **giảm nhanh nhất**.

## 🧩 Trực giác: "đi mò" (groping)
> Đúng mạch nghĩ: huấn luyện AI là một quá trình mò mẫm có định hướng.

```
1. Đứng ở một điểm (một bộ tham số của f)
2. Nhìn quanh: tính độ dốc (đạo hàm f') tại đó
3. Bước về hướng dốc xuống (làm sai số nhỏ lại)
4. Tới điểm mới → lại tính đạo hàm xung quanh
5. Lặp lại đến khi "phẳng" (đạo hàm ≈ 0) = đã chạm đáy
```

- Không nhìn thấy toàn cảnh "thung lũng sai số", chỉ cảm nhận **độ dốc ngay dưới chân** → đó là vai trò của đạo hàm.
- Đây chính là ý tưởng của [[gradient-descent]].

## 🔗 Mạch liên kết (đọc theo thứ tự)

```
y = f(x)           →   cần tìm f
   │
chỉnh f cho bớt sai →   cần biết "chỉnh hướng nào"
   │
ĐẠO HÀM f'         →   [[dao-ham]]  (cơ chế tính độ dốc)
   │
mò lặp theo độ dốc →   [[gradient-descent]]  (thuật toán thực thi)
```

## ⚙️ Khái niệm giải tích cần cho ML
| Khái niệm | Vai trò trong ML | Note |
|-----------|------------------|------|
| Hàm số `f(x)` | Chính là mô hình cần học | [[ham-so]] |
| Đạo hàm `f'` | Độ dốc → hướng chỉnh tham số | [[dao-ham]] |
| Đạo hàm riêng `∂` | Khi f có nhiều tham số (gradient) | [[dao-ham-rieng]] |
| Chain rule | Lan truyền đạo hàm qua nhiều lớp | [[chain-rule]] |
| Cực trị (f' = 0) | Điểm sai số nhỏ nhất | — |

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- "Tìm f" **không phải** tìm một công thức đẹp — mà là tìm **bộ tham số** (số) làm f khớp dữ liệu nhất.
- Đạo hàm ≈ 0 chỉ nghĩa "đang ở chỗ phẳng": có thể là đáy thật, đáy cục bộ, hoặc điểm yên ngựa.
- Ta đo độ dốc của **hàm sai số (loss)** theo tham số, không phải độ dốc của f theo x.

---

## 🔗 Liên kết
- **Liên quan tới:** [[loss-function]] · [[toi-uu-hoa]]
- **Tiền đề (cần biết trước):** [[ham-so]]
- **Dẫn tới (học tiếp):** [[dao-ham]] · [[gradient-descent]]

## ❓ Câu hỏi mở
- Vì sao đi theo hướng ngược gradient lại là hướng giảm nhanh nhất?
- Khi f có hàng triệu tham số (deep learning), "đi mò" này còn hiệu quả không? Vì sao?

## 📚 Nguồn
- 3Blue1Brown — "Essence of Calculus" & "Neural networks" series.
- Andrew Ng — Machine Learning (Coursera).
