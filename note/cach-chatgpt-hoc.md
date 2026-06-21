# ChatGPT/LLM học kiểu gì? (Kết hợp nhiều loại)

> Tóm tắt 1 câu: ChatGPT **không thuộc một loại duy nhất** — nó là **chuỗi 3 giai đoạn** kết hợp tự-giám-sát (đoán từ kế tiếp) + có-giám-sát (người dạy mẫu trả lời) + tăng-cường (người chấm điểm → "thưởng/phạt"). Đúng trực giác "vừa huấn luyện vừa nghe chửi → rút kinh nghiệm".

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh F (Nhập môn ML) ← cần [[phan-loai-hoc-may]] · [[ai-ml-dl]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #genai #llm #chatgpt

---

## 🎯 Trả lời: ChatGPT thuộc loại nào?
**Không phải 1 loại** — là **3 giai đoạn nối tiếp**, mỗi giai đoạn dùng một kiểu học khác:

| # | Giai đoạn | Kiểu học | Làm gì |
|---|-----------|----------|--------|
| 1 | **Pretraining** (tiền huấn luyện) | **Tự giám sát** (self-supervised, họ hàng unsupervised) | Đọc khối văn bản **khổng lồ**, học **đoán từ tiếp theo** → nắm ngôn ngữ + kiến thức |
| 2 | **SFT** (tinh chỉnh có giám sát) | **Có giám sát** | Người **viết mẫu** câu hỏi–trả lời tốt → dạy model trả lời đúng kiểu mong muốn |
| 3 | **RLHF** (học tăng cường từ phản hồi người) | **Tăng cường** | Người **xếp hạng/chấm** câu trả lời → tạo "phần thưởng" → model tối ưu theo đó |

> 💡 Giai đoạn 3 (RLHF) chính là **"vừa huấn luyện vừa nghe chửi → rút kinh nghiệm"** mà bạn nói — đúng cơ chế **thưởng/phạt** của [[phan-loai-hoc-may]] (Reinforcement).

## 🧩 "Tự giám sát" — mảnh ghép đặc biệt
- Slide liệt kê 4 loại; nhưng pretraining LLM dùng **self-supervised** — một dạng **đặc biệt của không giám sát**:
  - Dữ liệu **tự tạo nhãn**: che từ tiếp theo trong câu → bắt model đoán → "nhãn" chính là từ thật.
  - Không cần con người gán nhãn → tận dụng được **toàn bộ internet** làm dữ liệu.

## 🪆 Vị trí trong bức tranh
- ChatGPT là **LLM** → thuộc **GenAI** → thuộc **Deep Learning** → thuộc ML → thuộc AI ([[ai-ml-dl]]).
- Hạ tầng bên dưới = **mạng nơ-ron nhiều lớp (Transformer)** + **gradient descent** tối thiểu [[loss-function]] (cross-entropy đoán từ).

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Tưởng ChatGPT là "1 loại học":** thực ra là **pipeline nhiều giai đoạn** ghép nhiều loại.
- **Tưởng nó "học realtime khi mình chat":** không — model **đã train xong** (đông cứng); cuộc chat chỉ là **suy luận (inference)**, không cập nhật trọng số. Phản hồi của người dùng có thể được gom lại để **train phiên bản sau**, không phải ngay lúc đó.
- Cross-entropy ([[loss-function]]) là loss của bước đoán từ → nối thẳng [[entropy]].

---

## 🔗 Liên kết
- **Tiền đề:** [[ai-ml-dl]] · [[phan-loai-hoc-may]]
- **Nối tới:** [[loss-function]] (cross-entropy) · [[gradient-descent]] · [[entropy]]

## ❓ Câu hỏi mở
- RLHF khác Reinforcement Learning cổ điển (AlphaGo) thế nào?
- Vì sao "đoán từ tiếp theo" lại học được cả lập luận, kiến thức?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L2_Intro_ML_DL_GenAI.pdf`).
- OpenAI — InstructGPT / RLHF (cách huấn luyện ChatGPT).
