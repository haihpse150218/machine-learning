# Gradient Descent (Hạ Gradient)

> Tóm tắt 1 câu: Thuật toán lặp để tìm điểm cực tiểu của một hàm số bằng cách liên tục đi ngược hướng đạo hàm (gradient) — dùng để "huấn luyện" mô hình ML.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh A (Giải tích → Tối ưu) · #4 ← cần [[giai-tich]] + [[dao-ham]] + [[gradient]] trước
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml #toi-uu-hoa #giai-tich

---

## 💡 Ý chính
> Diễn đạt lại bằng lời của bạn — nếu giải thích được thì mới thật sự hiểu.

- Mỗi mô hình ML có một **hàm mất mát (loss function)** đo "mô hình sai bao nhiêu". Mục tiêu là tìm bộ tham số làm hàm này nhỏ nhất.
- Gradient (đạo hàm) chỉ ra **hướng dốc lên** của hàm tại một điểm. Muốn đi xuống đáy thì đi **ngược lại** hướng gradient.
- Lặp lại từng bước nhỏ: tính gradient → bước một đoạn ngược hướng đó → lặp lại cho tới khi chạm đáy (gradient ≈ 0).

## 🧩 Trực giác / Ví dụ
> Một ví dụ cụ thể, hình ảnh ẩn dụ, hoặc trường hợp thực tế.

- **Ẩn dụ:** Bạn đứng trên sườn núi trong sương mù dày, muốn xuống thung lũng. Bạn không thấy đường, nhưng cảm nhận được dốc dưới chân → mỗi bước đi về phía dốc nhất xuống dưới. Lặp lại đến khi mặt đất phẳng (đáy).
- **Learning rate (η)** chính là độ dài mỗi bước chân: bước quá lớn → nhảy vọt qua đáy; bước quá nhỏ → đi mãi không tới.

## 🔢 Công thức / Định nghĩa
> Công thức cập nhật tham số sau mỗi bước lặp.

$$\theta_{\text{new}} = \theta_{\text{old}} - \eta \cdot \nabla J(\theta)$$

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $\theta$ (theta) | Tham số của mô hình (cần tối ưu) |
| $\eta$ (eta) | Learning rate — độ lớn mỗi bước |
| $\nabla J(\theta)$ | Gradient của hàm mất mát $J$ theo $\theta$ (hướng dốc lên) |
| dấu $-$ | Đi **ngược** gradient để giảm $J$ (đi xuống) |

## ⚙️ Khi nào dùng / Ứng dụng trong ML
- Huấn luyện hầu hết mô hình: Linear/Logistic Regression, Neural Networks, Deep Learning.
- Các biến thể phổ biến:
  - **Batch GD** — dùng toàn bộ dữ liệu mỗi bước (chính xác, chậm).
  - **Stochastic GD (SGD)** — dùng 1 mẫu mỗi bước (nhanh, nhiễu).
  - **Mini-batch GD** — dùng một nhóm nhỏ mẫu (cân bằng, dùng nhiều nhất trong thực tế).

## ⏬ Learning rate decay (giảm dần tốc độ học)
> ✍️ **Lời của mình:** lúc đầu để η **lớn** để đi nhanh, sau đó **decay** — giảm dần sau một số bước.

- **Vì sao to → nhỏ?** Lúc đầu **xa đáy** → bước lớn đi nhanh. Về sau **gần đáy** → bước lớn sẽ **nhảy qua / dao động** quanh cực tiểu → phải **giảm η** để "đáp" êm vào đáy. (Đúng cái bẫy "η quá lớn" trong slide; và là cách dập **dao động của SGD**.)
- **Ẩn dụ:** đi tới cửa nhà — còn xa thì sải bước dài, tới gần thì bước ngắn lại kẻo vọt qua.

| Kiểu decay | Công thức | Ghi chú |
|---|---|---|
| **Step** | sau $N$ epoch: $\eta \leftarrow \eta \times 0.5$ | giảm theo nấc — đơn giản, hay dùng |
| **Exponential** | $\eta = \eta_0 \cdot e^{-k \cdot t}$ | giảm mượt theo thời gian |
| **1/t** | $\eta = \dfrac{\eta_0}{1 + k \cdot t}$ | giảm nhanh đầu, chậm về sau |
| **Cosine** | giảm theo hình cos | phổ biến trong deep learning |
| **Warmup + decay** | tăng nhẹ rồi mới giảm | dùng cho Transformer / model lớn |

- **Thực tế (dùng lại, không tự code):** khai báo schedule sẵn — Keras `ExponentialDecay(...)` · PyTorch `StepLR(opt, step_size, gamma)`.
- 💡 Optimizer **Adam** đã tự chỉnh "bước hiệu dụng" từng tham số → đỡ tinh chỉnh η thủ công, nhưng vẫn hay chồng thêm schedule.
- ⚠️ **Đừng nhầm** *learning rate decay* (giảm η để hội tụ) với *weight decay* = [[regularization]] L2 (phạt trọng số lớn để chống overfit) — cùng chữ "decay", khác bản chất.

> 🔑 **Điều kiện để η hiệu quả: phải [[chuan-hoa-du-lieu]] — đưa các trục về cùng standard.**
> η là **MỘT** bước áp cho **MỌI** hướng. Trục lệch thang ($x_1 \in [0,1]$ vs $x_2 \in [0,10000]$) → mặt loss **méo thành thung lũng hẹp** → 1 η không vừa cả hai (đủ lớn cho trục thoải thì **vọt** trục dốc; đủ nhỏ cho trục dốc thì **zig-zag** trục thoải).
> **Scale về cùng standard** (mean 0, std 1) → mặt loss **tròn như cái bát** → gradient chỉ **thẳng vào tâm** → **một η chạy tốt mọi hướng**, hội tụ nhanh & ổn định.
> → Tinh thần [[dinh-huong-hoc]]: η máy lo, **scale dữ liệu là phần BẠN kiểm soát** để train chạy được.

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **Learning rate sai:** quá lớn → loss dao động/phân kỳ (vọt lên vô cực); quá nhỏ → hội tụ rất chậm.
- **Cực tiểu cục bộ (local minimum):** với hàm không lồi, có thể kẹt ở đáy nhỏ chứ không phải đáy toàn cục.
- **Chưa chuẩn hóa dữ liệu (feature scaling):** các đặc trưng khác thang đo khiến đường hội tụ "zig-zag" rất chậm.
- Nhầm gradient với giá trị hàm: gradient là **hướng/độ dốc**, không phải giá trị loss.

---

## 🔗 Liên kết
- **Liên quan tới:** [[loss-function]] · [[learning-rate]]
- **Tiền đề (cần biết trước):** [[dao-ham]] · [[giai-tich]]
- **Dẫn tới (học tiếp):** [[sgd]] · [[backpropagation]] · [[adam-optimizer]]

## ❓ Câu hỏi mở
- Làm sao chọn learning rate tốt nhất một cách tự động? (→ learning rate scheduling, Adam)
- Tại sao SGD nhiễu lại đôi khi giúp thoát khỏi local minimum?

## 📚 Nguồn
- Andrew Ng — Machine Learning (Coursera), phần Gradient Descent.
- 3Blue1Brown — "Gradient descent, how neural networks learn" (YouTube).
