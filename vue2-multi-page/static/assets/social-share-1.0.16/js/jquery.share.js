/**
 * Share.js
 *
 * @link 	http://overtrue.me/share.js
 * @author  overtrue <i@overtrue.me>
 * @license MIT
 *
 * @example
 * <pre>
 * $('.share-components').share();
 *
 * // or
 *
 * $('.share-bar').share({
 *     sites: ['qzone', 'qq', 'weibo','wechat'],
 *     // ...
 * });
 * </pre>
 */
;(function($){
	//Hacfin
	var $_share_templates = {
		qzone       : 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{URL}}&title={{TITLE}}&desc={{DESCRIPTION}}&summary={{SUMMARY}}&site={{SOURCE}}&pics={{IMAGE}}',
		qq          : 'http://connect.qq.com/widget/shareqq/index.html?url={{URL}}&title={{TITLE}}&source={{SOURCE}}&desc={{DESCRIPTION}}&summary={{SUMMARY}}&site={{SOURCE}}&pics={{IMAGE}}',
		tencent     : 'http://share.v.t.qq.com/index.php?c=share&a=index&title={{TITLE}}&url={{URL}}&pic={{IMAGE}}',
		weibo       : 'http://service.weibo.com/share/share.php?url={{URL}}&title={{TITLE}}&pic={{IMAGE}}&appkey={{WEIBOKEY}}',
		wechat      : '/wechat/share?url={{URL}}&title={{TITLE}}&summary={{SUMMARY}}&pics={{IMAGE}}',
		douban      : 'http://shuo.douban.com/!service/share?href={{URL}}&name={{TITLE}}&text={{DESCRIPTION}}&image={{IMAGE}}&starid=0&aid=0&style=11',
		diandian    : 'http://www.diandian.com/share?lo={{URL}}&ti={{TITLE}}&type=link',
		linkedin    : 'http://www.linkedin.com/shareArticle?mini=true&ro=true&title={{TITLE}}&url={{URL}}&summary={{SUMMARY}}&source={{SOURCE}}&armin=armin',
		facebook    : 'https://www.facebook.com/sharer/sharer.php?u={{URL}}&title={{TITLE}}&description={{DESCRIPTION}}&caption={{SUBHEAD}}&link={{URL}}&picture={{IMAGE}}',
		twitter     : 'https://twitter.com/intent/tweet?text={{TITLE}}&url={{URL}}&via={{SITE_URL}}',
		google      : 'https://plus.google.com/share?url={{URL}}'
	};

	//Hacfin
	/**
	 * Build the url of icon.
	 *
	 * @param {String} $name
	 * @param {Object} $data
	 *
	 * @return {String}
	 */
	$.fn.share_makeurl = function ($name, $data) {
		var $template = $_share_templates[$name];
		if($data['summary'] == undefined)
			$data['summary'] = $data['description'];

		for (var $key in $data) {
			if ($data.hasOwnProperty($key)) {
				var $camelCaseKey = $name + $key.replace(/^[a-z]/, function($str){
							return $str.toUpperCase();
						});

				var $value = encodeURIComponent($data[$camelCaseKey] === undefined ? $data[$key] : $data[$camelCaseKey]);
				$template = $template.replace(new RegExp('{{'+$key.toUpperCase()+'}}', 'g'), $value);
			}
		}

		return $template;
	};

	/**
	 * Create the wechat icon and QRCode.
	 *
	 * @param {Object|String} $container
	 * @param {Object}        $data
	 */
	$.fn.share_createWechat = function ($container, $data) {
		var $wechat = $container.find('a.icon-wechat');

		$().share_generateWechat($wechat, $data);
	};

	$.fn.share_generateWechat = function ($wechat, $data) {
		if (!$wechat.length) {return;}

		$wechat.append('<div class="wechat-qrcode"><h4>'+$data.wechatQrcodeTitle+'</h4><div class="qrcode"></div><div class="help">'+$data.wechatQrcodeHelper+'</div></div>');

		$wechat.find('.qrcode').qrcode({render: 'image', size: $data.wechatQrcodeSize, text: $data.url});

		if ($wechat.offset().top < 100) {
			$wechat.find('.wechat-qrcode').addClass('bottom');
		}
	};
    //Hacfin
    $.fn.share_generateWechatPC = function ($wechat, $data) {
        if (!$wechat.length) {return;}

        $wechat.append('<div class="qrcode QR-code-con"></div>');

        $wechat.find('.qrcode').qrcode({render: 'image', size: $data.wechatQrcodeSize, text: $data.url});

    };

	/**
	 * Detect wechat browser.
	 *
	 * @return {Boolean}
	 */
	$.fn.runningInWeChat = function () {
		return /MicroMessenger/i.test(navigator.userAgent);
	};

	/**
     * Initialize a share bar.
     *
     * @param {Object}        $options globals (optional).
     *
     * @return {Void}
     */
    $.fn.share = function ($options) {
        var $head = $(document.head);

		var $defaults = {
			url               : location.href,
			site_url          : location.origin,
			source            : $head.find('[name=site], [name=Site]').attr('content') || document.title,
			title             : $head.find('[name=title], [name=Title]').attr('content') || document.title,
			description       : $head.find('[name=description], [name=Description]').attr('content') || '',
			// image             : $('img:first').prop('src') || '',
			//Hacfin
            image             : '',
			imageSelector     : undefined,
			weiboKey          : '',
			wechatQrcodeTitle : '分享到微信朋友圈',
			wechatQrcodeHelper: '<p>微信里点“发现”，扫一下</p><p>二维码便可将网页分享至朋友圈。</p>',
			wechatQrcodeSize  : 100,

			mobileSites: [],
			sites      : ['weibo', 'qq', 'wechat', 'tencent', 'douban', 'qzone', 'linkedin', 'diandian', 'facebook', 'twitter', 'google'],
			disabled   : [],
			initialized: false
		};

        var $globals = $.extend({}, $defaults, $options);

		var $ariaLabels = {
			qzone   : "QQ空间",
			qq      : "QQ",
			tencent : "腾讯微博",
			weibo   : "微博",
			wechat  : "微信",
			douban  : "豆瓣",
			diandian: "点点",
			linkedin: "LinkedIn",
			facebook: "Facebook",
			twitter : "Twitter",
			google  : "Google"
		};

        this.each(function() {
            if ($(this).data('initialized')) {
                return true;
            }

            var $data      = $.extend({}, $globals, $(this).data());
            if ($data.imageSelector) {
                $data.image = $($data.imageSelector).map(function() {
                    return $(this).prop('src');
                }).get().join('||');
            }
            var $container = $(this).addClass('share-component social-share');

            createIcons($container, $data);
			// $().share_createWechat($container, $data);

            $(this).data('initialized', true);
        });

        /**
         * Create site icons
         *
         * @param {Object|String} $container
         * @param {Object}        $data
         */
        function createIcons ($container, $data) {
            var $sites = getSites($data);

            $data.mode == 'prepend' ? $sites.reverse() : $sites

            if (!$sites.length) {return;}

            $.each($sites, function (i, $name) {
                var $url  = $().share_makeurl($name, $data);
                var $link = $data.initialized ? $container.find('.icon-'+$name) : $('<a class="social-share-icon icon-'+$name+'"></a>');

                if (!$link.length) {
                    return true;
                }
                $link.prop('aria-label', "分享到 "+$ariaLabels[$name]);

                $link.prop('href', $url);

                if ($name === 'wechat') {
                    $link.prop('tabindex', -1);
                    $link.prop('target', '_blank');
                } else {
                    $link.prop('target', '_blank');
                }

                if (!$data.initialized) {
                    $data.mode == 'prepend' ? $container.prepend($link) : $container.append($link);
                }
            });
        }

        /**
         * Get available site lists.
         *
         * @param {Array} $data
         *
         * @return {Array}
         */
        function getSites ($data) {
            if ($data['mobileSites'].length === 0 && $data['sites'].length) {
                $data['mobileSites'] = $data['sites'];
            };

            var $sites = (isMobileScreen() ? $data['mobileSites'] : ($data['sites'].length ? $data['sites']: [])).slice(0);
            var $disabled = $data['disabled'];

            if (typeof $sites == 'string') { $sites = $sites.split(/\s*,\s*/); }
            if (typeof $disabled == 'string') { $disabled = $disabled.split(/\s*,\s*/); }

            if ($().runningInWeChat()) {
                $disabled.push('wechat');
            }
            // Remove elements
            $disabled.length && $.each($disabled, function (i, el) {
                var removeItemIndex = $.inArray(el, $sites);
                if (removeItemIndex !== -1) {
                    $sites.splice(removeItemIndex, 1);
                }
            });

            return $sites;
        }

        /**
         * Mobile screen width.
         *
         * @return {boolean}
         */
        function isMobileScreen () {
            return $(window).width() <= 768;
        }
    };

    // Domready after initialization
    $(function () {
        $('.share-component,.social-share').share();
    });
})(jQuery);
