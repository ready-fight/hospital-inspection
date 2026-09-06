# 病院設備 定期点検システム — Production Delivery Base

Next.js 16 / TypeScript で構築した、タブレット優先の設備定期点検Webシステムです。

この納品版は、依頼文に明示されている範囲に絞っています。

- 現場タブレットでの点検入力
- 直感的な OK / 異常 / 対象外 入力
- 点検コメント
- ブラウザ音声入力（対応ブラウザのみ）
- 手書きサイン
- IndexedDBによる端末内自動保存
- オフライン時の提出待ちキュー
- 通信復旧時の自動再送
- Appwriteへの点検結果保存
- Appwrite Storageへのサイン画像保存
- PWA / Service Workerによるアプリシェルキャッシュ
- `/api/health` ヘルスチェック

## 1. 起動

```bash
npm install
cp .env.example .env.local
npm run dev
```

http://localhost:3000 を開きます。

Appwrite未接続でも画面・端末保存・サイン・音声入力は確認できます。ただし「提出」はサーバー接続エラーになり、入力内容は端末に保持されます。

## 2. Appwriteで作成するもの

### Database

任意のDatabaseを1つ作成し、そのIDを `NEXT_PUBLIC_APPWRITE_DATABASE_ID` に設定してください。

### inspections Table

以下の属性を作成します。

| 属性 | 型 | 必須 | 推奨サイズ |
|---|---|---:|---:|
| clientInspectionId | string | Yes | 36 |
| hospitalId | string | Yes | 64 |
| hospitalName | string | Yes | 255 |
| equipmentId | string | Yes | 64 |
| equipmentName | string | Yes | 255 |
| inspectorId | string | No | 64 |
| inspectorName | string | Yes | 128 |
| inspectionDate | string | Yes | 10 |
| itemsJson | string | Yes | 10000 |
| signatureFileId | string | Yes | 36 |
| createdAt | string | Yes | 40 |
| updatedAt | string | Yes | 40 |
| submittedAt | string | Yes | 40 |

Table IDを `NEXT_PUBLIC_APPWRITE_INSPECTIONS_TABLE_ID` に設定します。

### Signature Storage Bucket

サイン用bucketを作成し、IDを `NEXT_PUBLIC_APPWRITE_SIGNATURE_BUCKET_ID` に設定します。PNGを許可してください。

## 3. Appwrite Web Platform

Appwrite Project → Platforms で、このアプリを配信するWebホストを登録します。

開発時:

- hostname: `localhost`

本番時:

- 例: `inspection.example.co.jp`

## 4. Permissions / Authentication

この依頼文だけでは「誰がログインするか」「病院側にもアカウントを発行するか」が未確定なので、認証画面は勝手に仕様化していません。

本番公開前には、少なくとも協力会社作業員の認証を追加し、Table/Bucketを `Any` 書き込み可能にはしないでください。推奨は Appwrite Auth のユーザー/Team単位権限です。

`lib/appwrite.ts` がサーバー接続箇所です。Auth仕様決定後、ここに現在ユーザー情報とDocument/File permissionsを追加します。

## 5. Offline設計

入力中データは `IndexedDB` の `hospital-inspection-db` に保存されます。

状態:

- `draft`: 入力中
- `queued`: オフライン等で提出待ち
- `syncing`: 送信中
- `submitted`: サーバー保存済み
- `failed`: 送信失敗、端末に保持

ブラウザが `online` に戻ると `queued` / `failed` を再送します。

重要: ブラウザの「オンライン」はインターネット/API到達を保証しないため、実際のAppwrite送信が成功するまで `submitted` にはしません。

## 6. 音声入力

Web Speech APIを利用しています。ブラウザによって対応状況が異なります。iPad/Safari等、実際に納品対象となる端末で必ず受入試験してください。

## 7. PWA

production buildでは `/sw.js` を登録します。初回オンラインアクセス後、アプリシェルをキャッシュし、通信が切れた後も画面を再表示できる構成です。

点検データそのものはService WorkerではなくIndexedDBで保持します。

## 8. 本番公開前にクライアントから必要な情報

1. Appwrite project / database / collection / bucket の各ID
2. 実際の病院一覧
3. 実際の設備一覧
4. 実際の点検項目・帳票内容
5. 誰がサインするか（病院担当者 / 点検担当者など）
6. ログイン対象と権限（協力会社・設備会社・病院）
7. 提出後、設備会社と病院へどう報告するか（画面閲覧 / PDF / メール等）
8. 本番ドメイン
9. 実際に使用するタブレット機種・ブラウザ

## 9. 依頼文に無いため未実装の機能

以下は勝手に追加していません。

- 管理画面
- 病院/設備マスタ編集画面
- 点検スケジュール
- PDF帳票
- メール通知
- 承認/差戻し
- 過去報告書検索
- 写真添付
- 複数会社/詳細権限

これらは追加仕様として実装できます。

## 10. Production check

```bash
npm run typecheck
npm run build
npm start
```

本番環境ではHTTPSで配信してください。PWA、Service Worker、マイク利用はHTTPS前提で検証するのが安全です。
