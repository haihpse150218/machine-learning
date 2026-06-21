# Bộ tự mã hóa (AutoEncoder)

> Tóm tắt 1 câu: Mạng nơ-ron **nén** đầu vào thành một "mã (code)" cô đọng ở giữa, rồi **tái tạo** lại giống đầu vào — qua đó tự học **biểu diễn gọn** của dữ liệu. Giống [[pca]] nhưng **phi tuyến** (mạnh hơn).

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh F *(L2 Mục 06)* ← cần [[deep-learning]] · liên quan [[pca]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #deep-learning #unsupervised #genai

---

## 🏗️ Cấu trúc (slide 50)
```
Đầu vào → [ENCODER] nén → MÃ (code, ở giữa, NHỎ) → [DECODER] tái tạo → Đầu ra (≈ đầu vào)
          bộ mã hóa        nút thắt cổ chai          bộ giải mã
```
- **Encoder:** nén dữ liệu lớn → vector mã nhỏ.
- **Code (bottleneck):** biểu diễn **cô đọng** — chỗ thắt nhỏ **ép** mạng giữ lại thông tin quan trọng nhất.
- **Decoder:** tái dựng lại đầu vào từ mã.

## ⚙️ Học thế nào
- Mục tiêu: **output ≈ input** → loss = sai số tái tạo (reconstruction error).
- **Không cần nhãn người gán** — "nhãn" chính là **đầu vào** → đây là **tự giám sát (self-supervised)** ([[phan-loai-hoc-may]]).
- Nút thắt nhỏ buộc mạng **bỏ nhiễu, giữ tinh túy** → học đặc trưng cốt lõi.

## 🔁 AutoEncoder vs PCA (nối Nhánh B)
| | [[pca]] | AutoEncoder |
|---|---|---|
| Giảm chiều bằng | phép biến đổi **tuyến tính** | mạng nơ-ron **phi tuyến** |
| Sức mạnh | chỉ bắt quan hệ tuyến tính | bắt được **cấu trúc cong, phức tạp** |
| Diễn giải | trục có nghĩa (phương sai) | mã khó diễn giải (black-box) |
> 💡 AutoEncoder ≈ "**PCA phi tuyến**" — cùng ý tưởng nén xuống ít chiều giữ thông tin, nhưng linh hoạt hơn.

## ⚙️ Ứng dụng
- **Nén dữ liệu** (lossy compression).
- **Phát hiện bất thường (anomaly):** train trên dữ liệu **bình thường** → mẫu nào tái tạo **kém** (lỗi cao) = **bất thường** (gian lận, lỗi máy).
- **Giảm chiều / học biểu diễn** trước khi đưa vào model khác.
- **Tiền đề của VAE** → sinh dữ liệu mới ([[generative-ai]]).

## 🧬 AutoEncoder → VAE (vì sao là "base")
- AutoEncoder thường chỉ **tái tạo**, mã là điểm cố định → khó **sinh mẫu mới** tốt.
- **VAE** = AutoEncoder + xác suất: mã thành **phân phối** ([[phan-phoi-xac-suat]]) → lấy mẫu từ đó → **sinh dữ liệu mới**. Đây là lý do VAE thuộc nhóm Generative, còn AutoEncoder là **nền** của nó.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Code quá lớn (nút thắt rộng):** mạng chỉ "copy" đầu vào → không học được gì cô đọng.
- **AutoEncoder thường ≠ sinh tạo:** muốn sinh mẫu mới cần **VAE** (thêm xác suất).
- Tái tạo tốt **không** = hiểu ngữ nghĩa; chỉ là nén/giải nén.

---

## 🔗 Liên kết
- **Tiền đề:** [[deep-learning]] · [[pca]] (giảm chiều tuyến tính)
- **Dẫn tới:** [[generative-ai]] (VAE) · phát hiện bất thường
- **Liên quan:** [[phan-loai-hoc-may]] (unsupervised/self-supervised)

## ❓ Câu hỏi mở
- Nén bao nhiêu (kích thước code) là vừa — đủ gọn mà không mất thông tin?
- VAE thêm "xác suất" vào code chính xác thế nào để sinh được mẫu mới?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L2_Intro_ML_DL_GenAI.pdf` slide 50).
- StatQuest — "AutoEncoders".
