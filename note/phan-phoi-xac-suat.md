# Biến ngẫu nhiên & Phân phối xác suất

> Tóm tắt 1 câu: **Biến ngẫu nhiên** là một đại lượng nhận giá trị do ngẫu nhiên; **phân phối** mô tả các giá trị đó xuất hiện với khả năng bao nhiêu. Trong ML, **mỗi cột dữ liệu là một biến ngẫu nhiên** — hiểu phân phối của nó mới xử lý & sinh dữ liệu cho đúng.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh C (Xác suất → Thống kê) · #2 ← cần [[xac-suat]] · → kế tiếp [[ky-vong-trung-binh]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #toan #xac-suat #data #bat-buoc

---

## 💡 Ý chính
> Diễn đạt lại bằng lời của bạn — nếu giải thích được thì mới thật sự hiểu.

- **Biến ngẫu nhiên (random variable):** một biến mà giá trị của nó đến từ kết quả ngẫu nhiên. Ví dụ X = "số chấm khi tung xúc xắc", hay X = "chiều cao một người lấy ngẫu nhiên".
- **Phân phối xác suất (distribution):** bảng/đường cong cho biết mỗi giá trị của X xuất hiện với **khả năng bao nhiêu**. Nó vẽ ra "hình dạng" của dữ liệu.
- **Liên hệ ML (cốt lõi):** mỗi **cột dữ liệu** = một biến ngẫu nhiên. Cột "tuổi", cột "lương"... mỗi cột có một phân phối riêng.

## 🧩 Hai loại biến
| Loại | Giá trị | Mô tả bằng | Ví dụ |
|------|---------|-----------|-------|
| **Rời rạc** (discrete) | đếm được | PMF — xác suất từng giá trị | số con, mặt xúc xắc, nhãn lớp |
| **Liên tục** (continuous) | vô số trên một khoảng | PDF — mật độ, tính xác suất theo vùng | chiều cao, lương, nhiệt độ |

> Với biến liên tục, `P(X = đúng 1.70m) = 0`; chỉ hỏi được `P(1.6 ≤ X ≤ 1.8)` = **diện tích** dưới đường cong.

**Phân biệt nhanh (đúng mạch nghĩ):**
- **Rời rạc = kiểu tung đồng xu / xúc xắc** → liệt kê được từng kết quả và xác suất của nó (mặt sấp 0.5, mặt ngửa 0.5).
- **Liên tục = mô tả bằng phương trình (hàm)** → không liệt kê được, phải dùng **công thức mật độ (PDF)**. Ví dụ phân phối chuẩn có phương trình:

```
f(x) = (1 / (σ√(2π))) · e^( −(x − μ)² / (2σ²) )      (đường cong chuông)
```
> μ = trung bình (tâm chuông), σ = độ lệch chuẩn (chuông rộng/hẹp).

## 📊 Vài phân phối hay gặp
| Phân phối | Hình dạng | Dùng cho |
|-----------|-----------|----------|
| **Chuẩn (Normal/Gaussian)** | chuông đối xứng | rất nhiều dữ liệu tự nhiên; nhiều model giả định cái này |
| Đều (Uniform) | phẳng | mọi giá trị khả năng như nhau |
| Bernoulli / Nhị thức | 0/1, đếm thành công | bài toán có/không, phân loại nhị phân |
| Poisson | đếm sự kiện hiếm | số lượt truy cập/giờ |
| Lệch (skewed) | đuôi dài 1 bên | lương, giá nhà → thường cần biến đổi log |

## ⚙️ Vì sao "hiểu phân phối mới xử lý được dữ liệu"
> Đúng mạch nghĩ của bạn: hiểu từng cột phân phối ra sao → xử lý & lấy ngẫu nhiên cho đúng.

- **Chuẩn hóa đúng cách:** nhiều kỹ thuật giả định gần chuẩn (Gaussian). Cột lệch (skewed) → nên **log-transform** trước, không thì model học lệch. → [[chuan-hoa-du-lieu]]
- **Sinh / lấy mẫu ngẫu nhiên hợp lý:** muốn tạo dữ liệu giả hoặc oversampling (vd SMOTE), phải sinh theo **đúng phân phối** của cột, nếu không dữ liệu giả sẽ "phi thực tế".
- **Phát hiện bất thường (outlier):** giá trị nằm ở đuôi xa của phân phối → nghi ngờ lỗi/nhiễu.
- **Chọn model & loss đúng:** giả định phân phối sai → kết quả sai (vd dùng trung bình cho dữ liệu lệch nặng là dễ hiểu nhầm).

## 🔢 Tính chất gắn với phân phối
- **Kỳ vọng `E[X]`** = trung tâm (trung bình) → [[ky-vong-trung-binh]]
- **Phương sai / độ lệch chuẩn** = độ rộng, dao động → [[phuong-sai]]
- Hai cột cùng biến thiên ra sao → [[ma-tran-hiep-phuong-sai]]

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Mặc định mọi thứ là phân phối chuẩn** — rất nhiều dữ liệu thật bị lệch; phải **vẽ histogram xem trước**.
- Lẫn **PMF (rời rạc)** với **PDF (liên tục)**: PDF không phải xác suất trực tiếp, phải lấy diện tích.
- Sinh dữ liệu ngẫu nhiên mà không theo phân phối thật → dữ liệu giả vô nghĩa, model học sai.

---

## 🔗 Liên kết
- **Đào sâu 2 phân phối chủ lực:** [[gauss-va-nhi-thuc]] (Gauss → chuẩn hóa · Nhị thức → A/B test)
- **Liên quan tới:** [[ky-vong-trung-binh]] · [[phuong-sai]] · [[chuan-hoa-du-lieu]]
- **Tiền đề (cần biết trước):** [[xac-suat]]
- **Dẫn tới (học tiếp):** [[thong-ke]] · [[xu-ly-du-lieu]] · [[maximum-likelihood]]

## ❓ Câu hỏi mở
- Làm sao kiểm tra một cột có gần phân phối chuẩn không? (histogram, Q-Q plot)
- Khi nào nên log-transform, khi nào dùng chuẩn hóa min-max hay z-score?

## 📚 Nguồn
- StatQuest — "Probability Distributions" & "The Normal Distribution".
- 3Blue1Brown — "But what is a probability distribution?".
