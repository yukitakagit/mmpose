# MMPose 仕様書概要

## 1. 概要 (Introduction)
MMPoseは、PyTorchベースのオープンソースな姿勢推定（Pose Estimation）ツールボックスであり、OpenMMLabプロジェクトの一部です。

## 2. 主な特徴 (Major Features)
- **多様なタスクのサポート**:
  - 2D複数人姿勢推定
  - 2D手・指先の姿勢推定
  - 2D顔ランドマーク検出
  - 133キーポイント全身姿勢推定
  - 3D人メッシュ復元
  - ファッションランドマーク検出
  - 動物姿勢推定
- **高効率かつ高精度**: 
  - トップダウン方式およびボトムアップ方式を含む、複数の最先端(SOTA)深層学習モデルを実装。
  - 独自の最適化により、HRNetなどの他の一般的なコードベースと比較して、高速な推論・学習速度と高い精度を実現。
- **多様なデータセットのサポート**: 
  - COCO, AIC, MPII, MPII-TRB, OCHumanなど多数の主要データセットを標準でサポート。
- **優れた拡張性と設計**: 
  - コンポーネントが細かくモジュール化されており、これらを組み合わせることでカスタマイズされた姿勢推定モデルを容易に構築可能。

## 3. 注目のモデル・プロジェクト (Key Models & Projects)
- **RTMPose / RTMO**: リアルタイム性能に特化した最先端の推論モデル（単一人物・複数人物）。
- **RTMW / RTMW3D**: 2Dおよび3Dの全身姿勢推定（Wholebody Pose Estimation）向けリアルタイムモデル。
- **PoseAnything**: オープンボキャブラリ/ゼロショットでの任意のキーポイント検出に対応する汎用モデル。

## 4. サポートされている技術・バックボーン (Supported Architectures)
- **アルゴリズム**: DeepPose, CPM, Hourglass, SimpleBaseline(2D/3D), HRNet (LiteHRNet, HigherHRNet), RTMPose等々。
- **バックボーンネットワーク**: ResNet, Swin Transformer, HRFormer, PVT, MobileNetV2, ShuffleNetなどに対応。

## 5. ライセンス・リソース (License & Links)
- **ライセンス**: Apache 2.0 License
- **ドキュメント**: 詳細なAPIリファレンスとチュートリアル（ReadTheDocs）が用意されており、推論・学習・デプロイまでのワークフローが網羅されています。
