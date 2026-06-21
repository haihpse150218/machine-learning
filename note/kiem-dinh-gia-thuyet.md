# Kiểm định giả thuyết (Hypothesis Testing)

> Tóm tắt 1 câu: Khung để trả lời câu hỏi *"chênh lệch quan sát được là **thật** hay chỉ do **may rủi**?"* — giả sử "không có gì khác biệt", rồi xem dữ liệu bất ngờ tới mức nào để quyết định bác bỏ hay không.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh C (Thống kê) ← cần [[thong-ke]] · [[gauss-va-nhi-thuc]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #thong-ke #ab-testing #inference

---

## 💡 Ý chính
- **Giả thuyết** = một **phát biểu kiểm chứng được** (vd "đồng xu bị lệch", "2 nhóm khác nhau").
- **H₀ (giả thuyết không / null):** "KHÔNG có hiệu ứng / không khác biệt" — mặc định, cái ta muốn **bác bỏ** (vd "đồng xu cân bằng").
- **H₁ (đối thuyết / alternative):** "CÓ hiệu ứng / có khác biệt" — ý tưởng ta muốn chứng minh (vd "đồng xu bị lệch").
- **Mẹo tư duy:** muốn chứng minh H₁ thì **khó trực tiếp**, nên ta đi đường vòng: **bác bỏ H₀** (chứng minh "không có gì" là sai).
- **Logic:** *tạm tin H₀ đúng* → tính xem dữ liệu quan sát "bất ngờ" cỡ nào → nếu quá bất ngờ (khó xảy ra nếu H₀ đúng) → **bác bỏ H₀**.
- Giống tòa án: mặc định "vô tội" (H₀), chỉ kết tội khi **bằng chứng đủ mạnh**.

## ⚙️ Các bước
```
1. Đặt H₀ và H₁
2. Chọn mức ý nghĩa α  (giá trị p cho trước; thường 0.05, 0.02, 0.01, 0.005, 0.001)
3. Tính test statistic + [[p-value]]
4. So sánh:
     p < α   → CHẤP NHẬN H₁ (bác bỏ H₀)   — kết quả "có ý nghĩa thống kê"
     p ≥ α   → KHÔNG đủ bằng chứng bác bỏ H₀
```
> α nhỏ hơn (vd 0.01) = yêu cầu bằng chứng **mạnh hơn** mới bác bỏ H₀ → ít dương tính giả hơn nhưng dễ bỏ sót.

## 🧪 Ví dụ A/B test cho mô hình ML (slide 39)
> So sánh độ chính xác **Model A vs Model B**.
- **H₀:** Accuracy(A) = Accuracy(B) (chênh lệch chỉ do may rủi).
- **H₁:** Accuracy(A) ≠ Accuracy(B).
```python
from scipy import stats
# Model A: đúng 850/1000 = 85.0% ;  Model B: đúng 820/1000 = 82.0%
t_stat, p_value = stats.ttest_ind(results_A, results_B)
# p_value = 0.031
```
- **Quyết định:** p = 0.031 < 0.05 = α → **bác bỏ H₀** → "Model A tốt hơn B một cách có ý nghĩa".
- Nếu p ≥ 0.05: chưa thể kết luận có khác biệt (có thể cần thêm dữ liệu).

## ↔️ Một phía vs Hai phía (slide 40)
- **Hai phía (two-tailed):** H₁ là "**khác nhau**" (≠) — chia α cho **2 bên** đuôi. Với α=5%: mỗi bên **α/2 = 2.5%**, ngưỡng z ≈ **±1.96**.
  - Giữa (|z| < 1.96): **chấp nhận H₀**. Hai đuôi đỏ (|z| > 1.96): **vùng bác bỏ**.
- **Một phía (one-tailed):** H₁ có hướng ("**lớn hơn**" hoặc "nhỏ hơn") — dồn cả α vào **1 bên**.
- Khi `p < α` → rơi vào vùng bác bỏ → bác bỏ H₀.

## ⚖️ Hai loại lỗi (nhớ kỹ)
| | H₀ thật ra ĐÚNG | H₀ thật ra SAI |
|---|---|---|
| **Bác bỏ H₀** | ❌ Lỗi loại I (false positive) = **α** | ✅ Đúng |
| **Không bác bỏ** | ✅ Đúng | ❌ Lỗi loại II (false negative) = **β** |

- **Lỗi I (α):** báo "có hiệu ứng" trong khi không có (báo động giả).
- **Lỗi II (β):** bỏ sót hiệu ứng thật. **Power = 1 − β** = khả năng phát hiện hiệu ứng thật.
- Mẫu lớn hơn → power cao hơn (dễ phát hiện hiệu ứng thật).

## 🔬 Các loại kiểm định (slide 41–45, kèm scipy)
| Kiểm định | Dùng cho | Hàm scipy |
|-----------|----------|-----------|
| **T-test 1 mẫu** | Trung bình tập dữ liệu = 1 giá trị cho trước? | `stats.ttest_1samp(X, mean)` |
| **T-test 2 mẫu** | Trung bình **2 nhóm** có bằng nhau? (A/B test) | `stats.ttest_ind(x, y)` |
| **F-test (ANOVA)** | **Phương sai** ([[phuong-sai]]) / trung bình của **≥2–3 nhóm** có bằng? | `stats.f_oneway(x, y, z)` |
| **Pearson correlation test** | 2 biến số có **tương quan** ([[tuong-quan]]) có ý nghĩa? (H₀: độc lập) | `stats.pearsonr(x, y)` |

> 💡 **Ví dụ Pearson (slide 43):** giờ học vs điểm thi → `r = 0.993` (rất mạnh), `p = 0.0007 < 0.05` → bác bỏ H₀ "độc lập" → tương quan **có ý nghĩa thống kê**. (Nhớ: r đo độ mạnh, p đo độ tin.)

## ⚠️ Lỗi thường gặp / Điều dễ nhầm
- **"Không bác bỏ H₀" ≠ "H₀ đúng"** — chỉ là *chưa đủ bằng chứng*, không chứng minh được.
- **Có ý nghĩa thống kê ≠ quan trọng thực tế:** mẫu cực lớn → chênh lệch tí xíu cũng "significant" nhưng vô nghĩa kinh doanh.
- **Multiple testing:** test nhiều giả thuyết cùng lúc → tăng lỗi loại I (cần hiệu chỉnh Bonferroni...).
- **Peeking / dừng sớm** trong A/B test khi thấy "thắng" → kết luận sai.
- **p-hacking:** thử đủ kiểu tới khi p < 0.05 → gian lận (xem [[p-value]]).

---

## 🔗 Liên kết
- **Tiền đề (cần biết trước):** [[thong-ke]] · [[gauss-va-nhi-thuc]]
- **Cốt lõi đi kèm:** [[p-value]]
- **Liên quan tới:** [[xac-dinh-van-de]] (chọn đúng thước đo)

## ❓ Câu hỏi mở
- Khi nào dùng one-tailed vs two-tailed test?
- Cỡ mẫu cần bao nhiêu để đạt power mong muốn (power analysis)?

## 📚 Nguồn
- Slide môn học — `L1_Math_Overview.pdf` trang 45 (slide 38) — TS. Cao Tiến Dũng.
- StatQuest — "Hypothesis Testing and the Null Hypothesis".
- Khan Academy — Significance tests.
