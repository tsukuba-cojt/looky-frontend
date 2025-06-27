# Contribution Guide

## Branch
1. devブランチに移動する  

   ```bash
   git checkout dev
   ```
2. 開発するブランチを作成する  
   ```bash
   git branch feature-[ブランチ名]
   ```
3. 開発するブランチに移動する  
   ```bash
   git checkout feature-[ブランチ名]
   ```
4. リモートに反映する  
   ```bash
   git push origin HEAD
   ```

## Development
1. 開発するブランチに移動する  
   ```bash
   git checkout feature-[ブランチ名]
   ```
2. 変更内容を取得する  
   ```bash
   git pull origin dev
   ```

## Commit
**コミット方法**  

  ```bash
  git add -A
  git commit -m "コミットメッセージ"
  git push origin HEAD
  ```
  コミットメッセージは `"主題: 内容"` の形式にする

**主題について**

| 主題 | 内容                           |
| ---------- | ------------------------------ |
| fix        | バグ修正                       |
| hotfix     | クリティカル（深刻）なバグ修正 |
| add        | 新規（ファイル）機能追加       |
| update     | 機能修正（バグではない）       |
| change     | 仕様変更                       |
| clean      | 整理（リファクタリング等）     |
| disable    | 無効化（コメントアウト等）     |
| remove     | 削除（ファイル）               |
| upgrade    | バージョンアップ               |
| revert     | 変更取り消し                   |

## Merge
   プルリクエストを作成する  
   例: `base: dev ← compare home-ui`