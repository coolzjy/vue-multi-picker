'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ONE_DAY = 24 * 3600 * 1000;
var ONE_WEEK = ONE_DAY * 7;

/**
 *  get date of week start (Monday)
 *  @param {object} date - date in a week
 *  @return {ojbect} start date of the week
 */
function getWeekStart (date) {
  var day = date.getDay();
  var offset = (date.getDay() + 6) % 7;
  var weekStart = new Date(date.valueOf() - offset * ONE_DAY);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart
}

/**
 *  get date of week end (Sunday)
 *  @param {object} date - date in a week
 *  @return {ojbect} start date of the week
 */
function getWeekEnd (date) {
  var offset = 6 - (date.getDay() + 6) % 7;
  var weekEnd = new Date(date.valueOf() + offset * ONE_DAY);
  weekEnd.setHours(0, 0, 0, 0);
  return weekEnd
}

/**
 *  get week number (in ISO) of date
 *  @param {object} date
 *  @return {number} week number
 */
 function getWeek (date) {
   var date = new Date(date.getTime());
   date.setHours(0, 0, 0, 0);
   // Thursday in current week decides the year.
   date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
   // January 4 is always in week 1.
   var week1 = new Date(date.getFullYear(), 0, 4);
   // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
   return 1 + Math.round(((date.getTime() - week1.getTime()) / ONE_DAY - 3 + (week1.getDay() + 6) % 7) / 7)
 }


var utils = Object.freeze({
	ONE_DAY: ONE_DAY,
	ONE_WEEK: ONE_WEEK,
	getWeekStart: getWeekStart,
	getWeekEnd: getWeekEnd,
	getWeek: getWeek
});

var current = new Date();
current.setDate(1, 0, 0, 0, 0);

var calendar = {
  weekDays: ['一', '二', '三', '四', '五', '六', '日'],

  data: function data () {
    return {
      current: Object.freeze(current)
    }
  },

  computed: {
    year: function year () { return this.current.getFullYear() },

    month: function month () { return this.current.getMonth() },

    calendar: function calendar () {
      var weekStart = getWeekStart(new Date(this.year, this.month));
      var weekEnd = getWeekEnd(new Date(this.year,this.month + 1, 0));
      var calendar = [];
      for (var i = weekStart.valueOf(); i < weekEnd.valueOf(); i += ONE_WEEK) {
        var week = [];
        for (var j = i; j < (i + ONE_WEEK); j += ONE_DAY) {
          week.push(new Date(j));
        }
        calendar.push(week);
      }
      return calendar
    }
  },

  watch: {
    'value': 'switchToCurrent'
  },

  methods: {
    contains: function contains (date) {
      var date = new Date(date);
      date.setHours(0, 0, 0, 0);
      return this.calendar[this.calendar.length - 1][6] - date >= 0 &&
        date - this.calendar[0][0] >= 0
    },

    switchToCurrent: function switchToCurrent (selected) {
      if (!selected) { return }
      if (!this.contains(selected)) {
        var current = new Date(selected.getFullYear(), selected.getMonth());
        this.current = Object.freeze(current);
      }
    }
  },

  created: function created () {
    this.weekDays = this.$options.weekDays;
    this.currentText = this.$options.currentText;
    this.switchToCurrent(this.value);
    this.$on('go', function (num) {
      var current = new Date(this.current);
      current.setMonth(this.month + num);
      this.current = Object.freeze(current);
    });
  }
};

var NOW = new Date().toDateString();

var DateCalendar = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;return _h('table',{staticClass:"vmp-calendar-date"},[_h('tr',[_h('th',{staticClass:"calendar-title",attrs:{"colspan":"7"}},[_h('div',[_vm._s(_vm.year)+" 年 "+_vm._s(_vm.month + 1)+" 月"])])]),_h('tr',[_vm._l((_vm.weekDays),function(day){return _h('th',{staticClass:"calendar-weekdays"},[_h('div',[_vm._s(day)])])})]),_vm._l((_vm.calendar),function(week){return _h('tr',[_vm._l((week),function(day){return _h('td',{staticClass:"calendar-item",class:_vm.getClass(day),on:{"click":function($event){_vm.select(day);}}},[_h('div',[_vm._s(_vm.isNow(day) ? _vm.currentText : day.getDate())])])})])})])},staticRenderFns: [],
  name: 'date-calendar',

  mixins: [calendar],

  currentText: '今天',

  props: {
    value: {
      type: Date
    },
    restrict: {
      type: Function,
      default: function default$1 () { return false }
    }
  },

  methods: {
    select: function select (day) {
      if (this.restrict(new Date(day))) { return }
      this.$emit('input', new Date(day));
    },

    getClass: function getClass (day) {
      return {
        outter: day.getMonth() !== this.month,
        current: this.isNow(day),
        restrict: this.restrict(new Date(day)),
        selected: this.value &&
          day.toDateString() === this.value.toDateString()
      }
    },

    isNow: function isNow (day) {
      return day.toDateString() === NOW
    }
  }
};

var NOW$1 = getWeekStart(new Date()).toDateString();

var WeekCalendar = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;return _h('table',{staticClass:"vmp-calendar-week"},[_h('tr',[_h('th',{staticClass:"calendar-title",attrs:{"colspan":"8"}},[_h('div',[_vm._s(_vm.year)+" 年 "+_vm._s(_vm.month + 1)+" 月"])])]),_h('tr',[_h('th',{staticClass:"calendar-weektitle"},[_vm._s(_vm.weekNoText)]),_vm._l((_vm.weekDays),function(day){return _h('th',{staticClass:"calendar-weekdays"},[_h('div',[_vm._s(day)])])})]),_vm._l((_vm.calendar),function(week){return _h('tr',{class:_vm.getTrClass(week[0]),on:{"click":function($event){_vm.select(week[0]);}}},[_h('td',{staticClass:"calendar-weekno"},[_h('div',[_vm._s(_vm.isNow(week[0]) ? _vm.currentText : _vm.getWeek(week[0]))])]),_vm._l((week),function(day){return _h('td',{staticClass:"calendar-item",class:_vm.getTdClass(day)},[_h('div',[_vm._s(day.getDate())])])})])})])},staticRenderFns: [],
  name: 'week-calendar',

  mixins: [calendar],

  weekNoText: '周次',
  currentText: '本周',

  props: {
    value: {
      type: Date
    },
    restrict: {
      type: Function,
      default: function default$1 () { return false }
    }
  },

  methods: {
    select: function select (week) {
      if (this.restrict(new Date(week))) { return }
      this.$emit('input', new Date(week));
    },

    getTrClass: function getTrClass (week) {
      return {
        current: this.isNow(week),
        restrict: this.restrict(new Date(week)),
        selected: this.value &&
          week.valueOf() === getWeekStart(this.value).valueOf()
      }
    },

    getTdClass: function getTdClass (day) {
      return { outter: day.getMonth() !== this.month }
    },

    isNow: function isNow (week) {
      return week.toDateString() === NOW$1
    }
  },

  created: function created () {
    this.weekNoText = this.$options.weekNoText;
    this.getWeek = getWeek;
  }
};

var current$1 = new Date();
current$1.setMonth(0, 1);
current$1.setHours(0, 0, 0, 0);

var NOW$2 = {
  y: new Date().getFullYear(),
  m: new Date().getMonth()
};

var MonthCalendar = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;return _h('table',{staticClass:"vmp-calendar-month"},[_h('tr',[_h('th',{staticClass:"calendar-title",attrs:{"colspan":"4"}},[_h('div',[_vm._s(_vm.year)+" 年"])])]),_vm._l((3),function(_,r){return _h('tr',[_vm._l((4),function(cc,c){return _h('td',{staticClass:"calendar-item",class:_vm.getClass(r * 4 + c),on:{"click":function($event){_vm.select(r * 4 + c);}}},[_h('div',[_vm._s(_vm.isNow(r * 4 + c) ? _vm.currentText : r * 4 + cc + '月')])])})])})])},staticRenderFns: [],
  name: 'month-calendar',

  currentText: '本月',

  props: {
    value: {
      type: Date
    },
    restrict: {
      type: Function,
      default: function default$1 () { return false }
    }
  },

  data: function data () {
    return {
      current: Object.freeze(current$1)
    }
  },

  computed: {
    year: function year () { return this.current.getFullYear() }
  },

  watch: {
    'value': 'switchToCurrent'
  },

  methods: {
    switchToCurrent: function switchToCurrent (selected, prevSelected) {
      if (!selected) { return }
      if (!prevSelected || selected.getFullYear() !== this.year) {
        this.current = Object.freeze(new Date(selected.getFullYear(), 0));
      }
    },

    select: function select (month) {
      if (this.restrict(new Date(this.year, month))) { return }
      this.$emit('input', new Date(this.year, month));
    },

    getClass: function getClass (month) {
      return {
        current: this.isNow(month),
        restrict: this.restrict(new Date(this.year, month)),
        selected: this.value &&
          this.value.getFullYear() === this.year &&
          this.value.getMonth() === month
      }
    },

    isNow: function isNow (month) {
      return this.year === NOW$2.y && month === NOW$2.m
    }
  },

  created: function created () {
    this.currentText = this.$options.currentText;
    this.switchToCurrent(this.value);
    this.$on('go', function (num) {
      var current = new Date(this.current);
      current.setFullYear(this.year + num);
      this.current = Object.freeze(current);
    });
  }
};

exports.utils = utils;
exports.DateCalendar = DateCalendar;
exports.WeekCalendar = WeekCalendar;
exports.MonthCalendar = MonthCalendar;
