(function () {
    var BDialogPrototype = Object.create(HTMLElement.prototype, {
            createdCallback: {
                enumerable: true,
                value: function () {
                    var root = this.createShadowRoot();
                    root.appendChild(this.template.content.cloneNode(true));
                }
            },
            show: {
                enumerable: true,
                value: function () {
                    this.setAttribute('visible', '');
                    this.keyupListener = this.onKeyup.bind(this);
                    document.addEventListener('keyup', this.keyupListener, false);
                }
            },
            showModal: {
                enumerable: true,
                value: function () {
                    this.overlay = document.createElement('b-overlay');
                    this.parentNode.appendChild(this.overlay);
                    this.show();
                }
            },
            onKeyup: {
                enumerable: true,
                value: function (e) {
                    if (e.which === 27) {
                        this.cancel();
                    }
                }
            },
            hide: {
                enumerable: true,
                value: function () {
                    this.removeAttribute('visible');
                    if (this.overlay) {
                        this.parentNode.removeChild(this.overlay);
                    }
                    document.removeEventListener('keyup', this.keyupListener, false);
                    this.dispatchEvent(new CustomEvent('b-close'));
                }
            },
            close: {
                enumerable: true,
                value: function () {
                    this.hide();
                }
            },
            open: {
                enumerable: true,
                value: function () {
                    this.show();
                }
            },
            cancel: {
                enumerable: true,
                value: function () {
                    var doCancel = this.dispatchEvent(new CustomEvent('b-cancel', { cancelable: true }));
                    if (doCancel) {
                        this.hide();
                    }
                }
            }
        });
    window.BDialog = document.registerElement('b-dialog', { prototype: BDialogPrototype });
    Object.defineProperty(BDialog.prototype, '_super', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: HTMLElement.prototype
    });
    Object.defineProperty(BDialogPrototype, 'template', {
        get: function () {
            var fragment = document.createDocumentFragment();
            var div = fragment.appendChild(document.createElement('div'));
            div.innerHTML = ' <div class="b-dialog"> <content></content> </div> ';
            while (child = div.firstChild) {
                fragment.insertBefore(child, div);
            }
            fragment.removeChild(div);
            return { content: fragment };
        }
    });
}());
(function () {
    var BOverlayPrototype = Object.create(HTMLElement.prototype, {
            createdCallback: {
                enumerable: true,
                value: function () {
                    this.appendChild(this.template.content.cloneNode(true));
                }
            }
        });
    window.BOverlay = document.registerElement('b-overlay', { prototype: BOverlayPrototype });
    Object.defineProperty(BOverlay.prototype, '_super', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: HTMLElement.prototype
    });
    Object.defineProperty(BOverlayPrototype, 'template', {
        get: function () {
            var fragment = document.createDocumentFragment();
            var div = fragment.appendChild(document.createElement('div'));
            div.innerHTML = ' <div class="b-overlay"></div> ';
            while (child = div.firstChild) {
                fragment.insertBefore(child, div);
            }
            fragment.removeChild(div);
            return { content: fragment };
        }
    });
}());
(function () {
    var BDatalistPrototype = Object.create(HTMLElement.prototype, {
            options: {
                enumerable: true,
                get: function () {
                    return this.querySelectorAll('option');
                }
            }
        });
    window.BDatalist = document.registerElement('b-datalist', { prototype: BDatalistPrototype });
    Object.defineProperty(BDatalist.prototype, '_super', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: HTMLElement.prototype
    });
}());
(function () {
    var KEY = {
            ENTER: 13,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
        };
    var BSelectablePrototype = Object.create(HTMLElement.prototype, {
            elementRole: { value: 'listbox' },
            elementLabel: { value: 'Selectable list' },
            itemsRole: { value: 'option' },
            selectedItemIndex: {
                enumerable: true,
                get: function () {
                    return Number(this.getAttribute('selected'));
                }
            },
            createdCallback: {
                enumerable: true,
                value: function () {
                    this.handleAria();
                    if (this.hasAttribute('selected')) {
                        this.selectedChanged(null, this.getAttribute('selected'));
                    }
                    this.addListeners();
                }
            },
            handleAria: {
                enumerable: true,
                value: function () {
                    this.tabIndex = 0;
                    this.setAttribute('role', this.elementRole);
                    this.setAttribute('aria-label', this.elementLabel);
                    this.getItems().forEach(function (item) {
                        item.setAttribute('role', this.itemsRole);
                    }, this);
                }
            },
            addListeners: {
                enumerable: true,
                value: function () {
                    this.addEventListener('click', this.clickHandler.bind(this), false);
                    this.addEventListener('keydown', this.keydownHandler.bind(this), false);
                    this.addEventListener('focus', this.focusHandler.bind(this), false);
                }
            },
            attributeChangedCallback: {
                enumerable: true,
                value: function (name, oldValue, newValue) {
                    if (name === 'selected')
                        this.selectedChanged(oldValue, this.getAttribute(name));
                }
            },
            selectedChanged: {
                enumerable: true,
                value: function (oldValue, newValue) {
                    this.dispatchEvent(new CustomEvent('b-select', { detail: { item: newValue } }));
                    if (oldValue !== null) {
                        this.getItem(oldValue).classList.remove('b-selectable-selected');
                        this.getItem(oldValue).removeAttribute('aria-selected');
                    }
                    this.getItem(newValue).classList.add('b-selectable-selected');
                    this.getItem(newValue).setAttribute('aria-selected', 'true');
                }
            },
            focusHandler: {
                enumerable: true,
                value: function (e) {
                    if (!this.hasAttribute('selected')) {
                        this.selectFirst();
                    }
                }
            },
            clickHandler: {
                enumerable: true,
                value: function (e) {
                    var itemIndex = this.getItems().indexOf(e.target);
                    if (itemIndex !== -1) {
                        this.select(itemIndex);
                        this.activate();
                    }
                }
            },
            keydownHandler: {
                enumerable: true,
                value: function (e) {
                    switch (e.keyCode) {
                    case KEY.ENTER: {
                            this.activate();
                            break;
                        }
                    case KEY.DOWN: {
                            this.selectNextItem();
                            break;
                        }
                    case KEY.UP: {
                            this.selectPreviousItem();
                            break;
                        }
                    default:
                        return;
                    }
                }
            },
            activate: {
                enumerable: true,
                value: function () {
                    this.dispatchEvent(new CustomEvent('b-activate', { detail: { item: this.getAttribute('selected') } }));
                }
            },
            select: {
                enumerable: true,
                value: function (index) {
                    this.setAttribute('selected', index);
                }
            },
            selectFirst: {
                enumerable: true,
                value: function () {
                    if (this.getItemCount() > 0) {
                        this.select(0);
                    }
                }
            },
            selectNextItem: {
                enumerable: true,
                value: function () {
                    if (this.selectedItemIndex < this.getItemCount() - 1) {
                        this.select(this.selectedItemIndex + 1);
                    }
                }
            },
            selectPreviousItem: {
                enumerable: true,
                value: function () {
                    if (this.selectedItemIndex > 0) {
                        this.select(this.selectedItemIndex - 1);
                    }
                }
            },
            getItem: {
                enumerable: true,
                value: function (pos) {
                    return this.getItems()[pos] || null;
                }
            },
            getItemCount: {
                enumerable: true,
                value: function () {
                    return this.getItems().length;
                }
            },
            getItems: {
                enumerable: true,
                value: function () {
                    var target = this.getAttribute('target');
                    var nodes = target ? this.querySelectorAll(target) : this.children;
                    return Array.prototype.slice.call(nodes, 0);
                }
            }
        });
    window.BSelectable = document.registerElement('b-selectable', { prototype: BSelectablePrototype });
    Object.defineProperty(BSelectable.prototype, '_super', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: HTMLElement.prototype
    });
}());
//! moment.js
//! version : 2.5.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {

    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = "2.5.1",
        global = this,
        round = Math.round,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for language config files
        languages = {},

        // moment internal properties
        momentProperties = {
            _isAMomentObject: null,
            _i : null,
            _f : null,
            _l : null,
            _strict : null,
            _isUTC : null,
            _offset : null,  // optional. Combine with _isUTC
            _pf : null,
            _lang : null  // optional
        },

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined'),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            D : 'date',
            w : 'week',
            W : 'isoWeek',
            M : 'month',
            y : 'year',
            DDD : 'dayOfYear',
            e : 'weekday',
            E : 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear : 'dayOfYear',
            isoweekday : 'isoWeekday',
            isoweek : 'isoWeek',
            weekyear : 'weekYear',
            isoweekyear : 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.lang().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.lang().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.lang().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.lang().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.lang().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY : function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg   : function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg : function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg : function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG   : function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e : function () {
                return this.weekday();
            },
            E : function () {
                return this.isoWeekday();
            },
            a    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return toInt(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ":" + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z : function () {
                return this.zoneAbbr();
            },
            zz : function () {
                return this.zoneName();
            },
            X    : function () {
                return this.unix();
            },
            Q : function () {
                return this.quarter();
            }
        },

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty : false,
            unusedTokens : [],
            unusedInput : [],
            overflow : -2,
            charsLeftOver : 0,
            nullInput : false,
            invalidMonth : null,
            invalidFormat : false,
            userInvalidated : false,
            iso: false
        };
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.lang().ordinal(func.call(this, a), period);
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
        Constructors
    ************************************/

    function Language() {

    }

    // Moment prototype object
    function Moment(config) {
        checkOverflow(config);
        extend(this, config);
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            years * 12;

        this._data = {};

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }

        if (b.hasOwnProperty("toString")) {
            a.toString = b.toString;
        }

        if (b.hasOwnProperty("valueOf")) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function cloneMoment(m) {
        var result = {}, i;
        for (i in m) {
            if (m.hasOwnProperty(i) && momentProperties.hasOwnProperty(i)) {
                result[i] = m[i];
            }
        }

        return result;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    // helper function for _.addTime and _.subtractTime
    function addOrSubtractDurationFromMoment(mom, duration, isAdding, ignoreUpdateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months,
            minutes,
            hours;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        // store the minutes and hours so we can restore them
        if (days || months) {
            minutes = mom.minute();
            hours = mom.hour();
        }
        if (days) {
            mom.date(mom.date() + days * isAdding);
        }
        if (months) {
            mom.month(mom.month() + months * isAdding);
        }
        if (milliseconds && !ignoreUpdateOffset) {
            moment.updateOffset(mom);
        }
        // restore the minutes and hours after possibly changing dst
        if (days || months) {
            mom.minute(minutes);
            mom.hour(hours);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return  Object.prototype.toString.call(input) === '[object Date]' ||
                input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (inputObject.hasOwnProperty(prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment.fn._lang[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment.fn._lang, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                m._a[HOUR] < 0 || m._a[HOUR] > 23 ? HOUR :
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0;
            }
        }
        return m._isValid;
    }

    function normalizeLanguage(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function makeAs(input, model) {
        return model._isUTC ? moment(input).zone(model._offset || 0) :
            moment(input).local();
    }

    /************************************
        Languages
    ************************************/


    extend(Language.prototype, {

        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        },

        _months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                if (!this._monthsParse[i]) {
                    mom = moment.utc([2000, i]);
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LT : "h:mm A",
            L : "MM/DD/YYYY",
            LL : "MMMM D YYYY",
            LLL : "MMMM D YYYY LT",
            LLLL : "dddd, MMMM D YYYY LT"
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM : function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse : /[ap]\.?m?\.?/i,
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom) : output;
        },

        _relativeTime : {
            future : "in %s",
            past : "%s ago",
            s : "a few seconds",
            m : "a minute",
            mm : "%d minutes",
            h : "an hour",
            hh : "%d hours",
            d : "a day",
            dd : "%d days",
            M : "a month",
            MM : "%d months",
            y : "a year",
            yy : "%d years"
        },
        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },
        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace("%d", number);
        },
        _ordinal : "%d",

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    // Loads a language definition into the `languages` cache.  The function
    // takes a key and optionally values.  If not in the browser and no values
    // are provided, it will load the language file module.  As a convenience,
    // this function also returns the language values.
    function loadLang(key, values) {
        values.abbr = key;
        if (!languages[key]) {
            languages[key] = new Language();
        }
        languages[key].set(values);
        return languages[key];
    }

    // Remove a language from the `languages` cache. Mostly useful in tests.
    function unloadLang(key) {
        delete languages[key];
    }

    // Determines which language definition to use and returns it.
    //
    // With no parameters, it will return the global language.  If you
    // pass in a language key, such as 'en', it will return the
    // definition for 'en', so long as 'en' has already been loaded using
    // moment.lang.
    function getLangDefinition(key) {
        var i = 0, j, lang, next, split,
            get = function (k) {
                if (!languages[k] && hasModule) {
                    try {
                        require('./lang/' + k);
                    } catch (e) { }
                }
                return languages[k];
            };

        if (!key) {
            return moment.fn._lang;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            lang = get(key);
            if (lang) {
                return lang;
            }
            key = [key];
        }

        //pick the language from the array
        //try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
        //substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
        while (i < key.length) {
            split = normalizeLanguage(key[i]).split('-');
            j = split.length;
            next = normalizeLanguage(key[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                lang = get(split.slice(0, j).join('-'));
                if (lang) {
                    return lang;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return moment.fn._lang;
    }

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = "";
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {

        if (!m.isValid()) {
            return m.lang().invalidDate();
        }

        format = expandFormat(format, m.lang());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, lang) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return lang.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
        case 'GGGG':
        case 'gggg':
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
        case 'Y':
        case 'G':
        case 'g':
            return parseTokenSignedNumber;
        case 'YYYYYY':
        case 'YYYYY':
        case 'GGGGG':
        case 'ggggg':
            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
        case 'S':
            if (strict) { return parseTokenOneDigit; }
            /* falls through */
        case 'SS':
            if (strict) { return parseTokenTwoDigits; }
            /* falls through */
        case 'SSS':
            if (strict) { return parseTokenThreeDigits; }
            /* falls through */
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
            return parseTokenWord;
        case 'a':
        case 'A':
            return getLangDefinition(config._l)._meridiemParse;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'SSSS':
            return parseTokenDigits;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'GG':
        case 'gg':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'ww':
        case 'WW':
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
        case 'w':
        case 'W':
        case 'e':
        case 'E':
            return parseTokenOneOrTwoDigits;
        default :
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), "i"));
            return a;
        }
    }

    function timezoneMinutesFromString(string) {
        string = string || "";
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? -minutes : minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            if (input != null) {
                datePartArray[MONTH] = toInt(input) - 1;
            }
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = getLangDefinition(config._l).monthsParse(input);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[MONTH] = a;
            } else {
                config._pf.invalidMonth = input;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DD
        case 'DD' :
            if (input != null) {
                datePartArray[DATE] = toInt(input);
            }
            break;
        // DAY OF YEAR
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                config._dayOfYear = toInt(input);
            }

            break;
        // YEAR
        case 'YY' :
            datePartArray[YEAR] = toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
            break;
        case 'YYYY' :
        case 'YYYYY' :
        case 'YYYYYY' :
            datePartArray[YEAR] = toInt(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._isPm = getLangDefinition(config._l).isPM(input);
            break;
        // 24 HOUR
        case 'H' : // fall through to hh
        case 'HH' : // fall through to hh
        case 'h' : // fall through to hh
        case 'hh' :
            datePartArray[HOUR] = toInt(input);
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[MINUTE] = toInt(input);
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[SECOND] = toInt(input);
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
        case 'SSSS' :
            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            config._tzm = timezoneMinutesFromString(input);
            break;
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'd':
        case 'dd':
        case 'ddd':
        case 'dddd':
        case 'e':
        case 'E':
            token = token.substr(0, 1);
            /* falls through */
        case 'gg':
        case 'gggg':
        case 'GG':
        case 'GGGG':
        case 'GGGGG':
            token = token.substr(0, 2);
            if (input) {
                config._w = config._w || {};
                config._w[token] = input;
            }
            break;
        }
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate,
            yearToUse, fixYear, w, temp, lang, weekday, week;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            fixYear = function (val) {
                var int_val = parseInt(val, 10);
                return val ?
                  (val.length < 3 ? (int_val > 68 ? 1900 + int_val : 2000 + int_val) : int_val) :
                  (config._a[YEAR] == null ? moment().weekYear() : config._a[YEAR]);
            };

            w = config._w;
            if (w.GG != null || w.W != null || w.E != null) {
                temp = dayOfYearFromWeeks(fixYear(w.GG), w.W || 1, w.E, 4, 1);
            }
            else {
                lang = getLangDefinition(config._l);
                weekday = w.d != null ?  parseWeekday(w.d, lang) :
                  (w.e != null ?  parseInt(w.e, 10) + lang._week.dow : 0);

                week = parseInt(w.w, 10) || 1;

                //if we're parsing 'd', then the low day numbers may be next week
                if (w.d != null && weekday < lang._week.dow) {
                    week++;
                }

                temp = dayOfYearFromWeeks(fixYear(w.gg), week, weekday, lang._week.doy, lang._week.dow);
            }

            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = config._a[YEAR] == null ? currentDate[YEAR] : config._a[YEAR];

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // add the offsets to the time to be parsed so that we can have a clean array for checking isValid
        input[HOUR] += toInt((config._tzm || 0) / 60);
        input[MINUTE] += toInt((config._tzm || 0) % 60);

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var lang = getLangDefinition(config._l),
            string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, lang).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // handle am pm
        if (config._isPm && config._a[HOUR] < 12) {
            config._a[HOUR] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[HOUR] === 12) {
            config._a[HOUR] = 0;
        }

        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = extend({}, config);
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function makeDateFromString(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be "T" or undefined
                    config._f = isoDates[i][0] + (match[6] || " ");
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += "Z";
            }
            makeDateFromStringAndFormat(config);
        }
        else {
            config._d = new Date(string);
        }
    }

    function makeDateFromInput(config) {
        var input = config._i,
            matched = aspNetJsonRegex.exec(input);

        if (input === undefined) {
            config._d = new Date();
        } else if (matched) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = input.slice(0);
            dateFromConfig(config);
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else {
            config._d = new Date(input);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, language) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = language.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1000),
            minutes = round(seconds / 60),
            hours = round(minutes / 60),
            days = round(hours / 24),
            years = round(days / 365),
            args = seconds < 45 && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < 45 && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < 22 && ['hh', hours] ||
                days === 1 && ['d'] ||
                days <= 25 && ['dd', days] ||
                days <= 45 && ['M'] ||
                days < 345 && ['MM', round(days / 30)] ||
                years === 1 && ['y'] || ['yy', years];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add('d', daysToDayOfWeek);
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f;

        if (input === null) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = getLangDefinition().preparse(input);
        }

        if (moment.isMoment(input)) {
            config = cloneMoment(input);

            config._d = new Date(+input._d);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        return new Moment(config);
    }

    moment = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = lang;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    // creating with utc
    moment.utc = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = lang;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && input.hasOwnProperty('_lang')) {
            ret._lang = input._lang;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {};

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    moment.lang = function (key, values) {
        var r;
        if (!key) {
            return moment.fn._lang._abbr;
        }
        if (values) {
            loadLang(normalizeLanguage(key), values);
        } else if (values === null) {
            unloadLang(key);
            key = 'en';
        } else if (!languages[key]) {
            getLangDefinition(key);
        }
        r = moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
        return r._abbr;
    };

    // returns language data
    moment.langData = function (key) {
        if (key && key._lang && key._lang._abbr) {
            key = key._lang._abbr;
        }
        return getLangDefinition(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null &&  obj.hasOwnProperty('_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function (input) {
        return moment(input).parseZone();
    };

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d + ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.clone().lang('en').format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString : function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            return isValid(this);
        },

        isDSTShifted : function () {

            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags : function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc : function () {
            return this.zone(0);
        },

        local : function () {
            this.zone(0);
            this._isUTC = false;
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.lang().postformat(output);
        },

        add : function (input, val) {
            var dur;
            // switch args to support add('s', 1) and add(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },

        subtract : function (input, val) {
            var dur;
            // switch args to support subtract('s', 1) and subtract(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },

        diff : function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                // average number of days in the months in the given dates
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                // difference in months
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                // adjust by taking difference in days, average number of days
                // and dst in the given months.
                output += ((this - moment(this).startOf('month')) -
                        (that - moment(that).startOf('month'))) / diff;
                // same as above but with zones, to negate all dst
                output -= ((this.zone() - moment(this).startOf('month').zone()) -
                        (that.zone() - moment(that).startOf('month').zone())) * 6e4 / diff;
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = (this - that);
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function () {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're zone'd or not.
            var sod = makeAs(moment(), this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                    diff < 0 ? 'lastDay' :
                    diff < 1 ? 'sameDay' :
                    diff < 2 ? 'nextDay' :
                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.lang().calendar(format, this));
        },

        isLeapYear : function () {
            return isLeapYear(this.year());
        },

        isDST : function () {
            return (this.zone() < this.clone().month(0).zone() ||
                this.zone() < this.clone().month(5).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.lang());
                return this.add({ d : input - day });
            } else {
                return day;
            }
        },

        month : function (input) {
            var utc = this._isUTC ? 'UTC' : '',
                dayOfMonth;

            if (input != null) {
                if (typeof input === 'string') {
                    input = this.lang().monthsParse(input);
                    if (typeof input !== 'number') {
                        return this;
                    }
                }

                dayOfMonth = this.date();
                this.date(1);
                this._d['set' + utc + 'Month'](input);
                this.date(Math.min(dayOfMonth, this.daysInMonth()));

                moment.updateOffset(this);
                return this;
            } else {
                return this._d['get' + utc + 'Month']();
            }
        },

        startOf: function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            return this.startOf(units).add((units === 'isoWeek' ? 'week' : units), 1).subtract('ms', 1);
        },

        isAfter: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) > +moment(input).startOf(units);
        },

        isBefore: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) < +moment(input).startOf(units);
        },

        isSame: function (input, units) {
            units = units || 'ms';
            return +this.clone().startOf(units) === +makeAs(input, this).startOf(units);
        },

        min: function (other) {
            other = moment.apply(null, arguments);
            return other < this ? this : other;
        },

        max: function (other) {
            other = moment.apply(null, arguments);
            return other > this ? this : other;
        },

        zone : function (input) {
            var offset = this._offset || 0;
            if (input != null) {
                if (typeof input === "string") {
                    input = timezoneMinutesFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                this._offset = input;
                this._isUTC = true;
                if (offset !== input) {
                    addOrSubtractDurationFromMoment(this, moment.duration(offset - input, 'm'), 1, true);
                }
            } else {
                return this._isUTC ? offset : this._d.getTimezoneOffset();
            }
            return this;
        },

        zoneAbbr : function () {
            return this._isUTC ? "UTC" : "";
        },

        zoneName : function () {
            return this._isUTC ? "Coordinated Universal Time" : "";
        },

        parseZone : function () {
            if (this._tzm) {
                this.zone(this._tzm);
            } else if (typeof this._i === 'string') {
                this.zone(this._i);
            }
            return this;
        },

        hasAlignedHourOffset : function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).zone();
            }

            return (this.zone() - input) % 60 === 0;
        },

        daysInMonth : function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add("d", (input - dayOfYear));
        },

        quarter : function () {
            return Math.ceil((this.month() + 1.0) / 3.0);
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;
            return input == null ? year : this.add("y", (input - year));
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add("y", (input - year));
        },

        week : function (input) {
            var week = this.lang().week(this);
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.lang()._week.dow) % 7;
            return input == null ? weekday : this.add("d", input - weekday);
        },

        isoWeekday : function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set : function (units, value) {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                this[units](value);
            }
            return this;
        },

        // If passed a language key, it will set the language for this
        // instance.  Otherwise, it will return the language configuration
        // variables for this instance.
        lang : function (key) {
            if (key === undefined) {
                return this._lang;
            } else {
                this._lang = getLangDefinition(key);
                return this;
            }
        }
    });

    // helper for adding shortcuts
    function makeGetterAndSetter(name, key) {
        moment.fn[name] = moment.fn[name + 's'] = function (input) {
            var utc = this._isUTC ? 'UTC' : '';
            if (input != null) {
                this._d['set' + utc + key](input);
                moment.updateOffset(this);
                return this;
            } else {
                return this._d['get' + utc + key]();
            }
        };
    }

    // loop through and add shortcuts (Month, Date, Hours, Minutes, Seconds, Milliseconds)
    for (i = 0; i < proxyGettersAndSetters.length; i ++) {
        makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase().replace(/s$/, ''), proxyGettersAndSetters[i]);
    }

    // add shortcut for year (uses different syntax than the getter/setter 'year' == 'FullYear')
    makeGetterAndSetter('year', 'FullYear');

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    /************************************
        Duration Prototype
    ************************************/


    extend(moment.duration.fn = Duration.prototype, {

        _bubble : function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);
            data.days = days % 30;

            months += absRound(days / 30);
            data.months = months % 12;

            years = absRound(months / 12);
            data.years = years;
        },

        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6;
        },

        humanize : function (withSuffix) {
            var difference = +this,
                output = relativeTime(difference, !withSuffix, this.lang());

            if (withSuffix) {
                output = this.lang().pastFuture(difference, output);
            }

            return this.lang().postformat(output);
        },

        add : function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract : function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as : function (units) {
            units = normalizeUnits(units);
            return this['as' + units.charAt(0).toUpperCase() + units.slice(1) + 's']();
        },

        lang : moment.fn.lang,

        toIsoString : function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        }
    });

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    function makeDurationAsGetter(name, factor) {
        moment.duration.fn['as' + name] = function () {
            return +this / factor;
        };
    }

    for (i in unitMillisecondFactors) {
        if (unitMillisecondFactors.hasOwnProperty(i)) {
            makeDurationAsGetter(i, unitMillisecondFactors[i]);
            makeDurationGetter(i.toLowerCase());
        }
    }

    makeDurationAsGetter('Weeks', 6048e5);
    moment.duration.fn.asMonths = function () {
        return (+this - this.years() * 31536e6) / 2592e6 + this.years() * 12;
    };


    /************************************
        Default Lang
    ************************************/


    // Set default language, other languages will inherit from English.
    moment.lang('en', {
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    /* EMBED_LANGUAGES */

    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(deprecate) {
        var warned = false, local_moment = moment;
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        // here, `this` means `window` in the browser, or `global` on the server
        // add `moment` as a global object via a string identifier,
        // for Closure Compiler "advanced" mode
        if (deprecate) {
            global.moment = function () {
                if (!warned && console && console.warn) {
                    warned = true;
                    console.warn(
                            "Accessing Moment through the global scope is " +
                            "deprecated, and will be removed in an upcoming " +
                            "release.");
                }
                return local_moment.apply(null, arguments);
            };
            extend(global.moment, local_moment);
        } else {
            global['moment'] = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
        makeGlobal(true);
    } else if (typeof define === "function" && define.amd) {
        define("moment", function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal !== true) {
                // If user provided noGlobal, he is aware of global
                makeGlobal(module.config().noGlobal === undefined);
            }

            return moment;
        });
    } else {
        makeGlobal();
    }
}).call(this);

// moment.js language configuration
// language : french (fr)
// author : John Fischer : https://github.com/jfroffice

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['moment'], factory); // AMD
    } else if (typeof exports === 'object') {
        module.exports = factory(require('../moment')); // Node
    } else {
        factory(window.moment); // Browser global
    }
}(function (moment) {
    return moment.lang('fr', {
        months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
        monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
        weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
        weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
        weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
        longDateFormat : {
            LT : "HH:mm",
            L : "DD/MM/YYYY",
            LL : "D MMMM YYYY",
            LLL : "D MMMM YYYY LT",
            LLLL : "dddd D MMMM YYYY LT"
        },
        calendar : {
            sameDay: "[Aujourd'hui à] LT",
            nextDay: '[Demain à] LT',
            nextWeek: 'dddd [à] LT',
            lastDay: '[Hier à] LT',
            lastWeek: 'dddd [dernier à] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : "dans %s",
            past : "il y a %s",
            s : "quelques secondes",
            m : "une minute",
            mm : "%d minutes",
            h : "une heure",
            hh : "%d heures",
            d : "un jour",
            dd : "%d jours",
            M : "un mois",
            MM : "%d mois",
            y : "un an",
            yy : "%d ans"
        },
        ordinal : function (number) {
            return number + (number === 1 ? 'er' : '');
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });
}));

/*!
 * Pikaday
 *
 * Copyright © 2014 David Bushell | BSD & MIT license | https://github.com/dbushell/Pikaday
 */

(function (root, factory)
{
    'use strict';

    var moment;
    if (typeof exports === 'object') {
        // CommonJS module
        // Load moment.js as an optional dependency
        try { moment = require('moment'); } catch (e) {}
        module.exports = factory(moment);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function (req)
        {
            // Load moment.js as an optional dependency
            var id = 'moment';
            moment = req.defined && req.defined(id) ? req(id) : undefined;
            return factory(moment);
        });
    } else {
        root.Pikaday = factory(root.moment);
    }
}(this, function (moment)
{
    'use strict';

    /**
     * feature detection and helper functions
     */
    var hasMoment = typeof moment === 'function',

    hasEventListeners = !!window.addEventListener,

    document = window.document,

    sto = window.setTimeout,

    addEvent = function(el, e, callback, capture)
    {
        if (hasEventListeners) {
            el.addEventListener(e, callback, !!capture);
        } else {
            el.attachEvent('on' + e, callback);
        }
    },

    removeEvent = function(el, e, callback, capture)
    {
        if (hasEventListeners) {
            el.removeEventListener(e, callback, !!capture);
        } else {
            el.detachEvent('on' + e, callback);
        }
    },

    fireEvent = function(el, eventName, data)
    {
        var ev;

        if (document.createEvent) {
            ev = document.createEvent('HTMLEvents');
            ev.initEvent(eventName, true, false);
            ev = extend(ev, data);
            el.dispatchEvent(ev);
        } else if (document.createEventObject) {
            ev = document.createEventObject();
            ev = extend(ev, data);
            el.fireEvent('on' + eventName, ev);
        }
    },

    trim = function(str)
    {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
    },

    hasClass = function(el, cn)
    {
        return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
    },

    addClass = function(el, cn)
    {
        if (!hasClass(el, cn)) {
            el.className = (el.className === '') ? cn : el.className + ' ' + cn;
        }
    },

    removeClass = function(el, cn)
    {
        el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
    },

    isArray = function(obj)
    {
        return (/Array/).test(Object.prototype.toString.call(obj));
    },

    isDate = function(obj)
    {
        return (/Date/).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
    },

    isLeapYear = function(year)
    {
        // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    },

    getDaysInMonth = function(year, month)
    {
        return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },

    setToStartOfDay = function(date)
    {
        if (isDate(date)) date.setHours(0,0,0,0);
    },

    compareDates = function(a,b)
    {
        // weak date comparison (use setToStartOfDay(date) to ensure correct result)
        return a.getTime() === b.getTime();
    },

    extend = function(to, from, overwrite)
    {
        var prop, hasProp;
        for (prop in from) {
            hasProp = to[prop] !== undefined;
            if (hasProp && typeof from[prop] === 'object' && from[prop].nodeName === undefined) {
                if (isDate(from[prop])) {
                    if (overwrite) {
                        to[prop] = new Date(from[prop].getTime());
                    }
                }
                else if (isArray(from[prop])) {
                    if (overwrite) {
                        to[prop] = from[prop].slice(0);
                    }
                } else {
                    to[prop] = extend({}, from[prop], overwrite);
                }
            } else if (overwrite || !hasProp) {
                to[prop] = from[prop];
            }
        }
        return to;
    },


    /**
     * defaults and localisation
     */
    defaults = {

        // bind the picker to a form field
        field: null,

        // automatically show/hide the picker on `field` focus (default `true` if `field` is set)
        bound: undefined,

        // position of the datepicker, relative to the field (default to bottom & left)
        // ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
        position: 'bottom left',

        // the default output format for `.toString()` and `field` value
        format: 'YYYY-MM-DD',

        // the initial date to view when first opened
        defaultDate: null,

        // make the `defaultDate` the initial selected value
        setDefaultDate: false,

        // first day of week (0: Sunday, 1: Monday etc)
        firstDay: 0,

        // the minimum/earliest date that can be selected
        minDate: null,
        // the maximum/latest date that can be selected
        maxDate: null,

        // number of years either side, or array of upper/lower range
        yearRange: 10,

        // used internally (don't config outside)
        minYear: 0,
        maxYear: 9999,
        minMonth: undefined,
        maxMonth: undefined,

        isRTL: false,

        // Additional text to append to the year in the calendar title
        yearSuffix: '',

        // Render the month after year in the calendar title
        showMonthAfterYear: false,

        // how many months are visible (not implemented yet)
        numberOfMonths: 1,

        // internationalization
        i18n: {
            previousMonth : 'Previous Month',
            nextMonth     : 'Next Month',
            months        : ['January','February','March','April','May','June','July','August','September','October','November','December'],
            weekdays      : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            weekdaysShort : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
        },

        // callback function
        onSelect: null,
        onOpen: null,
        onClose: null,
        onDraw: null
    },


    /**
     * templating functions to abstract HTML rendering
     */
    renderDayName = function(opts, day, abbr)
    {
        day += opts.firstDay;
        while (day >= 7) {
            day -= 7;
        }
        return abbr ? opts.i18n.weekdaysShort[day] : opts.i18n.weekdays[day];
    },

    renderDay = function(i, isSelected, isToday, isDisabled, isEmpty)
    {
        if (isEmpty) {
            return '<td class="is-empty"></td>';
        }
        var arr = [];
        if (isDisabled) {
            arr.push('is-disabled');
        }
        if (isToday) {
            arr.push('is-today');
        }
        if (isSelected) {
            arr.push('is-selected');
        }
        return '<td data-day="' + i + '" class="' + arr.join(' ') + '"><button class="pika-button" type="button">' + i + '</button>' + '</td>';
    },

    renderRow = function(days, isRTL)
    {
        return '<tr>' + (isRTL ? days.reverse() : days).join('') + '</tr>';
    },

    renderBody = function(rows)
    {
        return '<tbody>' + rows.join('') + '</tbody>';
    },

    renderHead = function(opts)
    {
        var i, arr = [];
        for (i = 0; i < 7; i++) {
            arr.push('<th scope="col"><abbr title="' + renderDayName(opts, i) + '">' + renderDayName(opts, i, true) + '</abbr></th>');
        }
        return '<thead>' + (opts.isRTL ? arr.reverse() : arr).join('') + '</thead>';
    },

    renderTitle = function(instance)
    {
        var i, j, arr,
            opts = instance._o,
            month = instance._m,
            year  = instance._y,
            isMinYear = year === opts.minYear,
            isMaxYear = year === opts.maxYear,
            html = '<div class="pika-title">',
            monthHtml,
            yearHtml,
            prev = true,
            next = true;

        for (arr = [], i = 0; i < 12; i++) {
            arr.push('<option value="' + i + '"' +
                (i === month ? ' selected': '') +
                ((isMinYear && i < opts.minMonth) || (isMaxYear && i > opts.maxMonth) ? 'disabled' : '') + '>' +
                opts.i18n.months[i] + '</option>');
        }
        monthHtml = '<div class="pika-label">' + opts.i18n.months[month] + '<select class="pika-select pika-select-month">' + arr.join('') + '</select></div>';

        if (isArray(opts.yearRange)) {
            i = opts.yearRange[0];
            j = opts.yearRange[1] + 1;
        } else {
            i = year - opts.yearRange;
            j = 1 + year + opts.yearRange;
        }

        for (arr = []; i < j && i <= opts.maxYear; i++) {
            if (i >= opts.minYear) {
                arr.push('<option value="' + i + '"' + (i === year ? ' selected': '') + '>' + (i) + '</option>');
            }
        }
        yearHtml = '<div class="pika-label">' + year + opts.yearSuffix + '<select class="pika-select pika-select-year">' + arr.join('') + '</select></div>';

        if (opts.showMonthAfterYear) {
            html += yearHtml + monthHtml;
        } else {
            html += monthHtml + yearHtml;
        }

        if (isMinYear && (month === 0 || opts.minMonth >= month)) {
            prev = false;
        }

        if (isMaxYear && (month === 11 || opts.maxMonth <= month)) {
            next = false;
        }

        html += '<button class="pika-prev' + (prev ? '' : ' is-disabled') + '" type="button">' + opts.i18n.previousMonth + '</button>';
        html += '<button class="pika-next' + (next ? '' : ' is-disabled') + '" type="button">' + opts.i18n.nextMonth + '</button>';

        return html += '</div>';
    },

    renderTable = function(opts, data)
    {
        return '<table cellpadding="0" cellspacing="0" class="pika-table">' + renderHead(opts) + renderBody(data) + '</table>';
    },


    /**
     * Pikaday constructor
     */
    Pikaday = function(options)
    {
        var self = this,
            opts = self.config(options);

        self._onMouseDown = function(e)
        {
            if (!self._v) {
                return;
            }
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }

            if (!hasClass(target, 'is-disabled')) {
                if (hasClass(target, 'pika-button') && !hasClass(target, 'is-empty')) {
                    self.setDate(new Date(self._y, self._m, parseInt(target.innerHTML, 10)));
                    if (opts.bound) {
                        sto(function() {
                            self.hide();
                        }, 100);
                    }
                    return;
                }
                else if (hasClass(target, 'pika-prev')) {
                    self.prevMonth();
                }
                else if (hasClass(target, 'pika-next')) {
                    self.nextMonth();
                }
            }
            if (!hasClass(target, 'pika-select')) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                    return false;
                }
            } else {
                self._c = true;
            }
        };

        self._onChange = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }
            if (hasClass(target, 'pika-select-month')) {
                self.gotoMonth(target.value);
            }
            else if (hasClass(target, 'pika-select-year')) {
                self.gotoYear(target.value);
            }
        };

        self._onInputChange = function(e)
        {
            var date;

            if (e.firedBy === self) {
                return;
            }
            if (hasMoment) {
                date = moment(opts.field.value, opts.format);
                date = (date && date.isValid()) ? date.toDate() : null;
            }
            else {
                date = new Date(Date.parse(opts.field.value));
            }
            self.setDate(isDate(date) ? date : null);
            if (!self._v) {
                self.show();
            }
        };

        self._onInputFocus = function()
        {
            self.show();
        };

        self._onInputClick = function()
        {
            self.show();
        };

        self._onInputBlur = function()
        {
            if (!self._c) {
                self._b = sto(function() {
                    self.hide();
                }, 50);
            }
            self._c = false;
        };

        self._onClick = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement,
                pEl = target;
            if (!target) {
                return;
            }
            if (!hasEventListeners && hasClass(target, 'pika-select')) {
                if (!target.onchange) {
                    target.setAttribute('onchange', 'return;');
                    addEvent(target, 'change', self._onChange);
                }
            }
            do {
                if (hasClass(pEl, 'pika-single')) {
                    return;
                }
            }
            while ((pEl = pEl.parentNode));
            if (self._v && target !== opts.trigger) {
                self.hide();
            }
        };

        self.el = document.createElement('div');
        self.el.className = 'pika-single' + (opts.isRTL ? ' is-rtl' : '');

        addEvent(self.el, 'mousedown', self._onMouseDown, true);
        addEvent(self.el, 'change', self._onChange);

        if (opts.field) {
            if (opts.bound) {
                document.body.appendChild(self.el);
            } else {
                opts.field.parentNode.insertBefore(self.el, opts.field.nextSibling);
            }
            addEvent(opts.field, 'change', self._onInputChange);

            if (!opts.defaultDate) {
                if (hasMoment && opts.field.value) {
                    opts.defaultDate = moment(opts.field.value, opts.format).toDate();
                } else {
                    opts.defaultDate = new Date(Date.parse(opts.field.value));
                }
                opts.setDefaultDate = true;
            }
        }

        var defDate = opts.defaultDate;

        if (isDate(defDate)) {
            if (opts.setDefaultDate) {
                self.setDate(defDate, true);
            } else {
                self.gotoDate(defDate);
            }
        } else {
            self.gotoDate(new Date());
        }

        if (opts.bound) {
            this.hide();
            self.el.className += ' is-bound';
            addEvent(opts.trigger, 'click', self._onInputClick);
            addEvent(opts.trigger, 'focus', self._onInputFocus);
            addEvent(opts.trigger, 'blur', self._onInputBlur);
        } else {
            this.show();
        }

    };


    /**
     * public Pikaday API
     */
    Pikaday.prototype = {


        /**
         * configure functionality
         */
        config: function(options)
        {
            if (!this._o) {
                this._o = extend({}, defaults, true);
            }

            var opts = extend(this._o, options, true);

            opts.isRTL = !!opts.isRTL;

            opts.field = (opts.field && opts.field.nodeName) ? opts.field : null;

            opts.bound = !!(opts.bound !== undefined ? opts.field && opts.bound : opts.field);

            opts.trigger = (opts.trigger && opts.trigger.nodeName) ? opts.trigger : opts.field;

            var nom = parseInt(opts.numberOfMonths, 10) || 1;
            opts.numberOfMonths = nom > 4 ? 4 : nom;

            if (!isDate(opts.minDate)) {
                opts.minDate = false;
            }
            if (!isDate(opts.maxDate)) {
                opts.maxDate = false;
            }
            if ((opts.minDate && opts.maxDate) && opts.maxDate < opts.minDate) {
                opts.maxDate = opts.minDate = false;
            }
            if (opts.minDate) {
                setToStartOfDay(opts.minDate);
                opts.minYear  = opts.minDate.getFullYear();
                opts.minMonth = opts.minDate.getMonth();
            }
            if (opts.maxDate) {
                setToStartOfDay(opts.maxDate);
                opts.maxYear  = opts.maxDate.getFullYear();
                opts.maxMonth = opts.maxDate.getMonth();
            }

            if (isArray(opts.yearRange)) {
                var fallback = new Date().getFullYear() - 10;
                opts.yearRange[0] = parseInt(opts.yearRange[0], 10) || fallback;
                opts.yearRange[1] = parseInt(opts.yearRange[1], 10) || fallback;
            } else {
                opts.yearRange = Math.abs(parseInt(opts.yearRange, 10)) || defaults.yearRange;
                if (opts.yearRange > 100) {
                    opts.yearRange = 100;
                }
            }

            return opts;
        },

        /**
         * return a formatted string of the current selection (using Moment.js if available)
         */
        toString: function(format)
        {
            return !isDate(this._d) ? '' : hasMoment ? moment(this._d).format(format || this._o.format) : this._d.toDateString();
        },

        /**
         * return a Moment.js object of the current selection (if available)
         */
        getMoment: function()
        {
            return hasMoment ? moment(this._d) : null;
        },

        /**
         * set the current selection from a Moment.js object (if available)
         */
        setMoment: function(date, preventOnSelect)
        {
            if (hasMoment && moment.isMoment(date)) {
                this.setDate(date.toDate(), preventOnSelect);
            }
        },

        /**
         * return a Date object of the current selection
         */
        getDate: function()
        {
            return isDate(this._d) ? new Date(this._d.getTime()) : null;
        },

        /**
         * set the current selection
         */
        setDate: function(date, preventOnSelect)
        {
            if (!date) {
                this._d = null;
                return this.draw();
            }
            if (typeof date === 'string') {
                date = new Date(Date.parse(date));
            }
            if (!isDate(date)) {
                return;
            }

            var min = this._o.minDate,
                max = this._o.maxDate;

            if (isDate(min) && date < min) {
                date = min;
            } else if (isDate(max) && date > max) {
                date = max;
            }

            this._d = new Date(date.getTime());
            setToStartOfDay(this._d);
            this.gotoDate(this._d);

            if (this._o.field) {
                this._o.field.value = this.toString();
                fireEvent(this._o.field, 'change', { firedBy: this });
            }
            if (!preventOnSelect && typeof this._o.onSelect === 'function') {
                this._o.onSelect.call(this, this.getDate());
            }
        },

        /**
         * change view to a specific date
         */
        gotoDate: function(date)
        {
            if (!isDate(date)) {
                return;
            }
            this._y = date.getFullYear();
            this._m = date.getMonth();
            this.draw();
        },

        gotoToday: function()
        {
            this.gotoDate(new Date());
        },

        /**
         * change view to a specific month (zero-index, e.g. 0: January)
         */
        gotoMonth: function(month)
        {
            if (!isNaN( (month = parseInt(month, 10)) )) {
                this._m = month < 0 ? 0 : month > 11 ? 11 : month;
                this.draw();
            }
        },

        nextMonth: function()
        {
            if (++this._m > 11) {
                this._m = 0;
                this._y++;
            }
            this.draw();
        },

        prevMonth: function()
        {
            if (--this._m < 0) {
                this._m = 11;
                this._y--;
            }
            this.draw();
        },

        /**
         * change view to a specific full year (e.g. "2012")
         */
        gotoYear: function(year)
        {
            if (!isNaN(year)) {
                this._y = parseInt(year, 10);
                this.draw();
            }
        },

        /**
         * change the minDate
         */
        setMinDate: function(value)
        {
            this._o.minDate = value;
        },

        /**
         * change the maxDate
         */
        setMaxDate: function(value)
        {
            this._o.maxDate = value;
        },

        /**
         * refresh the HTML
         */
        draw: function(force)
        {
            if (!this._v && !force) {
                return;
            }
            var opts = this._o,
                minYear = opts.minYear,
                maxYear = opts.maxYear,
                minMonth = opts.minMonth,
                maxMonth = opts.maxMonth;

            if (this._y <= minYear) {
                this._y = minYear;
                if (!isNaN(minMonth) && this._m < minMonth) {
                    this._m = minMonth;
                }
            }
            if (this._y >= maxYear) {
                this._y = maxYear;
                if (!isNaN(maxMonth) && this._m > maxMonth) {
                    this._m = maxMonth;
                }
            }

            this.el.innerHTML = renderTitle(this) + this.render(this._y, this._m);

            if (opts.bound) {
                this.adjustPosition();
                if(opts.field.type !== 'hidden') {
                    sto(function() {
                        opts.trigger.focus();
                    }, 1);
                }
            }

            if (typeof this._o.onDraw === 'function') {
                var self = this;
                sto(function() {
                    self._o.onDraw.call(self);
                }, 0);
            }
        },

        adjustPosition: function()
        {
            var field = this._o.trigger, pEl = field,
            width = this.el.offsetWidth, height = this.el.offsetHeight,
            viewportWidth = window.innerWidth || document.documentElement.clientWidth,
            viewportHeight = window.innerHeight || document.documentElement.clientHeight,
            scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop,
            left, top, clientRect;

            if (typeof field.getBoundingClientRect === 'function') {
                clientRect = field.getBoundingClientRect();
                left = clientRect.left + window.pageXOffset;
                top = clientRect.bottom + window.pageYOffset;
            } else {
                left = pEl.offsetLeft;
                top  = pEl.offsetTop + pEl.offsetHeight;
                while((pEl = pEl.offsetParent)) {
                    left += pEl.offsetLeft;
                    top  += pEl.offsetTop;
                }
            }

            // default position is bottom & left
            if (left + width > viewportWidth ||
                (
                    this._o.position.indexOf('right') > -1 &&
                    left - width + field.offsetWidth > 0
                )
            ) {
                left = left - width + field.offsetWidth;
            }
            if (top + height > viewportHeight + scrollTop ||
                (
                    this._o.position.indexOf('top') > -1 &&
                    top - height - field.offsetHeight > 0
                )
            ) {
                top = top - height - field.offsetHeight;
            }
            this.el.style.cssText = [
                'position: absolute',
                'left: ' + left + 'px',
                'top: ' + top + 'px'
            ].join(';');
        },

        /**
         * render HTML for a particular month
         */
        render: function(year, month)
        {
            var opts   = this._o,
                now    = new Date(),
                days   = getDaysInMonth(year, month),
                before = new Date(year, month, 1).getDay(),
                data   = [],
                row    = [];
            setToStartOfDay(now);
            if (opts.firstDay > 0) {
                before -= opts.firstDay;
                if (before < 0) {
                    before += 7;
                }
            }
            var cells = days + before,
                after = cells;
            while(after > 7) {
                after -= 7;
            }
            cells += 7 - after;
            for (var i = 0, r = 0; i < cells; i++)
            {
                var day = new Date(year, month, 1 + (i - before)),
                    isDisabled = (opts.minDate && day < opts.minDate) || (opts.maxDate && day > opts.maxDate),
                    isSelected = isDate(this._d) ? compareDates(day, this._d) : false,
                    isToday = compareDates(day, now),
                    isEmpty = i < before || i >= (days + before);

                row.push(renderDay(1 + (i - before), isSelected, isToday, isDisabled, isEmpty));

                if (++r === 7) {
                    data.push(renderRow(row, opts.isRTL));
                    row = [];
                    r = 0;
                }
            }
            return renderTable(opts, data);
        },

        isVisible: function()
        {
            return this._v;
        },

        show: function()
        {
            if (!this._v) {
                if (this._o.bound) {
                    addEvent(document, 'click', this._onClick);
                }
                removeClass(this.el, 'is-hidden');
                this._v = true;
                this.draw();
                if (typeof this._o.onOpen === 'function') {
                    this._o.onOpen.call(this);
                }
            }
        },

        hide: function()
        {
            var v = this._v;
            if (v !== false) {
                if (this._o.bound) {
                    removeEvent(document, 'click', this._onClick);
                }
                this.el.style.cssText = '';
                addClass(this.el, 'is-hidden');
                this._v = false;
                if (v !== undefined && typeof this._o.onClose === 'function') {
                    this._o.onClose.call(this);
                }
            }
        },

        /**
         * GAME OVER
         */
        destroy: function()
        {
            this.hide();
            removeEvent(this.el, 'mousedown', this._onMouseDown, true);
            removeEvent(this.el, 'change', this._onChange);
            if (this._o.field) {
                removeEvent(this._o.field, 'change', this._onInputChange);
                if (this._o.bound) {
                    removeEvent(this._o.trigger, 'click', this._onInputClick);
                    removeEvent(this._o.trigger, 'focus', this._onInputFocus);
                    removeEvent(this._o.trigger, 'blur', this._onInputBlur);
                }
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
        }

    };

    return Pikaday;

}));

(function () {
    var i18n = {
            'fr': {
                previousMonth: 'Mois pr\xE9c\xE9dent',
                nextMonth: 'Mois suivant',
                months: [
                    'Janvier',
                    'F\xE9vrier',
                    'Mars',
                    'Avril',
                    'Mai',
                    'Juin',
                    'Juillet',
                    'Ao\xFBt',
                    'Septembre',
                    'Octobre',
                    'Novembre',
                    'D\xE9cembre'
                ],
                weekdays: [
                    'Dimanche',
                    'Lundi',
                    'Mardi',
                    'Mercredi',
                    'Jeudi',
                    'Vendredi',
                    'Samedi'
                ],
                weekdaysShort: [
                    'Dim',
                    'Lun',
                    'Mar',
                    'Mer',
                    'Jeu',
                    'Ven',
                    'Sam'
                ]
            }
        };
    var BDatepickerPrototype = Object.create(HTMLElement.prototype, {
            picker: { value: null },
            defaultLocale: { value: 'en' },
            defaultFormat: { value: 'L' },
            defaultFirstDay: { value: 0 },
            locale: {
                enumerable: true,
                get: function () {
                    return this.getAttribute('locale') || this.defaultLocale;
                }
            },
            format: {
                enumerable: true,
                get: function () {
                    return this.getAttribute('format') || this.defaultFormat;
                }
            },
            firstDay: {
                enumerable: true,
                get: function () {
                    return this.getAttribute('firstday') || this.defaultFirstDay;
                }
            },
            minDate: {
                enumerable: true,
                get: function () {
                    return this.getAttribute('mindate');
                }
            },
            maxDate: {
                enumerable: true,
                get: function () {
                    return this.getAttribute('maxdate');
                }
            },
            yearRange: {
                enumerable: true,
                get: function () {
                    if (!this.getAttribute('yearrange')) {
                        return null;
                    }
                    return this.getAttribute('yearrange').split(',');
                }
            },
            getDate: {
                enumerable: true,
                value: function () {
                    return this.picker.getDate();
                }
            },
            createdCallback: {
                enumerable: true,
                value: function () {
                    this.appendChild(this.template.content.cloneNode(true));
                    this.picker = new Pikaday(this.assembleOptions());
                }
            },
            assembleOptions: {
                enumerable: true,
                value: function () {
                    var options = {
                            field: this.querySelector('input'),
                            format: this.format,
                            firstDay: this.firstDay,
                            onOpen: this.fireOpenEvent.bind(this),
                            onSelect: this.fireSelectEvent.bind(this)
                        };
                    if (this.locale !== this.defaultLocale && i18n.hasOwnProperty(this.locale)) {
                        options.i18n = i18n[this.locale];
                    }
                    if (this.minDate) {
                        options.minDate = this.minDate;
                    }
                    if (this.maxDate) {
                        options.maxDate = this.maxDate;
                    }
                    if (this.yearRange) {
                        options.yearRange = this.yearRange;
                    }
                    return options;
                }
            },
            fireOpenEvent: {
                enumerable: true,
                value: function () {
                    this.dispatchEvent(new CustomEvent('b-open'));
                }
            },
            fireSelectEvent: {
                enumerable: true,
                value: function () {
                    this.dispatchEvent(new CustomEvent('b-select'));
                }
            }
        });
    window.BDatepicker = document.registerElement('b-datepicker', { prototype: BDatepickerPrototype });
    Object.defineProperty(BDatepicker.prototype, '_super', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: HTMLElement.prototype
    });
    Object.defineProperty(BDatepickerPrototype, 'template', {
        get: function () {
            var fragment = document.createDocumentFragment();
            var div = fragment.appendChild(document.createElement('div'));
            div.innerHTML = ' <input type="text" value=""> ';
            while (child = div.firstChild) {
                fragment.insertBefore(child, div);
            }
            fragment.removeChild(div);
            return { content: fragment };
        }
    });
}());
/**!
 * Sortable
 * @author  RubaXa   <trash@rubaxa.org>
 * @license MIT
 */


(function (factory){
    "use strict";

    if( typeof define === "function" && define.amd ){
        define(factory);
    }
    else if( typeof module != "undefined" && typeof module.exports != "undefined" ){
        module.exports = factory();
    }
    else {
        window["Sortable"] = factory();
    }
})(function (){
    "use strict";

    var
          dragEl
        , ghostEl
        , rootEl
        , nextEl

        , lastEl
        , lastCSS
        , lastRect

        , activeGroup

        , tapEvt
        , touchEvt

        , expando = 'Sortable' + (new Date).getTime()

        , win = window
        , document = win.document
        , parseInt = win.parseInt
        , supportIEdnd = !!document.createElement('div').dragDrop

        , _silent = false

        , _createEvent = function (event/**String*/, item/**HTMLElement*/){
            var evt = document.createEvent('Event');
            evt.initEvent(event, true, true);
            evt.item = item;
            return evt;
        }

        , noop = function (){}
        , slice = [].slice

        , touchDragOverListeners = []
    ;


    /**
     * @class  Sortable
     * @param  {HTMLElement}  el
     * @param  {Object}  [options]
     * @constructor
     */
    function Sortable(el, options){
        this.el = el; // root element
        this.options = options = (options || {});


        // Defaults
        options.group = options.group || Math.random();
        options.handle = options.handle || null;
        options.draggable = options.draggable || el.children[0] && el.children[0].nodeName || (/[uo]l/i.test(el.nodeName) ? 'li' : '*');
        options.ghostClass = options.ghostClass || 'sortable-ghost';

        options.onAdd = _bind(this, options.onAdd || noop);
        options.onUpdate = _bind(this, options.onUpdate || noop);
        options.onRemove = _bind(this, options.onRemove || noop);


        // Export group name
        el[expando] = options.group;


        // Bind all private methods
        for( var fn in this ){
            if( fn.charAt(0) === '_' ){
                this[fn] = _bind(this, this[fn]);
            }
        }


        // Bind events
        _on(el, 'add', options.onAdd);
        _on(el, 'update', options.onUpdate);
        _on(el, 'remove', options.onRemove);

        _on(el, 'mousedown', this._onTapStart);
        _on(el, 'touchstart', this._onTapStart);
        supportIEdnd && _on(el, 'selectstart', this._onTapStart);

        _on(el, 'dragover', this._onDragOver);
        _on(el, 'dragenter', this._onDragOver);

        touchDragOverListeners.push(this._onDragOver);
    }


    Sortable.prototype = {
        constructor: Sortable,


        _applyEffects: function (){
            _toggleClass(dragEl, this.options.ghostClass, true);
        },


        _onTapStart: function (evt/**Event|TouchEvent*/){
            var
                  touch = evt.touches && evt.touches[0]
                , target = (touch || evt).target
                , options =  this.options
                , el = this.el
            ;

            if( options.handle ){
                target = _closest(target, options.handle, el);
            }

            target = _closest(target, options.draggable, el);

            // IE 9 Support
            if( target && evt.type == 'selectstart' ){
                if( target.tagName != 'A' && target.tagName != 'IMG'){
                    target.dragDrop();
                }
            }

            if( target && !dragEl && (target.parentNode === el) ){
                tapEvt = evt;
                target.draggable = true;


                // Disable "draggable"
                _find(target, 'a', _disableDraggable);
                _find(target, 'img', _disableDraggable);


                if( touch ){
                    // Touch device support
                    tapEvt = {
                          target:  target
                        , clientX: touch.clientX
                        , clientY: touch.clientY
                    };
                    this._onDragStart(tapEvt, true);
                    evt.preventDefault();
                }


                _on(this.el, 'dragstart', this._onDragStart);
                _on(this.el, 'dragend', this._onDrop);
                _on(document, 'dragover', _globalDragOver);


                try {
                    if( document.selection ){
                        document.selection.empty();
                    } else {
                        window.getSelection().removeAllRanges()
                    }
                } catch (err){ }
            }
        },


        _emulateDragOver: function (){
            if( touchEvt ){
                _css(ghostEl, 'display', 'none');

                var
                      target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY)
                    , parent = target
                    , group = this.options.group
                    , i = touchDragOverListeners.length
                ;

                if( parent ){
                    do {
                        if( parent[expando] === group ){
                            while( i-- ){
                                touchDragOverListeners[i]({
                                    clientX: touchEvt.clientX,
                                    clientY: touchEvt.clientY,
                                    target: target,
                                    rootEl: parent
                                });
                            }
                            break;
                        }

                        target = parent; // store last element
                    }
                    while( parent = parent.parentNode );
                }

                _css(ghostEl, 'display', '');
            }
        },


        _onTouchMove: function (evt/**TouchEvent*/){
            if( tapEvt ){
                var
                      touch = evt.touches[0]
                    , dx = touch.clientX - tapEvt.clientX
                    , dy = touch.clientY - tapEvt.clientY
                ;

                touchEvt = touch;
                _css(ghostEl, 'webkitTransform', 'translate3d('+dx+'px,'+dy+'px,0)');
            }
        },


        _onDragStart: function (evt/**Event*/, isTouch/**Boolean*/){
            var
                  target = evt.target
                , dataTransfer = evt.dataTransfer
            ;

            rootEl = this.el;
            dragEl = target;
            nextEl = target.nextSibling;
            activeGroup = this.options.group;

            if( isTouch ){
                var
                      rect = target.getBoundingClientRect()
                    , css = _css(target)
                    , ghostRect
                ;

                ghostEl = target.cloneNode(true);

                _css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
                _css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
                _css(ghostEl, 'width', rect.width);
                _css(ghostEl, 'height', rect.height);
                _css(ghostEl, 'opacity', '0.8');
                _css(ghostEl, 'position', 'fixed');
                _css(ghostEl, 'zIndex', '100000');

                rootEl.appendChild(ghostEl);

                // Fixing dimensions.
                ghostRect = ghostEl.getBoundingClientRect();
                _css(ghostEl, 'width', rect.width*2 - ghostRect.width);
                _css(ghostEl, 'height', rect.height*2 - ghostRect.height);

                // Bind touch events
                _on(document, 'touchmove', this._onTouchMove);
                _on(document, 'touchend', this._onDrop);

                this._loopId = setInterval(this._emulateDragOver, 150);
            }
            else {
                dataTransfer.effectAllowed = 'move';
                dataTransfer.setData('Text', target.textContent);

                _on(document, 'drop', this._onDrop);
            }

            setTimeout(this._applyEffects);
        },


        _onDragOver: function (evt/**Event*/){
            if( !_silent && (activeGroup === this.options.group) && (evt.rootEl === void 0 || evt.rootEl === this.el) ){
                var
                      el = this.el
                    , target = _closest(evt.target, this.options.draggable, el)
                ;

                if( el.children.length === 0 || el.children[0] === ghostEl || (el === evt.target) && _ghostInBottom(el, evt) ){
                    el.appendChild(dragEl);
                }
                else if( target && target !== dragEl && (target.parentNode[expando] !== void 0) ){
                    if( lastEl !== target ){
                        lastEl = target;
                        lastCSS = _css(target);
                        lastRect = target.getBoundingClientRect();
                    }


                    var
                          rect = lastRect
                        , width = rect.right - rect.left
                        , height = rect.bottom - rect.top
                        , floating = /left|right|inline/.test(lastCSS.cssFloat + lastCSS.display)
                        , skew = (floating ? (evt.clientX - rect.left)/width : (evt.clientY - rect.top)/height) > .5
                        , isWide = (target.offsetWidth > dragEl.offsetWidth)
                        , isLong = (target.offsetHeight > dragEl.offsetHeight)
                        , nextSibling = target.nextSibling
                        , after
                    ;

                    _silent = true;
                    setTimeout(_unsilent, 30);

                    if( floating ){
                        after = (target.previousElementSibling === dragEl) && !isWide || (skew > .5) && isWide
                    } else {
                        after = (target.nextElementSibling !== dragEl) && !isLong || (skew > .5) && isLong;
                    }

                    if( after && !nextSibling ){
                        el.appendChild(dragEl);
                    } else {
                        target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
                    }
                }
            }
        },


        _onDrop: function (evt/**Event*/){
            clearInterval(this._loopId);

            // Unbind events
            _off(document, 'drop', this._onDrop);
            _off(document, 'dragover', _globalDragOver);

            _off(this.el, 'dragend', this._onDrop);
            _off(this.el, 'dragstart', this._onDragStart);
            _off(this.el, 'selectstart', this._onTapStart);

            _off(document, 'touchmove', this._onTouchMove);
            _off(document, 'touchend', this._onDrop);


            if( evt ){
                evt.preventDefault();
                evt.stopPropagation();

                if( ghostEl ){
                    ghostEl.parentNode.removeChild(ghostEl);
                }

                if( dragEl ){
                    _toggleClass(dragEl, this.options.ghostClass, false);

                    if( !rootEl.contains(dragEl) ){
                        // Remove event
                        rootEl.dispatchEvent(_createEvent('remove', dragEl));

                        // Add event
                        dragEl.dispatchEvent(_createEvent('add', dragEl));
                    }
                    else if( dragEl.nextSibling !== nextEl ){
                        // Update event
                        dragEl.dispatchEvent(_createEvent('update', dragEl));
                    }
                }

                // Set NULL
                rootEl =
                dragEl =
                ghostEl =
                nextEl =

                tapEvt =
                touchEvt =

                lastEl =
                lastCSS =

                activeGroup = null;
            }
        },


        destroy: function (){
            var el = this.el, options = this.options;

            _off(el, 'add', options.onAdd);
            _off(el, 'update', options.onUpdate);
            _off(el, 'remove', options.onRemove);

            _off(el, 'mousedown', this._onTapStart);
            _off(el, 'touchstart', this._onTapStart);
            _off(el, 'selectstart', this._onTapStart);

            _off(el, 'dragover', this._onDragOver);
            _off(el, 'dragenter', this._onDragOver);

            //remove draggable attributes
            Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function(el) {
                el.removeAttribute('draggable');
            });

            touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

            this._onDrop();

            this.el = null;
        }
    };


    function _bind(ctx, fn){
        var args = slice.call(arguments, 2);
        return  fn.bind ? fn.bind.apply(fn, [ctx].concat(args)) : function (){
            return fn.apply(ctx, args.concat(slice.call(arguments)));
        };
    }


    function _closest(el, selector, ctx){
        if( selector === '*' ){
            return el;
        }
        else if( el ){
            ctx = ctx || document;
            selector = selector.split('.');

            var
                  tag = selector.shift().toUpperCase()
                , re = new RegExp('\\s('+selector.join('|')+')\\s', 'g')
            ;

            do {
                if(
                       (tag === '' || el.nodeName == tag)
                    && (!selector.length || ((' '+el.className+' ').match(re) || []).length == selector.length)
                ){
                    return  el;
                }
            }
            while( el !== ctx && (el = el.parentNode) );
        }

        return  null;
    }


    function _globalDragOver(evt){
        evt.dataTransfer.dropEffect = 'move';
        evt.preventDefault();
    }


    function _on(el, event, fn){
        el.addEventListener(event, fn, false);
    }


    function _off(el, event, fn){
        el.removeEventListener(event, fn, false);
    }


    function _toggleClass(el, name, state){
        if( el ){
            if( el.classList ){
                el.classList[state ? 'add' : 'remove'](name);
            }
            else {
                var className = (' '+el.className+' ').replace(/\s+/g, ' ').replace(' '+name+' ', '');
                el.className = className + (state ? ' '+name : '')
            }
        }
    }


    function _css(el, prop, val){
        if( el && el.style ){
            if( val === void 0 ){
                if( document.defaultView && document.defaultView.getComputedStyle ){
                    val = document.defaultView.getComputedStyle(el, '');
                }
                else if( el.currentStyle ){
                    val = el.currentStyle;
                }
                return  prop === void 0 ? val : val[prop];
            } else {
                el.style[prop] = val + (typeof val === 'string' ? '' : 'px');
            }
        }
    }


    function _find(ctx, tagName, iterator){
        if( ctx ){
            var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;
            if( iterator ){
                for( ; i < n; i++ ){
                    iterator(list[i], i);
                }
            }
            return  list;
        }
        return  [];
    }


    function _disableDraggable(el){
        return el.draggable = false;
    }


    function _unsilent(){
        _silent = false;
    }


    function _ghostInBottom(el, evt){
        var last = el.lastElementChild.getBoundingClientRect();
        return evt.clientY - (last.top + last.height) > 5; // min delta
    }



    // Export utils
    Sortable.utils = {
        on: _on,
        off: _off,
        css: _css,
        find: _find,
        bind: _bind,
        closest: _closest,
        toggleClass: _toggleClass
    };


    Sortable.version = '0.1.9';

    // Export
    return  Sortable;
});
(function () {
    var BSortablePrototype = Object.create(HTMLElement.prototype, {
            createdCallback: {
                enumerable: true,
                value: function () {
                    var list = this.firstElementChild;
                    var sortable = new Sortable(list, { onUpdate: this.onUpdate.bind(this) });
                }
            },
            onUpdate: {
                enumerable: true,
                value: function (evt) {
                    evt.stopPropagation();
                    var detail = { item: evt.item };
                    this.dispatchEvent(new CustomEvent('update', { detail: detail }));
                }
            }
        });
    window.BSortable = document.registerElement('b-sortable', { prototype: BSortablePrototype });
    Object.defineProperty(BSortable.prototype, '_super', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: HTMLElement.prototype
    });
}());
(function () {
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    var HEADER_CLASS = 'b-collapsible-header', BODY_CLASS = 'b-collapsible-body', CLOSED_CLASS = 'b-collapsible-closed';
    var BCollapsiblePrototype = Object.create(HTMLElement.prototype, {
            active: {
                enumerable: true,
                get: function () {
                    return this.hasAttribute('active');
                },
                set: function (value) {
                    value ? this.setAttribute('active', '') : this.removeAttribute('active');
                }
            },
            createdCallback: {
                enumerable: true,
                value: function () {
                    this.duration = this.hasAttribute('duration') ? parseFloat(this.getAttribute('duration')) : 0.33;
                    this.dimension = this.hasAttribute('horizontal') ? 'width' : 'height';
                    this.body = this.querySelector(':not(.' + HEADER_CLASS + ')');
                    this.header = this.querySelector('.' + HEADER_CLASS);
                    if (this.body) {
                        this.body.style.overflow = 'hidden';
                        if (this.supportsTransitions()) {
                            this.body.classList.add(BODY_CLASS);
                            if (this.active) {
                                this.setSize('auto');
                            }
                        }
                        this.addListeners();
                        this.toggleClosedClass(!this.active);
                    }
                }
            },
            detachedCallback: {
                enumerable: true,
                value: function () {
                    this.removeListeners();
                }
            },
            addListeners: {
                enumerable: true,
                value: function () {
                    if (this.header) {
                        this.toggleListener = this.toggle.bind(this);
                        this.header.addEventListener('click', this.toggleListener, false);
                    }
                    if (this.supportsTransitions()) {
                        this.transitionEndListener = this.transitionEnd.bind(this);
                        this.body.addEventListener('webkitTransitionEnd', this.transitionEndListener);
                        this.body.addEventListener('transitionend', this.transitionEndListener);
                    }
                }
            },
            removeListeners: {
                enumerable: true,
                value: function () {
                    if (this.toggleListener) {
                        this.header.removeEventListener('click', this.toggleListener, false);
                    }
                    if (this.supportsTransitions()) {
                        this.body.removeEventListener('webkitTransitionEnd', this.transitionEndListener);
                        this.body.removeEventListener('transitionend', this.transitionEndListener);
                    }
                }
            },
            attributeChangedCallback: {
                enumerable: true,
                value: function (name, oldValue, newValue) {
                    if (name === 'active')
                        this.activeChanged(oldValue, newValue);
                }
            },
            toggle: {
                enumerable: true,
                value: function () {
                    this.active = !this.active;
                }
            },
            activeChanged: {
                enumerable: true,
                value: function (oldValue, newValue) {
                    this.update();
                }
            },
            update: {
                enumerable: true,
                value: function () {
                    if (!this.body)
                        return;
                    this.active ? this.show() : this.hide();
                }
            },
            show: {
                enumerable: true,
                value: function () {
                    this.toggleClosedClass(false);
                    if (this.supportsTransitions()) {
                        var size = this.calcSize();
                        this.updateSize(size, this.duration);
                    }
                }
            },
            hide: {
                enumerable: true,
                value: function () {
                    if (!this.supportsTransitions()) {
                        this.toggleClosedClass(true);
                        return;
                    }
                    var size = this.computeSize();
                    this.setSize(size);
                    this.updateSize(0, this.duration);
                }
            },
            updateSize: {
                enumerable: true,
                value: function (size, duration) {
                    var that = this;
                    window.requestAnimationFrame(function () {
                        that.setSize(size);
                        that.setTransitionDuration(duration);
                    });
                }
            },
            calcSize: {
                enumerable: true,
                value: function () {
                    this.setSize('auto');
                    var size = this.computeSize();
                    this.setSize(0);
                    return size;
                }
            },
            computeSize: {
                enumerable: true,
                value: function () {
                    var size = parseInt(this.body.getBoundingClientRect()[this.dimension]);
                    return size - this.getBorderWidth() + 'px';
                }
            },
            getBorderWidth: {
                enumerable: true,
                value: function () {
                    return this.dimension === 'width' ? this.computeWidth('borderLeftWidth') + this.computeWidth('borderRightWidth') : this.computeWidth('borderTopWidth') + this.computeWidth('borderBottomWidth');
                }
            },
            computeWidth: {
                enumerable: true,
                value: function (property) {
                    return parseInt(getComputedStyle(this.body)[property].replace('px', ''));
                }
            },
            setSize: {
                enumerable: true,
                value: function (size) {
                    this.body.style[this.dimension] = size;
                }
            },
            setTransitionDuration: {
                enumerable: true,
                value: function (duration) {
                    var s = this.body.style;
                    s.webkitTransition = s.transition = duration ? this.dimension + ' ' + duration + 's' : null;
                }
            },
            toggleClosedClass: {
                enumerable: true,
                value: function (closed) {
                    closed ? this.body.classList.add(CLOSED_CLASS) : this.body.classList.remove(CLOSED_CLASS);
                }
            },
            transitionEnd: {
                enumerable: true,
                value: function () {
                    this.setTransitionDuration(null);
                    if (this.active) {
                        this.setSize('auto');
                    } else {
                        this.toggleClosedClass(true);
                    }
                }
            },
            supportsTransitions: {
                enumerable: true,
                value: function () {
                    return window.requestAnimationFrame !== undefined;
                }
            }
        });
    window.BCollapsible = document.registerElement('b-collapsible', { prototype: BCollapsiblePrototype });
    Object.defineProperty(BCollapsible.prototype, '_super', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: HTMLElement.prototype
    });
}());
(function () {
    var PANEL_HEADER_CLASS = '.b-collapsible-header';
    var BAccordionPrototype = Object.create(BSelectable.prototype, {
            elementRole: { value: 'tablist' },
            elementLabel: { value: 'Accordion' },
            itemsRole: { value: 'tabpanel' },
            headersRole: { value: 'tab' },
            handleAria: {
                enumerable: true,
                value: function () {
                    this._super.handleAria.call(this);
                    this.getItems().forEach(function (panel) {
                        panel.setAttribute('aria-expanded', 'false');
                        panel.setAttribute('aria-hidden', 'true');
                        panel.querySelector(PANEL_HEADER_CLASS).setAttribute('role', this.headersRole);
                    }, this);
                }
            },
            clickHandler: {
                enumerable: true,
                value: function (e) {
                    e.stopPropagation();
                    if (e.target.nodeName !== 'B-COLLAPSIBLE') {
                        e = { target: e.target.parentElement };
                    }
                    this._super.clickHandler.call(this, e);
                }
            },
            selectedChanged: {
                enumerable: true,
                value: function (oldValue, newValue) {
                    var oldItem = this.getItem(oldValue), newItem = this.getItem(newValue);
                    this._super.selectedChanged.call(this, oldValue, newValue);
                    if (oldValue !== null) {
                        oldItem.removeAttribute('active');
                        oldItem.setAttribute('aria-expanded', 'false');
                        oldItem.setAttribute('aria-hidden', 'true');
                    }
                    newItem.setAttribute('active', '');
                    newItem.setAttribute('aria-expanded', 'true');
                    newItem.setAttribute('aria-hidden', 'false');
                }
            }
        });
    window.BAccordion = document.registerElement('b-accordion', { prototype: BAccordionPrototype });
    Object.defineProperty(BAccordion.prototype, '_super', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: BSelectable.prototype
    });
}());
/*! tether-tooltip 0.2.6 */
/*! tether 0.6.5 */


(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require,exports,module);
  } else {
    root.Tether = factory();
  }
}(this, function(require,exports,module) {

(function() {
  var Evented, addClass, defer, deferred, extend, flush, getBounds, getOffsetParent, getOrigin, getScrollBarSize, getScrollParent, hasClass, node, removeClass, uniqueId, updateClasses, zeroPosCache,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  if (this.Tether == null) {
    this.Tether = {
      modules: []
    };
  }

  getScrollParent = function(el) {
    var parent, position, scrollParent, style, _ref;
    position = getComputedStyle(el).position;
    if (position === 'fixed') {
      return el;
    }
    scrollParent = void 0;
    parent = el;
    while (parent = parent.parentNode) {
      try {
        style = getComputedStyle(parent);
      } catch (_error) {}
      if (style == null) {
        return parent;
      }
      if (/(auto|scroll)/.test(style['overflow'] + style['overflow-y'] + style['overflow-x'])) {
        if (position !== 'absolute' || ((_ref = style['position']) === 'relative' || _ref === 'absolute' || _ref === 'fixed')) {
          return parent;
        }
      }
    }
    return document.body;
  };

  uniqueId = (function() {
    var id;
    id = 0;
    return function() {
      return id++;
    };
  })();

  zeroPosCache = {};

  getOrigin = function(doc) {
    var id, k, node, v, _ref;
    node = doc._tetherZeroElement;
    if (node == null) {
      node = doc.createElement('div');
      node.setAttribute('data-tether-id', uniqueId());
      extend(node.style, {
        top: 0,
        left: 0,
        position: 'absolute'
      });
      doc.body.appendChild(node);
      doc._tetherZeroElement = node;
    }
    id = node.getAttribute('data-tether-id');
    if (zeroPosCache[id] == null) {
      zeroPosCache[id] = {};
      _ref = node.getBoundingClientRect();
      for (k in _ref) {
        v = _ref[k];
        zeroPosCache[id][k] = v;
      }
      defer(function() {
        return zeroPosCache[id] = void 0;
      });
    }
    return zeroPosCache[id];
  };

  node = null;

  getBounds = function(el) {
    var box, doc, docEl, k, origin, v, _ref;
    if (el === document) {
      doc = document;
      el = document.documentElement;
    } else {
      doc = el.ownerDocument;
    }
    docEl = doc.documentElement;
    box = {};
    _ref = el.getBoundingClientRect();
    for (k in _ref) {
      v = _ref[k];
      box[k] = v;
    }
    origin = getOrigin(doc);
    box.top -= origin.top;
    box.left -= origin.left;
    if (box.width == null) {
      box.width = document.body.scrollWidth - box.left - box.right;
    }
    if (box.height == null) {
      box.height = document.body.scrollHeight - box.top - box.bottom;
    }
    box.top = box.top - docEl.clientTop;
    box.left = box.left - docEl.clientLeft;
    box.right = doc.body.clientWidth - box.width - box.left;
    box.bottom = doc.body.clientHeight - box.height - box.top;
    return box;
  };

  getOffsetParent = function(el) {
    return el.offsetParent || document.documentElement;
  };

  getScrollBarSize = function() {
    var inner, outer, width, widthContained, widthScroll;
    inner = document.createElement('div');
    inner.style.width = '100%';
    inner.style.height = '200px';
    outer = document.createElement('div');
    extend(outer.style, {
      position: 'absolute',
      top: 0,
      left: 0,
      pointerEvents: 'none',
      visibility: 'hidden',
      width: '200px',
      height: '150px',
      overflow: 'hidden'
    });
    outer.appendChild(inner);
    document.body.appendChild(outer);
    widthContained = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    widthScroll = inner.offsetWidth;
    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth;
    }
    document.body.removeChild(outer);
    width = widthContained - widthScroll;
    return {
      width: width,
      height: width
    };
  };

  extend = function(out) {
    var args, key, obj, val, _i, _len, _ref;
    if (out == null) {
      out = {};
    }
    args = [];
    Array.prototype.push.apply(args, arguments);
    _ref = args.slice(1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obj = _ref[_i];
      if (obj) {
        for (key in obj) {
          if (!__hasProp.call(obj, key)) continue;
          val = obj[key];
          out[key] = val;
        }
      }
    }
    return out;
  };

  removeClass = function(el, name) {
    var cls, _i, _len, _ref, _results;
    if (el.classList != null) {
      _ref = name.split(' ');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cls = _ref[_i];
        if (cls.trim()) {
          _results.push(el.classList.remove(cls));
        }
      }
      return _results;
    } else {
      return el.className = el.className.replace(new RegExp("(^| )" + (name.split(' ').join('|')) + "( |$)", 'gi'), ' ');
    }
  };

  addClass = function(el, name) {
    var cls, _i, _len, _ref, _results;
    if (el.classList != null) {
      _ref = name.split(' ');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cls = _ref[_i];
        if (cls.trim()) {
          _results.push(el.classList.add(cls));
        }
      }
      return _results;
    } else {
      removeClass(el, name);
      return el.className += " " + name;
    }
  };

  hasClass = function(el, name) {
    if (el.classList != null) {
      return el.classList.contains(name);
    } else {
      return new RegExp("(^| )" + name + "( |$)", 'gi').test(el.className);
    }
  };

  updateClasses = function(el, add, all) {
    var cls, _i, _j, _len, _len1, _results;
    for (_i = 0, _len = all.length; _i < _len; _i++) {
      cls = all[_i];
      if (__indexOf.call(add, cls) < 0) {
        if (hasClass(el, cls)) {
          removeClass(el, cls);
        }
      }
    }
    _results = [];
    for (_j = 0, _len1 = add.length; _j < _len1; _j++) {
      cls = add[_j];
      if (!hasClass(el, cls)) {
        _results.push(addClass(el, cls));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  deferred = [];

  defer = function(fn) {
    return deferred.push(fn);
  };

  flush = function() {
    var fn, _results;
    _results = [];
    while (fn = deferred.pop()) {
      _results.push(fn());
    }
    return _results;
  };

  Evented = (function() {
    function Evented() {}

    Evented.prototype.on = function(event, handler, ctx, once) {
      var _base;
      if (once == null) {
        once = false;
      }
      if (this.bindings == null) {
        this.bindings = {};
      }
      if ((_base = this.bindings)[event] == null) {
        _base[event] = [];
      }
      return this.bindings[event].push({
        handler: handler,
        ctx: ctx,
        once: once
      });
    };

    Evented.prototype.once = function(event, handler, ctx) {
      return this.on(event, handler, ctx, true);
    };

    Evented.prototype.off = function(event, handler) {
      var i, _ref, _results;
      if (((_ref = this.bindings) != null ? _ref[event] : void 0) == null) {
        return;
      }
      if (handler == null) {
        return delete this.bindings[event];
      } else {
        i = 0;
        _results = [];
        while (i < this.bindings[event].length) {
          if (this.bindings[event][i].handler === handler) {
            _results.push(this.bindings[event].splice(i, 1));
          } else {
            _results.push(i++);
          }
        }
        return _results;
      }
    };

    Evented.prototype.trigger = function() {
      var args, ctx, event, handler, i, once, _ref, _ref1, _results;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if ((_ref = this.bindings) != null ? _ref[event] : void 0) {
        i = 0;
        _results = [];
        while (i < this.bindings[event].length) {
          _ref1 = this.bindings[event][i], handler = _ref1.handler, ctx = _ref1.ctx, once = _ref1.once;
          handler.apply(ctx != null ? ctx : this, args);
          if (once) {
            _results.push(this.bindings[event].splice(i, 1));
          } else {
            _results.push(i++);
          }
        }
        return _results;
      }
    };

    return Evented;

  })();

  this.Tether.Utils = {
    getScrollParent: getScrollParent,
    getBounds: getBounds,
    getOffsetParent: getOffsetParent,
    extend: extend,
    addClass: addClass,
    removeClass: removeClass,
    hasClass: hasClass,
    updateClasses: updateClasses,
    defer: defer,
    flush: flush,
    uniqueId: uniqueId,
    Evented: Evented,
    getScrollBarSize: getScrollBarSize
  };

}).call(this);

(function() {
  var MIRROR_LR, MIRROR_TB, OFFSET_MAP, Tether, addClass, addOffset, attachmentToOffset, autoToFixedAttachment, defer, extend, flush, getBounds, getOffsetParent, getOuterSize, getScrollBarSize, getScrollParent, getSize, now, offsetToPx, parseAttachment, parseOffset, position, removeClass, tethers, transformKey, updateClasses, within, _Tether, _ref,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  if (this.Tether == null) {
    throw new Error("You must include the utils.js file before tether.js");
  }

  Tether = this.Tether;

  _ref = Tether.Utils, getScrollParent = _ref.getScrollParent, getSize = _ref.getSize, getOuterSize = _ref.getOuterSize, getBounds = _ref.getBounds, getOffsetParent = _ref.getOffsetParent, extend = _ref.extend, addClass = _ref.addClass, removeClass = _ref.removeClass, updateClasses = _ref.updateClasses, defer = _ref.defer, flush = _ref.flush, getScrollBarSize = _ref.getScrollBarSize;

  within = function(a, b, diff) {
    if (diff == null) {
      diff = 1;
    }
    return (a + diff >= b && b >= a - diff);
  };

  transformKey = (function() {
    var el, key, _i, _len, _ref1;
    el = document.createElement('div');
    _ref1 = ['transform', 'webkitTransform', 'OTransform', 'MozTransform', 'msTransform'];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      key = _ref1[_i];
      if (el.style[key] !== void 0) {
        return key;
      }
    }
  })();

  tethers = [];

  position = function() {
    var tether, _i, _len;
    for (_i = 0, _len = tethers.length; _i < _len; _i++) {
      tether = tethers[_i];
      tether.position(false);
    }
    return flush();
  };

  now = function() {
    var _ref1;
    return (_ref1 = typeof performance !== "undefined" && performance !== null ? typeof performance.now === "function" ? performance.now() : void 0 : void 0) != null ? _ref1 : +(new Date);
  };

  (function() {
    var event, lastCall, lastDuration, pendingTimeout, tick, _i, _len, _ref1, _results;
    lastCall = null;
    lastDuration = null;
    pendingTimeout = null;
    tick = function() {
      if ((lastDuration != null) && lastDuration > 16) {
        lastDuration = Math.min(lastDuration - 16, 250);
        pendingTimeout = setTimeout(tick, 250);
        return;
      }
      if ((lastCall != null) && (now() - lastCall) < 10) {
        return;
      }
      if (pendingTimeout != null) {
        clearTimeout(pendingTimeout);
        pendingTimeout = null;
      }
      lastCall = now();
      position();
      return lastDuration = now() - lastCall;
    };
    _ref1 = ['resize', 'scroll', 'touchmove'];
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      event = _ref1[_i];
      _results.push(window.addEventListener(event, tick));
    }
    return _results;
  })();

  MIRROR_LR = {
    center: 'center',
    left: 'right',
    right: 'left'
  };

  MIRROR_TB = {
    middle: 'middle',
    top: 'bottom',
    bottom: 'top'
  };

  OFFSET_MAP = {
    top: 0,
    left: 0,
    middle: '50%',
    center: '50%',
    bottom: '100%',
    right: '100%'
  };

  autoToFixedAttachment = function(attachment, relativeToAttachment) {
    var left, top;
    left = attachment.left, top = attachment.top;
    if (left === 'auto') {
      left = MIRROR_LR[relativeToAttachment.left];
    }
    if (top === 'auto') {
      top = MIRROR_TB[relativeToAttachment.top];
    }
    return {
      left: left,
      top: top
    };
  };

  attachmentToOffset = function(attachment) {
    var _ref1, _ref2;
    return {
      left: (_ref1 = OFFSET_MAP[attachment.left]) != null ? _ref1 : attachment.left,
      top: (_ref2 = OFFSET_MAP[attachment.top]) != null ? _ref2 : attachment.top
    };
  };

  addOffset = function() {
    var left, offsets, out, top, _i, _len, _ref1;
    offsets = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    out = {
      top: 0,
      left: 0
    };
    for (_i = 0, _len = offsets.length; _i < _len; _i++) {
      _ref1 = offsets[_i], top = _ref1.top, left = _ref1.left;
      if (typeof top === 'string') {
        top = parseFloat(top, 10);
      }
      if (typeof left === 'string') {
        left = parseFloat(left, 10);
      }
      out.top += top;
      out.left += left;
    }
    return out;
  };

  offsetToPx = function(offset, size) {
    if (typeof offset.left === 'string' && offset.left.indexOf('%') !== -1) {
      offset.left = parseFloat(offset.left, 10) / 100 * size.width;
    }
    if (typeof offset.top === 'string' && offset.top.indexOf('%') !== -1) {
      offset.top = parseFloat(offset.top, 10) / 100 * size.height;
    }
    return offset;
  };

  parseAttachment = parseOffset = function(value) {
    var left, top, _ref1;
    _ref1 = value.split(' '), top = _ref1[0], left = _ref1[1];
    return {
      top: top,
      left: left
    };
  };

  _Tether = (function() {
    _Tether.modules = [];

    function _Tether(options) {
      this.position = __bind(this.position, this);
      var module, _i, _len, _ref1, _ref2;
      tethers.push(this);
      this.history = [];
      this.setOptions(options, false);
      _ref1 = Tether.modules;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        module = _ref1[_i];
        if ((_ref2 = module.initialize) != null) {
          _ref2.call(this);
        }
      }
      this.position();
    }

    _Tether.prototype.getClass = function(key) {
      var _ref1, _ref2;
      if ((_ref1 = this.options.classes) != null ? _ref1[key] : void 0) {
        return this.options.classes[key];
      } else if (((_ref2 = this.options.classes) != null ? _ref2[key] : void 0) !== false) {
        if (this.options.classPrefix) {
          return "" + this.options.classPrefix + "-" + key;
        } else {
          return key;
        }
      } else {
        return '';
      }
    };

    _Tether.prototype.setOptions = function(options, position) {
      var defaults, key, _i, _len, _ref1, _ref2;
      this.options = options;
      if (position == null) {
        position = true;
      }
      defaults = {
        offset: '0 0',
        targetOffset: '0 0',
        targetAttachment: 'auto auto',
        classPrefix: 'tether'
      };
      this.options = extend(defaults, this.options);
      _ref1 = this.options, this.element = _ref1.element, this.target = _ref1.target, this.targetModifier = _ref1.targetModifier;
      if (this.target === 'viewport') {
        this.target = document.body;
        this.targetModifier = 'visible';
      } else if (this.target === 'scroll-handle') {
        this.target = document.body;
        this.targetModifier = 'scroll-handle';
      }
      _ref2 = ['element', 'target'];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        key = _ref2[_i];
        if (this[key] == null) {
          throw new Error("Tether Error: Both element and target must be defined");
        }
        if (this[key].jquery != null) {
          this[key] = this[key][0];
        } else if (typeof this[key] === 'string') {
          this[key] = document.querySelector(this[key]);
        }
      }
      addClass(this.element, this.getClass('element'));
      addClass(this.target, this.getClass('target'));
      if (!this.options.attachment) {
        throw new Error("Tether Error: You must provide an attachment");
      }
      this.targetAttachment = parseAttachment(this.options.targetAttachment);
      this.attachment = parseAttachment(this.options.attachment);
      this.offset = parseOffset(this.options.offset);
      this.targetOffset = parseOffset(this.options.targetOffset);
      if (this.scrollParent != null) {
        this.disable();
      }
      if (this.targetModifier === 'scroll-handle') {
        this.scrollParent = this.target;
      } else {
        this.scrollParent = getScrollParent(this.target);
      }
      if (this.options.enabled !== false) {
        return this.enable(position);
      }
    };

    _Tether.prototype.getTargetBounds = function() {
      var bounds, fitAdj, hasBottomScroll, height, out, scrollBottom, scrollPercentage, style, target;
      if (this.targetModifier != null) {
        switch (this.targetModifier) {
          case 'visible':
            if (this.target === document.body) {
              return {
                top: pageYOffset,
                left: pageXOffset,
                height: innerHeight,
                width: innerWidth
              };
            } else {
              bounds = getBounds(this.target);
              out = {
                height: bounds.height,
                width: bounds.width,
                top: bounds.top,
                left: bounds.left
              };
              out.height = Math.min(out.height, bounds.height - (pageYOffset - bounds.top));
              out.height = Math.min(out.height, bounds.height - ((bounds.top + bounds.height) - (pageYOffset + innerHeight)));
              out.height = Math.min(innerHeight, out.height);
              out.height -= 2;
              out.width = Math.min(out.width, bounds.width - (pageXOffset - bounds.left));
              out.width = Math.min(out.width, bounds.width - ((bounds.left + bounds.width) - (pageXOffset + innerWidth)));
              out.width = Math.min(innerWidth, out.width);
              out.width -= 2;
              if (out.top < pageYOffset) {
                out.top = pageYOffset;
              }
              if (out.left < pageXOffset) {
                out.left = pageXOffset;
              }
              return out;
            }
            break;
          case 'scroll-handle':
            target = this.target;
            if (target === document.body) {
              target = document.documentElement;
              bounds = {
                left: pageXOffset,
                top: pageYOffset,
                height: innerHeight,
                width: innerWidth
              };
            } else {
              bounds = getBounds(target);
            }
            style = getComputedStyle(target);
            hasBottomScroll = target.scrollWidth > target.clientWidth || 'scroll' === [style.overflow, style.overflowX] || this.target !== document.body;
            scrollBottom = 0;
            if (hasBottomScroll) {
              scrollBottom = 15;
            }
            height = bounds.height - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth) - scrollBottom;
            out = {
              width: 15,
              height: height * 0.975 * (height / target.scrollHeight),
              left: bounds.left + bounds.width - parseFloat(style.borderLeftWidth) - 15
            };
            fitAdj = 0;
            if (height < 408 && this.target === document.body) {
              fitAdj = -0.00011 * Math.pow(height, 2) - 0.00727 * height + 22.58;
            }
            if (this.target !== document.body) {
              out.height = Math.max(out.height, 24);
            }
            scrollPercentage = this.target.scrollTop / (target.scrollHeight - height);
            out.top = scrollPercentage * (height - out.height - fitAdj) + bounds.top + parseFloat(style.borderTopWidth);
            if (this.target === document.body) {
              out.height = Math.max(out.height, 24);
            }
            return out;
        }
      } else {
        return getBounds(this.target);
      }
    };

    _Tether.prototype.clearCache = function() {
      return this._cache = {};
    };

    _Tether.prototype.cache = function(k, getter) {
      if (this._cache == null) {
        this._cache = {};
      }
      if (this._cache[k] == null) {
        this._cache[k] = getter.call(this);
      }
      return this._cache[k];
    };

    _Tether.prototype.enable = function(position) {
      if (position == null) {
        position = true;
      }
      addClass(this.target, this.getClass('enabled'));
      addClass(this.element, this.getClass('enabled'));
      this.enabled = true;
      if (this.scrollParent !== document) {
        this.scrollParent.addEventListener('scroll', this.position);
      }
      if (position) {
        return this.position();
      }
    };

    _Tether.prototype.disable = function() {
      removeClass(this.target, this.getClass('enabled'));
      removeClass(this.element, this.getClass('enabled'));
      this.enabled = false;
      if (this.scrollParent != null) {
        return this.scrollParent.removeEventListener('scroll', this.position);
      }
    };

    _Tether.prototype.destroy = function() {
      var i, tether, _i, _len, _results;
      this.disable();
      _results = [];
      for (i = _i = 0, _len = tethers.length; _i < _len; i = ++_i) {
        tether = tethers[i];
        if (tether === this) {
          tethers.splice(i, 1);
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    _Tether.prototype.updateAttachClasses = function(elementAttach, targetAttach) {
      var add, all, side, sides, _i, _j, _len, _len1, _ref1,
        _this = this;
      if (elementAttach == null) {
        elementAttach = this.attachment;
      }
      if (targetAttach == null) {
        targetAttach = this.targetAttachment;
      }
      sides = ['left', 'top', 'bottom', 'right', 'middle', 'center'];
      if ((_ref1 = this._addAttachClasses) != null ? _ref1.length : void 0) {
        this._addAttachClasses.splice(0, this._addAttachClasses.length);
      }
      add = this._addAttachClasses != null ? this._addAttachClasses : this._addAttachClasses = [];
      if (elementAttach.top) {
        add.push("" + (this.getClass('element-attached')) + "-" + elementAttach.top);
      }
      if (elementAttach.left) {
        add.push("" + (this.getClass('element-attached')) + "-" + elementAttach.left);
      }
      if (targetAttach.top) {
        add.push("" + (this.getClass('target-attached')) + "-" + targetAttach.top);
      }
      if (targetAttach.left) {
        add.push("" + (this.getClass('target-attached')) + "-" + targetAttach.left);
      }
      all = [];
      for (_i = 0, _len = sides.length; _i < _len; _i++) {
        side = sides[_i];
        all.push("" + (this.getClass('element-attached')) + "-" + side);
      }
      for (_j = 0, _len1 = sides.length; _j < _len1; _j++) {
        side = sides[_j];
        all.push("" + (this.getClass('target-attached')) + "-" + side);
      }
      return defer(function() {
        if (_this._addAttachClasses == null) {
          return;
        }
        updateClasses(_this.element, _this._addAttachClasses, all);
        updateClasses(_this.target, _this._addAttachClasses, all);
        return _this._addAttachClasses = void 0;
      });
    };

    _Tether.prototype.position = function(flushChanges) {
      var elementPos, elementStyle, height, left, manualOffset, manualTargetOffset, module, next, offset, offsetBorder, offsetParent, offsetParentSize, offsetParentStyle, offsetPosition, ret, scrollLeft, scrollTop, scrollbarSize, side, targetAttachment, targetOffset, targetPos, targetSize, top, width, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6,
        _this = this;
      if (flushChanges == null) {
        flushChanges = true;
      }
      if (!this.enabled) {
        return;
      }
      this.clearCache();
      targetAttachment = autoToFixedAttachment(this.targetAttachment, this.attachment);
      this.updateAttachClasses(this.attachment, targetAttachment);
      elementPos = this.cache('element-bounds', function() {
        return getBounds(_this.element);
      });
      width = elementPos.width, height = elementPos.height;
      if (width === 0 && height === 0 && (this.lastSize != null)) {
        _ref1 = this.lastSize, width = _ref1.width, height = _ref1.height;
      } else {
        this.lastSize = {
          width: width,
          height: height
        };
      }
      targetSize = targetPos = this.cache('target-bounds', function() {
        return _this.getTargetBounds();
      });
      offset = offsetToPx(attachmentToOffset(this.attachment), {
        width: width,
        height: height
      });
      targetOffset = offsetToPx(attachmentToOffset(targetAttachment), targetSize);
      manualOffset = offsetToPx(this.offset, {
        width: width,
        height: height
      });
      manualTargetOffset = offsetToPx(this.targetOffset, targetSize);
      offset = addOffset(offset, manualOffset);
      targetOffset = addOffset(targetOffset, manualTargetOffset);
      left = targetPos.left + targetOffset.left - offset.left;
      top = targetPos.top + targetOffset.top - offset.top;
      _ref2 = Tether.modules;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        module = _ref2[_i];
        ret = module.position.call(this, {
          left: left,
          top: top,
          targetAttachment: targetAttachment,
          targetPos: targetPos,
          attachment: this.attachment,
          elementPos: elementPos,
          offset: offset,
          targetOffset: targetOffset,
          manualOffset: manualOffset,
          manualTargetOffset: manualTargetOffset,
          scrollbarSize: scrollbarSize
        });
        if ((ret == null) || typeof ret !== 'object') {
          continue;
        } else if (ret === false) {
          return false;
        } else {
          top = ret.top, left = ret.left;
        }
      }
      next = {
        page: {
          top: top,
          left: left
        },
        viewport: {
          top: top - pageYOffset,
          bottom: pageYOffset - top - height + innerHeight,
          left: left - pageXOffset,
          right: pageXOffset - left - width + innerWidth
        }
      };
      if (document.body.scrollWidth > window.innerWidth) {
        scrollbarSize = this.cache('scrollbar-size', getScrollBarSize);
        next.viewport.bottom -= scrollbarSize.height;
      }
      if (document.body.scrollHeight > window.innerHeight) {
        scrollbarSize = this.cache('scrollbar-size', getScrollBarSize);
        next.viewport.right -= scrollbarSize.width;
      }
      if (((_ref3 = document.body.style.position) !== '' && _ref3 !== 'static') || ((_ref4 = document.body.parentElement.style.position) !== '' && _ref4 !== 'static')) {
        next.page.bottom = document.body.scrollHeight - top - height;
        next.page.right = document.body.scrollWidth - left - width;
      }
      if (((_ref5 = this.options.optimizations) != null ? _ref5.moveElement : void 0) !== false && (this.targetModifier == null)) {
        offsetParent = this.cache('target-offsetparent', function() {
          return getOffsetParent(_this.target);
        });
        offsetPosition = this.cache('target-offsetparent-bounds', function() {
          return getBounds(offsetParent);
        });
        offsetParentStyle = getComputedStyle(offsetParent);
        elementStyle = getComputedStyle(this.element);
        offsetParentSize = offsetPosition;
        offsetBorder = {};
        _ref6 = ['Top', 'Left', 'Bottom', 'Right'];
        for (_j = 0, _len1 = _ref6.length; _j < _len1; _j++) {
          side = _ref6[_j];
          offsetBorder[side.toLowerCase()] = parseFloat(offsetParentStyle["border" + side + "Width"]);
        }
        offsetPosition.right = document.body.scrollWidth - offsetPosition.left - offsetParentSize.width + offsetBorder.right;
        offsetPosition.bottom = document.body.scrollHeight - offsetPosition.top - offsetParentSize.height + offsetBorder.bottom;
        if (next.page.top >= (offsetPosition.top + offsetBorder.top) && next.page.bottom >= offsetPosition.bottom) {
          if (next.page.left >= (offsetPosition.left + offsetBorder.left) && next.page.right >= offsetPosition.right) {
            scrollTop = offsetParent.scrollTop;
            scrollLeft = offsetParent.scrollLeft;
            next.offset = {
              top: next.page.top - offsetPosition.top + scrollTop - offsetBorder.top,
              left: next.page.left - offsetPosition.left + scrollLeft - offsetBorder.left
            };
          }
        }
      }
      this.move(next);
      this.history.unshift(next);
      if (this.history.length > 3) {
        this.history.pop();
      }
      if (flushChanges) {
        flush();
      }
      return true;
    };

    _Tether.prototype.move = function(position) {
      var css, elVal, found, key, moved, offsetParent, point, same, transcribe, type, val, write, writeCSS, _i, _len, _ref1, _ref2,
        _this = this;
      if (this.element.parentNode == null) {
        return;
      }
      same = {};
      for (type in position) {
        same[type] = {};
        for (key in position[type]) {
          found = false;
          _ref1 = this.history;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            point = _ref1[_i];
            if (!within((_ref2 = point[type]) != null ? _ref2[key] : void 0, position[type][key])) {
              found = true;
              break;
            }
          }
          if (!found) {
            same[type][key] = true;
          }
        }
      }
      css = {
        top: '',
        left: '',
        right: '',
        bottom: ''
      };
      transcribe = function(same, pos) {
        var xPos, yPos, _ref3;
        if (((_ref3 = _this.options.optimizations) != null ? _ref3.gpu : void 0) !== false) {
          if (same.top) {
            css.top = 0;
            yPos = pos.top;
          } else {
            css.bottom = 0;
            yPos = -pos.bottom;
          }
          if (same.left) {
            css.left = 0;
            xPos = pos.left;
          } else {
            css.right = 0;
            xPos = -pos.right;
          }
          css[transformKey] = "translateX(" + (Math.round(xPos)) + "px) translateY(" + (Math.round(yPos)) + "px)";
          if (transformKey !== 'msTransform') {
            return css[transformKey] += " translateZ(0)";
          }
        } else {
          if (same.top) {
            css.top = "" + pos.top + "px";
          } else {
            css.bottom = "" + pos.bottom + "px";
          }
          if (same.left) {
            return css.left = "" + pos.left + "px";
          } else {
            return css.right = "" + pos.right + "px";
          }
        }
      };
      moved = false;
      if ((same.page.top || same.page.bottom) && (same.page.left || same.page.right)) {
        css.position = 'absolute';
        transcribe(same.page, position.page);
      } else if ((same.viewport.top || same.viewport.bottom) && (same.viewport.left || same.viewport.right)) {
        css.position = 'fixed';
        transcribe(same.viewport, position.viewport);
      } else if ((same.offset != null) && same.offset.top && same.offset.left) {
        css.position = 'absolute';
        offsetParent = this.cache('target-offsetparent', function() {
          return getOffsetParent(_this.target);
        });
        if (getOffsetParent(this.element) !== offsetParent) {
          defer(function() {
            _this.element.parentNode.removeChild(_this.element);
            return offsetParent.appendChild(_this.element);
          });
        }
        transcribe(same.offset, position.offset);
        moved = true;
      } else {
        css.position = 'absolute';
        transcribe({
          top: true,
          left: true
        }, position.page);
      }
      if (!moved && this.element.parentNode.tagName !== 'BODY') {
        this.element.parentNode.removeChild(this.element);
        document.body.appendChild(this.element);
      }
      writeCSS = {};
      write = false;
      for (key in css) {
        val = css[key];
        elVal = this.element.style[key];
        if (elVal !== '' && val !== '' && (key === 'top' || key === 'left' || key === 'bottom' || key === 'right')) {
          elVal = parseFloat(elVal);
          val = parseFloat(val);
        }
        if (elVal !== val) {
          write = true;
          writeCSS[key] = css[key];
        }
      }
      if (write) {
        return defer(function() {
          return extend(_this.element.style, writeCSS);
        });
      }
    };

    return _Tether;

  })();

  Tether.position = position;

  this.Tether = extend(_Tether, Tether);

}).call(this);

(function() {
  var BOUNDS_FORMAT, MIRROR_ATTACH, defer, extend, getBoundingRect, getBounds, getOuterSize, getSize, updateClasses, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = this.Tether.Utils, getOuterSize = _ref.getOuterSize, getBounds = _ref.getBounds, getSize = _ref.getSize, extend = _ref.extend, updateClasses = _ref.updateClasses, defer = _ref.defer;

  MIRROR_ATTACH = {
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top',
    middle: 'middle'
  };

  BOUNDS_FORMAT = ['left', 'top', 'right', 'bottom'];

  getBoundingRect = function(tether, to) {
    var i, pos, side, size, style, _i, _len;
    if (to === 'scrollParent') {
      to = tether.scrollParent;
    } else if (to === 'window') {
      to = [pageXOffset, pageYOffset, innerWidth + pageXOffset, innerHeight + pageYOffset];
    }
    if (to === document) {
      to = to.documentElement;
    }
    if (to.nodeType != null) {
      pos = size = getBounds(to);
      style = getComputedStyle(to);
      to = [pos.left, pos.top, size.width + pos.left, size.height + pos.top];
      for (i = _i = 0, _len = BOUNDS_FORMAT.length; _i < _len; i = ++_i) {
        side = BOUNDS_FORMAT[i];
        side = side[0].toUpperCase() + side.substr(1);
        if (side === 'Top' || side === 'Left') {
          to[i] += parseFloat(style["border" + side + "Width"]);
        } else {
          to[i] -= parseFloat(style["border" + side + "Width"]);
        }
      }
    }
    return to;
  };

  this.Tether.modules.push({
    position: function(_arg) {
      var addClasses, allClasses, attachment, bounds, changeAttachX, changeAttachY, cls, constraint, eAttachment, height, left, oob, oobClass, p, pin, pinned, pinnedClass, removeClass, side, tAttachment, targetAttachment, targetHeight, targetSize, targetWidth, to, top, width, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8,
        _this = this;
      top = _arg.top, left = _arg.left, targetAttachment = _arg.targetAttachment;
      if (!this.options.constraints) {
        return true;
      }
      removeClass = function(prefix) {
        var side, _i, _len, _results;
        _this.removeClass(prefix);
        _results = [];
        for (_i = 0, _len = BOUNDS_FORMAT.length; _i < _len; _i++) {
          side = BOUNDS_FORMAT[_i];
          _results.push(_this.removeClass("" + prefix + "-" + side));
        }
        return _results;
      };
      _ref1 = this.cache('element-bounds', function() {
        return getBounds(_this.element);
      }), height = _ref1.height, width = _ref1.width;
      if (width === 0 && height === 0 && (this.lastSize != null)) {
        _ref2 = this.lastSize, width = _ref2.width, height = _ref2.height;
      }
      targetSize = this.cache('target-bounds', function() {
        return _this.getTargetBounds();
      });
      targetHeight = targetSize.height;
      targetWidth = targetSize.width;
      tAttachment = {};
      eAttachment = {};
      allClasses = [this.getClass('pinned'), this.getClass('out-of-bounds')];
      _ref3 = this.options.constraints;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        constraint = _ref3[_i];
        if (constraint.outOfBoundsClass) {
          allClasses.push(constraint.outOfBoundsClass);
        }
        if (constraint.pinnedClass) {
          allClasses.push(constraint.pinnedClass);
        }
      }
      for (_j = 0, _len1 = allClasses.length; _j < _len1; _j++) {
        cls = allClasses[_j];
        _ref4 = ['left', 'top', 'right', 'bottom'];
        for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
          side = _ref4[_k];
          allClasses.push("" + cls + "-" + side);
        }
      }
      addClasses = [];
      tAttachment = extend({}, targetAttachment);
      eAttachment = extend({}, this.attachment);
      _ref5 = this.options.constraints;
      for (_l = 0, _len3 = _ref5.length; _l < _len3; _l++) {
        constraint = _ref5[_l];
        to = constraint.to, attachment = constraint.attachment, pin = constraint.pin;
        if (attachment == null) {
          attachment = '';
        }
        if (__indexOf.call(attachment, ' ') >= 0) {
          _ref6 = attachment.split(' '), changeAttachY = _ref6[0], changeAttachX = _ref6[1];
        } else {
          changeAttachX = changeAttachY = attachment;
        }
        bounds = getBoundingRect(this, to);
        if (changeAttachY === 'target' || changeAttachY === 'both') {
          if (top < bounds[1] && tAttachment.top === 'top') {
            top += targetHeight;
            tAttachment.top = 'bottom';
          }
          if (top + height > bounds[3] && tAttachment.top === 'bottom') {
            top -= targetHeight;
            tAttachment.top = 'top';
          }
        }
        if (changeAttachY === 'together') {
          if (top < bounds[1] && tAttachment.top === 'top') {
            if (eAttachment.top === 'bottom') {
              top += targetHeight;
              tAttachment.top = 'bottom';
              top += height;
              eAttachment.top = 'top';
            } else if (eAttachment.top === 'top') {
              top += targetHeight;
              tAttachment.top = 'bottom';
              top -= height;
              eAttachment.top = 'bottom';
            }
          }
          if (top + height > bounds[3] && tAttachment.top === 'bottom') {
            if (eAttachment.top === 'top') {
              top -= targetHeight;
              tAttachment.top = 'top';
              top -= height;
              eAttachment.top = 'bottom';
            } else if (eAttachment.top === 'bottom') {
              top -= targetHeight;
              tAttachment.top = 'top';
              top += height;
              eAttachment.top = 'top';
            }
          }
          if (tAttachment.top === 'middle') {
            if (top + height > bounds[3] && eAttachment.top === 'top') {
              top -= height;
              eAttachment.top = 'bottom';
            } else if (top < bounds[1] && eAttachment.top === 'bottom') {
              top += height;
              eAttachment.top = 'top';
            }
          }
        }
        if (changeAttachX === 'target' || changeAttachX === 'both') {
          if (left < bounds[0] && tAttachment.left === 'left') {
            left += targetWidth;
            tAttachment.left = 'right';
          }
          if (left + width > bounds[2] && tAttachment.left === 'right') {
            left -= targetWidth;
            tAttachment.left = 'left';
          }
        }
        if (changeAttachX === 'together') {
          if (left < bounds[0] && tAttachment.left === 'left') {
            if (eAttachment.left === 'right') {
              left += targetWidth;
              tAttachment.left = 'right';
              left += width;
              eAttachment.left = 'left';
            } else if (eAttachment.left === 'left') {
              left += targetWidth;
              tAttachment.left = 'right';
              left -= width;
              eAttachment.left = 'right';
            }
          } else if (left + width > bounds[2] && tAttachment.left === 'right') {
            if (eAttachment.left === 'left') {
              left -= targetWidth;
              tAttachment.left = 'left';
              left -= width;
              eAttachment.left = 'right';
            } else if (eAttachment.left === 'right') {
              left -= targetWidth;
              tAttachment.left = 'left';
              left += width;
              eAttachment.left = 'left';
            }
          } else if (tAttachment.left === 'center') {
            if (left + width > bounds[2] && eAttachment.left === 'left') {
              left -= width;
              eAttachment.left = 'right';
            } else if (left < bounds[0] && eAttachment.left === 'right') {
              left += width;
              eAttachment.left = 'left';
            }
          }
        }
        if (changeAttachY === 'element' || changeAttachY === 'both') {
          if (top < bounds[1] && eAttachment.top === 'bottom') {
            top += height;
            eAttachment.top = 'top';
          }
          if (top + height > bounds[3] && eAttachment.top === 'top') {
            top -= height;
            eAttachment.top = 'bottom';
          }
        }
        if (changeAttachX === 'element' || changeAttachX === 'both') {
          if (left < bounds[0] && eAttachment.left === 'right') {
            left += width;
            eAttachment.left = 'left';
          }
          if (left + width > bounds[2] && eAttachment.left === 'left') {
            left -= width;
            eAttachment.left = 'right';
          }
        }
        if (typeof pin === 'string') {
          pin = (function() {
            var _len4, _m, _ref7, _results;
            _ref7 = pin.split(',');
            _results = [];
            for (_m = 0, _len4 = _ref7.length; _m < _len4; _m++) {
              p = _ref7[_m];
              _results.push(p.trim());
            }
            return _results;
          })();
        } else if (pin === true) {
          pin = ['top', 'left', 'right', 'bottom'];
        }
        pin || (pin = []);
        pinned = [];
        oob = [];
        if (top < bounds[1]) {
          if (__indexOf.call(pin, 'top') >= 0) {
            top = bounds[1];
            pinned.push('top');
          } else {
            oob.push('top');
          }
        }
        if (top + height > bounds[3]) {
          if (__indexOf.call(pin, 'bottom') >= 0) {
            top = bounds[3] - height;
            pinned.push('bottom');
          } else {
            oob.push('bottom');
          }
        }
        if (left < bounds[0]) {
          if (__indexOf.call(pin, 'left') >= 0) {
            left = bounds[0];
            pinned.push('left');
          } else {
            oob.push('left');
          }
        }
        if (left + width > bounds[2]) {
          if (__indexOf.call(pin, 'right') >= 0) {
            left = bounds[2] - width;
            pinned.push('right');
          } else {
            oob.push('right');
          }
        }
        if (pinned.length) {
          pinnedClass = (_ref7 = this.options.pinnedClass) != null ? _ref7 : this.getClass('pinned');
          addClasses.push(pinnedClass);
          for (_m = 0, _len4 = pinned.length; _m < _len4; _m++) {
            side = pinned[_m];
            addClasses.push("" + pinnedClass + "-" + side);
          }
        }
        if (oob.length) {
          oobClass = (_ref8 = this.options.outOfBoundsClass) != null ? _ref8 : this.getClass('out-of-bounds');
          addClasses.push(oobClass);
          for (_n = 0, _len5 = oob.length; _n < _len5; _n++) {
            side = oob[_n];
            addClasses.push("" + oobClass + "-" + side);
          }
        }
        if (__indexOf.call(pinned, 'left') >= 0 || __indexOf.call(pinned, 'right') >= 0) {
          eAttachment.left = tAttachment.left = false;
        }
        if (__indexOf.call(pinned, 'top') >= 0 || __indexOf.call(pinned, 'bottom') >= 0) {
          eAttachment.top = tAttachment.top = false;
        }
        if (tAttachment.top !== targetAttachment.top || tAttachment.left !== targetAttachment.left || eAttachment.top !== this.attachment.top || eAttachment.left !== this.attachment.left) {
          this.updateAttachClasses(eAttachment, tAttachment);
        }
      }
      defer(function() {
        updateClasses(_this.target, addClasses, allClasses);
        return updateClasses(_this.element, addClasses, allClasses);
      });
      return {
        top: top,
        left: left
      };
    }
  });

}).call(this);

(function() {
  var defer, getBounds, updateClasses, _ref;

  _ref = this.Tether.Utils, getBounds = _ref.getBounds, updateClasses = _ref.updateClasses, defer = _ref.defer;

  this.Tether.modules.push({
    position: function(_arg) {
      var abutted, addClasses, allClasses, bottom, height, left, right, side, sides, targetPos, top, width, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref1, _ref2, _ref3, _ref4, _ref5,
        _this = this;
      top = _arg.top, left = _arg.left;
      _ref1 = this.cache('element-bounds', function() {
        return getBounds(_this.element);
      }), height = _ref1.height, width = _ref1.width;
      targetPos = this.getTargetBounds();
      bottom = top + height;
      right = left + width;
      abutted = [];
      if (top <= targetPos.bottom && bottom >= targetPos.top) {
        _ref2 = ['left', 'right'];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          side = _ref2[_i];
          if ((_ref3 = targetPos[side]) === left || _ref3 === right) {
            abutted.push(side);
          }
        }
      }
      if (left <= targetPos.right && right >= targetPos.left) {
        _ref4 = ['top', 'bottom'];
        for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
          side = _ref4[_j];
          if ((_ref5 = targetPos[side]) === top || _ref5 === bottom) {
            abutted.push(side);
          }
        }
      }
      allClasses = [];
      addClasses = [];
      sides = ['left', 'top', 'right', 'bottom'];
      allClasses.push(this.getClass('abutted'));
      for (_k = 0, _len2 = sides.length; _k < _len2; _k++) {
        side = sides[_k];
        allClasses.push("" + (this.getClass('abutted')) + "-" + side);
      }
      if (abutted.length) {
        addClasses.push(this.getClass('abutted'));
      }
      for (_l = 0, _len3 = abutted.length; _l < _len3; _l++) {
        side = abutted[_l];
        addClasses.push("" + (this.getClass('abutted')) + "-" + side);
      }
      defer(function() {
        updateClasses(_this.target, addClasses, allClasses);
        return updateClasses(_this.element, addClasses, allClasses);
      });
      return true;
    }
  });

}).call(this);

(function() {
  this.Tether.modules.push({
    position: function(_arg) {
      var left, result, shift, shiftLeft, shiftTop, top, _ref;
      top = _arg.top, left = _arg.left;
      if (!this.options.shift) {
        return;
      }
      result = function(val) {
        if (typeof val === 'function') {
          return val.call(this, {
            top: top,
            left: left
          });
        } else {
          return val;
        }
      };
      shift = result(this.options.shift);
      if (typeof shift === 'string') {
        shift = shift.split(' ');
        shift[1] || (shift[1] = shift[0]);
        shiftTop = shift[0], shiftLeft = shift[1];
        shiftTop = parseFloat(shiftTop, 10);
        shiftLeft = parseFloat(shiftLeft, 10);
      } else {
        _ref = [shift.top, shift.left], shiftTop = _ref[0], shiftLeft = _ref[1];
      }
      top += shiftTop;
      left += shiftLeft;
      return {
        top: top,
        left: left
      };
    }
  });

}).call(this);

return this.Tether;

}));

/*! drop 0.5.4 */
/*! tether 0.6.5 */


(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require,exports,module);
  } else {
    root.Tether = factory();
  }
}(this, function(require,exports,module) {

(function() {
  var Evented, addClass, defer, deferred, extend, flush, getBounds, getOffsetParent, getOrigin, getScrollBarSize, getScrollParent, hasClass, node, removeClass, uniqueId, updateClasses, zeroPosCache,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  if (this.Tether == null) {
    this.Tether = {
      modules: []
    };
  }

  getScrollParent = function(el) {
    var parent, position, scrollParent, style, _ref;
    position = getComputedStyle(el).position;
    if (position === 'fixed') {
      return el;
    }
    scrollParent = void 0;
    parent = el;
    while (parent = parent.parentNode) {
      try {
        style = getComputedStyle(parent);
      } catch (_error) {}
      if (style == null) {
        return parent;
      }
      if (/(auto|scroll)/.test(style['overflow'] + style['overflow-y'] + style['overflow-x'])) {
        if (position !== 'absolute' || ((_ref = style['position']) === 'relative' || _ref === 'absolute' || _ref === 'fixed')) {
          return parent;
        }
      }
    }
    return document.body;
  };

  uniqueId = (function() {
    var id;
    id = 0;
    return function() {
      return id++;
    };
  })();

  zeroPosCache = {};

  getOrigin = function(doc) {
    var id, k, node, v, _ref;
    node = doc._tetherZeroElement;
    if (node == null) {
      node = doc.createElement('div');
      node.setAttribute('data-tether-id', uniqueId());
      extend(node.style, {
        top: 0,
        left: 0,
        position: 'absolute'
      });
      doc.body.appendChild(node);
      doc._tetherZeroElement = node;
    }
    id = node.getAttribute('data-tether-id');
    if (zeroPosCache[id] == null) {
      zeroPosCache[id] = {};
      _ref = node.getBoundingClientRect();
      for (k in _ref) {
        v = _ref[k];
        zeroPosCache[id][k] = v;
      }
      defer(function() {
        return zeroPosCache[id] = void 0;
      });
    }
    return zeroPosCache[id];
  };

  node = null;

  getBounds = function(el) {
    var box, doc, docEl, k, origin, v, _ref;
    if (el === document) {
      doc = document;
      el = document.documentElement;
    } else {
      doc = el.ownerDocument;
    }
    docEl = doc.documentElement;
    box = {};
    _ref = el.getBoundingClientRect();
    for (k in _ref) {
      v = _ref[k];
      box[k] = v;
    }
    origin = getOrigin(doc);
    box.top -= origin.top;
    box.left -= origin.left;
    if (box.width == null) {
      box.width = document.body.scrollWidth - box.left - box.right;
    }
    if (box.height == null) {
      box.height = document.body.scrollHeight - box.top - box.bottom;
    }
    box.top = box.top - docEl.clientTop;
    box.left = box.left - docEl.clientLeft;
    box.right = doc.body.clientWidth - box.width - box.left;
    box.bottom = doc.body.clientHeight - box.height - box.top;
    return box;
  };

  getOffsetParent = function(el) {
    return el.offsetParent || document.documentElement;
  };

  getScrollBarSize = function() {
    var inner, outer, width, widthContained, widthScroll;
    inner = document.createElement('div');
    inner.style.width = '100%';
    inner.style.height = '200px';
    outer = document.createElement('div');
    extend(outer.style, {
      position: 'absolute',
      top: 0,
      left: 0,
      pointerEvents: 'none',
      visibility: 'hidden',
      width: '200px',
      height: '150px',
      overflow: 'hidden'
    });
    outer.appendChild(inner);
    document.body.appendChild(outer);
    widthContained = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    widthScroll = inner.offsetWidth;
    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth;
    }
    document.body.removeChild(outer);
    width = widthContained - widthScroll;
    return {
      width: width,
      height: width
    };
  };

  extend = function(out) {
    var args, key, obj, val, _i, _len, _ref;
    if (out == null) {
      out = {};
    }
    args = [];
    Array.prototype.push.apply(args, arguments);
    _ref = args.slice(1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obj = _ref[_i];
      if (obj) {
        for (key in obj) {
          if (!__hasProp.call(obj, key)) continue;
          val = obj[key];
          out[key] = val;
        }
      }
    }
    return out;
  };

  removeClass = function(el, name) {
    var cls, _i, _len, _ref, _results;
    if (el.classList != null) {
      _ref = name.split(' ');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cls = _ref[_i];
        if (cls.trim()) {
          _results.push(el.classList.remove(cls));
        }
      }
      return _results;
    } else {
      return el.className = el.className.replace(new RegExp("(^| )" + (name.split(' ').join('|')) + "( |$)", 'gi'), ' ');
    }
  };

  addClass = function(el, name) {
    var cls, _i, _len, _ref, _results;
    if (el.classList != null) {
      _ref = name.split(' ');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cls = _ref[_i];
        if (cls.trim()) {
          _results.push(el.classList.add(cls));
        }
      }
      return _results;
    } else {
      removeClass(el, name);
      return el.className += " " + name;
    }
  };

  hasClass = function(el, name) {
    if (el.classList != null) {
      return el.classList.contains(name);
    } else {
      return new RegExp("(^| )" + name + "( |$)", 'gi').test(el.className);
    }
  };

  updateClasses = function(el, add, all) {
    var cls, _i, _j, _len, _len1, _results;
    for (_i = 0, _len = all.length; _i < _len; _i++) {
      cls = all[_i];
      if (__indexOf.call(add, cls) < 0) {
        if (hasClass(el, cls)) {
          removeClass(el, cls);
        }
      }
    }
    _results = [];
    for (_j = 0, _len1 = add.length; _j < _len1; _j++) {
      cls = add[_j];
      if (!hasClass(el, cls)) {
        _results.push(addClass(el, cls));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  deferred = [];

  defer = function(fn) {
    return deferred.push(fn);
  };

  flush = function() {
    var fn, _results;
    _results = [];
    while (fn = deferred.pop()) {
      _results.push(fn());
    }
    return _results;
  };

  Evented = (function() {
    function Evented() {}

    Evented.prototype.on = function(event, handler, ctx, once) {
      var _base;
      if (once == null) {
        once = false;
      }
      if (this.bindings == null) {
        this.bindings = {};
      }
      if ((_base = this.bindings)[event] == null) {
        _base[event] = [];
      }
      return this.bindings[event].push({
        handler: handler,
        ctx: ctx,
        once: once
      });
    };

    Evented.prototype.once = function(event, handler, ctx) {
      return this.on(event, handler, ctx, true);
    };

    Evented.prototype.off = function(event, handler) {
      var i, _ref, _results;
      if (((_ref = this.bindings) != null ? _ref[event] : void 0) == null) {
        return;
      }
      if (handler == null) {
        return delete this.bindings[event];
      } else {
        i = 0;
        _results = [];
        while (i < this.bindings[event].length) {
          if (this.bindings[event][i].handler === handler) {
            _results.push(this.bindings[event].splice(i, 1));
          } else {
            _results.push(i++);
          }
        }
        return _results;
      }
    };

    Evented.prototype.trigger = function() {
      var args, ctx, event, handler, i, once, _ref, _ref1, _results;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if ((_ref = this.bindings) != null ? _ref[event] : void 0) {
        i = 0;
        _results = [];
        while (i < this.bindings[event].length) {
          _ref1 = this.bindings[event][i], handler = _ref1.handler, ctx = _ref1.ctx, once = _ref1.once;
          handler.apply(ctx != null ? ctx : this, args);
          if (once) {
            _results.push(this.bindings[event].splice(i, 1));
          } else {
            _results.push(i++);
          }
        }
        return _results;
      }
    };

    return Evented;

  })();

  this.Tether.Utils = {
    getScrollParent: getScrollParent,
    getBounds: getBounds,
    getOffsetParent: getOffsetParent,
    extend: extend,
    addClass: addClass,
    removeClass: removeClass,
    hasClass: hasClass,
    updateClasses: updateClasses,
    defer: defer,
    flush: flush,
    uniqueId: uniqueId,
    Evented: Evented,
    getScrollBarSize: getScrollBarSize
  };

}).call(this);

(function() {
  var MIRROR_LR, MIRROR_TB, OFFSET_MAP, Tether, addClass, addOffset, attachmentToOffset, autoToFixedAttachment, defer, extend, flush, getBounds, getOffsetParent, getOuterSize, getScrollBarSize, getScrollParent, getSize, now, offsetToPx, parseAttachment, parseOffset, position, removeClass, tethers, transformKey, updateClasses, within, _Tether, _ref,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  if (this.Tether == null) {
    throw new Error("You must include the utils.js file before tether.js");
  }

  Tether = this.Tether;

  _ref = Tether.Utils, getScrollParent = _ref.getScrollParent, getSize = _ref.getSize, getOuterSize = _ref.getOuterSize, getBounds = _ref.getBounds, getOffsetParent = _ref.getOffsetParent, extend = _ref.extend, addClass = _ref.addClass, removeClass = _ref.removeClass, updateClasses = _ref.updateClasses, defer = _ref.defer, flush = _ref.flush, getScrollBarSize = _ref.getScrollBarSize;

  within = function(a, b, diff) {
    if (diff == null) {
      diff = 1;
    }
    return (a + diff >= b && b >= a - diff);
  };

  transformKey = (function() {
    var el, key, _i, _len, _ref1;
    el = document.createElement('div');
    _ref1 = ['transform', 'webkitTransform', 'OTransform', 'MozTransform', 'msTransform'];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      key = _ref1[_i];
      if (el.style[key] !== void 0) {
        return key;
      }
    }
  })();

  tethers = [];

  position = function() {
    var tether, _i, _len;
    for (_i = 0, _len = tethers.length; _i < _len; _i++) {
      tether = tethers[_i];
      tether.position(false);
    }
    return flush();
  };

  now = function() {
    var _ref1;
    return (_ref1 = typeof performance !== "undefined" && performance !== null ? typeof performance.now === "function" ? performance.now() : void 0 : void 0) != null ? _ref1 : +(new Date);
  };

  (function() {
    var event, lastCall, lastDuration, pendingTimeout, tick, _i, _len, _ref1, _results;
    lastCall = null;
    lastDuration = null;
    pendingTimeout = null;
    tick = function() {
      if ((lastDuration != null) && lastDuration > 16) {
        lastDuration = Math.min(lastDuration - 16, 250);
        pendingTimeout = setTimeout(tick, 250);
        return;
      }
      if ((lastCall != null) && (now() - lastCall) < 10) {
        return;
      }
      if (pendingTimeout != null) {
        clearTimeout(pendingTimeout);
        pendingTimeout = null;
      }
      lastCall = now();
      position();
      return lastDuration = now() - lastCall;
    };
    _ref1 = ['resize', 'scroll', 'touchmove'];
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      event = _ref1[_i];
      _results.push(window.addEventListener(event, tick));
    }
    return _results;
  })();

  MIRROR_LR = {
    center: 'center',
    left: 'right',
    right: 'left'
  };

  MIRROR_TB = {
    middle: 'middle',
    top: 'bottom',
    bottom: 'top'
  };

  OFFSET_MAP = {
    top: 0,
    left: 0,
    middle: '50%',
    center: '50%',
    bottom: '100%',
    right: '100%'
  };

  autoToFixedAttachment = function(attachment, relativeToAttachment) {
    var left, top;
    left = attachment.left, top = attachment.top;
    if (left === 'auto') {
      left = MIRROR_LR[relativeToAttachment.left];
    }
    if (top === 'auto') {
      top = MIRROR_TB[relativeToAttachment.top];
    }
    return {
      left: left,
      top: top
    };
  };

  attachmentToOffset = function(attachment) {
    var _ref1, _ref2;
    return {
      left: (_ref1 = OFFSET_MAP[attachment.left]) != null ? _ref1 : attachment.left,
      top: (_ref2 = OFFSET_MAP[attachment.top]) != null ? _ref2 : attachment.top
    };
  };

  addOffset = function() {
    var left, offsets, out, top, _i, _len, _ref1;
    offsets = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    out = {
      top: 0,
      left: 0
    };
    for (_i = 0, _len = offsets.length; _i < _len; _i++) {
      _ref1 = offsets[_i], top = _ref1.top, left = _ref1.left;
      if (typeof top === 'string') {
        top = parseFloat(top, 10);
      }
      if (typeof left === 'string') {
        left = parseFloat(left, 10);
      }
      out.top += top;
      out.left += left;
    }
    return out;
  };

  offsetToPx = function(offset, size) {
    if (typeof offset.left === 'string' && offset.left.indexOf('%') !== -1) {
      offset.left = parseFloat(offset.left, 10) / 100 * size.width;
    }
    if (typeof offset.top === 'string' && offset.top.indexOf('%') !== -1) {
      offset.top = parseFloat(offset.top, 10) / 100 * size.height;
    }
    return offset;
  };

  parseAttachment = parseOffset = function(value) {
    var left, top, _ref1;
    _ref1 = value.split(' '), top = _ref1[0], left = _ref1[1];
    return {
      top: top,
      left: left
    };
  };

  _Tether = (function() {
    _Tether.modules = [];

    function _Tether(options) {
      this.position = __bind(this.position, this);
      var module, _i, _len, _ref1, _ref2;
      tethers.push(this);
      this.history = [];
      this.setOptions(options, false);
      _ref1 = Tether.modules;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        module = _ref1[_i];
        if ((_ref2 = module.initialize) != null) {
          _ref2.call(this);
        }
      }
      this.position();
    }

    _Tether.prototype.getClass = function(key) {
      var _ref1, _ref2;
      if ((_ref1 = this.options.classes) != null ? _ref1[key] : void 0) {
        return this.options.classes[key];
      } else if (((_ref2 = this.options.classes) != null ? _ref2[key] : void 0) !== false) {
        if (this.options.classPrefix) {
          return "" + this.options.classPrefix + "-" + key;
        } else {
          return key;
        }
      } else {
        return '';
      }
    };

    _Tether.prototype.setOptions = function(options, position) {
      var defaults, key, _i, _len, _ref1, _ref2;
      this.options = options;
      if (position == null) {
        position = true;
      }
      defaults = {
        offset: '0 0',
        targetOffset: '0 0',
        targetAttachment: 'auto auto',
        classPrefix: 'tether'
      };
      this.options = extend(defaults, this.options);
      _ref1 = this.options, this.element = _ref1.element, this.target = _ref1.target, this.targetModifier = _ref1.targetModifier;
      if (this.target === 'viewport') {
        this.target = document.body;
        this.targetModifier = 'visible';
      } else if (this.target === 'scroll-handle') {
        this.target = document.body;
        this.targetModifier = 'scroll-handle';
      }
      _ref2 = ['element', 'target'];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        key = _ref2[_i];
        if (this[key] == null) {
          throw new Error("Tether Error: Both element and target must be defined");
        }
        if (this[key].jquery != null) {
          this[key] = this[key][0];
        } else if (typeof this[key] === 'string') {
          this[key] = document.querySelector(this[key]);
        }
      }
      addClass(this.element, this.getClass('element'));
      addClass(this.target, this.getClass('target'));
      if (!this.options.attachment) {
        throw new Error("Tether Error: You must provide an attachment");
      }
      this.targetAttachment = parseAttachment(this.options.targetAttachment);
      this.attachment = parseAttachment(this.options.attachment);
      this.offset = parseOffset(this.options.offset);
      this.targetOffset = parseOffset(this.options.targetOffset);
      if (this.scrollParent != null) {
        this.disable();
      }
      if (this.targetModifier === 'scroll-handle') {
        this.scrollParent = this.target;
      } else {
        this.scrollParent = getScrollParent(this.target);
      }
      if (this.options.enabled !== false) {
        return this.enable(position);
      }
    };

    _Tether.prototype.getTargetBounds = function() {
      var bounds, fitAdj, hasBottomScroll, height, out, scrollBottom, scrollPercentage, style, target;
      if (this.targetModifier != null) {
        switch (this.targetModifier) {
          case 'visible':
            if (this.target === document.body) {
              return {
                top: pageYOffset,
                left: pageXOffset,
                height: innerHeight,
                width: innerWidth
              };
            } else {
              bounds = getBounds(this.target);
              out = {
                height: bounds.height,
                width: bounds.width,
                top: bounds.top,
                left: bounds.left
              };
              out.height = Math.min(out.height, bounds.height - (pageYOffset - bounds.top));
              out.height = Math.min(out.height, bounds.height - ((bounds.top + bounds.height) - (pageYOffset + innerHeight)));
              out.height = Math.min(innerHeight, out.height);
              out.height -= 2;
              out.width = Math.min(out.width, bounds.width - (pageXOffset - bounds.left));
              out.width = Math.min(out.width, bounds.width - ((bounds.left + bounds.width) - (pageXOffset + innerWidth)));
              out.width = Math.min(innerWidth, out.width);
              out.width -= 2;
              if (out.top < pageYOffset) {
                out.top = pageYOffset;
              }
              if (out.left < pageXOffset) {
                out.left = pageXOffset;
              }
              return out;
            }
            break;
          case 'scroll-handle':
            target = this.target;
            if (target === document.body) {
              target = document.documentElement;
              bounds = {
                left: pageXOffset,
                top: pageYOffset,
                height: innerHeight,
                width: innerWidth
              };
            } else {
              bounds = getBounds(target);
            }
            style = getComputedStyle(target);
            hasBottomScroll = target.scrollWidth > target.clientWidth || 'scroll' === [style.overflow, style.overflowX] || this.target !== document.body;
            scrollBottom = 0;
            if (hasBottomScroll) {
              scrollBottom = 15;
            }
            height = bounds.height - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth) - scrollBottom;
            out = {
              width: 15,
              height: height * 0.975 * (height / target.scrollHeight),
              left: bounds.left + bounds.width - parseFloat(style.borderLeftWidth) - 15
            };
            fitAdj = 0;
            if (height < 408 && this.target === document.body) {
              fitAdj = -0.00011 * Math.pow(height, 2) - 0.00727 * height + 22.58;
            }
            if (this.target !== document.body) {
              out.height = Math.max(out.height, 24);
            }
            scrollPercentage = this.target.scrollTop / (target.scrollHeight - height);
            out.top = scrollPercentage * (height - out.height - fitAdj) + bounds.top + parseFloat(style.borderTopWidth);
            if (this.target === document.body) {
              out.height = Math.max(out.height, 24);
            }
            return out;
        }
      } else {
        return getBounds(this.target);
      }
    };

    _Tether.prototype.clearCache = function() {
      return this._cache = {};
    };

    _Tether.prototype.cache = function(k, getter) {
      if (this._cache == null) {
        this._cache = {};
      }
      if (this._cache[k] == null) {
        this._cache[k] = getter.call(this);
      }
      return this._cache[k];
    };

    _Tether.prototype.enable = function(position) {
      if (position == null) {
        position = true;
      }
      addClass(this.target, this.getClass('enabled'));
      addClass(this.element, this.getClass('enabled'));
      this.enabled = true;
      if (this.scrollParent !== document) {
        this.scrollParent.addEventListener('scroll', this.position);
      }
      if (position) {
        return this.position();
      }
    };

    _Tether.prototype.disable = function() {
      removeClass(this.target, this.getClass('enabled'));
      removeClass(this.element, this.getClass('enabled'));
      this.enabled = false;
      if (this.scrollParent != null) {
        return this.scrollParent.removeEventListener('scroll', this.position);
      }
    };

    _Tether.prototype.destroy = function() {
      var i, tether, _i, _len, _results;
      this.disable();
      _results = [];
      for (i = _i = 0, _len = tethers.length; _i < _len; i = ++_i) {
        tether = tethers[i];
        if (tether === this) {
          tethers.splice(i, 1);
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    _Tether.prototype.updateAttachClasses = function(elementAttach, targetAttach) {
      var add, all, side, sides, _i, _j, _len, _len1, _ref1,
        _this = this;
      if (elementAttach == null) {
        elementAttach = this.attachment;
      }
      if (targetAttach == null) {
        targetAttach = this.targetAttachment;
      }
      sides = ['left', 'top', 'bottom', 'right', 'middle', 'center'];
      if ((_ref1 = this._addAttachClasses) != null ? _ref1.length : void 0) {
        this._addAttachClasses.splice(0, this._addAttachClasses.length);
      }
      add = this._addAttachClasses != null ? this._addAttachClasses : this._addAttachClasses = [];
      if (elementAttach.top) {
        add.push("" + (this.getClass('element-attached')) + "-" + elementAttach.top);
      }
      if (elementAttach.left) {
        add.push("" + (this.getClass('element-attached')) + "-" + elementAttach.left);
      }
      if (targetAttach.top) {
        add.push("" + (this.getClass('target-attached')) + "-" + targetAttach.top);
      }
      if (targetAttach.left) {
        add.push("" + (this.getClass('target-attached')) + "-" + targetAttach.left);
      }
      all = [];
      for (_i = 0, _len = sides.length; _i < _len; _i++) {
        side = sides[_i];
        all.push("" + (this.getClass('element-attached')) + "-" + side);
      }
      for (_j = 0, _len1 = sides.length; _j < _len1; _j++) {
        side = sides[_j];
        all.push("" + (this.getClass('target-attached')) + "-" + side);
      }
      return defer(function() {
        if (_this._addAttachClasses == null) {
          return;
        }
        updateClasses(_this.element, _this._addAttachClasses, all);
        updateClasses(_this.target, _this._addAttachClasses, all);
        return _this._addAttachClasses = void 0;
      });
    };

    _Tether.prototype.position = function(flushChanges) {
      var elementPos, elementStyle, height, left, manualOffset, manualTargetOffset, module, next, offset, offsetBorder, offsetParent, offsetParentSize, offsetParentStyle, offsetPosition, ret, scrollLeft, scrollTop, scrollbarSize, side, targetAttachment, targetOffset, targetPos, targetSize, top, width, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6,
        _this = this;
      if (flushChanges == null) {
        flushChanges = true;
      }
      if (!this.enabled) {
        return;
      }
      this.clearCache();
      targetAttachment = autoToFixedAttachment(this.targetAttachment, this.attachment);
      this.updateAttachClasses(this.attachment, targetAttachment);
      elementPos = this.cache('element-bounds', function() {
        return getBounds(_this.element);
      });
      width = elementPos.width, height = elementPos.height;
      if (width === 0 && height === 0 && (this.lastSize != null)) {
        _ref1 = this.lastSize, width = _ref1.width, height = _ref1.height;
      } else {
        this.lastSize = {
          width: width,
          height: height
        };
      }
      targetSize = targetPos = this.cache('target-bounds', function() {
        return _this.getTargetBounds();
      });
      offset = offsetToPx(attachmentToOffset(this.attachment), {
        width: width,
        height: height
      });
      targetOffset = offsetToPx(attachmentToOffset(targetAttachment), targetSize);
      manualOffset = offsetToPx(this.offset, {
        width: width,
        height: height
      });
      manualTargetOffset = offsetToPx(this.targetOffset, targetSize);
      offset = addOffset(offset, manualOffset);
      targetOffset = addOffset(targetOffset, manualTargetOffset);
      left = targetPos.left + targetOffset.left - offset.left;
      top = targetPos.top + targetOffset.top - offset.top;
      _ref2 = Tether.modules;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        module = _ref2[_i];
        ret = module.position.call(this, {
          left: left,
          top: top,
          targetAttachment: targetAttachment,
          targetPos: targetPos,
          attachment: this.attachment,
          elementPos: elementPos,
          offset: offset,
          targetOffset: targetOffset,
          manualOffset: manualOffset,
          manualTargetOffset: manualTargetOffset,
          scrollbarSize: scrollbarSize
        });
        if ((ret == null) || typeof ret !== 'object') {
          continue;
        } else if (ret === false) {
          return false;
        } else {
          top = ret.top, left = ret.left;
        }
      }
      next = {
        page: {
          top: top,
          left: left
        },
        viewport: {
          top: top - pageYOffset,
          bottom: pageYOffset - top - height + innerHeight,
          left: left - pageXOffset,
          right: pageXOffset - left - width + innerWidth
        }
      };
      if (document.body.scrollWidth > window.innerWidth) {
        scrollbarSize = this.cache('scrollbar-size', getScrollBarSize);
        next.viewport.bottom -= scrollbarSize.height;
      }
      if (document.body.scrollHeight > window.innerHeight) {
        scrollbarSize = this.cache('scrollbar-size', getScrollBarSize);
        next.viewport.right -= scrollbarSize.width;
      }
      if (((_ref3 = document.body.style.position) !== '' && _ref3 !== 'static') || ((_ref4 = document.body.parentElement.style.position) !== '' && _ref4 !== 'static')) {
        next.page.bottom = document.body.scrollHeight - top - height;
        next.page.right = document.body.scrollWidth - left - width;
      }
      if (((_ref5 = this.options.optimizations) != null ? _ref5.moveElement : void 0) !== false && (this.targetModifier == null)) {
        offsetParent = this.cache('target-offsetparent', function() {
          return getOffsetParent(_this.target);
        });
        offsetPosition = this.cache('target-offsetparent-bounds', function() {
          return getBounds(offsetParent);
        });
        offsetParentStyle = getComputedStyle(offsetParent);
        elementStyle = getComputedStyle(this.element);
        offsetParentSize = offsetPosition;
        offsetBorder = {};
        _ref6 = ['Top', 'Left', 'Bottom', 'Right'];
        for (_j = 0, _len1 = _ref6.length; _j < _len1; _j++) {
          side = _ref6[_j];
          offsetBorder[side.toLowerCase()] = parseFloat(offsetParentStyle["border" + side + "Width"]);
        }
        offsetPosition.right = document.body.scrollWidth - offsetPosition.left - offsetParentSize.width + offsetBorder.right;
        offsetPosition.bottom = document.body.scrollHeight - offsetPosition.top - offsetParentSize.height + offsetBorder.bottom;
        if (next.page.top >= (offsetPosition.top + offsetBorder.top) && next.page.bottom >= offsetPosition.bottom) {
          if (next.page.left >= (offsetPosition.left + offsetBorder.left) && next.page.right >= offsetPosition.right) {
            scrollTop = offsetParent.scrollTop;
            scrollLeft = offsetParent.scrollLeft;
            next.offset = {
              top: next.page.top - offsetPosition.top + scrollTop - offsetBorder.top,
              left: next.page.left - offsetPosition.left + scrollLeft - offsetBorder.left
            };
          }
        }
      }
      this.move(next);
      this.history.unshift(next);
      if (this.history.length > 3) {
        this.history.pop();
      }
      if (flushChanges) {
        flush();
      }
      return true;
    };

    _Tether.prototype.move = function(position) {
      var css, elVal, found, key, moved, offsetParent, point, same, transcribe, type, val, write, writeCSS, _i, _len, _ref1, _ref2,
        _this = this;
      if (this.element.parentNode == null) {
        return;
      }
      same = {};
      for (type in position) {
        same[type] = {};
        for (key in position[type]) {
          found = false;
          _ref1 = this.history;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            point = _ref1[_i];
            if (!within((_ref2 = point[type]) != null ? _ref2[key] : void 0, position[type][key])) {
              found = true;
              break;
            }
          }
          if (!found) {
            same[type][key] = true;
          }
        }
      }
      css = {
        top: '',
        left: '',
        right: '',
        bottom: ''
      };
      transcribe = function(same, pos) {
        var xPos, yPos, _ref3;
        if (((_ref3 = _this.options.optimizations) != null ? _ref3.gpu : void 0) !== false) {
          if (same.top) {
            css.top = 0;
            yPos = pos.top;
          } else {
            css.bottom = 0;
            yPos = -pos.bottom;
          }
          if (same.left) {
            css.left = 0;
            xPos = pos.left;
          } else {
            css.right = 0;
            xPos = -pos.right;
          }
          css[transformKey] = "translateX(" + (Math.round(xPos)) + "px) translateY(" + (Math.round(yPos)) + "px)";
          if (transformKey !== 'msTransform') {
            return css[transformKey] += " translateZ(0)";
          }
        } else {
          if (same.top) {
            css.top = "" + pos.top + "px";
          } else {
            css.bottom = "" + pos.bottom + "px";
          }
          if (same.left) {
            return css.left = "" + pos.left + "px";
          } else {
            return css.right = "" + pos.right + "px";
          }
        }
      };
      moved = false;
      if ((same.page.top || same.page.bottom) && (same.page.left || same.page.right)) {
        css.position = 'absolute';
        transcribe(same.page, position.page);
      } else if ((same.viewport.top || same.viewport.bottom) && (same.viewport.left || same.viewport.right)) {
        css.position = 'fixed';
        transcribe(same.viewport, position.viewport);
      } else if ((same.offset != null) && same.offset.top && same.offset.left) {
        css.position = 'absolute';
        offsetParent = this.cache('target-offsetparent', function() {
          return getOffsetParent(_this.target);
        });
        if (getOffsetParent(this.element) !== offsetParent) {
          defer(function() {
            _this.element.parentNode.removeChild(_this.element);
            return offsetParent.appendChild(_this.element);
          });
        }
        transcribe(same.offset, position.offset);
        moved = true;
      } else {
        css.position = 'absolute';
        transcribe({
          top: true,
          left: true
        }, position.page);
      }
      if (!moved && this.element.parentNode.tagName !== 'BODY') {
        this.element.parentNode.removeChild(this.element);
        document.body.appendChild(this.element);
      }
      writeCSS = {};
      write = false;
      for (key in css) {
        val = css[key];
        elVal = this.element.style[key];
        if (elVal !== '' && val !== '' && (key === 'top' || key === 'left' || key === 'bottom' || key === 'right')) {
          elVal = parseFloat(elVal);
          val = parseFloat(val);
        }
        if (elVal !== val) {
          write = true;
          writeCSS[key] = css[key];
        }
      }
      if (write) {
        return defer(function() {
          return extend(_this.element.style, writeCSS);
        });
      }
    };

    return _Tether;

  })();

  Tether.position = position;

  this.Tether = extend(_Tether, Tether);

}).call(this);

(function() {
  var BOUNDS_FORMAT, MIRROR_ATTACH, defer, extend, getBoundingRect, getBounds, getOuterSize, getSize, updateClasses, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = this.Tether.Utils, getOuterSize = _ref.getOuterSize, getBounds = _ref.getBounds, getSize = _ref.getSize, extend = _ref.extend, updateClasses = _ref.updateClasses, defer = _ref.defer;

  MIRROR_ATTACH = {
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top',
    middle: 'middle'
  };

  BOUNDS_FORMAT = ['left', 'top', 'right', 'bottom'];

  getBoundingRect = function(tether, to) {
    var i, pos, side, size, style, _i, _len;
    if (to === 'scrollParent') {
      to = tether.scrollParent;
    } else if (to === 'window') {
      to = [pageXOffset, pageYOffset, innerWidth + pageXOffset, innerHeight + pageYOffset];
    }
    if (to === document) {
      to = to.documentElement;
    }
    if (to.nodeType != null) {
      pos = size = getBounds(to);
      style = getComputedStyle(to);
      to = [pos.left, pos.top, size.width + pos.left, size.height + pos.top];
      for (i = _i = 0, _len = BOUNDS_FORMAT.length; _i < _len; i = ++_i) {
        side = BOUNDS_FORMAT[i];
        side = side[0].toUpperCase() + side.substr(1);
        if (side === 'Top' || side === 'Left') {
          to[i] += parseFloat(style["border" + side + "Width"]);
        } else {
          to[i] -= parseFloat(style["border" + side + "Width"]);
        }
      }
    }
    return to;
  };

  this.Tether.modules.push({
    position: function(_arg) {
      var addClasses, allClasses, attachment, bounds, changeAttachX, changeAttachY, cls, constraint, eAttachment, height, left, oob, oobClass, p, pin, pinned, pinnedClass, removeClass, side, tAttachment, targetAttachment, targetHeight, targetSize, targetWidth, to, top, width, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8,
        _this = this;
      top = _arg.top, left = _arg.left, targetAttachment = _arg.targetAttachment;
      if (!this.options.constraints) {
        return true;
      }
      removeClass = function(prefix) {
        var side, _i, _len, _results;
        _this.removeClass(prefix);
        _results = [];
        for (_i = 0, _len = BOUNDS_FORMAT.length; _i < _len; _i++) {
          side = BOUNDS_FORMAT[_i];
          _results.push(_this.removeClass("" + prefix + "-" + side));
        }
        return _results;
      };
      _ref1 = this.cache('element-bounds', function() {
        return getBounds(_this.element);
      }), height = _ref1.height, width = _ref1.width;
      if (width === 0 && height === 0 && (this.lastSize != null)) {
        _ref2 = this.lastSize, width = _ref2.width, height = _ref2.height;
      }
      targetSize = this.cache('target-bounds', function() {
        return _this.getTargetBounds();
      });
      targetHeight = targetSize.height;
      targetWidth = targetSize.width;
      tAttachment = {};
      eAttachment = {};
      allClasses = [this.getClass('pinned'), this.getClass('out-of-bounds')];
      _ref3 = this.options.constraints;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        constraint = _ref3[_i];
        if (constraint.outOfBoundsClass) {
          allClasses.push(constraint.outOfBoundsClass);
        }
        if (constraint.pinnedClass) {
          allClasses.push(constraint.pinnedClass);
        }
      }
      for (_j = 0, _len1 = allClasses.length; _j < _len1; _j++) {
        cls = allClasses[_j];
        _ref4 = ['left', 'top', 'right', 'bottom'];
        for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
          side = _ref4[_k];
          allClasses.push("" + cls + "-" + side);
        }
      }
      addClasses = [];
      tAttachment = extend({}, targetAttachment);
      eAttachment = extend({}, this.attachment);
      _ref5 = this.options.constraints;
      for (_l = 0, _len3 = _ref5.length; _l < _len3; _l++) {
        constraint = _ref5[_l];
        to = constraint.to, attachment = constraint.attachment, pin = constraint.pin;
        if (attachment == null) {
          attachment = '';
        }
        if (__indexOf.call(attachment, ' ') >= 0) {
          _ref6 = attachment.split(' '), changeAttachY = _ref6[0], changeAttachX = _ref6[1];
        } else {
          changeAttachX = changeAttachY = attachment;
        }
        bounds = getBoundingRect(this, to);
        if (changeAttachY === 'target' || changeAttachY === 'both') {
          if (top < bounds[1] && tAttachment.top === 'top') {
            top += targetHeight;
            tAttachment.top = 'bottom';
          }
          if (top + height > bounds[3] && tAttachment.top === 'bottom') {
            top -= targetHeight;
            tAttachment.top = 'top';
          }
        }
        if (changeAttachY === 'together') {
          if (top < bounds[1] && tAttachment.top === 'top') {
            if (eAttachment.top === 'bottom') {
              top += targetHeight;
              tAttachment.top = 'bottom';
              top += height;
              eAttachment.top = 'top';
            } else if (eAttachment.top === 'top') {
              top += targetHeight;
              tAttachment.top = 'bottom';
              top -= height;
              eAttachment.top = 'bottom';
            }
          }
          if (top + height > bounds[3] && tAttachment.top === 'bottom') {
            if (eAttachment.top === 'top') {
              top -= targetHeight;
              tAttachment.top = 'top';
              top -= height;
              eAttachment.top = 'bottom';
            } else if (eAttachment.top === 'bottom') {
              top -= targetHeight;
              tAttachment.top = 'top';
              top += height;
              eAttachment.top = 'top';
            }
          }
          if (tAttachment.top === 'middle') {
            if (top + height > bounds[3] && eAttachment.top === 'top') {
              top -= height;
              eAttachment.top = 'bottom';
            } else if (top < bounds[1] && eAttachment.top === 'bottom') {
              top += height;
              eAttachment.top = 'top';
            }
          }
        }
        if (changeAttachX === 'target' || changeAttachX === 'both') {
          if (left < bounds[0] && tAttachment.left === 'left') {
            left += targetWidth;
            tAttachment.left = 'right';
          }
          if (left + width > bounds[2] && tAttachment.left === 'right') {
            left -= targetWidth;
            tAttachment.left = 'left';
          }
        }
        if (changeAttachX === 'together') {
          if (left < bounds[0] && tAttachment.left === 'left') {
            if (eAttachment.left === 'right') {
              left += targetWidth;
              tAttachment.left = 'right';
              left += width;
              eAttachment.left = 'left';
            } else if (eAttachment.left === 'left') {
              left += targetWidth;
              tAttachment.left = 'right';
              left -= width;
              eAttachment.left = 'right';
            }
          } else if (left + width > bounds[2] && tAttachment.left === 'right') {
            if (eAttachment.left === 'left') {
              left -= targetWidth;
              tAttachment.left = 'left';
              left -= width;
              eAttachment.left = 'right';
            } else if (eAttachment.left === 'right') {
              left -= targetWidth;
              tAttachment.left = 'left';
              left += width;
              eAttachment.left = 'left';
            }
          } else if (tAttachment.left === 'center') {
            if (left + width > bounds[2] && eAttachment.left === 'left') {
              left -= width;
              eAttachment.left = 'right';
            } else if (left < bounds[0] && eAttachment.left === 'right') {
              left += width;
              eAttachment.left = 'left';
            }
          }
        }
        if (changeAttachY === 'element' || changeAttachY === 'both') {
          if (top < bounds[1] && eAttachment.top === 'bottom') {
            top += height;
            eAttachment.top = 'top';
          }
          if (top + height > bounds[3] && eAttachment.top === 'top') {
            top -= height;
            eAttachment.top = 'bottom';
          }
        }
        if (changeAttachX === 'element' || changeAttachX === 'both') {
          if (left < bounds[0] && eAttachment.left === 'right') {
            left += width;
            eAttachment.left = 'left';
          }
          if (left + width > bounds[2] && eAttachment.left === 'left') {
            left -= width;
            eAttachment.left = 'right';
          }
        }
        if (typeof pin === 'string') {
          pin = (function() {
            var _len4, _m, _ref7, _results;
            _ref7 = pin.split(',');
            _results = [];
            for (_m = 0, _len4 = _ref7.length; _m < _len4; _m++) {
              p = _ref7[_m];
              _results.push(p.trim());
            }
            return _results;
          })();
        } else if (pin === true) {
          pin = ['top', 'left', 'right', 'bottom'];
        }
        pin || (pin = []);
        pinned = [];
        oob = [];
        if (top < bounds[1]) {
          if (__indexOf.call(pin, 'top') >= 0) {
            top = bounds[1];
            pinned.push('top');
          } else {
            oob.push('top');
          }
        }
        if (top + height > bounds[3]) {
          if (__indexOf.call(pin, 'bottom') >= 0) {
            top = bounds[3] - height;
            pinned.push('bottom');
          } else {
            oob.push('bottom');
          }
        }
        if (left < bounds[0]) {
          if (__indexOf.call(pin, 'left') >= 0) {
            left = bounds[0];
            pinned.push('left');
          } else {
            oob.push('left');
          }
        }
        if (left + width > bounds[2]) {
          if (__indexOf.call(pin, 'right') >= 0) {
            left = bounds[2] - width;
            pinned.push('right');
          } else {
            oob.push('right');
          }
        }
        if (pinned.length) {
          pinnedClass = (_ref7 = this.options.pinnedClass) != null ? _ref7 : this.getClass('pinned');
          addClasses.push(pinnedClass);
          for (_m = 0, _len4 = pinned.length; _m < _len4; _m++) {
            side = pinned[_m];
            addClasses.push("" + pinnedClass + "-" + side);
          }
        }
        if (oob.length) {
          oobClass = (_ref8 = this.options.outOfBoundsClass) != null ? _ref8 : this.getClass('out-of-bounds');
          addClasses.push(oobClass);
          for (_n = 0, _len5 = oob.length; _n < _len5; _n++) {
            side = oob[_n];
            addClasses.push("" + oobClass + "-" + side);
          }
        }
        if (__indexOf.call(pinned, 'left') >= 0 || __indexOf.call(pinned, 'right') >= 0) {
          eAttachment.left = tAttachment.left = false;
        }
        if (__indexOf.call(pinned, 'top') >= 0 || __indexOf.call(pinned, 'bottom') >= 0) {
          eAttachment.top = tAttachment.top = false;
        }
        if (tAttachment.top !== targetAttachment.top || tAttachment.left !== targetAttachment.left || eAttachment.top !== this.attachment.top || eAttachment.left !== this.attachment.left) {
          this.updateAttachClasses(eAttachment, tAttachment);
        }
      }
      defer(function() {
        updateClasses(_this.target, addClasses, allClasses);
        return updateClasses(_this.element, addClasses, allClasses);
      });
      return {
        top: top,
        left: left
      };
    }
  });

}).call(this);

(function() {
  var defer, getBounds, updateClasses, _ref;

  _ref = this.Tether.Utils, getBounds = _ref.getBounds, updateClasses = _ref.updateClasses, defer = _ref.defer;

  this.Tether.modules.push({
    position: function(_arg) {
      var abutted, addClasses, allClasses, bottom, height, left, right, side, sides, targetPos, top, width, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref1, _ref2, _ref3, _ref4, _ref5,
        _this = this;
      top = _arg.top, left = _arg.left;
      _ref1 = this.cache('element-bounds', function() {
        return getBounds(_this.element);
      }), height = _ref1.height, width = _ref1.width;
      targetPos = this.getTargetBounds();
      bottom = top + height;
      right = left + width;
      abutted = [];
      if (top <= targetPos.bottom && bottom >= targetPos.top) {
        _ref2 = ['left', 'right'];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          side = _ref2[_i];
          if ((_ref3 = targetPos[side]) === left || _ref3 === right) {
            abutted.push(side);
          }
        }
      }
      if (left <= targetPos.right && right >= targetPos.left) {
        _ref4 = ['top', 'bottom'];
        for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
          side = _ref4[_j];
          if ((_ref5 = targetPos[side]) === top || _ref5 === bottom) {
            abutted.push(side);
          }
        }
      }
      allClasses = [];
      addClasses = [];
      sides = ['left', 'top', 'right', 'bottom'];
      allClasses.push(this.getClass('abutted'));
      for (_k = 0, _len2 = sides.length; _k < _len2; _k++) {
        side = sides[_k];
        allClasses.push("" + (this.getClass('abutted')) + "-" + side);
      }
      if (abutted.length) {
        addClasses.push(this.getClass('abutted'));
      }
      for (_l = 0, _len3 = abutted.length; _l < _len3; _l++) {
        side = abutted[_l];
        addClasses.push("" + (this.getClass('abutted')) + "-" + side);
      }
      defer(function() {
        updateClasses(_this.target, addClasses, allClasses);
        return updateClasses(_this.element, addClasses, allClasses);
      });
      return true;
    }
  });

}).call(this);

(function() {
  this.Tether.modules.push({
    position: function(_arg) {
      var left, result, shift, shiftLeft, shiftTop, top, _ref;
      top = _arg.top, left = _arg.left;
      if (!this.options.shift) {
        return;
      }
      result = function(val) {
        if (typeof val === 'function') {
          return val.call(this, {
            top: top,
            left: left
          });
        } else {
          return val;
        }
      };
      shift = result(this.options.shift);
      if (typeof shift === 'string') {
        shift = shift.split(' ');
        shift[1] || (shift[1] = shift[0]);
        shiftTop = shift[0], shiftLeft = shift[1];
        shiftTop = parseFloat(shiftTop, 10);
        shiftLeft = parseFloat(shiftLeft, 10);
      } else {
        _ref = [shift.top, shift.left], shiftTop = _ref[0], shiftLeft = _ref[1];
      }
      top += shiftTop;
      left += shiftLeft;
      return {
        top: top,
        left: left
      };
    }
  });

}).call(this);

return this.Tether;

}));

(function() {
  var Evented, MIRROR_ATTACH, addClass, allDrops, clickEvents, createContext, extend, hasClass, removeClass, removeFromArray, sortAttach, touchDevice, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = Tether.Utils, extend = _ref.extend, addClass = _ref.addClass, removeClass = _ref.removeClass, hasClass = _ref.hasClass, Evented = _ref.Evented;

  touchDevice = 'ontouchstart' in document.documentElement;

  clickEvents = ['click'];

  if (touchDevice) {
    clickEvents.push('touchstart');
  }

  sortAttach = function(str) {
    var first, second, _ref1, _ref2;
    _ref1 = str.split(' '), first = _ref1[0], second = _ref1[1];
    if (first === 'left' || first === 'right') {
      _ref2 = [second, first], first = _ref2[0], second = _ref2[1];
    }
    return [first, second].join(' ');
  };

  MIRROR_ATTACH = {
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top',
    middle: 'middle',
    center: 'center'
  };

  allDrops = {};

  removeFromArray = function(arr, item) {
    var index, _results;
    _results = [];
    while ((index = arr.indexOf(item)) !== -1) {
      _results.push(arr.splice(index, 1));
    }
    return _results;
  };

  createContext = function(options) {
    var DropInstance, defaultOptions, drop, _name;
    if (options == null) {
      options = {};
    }
    drop = function() {
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(DropInstance, arguments, function(){});
    };
    extend(drop, {
      createContext: createContext,
      drops: [],
      defaults: {}
    });
    defaultOptions = {
      classPrefix: 'drop',
      defaults: {
        position: 'bottom left',
        openOn: 'click',
        constrainToScrollParent: true,
        constrainToWindow: true,
        classes: '',
        remove: false,
        tetherOptions: {}
      }
    };
    extend(drop, defaultOptions, options);
    extend(drop.defaults, defaultOptions.defaults, options.defaults);
    if (allDrops[_name = drop.classPrefix] == null) {
      allDrops[_name] = [];
    }
    drop.updateBodyClasses = function() {
      var anyOpen, _drop, _i, _len, _ref1;
      anyOpen = false;
      _ref1 = allDrops[drop.classPrefix];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        _drop = _ref1[_i];
        if (!(_drop.isOpened())) {
          continue;
        }
        anyOpen = true;
        break;
      }
      if (anyOpen) {
        return addClass(document.body, "" + drop.classPrefix + "-open");
      } else {
        return removeClass(document.body, "" + drop.classPrefix + "-open");
      }
    };
    DropInstance = (function(_super) {
      __extends(DropInstance, _super);

      function DropInstance(options) {
        this.options = options;
        this.options = extend({}, drop.defaults, this.options);
        this.target = this.options.target;
        if (this.target == null) {
          throw new Error('Drop Error: You must provide a target.');
        }
        if (this.options.classes) {
          addClass(this.target, this.options.classes);
        }
        drop.drops.push(this);
        allDrops[drop.classPrefix].push(this);
        this._boundEvents = [];
        this.setupElements();
        this.setupEvents();
        this.setupTether();
      }

      DropInstance.prototype._on = function(element, event, handler) {
        this._boundEvents.push({
          element: element,
          event: event,
          handler: handler
        });
        return element.addEventListener(event, handler);
      };

      DropInstance.prototype.setupElements = function() {
        this.drop = document.createElement('div');
        addClass(this.drop, drop.classPrefix);
        if (this.options.classes) {
          addClass(this.drop, this.options.classes);
        }
        this.content = document.createElement('div');
        addClass(this.content, "" + drop.classPrefix + "-content");
        if (typeof this.options.content === 'object') {
          this.content.appendChild(this.options.content);
        } else {
          this.content.innerHTML = this.options.content;
        }
        return this.drop.appendChild(this.content);
      };

      DropInstance.prototype.setupTether = function() {
        var constraints, dropAttach;
        dropAttach = this.options.position.split(' ');
        dropAttach[0] = MIRROR_ATTACH[dropAttach[0]];
        dropAttach = dropAttach.join(' ');
        constraints = [];
        if (this.options.constrainToScrollParent) {
          constraints.push({
            to: 'scrollParent',
            pin: 'top, bottom',
            attachment: 'together none'
          });
        } else {
          constraints.push({
            to: 'scrollParent'
          });
        }
        if (this.options.constrainToWindow !== false) {
          constraints.push({
            to: 'window',
            attachment: 'together'
          });
        } else {
          constraints.push({
            to: 'window'
          });
        }
        options = {
          element: this.drop,
          target: this.target,
          attachment: sortAttach(dropAttach),
          targetAttachment: sortAttach(this.options.position),
          classPrefix: drop.classPrefix,
          offset: '0 0',
          targetOffset: '0 0',
          enabled: false,
          constraints: constraints
        };
        if (this.options.tetherOptions !== false) {
          return this.tether = new Tether(extend({}, options, this.options.tetherOptions));
        }
      };

      DropInstance.prototype.setupEvents = function() {
        var clickEvent, closeHandler, events, onUs, openHandler, out, outTimeout, over, _i, _len,
          _this = this;
        if (!this.options.openOn) {
          return;
        }
        if (this.options.openOn === 'always') {
          setTimeout(this.open.bind(this));
          return;
        }
        events = this.options.openOn.split(' ');
        if (__indexOf.call(events, 'click') >= 0) {
          openHandler = function(event) {
            _this.toggle();
            return event.preventDefault();
          };
          closeHandler = function(event) {
            if (!_this.isOpened()) {
              return;
            }
            if (event.target === _this.drop || _this.drop.contains(event.target)) {
              return;
            }
            if (event.target === _this.target || _this.target.contains(event.target)) {
              return;
            }
            return _this.close();
          };
          for (_i = 0, _len = clickEvents.length; _i < _len; _i++) {
            clickEvent = clickEvents[_i];
            this._on(this.target, clickEvent, openHandler);
            this._on(document, clickEvent, closeHandler);
          }
        }
        if (__indexOf.call(events, 'hover') >= 0) {
          onUs = false;
          over = function() {
            onUs = true;
            return _this.open();
          };
          outTimeout = null;
          out = function() {
            onUs = false;
            if (outTimeout != null) {
              clearTimeout(outTimeout);
            }
            return outTimeout = setTimeout(function() {
              if (!onUs) {
                _this.close();
              }
              return outTimeout = null;
            }, 50);
          };
          this._on(this.target, 'mouseover', over);
          this._on(this.drop, 'mouseover', over);
          this._on(this.target, 'mouseout', out);
          return this._on(this.drop, 'mouseout', out);
        }
      };

      DropInstance.prototype.isOpened = function() {
        return hasClass(this.drop, "" + drop.classPrefix + "-open");
      };

      DropInstance.prototype.toggle = function() {
        if (this.isOpened()) {
          return this.close();
        } else {
          return this.open();
        }
      };

      DropInstance.prototype.open = function() {
        var _ref1, _ref2,
          _this = this;
        if (this.isOpened()) {
          return;
        }
        if (!this.drop.parentNode) {
          document.body.appendChild(this.drop);
        }
        if ((_ref1 = this.tether) != null) {
          _ref1.enable();
        }
        addClass(this.drop, "" + drop.classPrefix + "-open");
        addClass(this.drop, "" + drop.classPrefix + "-open-transitionend");
        setTimeout(function() {
          return addClass(_this.drop, "" + drop.classPrefix + "-after-open");
        });
        if ((_ref2 = this.tether) != null) {
          _ref2.position();
        }
        this.trigger('open');
        return drop.updateBodyClasses();
      };

      DropInstance.prototype.close = function() {
        var handler, _ref1,
          _this = this;
        if (!this.isOpened()) {
          return;
        }
        removeClass(this.drop, "" + drop.classPrefix + "-open");
        removeClass(this.drop, "" + drop.classPrefix + "-after-open");
        this.drop.addEventListener('transitionend', handler = function() {
          if (!hasClass(_this.drop, "" + drop.classPrefix + "-open")) {
            removeClass(_this.drop, "" + drop.classPrefix + "-open-transitionend");
          }
          return _this.drop.removeEventListener('transitionend', handler);
        });
        this.trigger('close');
        if ((_ref1 = this.tether) != null) {
          _ref1.disable();
        }
        drop.updateBodyClasses();
        if (this.options.remove) {
          return this.remove();
        }
      };

      DropInstance.prototype.remove = function() {
        var _ref1;
        this.close();
        return (_ref1 = this.drop.parentNode) != null ? _ref1.removeChild(this.drop) : void 0;
      };

      DropInstance.prototype.position = function() {
        var _ref1;
        if (this.isOpened()) {
          return (_ref1 = this.tether) != null ? _ref1.position() : void 0;
        }
      };

      DropInstance.prototype.destroy = function() {
        var element, event, handler, _i, _len, _ref1, _ref2, _ref3;
        this.remove();
        if ((_ref1 = this.tether) != null) {
          _ref1.destroy();
        }
        _ref2 = this._boundEvents;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          _ref3 = _ref2[_i], element = _ref3.element, event = _ref3.event, handler = _ref3.handler;
          element.removeEventListener(event, handler);
        }
        this._boundEvents = [];
        this.tether = null;
        this.drop = null;
        this.content = null;
        this.target = null;
        removeFromArray(allDrops[drop.classPrefix], this);
        return removeFromArray(drop.drops, this);
      };

      return DropInstance;

    })(Evented);
    return drop;
  };

  window.Drop = createContext();

  document.addEventListener('DOMContentLoaded', function() {
    return Drop.updateBodyClasses();
  });

}).call(this);

(function() {
  var Tooltip, addClass, defaults, extend, initialized, removeClass, _Drop, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = Tether.Utils, addClass = _ref.addClass, removeClass = _ref.removeClass, extend = _ref.extend;

  _Drop = Drop.createContext({
    classPrefix: 'tooltip'
  });

  defaults = {
    position: 'top center',
    openOn: 'hover',
    classes: 'tooltip-theme-arrows',
    constrainToWindow: true,
    constrainToScrollParent: false
  };

  Tooltip = (function() {
    function Tooltip(options) {
      var _base, _base1;
      this.options = options;
      if (!this.options.target) {
        throw new Error("Tooltip Error: You must provide a target for Tooltip to attach to");
      }
      if ((_base = this.options).position == null) {
        _base.position = this.options.target.getAttribute('data-tooltip-position');
      }
      if ((_base1 = this.options).content == null) {
        _base1.content = this.options.target.getAttribute('data-tooltip');
      }
      this.options = extend({}, defaults, this.options);
      this.drop = new _Drop(this.options);
    }

    Tooltip.prototype.close = function() {
      return this.drop.close();
    };

    Tooltip.prototype.open = function() {
      return this.drop.open();
    };

    Tooltip.prototype.toggle = function() {
      return this.drop.toggle();
    };

    Tooltip.prototype.remove = function() {
      return this.drop.remove();
    };

    Tooltip.prototype.destory = function() {
      return this.drop.destroy();
    };

    Tooltip.prototype.position = function() {
      return this.drop.position();
    };

    return Tooltip;

  })();

  initialized = [];

  Tooltip.init = function() {
    var el, _i, _len, _ref1, _results;
    _ref1 = document.querySelectorAll('[data-tooltip]');
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      el = _ref1[_i];
      if (!(__indexOf.call(initialized, el) < 0)) {
        continue;
      }
      new Tooltip({
        target: el
      });
      _results.push(initialized.push(el));
    }
    return _results;
  };

  document.addEventListener('DOMContentLoaded', function() {
    if (Tooltip.autoinit !== false) {
      return Tooltip.init();
    }
  });

  window.Tooltip = Tooltip;

}).call(this);

(function () {
    var BTooltipPrototype = Object.create(HTMLElement.prototype, {
            position: {
                enumerable: true,
                get: function () {
                    return this.getAttribute('position') || 'top left';
                }
            },
            attachedCallback: {
                enumerable: true,
                value: function () {
                    this.tip = new Tooltip({
                        target: document.querySelector(this.getAttribute('target')),
                        position: this.position,
                        content: this.innerHTML
                    });
                }
            }
        });
    window.BTooltip = document.registerElement('b-tooltip', { prototype: BTooltipPrototype });
    Object.defineProperty(BTooltip.prototype, '_super', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: HTMLElement.prototype
    });
}());