# MeanShift (Phân cụm theo mật độ)

> Tóm tắt 1 câu: Mỗi điểm **"trôi" dần về vùng đông đúc nhất** quanh nó (dịch cửa sổ tới trung bình các điểm bên trong), lặp đến khi tâm không đổi; các điểm hội tụ về **cùng một đỉnh mật độ** thì thành **một cụm** — **KHÔNG cần chọn K trước**.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh E (Thuật toán) · *không giám sát* ← liên quan [[k-means]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #thuat-toan #unsupervised #clustering

---

## ⚙️ Cách hoạt động (chỉnh nhẹ mô tả của bạn)
```
1. Đặt một "cửa sổ" bán kính = BANDWIDTH quanh mỗi điểm   (← "khoảng cách tối đa" bạn nói)
2. Tính TRUNG BÌNH các điểm trong cửa sổ → DỊCH cửa sổ tới đó (shift to mean)
3. Lặp → cửa sổ trôi dần về VÙNG ĐẬM ĐẶC nhất (đỉnh mật độ / mode)
4. Điểm nào hội tụ về CÙNG một đỉnh → cùng một cụm; đỉnh sát nhau → GỘP (merge)
5. Dừng khi tâm không còn dịch chuyển
```
> Chỉnh ý "merge/tách nhóm": MeanShift chủ yếu là các điểm **gộp** về chung đỉnh; **số cụm tự nảy ra** từ số đỉnh mật độ, không phải chia/tách định trước.

## 🆚 MeanShift vs K-means
| | K-means | MeanShift |
|---|---|---|
| Chọn K trước? | **Có** (phải nhập K) | **Không** — tự tìm số cụm |
| Tham số chính | K | **bandwidth** (bán kính cửa sổ) |
| bandwidth nhỏ → | — | **nhiều** cụm |
| bandwidth lớn → | — | **ít** cụm |
| Hình cụm | giả định **cầu** | linh hoạt hơn (theo mật độ) |

## ✅ Mạnh / ❌ Yếu
| ✅ Mạnh | ❌ Yếu |
|--------|-------|
| **Không cần biết số cụm** | **Chậm** (tính toán nặng) |
| Bắt cụm hình tự nhiên theo mật độ | Nhạy **bandwidth** (chọn sai → sai số cụm) |
| Robust với outlier hơn K-means | Kém hiệu quả ở **nhiều chiều** |

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Tưởng tự do hoàn toàn:** vẫn phải chọn **bandwidth** — nó đóng vai trò như "K ẩn".
- **Quên scale** ([[chuan-hoa-du-lieu]]) → khoảng cách lệch → cụm sai.
- Dùng cho **dữ liệu lớn/nhiều chiều** → rất chậm; cân nhắc [[k-means]]/DBSCAN.

---

## 🔗 Liên kết
- **Liên quan:** [[k-means]] (cũng phân cụm, nhưng cần K) · [[ky-vong-trung-binh]] (shift to mean) · [[chuan-hoa-du-lieu]]
- **Thuộc:** [[phan-loai-hoc-may]] (unsupervised) · [[chon-mo-hinh]]

## ❓ Câu hỏi mở
- Chọn bandwidth thế nào cho hợp lý?
- MeanShift vs DBSCAN khác nhau ra sao (đều theo mật độ)?

## 📚 Nguồn
- scikit-learn — `MeanShift`.
- Slide môn học — TS. Cao Tiến Dũng (Thuật toán không giám sát).
