# AI vs Machine Learning vs Deep Learning

> Tóm tắt 1 câu: Ba vòng tròn **lồng nhau** — **AI** (rộng nhất) ⊃ **Machine Learning** (máy học từ dữ liệu) ⊃ **Deep Learning** (mạng nơ-ron nhiều lớp, nền của GenAI/LLM).

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh F (Nhập môn ML/DL/GenAI) · #1
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #tong-quan #nhap-mon
**Nguồn slide:** `L2_Intro_ML_DL_GenAI.pdf` slide 1–2 — TS. Cao Tiến Dũng

---

## 🪆 Ba vòng lồng nhau
```
┌─────────────────────────────────────────────┐
│ TRÍ TUỆ NHÂN TẠO (AI) — rộng nhất            │
│  máy móc làm tác vụ cần trí thông minh        │
│  ┌─────────────────────────────────────────┐ │
│  │ HỌC MÁY (Machine Learning)              │ │
│  │  học từ DỮ LIỆU, không lập trình tường  │ │
│  │  minh từng luật                          │ │
│  │  ┌─────────────────────────────────────┐ │ │
│  │  │ HỌC SÂU (Deep Learning)             │ │ │
│  │  │  mạng nơ-ron NHIỀU LỚP              │ │ │
│  │  │  → nền của GenAI · LLM              │ │ │
│  │  └─────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

| Tầng | Là gì | Ví dụ |
|------|-------|-------|
| **AI** | Lĩnh vực rộng nhất — máy làm việc cần "trí thông minh" | luật if/else, hệ chuyên gia, ML... |
| **Machine Learning** | **Tập con của AI** — máy **học từ dữ liệu** thay vì được lập trình từng luật | hồi quy, cây quyết định, SVM |
| **Deep Learning** | **Tập con của ML** — dùng **mạng nơ-ron nhiều lớp**; nền của GenAI & LLM ngày nay | CNN, Transformer, GPT |

## 💡 Học máy là gì? (slide 2)
> Wikipedia: *"Học máy trao cho máy tính khả năng **học mà không cần được lập trình một cách tường minh**."*

- **Lập trình truyền thống:** người viết **luật** → máy chạy. (vd: "nếu email chứa 'khuyến mãi' → spam").
- **Học máy:** đưa **dữ liệu + đáp án** → máy **tự tìm ra luật** (tự học [[gradient-descent]] từ dữ liệu).
- Đây đúng tinh thần [[suy-dien-hoc-may]]: học từ mẫu → suy ra quy luật.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Lẫn AI = ML = DL:** chúng lồng nhau, không bằng nhau. Mọi DL là ML, nhưng không phải ML nào cũng là DL.
- **Không phải bài nào cũng cần Deep Learning:** dữ liệu bảng nhỏ → cây/hồi quy ([[decision-tree]]) thường tốt & rẻ hơn.
- "AI" trong truyền thông thường thực ra là **ML/DL** cụ thể.

---

## 🔗 Liên kết
- **Dẫn tới (học tiếp):** [[phan-loai-hoc-may]] (4 loại ML) · [[decision-tree]]
- **Liên quan:** [[suy-dien-hoc-may]] (học từ dữ liệu) · [[dinh-huong-hoc]]

## ❓ Câu hỏi mở
- Khi nào nên dùng Deep Learning, khi nào ML "cổ điển" đủ?
- GenAI & LLM nằm ở đâu trong bức tranh này? (con của Deep Learning)

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L2_Intro_ML_DL_GenAI.pdf` slide 1–2).
