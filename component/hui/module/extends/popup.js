layui.define(['layer'], function (exports) {
	"use strict";

	/**
	 * @since Pear Admin
	 *
	 * Popup —— 基于 layer 的语义化弹窗封装（源自 3.x popup 方案，4.0 整理版）：
	 * 1. 修复原版 success/failure 重复定义（前三段死代码被覆盖）问题
	 * 2. 修正拼写 warming -> warning（保留 warming 别名兼容旧调用）
	 * 3. 消息停留时长不再写死，可通过 popup.config.duration 全局配置
	 * 4. 新增 confirm / open / info 常用场景封装
	 *
	 * 用法：
	 *   var popup = layui.popup;
	 *   popup.success('成功消息');
	 *   popup.failure('失败消息', function () { ... });
	 *   popup.warning('警告消息');
	 *   popup.confirm('确定删除吗？', function (index) { layer.close(index); });
	 *   popup.open({ title: '编辑', type: 2, area: ['80%', '80%'], content: '/edit.html' });
	 */
	var MOD_NAME = 'popup',
		layer = layui.layer;

	var popup = new function () {

		// 全局默认配置（可按需覆盖）
		this.config = {
			duration: 1000
		};

		function showMsg(msg, icon, callback) {
			layer.msg(msg, {
				icon: icon,
				time: popup.config.duration
			}, callback);
		}

		/**
		 * 成功提示（icon 1）
		 */
		this.success = function (msg, callback) {
			showMsg(msg, 1, callback);
		};

		/**
		 * 失败提示（icon 2）
		 */
		this.failure = function (msg, callback) {
			showMsg(msg, 2, callback);
		};

		/**
		 * 警告提示（icon 3）
		 */
		this.warning = function (msg, callback) {
			showMsg(msg, 3, callback);
		};

		/**
		 * 兼容旧版拼写 warming -> warning
		 */
		this.warming = function (msg, callback) {
			this.warning(msg, callback);
		};

		/**
		 * 无图标纯文本提示（层叠轻量场景，如"已保存"）
		 */
		this.info = function (msg, callback) {
			layer.msg(msg, {}, callback);
		};

		/**
		 * 询问框
		 * @param content  内容
		 * @param ok       确定回调（参数为 layer 的 index，需自行关闭）
		 * @param cancel   取消/右上角关闭回调（可省略）
		 * @param options  追加覆盖 layer.confirm 的其它配置（icon、title、btn 等）
		 */
		this.confirm = function (content, ok, cancel, options) {
			var opt = Object.assign({
				icon: 3,
				title: '确认'
			}, options || {});
			layer.confirm(content, opt, ok, cancel);
		};

		/**
		 * 打开弹窗（layer.open 薄封装，统一标题风格）
		 * @param options  layer.open 配置：{ title, type, area, content, success, end ... }
		 */
		this.open = function (options) {
			var opt = Object.assign({
				title: '信息',
				shade: 0.3
			}, options || {});
			return layer.open(opt);
		};
	};

	exports(MOD_NAME, popup);
});