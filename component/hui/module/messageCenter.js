layui.define(['table', 'jquery', 'element', 'dropdown'], function (exports) {
    "use strict";

    var MOD_NAME = 'messageCenter',
        $ = layui.jquery,
        dropdown = layui.dropdown;

    var message = function (opt) {
        this.option = opt;
    };

    /**
     * 修复（相对 4.0.3）：
     * 1. 接口失败/超时不再静默（原版 code!=200 时连图标都不渲染）
     * 2. 兼容 code:200 / success:true / data 数组 三种返回
     * 3. 未读数以红点徽标显示
     */
    message.prototype.render = function (opt) {
        var option = {
            elem: opt.elem,
            url: opt.url ? opt.url : false,
            height: opt.height,
            data: opt.data
        }
        if (option.url != false) {
            $.get(option.url).done(function (result) {
                result = result || {};
                var data = result.data || result.list || [];
                if (result.code == 200 || result.success || $.isArray(result)) {
                    if ($.isArray(result)) data = result;
                    option.data = data;

                    var unread = data.filter(function (m) { return !m.read; }).length;
                    $(`${opt.elem}`).append(`<li class="layui-nav-item" lay-unselect="">
                        <a href="#" class="notice layui-icon layui-icon-notice"></a>
                        ${unread > 0 ? `<span class="pear-msg-badge">${unread > 99 ? '99+' : unread}</span>` : ''}
                        </li>`);

                    dropdown.render({
                        elem: option.elem,
                        align: "center",
                        content: createHtml(option),
                    })
                } else {
                    renderFallback(opt);
                }
            }).fail(function () {
                // 接口失败：保留入口图标，不渲染下拉（不打断壳启动）
                renderFallback(opt);
            });
        }
        return new message(option);
    }

    function renderFallback(opt) {
        if ($(`${opt.elem} .notice`).length) return;
        $(`${opt.elem}`).append(`<li class="layui-nav-item" lay-unselect="">
            <a href="#" class="notice layui-icon layui-icon-notice" title="消息服务不可用"></a></li>`);
    }

    message.prototype.click = function (callback) {
        $("*[notice-id]").click(function (event) {
            event.preventDefault();
            var id = $(this).attr("notice-id");
            var title = $(this).attr("notice-title");
            var context = $(this).attr("notice-context");
            var form = $(this).attr("notice-form");
            callback(id, title, context, form);
        })
    }

    /**
     * message.json 为分组结构：data[] -> { id, title, children[] }
     * 按分组渲染：组名做分隔标题，子项可点击（notice-id 取子项 id）
     */
    function createHtml(option) {
        var ul = '<ul class="message-tab-ul">';
        $.each(option.data, function (i, group) {
            ul += '<li class="message-tab-group" lay-unselect>' +
                '<div class="message-tab-title"><span>' + (group.title || '') + '</span></div></li>';

            var children = group.children || [];
            if (!children.length) {
                ul += '<li class="message-tab-empty" lay-unselect><div class="message-tab-context"><span>暂无内容</span></div></li>';
            }
            $.each(children, function (j, item) {
                var avatar = item.avatar ? `<img class="message-tab-avatar" src="${item.avatar}" alt="" onerror="this.style.display='none'">` : '';
                ul += `<li notice-id="${item.id}" notice-title="${item.title}" notice-context="${item.context}" notice-form="${item.form}">
                    ${avatar}
                    <div class="message-tab-body">
                        <div class="message-tab-title">
                            <span>${item.title}</span>
                        </div>
                        <div class="message-tab-context">
                            <span>${item.context}</span>
                        </div>
                        <div class="message-tab-form">
                            <span>${item.form}</span>
                            <span>${item.time}</span>
                        </div>
                    </div>
                </li>`;
            });
        });
        ul += '</ul>';
        return ul;
    }

    exports(MOD_NAME, new message());
})