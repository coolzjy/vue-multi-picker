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
    this.switchToCurrent(this.value);
    this.$on('go', function (num) {
      var current = new Date(this.current);
      current.setMonth(this.month + num);
      this.current = Object.freeze(current);
    });
  }
};

var DateCalendar = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;return _c('table',{staticClass:"vmp-calendar-day"},[_c('tr',[_c('th',{attrs:{"colspan":"7"}},[_c('div',{staticClass:"calendar-title"},[_vm._v(_vm._s(_vm.year)+" 年 "+_vm._s(_vm.month + 1)+" 月")])])]),_c('tr',_vm._l((_vm.weekDays),function(day){return _c('th',[_c('div',{staticClass:"calendar-weekdays"},[_vm._v(_vm._s(day))])])})),_vm._l((_vm.calendar),function(week){return _c('tr',_vm._l((week),function(day){return _c('td',{on:{"click":function($event){_vm.select(day);}}},[_c('div',{staticClass:"calendar-item",class:_vm.getClass(day)},[_vm._v(_vm._s(day.getDate()))])])}))})],true)},staticRenderFns: [],
  name: 'date-calendar',

  mixins: [calendar],

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
        restrict: this.restrict(new Date(day)),
        selected: this.value &&
          day.toDateString() === this.value.toDateString()
      }
    }
  }
};

var WeekCalendar = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;return _c('table',{staticClass:"vmp-calendar-week"},[_c('tr',[_c('th',{attrs:{"colspan":"8"}},[_c('div',{staticClass:"calendar-title"},[_vm._v(_vm._s(_vm.year)+" 年 "+_vm._s(_vm.month + 1)+" 月")])])]),_c('tr',[_c('th',[_vm._v(_vm._s(_vm.weekNoTitle))]),_vm._l((_vm.weekDays),function(day){return _c('th',[_c('div',{staticClass:"calendar-weekdays"},[_vm._v(_vm._s(day))])])})],true),_vm._l((_vm.calendar),function(week){return _c('tr',{class:_vm.getTrClass(week[0]),on:{"click":function($event){_vm.select(week[0]);}}},[_c('td',[_vm._v(_vm._s(_vm.getWeek(week[0])))]),_vm._l((week),function(day){return _c('td',[_c('div',{staticClass:"calendar-item",class:_vm.getTdClass(day)},[_vm._v(_vm._s(day.getDate()))])])})],true)})],true)},staticRenderFns: [],
  name: 'week-calendar',

  mixins: [calendar],

  weekNoTitle: '周',

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
        restrict: this.restrict(new Date(week)),
        selected: this.value &&
          week.valueOf() === getWeekStart(this.value).valueOf()
      }
    },

    getTdClass: function getTdClass (day) {
      return { outter: day.getMonth() !== this.month }
    }
  },

  created: function created () {
    this.weekNoTitle = this.$options.weekNoTitle;
    this.getWeek = getWeek;
  }
};

var current$1 = new Date();
current$1.setMonth(0, 1);
current$1.setHours(0, 0, 0, 0);

var MonthCalendar = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;return _c('table',{staticClass:"vmp-calendar-month"},[_c('tr',[_c('th',{attrs:{"colspan":"4"}},[_c('div',{staticClass:"calendar-title"},[_vm._v(_vm._s(_vm.year)+" 年")])])]),_vm._l((3),function(_,r){return _c('tr',_vm._l((4),function(cc,c){return _c('td',{on:{"click":function($event){_vm.select(r * 4 + c);}}},[_c('div',{staticClass:"calendar-item",class:_vm.getClass(r * 4 + c)},[_vm._v(_vm._s(r * 4 + cc)+" 月")])])}))})],true)},staticRenderFns: [],
  name: 'month-calendar',

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
        restrict: this.restrict(new Date(this.year, month)),
        selected: this.value &&
          this.value.getFullYear() === this.year &&
          this.value.getMonth() === month
      }
    }
  },

  created: function created () {
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
