# 小红书移动端原型（HTML）

打开 `index.html` 作为入口页；各页面均为静态 HTML，可直接双击浏览或用本地静态服务器预览。

## 页面
- `home.html` 首页瀑布流
- `discover.html` 发现页
- `search.html` 搜索页
- `note.html` 笔记详情页
- `publish.html` 发布入口
- `publish-edit.html` 发布编辑页
- `messages.html` 消息（支持 `?tab=notify|chat`）
- `profile.html` 个人主页
- `login.html` 登录注册

## 状态切换
在任意页面后追加 `?state=normal|loading|empty|error`，例如：
- `home.html?state=loading`

