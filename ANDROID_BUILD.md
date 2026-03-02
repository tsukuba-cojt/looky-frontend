# Android ビルド手順

このドキュメントでは、Looky の Android アプリケーションをビルドしてエミュレータまたはデバイスで実行する手順を説明します。

## 必要な環境

- Android SDK (API Level 35)
- JDK 21 以上（Android Studio に同梱）
- Android Studio または Gradle CLI

## 初期セットアップ（初回のみ）

### 1. `android/local.properties` を作成

Android SDK のパスを指定します。

**Windows の場合：**
```properties
sdk.dir=C:\Users\<ユーザー名>\AppData\Local\Android\Sdk
```

**macOS の場合：**
```properties
sdk.dir=/Users/<ユーザー名>/Library/Android/sdk
```

**Linux の場合：**
```properties
sdk.dir=/home/<ユーザー名>/Android/Sdk
```

### 2. `android/gradle.properties` に JDK パスを追加

Gradle が使用する JDK を明示的に指定します。

**Windows の場合：**
```properties
org.gradle.java.home=C:\Program Files\Android\Android Studio\jbr
```

**macOS の場合：**
```properties
org.gradle.java.home=/Applications/Android\ Studio.app/Contents/jbr/Contents/Home
```

## Debug ビルド（開発用）

開発中のコード変更をホットリロードで確認したい場合に使用します。Metro サーバーが必要です。

### ステップ 1: Metro サーバーを起動

別のターミナルで実行し、ずっと待機状態を保つ：

```bash
pnpm exec expo start --dev-client --port 8081
```

サーバーが起動すると、以下のようなメニューが表示されます：

```
› Press w │ open web
› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
...
```

**この画面は閉じないでください。** ウィンドウはこのまま待機状態を保ちます。

### ステップ 2: Debug APK をビルド

新しいターミナルを開いて：

```bash
cd android
./gradlew assembleDebug --no-daemon
cd ..
```

ビルド完了後、APK は以下の場所に生成されます：
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### ステップ 3: エミュレータに転送して実行

```bash
adb install -r ./android/app/build/outputs/apk/debug/app-debug.apk
adb shell monkey -p com.looky.app -c android.intent.category.LAUNCHER 1
```

エミュレータ上でアプリが起動し、Expo ロゴが表示されたら、Metro サーバーからコードをダウンロードします。

## Release ビルド（本番用）

Metro サーバーなしで単独実行する本番ビルドです。配信やテストに使用します。

### ステップ 1: Release APK をビルド

```bash
cd android
./gradlew assembleRelease --no-daemon
cd ..
```

ビルド完了後、APK は以下の場所に生成されます：
```
android/app/build/outputs/apk/release/app-release.apk
```

### ステップ 2: エミュレータに転送して実行

```bash
adb install -r ./android/app/build/outputs/apk/release/app-release.apk
adb shell monkey -p com.looky.app -c android.intent.category.LAUNCHER 1
```

Release ビルドはサーバー不要なため、すぐにアプリが起動します。

### ステップ 3: 実デバイスへのインストール

1. APK を任意の方法でデバイスに転送
2. デバイス側で APK をタップしてインストール
3. 「Looky」アプリを開いて起動

## トラブルシューティング

### ビルドが遅い

`android/gradle.properties` で メモリ割り当てを確認してください：

```properties
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m
```

より多くのメモリがある場合は、`-Xmx4096m` など増やしてください。

### エミュレータが見つからない

```bash
adb devices
```

で接続状態を確認します。表示されない場合：

```bash
# エミュレータの再起動
emulator -avd Pixel_9

# ADB デーモンをリセット
adb kill-server
adb start-server
```

### Metro に接続できない（Expo ロゴで止まる）

1. **ファイアウォール設定を確認** - ポート 8081 が通信可能か確認
2. **Metro サーバーが起動しているか確認** - ターミナルで `pnpm exec expo start --dev-client --port 8081` を実行
3. **ポート競合** - ポート 8081 が他のプロセスで使用されていないか確認：
   ```bash
   netstat -ano | findstr :8081  # Windows
   lsof -i :8081                  # macOS/Linux
   ```

### "adb: device offline" エラー

```bash
adb kill-server
adb start-server
adb devices
```

### ビルドエラー：Node コマンドが見つからない

`android/app/build.gradle` で Node.js パスが正しく設定されているか確認してください。

```bash
which node  # Node.js パスを表示
```

Node.js がインストールされていない場合は、[nodejs.org](https://nodejs.org/) からインストールしてください。

## よくある質問

### Q: Debug と Release の違いは？

- **Debug**: Metro サーバーからコードを受け取るため、変更がリアルタイムに反映される。開発時に便利。
- **Release**: APK 内にすべてを含むため、サーバー不要で単独実行可。本番環境やテスト配信に向く。

### Q: ビルドなしで変更を反映できる？

Debug ビルドの場合、Metro サーバーがコードを再読み込みします。ファイル保存後、エミュレータで「 r キー」を押すか、サーバーのメニューから「reload app」を選択してください。

### Q: Google Play に配信する場合は？

Release ビルドを署名付き APK として生成し、Play Console からアップロードします。詳細は [Android 公式ドキュメント](https://developer.android.com/studio/publish/app-signing) を参照してください。

## 関連リンク

- [Android Studio 公式サイト](https://developer.android.com/studio)
- [Expo Documentation](https://docs.expo.dev/)
- [Gradle ドキュメント](https://docs.gradle.org/)
- [React Native 公式ドキュメント](https://reactnative.dev/)
