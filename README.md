<div align="center">

<br/>
<br/>

  <h1 align="center">
    Hui Admin Layui
  </h1>
  <h4 align="center">
    开 箱 即 用 的 中 后 台 前 端 模 板
  </h4>

</div>

<p align="center">
    <a href="https://xianrenqh.github.io/hui-admin-ui-v4/">
        <img src="https://img.shields.io/badge/在线演示-GitHub Pages-2b7fff.svg" alt="在线演示">
    </a>
    <a href="#">
        <img src="https://img.shields.io/badge/Hui Admin Layui-4.0.4-green.svg" alt="Hui Admin Layui Version">
    </a>
    <a href="#">
        <img src="https://img.shields.io/badge/JQuery-2.0+-green.svg" alt="Jquery Version">
    </a>
    <a href="#">
        <img src="https://img.shields.io/badge/Layui-2.13-blue.svg" alt="Layui Version">
    </a>
    <a href="#">
        <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
    </a>
</p>
<br>

<div align="center">
  <img width="92%" style="border-radius:10px;margin-top:20px;margin-bottom:20px;box-shadow: 2px 0 6px gray;" src="admin/images/banner.png" />
</div>

## 在线演示

> **演示地址**：[https://xianrenqh.github.io/hui-admin-ui-v4/](https://xianrenqh.github.io/hui-admin-ui-v4/)

纯静态部署，GitHub 仓库每次推送后自动发布最新版本。演示站包含完整功能：动态菜单、多标签页、消息中心、主题定制、暗色模式、动态验证码登录/注册。

## 项目介绍

Hui Admin 是一款开箱即用的中后台前端开发模板，基于原生 layui 构建，无需 Node 编译环境，克隆即用、部署即用。

- 全局 API 为 `window.HuiAdmin`，配置驱动、模块化扩展，上手成本低
- 内置 标签页路由、多级菜单、菜单搜索、消息中心、主题定制 等中后台常用能力
- 提供 动态验证码 登录 / 注册页面，开箱即可搭建完整的应用外壳
- 所有页面与组件均为真实可运行的案例，拿来即改

项目不定时更新，建议 Star、Watch 一份。

## 特性一览

### 框架能力

- [轻量] 无构建流程，静态资源直接运行，部署成本极低（任意静态服务器 / GitHub Pages / Gitee Pages）。
- [配置驱动] `hui.config.yml` 单文件配置 Logo、菜单、主题色、默认页、消息接口等全部外壳行为。
- [兼容] `window.PearAdmin` 作为 `window.HuiAdmin` 的别名保留，存量业务代码平滑过渡。
- [优化] `logout` 方法返回值由 boolean 调整为 Promise 类型。

### 页面路由

- [重构] page.js / tabPage.js 模块，移除 iframe 嵌套，支持标签页生命周期。
- [新增] 标签页 id / lay-filter 冲突隔离，多实例页面互不干扰。
- [新增] 5 种菜单打开方式：当前页 / 新标签页 / 新窗口 / 抽屉 / 弹层。

### 交互体验

- [新增] menuSearch.js 模块，全局菜单快捷搜索。
- [新增] messageCenter.js 消息中心：分组列表、未读统计、头像消息流。
- [新增] 夜间模式整体适配，框架级配色跟随主题面板实时切换。
- [新增] 主题面板：6 套主题色 + 菜单/顶栏明暗组合自由切换。

### 业务组件（extends）

| 组件 | 说明 |
| ---- | ---- |
| popup | 页面弹层封装 |
| toast | 轻提示（主题样式适配） |
| notice | 通知提醒 |
| watermark | 页面水印 |
| count | 数字滚动 |
| echarts / echartsTheme | 图表及主题 |
| nprogress | 顶部加载进度条 |
| yaml | 配置文件解析 |

## 仓库地址

| 平台 | 地址 |
| ---- | ---- |
| Gitee（主仓库） | [https://gitee.com/xianrenqh/hui-admin-ui-v4](https://gitee.com/xianrenqh/hui-admin-ui-v4) |
| GitHub（镜像，自动同步） | [https://github.com/xianrenqh/hui-admin-ui-v4](https://github.com/xianrenqh/hui-admin-ui-v4) |

> 提交到 Gitee 后会同步推送 GitHub，两仓库保持一致。

## 快速开始

```bash
# 从 Gitee 克隆
git clone https://gitee.com/xianrenqh/hui-admin-ui-v4.git

# 或从 GitHub 克隆
git clone https://github.com/xianrenqh/hui-admin-ui-v4.git
```

直接使用静态服务器打开根目录 `index.html` 即可，例如：

```bash
# 方式一：npx serve
npx serve -l 5501 .

# 方式二：VSCode Live Server 插件
```

默认登录页支持动态验证码，开箱即可体验完整流程。

## 配置说明

核心配置集中在 `config/hui.config.yml`：

```yaml
## 网站配置
logo:
  title: "Hui Admin"          ## 网站名称
  image: "admin/images/logo.png"  ## 网站图标

## 菜单配置
menu:
  data: "admin/data/menu.json"    ## 菜单数据（支持静态 JSON / 后端接口）
  accordion: true                 ## 菜单手风琴

## 视图内容配置
tab:
  enable: true                    ## 多选项卡
  keepState: true                 ## 保持视图状态
  session: true                   ## 标签页记忆（刷新后恢复）
  index:
    href: "view/analysis/index.html"  ## 首页地址

## 主题配置
theme:
  defaultColor: "2"               ## 默认主题色
  defaultMenu: "dark-theme"       ## 菜单主题：黑 / 白
  dark: false                     ## 默认夜间模式
```

## 目录结构

```
Hui Admin Layui
│
├─admin 资源
│    │
│    ├─css 样式（含 hui-theme.css 主题覆盖）
│    │
│    ├─data 数据（菜单 / 消息 / 表格模拟数据）
│    │
│    ├─images 图片
│    │
│    └─js 脚本
│
├─component 组件
│    │
│    ├─layui 核心框架
│    │
│    └─hui 扩展组件（hui.js 入口 + module 模块 + extends 业务组件）
│
├─config 配置
│    │
│    └─hui.config.yml 配置文件
│
├─view 视图
│    │
│    ├─analysis 分析页
│    │
│    ├─component 组件案例
│    │
│    ├─console 控制台
│    │
│    ├─exception 错误页（403 / 404 / 500）
│    │
│    ├─listing 列表页
│    │
│    ├─profile 个人中心
│    │
│    └─result 结果页
│
├─index.html 入口
│
└─login.html / register.html 登录与注册
```

## 部署

- **任意静态服务器**：整包上传即可，无需编译。
- **GitHub Pages**：仓库内置 `.github/workflows/pages.yml`，推送到 `master` 自动发布。
- **Gitee Pages**：将仓库内容手动部署即可（Gitee Pages 需实名认证后开启）。

## 开源共建

1. 欢迎提交 Pull Request，请保持提交内容与对应 issue 关联。
2. 欢迎提交 Issue，请写清楚遇到问题的原因、开发环境、复现步骤。

如果对您有帮助，您可以点右上角 💘Star💘 支持