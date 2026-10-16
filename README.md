<div align="center">

<br/>
<br/>

  <h1 align="center">
    Hui Admin Layui
  </h1>
  <h4 align="center">
    开 箱 即 用 的 前 后 端 解 决 方 案
  </h4> 

  基于 Pear Admin Layui 深度优化的独立维护版本

</div>

<p align="center">
    <a href="#">
        <img src="https://img.shields.io/badge/Hui Admin Layui-4.0.4-green.svg" alt="Hui Admin Layui Version">
    </a>
    <a href="#">
        <img src="https://img.shields.io/badge/JQuery-2.0+-green.svg" alt="Jquery Version">
    </a>
      <a href="#">
        <img src="https://img.shields.io/badge/Layui-2.13.9-green.svg" alt="Layui Version">
    </a>
</p>
<br>
<div align="center">
  <img  width="92%" style="border-radius:10px;margin-top:20px;margin-bottom:20px;box-shadow: 2px 0 6px gray;" src="https://gitee.com/pear-admin/Pear-Admin-Layui/raw/3.x/admin/images/show.png" />
</div>
<br>

### 项目介绍

<p style="padding:10px;"  width="90%">

Hui Admin 是一款开箱即用的前端开发模板，提供便捷快速的开发方式，延续 Admin 的设计规范。
基于 [Pear Admin Layui](https://gitee.com/pear-admin/Pear-Admin-Layui) 二次开发优化：layui 2.13.9、标签页生命周期、id 冲突隔离、5 种菜单打开方式、动态验证码登录/注册等。

本仓库为独立维护版本，全局 API 已更名为 `window.HuiAdmin`（`window.PearAdmin` 保留为兼容别名），后续在新 git 仓库自行维护。

项目不定时更新，建议 Star watch 一份

</p>

### 新特性                            

- [重构] frame.js 组件，重命名为 page.js, 移除 iframe 嵌套。
- [重构] tab.js 组件，重命名为 tabPage.js, 移除 iframe 嵌套。
- [新增] admin.js 模块 setConfigurationProvider 方法，用于自定义 configuration 来源。
- [优化] admin.js 模块 logout 方法，返回值由 boolean 调整为 Promise 类型。 
- [新增] 夜间模式适配，目前已完成整体框架兼容，layui 待完成。
- [新增] menuSearch.js 模块，原有的菜单搜索功能。

### Branch 说明

<p style="padding:10px;"  width="90%">

main: 最新的功能，主要维护的版本。

package: 通过 gulp.js 提供打包构建，适合对资源加载和编译速度有要求的项目。

i18n: 集成 translate.js 提供 i18n 国际化功能的版本。

</p>

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
│    └─images 图片
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
│    └─result 结果页
│
├─index.html 入口
│
└─login.html 登录

```

### 项目截图

|  |  |
|---------------------|---------------------|
|![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/221841_9d135fe6_4835367.png "屏幕截图.png")  | ![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/221901_b5282417_4835367.png "屏幕截图.png")  |
|![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/221920_84f71864_4835367.png "屏幕截图.png")|  ![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/221953_eacb1578_4835367.png "屏幕截图.png")  |
|![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/222007_334b5411_4835367.png "屏幕截图.png")| ![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/222020_ed5e67ac_4835367.png "屏幕截图.png")  |
|![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/222105_9a1036c6_4835367.png "屏幕截图.png")|  ![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/222116_50936543_4835367.png "屏幕截图.png")   |
|![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/222150_6251bb30_4835367.png "屏幕截图.png")|  ![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/222206_777ccf74_4835367.png "屏幕截图.png")  |
|![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/222315_712d2942_4835367.png "屏幕截图.png")|![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/222345_2629d03c_4835367.png "屏幕截图.png")   |
|![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/222410_e83792fa_4835367.png "屏幕截图.png")| ![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/222431_5b884442_4835367.png "屏幕截图.png")   |
|![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/222453_b02034b2_4835367.png "屏幕截图.png")| ![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/222508_fec3ad5e_4835367.png "屏幕截图.png")   |
|![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/222533_abda701e_4835367.png "屏幕截图.png")|![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/222547_db49f0b8_4835367.png "屏幕截图.png")   |
|![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/222611_7ffd378b_4835367.png "屏幕截图.png")|![输入图片说明](https://images.gitee.com/uploads/images/2021/0331/222625_55e092f3_4835367.png "屏幕截图.png")   |

### 开源共建

<p style="padding:10px;"  width="90%">

1. 欢迎提交 [pull request](https://gitee.com/pear-admin/Pear-Admin-Layui/pulls)，注意对应提交对应 `main` 分支

2. 欢迎提交 [issue](https://gitee.com/pear-admin/Pear-Admin-Layui/issues)，请写清楚遇到问题的原因、开发环境、复显步骤。

</p>

感谢每一位贡献代码的朋友。

如果对您有帮助，您可以点右上角 💘Star💘 支持
