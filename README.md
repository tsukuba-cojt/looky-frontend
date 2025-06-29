## Looky

![version](https://img.shields.io/badge/version-1.0.0-red.svg)
![platform](https://img.shields.io/badge/platform-ios%20|%20android-orange.svg)
![stars](https://img.shields.io/github/stars/tsukuba-cojt/looky-frontend?color=yellow)
![commit-activity](https://img.shields.io/github/commit-activity/t/tsukuba-cojt/looky-frontend)
![license](https://img.shields.io/badge/license-Apache%202.0-green)

<br>

## 📝 Overview

Lookyは、簡単に自分の好みの服を探せる仮想試着アプリです。
自分で服を選んで試着する必要がなく、AIがあなたの好みにあった服の仮想試着画像を生成してくれます。
Lookyは、[Campus OJT](https://tsukuba-cojt.github.io/)のプロジェクトとして開発しました。

<br>

## ✨ Features

> [!CAUTION]
> Lookyの機能は現在開発中であり、仕様は今後変更される可能性があります。

## 🔧 Usage

[![Open in VS Code](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20Visual%20Studio%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc)](https://open.vscode.dev/tsukuba-cojt/looky-frontend)

1. リポジトリをクローンする

   ```bash
   git clone https://github.com/tsukuba-cojt/looky-frontend.git
   ```

2. リポジトリに移動する

   ```bash
   cd app
   ```

3. `.env` を作成する

   ```env
   SUPABASE_URL=
   SUPABASE_KEY=
   ```

4. 依存関係をインストールする

   ```bash
   pnpm install
   ```

5. 開発サーバーを起動する
   ```bash
   pnpm start
   ```

<br>

## ⚡️ Structure

```
looky-frontend/
├── app/                # ルーター
├── assets/             # アセット
├── components/         # コンポーネント
├── config/             # 設定ファイル
├── context/            # コンテキスト
├── hooks/              # カスタムフック
├── lib/                # ライブラリ
├── locales/            # 国際化
├── schemas/            # スキーマ
├── theme/              # テーマ
└── types/              # 型定義
```

<br>

## 🤝 Contributor

<a href="https://github.com/yushin-ito"><img  src="https://avatars.githubusercontent.com/u/75526539?v=4" width="64px"></a>
<a href="https://github.com/ankomochi"><img  src="https://avatars.githubusercontent.com/u/33803955?v=4" width="64px"></a>
<a href="https://github.com/nowex35"><img  src="https://avatars.githubusercontent.com/u/152232532?v=4" width="64px"></a>

<br>

## 📜 LICENSE

[Apache 2.0](LICENSE)