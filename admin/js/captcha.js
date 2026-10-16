/**
 * @since Pear Admin 4.0
 *
 * Canvas 动态验证码（无后端依赖，前端本地校验）
 *
 * 用法：
 *   <canvas class="captcha-canvas" width="100" height="40"></canvas>
 *   Captcha.render(document.querySelector('.captcha-canvas'));   // 生成/刷新
 *   Captcha.check(canvas, inputEl);                              // 校验（忽略大小写）
 */
(function (window) {
	"use strict";

	// 去掉易混淆字符：0 O 1 l I
	var CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

	function randomChar() {
		return CHARS.charAt(Math.floor(Math.random() * CHARS.length));
	}

	function random(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	var Captcha = {

		/**
		 * 在 canvas 上绘制 4 位验证码，并把答案挂在 canvas.dataset.code 上
		 * @param {HTMLCanvasElement} canvas
		 * @param {Number} [len=4] 字符数
		 */
		render: function (canvas, len) {
			len = len || 4;
			var w = canvas.width, h = canvas.height;
			var ctx = canvas.getContext('2d');
			var code = '';

			// 背景
			ctx.clearRect(0, 0, w, h);
			ctx.fillStyle = '#f6f8f9';
			ctx.fillRect(0, 0, w, h);

			// 干扰线
			for (var i = 0; i < 4; i++) {
				ctx.strokeStyle = 'rgba(' + random(80, 200) + ',' + random(80, 200) + ',' + random(80, 200) + ',0.5)';
				ctx.beginPath();
				ctx.moveTo(random(0, w), random(0, h));
				ctx.lineTo(random(0, w), random(0, h));
				ctx.stroke();
			}

			// 字符
			var charW = w / (len + 1);
			for (var n = 0; n < len; n++) {
				var ch = randomChar();
				code += ch;
				ctx.save();
				ctx.translate(charW * (n + 0.5) + random(-4, 4), h / 2 + random(-3, 3));
				ctx.rotate((random(-25, 25) * Math.PI) / 180);
				ctx.font = random(20, 26) + 'px sans-serif';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillStyle = 'rgb(' + random(30, 120) + ',' + random(30, 120) + ',' + random(30, 120) + ')';
				ctx.fillText(ch, 0, 0);
				ctx.restore();
			}

			// 噪点
			for (var d = 0; d < 24; d++) {
				ctx.fillStyle = 'rgba(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ',0.4)';
				ctx.fillRect(random(0, w), random(0, h), 2, 2);
			}

			canvas.dataset.code = code;
			return code;
		},

		/**
		 * 校验输入（忽略大小写）
		 * @param {HTMLCanvasElement} canvas
		 * @param {HTMLInputElement} input
		 * @returns {Boolean}
		 */
		check: function (canvas, input) {
			var expect = (canvas.dataset.code || '').toLowerCase();
			var actual = (input.value || '').trim().toLowerCase();
			return expect !== '' && actual === expect;
		}
	};

	window.Captcha = Captcha;
})(window);