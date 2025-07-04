# Supabase Edge Functions
Supabase Edge Functionsで提供する3つのエンドポイントについてまとめます。

<br />

## エンドポイント一覧

| Method | Path | Name | 概要 |
| ------ | ---- | ---- | ---- |
| POST | `/upload`   | **upload**   | アップロード用の署名付き URL を発行する |
| GET  | `/generate` | **generate** | 服の推薦をリクエストする |
| POST | `/download` | **download** | ダウンロード用の署名付き URL を発行する |

<br />
<br />

## `/upload`

### Overview
S3にファイルをアップロードするための署名付きURLを生成します。

<br />

### Body
```jsonc
{
  "bucket_name": "string",  // バケット名 (必須)
  "object_key":  "string",  // オブジェクトキー (必須)
  "content_type": "string"   // MIME タイプ (省略可)
}
```

<br />

### Response

| Status | Body | 説明 |
| ------ | ---- | ---- |
| 200 | `{ "url": "string" }` | 署名付きURL |
| 400 | `{ "error": "string" }` | エラーメッセージ |

<br />

> [!WARNING]
> URLの有効期限は3600秒に設定しています。

<br />
<br />

## `/generate`

### Overview
ユーザ ID に基づいて、バックエンドへ服の推薦された画像を生成するリクエストを送ります。

<br />

### Header

| Header | 例 | 説明 |
| ------ | ---- | ---- |
| Authorization | `Bearer <JWT>` | セッショントークン |

<br />

### Response

| Status | Body | 説明 |
| ------ | ---- | ---- |
| 200 | `{ "data": any }` | レスポンスデータ |
| 400 | `{ "error": "string" }` | エラーメッセージ |

<br />
<br />

## `/download`

### Overview
S3からファイルをダウンロードするための署名付きURLを生成します。

<br />

### Body
```jsonc
{
  "bucket_name": "string",  // バケット名 (必須)
  "object_key":  "string"   // オブジェクトキー (必須)
}
```

<br />

### Response

| Status | Body | 説明 |
| ------ | ---- | ---- |
| 200 | `{ "url": "string" }` | 生成した署名付き URL |
| 400 | `{ "error": "string" }` | バリデーションエラー等 |

<br />

> [!WARNING]
> URLの有効期限は3600秒に設定しています。


