# Phân phối Gauss & Nhị thức (2 phân phối chủ lực)

> Tóm tắt 1 câu: **Gauss (chuẩn)** mô tả dữ liệu liên tục hình chuông → dùng để **chuẩn hóa đặc trưng**; **Nhị thức** đếm số lần "thành công" trong n phép thử có/không → dùng để **test A/B**.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh C (Xác suất → Thống kê) · mở rộng của [[phan-phoi-xac-suat]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #toan #xac-suat #data #ab-testing #chuan-hoa

---

## 🔔 1. Phân phối Gauss (Chuẩn / Normal) — liên tục

### Ý chính
- Hình **chuông đối xứng**, xác định bởi 2 số: **μ** (trung bình = tâm chuông) và **σ** (độ lệch chuẩn = chuông rộng/hẹp).
- **Vì sao gặp khắp nơi:** Định lý giới hạn trung tâm (CLT) — tổng/trung bình của nhiều yếu tố ngẫu nhiên có xu hướng tiến về phân phối chuẩn (chiều cao, sai số đo...).

```
f(x) = (1 / (σ√(2π))) · e^( −(x − μ)² / (2σ²) )

Quy tắc 68–95–99.7: ~68% dữ liệu trong μ±1σ, ~95% trong μ±2σ, ~99.7% trong μ±3σ
```

### ⚙️ Ứng dụng: chuẩn hóa đặc trưng (z-score)
> Đúng mạch nghĩ của bạn: Gauss → chuẩn hóa đặc trưng.

```
z = (x − μ) / σ      → đưa cột về trung bình 0, độ lệch chuẩn 1
```

- Vì sao cần: nhiều thuật toán **giả định hoặc chạy tốt hơn** khi đặc trưng cùng thang đo, gần chuẩn:
  - [[gradient-descent]] hội tụ nhanh hơn (không zig-zag).
  - [[pca]] và các model dựa trên khoảng cách (KNN, SVM) bị "cột thang đo lớn lấn át" nếu không chuẩn hóa.
- Cột **lệch nặng (skewed)** → nên log-transform **trước**, rồi mới z-score. → [[chuan-hoa-du-lieu]]

---

## 🪙 2. Phân phối Nhị thức (Binomial) — rời rạc

### Ý chính
- Đếm **số lần thành công** trong **n phép thử độc lập**, mỗi lần xác suất thành công = **p** (kiểu **tung đồng xu n lần**).
- 1 phép thử (n=1) = phân phối **Bernoulli** (có/không, 0/1).

```
P(k thành công) = C(n, k) · pᵏ · (1−p)ⁿ⁻ᵏ
```
> C(n,k) = số cách chọn k trong n. Trung bình = n·p.

### ⚙️ Ứng dụng: A/B testing
> Đúng mạch nghĩ của bạn: Nhị thức → test A/B.

- Mỗi người dùng **chuyển đổi hay không** (mua / bấm) = 1 phép thử Bernoulli.
- Tổng số chuyển đổi trong N người = biến **Nhị thức**.
- **A/B test:** so tỉ lệ chuyển đổi bản A vs bản B → hỏi *"chênh lệch này là thật hay chỉ do may rủi?"*
  - Dùng kiểm định giả thuyết trên phân phối nhị thức (hoặc xấp xỉ chuẩn khi N lớn) → ra **p-value**.
  - Nối sang [[thong-ke]] (hypothesis testing).

---

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Chuẩn hóa rồi mới chia train/test sai cách:** phải tính μ, σ **trên tập train**, rồi áp lên test (tránh rò rỉ dữ liệu — data leakage).
- Giả định dữ liệu là Gauss khi nó lệch → z-score không cứu được; phải biến đổi phân phối trước.
- A/B test **dừng sớm khi thấy "thắng"** → kết luận sai (peeking); cần cỡ mẫu & mức ý nghĩa định trước.
- Nhị thức cần các phép thử **độc lập & cùng p** — vi phạm thì kết quả lệch.

---

## 🔗 Liên kết
- **Tiền đề (cần biết trước):** [[phan-phoi-xac-suat]] · [[phuong-sai]]
- **Liên quan tới:** [[chuan-hoa-du-lieu]] · [[thong-ke]]
- **Dẫn tới (học tiếp):** [[kiem-dinh-gia-thuyet]] · [[p-value]]

## ❓ Câu hỏi mở
- Khi nào xấp xỉ nhị thức bằng phân phối chuẩn được (n lớn cỡ nào)?
- A/B test cần bao nhiêu mẫu để tin được kết quả? (power analysis)

## 📚 Nguồn
- StatQuest — "The Normal Distribution" & "The Binomial Distribution".
- Khan Academy — Normal & Binomial distributions.
