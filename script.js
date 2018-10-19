class MCContact {
    constructor(options) {
        this.config = {
            showEmpty: false,
            $list: null,
            $menu: null,
            $tip: null
        }
        this.source = [];
        this.items = null;
        this.index = 0;
        this.timer = null;

        this.init(options);
    }

    init(options) {
        const CFG = this.config;

        for (let key in options) {
            if (key === 'data') {
                this.source = options[key];
            } else {
                CFG[key] = options[key];
            }
        }

        if (Object.prototype.toString.call(this.source).toLowerCase() === '[object array]' && this.source.length) {
            const DOM = this.buildDOM(this.PYSort(this.source));

            if (CFG.$list) {
                CFG.$list.innerHTML = (DOM.strList);
            }

            if (CFG.$menu) {
                CFG.$menu.innerHTML = (DOM.strMenu);
                this.bindEvent();
            }
        }
    }

    PYSort(source) {
        if (!String.prototype.localeCompare) return null;
         
        const letters = "*abcdefghjklmnopqrstwxyz".split(''),
              zh_cn = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split(''),
              totalList = [],
              { showEmpty } = this.config;

        for (let i = 0; i < letters.length; i++) {
            const item = {
                name: letters[i],
                list:[]
            };

            for (let val of source) {
                if ((!zh_cn[i-1] || zh_cn[i-1].localeCompare(val) <= 0) && val.localeCompare(zh_cn[i]) == -1) {
                    item.list.push(val);
                }
            }

            if (showEmpty || item.list.length) {
                item.list.sort(function(a,b) {
                    return a.localeCompare(b);
                });
                totalList.push(item);
            }
        }
        return totalList;
    }

    buildDOM(data) {
        let strList = '',
            strMenu = '';

        for (let i = 0, l = data.length; i < l; i++) {
            strList += '<dl>'
                +       '<dt>' + data[i].name.toUpperCase() + '</dt>';
            for (let j = 0, l2 = data[i].list.length; j < l2; j++) {
                strList += '<dd>' + data[i].list[j] + '</dd>'
            }
            strList += '</dl>';

            strMenu += '<li data-index="' + i + '">' + data[i].name.toUpperCase() + '</li>';
        }

        return {
            strList,
            strMenu
        }
    }

    bindEvent() {
        const CFG = this.config,
              that = this,
              handler = function(event) {
                event.preventDefault();
                try {
                    const target = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY),
                          index = target.getAttribute('data-index'),
                          letter = target.innerText;
                    if (index) {
                        that.scrollTo(index, letter);
                    }
                } catch (err) {}
            }

        this.items = CFG.$list.getElementsByTagName('dl');
        CFG.$menu.addEventListener('touchstart', handler);
        CFG.$menu.addEventListener('touchmove', handler);
    }

    scrollTo(index, letter) {
        if (this.itemIndex !== index) {
            this.itemIndex = index;
            document.documentElement.scrollTop = this.items[index].offsetTop;
            if (this.config.$tip) {
                clearTimeout(this.timer);
                this.config.$tip.innerHTML = letter;
                this.config.$tip.className = 'act';
                this.timer = setTimeout(() => {
                    this.config.$tip.className = '';
                }, 1e3);
            }
        }
    }
}



new MCContact({
    data: ["汪桂英", "贺洋", "顾刚", "姚磊", "傅静", "于平", "萧娜", "陆秀英", "马涛", "韩敏", "杨杰", "顾秀兰", "彭勇", "吴明", "熊洋", "方刚", "任勇", "姜刚", "戴涛", "尹强", "金涛", "袁磊", "方艳", "文艳", "丁敏", "秦刚", "郑秀兰", "彭明", "陈敏", "杜敏", "阎明", "张娟", "吕平", "吴艳", "苏强", "周明", "毛娟", "龚平", "傅秀兰", "尹军", "易艳", "何磊", "侯桂英", "袁霞", "史杰", "杨明", "谭芳", "史超", "卢霞", "贺平", "雷杰", "金秀英", "谢芳", "顾磊", "郭勇", "沈洋", "徐刚", "侯芳", "尹杰", "范艳"],
    $list: document.getElementById('main'),
    $menu: document.getElementById('menu'),
    $tip: document.getElementById('tip')
})