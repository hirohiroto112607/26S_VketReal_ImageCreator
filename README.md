# VketReal 2025 Winter 参加表明カードジェネレーター

## 概要

VketReal 2025 Winter イベント用のパスカードを簡単に作成できるウェブアプリケーションです。自分の名前、SNSアカウント、画像を入力して、オリジナルのパスカードを生成できます。

## セットアップ

1. 依存パッケージのインストール
```bash
npm install
```

2. Tailwind CSSのビルド
```bash
# 開発モード(watch mode)
npm run build:css

# 本番ビルド(minified)
npm run build:css:prod
```

3. ローカルサーバーの起動
```bash
npm run serve
```

## 機能

- 名前とSNSアカウントの入力
- 自分の画像のアップロード
- 参加日の選択(20日・21日)
- カスタマイズしたパスカードのダウンロード
- SNS共有用ハッシュタグのコピー

## 使い方

1. 名前とSNSアカウント（TwitterやInstagramなど）を入力します
2. 自分の画像をアップロードします
3. 参加予定の日付にチェックを入れます
4. 「ダウンロード」ボタンをクリックしてパスカードを保存します
5. SNSでシェアする際は提供されているハッシュタグをご利用ください

## 技術仕様

- HTML5 Canvas APIを使用した画像生成
- Tailwind CSSによるレスポンシブデザイン
- Font Awesomeによるアイコン表示
- 純粋なJavaScriptによる実装

## 注意事項

- 生成されたパスカードは個人利用のみを目的としています
- イベント公式のパスカードではありません
- 画像は端末にのみ保存され、サーバーにアップロードされることはありません

## プロジェクト構成

- `index.html` - メインHTMLファイル
- `script.js` - JavaScriptロジック
- `src/input.css` - Tailwindソースファイル
- `tailwind.css` - ビルド済みCSSファイル
- `style.css` - 追加のスタイル定義
- `tailwind.config.js` - Tailwind設定
- `postcss.config.js` - PostCSS設定
- `VkketReal25W-*.png` - テンプレート画像ファイル

## 開発

開発時は以下のコマンドでTailwind CSSを自動ビルドできます:
```bash
npm run build:css
```

変更を監視してリアルタイムでCSSを更新します。

## ライセンス

Copyright © 2025 hirohiroto112607
