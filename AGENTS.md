# Codex 開発規約

このリポジトリでは、Codex は次の方針を守って作業してください。

## 基本方針

- `main` を直接変更せず、作業用ブランチを使用する。
- 実在する研究内容、人物、住所、連絡先、業績を推測して追加しない。
- 未確定情報は明確なプレースホルダーとして記載する。
- Science Tokyo の公式サイトと誤認されるデザインや、大学ロゴの無断複製を避ける。
- 外部CMS、外部データベース、サーバーサイド処理を追加しない。
- JavaScript 依存と依存パッケージは必要最小限にする。
- DNS設定、GitHub Pages設定画面、独自ドメイン設定はユーザーの明示指示なしに操作しない。
- ユーザー確認なしに push や Pull Request 作成をしない。

## 技術方針

- Astro、TypeScript、npm を使用する。
- 完全な静的サイトとして生成する。
- サイトURL、ページパス、日英ラベルは `src/config/site.ts` を中心に管理する。
- 研究テーマ、メンバー、研究業績、ニュース、セミナーは Astro Content Collections で管理する。
- WCTP の既存静的サイトは `public/wctp/archive/` 以下に、元のディレクトリ構造をなるべく保って配置する。

## 日英ページの同期方針

- 日本語版を既定言語とし、サイトルート以下に配置する。
- 英語版は `/en/` 以下に配置する。
- 対応する日英ページを追加・変更するときは、原則として両方を更新する。
- 対応ページがない場合は、リンク切れにせず、代替先を `src/config/site.ts` で明示する。
- HTML の `lang`、canonical、hreflang が正しく出力されることを確認する。

## 検証コマンド

変更後は少なくとも次を実行する。

```powershell
npm install
npm run build
npm run check
npm run format:check
git diff --check
git status
```

lint を追加した場合は lint も実行する。

主要ページと内部リンク、`sitemap.xml`、`robots.txt`、`404.html`、`/wctp/`、`/en/` 配下を確認する。秘密情報らしい文字列が混入していないことも確認する。
