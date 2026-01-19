# 怎么做（How）

## 页面结构
- 顶部 `header.topbar`：统一标题栏、当前页标题、进度
- 左侧 `aside.sidebar`：缩略图目录（默认展开），按钮折叠/展开
- 右侧 `main.stage`：叠放的 `section.slide`，仅显示当前页

## 交互
- 缩略图点击：跳转到对应页
- 键盘：
  - `←` 上一页，`→` 下一页
  - `Home` 第一页，`End` 最后一页
- URL hash：`#1/#2/...` 用于刷新/分享定位（离线可用）

## 动画与风格
- 仅使用淡入 + 轻微位移（`opacity` + `translateY`）
- 适配 `prefers-reduced-motion`
- 手绘感封面插图：内联 SVG（无需外链资源）

