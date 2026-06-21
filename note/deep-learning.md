# Học sâu (Deep Learning)

> Tóm tắt 1 câu: Mạng nơ-ron **NHIỀU LỚP** tự học đặc trưng từ dữ liệu thô — mỗi nơ-ron là một phương trình tuyến tính `W·x + b` **kèm hàm kích hoạt phi tuyến**; một lớp = phép nhân ma trận; xếp chồng nhiều lớp = "sâu".

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh F (Nhập môn ML) · *(L2 Mục 05)* ← cần [[ai-ml-dl]] · [[gradient-descent]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #deep-learning #neural-network #nhap-mon
**Nguồn slide:** `L2_Intro_ML_DL_GenAI.pdf` slide 40–44 — TS. Cao Tiến Dũng

---

## 🧠 Cấu trúc (chỉnh + bổ sung intuition của bạn)
```
1 nơ-ron  = W·x + b   (phương trình tuyến tính)  →  ⚡ HÀM KÍCH HOẠT phi tuyến (ReLU/sigmoid)
1 lớp     = nhiều nơ-ron = phép NHÂN MA TRẬN  W·x  (mỗi nơ-ron = 1 hàng của W)
mạng sâu  = nhiều lớp xếp chồng (lớp này → lớp kia)
```
> ⚠️ **Mảnh bạn còn thiếu — hàm kích hoạt:** nếu chỉ tuyến tính thuần (`W·x`), xếp 100 lớp **vẫn = 1 hàm tuyến tính**. Phải có **activation phi tuyến** giữa các lớp thì mạng mới học được quan hệ **cong/phức tạp**. Đây là điểm sống còn.

### ⏱️ Thứ tự trong 1 nơ-ron (đừng đảo)
- **Trước khi train:** chọn sẵn **LOẠI activation** (ReLU/sigmoid) — cố định. Training chỉ **học trọng số W**, KHÔNG học activation.
- **Khi chạy:** `z = W·x + b` (tuyến tính, **trước**) → `a = activation(z)` (phi tuyến, **sau**).

### 🗺️ "Mỗi nơ-ron control 1 vùng" (intuition của bạn — đúng)
- Với **ReLU**: nơ-ron **bật** (>0) khi `W·x+b > 0` = **một phía của 1 đường ranh giới**; **tắt** (=0) ở phía kia.
```
1 nơ-ron     → vẽ 1 đường ranh giới (bật/tắt)
nhiều nơ-ron → chia không gian thành nhiều VÙNG nhỏ → ranh giới cong/phức tạp
nhiều lớp    → ghép vùng thành khái niệm cấp cao (cạnh → hình → vật thể)
```
- 👉 Vì thế **càng nhiều nơ-ron/lớp = càng nhiều vùng = bắt pattern phức tạp hơn** — nhưng cần **nhiều dữ liệu** để "tô" đúng mọi vùng (không thì [[overfitting]]). Đây là lý do DL cải thiện mãi khi dữ liệu lớn (slide 41).

## 🆚 Khác biệt cốt lõi với ML truyền thống
| | ML truyền thống | Deep Learning |
|---|---|---|
| Đặc trưng | **người thiết kế thủ công** ([[feature-engineering]]) | **mạng TỰ HỌC** đặc trưng từ dữ liệu thô |
| Quy trình | feature extraction → model riêng | **học đặc trưng + phân loại trong CÙNG 1 mạng** |
| Ví dụ ảnh | người chỉ ra "cạnh, góc" | mạng tự học: cạnh → hình → bộ phận → vật thể |

> 💡 Đây là lý do DL mạnh với **ảnh/giọng nói/văn bản** — nơi đặc trưng quá khó để con người tự thiết kế.

## 📈 Hiệu năng: ML vs DL (slide 41)
- **ML truyền thống bão hòa sớm** khi dữ liệu tăng (đường cong phẳng dần).
- **Deep Learning tiếp tục cải thiện** khi có **nhiều dữ liệu hơn**.
- Yếu tố then chốt: **dữ liệu lớn + GPU + kiến trúc phù hợp**.
- → Dữ liệu nhỏ thì ML cổ điển ([[decision-tree]], [[xgboost]]) thường tốt & rẻ hơn.

## 🏗️ 3 kiến trúc chính (slide 44)
| Kiến trúc | Dùng cho | Ý chính |
|-----------|----------|---------|
| **CNN** (tích chập) | **ảnh** | tự học cạnh → hình → bộ phận → vật thể |
| **RNN** (hồi quy) | **dữ liệu chuỗi** | mang "ký ức" qua từng bước |
| **LSTM / GRU** | chuỗi dài | cải tiến RNN, nhớ **phụ thuộc xa** nhờ các **cổng (gates)** |
| *(Transformer)* | ngôn ngữ, hiện đại | nền của LLM/ChatGPT (xem [[cach-chatgpt-hoc]]) |

## 🌍 Trong sản phẩm thực tế (slide 43)
Face ID (CNN) · Siri/Alexa (RNN/Transformer) · YouTube captions · phát hiện gian lận (LSTM) · gợi ý Netflix · Google Translate (Transformer) · DALL-E (Diffusion).
> *"Deep Learning hiện là động cơ của hầu hết sản phẩm AI bạn dùng hằng ngày."*

## 🔗 Train thế nào?
- Vẫn là [[gradient-descent]] tối thiểu [[loss-function]] — nhưng tính gradient qua nhiều lớp bằng **backpropagation** (chuỗi đạo hàm, [[chain-rule]]).
- Loss thường **không lồi** ([[toi-uu-loi]]) → train nhiều lần ra kết quả khác.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Quên hàm kích hoạt** → mạng sâu vô nghĩa (chỉ = 1 lớp tuyến tính).
- **Dùng DL cho dữ liệu bảng nhỏ** → thường thua [[xgboost]]; DL cần **nhiều dữ liệu**.
- DL là **black-box** → khó giải thích (khác [[decision-tree]]).

---

## 🔗 Liên kết
- **Tiền đề:** [[ai-ml-dl]] · [[gradient-descent]] · [[feature-engineering]] (DL thay thế bước này)
- **Dẫn tới:** [[cach-chatgpt-hoc]] (Transformer/LLM) · Generative AI
- **Liên quan:** [[chain-rule]] (backprop) · [[toi-uu-loi]]

## ❓ Câu hỏi mở
- Hàm kích hoạt ReLU vs sigmoid khác nhau thế nào, khi nào dùng?
- Vì sao CNN hợp ảnh còn RNN/Transformer hợp chuỗi?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L2_Intro_ML_DL_GenAI.pdf` slide 40–44).
- 3Blue1Brown — "Neural Networks" series.
