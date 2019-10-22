/**
 * Created by hacfin005 on 2019/10/16.
 */
/**
 * 原生方法
 */

var _class2type = {};

var _type_name_arr = "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " )

_type_name_arr.forEach(function(name){
    _class2type[ "[object " + name + "]" ] = name.toLowerCase();
})

var _toString = _class2type.toString;

var _hasOwn = _class2type.hasOwnProperty;

var _fnToString = _hasOwn.toString;

var _ObjectFunctionString = _fnToString.call( Object );

function _dom(str) {
    return document.querySelectorAll(str)
}

function _attr(element_str,attr_key,attr_value) {
    var elementArr = element_str.nodeType == 1 ? [element_str] : _dom(element_str)
    if(attr_value){
        for(var i = 0; i < elementArr.length; i++){
            elementArr[i].setAttribute(attr_key,attr_value)
        }
    }else{
        return elementArr[0].getAttribute(attr_key)
    }

}

function _event(element_str,eventname,callback){
    var elementArr = element_str.nodeType == 1 ? [element_str] : _dom(element_str)
    for(var i = 0; i < elementArr.length; i++){
        elementArr[i].addEventListener(eventname,function(event){
            var event = event || window.event;
            callback && callback.bind(this)(event)
        })
    }

}

function _creat(tagName,tagAttrObj,stylestr){
    var tagEle = document.createElement(tagName);
    tagEle.style.cssText = stylestr;
    for(var attr in tagAttrObj){
        tagEle.setAttribute(attr,tagAttrObj[attr])
    }
    return tagEle
}

function _append(element_str,append_obj){
    var elementArr = element_str.nodeType == 1 ? [element_str] : _dom(element_str)
    for(var i = 0; i < elementArr.length; i++){
        elementArr[i].appendChild(append_obj)
    }

}

function _type (obj) {
    if ( obj == null ) {
        return obj + "";
    }
    // Support: Android <=2.3 only (functionish RegExp)
    return typeof obj === "object" || typeof obj === "function" ?
    _class2type[ _toString.call( obj ) ] || "object" :
        typeof obj;
}

function _extendObj() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[ 0 ] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
        deep = target;

        // Skip the boolean and the target
        target = arguments[ i ] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !_isFunction( target ) ) {
        target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if ( i === length ) {
        target = this;
        i--;
    }

    for ( ; i < length; i++ ) {

        // Only deal with non-null/undefined values
        if ( ( options = arguments[ i ] ) != null ) {

            // Extend the base object
            for ( name in options ) {
                copy = options[ name ];

                // Prevent Object.prototype pollution
                // Prevent never-ending loop
                if ( name === "__proto__" || target === copy ) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if ( deep && copy && ( _isPlainObject( copy ) ||
                    ( copyIsArray = _isArray( copy ) ) ) ) {
                    src = target[ name ];

                    // Ensure proper type for the source value
                    if ( copyIsArray && !_isArray( src ) ) {
                        clone = [];
                    } else if ( !copyIsArray && !_isPlainObject( src ) ) {
                        clone = {};
                    } else {
                        clone = src;
                    }
                    copyIsArray = false;

                    // Never move original objects, clone them
                    target[ name ] = _extendObj( deep, clone, copy );

                    // Don't bring in undefined values
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};

function _isArray(obj){
    if(Array.isArray){
        return Array.isArray(obj)
    }else{
        return "array" === _type(obj)
    }
}

function _isFunction( obj ) {
    // Support: Chrome <=57, Firefox <=52
    // In some browsers, typeof returns "function" for HTML <object> elements
    // (i.e., `typeof document.createElement( "object" ) === "function"`).
    // We don't want to classify *any* DOM node as a function.
    return typeof obj === "function" && typeof obj.nodeType !== "number";
};

function _isPlainObject( obj ) {
    var proto, Ctor;

    // Detect obvious negatives
    // Use toString instead of jQuery.type to catch host objects
    if ( !obj || _toString.call( obj ) !== "[object Object]" ) {
        return false;
    }

    proto = Object.getPrototypeOf( obj );

    // Objects with no prototype (e.g., `Object.create( null )`) are plain
    if ( !proto ) {
        return true;
    }

    // Objects with prototype are plain iff they were constructed by a global Object function
    Ctor = _hasOwn.call( proto, "constructor" ) && proto.constructor;
    return typeof Ctor === "function" && _fnToString.call( Ctor ) === _ObjectFunctionString;
}

function _isEmptyObject( obj ) {
    var name;

    for ( name in obj ) {
        return false;
    }
    return true;
}

function _hasClass(elem, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
}

function _getParentNode(ele,classname){
    var result = []
    while (ele.tagName != 'BODY') {

        if(this.hasClass(ele,classname)){
            result.push(ele);
        }
        ele = ele.parentNode;
    }
    return result

}

function _removeClass(obj, cls){
    var obj_class = ' '+obj.className+' ';//获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
    obj_class = obj_class.replace(/(\s+)/gi, ' ');//将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
    var removed = obj_class.replace(' '+cls+' ', ' ');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');//去掉首尾空格. ex) 'bcd ' -> 'bcd'
    obj.className = removed;//替换原来的 class.
}

function _computeStyle(elem, prop) {
    if (!window.getComputedStyle) {
        window.getComputedStyle = function(el, pseudo) {
            this.getPropertyValue = function(prop) {
                var re = /(\-([a-z]){1})/g;
                if (prop == 'float') prop = 'styleFloat';
                if (re.test(prop)) {
                    prop = prop.replace(re, function () {
                        return arguments[2].toUpperCase();
                    });
                }
                return el.currentStyle && el.currentStyle[prop] ? el.currentStyle[prop] : null;
            }
            return this;
        }
    }

    return window.getComputedStyle(elem, null).getPropertyValue(prop);
}

function _trigger(type, element, detail) {
    element.dispatchEvent(new CustomEvent(type, {detail: detail, bubbles: false, cancelable: true}));
}