import {baseUrl} from './env'
import axios from 'axios'
import {IsPC, getCookie} from './utils';

if (IsPC()) {
    var Message = require('element-ui').Message

} else {

    var Toast = require('mint-ui').Toast
}

function buildParams(params) {
    var result = [];

    for (var i in params) {
        result.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
    }

    return result.join('&');
}

function randomNum(n) {
    var t = '';
    for (var i = 0; i < n; i++) {
        t += Math.floor(Math.random() * 10);
    }
    return t;
}

function jsonpAdapter(config) {
    return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        var src    = config.url;

        if (config.params) {
            var params = buildParams(config.params);

            if (params) {
                src += (src.indexOf('?') >= 0 ? '&' : '?') + params;
            }
        }

        script.async = true;

        var jsonp   = 'Axios' + randomNum(21) + '_' + new Date().getTime();
        var old     = window[jsonp];
        var isAbort = false;

        window[jsonp] = function (responseData) {
            window[jsonp] = old;

            if (isAbort) {
                return;
            }

            var response = {
                data  : responseData,
                status: 200
            }

            resolve(response);
        };

        src += (src.indexOf('?') >= 0 ? '&' : '?') + buildParams({
                jsonp_callback: jsonp,
                _             : (new Date().getTime())
            });

        script.onload = script.onreadystatechange = function () {

            if (!script.readyState || /loaded|complete/.test(script.readyState)) {

                script.onload = script.onreadystatechange = null;

                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }

                script = null;
            }
        };

        if (config.cancelToken) {
            config.cancelToken.promise.then(function (cancel) {
                if (!script) {
                    return;
                }

                isAbort = true;
                reject(cancel);
            });
        }

        script.src = src;

        document.head.appendChild(script);
    });
};

export default function (url = '', options, type) {
    //补充为完整url
    url = baseUrl + url;

    // 添加token
    var hacfin_token = getCookie('MazeCloud');
    if (hacfin_token) {
        if (options.data) {
            options.data['ACCESS-TOKEN'] = hacfin_token
        } else {
            options.data = {
                'ACCESS-TOKEN': hacfin_token
            }
        }
    }

    //  post 使用data作为参数，get使用params作为参数
    var config;
    if (type == 'POST') {
        config = {
            method: type,
            url   : url,
            data  : options.data
        }
    } else {
        config = {
            method : type,
            url    : url,
            params : options.data,
            adapter: jsonpAdapter
        }
    }

    //成功的回调
    function success(res) {
        switch (res.data.code) {
            case 200:
                if (options.callback) {
                    if (typeof (res.data["count"]) != 'undefined') {
                        options.callback(res.data.result, res.data["count"]);
                    } else if (typeof (res.data["allcount"]) != 'undefined') {
                        options.callback(res.data.result, res.data["count"], res.data["allcount"]);
                    } else if (res.data.result) {
                        options.callback(res.data.result);
                    } else {
                        options.callback(res.data);
                    }
                }
                break;
            case 404:

                break;
            default :
                if (typeof (options["errorback"]) != 'undefined') {
                    options.errorback(res.data.msg, res.data.code, res.data.result);
                } else {
                    if (IsPC()) {
                        Message.error(res.data.msg)
                    } else {
                        Toast({
                            message : res.data.msg,
                            position: 'top'
                        })
                    }
                }
                break;
        }


    }

    //失败回调
    function error(err) {
        if (options.errorback) {
            options.errorback(err)
        } else {
            if (IsPC()) {

                Message.error(err)
            } else {

            }

        }
    }


    //调用axios
    axios(config).then(success).catch(error);

}

