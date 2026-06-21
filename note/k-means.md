# K-means (Phân cụm)

> Tóm tắt 1 câu: Thuật toán **không giám sát** chia dữ liệu thành **K cụm** — lặp lại: gán mỗi điểm vào **tâm gần nhất** → tính lại **tâm = trung bình cụm** → đến khi không điểm nào đổi cụm thì dừng.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh E (Thuật toán) · #7 — *không giám sát* ← cần [[ky-vong-trung-binh]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #thuat-toan #unsupervised #clustering

---

## 💡 Ý chính
- **Không nhãn** — tự gom các điểm **giống nhau** thành **K nhóm** ([[phan-loai-hoc-may]] · unsupervised).
- "Giống nhau" = **gần nhau** về khoảng cách; mỗi cụm có một **tâm (centroid)**.

## ⚙️ Vòng lặp (đúng mô tả của bạn)
```
1. Chọn K + đặt K tâm ngẫu nhiên
2. GÁN: mỗi điểm → tâm GẦN NHẤT
3. CẬP NHẬT: tâm mới = TRUNG BÌNH ([[ky-vong-trung-binh]]) các điểm trong cụm
4. LẶP bước 2–3
5. DỪNG khi tâm không đổi (không còn điểm đổi cụm) = hội tụ
```
> Tâm "trôi" dần về giữa cụm tự nhiên qua mỗi vòng lặp.

## 🔢 Chọn K bao nhiêu?
- **Elbow method:** vẽ tổng khoảng cách trong cụm (inertia) theo K → tìm **"khuỷu tay"** nơi giảm chậm lại.
- **Silhouette score:** đo điểm thuộc cụm của nó chặt thế nào.

## ⚠️ Điểm yếu quan trọng
- **Phải chọn K trước** — thuật toán không tự biết có mấy nhóm.
- **Nhạy khởi tạo ngẫu nhiên:** K-means **không lồi** ([[toi-uu-loi]]) → **train nhiều lần ra kết quả KHÁC nhau** (đúng insight lồi/không-lồi của bạn!). → `k-means++` chọn tâm ban đầu khôn hơn; hoặc chạy nhiều lần lấy tốt nhất.
- **Giả định cụm hình cầu, kích thước tương đương** → cụm hình lạ/lồng nhau thì kém → dùng **DBSCAN**.
- **Nhạy outlier** (vì dùng mean) và **phải scale** ([[chuan-hoa-du-lieu]]) vì dựa trên khoảng cách.

## ⚙️ Ứng dụng
- **Phân khúc khách hàng** (VIP / trung thành / nguy cơ rời bỏ), nén ảnh, gom nhóm văn bản.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Quên scale** → cột thang đo lớn chi phối khoảng cách → cụm vô nghĩa.
- **Tin 1 lần chạy** → nên chạy nhiều lần (vì không lồi) + set seed để tái lập.
- **Ép K-means cho cụm hình phức tạp** → kết quả sai; xem DBSCAN/Hierarchical.

---

## 🔗 Liên kết
- **Tiền đề:** [[ky-vong-trung-binh]] (tâm = trung bình) · [[chuan-hoa-du-lieu]] (scale)
- **Liên quan:** [[toi-uu-loi]] (không lồi → khởi tạo ảnh hưởng) · [[lay-mau]] · [[pca]] (giảm chiều trước khi cụm)
- **Thuộc:** [[phan-loai-hoc-may]] (unsupervised) · [[chon-mo-hinh]]

## ❓ Câu hỏi mở
- k-means++ chọn tâm ban đầu thông minh hơn thế nào?
- Khi nào dùng DBSCAN/Hierarchical thay K-means?

## 📚 Nguồn
- StatQuest — "K-means clustering".
- Slide môn học — TS. Cao Tiến Dũng (Thuật toán không giám sát).
