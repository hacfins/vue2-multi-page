import VueCookies from 'vue-cookies'
import Bowser from 'bowser'

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
    if (!name) return;
    return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) return;
    window.localStorage.removeItem(name);
}

/**
 * 判断客户端类型
 * @returns {boolean}
 * @constructor
 */
export const IsPC = function () {
    var userAgentInfo = navigator.userAgent.toLowerCase();
    var Agents        = ["android", "symbianos", "windows phone",
        "ipad", "ipod", "iphone", "android", "phone", "mobile",
        "wap", "netfront", "java", "opera mobi", "opera mini", "ucweb",
        "windows ce", "symbian", "series", "webos", "sony",
        "blackberry", "dopod", "nokia", "samsung", "palmsource", "xda",
        "pieplus", "meizu", "midp", "cldc", "motorola", "foma",
        "docomo", "up.browser", "up.link", "blazer", "helio", "hosin",
        "huawei", "novarra", "coolpad", "webos", "techfaith",
        "palmsource", "alcatel", "amoi", "ktouch", "nexian",
        "ericsson", "philips", "sagem", "wellcom", "bunjalloo", "maui",
        "smartphone", "iemobile", "spice", "bird", "zte-", "longcos",
        "pantech", "gionee", "portalmmm", "jig browser", "hiptop",
        "benq", "haier", "^lct", "320x320", "240x320", "176x220",
        "w3c ", "acs-", "alav", "alca", "amoi", "audi", "avan", "benq",
        "bird", "blac", "blaz", "brew", "cell", "cldc", "cmd-", "dang",
        "doco", "eric", "hipt", "inno", "ipaq", "java", "jigs", "kddi",
        "keji", "leno", "lg-c", "lg-d", "lg-g", "lge-", "maui", "maxo",
        "midp", "mits", "mmef", "mobi", "mot-", "moto", "mwbp", "nec-",
        "newt", "noki", "oper", "palm", "pana", "pant", "phil", "play",
        "port", "prox", "qwap", "sage", "sams", "sany", "sch-", "sec-",
        "send", "seri", "sgh-", "shar", "sie-", "siem", "smal", "smar",
        "sony", "sph-", "symb", "t-mo", "teli", "tim-", /*"tosh",*/ "tsm-",
        "upg1", "upsi", "vk-v", "voda", "wap-", "wapa", "wapi", "wapp",
        "wapr", "webc", "winw", "winw", "xda", "xda-", "Googlebot-Mobile"];
    var flag          = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

/**
 * 设置cookie
 * @param key
 * @param value
 * @param date有效期
 */
export const setCookie = function (key, value, date) {
    if (!date) {
        if (Bowser.msie) {
            VueCookies.set(key, value);
        } else {
            VueCookies.set(key, value, '0');
        }
    } else {
        VueCookies.set(key, value, date);
    }

}

/**
 * 获取cookie
 * @param key
 */
export const getCookie = function (key) {
    return VueCookies.get(key);

}

/**
 * 删除cookie
 * @param key
 */
export const removeCookie = function (key) {
    return VueCookies.remove(key);

}
/**
 *
 * @param url 插入script标签地址
 * @param callback
 */

export const innerScript  = function (url, callback) {
    var script  = document.createElement('script');
    script.src  = url;
    script.type = 'text/javascript';
    document.body.appendChild(script);
    script.onload = script.onreadystatechange = function () {

        if (!script.readyState || /loaded|complete/.test(script.readyState)) {

            script.onload = script.onreadystatechange = null;

            if (callback)
                callback()
        }
    };
}

/**
 *
 * @param url css 引用路径
 */

export const innerLink = function (url) {
    var link  = document.createElement('link');
    link.href = url;
    link.rel  = "stylesheet";
    document.head.appendChild(link);
}

/**
 * 获取url相对路径
 * @returns {string}
 */
export const getUrlRelativePath  =function () {
    var url = document.location.toString();
    var arrUrl = url.split("//");

    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

    if(relUrl.indexOf("?") != -1){
        relUrl = relUrl.split("?")[0];
    }
    return relUrl;
}

/**
 * 获得当月的最后一天
 * @returns {number}
 */

export const getCurrentMonthLast = function(){
    var date=new Date();
    var currentMonth=date.getMonth();
    var nextMonth=++currentMonth;
    var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
    var oneDay=1000*60*60*24;
    return new Date(nextMonthFirstDay-oneDay).getDate();
}
export const rootPath = function () {
    var strFullPath = window.document.location.href;
    var strPath     = window.document.location.pathname;
    var pos         = strFullPath.indexOf(strPath);
    var prePath     = strFullPath.substring(0, pos);
    return prePath;
}