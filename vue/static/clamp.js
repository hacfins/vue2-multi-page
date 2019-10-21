;(function(){
    function clamp(element, options) {
        options = options || {};
        var opt = {
            clamp:              options.clamp || 2,
            truncationHTML:     options.truncationHTML
        }
        var element_arr = document.querySelectorAll(element);
        var trun_count = 0;
        truncate(element_arr[0])

        function truncate(){
            if(trun_count == element_arr.length){
                return
            }
            getHeight(element_arr[trun_count])
            trun_count++
            truncate()

        }

        function getHeight(ele){

            ele.style.wordBreak = 'break-all';
            var origin_text = ele.innerHTML;

            var wareNameText = ele.innerHTML;
            var heightSome = ele.clientHeight;
            var maxHeight = getMaxHeight(ele,opt.clamp);


            if(heightSome > maxHeight){

                for(var i=0;heightSome > maxHeight;i++){

                    wareNameText = wareNameText.substring(0,wareNameText.length-1);
                    if(opt.truncationHTML){
                        ele.innerHTML = wareNameText + '...'+opt.truncationHTML;
                    }else{
                        ele.innerHTML = wareNameText+'...';
                    }

                    heightSome = ele.clientHeight;
                }

                var newText = wareNameText.substring(0,wareNameText.length-1)+'...';
                if(opt.truncationHTML){
                    ele.innerHTML = newText;
                    var readmore_ele = createElementByString(opt.truncationHTML)[0];
                    readmore_ele.setAttribute('origin_text',origin_text);
                    readmore_ele.setAttribute('clamped_text',newText)
                    readmore_ele.setAttribute('is_expend',2)
                    ele.appendChild(readmore_ele);
                    readmore_ele.addEventListener("click", function(){
                        if(this.getAttribute('is_expend') == 2){
                            ele.innerHTML = this.getAttribute('origin_text');
                            readmore_ele.setAttribute('is_expend',1);
                            readmore_ele.innerHTML = '收起'
                        }else{
                            ele.innerHTML = this.getAttribute('clamped_text');
                            readmore_ele.setAttribute('is_expend',2);
                            readmore_ele.innerHTML = '展开'
                        }
                        ele.appendChild(readmore_ele);
                    });

                }else{
                    ele.innerHTML = newText;
                }



            }
        }

        function createElementByString(str) {
            var div = document.createElement('div');
            div.innerHTML = str;

            return div.childNodes;
        }

        function getMaxHeight(ele,clmp) {
            var lineHeight = getLineHeight(ele);
            return lineHeight * clmp;
        }

        /**
         * Returns the line-height of an element as an integer.
         */
        function getLineHeight(elem) {
            var lh = computeStyle(elem, 'line-height');
            if (lh == 'normal') {
                // Normal line heights vary from browser to browser. The spec recommends
                // a value between 1.0 and 1.2 of the font size. Using 1.1 to split the diff.
                lh = parseInt(computeStyle(elem, 'font-size')) * 1.2;
            }
            return parseInt(lh);
        }

        function computeStyle(elem, prop) {
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


    }

    window.$clamp = clamp;
})();