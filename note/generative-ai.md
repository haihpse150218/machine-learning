# Generative AI (AI Sinh tạo)

> Tóm tắt 1 câu: AI **tạo ra dữ liệu MỚI** (ảnh, văn bản, nhạc) giống với dữ liệu huấn luyện. Khác AI truyền thống ở chỗ: thay vì học `P(nhãn | dữ liệu)` để **phân loại**, GenAI học `P(dữ liệu)` để **sinh** mẫu mới.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh F (Nhập môn ML) · *(L2 Mục 06)* ← cần [[deep-learning]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #genai #deep-learning #nhap-mon
**Nguồn slide:** `L2_Intro_ML_DL_GenAI.pdf` slide 45–53 — TS. Cao Tiến Dũng

---

## 💡 Từ PHÂN LOẠI → SÁNG TẠO (insight cốt lõi)
| | AI truyền thống (Discriminative) | Generative AI |
|---|---|---|
| Học | `P(nhãn \| dữ liệu)` | `P(dữ liệu)` |
| Làm gì | "Email này là rác?" → Có/Không | "Viết email phản hồi chuyên nghiệp" → tạo mới |
| Mục tiêu | vẽ **ranh giới** phân loại | học **phân phối** dữ liệu → sinh mẫu giống thật |

> 🔁 Nối nền tảng: học `P(dữ liệu)` chính là [[maximum-likelihood]] / [[phan-phoi-xac-suat]] ở quy mô khổng lồ → model "hiểu" dữ liệu trông như thế nào thì mới sinh ra cái mới giống vậy.

## ⚙️ Cách hoạt động (slide 45)
```
Dữ liệu train (ảnh/văn bản) → HỌC mẫu & cấu trúc → SINH nội dung mới tương tự
   → Vòng phản hồi: tinh chỉnh theo phản hồi người dùng (vd RLHF → [[cach-chatgpt-hoc]])
```

## 🏗️ 4 kiến trúc chính (slide 48–49)
| Kiến trúc | Ví von | Cơ chế | Mạnh / Yếu |
|-----------|--------|--------|------------|
| **GAN** | thợ làm giả vs thám tử | 2 mạng **cạnh tranh** | sắc nét/thực · train **bất ổn**, mode collapse |
| **VAE** | nén & tái dựng | encoder → **mã (code)** → decoder | ổn định · ảnh **hơi mờ** |
| **Diffusion** | tạc tượng từ đá | **thêm nhiễu** rồi học **khử nhiễu** | chất lượng **rất cao** · **chậm**, tốn tài nguyên |
| **Transformer** | phiên dịch nhớ hoàn hảo | **attention** trên chuỗi | sinh **văn bản xuất sắc** · model lớn, chi phí cao |

> Hiện nay: **Diffusion thống trị ẢNH** (DALL-E, Midjourney) · **Transformer thống trị VĂN BẢN & đa phương thức** (GPT-4, Gemini, Claude).

## 🔍 Đi sâu từng kiến trúc
- **AutoEncoder** (slide 50): nén đầu vào → **mã (code)** cô đọng → tái tạo lại. Học biểu diễn gọn; tiền đề của VAE.
- **GAN** (slide 51): **Generator** tạo ảnh giả ← → **Discriminator** phân biệt thật/giả. Hai mạng **"đấu" nhau** đến khi ảnh giả gần như không phân biệt được với thật.
- **Diffusion** (slide 52): **thuận** = thêm nhiễu dần đến khi thành nhiễu hoàn toàn; **nghịch** = model học **khử nhiễu từng bước** để sinh ảnh mới mạch lạc, độ phân giải cao.
  - **Số bước nhiễu:** train chuẩn gốc (DDPM) ~**1000 bước**; lúc sinh ảnh rút gọn còn **~20–50 bước** (DDIM), bản mới chỉ **1–4 bước** (consistency/distillation).
  - Mỗi bước khử nhiễu = **1 lần chạy cả mạng** → nhiều bước = **chậm, tốn GPU** (đó là điểm yếu của Diffusion). Khác [[generative-ai]]#GAN vốn sinh ảnh chỉ 1 lần chạy (nhanh hơn nhưng train bất ổn).
- **Transformer** (slide 53): Encoder–Decoder + **Self-Attention** (chú ý đồng thời nhiều phần của chuỗi) + **Positional Encoding** (thêm thông tin thứ tự) + mạng truyền thẳng. Nền của GPT/BERT/Claude và Vision Transformer.

## 📅 Cột mốc (slide 46)
```
2014  GAN (Ian Goodfellow)
2017  Transformer — "Attention is All You Need"
2020  GPT-3 (175 tỷ tham số)
2022  Stable Diffusion + ChatGPT
2023–2024  GPT-4, Gemini, Claude; Sora (text→video)
```

## 🌍 Ứng dụng (slide 47)
Sáng tạo nội dung · **tăng cường / dữ liệu tổng hợp** (làm giàu data train) · thiết kế 3D · marketing cá nhân hóa · gợi ý · sinh kịch bản gian lận · chatbot/trợ lý ảo.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **GenAI ≠ ma thuật:** nó học `P(dữ liệu)` rồi lấy mẫu — chất lượng phụ thuộc dữ liệu train (garbage in → garbage out, đúng [[dinh-huong-hoc]]).
- **Lẫn discriminative vs generative:** phân loại học ranh giới; sinh tạo học phân phối.
- **Hallucination:** model sinh ra cái "nghe hợp lý" nhưng **sai sự thật** — vì nó tối ưu "giống dữ liệu", không phải "đúng".

---

## 🔗 Liên kết
- **Tiền đề:** [[deep-learning]] · [[phan-phoi-xac-suat]] · [[maximum-likelihood]] (học P(dữ liệu))
- **Liên quan:** [[cach-chatgpt-hoc]] (Transformer/LLM + RLHF) · [[ai-ml-dl]]

## ❓ Câu hỏi mở
- Vì sao Diffusion cho ảnh chất lượng cao hơn GAN?
- Self-Attention "chú ý" các phần của chuỗi chính xác thế nào?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L2_Intro_ML_DL_GenAI.pdf` slide 45–53).
- "Attention is All You Need" (2017) · Goodfellow et al. — GAN (2014).
