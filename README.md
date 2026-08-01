# Lambda Laboratory Website

Lambda Laboratory の公式Webサイトです。研究室の研究内容、メンバー、研究業績、ニュース、教育、セミナー、WCTP、アクセス・連絡先を静的サイトとして公開するためのリポジトリです。

公開ページには、Webサイト掲載用として承認された情報のみを掲載します。News、Seminars、Education、WCTP は、公開可能な内容を確認できたものから順次追加します。

News、Seminars、Education、WCTP は実データが揃うまで主要ナビゲーションと `sitemap.xml` から外し、各ページには `noindex, follow` を設定します。実データ追加後は、対象ページをナビゲーションへ戻し、`noindex` を解除し、`sitemap.xml` に戻してください。

## 技術構成

- Astro
- TypeScript
- npm
- Astro Content Collections
- 完全な静的サイト生成
- GitHub Pages で公開可能な構成
- 外部CMS、外部データベース、サーバーサイド処理は不使用

将来の正式URLは `https://www.lambda.comp.isct.ac.jp/` です。独自ドメインはまだ有効化しません。

## 必要な Node.js バージョン

Node.js 22 LTS 以降を推奨します。GitHub Actions でも Node.js 22 を使用します。

## 初期セットアップ

```powershell
npm install
```

## ローカル開発サーバー

```powershell
npm run dev
```

表示されたローカルURLをブラウザで開いて確認します。

## 本番ビルド

```powershell
npm run build
```

`dist/` に静的ファイルが生成されます。

## プレビュー

```powershell
npm run preview
```

## 検査

```powershell
npm run check
npm run format:check
git diff --check
```

lint は現時点では構成していません。必要になった時点で、Astro/TypeScript に合わせて最小構成で追加します。

## コンテンツの追加と更新

構造化コンテンツは `src/content/` 以下で管理します。

- `src/content/research/`: 研究テーマ
- `src/content/members/`: メンバー
- `src/content/publications/`: 研究業績
- `src/content/news/`: ニュース
- `src/content/seminars/`: セミナー

メンバー分類は `faculty`, `staff`, `students`, `alumni`, `collaborators` を扱えます。

研究業績は `src/data/publications.json` で公開用データとして管理します。このJSONは `private-source/publications/abstract.csv` と `private-source/publications/recent-publications-2022-2026.bib` から生成しますが、原資料CSVとBibTeXはGitへ追加しません。

```powershell
npm run import:publications
```

CSV変換時には `record_status=verified` と `record_status=partially_verified` のみを公開候補として取り込みます。`record_status=unresolved` と `record_status=non_publication` は除外します。BibTeX由来のレコードは `record_status=user_provided_bibtex` として取り込みます。`verification_notes`、`notes`、`source_row_number` などの内部管理情報は公開用JSONへ含めません。

研究業績分類は `journal`, `conference`, `book`, `workshop`, `other` を扱えます。DOI、URL、著者、タイトル、出版年、掲載先、注記を必要に応じて保持できます。

実在する情報を追加するときは、公開許可と表記を確認してください。推測で人物、住所、連絡先、研究業績を追加してはいけません。

新しい研究業績データが追加提供された場合は、同じ公開可否ルールでCSV、BibTeX、または変換スクリプトを更新し、`npm run import:publications`、`npm run check`、`npm run build` を実行してから反映してください。重複や正規レコードの扱いは `scripts/publication-overrides.json` に監査可能な理由つきで記録します。

## 日本語版と英語版

日本語版を既定言語とし、サイトルート以下に配置します。英語版は `/en/` 以下に配置します。

各ページには対応する言語切替があります。対応ページがないページを将来追加する場合は、言語切替先をホームまたは最も近い上位ページにするなど、リンク切れにならない挙動を `src/config/site.ts` で明示してください。

HTML の `lang` 属性、canonical、hreflang は共通レイアウトで設定します。

## WCTP 既存HTMLの移行方法

WCTP の入口ページは `/wctp/` です。過去の静的サイトは `public/wctp/archive/` 以下へ配置できます。

例:

```text
public/wctp/archive/2024/index.html
public/wctp/archive/2024/style.css
public/wctp/archive/2024/images/example.png
public/wctp/archive/2024/files/example.pdf
```

この場合、公開パスは `/wctp/archive/2024/` になります。既存HTML内の相対リンクをなるべく維持するため、元サイトのディレクトリ構造を保ったまま配置してください。

PHP、CGI、その他のサーバーサイド処理には依存しないでください。必要な動作は静的HTML、CSS、画像、PDF、最小限のクライアントサイドJavaScriptへ置き換えてください。

WCTP2025 や WCTP2026 の実データはまだ作成していません。

## GitHub Pages への公開

`.github/workflows/pages.yml` に GitHub Pages 用のワークフローがあります。

- `main` への push でビルドとデプロイを行います。
- `pull_request` ではビルドと検査のみを行い、デプロイしません。
- ワークフロー権限は必要最小限にしています。

GitHub Pages の設定画面で Source を GitHub Actions にする必要がありますが、このリポジトリ内の作業では設定画面を操作しません。

独自ドメイン設定と `CNAME` ファイルの追加は後で行います。現時点では `CNAME` ファイルを作成しません。

## ディレクトリ構成

```text
.
├── .github/workflows/pages.yml
├── public/
│   ├── robots.txt
│   └── wctp/archive/
├── src/
│   ├── components/
│   ├── config/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   └── utils/
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

## 秘密情報と個人情報

秘密情報、APIキー、認証トークン、非公開メールアドレス、非公開電話番号、個人住所、未承認の個人情報をコミットしないでください。

公開前に `git diff`、生成ファイル、Markdown、JSON を確認し、秘密情報らしい文字列が混入していないことを確認してください。

`private-source/` は非公開原資料置き場であり、Git管理外です。履歴書PDF、原資料CSV、研究テーマ原稿などをそのまま `public/` や公開ページへコピーしてはいけません。独自ドメイン設定とDNS設定はまだ行いません。
