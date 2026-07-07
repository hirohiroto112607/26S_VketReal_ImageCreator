# AGENTS.md

## プロジェクト概要

VketReal 2026 Summer 参加表明カードジェネレーター。名前・SNS アカウント・プロフィール画像・参加日程（7/25・7/26）を入力してカード画像（WebP）を生成し、X への投稿リンクを出すウェブアプリ。画像生成は **ブラウザ内の Canvas で完結**（サーバーアップロードなし）。コミュニティ制作の非公式ツール。

## コマンド

```bash
pnpm install
pnpm dev        # 開発サーバー（HMR）
pnpm build      # 本番ビルド → dist/
pnpm preview    # ビルド結果確認
npx wrangler pages deploy   # Cloudflare Pages へデプロイ（wrangler.toml: vketreal-imagecreator）
npx biome check --write .   # lint + format
```

## 構成

```
src/
  config/event.ts     # イベント設定（日付・テンプレート画像・ツイートテキスト）
  canvas/renderer.ts  # Canvas 描画ロジック（カード生成の本体）
  main.ts             # エントリーポイント（DOM 操作・イベントハンドラ）
  style.css           # Tailwind + カスタムスタイル
index.html            # 単一ページ
VketReal26S_*.webp     # カードテンプレート画像（日程別）
```

スタック: Vite + TypeScript + Tailwind CSS v3 + HTML5 Canvas。フレームワークなし（素の DOM 操作）。

## 運用ルール

- **次回イベント対応は `src/config/event.ts` の `EVENT_CONFIG` を編集するのが基本**。日付・画像・テキストはすべてここに集約されている。ロジック側に日付や文言をハードコードしない
- テンプレート画像を差し替えたらルートの `VketReal26S_*.webp` と `public/` の整合を確認する
- Cloudflare Workers/Pages の API・制限を扱うときは <https://developers.cloudflare.com/workers/> の最新ドキュメントを参照する（学習済み知識は古い可能性がある）
