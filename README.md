# VketReal 2025 Winter 参加表明カードジェネレーター

VketReal 2025 Winter イベント用の参加表明カードを作成できるウェブアプリです。名前・SNSアカウント・画像を入力してオリジナルカードを生成できます。

## セットアップ

```bash
pnpm install
```

## 開発

```bash
pnpm dev      # 開発サーバー起動（HMR）
pnpm build    # 本番ビルド → dist/
pnpm preview  # ビルド結果の確認
```

## 機能

- 名前・SNSアカウントの入力
- プロフィール画像のアップロード（正方形に自動クロップ）
- 参加日程の選択（12/20・12/21）
- カードのダウンロード（WebP形式）
- X（Twitter）への投稿リンク生成

## プロジェクト構成

```text
src/
  config/event.ts     # イベント設定（日付・画像・ツイートテキスト）
  canvas/renderer.ts  # Canvas描画ロジック
  main.ts             # エントリーポイント
  style.css           # Tailwind + カスタムスタイル
index.html
vite.config.ts
tailwind.config.js
```

次回イベント対応は `src/config/event.ts` の `EVENT_CONFIG` を編集するだけです。

## 技術スタック

- **Vite** — ビルド・開発サーバー
- **TypeScript** — 型安全な実装
- **Tailwind CSS v3** — スタイリング
- **HTML5 Canvas API** — 画像生成

## 注意事項

- 画像生成はブラウザ内で完結します（サーバーへのアップロードなし）
- イベント公式ではなくコミュニティ制作の非公式ツールです

## ライセンス

Copyright © 2024 - 2025 VketReal Unofficial Garage Developers. All Rights Reserved.
