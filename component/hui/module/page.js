layui.define(['jquery', 'element'], function (exports) {
	"use strict";

	var $ = layui.jquery;
	var element = layui.element;

	/**
	 * 修复记录（相对 Pear Admin 4.0.3 原版 page.js）：
	 * 1. 去掉同步 Ajax（async:false），改为 Promise 异步 + loading 遮罩，避免卡 UI
	 * 2. 新增页面生命周期：register / destroy（按 tabId 登记，供 tabPage 关闭时回收）
	 * 3. 新增 uid() / $()：解决 keepState 多标签下 DOM id / lay-filter 冲突
	 * 4. loadHtml / injectHtml 供 tabPage 复用，行为与单页一致
	 */
	var page = function (opt) {
		this.option = opt || {};
		this._registry = {};
		this._activeId = '_single';
	};

	/**
	 * @since Pear Admin 4.0
	 *
	 * 创建 Page 页面
	 */
	page.prototype.render = function (opt) {
		var option = {
			elem: opt.elem,
			url: opt.url,
			width: opt.width || "100%",
			height: opt.height || "100%",
			title: opt.title
		}
		this.option = option;
		this._activeId = '_single';
		renderContent(option);
		this.changePage({ href: option.url, type: "_component" });
		return this;
	}

	/**
	 * 设置当前激活 tabId（tabPage 切换时调用）
	 */
	page.prototype.setActive = function (id) {
		this._activeId = id || '_single';
	}

	page.prototype.getActive = function () {
		return this._activeId || '_single';
	}

	/**
	 * 生成带标签作用域的 DOM id，避免多标签同页 id 冲突。
	 * 业务页写法：table.render({ elem: '#' + layui.page.uid('userTable') })
	 */
	page.prototype.uid = function (name, tabId) {
		var id = tabId || this._activeId || '_single';
		var safe = String(name || '').replace(/[^a-zA-Z0-9_-]/g, '-');
		return 'pear-' + id + '-' + safe;
	}

	/**
	 * 在当前页面容器内查询；'#name' 自动映射 uid 后的实际 id。
	 */
	page.prototype.$ = function (selector) {
		var $root = this.panel();
		if (!$root.length) return $(selector);
		if (typeof selector === 'string' && selector.charAt(0) === '#' && selector.indexOf(' ') === -1) {
			var raw = selector.slice(1);
			var $hit = $root.find('#' + this.uid(raw));
			if ($hit.length) return $hit;
			return $root.find('#' + raw);
		}
		return $root.find(selector);
	}

	/**
	 * 当前页面内容根节点
	 */
	page.prototype.panel = function (tabId) {
		var id = tabId || this._activeId || '_single';
		var $byScope = $(`[data-frameid='${id}']`);
		if ($byScope.length) return $byScope;
		return $('#content .pear-page-content').first();
	}

	/**
	 * @since 4.0.4 生命周期登记
	 *
	 * 业务页在脚本末尾调用：
	 *   layui.page.register({ init: fn, destroy: fn });
	 * 关闭标签 / 非 keepState 切走 / 刷新时，壳会调用 destroy 回收资源。
	 */
	page.prototype.register = function (pageObj, id) {
		var key = id || this._activeId || '_single';
		this._registry[key] = pageObj || null;
	}

	page.prototype.destroy = function (id) {
		var key = id || this._activeId || '_single';
		var cur = this._registry[key];
		if (cur && typeof cur.destroy === 'function') {
			try { cur.destroy(); } catch (e) { console.warn('[pear.page] destroy error:', e); }
		}
		delete this._registry[key];
	}

	/**
	 * @since Pear Admin 4.0
	 *
	 * 切换 Page 页面
	 */
	page.prototype.changePage = function (options) {
		var $frame = $(`#${this.option.elem} .pear-page-content`);
		if (!$frame.length) return;

		this.destroy('_single');
		this._activeId = '_single';

		if (options.type === "_iframe") {
			$frame.html(`<iframe src='${options.href}' scrolling='auto' frameborder='0' allowfullscreen='true'></iframe>`);
		} else {
			this._load(options.href, $frame);
		}
		$frame.attr("type", options.type);
		$frame.attr("href", options.href);
	}

	/**
	 * 拉取 HTML（Promise）
	 */
	page.prototype.loadHtml = function (href) {
		return new Promise(function (resolve, reject) {
			$.ajax({
				url: href,
				type: 'get',
				dataType: 'html',
				cache: false,
				success: resolve,
				error: reject
			});
		});
	}

	/**
	 * 注入 HTML 到容器：DOM + 内联/外链脚本
	 * @param href 页面自身 URL（可选）。注入模式下片段会被搬进壳文档，
	 *             相对路径必须按页面自身 URL 预先解析成绝对 URL，
	 *             否则部署在子路径（如 GitHub Pages /hui-admin-ui-v4/）时
	 *             `../../xxx` 会被解析到域名根目录导致 404。
	 */
	page.prototype.injectHtml = function (html, container, href) {
		var $frame = container.jquery ? container : $(container);
		var baseUrl = href || $frame.attr('href') || $frame.attr('data-src') || '';
		// baseUrl 可能是页面相对路径（如 view/analysis/index.html），必须先转绝对 URL
		if (baseUrl) {
			try { baseUrl = new URL(baseUrl, location.href).href; } catch (e) { baseUrl = ''; }
		}
		var parsed = this._parseFragment(html, baseUrl);
		this._scopeDom(parsed.nodes);
		$frame.empty().append(parsed.nodes);

		parsed.scripts.forEach(function (item) {
			if (item.src) {
				var s = document.createElement('script');
				s.src = this._resolveUrl(item.src, baseUrl);
				if (item.async) s.async = true;
				document.body.appendChild(s);
			} else if (item.code) {
				(0, eval)(item.code);
			}
		});
	}

	page.prototype.refresh = function (loading) {
		var self = this;
		var $frameLoad = $(`#${this.option.elem} .pear-page-loading`);
		var $frame = $(`#${this.option.elem} .pear-page-content`);
		if (loading) {
			$frameLoad.css({ display: 'block' });
		}
		if ($frame.attr("type") === "_iframe") {
			$frame.html(`<iframe src='${$frame.attr("href")}' scrolling='auto' frameborder='0' allowfullscreen='true'></iframe>`);
			const $contentFrame = $frame.find("iframe");
			$contentFrame.on("load", () => {
				$frameLoad.fadeOut(300);
			})
		} else {
			var href = $frame.attr("href");
			this.destroy('_single');
			this._load(href, $frame).then(function () {
				$frameLoad.fadeOut(300);
			});
		}
	}

	/**
	 * @private 拉取并注入（含错误提示）
	 */
	page.prototype._load = function (href, $frame) {
		var self = this;
		if (!href) return Promise.resolve();
		return this.loadHtml(href).then(function (html) {
			self.injectHtml(html, $frame, href);
			element.init();
		}).catch(function (xhr) {
			if (xhr instanceof Error) {
				// 注入阶段抛异常（非 ajax 失败），输出真实错误便于排查
				console.error('[pear.page] 页面注入失败:', xhr);
			}
			$frame.html('<div class="pear-page-error">Status:' + ((xhr && xhr.status) || '') +
				'，' + ((xhr && xhr.statusText) || '') + '，请稍后再试！</div>');
		});
	}

	/**
	 * @private 将相对 URL 解析为绝对 URL（以 baseUrl 为基准）；
	 *          协议相对 / data: / blob: / 锚点等保持原样。
	 */
	page.prototype._resolveUrl = function (url, baseUrl) {
		if (!url) return url;
		if (/^(?:https?:)?\/\/|^data:|^blob:|^mailto:|^javascript:|^tel:|^#/i.test(url)) return url;
		try {
			if (baseUrl) baseUrl = new URL(baseUrl, location.href).href;
			return new URL(url, baseUrl || location.href).href;
		} catch (e) {
			return url;
		}
	}

	/**
	 * @private 分离 DOM 与 script
	 */
	page.prototype._parseFragment = function (html, baseUrl) {
		var template = document.createElement('template');
		// 与原版 $frame.html(data) 行为对齐：整页解析注入。
		// <head> 里的 <link>/<style> 会被片段解析解包进 content，注入后样式继续生效；
		// <title>/<meta> 注入面板内无害。若只截取 <body>，页面级样式会全部丢失。
		template.innerHTML = html;

		var scripts = [];
		// 仅提取可执行脚本；type="text/html" 等模板节点（laytpl 工具栏/单元格模板）
		// 必须保留在 DOM 中供 laytpl 按 id 读取，绝不能 eval（否则抛 Unexpected token '<'）
		var EXECUTABLE = ['', 'text/javascript', 'application/javascript', 'module'];
		// 注入模式下相对路径按页面自身 URL 预解析为绝对 URL（子路径部署兼容）
		if (baseUrl) {
			var SELF_CLOSING_URL = /^(?:https?:)?\/\/|^data:|^blob:|^mailto:|^javascript:|^tel:|^#/i;
			Array.prototype.forEach.call(
				template.content.querySelectorAll('[src], [href]'),
				function (el) {
					['src', 'href'].forEach(function (attr) {
						var val = el.getAttribute(attr);
						if (!val || SELF_CLOSING_URL.test(val)) return;
						try {
							el.setAttribute(attr, new URL(val, baseUrl).href);
						} catch (e) { /* 非法 URL 保持原样 */ }
					});
				});
		}
		var scriptNodes = template.content.querySelectorAll('script');
		Array.prototype.forEach.call(scriptNodes, function (node) {
			var type = (node.getAttribute('type') || '').trim().toLowerCase();
			if (EXECUTABLE.indexOf(type) === -1) return; // 模板节点留在片段里
			scripts.push({
				src: node.getAttribute('src') || '',
				code: node.textContent || '',
				async: node.hasAttribute('async')
			});
			node.parentNode.removeChild(node);
		});
		return { nodes: template.content, scripts: scripts };
	}

	/**
	 * @private 给片段内 id / for / lay-filter 加当前页前缀（可选启用）
	 * 默认关闭以兼容存量页面；配置 tab.scopeId: true 后开启。
	 */
	page.prototype._scopeDom = function (root) {
		if (!this.option.scopeId) return;
		var prefix = this.uid('');
		var nodes = root.querySelectorAll('[id], [for], [lay-filter]');
		Array.prototype.forEach.call(nodes, function (el) {
			['id', 'for', 'lay-filter'].forEach(function (attr) {
				var val = el.getAttribute(attr);
				if (!val || val.indexOf('pear-') === 0) return;
				if (attr === 'id' && (val === 'side' || val === 'content')) return;
				el.setAttribute(attr, prefix + val);
				if (attr === 'id') el.setAttribute('data-raw-id', val);
			});
		});
	}

	function renderContent(option) {
		$("#" + option.elem).html(`
			<div class='pear-page'>
				<div class='pear-page-content' type='${option.type}' href='${option.url}'></div>
				<div class="pear-page-loading">
					<div class="ball-loader">
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			</div>`);
	}

	exports('page', new page());
});