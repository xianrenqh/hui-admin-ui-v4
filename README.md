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

### 项目介绍

<p style="padding:10px;" width="90%">

Hui Admin 是一款开箱即用的中后台前端开发模板，基于原生 layui 构建，无需 Node 编译环境，克隆即用。

- 全局 API 为 `window.HuiAdmin`，配置驱动、模块化扩展，上手成本低
- 内置 标签页路由、多级菜单、菜单搜索、消息中心、主题定制 等中后台常用能力
- 提供 动态验证码 登录 / 注册页面，开箱即可搭建完整的应用外壳
- 兼容 IE8 以上主流浏览器（依赖 layui 内核能力）

项目不定时更新，建议 Star、Watch 一份。

</p>

### 特性一览

- [轻量] 无构建流程，静态资源直接运行，部署成本极低。
- [重构] page.js / tabPage.js 模块，移除 iframe 嵌套，支持标签页生命周期。
- [新增] admin.js 模块 setConfigurationProvider 方法，支持自定义配置来源。
- [优化] admin.js 模块 logout 方法，返回值由 boolean 调整为 Promise 类型。
- [新增] 夜间模式整体适配，框架级配色跟随主题面板实时切换。
- [新增] menuSearch.js 模块，全局菜单快捷搜索。
- [新增] 标签页 id / lay-filter 冲突隔离，多实例页面互不干扰。
- [新增] 5 种菜单打开方式：当前页 / 新标签页 / 新窗口 / 抽屉 / 弹层。

### 快速开始

```bash
git clone https://gitee.com/xianrenqh/hui-admin-ui-v4.git
```

直接使用静态服务器（如 VSCode Live Server、`npx serve .`）打开根目录 `index.html` 即可，默认登录页支持动态验证码。

### 项目结构

```
Hui Admin Layui
│
├─admin 资源
│    │
│    ├─css 样式
│    │
│    ├─data 数据
│    │
│    ├─images 图片
│    │
│    └─js 脚本
│
├─component 组件
│    │
│    ├─layui 核心框架
│    │
│    └─hui 扩展组件
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
│    ├─exception 错误页
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

### 开源共建

<p style="padding:10px;" width="90%">

1. 欢迎提交 Pull Request，请保持提交内容与对应 issue 关联。
2. 欢迎提交 Issue，请写清楚遇到问题的原因、开发环境、复现步骤。

</p>

如果对您有帮助，您可以点右上角 💘Star💘 支持