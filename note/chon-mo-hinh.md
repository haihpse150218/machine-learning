# Chọn mô hình nào? (Model Selection)

> Tóm tắt 1 câu: Không có thuật toán "tốt nhất" tuyệt đối — chọn theo **dữ liệu + bài toán + ràng buộc**; nguyên tắc vàng: **bắt đầu đơn giản, nâng độ phức tạp khi cần**.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟢 Cheat sheet (Lớp LÀM)
**📖 Lộ trình:** Nhánh E (Thuật toán) · #8 — tổng hợp ← cần [[phan-loai-hoc-may]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #thuat-toan #model-selection #lop-lam
**Nguồn slide:** `L2_Intro_ML_DL_GenAI.pdf` slide 16, 18, 19 — TS. Cao Tiến Dũng

---

## ⚖️ Yếu tố cân nhắc (slide 18)
- **Thời gian huấn luyện** (train nhanh hay chậm).
- **Tốc độ dự đoán** (real-time cần nhanh).
- **Lượng dữ liệu cần thiết** (ít hay nhiều).
- **Loại dữ liệu** (bảng / ảnh / văn bản; số / phân loại).
- **Độ phức tạp của bài toán**.
- **Khả năng giải bài toán phức tạp** (bắt phi tuyến?).
- **Xu hướng làm phức tạp hóa bài toán đơn giản** ⚠️ → đừng dùng "đại bác bắn chim".

## 📋 Cheat sheet thuật toán có giám sát (slide 16)
| Thuật toán | Hình dung như... | Phù hợp khi... |
|------------|------------------|----------------|
| [[linear-regression]] | vẽ một đường thẳng | đầu ra là **số liên tục** |
| [[logistic-regression]] | quyết định bạn ở **phía nào của đường** | phân loại **nhị phân** có/không |
| [[decision-tree]] | trò chơi 20 câu hỏi | cần **giải thích được** |
| [[svm]] | tìm **khe rộng nhất** giữa các lớp | dữ liệu **nhỏ, nhiều chiều** |
| [[naive-bayes]] | đếm tần suất từ | phân loại **văn bản**, lọc spam |
| [[knn]] | "bạn là ai tùy hàng xóm" | dữ liệu nhỏ, **mẫu cục bộ** quan trọng |
| [[random-forest]] | 100 cây cùng bỏ phiếu | **đa dụng, kháng nhiễu** tốt |
| [[xgboost]] | sửa lỗi của mô hình trước | **dữ liệu bảng, các cuộc thi** |

> 💡 *"Không có thuật toán tốt nhất tuyệt đối — bắt đầu đơn giản (Logistic) rồi nâng độ phức tạp khi cần."*

## 🌳 Sơ đồ chọn đúng mô hình (slide 19)
> 🖼️ Xem hình trực quan: `chon-mo-hinh.excalidraw` (render: `chon-mo-hinh.png`).
```
                 ┌─ CÓ dữ liệu gán nhãn? ─┐
                CÓ                        KHÔNG
                 │                          │
         ┌── loại đầu ra ──┐         KHÔNG có nhãn (unsupervised)
     HẠNG MỤC            SỐ                 │
        │                 │       ┌─────────┼──────────┐
  ┌─────┴─────┐     ┌─────┴─────┐ Nhóm?   Bất thường?  Quá nhiều
 Cần        Cần    Tuyến      Phi      →K-Means →Isolation  đặc trưng?
 giải      chính   tính?     tuyến?            Forest      →PCA
 thích?    xác?    →Linear/   →Gradient
 →Cây/     →RF/    Ridge      Boosting
 Logistic  XGBoost            /NN
```

## 🧭 Đọc sơ đồ thành câu hỏi
1. **Có nhãn không?** → Có = giám sát; Không = không giám sát.
2. **(Có nhãn) Đầu ra hạng mục hay số?** → hạng mục = phân loại; số = hồi quy.
3. **Cần giải thích?** → [[decision-tree]]/[[logistic-regression]]. **Cần chính xác?** → [[random-forest]]/[[xgboost]].
4. **(Số) Tuyến tính?** → Linear/Ridge. **Phi tuyến?** → Gradient Boosting/Neural Net.
5. **(Không nhãn)** Gom nhóm → [[k-means]]; Bất thường → Isolation Forest; Nhiều chiều → [[pca]].

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Nhảy thẳng vào model phức tạp** (deep learning/XGBoost) cho bài đơn giản → tốn công, khó bảo trì. Bắt đầu **baseline đơn giản** trước ([[dinh-huong-hoc]]).
- **Quên ràng buộc thực tế:** model chính xác nhất nhưng quá chậm/không giải thích được → có khi vô dụng trong sản xuất.
- **Chọn model trước khi hiểu dữ liệu & bài toán** ([[xac-dinh-van-de]] · [[xu-ly-du-lieu]]).

---

## 🔗 Liên kết
- **Tiền đề:** [[phan-loai-hoc-may]] · [[xac-dinh-van-de]]
- **Trỏ tới mọi thuật toán:** [[decision-tree]] · [[logistic-regression]] · [[random-forest]] · [[xgboost]] · [[svm]] · [[k-means]] · [[pca]]
- **Định hướng:** [[dinh-huong-hoc]] (đừng phức tạp hóa)

## ❓ Câu hỏi mở
- Đánh giá & so sánh model thế nào cho công bằng? (cross-validation, cùng metric)
- Khi nào "model đơn giản đủ tốt" thắng "model phức tạp chính xác hơn chút"?

## 📚 Nguồn
- Slide môn học — TS. Cao Tiến Dũng (`L2_Intro_ML_DL_GenAI.pdf` slide 16, 18, 19).
