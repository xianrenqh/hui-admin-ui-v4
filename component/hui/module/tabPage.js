layui.define(['jquery', 'element', 'dropdown', 'page'], function (exports) {
	"use strict";

	var MOD_NAME = 'tabPage',
		$ = layui.jquery,
		dropdown = layui.dropdown,
		element = layui.element,
		page = layui.page;

	var tabPage = function (opt) {
		this.option = opt;
	};

	var tabData = new Array();
	var tabDataCurrent = 0;
	var contextTabDOM;

	tabPage.prototype.render = function (opt) {

		var option = {
			elem: opt.elem,
			data: opt.data,
			index: opt.index,
			tool: opt.tool || true,
			roll: opt.roll || true,
			success: opt.success ? opt.success : function (id) { },
			session: opt.session ? opt.session : false,
			preload: opt.preload ? opt.preload : false,
			height: opt.height || "100%",
			width: opt.width || "100%",
			closeEvent: opt.closeEvent,
			tabMax: opt.tabMax,
		}

		if (option.session) {
			if (sessionStorage.getItem(option.elem + "-pear-tab-page-data") != null) {
				tabData = JSON.parse(sessionStorage.getItem(option.elem + "-pear-tab-page-data"));
				option.data = JSON.parse(sessionStorage.getItem(option.elem + "-pear-tab-page-data"));
				tabDataCurrent = sessionStorage.getItem(option.elem + "-pear-tab-page-data-current");
				tabData.forEach(function (item, index) {
					if (item.id == tabDataCurrent) {
						option.index = index;
					}
				})
			} else {
				tabData = opt.data;
			}
		}

		var lastIndex;
		var tab = createTab(option);
		$("#" + option.elem).html(tab);
		$(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-prev").click(function () {
			rollPage("left", option);
		})
		$(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-next").click(function () {
			rollPage("right", option);
		})
		element.init();
		// 优化：滚动钮按需显示——仅当标签溢出时出现；滚动时维护到边禁用态
		$(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-title").on("scroll",
			function () { updateRollState(option); });
		$(window).on("resize." + option.elem, function () { updateRollState(option); });
		updateRollState(option);

		// 修复：异步填充面板（激活页优先；preload=true 时并行预载其余）
		$.each(option.data, function (i, item) {
			if (item.type === "_iframe") return;
			var isActive = (option.index == i);
			if (isActive || option.preload) {
				fillPanel(option, item);
			}
		});

		$("#" + option.elem).width(opt.width);
		$("#" + option.elem).height(opt.height);
		$("#" + option.elem).css({
			position: "relative"
		});

		closeEvent(option);

		option.success(sessionStorage.getItem(option.elem + "-pear-tab-page-data-current"));

		dropdown.render({
			elem: `#${option.elem} .layui-tab-control > .layui-icon-down`,
			trigger: 'hover',
			data: [{
				title: '关 闭 当 前',
				id: 1
			}, {
				title: '关 闭 其 他',
				id: 2
			}, {
				title: '关 闭 全 部',
				id: 3
			}],
			click: function (obj) {

				const id = obj.id;

				if (id === 1) {
					var currentTab = $(".layui-tab[lay-filter='" + option.elem +
						"'] .layui-tab-title .layui-this");
					if (currentTab.find("span").is(".able-close")) {
						var currentId = currentTab.attr("lay-id");
						tabDelete(option.elem, currentId, option.closeEvent, option);
					} else {
						layer.msg("当前页面不允许关闭", {
							icon: 3,
							time: 1000
						})
					}
				} else if (id === 2) {
					var currentId = $(".layui-tab[lay-filter='" + option.elem +
						"'] .layui-tab-title .layui-this").attr("lay-id");
					var tabtitle = $(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-title li");
					$.each(tabtitle, function (i) {
						if ($(this).attr("lay-id") != currentId) {
							if ($(this).find("span").is(".able-close")) {
								tabDelete(option.elem, $(this).attr("lay-id"), option.closeEvent,
									option);
							}
						}
					})
				} else {
					var currentId = $(".layui-tab[lay-filter='" + option.elem +
						"'] .layui-tab-title .layui-this").attr("lay-id");
					var tabtitle = $(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-title li");
					$.each(tabtitle, function (i) {
						if ($(this).find("span").is(".able-close")) {
							tabDelete(option.elem, $(this).attr("lay-id"), option.closeEvent, option);
						}
					})
				}

			}
		})

		$("body .layui-tab[lay-filter='" + option.elem + "'] .layui-tab-title").on("contextmenu", "li",
			function (e) {
				var top = e.clientY;
				var left = e.clientX;
				var menuWidth = 100;
				var menu = `<ul>
								<li class='item' id='${option.elem}closeThis'>关闭当前</li>
								<li class='item' id='${option.elem}closeOther'>关闭其他</li>
								<li class='item' id='${option.elem}closeAll'>关闭所有</li>
							</ul>`;

				contextTabDOM = $(this);
				var isOutsideBounds = (left + menuWidth) > $(window).width();
				if (isOutsideBounds) {
					left = $(window).width() - menuWidth;
				}

				layer.open({
					type: 1,
					title: false,
					shade: false,
					skin: 'pear-tab-page-menu',
					closeBtn: false,
					area: [menuWidth + 'px', '108px'],
					fixed: true,
					anim: false,
					isOutAnim: false,
					offset: [top, left],
					content: menu,
					success: function (layero, index) {
						layer.close(lastIndex);
						lastIndex = index;
						menuEvent(option, index);
						var timer;
						$(layero).on('mouseout', function () {
							timer = setTimeout(function () {
								layer.close(index);
							}, 30)
						});

						$(layero).on('mouseover', function () {
							clearTimeout(timer);
						});

						$(layero).on('contextmenu', function () {
							return false;
						})
					}
				});
				return false;
			})

		mousewheelAndTouchmoveHandler(option)
		return new tabPage(option);
	}

	tabPage.prototype.click = function (callback) {
		var option = this.option;
		var elem = this.option.elem;
		element.on('tab(' + this.option.elem + ')', function (data) {
			var id = $("#" + elem + " .layui-tab-title .layui-this").attr("lay-id");

			// 修复：懒加载——非 preload 模式下，首次切到未加载面板时才拉取
			var item = tabData.filter(function (t) { return String(t.id) == String(id); })[0];
			if (item && item.type !== "_iframe") {
				var $panel = $("#" + elem + " [id='" + item.id + "']");
				if ($panel.length && $panel.attr("data-loaded") !== "1") {
					fillPanel(option, item);
				}
			}

			// 修复：切换到已加载标签时同步 page 的活动标签 id，避免 getActive()/register() 拿到旧值
			page.setActive(id);

			sessionStorage.setItem(option.elem + "-pear-tab-page-data-current", id);
			callback(id);
		});
	}

	tabPage.prototype.positionTab = function () {
		var $tabTitle = $('.layui-tab[lay-filter=' + this.option.elem + ']  .layui-tab-title');
		var autoLeft = 0;
		$tabTitle.children("li").each(function () {
			if ($(this).hasClass('layui-this')) {
				return false;
			} else {
				autoLeft += $(this).outerWidth();
			}
		});
		$tabTitle.animate({
			scrollLeft: autoLeft - $tabTitle.width() / 3
		}, 200);
	}

	tabPage.prototype.clear = function () {
		sessionStorage.removeItem(this.option.elem + "-pear-tab-page-data");
		sessionStorage.removeItem(this.option.elem + "-pear-tab-page-data-current");
	}

	tabPage.prototype.changeTabTitleById = function (id, title) {
		var currentTab = $(".layui-tab[lay-filter='" + this.option.elem + "'] .layui-tab-title [lay-id='" + id + "'] .title");
		currentTab.html(title);
	}

	/**
	 * @since Pear Admin 4.0
	 * 
	 * 删除指定选项卡
	 * 
	 * @param id 编号
	 */
	tabPage.prototype.removeTab = function (id) {
		var elem = this.option.elem;
		if (id != undefined) {
			var currentTab = $(".layui-tab[lay-filter='" + elem + "'] .layui-tab-title [lay-id='" + id + "']");
			if (currentTab.find("span").is(".able-close")) {
				tabDelete(elem, id, () => { });
			}
		} else {
			var tabtitle = $(".layui-tab[lay-filter='" + elem + "'] .layui-tab-title li");
			$.each(tabtitle, function () {
				if ($(this).find("span").is(".able-close")) {
					tabDelete(elem, $(this).attr("lay-id"), () => { });
				}
			})
		}
	}

	/**
	 * @since Pear Admin 4.0
	 * 
	 * 删除其他选项卡
	 */
	tabPage.prototype.removeOtherTab = function () {
		var elem = this.option.elem;
		var currentId = $(".layui-tab[lay-filter='" + elem + "'] .layui-tab-title .layui-this").attr("lay-id");
		var tabtitle = $(".layui-tab[lay-filter='" + elem + "'] .layui-tab-title li");
		$.each(tabtitle, function () {
			if ($(this).attr("lay-id") != currentId) {
				if ($(this).find("span").is(".able-close")) {
					tabDelete(elem, $(this).attr("lay-id"), () => { });
				}
			}
		})
	}

	/**
	 * @since Pear Admin 4.0
	 * 
	 * 删除选中选项卡
	 */
	tabPage.prototype.removeCurrentTab = function () {
		var currentTab = $(".layui-tab[lay-filter='" + this.option.elem + "'] .layui-tab-title .layui-this");
		if (currentTab.find("span").is(".able-close")) {
			var currentId = currentTab.attr("lay-id");
			tabDelete(this.option.elem, currentId, () => { });
		}
	}

	/**
	 * @since Pear Admin 4.0
	 * 
	 * 切换选项卡
	 * 
	 * @param opt 内容
	 */
	tabPage.prototype.changePage = function (opt) {

		var title = `<span class="pear-tab-page-active"></span>
					 <span class="${opt.close ? 'able-close' : 'disable-close'} title">${opt.title}</span>
					 <i class="layui-icon layui-unselect layui-tab-close">ဆ</i>`;

		if ($(".layui-tab[lay-filter='" + this.option.elem + "'] .layui-tab-title li[lay-id]").length <=
			0) {

			var that = this;

if (opt.type === "_iframe") {

					element.tabAdd(this.option.elem, {
						id: opt.id,
						title: title,
						content: `<iframe id="${opt.id}" type="${opt.type}" data-frameid="${opt.id}" scrolling="auto" frameborder="0" src="${opt.url}" style="width:100%;height:100%;" allowfullscreen="true"></iframe>`
					});

				} else {
					// 修复：异步加载，不再 async:false 卡 UI
					element.tabAdd(this.option.elem, {
						id: opt.id,
						title: title,
						content: `<div id="${opt.id}" type="${opt.type}" data-frameid="${opt.id}" data-src="${opt.url}" data-loaded="0"></div>`
					});
					fillPanel(this.option, { id: opt.id, url: opt.url, type: opt.type });
				}

			tabData.push(opt);
			sessionStorage.setItem(that.option.elem + "-pear-tab-page-data", JSON.stringify(tabData));
			sessionStorage.setItem(that.option.elem + "-pear-tab-page-data-current", opt.id);

		} else {

			var isData = false;
			$.each($(".layui-tab[lay-filter='" + this.option.elem + "'] .layui-tab-title li[lay-id]"),
				function () {
					if ($(this).attr("lay-id") == opt.id) {
						isData = true;
					}
				})

			if (isData == false) {

				if (this.option.tabMax != false) {
					if ($(".layui-tab[lay-filter='" + this.option.elem + "'] .layui-tab-title li[lay-id]")
						.length >= this.option.tabMax) {
						layer.msg("最多打开" + this.option.tabMax + "个标签页", {
							icon: 2,
							time: 1000,
							shift: 6
						});
						return false;
					}
				}

var that = this;
					if (opt.type === "_iframe") {
						element.tabAdd(this.option.elem, {
							id: opt.id,
							title: title,
							content: `<iframe id="${opt.id}" type="${opt.type}" data-frameid="${opt.id}" scrolling="auto" frameborder="0" src="${opt.url}" style="width:100%;height:100%;" allowfullscreen="true"></iframe>`
						});
					} else {
						// 修复：异步加载，不再 async:false 卡 UI
						element.tabAdd(this.option.elem, {
							id: opt.id,
							title: title,
							content: `<div id="${opt.id}" type="${opt.type}" data-frameid="${opt.id}" data-src="${opt.url}" data-loaded="0"></div>`
						});
						fillPanel(this.option, { id: opt.id, url: opt.url, type: opt.type });
					}
				tabData.push(opt);
				sessionStorage.setItem(that.option.elem + "-pear-tab-page-data", JSON.stringify(tabData));
				sessionStorage.setItem(that.option.elem + "-pear-tab-page-data-current", opt.id);
			}
		}
		element.tabChange(this.option.elem, opt.id);
		sessionStorage.setItem(this.option.elem + "-pear-tab-page-data-current", opt.id);
		// 新开标签可能触发溢出，刷新滚动钮显隐/禁用态
		updateRollState(this.option);
	}

	/**
	 * 刷新当前选型卡
	 * 
	 * @param time 动画时长
	 */
	tabPage.prototype.refresh = function (time) {

		var $iframe = $(".layui-tab[lay-filter='" + this.option.elem + "'] .layui-tab-content .layui-show > *");
		var $iframeLoad;

		if (time != false && time != 0) {
			$iframeLoad = $("#" + this.option.elem).find(".pear-tab-page-loading");
			$iframeLoad.css({
				display: "block"
			});
		}

		if ($iframe.attr("type") === "_iframe") {
			$iframe.attr("src", $iframe.attr("src"));
			$iframe.on("load", function () {
				$iframeLoad.fadeOut(300, function () {
					$iframeLoad.css({
						display: "none"
					});
				});
			})
		} else {
			// 修复：刷新走 page 模块生命周期（destroy 后重载），并复用 loading 遮罩
			var $panel = $iframe;
			var pid = String($panel.attr("id") || '');
			page.destroy(pid);
			$panel.attr("data-loaded", "0").empty();
			page.setActive(pid);
			page.loadHtml($panel.attr("data-src")).then(function (html) {
				page.injectHtml(html, $panel, $panel.attr("data-src"));
				$panel.attr("data-loaded", "1");
				element.init();
				if ($iframeLoad != undefined) {
					$iframeLoad.fadeOut(300, function () {
						$iframeLoad.css({ display: "none" });
					});
				}
			}).catch(function (xhr) {
				if ($iframeLoad != undefined) $iframeLoad.fadeOut(200);
				return layer.msg('Status:' + ((xhr && xhr.status) || '') + '，' + ((xhr && xhr.statusText) || '') + '，请稍后再试！');
			});
		}
	}

	function tabDelete(elem, id, callback) {
		var tabTitle = $(".layui-tab[lay-filter='" + elem + "']").find(".layui-tab-title");
		var removeTab = tabTitle.find("li[lay-id='" + id + "']");
		var nextNode = removeTab.next("li");

		// 修复：关闭标签时销毁业务页生命周期（定时器/事件/弹层），防内存泄漏
		page.destroy(String(id));

		if (!removeTab.hasClass("layui-this")) {
			removeTab.remove();
			var tabContent = $(".layui-tab[lay-filter='" + elem + "']").find("*[id='" + id + "']")
				.parent();
			tabContent.remove();

			tabData = JSON.parse(sessionStorage.getItem(elem + "-pear-tab-page-data"));
			tabDataCurrent = sessionStorage.getItem(elem + "-pear-tab-page-data-current");
			tabData = tabData.filter(function (item) {
				return item.id != id;
			})
			sessionStorage.setItem(elem + "-pear-tab-page-data", JSON.stringify(tabData));
			return false;
		}

		var currId;
		if (nextNode.length) {
			nextNode.addClass("layui-this");
			currId = nextNode.attr("lay-id");
			$("#" + elem + " [id='" + currId + "']").parent().addClass("layui-show");
		} else {
			var prevNode = removeTab.prev("li");
			prevNode.addClass("layui-this");
			currId = prevNode.attr("lay-id");
			$("#" + elem + " [id='" + currId + "']").parent().addClass("layui-show");
		}
		callback(currId);
		tabData = JSON.parse(sessionStorage.getItem(elem + "-pear-tab-page-data"));
		tabDataCurrent = sessionStorage.getItem(elem + "-pear-tab-page-data-current");
		tabData = tabData.filter(function (item) {
			return item.id != id;
		})
		sessionStorage.setItem(elem + "-pear-tab-page-data", JSON.stringify(tabData));
		sessionStorage.setItem(elem + "-pear-tab-page-data-current", currId);
		removeTab.remove();
		var tabContent = $(".layui-tab[lay-filter='" + elem + "']").find("*[id='" + id + "']").parent();
		tabContent.remove();
		// 关闭标签后可能不再溢出，刷新滚动钮显隐/禁用态
		updateRollState({ elem: elem });
	}

	/**
	 * @since Pear Admin 4.0
	 */
	function createTab(option) {

		var type = "";
		if (option.roll == true) {
			type = "layui-tab-roll";
		}
		if (option.tool != false) {
			type = "layui-tab-tool";
		}
		if (option.roll == true && option.tool != false) {
			type = "layui-tab-rollTool";
		}
		var tab = '<div class="pear-tab-page ' + type + ' layui-tab" lay-filter="' + option.elem +
			'" lay-allowClose="true">';

		var headers = '<ul class="layui-tab-title">';
		var content = '<div class="layui-tab-content">';
		var loading = '<div class="pear-tab-page-loading"><div class="ball-loader"><span></span><span></span><span></span><span></span></div></div>'
		var control = `<div class="layui-tab-control">
							<li class="layui-tab-prev layui-icon layui-icon-left"></li>
							<li class="layui-tab-next layui-icon layui-icon-right"></li>
							<li class="layui-tab-tool layui-icon layui-icon-down"></li>
						</div>`;

		// 处 理 选 项 卡 头 部
		var index = 0;

		$.each(option.data, function (i, item) {

			var titleItem = `<li lay-id="${item.id}" class="${option.index == index ? 'layui-this' : ''}">
								<span class="pear-tab-page-active"></span>
								<span class="${item.close ? 'able-close' : 'disable-close'} title">
									${item.title}
								</span>
                                <i class="layui-icon layui-unselect layui-tab-close">ဆ</i></li>`;

			headers += titleItem;

			if (item.type === "_iframe") {

				content += `<div class="${option.index == index ? 'layui-show' : ''} layui-tab-item"><iframe id="${item.id}" type="${item.type}" data-frameid="${item.id}" scrolling="auto" frameborder="0" src="${item.url}" style="width:100%;height:100%;" allowfullscreen="true"></iframe></div>`

			} else {

				// 修复：去掉同步 Ajax（async:false 会卡死 UI）。
				// 先放占位容器，稍后由 fillPanel 异步填充（激活页优先，preload 控制其余）。
				content += `<div class="${option.index == index ? 'layui-show' : ''} layui-tab-item"><div id="${item.id}" type="${item.type}" data-frameid="${item.id}" data-src="${item.url}" data-loaded="0"></div></div>`;
			}

			index++;
		});

		headers += '</ul>';
		content += '</div>';

		tab += headers;
		tab += control;
		tab += content;
		tab += loading;
		tab += '</div>';
		tab += ''
		return tab;
	}

	/**
	 * @private 维护滚动钮状态：
	 * - 标签未溢出时隐藏 prev/next（tool 下拉钮不受影响）
	 * - 滚动到最左/最右时给按钮加 layui-disabled 禁用态
	 */
	function updateRollState(option) {
		var $box = $(".layui-tab[lay-filter='" + option.elem + "']");
		var title = $box.find(".layui-tab-title")[0];
		if (!title) return;
		var overflow = title.scrollWidth > title.clientWidth + 1;
		$box.toggleClass("layui-tab-overflow", overflow);
		$box.find(".layui-tab-prev").toggleClass("layui-disabled",
			title.scrollLeft <= 0);
		$box.find(".layui-tab-next").toggleClass("layui-disabled",
			title.scrollLeft + title.clientWidth >= title.scrollWidth - 1);
	}

	function rollPage(d, option) {
		var $tabTitle = $('#' + option.elem + '  .layui-tab-title');
		var left = $tabTitle.scrollLeft();
		if ('left' === d) {
			$tabTitle.animate({
				scrollLeft: left - 450
			}, 200, function () { updateRollState(option); });
		} else {
			$tabTitle.animate({
				scrollLeft: left + 450
			}, 200, function () { updateRollState(option); });
		}
	}

	function closeEvent(option) {
		$(".layui-tab[lay-filter='" + option.elem + "']").on("click", ".layui-tab-close", function () {
			var layid = $(this).parent().attr("lay-id");
			tabDelete(option.elem, layid, option.closeEvent, option);
		})
	}

	/**
	 * @since 4.0.4
	 *
	 * 异步填充单个标签面板（去 iframe 统一走 page 模块）：
	 * - 先 page.setActive(tabId)，保证业务页 register() 挂到正确的标签
	 * - page.injectHtml 会执行内联/外链脚本并登记生命周期
	 */
	function fillPanel(option, item) {
		var $panel = $("#" + option.elem + " [id='" + item.id + "']");
		if (!$panel.length || item.type === "_iframe") return Promise.resolve();
		if ($panel.attr("data-loaded") === "1") return Promise.resolve();
		// 并发去重：防止菜单点击与 render/click 懒加载同时触发两次 loadHtml（脚本会执行两遍）
		if ($panel.attr("data-loading") === "1") return Promise.resolve();
		$panel.attr("data-loading", "1");

		// 透传可选 id 隔离开关
		page.option.scopeId = option.scopeId === true;
		page.setActive(item.id);
		return page.loadHtml(item.url).then(function (html) {
			page.injectHtml(html, $panel, item.url);
			$panel.attr("data-loaded", "1").removeAttr("data-loading");
			element.init();
		}).catch(function (xhr) {
			$panel.attr("data-loaded", "1").removeAttr("data-loading");
			$panel.html('<div class="pear-page-error">Status:' + ((xhr && xhr.status) || '') +
				'，' + ((xhr && xhr.statusText) || '') + '，请稍后再试！</div>');
			layer.msg('Status:' + ((xhr && xhr.status) || '') + '，' + ((xhr && xhr.statusText) || '') + '，请稍后再试！');
		});
	}

	function menuEvent(option, index) {

		$("#" + option.elem + "closeThis").click(function () {
			var currentTab = contextTabDOM;

			if (currentTab.find("span").is(".able-close")) {
				var currentId = currentTab.attr("lay-id");
				tabDelete(option.elem, currentId, option.closeEvent, option);
			} else {
				layer.msg("当前页面不允许关闭", {
					icon: 3,
					time: 800
				})
			}
			layer.close(index);
		})

		$("#" + option.elem + "closeOther").click(function () {
			var currentId = contextTabDOM.attr("lay-id");
			var tabtitle = $(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-title li");
			$.each(tabtitle, function (i) {
				if ($(this).attr("lay-id") != currentId) {
					if ($(this).find("span").is(".able-close")) {
						tabDelete(option.elem, $(this).attr("lay-id"), option.closeEvent,
							option);
					}
				}
			})
			layer.close(index);
		})

		$("#" + option.elem + "closeAll").click(function () {
			var tabtitle = $(".layui-tab[lay-filter='" + option.elem + "'] .layui-tab-title li");
			$.each(tabtitle, function (i) {
				if ($(this).find("span").is(".able-close")) {
					tabDelete(option.elem, $(this).attr("lay-id"), option.closeEvent, option);
				}
			})
			layer.close(index);
		})
	}

	function mousewheelAndTouchmoveHandler(option) {
		var $bodyTab = $("body .layui-tab[lay-filter='" + option.elem + "'] .layui-tab-title")
		var $tabTitle = $('#' + option.elem + '  .layui-tab-title');
		var mouseScrollStep = 100
		// 鼠标滚轮
		$bodyTab.on("mousewheel DOMMouseScroll", function (e) {
			e.originalEvent.preventDefault()
			var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? "top" :
				"down")) || // chrome & ie
				(e.originalEvent.detail && (e.originalEvent.detail > 0 ? "down" : "top")); // firefox
			var scrollLeft = $tabTitle.scrollLeft();

			if (delta === "top") {
				scrollLeft -= mouseScrollStep
			} else if (delta === "down") {
				scrollLeft += mouseScrollStep
			}
			$tabTitle.scrollLeft(scrollLeft)
		});

		// 触摸移动
		var touchX = 0;
		$bodyTab.on("touchstart", function (e) {
			var touch = e.originalEvent.targetTouches[0];
			touchX = touch.pageX
		})
		$bodyTab.on("touchmove", function (e) {
			var event = e.originalEvent;
			if (event.targetTouches.length > 1) return;
			event.preventDefault();
			var touch = event.targetTouches[0];
			var distanceX = touchX - touch.pageX
			var scrollLeft = $tabTitle.scrollLeft();
			touchX = touch.pageX
			$tabTitle.scrollLeft(scrollLeft += distanceX)
		});
	}

	exports(MOD_NAME, new tabPage());
})
