# 🧠 Second Brain App

Web app local để học các note Machine Learning theo đúng thứ tự lộ trình:
visualize graph phụ thuộc, theo dõi tiến độ, sửa/tạo note ngay trong app.
Đọc/ghi thẳng các file `.md` ở thư mục cha → Obsidian/git vẫn dùng song song.

## Chạy

```
cd secondbrain-app
npm install        # chỉ lần đầu (để vendor cytoscape/marked)
npm start          # → http://localhost:5173
```

## Test

```
npm test
```

## Cấu trúc

- `server.js` — HTTP API + serve frontend
- `lib/parse.js` — bóc metadata note · `lib/vault.js` — I/O file
- `public/` — frontend (3 cột: lộ trình · graph · viewer/editor)

Notes nằm ở thư mục cha; app KHÔNG sửa gì ngoài nội dung note bạn chỉnh trong app.
