'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function checkRange$1(range, inspector) {
  var result = true;
  range.by('d', function (moment) {
    result = result && !inspector(moment);
  });
  return result;
}

var CalendarDay = { template: "<table class=vmp-calendar-day><tr><th colspan=7><div class=calendar-title>{{ period.get('y') }} 年 {{ period.get('M') + 1 }} 月</div><tr><th v-for=\"day in weekDays\"><div class=calendar-weekdays>{{ day }}</div><tr v-for=\"week in calendarWeeks\"><td v-for=\"day in calendar.slice(week * 7, week * 7 + 7)\"><div class=calendar-item :class=getClass(day.clone()) @click=click(day.clone()) @mouseenter=enter(day.clone())>{{ day.get('date') }}</div></table>",
  name: 'CalendarDay',

  props: {
    period: {
      type: Object
    },
    selectType: {
      type: String,
      default: 'day'
    },
    length: {
      type: Number
    },
    restrict: {
      type: Function,
      default: function _default(day) {
        return day.isAfter(moment());
      }
    },
    selected: {
      type: Object,
      twoWay: true
    },
    nextStart: {
      type: Object,
      twoWay: true
    },
    nextEnd: {
      type: Object,
      twoWay: true
    }
  },

  data: function data() {
    this.weekDays = moment.weekdaysShort(true);
    return {};
  },


  computed: {
    calendarStart: function calendarStart() {
      return this.period.clone().startOf('M').startOf('w');
    },
    calendarEnd: function calendarEnd() {
      return this.period.clone().endOf('M').endOf('w');
    },
    calendarWeeks: function calendarWeeks() {
      return this.calendarEnd.diff(this.calendarStart, 'w') + 1;
    },
    calendar: function calendar() {
      var calendar = [];
      moment.range(this.calendarStart, this.calendarEnd).by('d', function (moment) {
        calendar.push(moment);
      });
      return calendar;
    },
    realLength: function realLength() {
      return this.selectType === 'day' ? 0 : this.length - 1;
    },
    nextRange: function nextRange() {
      if (this.nextStart) {
        var end = this.nextEnd || this.nextStart;
        return this.nextStart.isBefore(end) ? moment.range(this.nextStart, end) : moment.range(end, this.nextStart);
      }
    }
  },

  methods: {
    getClass: function getClass(day) {
      var isOutter = day.get('M') !== this.period.get('M');
      var isRestrict = this.restrict(day);

      var isStart = this.selected && this.selected.start.isSame(day, 'd');
      var isEnd = this.selected && this.selected.end.isSame(day, 'd');
      var isContain = this.selected && this.selected.contains(day);

      var isNextStart = this.nextRange && this.nextRange.start.isSame(day, 'd');
      var isNextEnd = this.nextRange && this.nextRange.end.isSame(day, 'd');
      var isNextContain = this.nextRange && day.isBetween(this.nextRange.start, this.nextRange.end);
      return {
        'outter': isOutter,
        'restrict': isRestrict,
        'selected-start': isStart,
        'selected': isStart || isContain || isEnd,
        'selected-end': isEnd,
        'next-start': isNextStart,
        'next': isNextStart || isNextContain || isNextEnd,
        'next-end': isNextEnd
      };
    },
    click: function click(day) {
      if (this.selectType === 'day' || this.length > 0) {
        if (this.nextStart && this.nextEnd) {
          this.selected = moment.range(this.nextStart, this.nextEnd);
          this.nextStart = this.nextEnd = null;
        }
      } else if (!this.nextEnd) {
        if (checkRange$1(moment.range(day, day), this.restrict)) {
          this.nextEnd = day;
        }
      } else {
        var range = this.nextStart.isBefore(day) ? moment.range(this.nextStart, day) : moment.range(day, this.nextStart);
        if (checkRange$1(range, this.restrict)) {
          this.selected = this.nextRange.clone();
          this.nextStart = this.nextEnd = null;
        }
      }
    },
    enter: function enter(day) {
      if (this.selectType === 'day' || this.length > 0) {
        // single and fixed
        var range = moment.range(day, day.clone().add(this.realLength, 'd'));
        if (checkRange$1(range, this.restrict)) {
          this.nextStart = day.clone();
          this.nextEnd = day.clone().add(this.realLength, 'd');
        } else {
          this.nextStart = this.nextEnd = null;
        }
      } else if (!this.nextEnd) {
        // range start
        if (checkRange$1(moment.range(day, day), this.restrict)) {
          this.nextStart = day;
        }
      } else {
        var _range = this.nextStart.isBefore(day) ? moment.range(this.nextStart, day) : moment.range(day, this.nextStart);
        if (checkRange$1(_range, this.restrict)) {
          this.nextEnd = day;
        }
      }
    }
  }
};

var CalendarsDay = { template: "<div @mouseleave=leave><calendar-day v-for=\"p in periods\" :period=p :select-type=selectType :length=length :restrict=restrict :selected.sync=selected :next-start.sync=nextStart :next-end.sync=nextEnd></calendar-day></div>",
  props: {
    calendarNum: {
      type: Number
    },
    selectType: {
      type: String
    },
    length: {
      type: Number
    },
    restrict: {
      type: Function
    },
    selected: {
      type: Object,
      twoWay: true
    }
  },

  data: function data() {
    return {
      period: moment({ d: 1 }),
      nextStart: null,
      nextEnd: null
    };
  },


  computed: {
    periods: function periods() {
      var periods = [];
      for (var i = 0; i < this.calendarNum; i++) {
        periods.unshift(this.period.clone().subtract(i, 'M'));
      }
      return periods;
    }
  },

  methods: {
    leave: function leave() {
      if (this.selectType === 'day' || this.length || !this.nextEnd) {
        this.nextStart = this.nextEnd = null;
      }
    }
  },

  events: {
    prev: function prev() {
      this.period = this.period.clone().subtract(1, 'M');
    },
    next: function next() {
      this.period = this.period.clone().add(1, 'M');
    }
  },

  components: { CalendarDay: CalendarDay }
};

var CalendarWeek = { template: "<table class=vmp-calendar-week><tr><th><div class=calendar-title>{{ period.get('y') }} 年 {{ period.get('M') + 1 }} 月</div><tr v-for=\"week in weeks\"><td><div class=calendar-item :class=getClass(week.clone()) @click=click(week.clone())>{{ getWeekInfo(week.clone()) }}</div></table>",
  name: 'CalendarWeek',

  props: {
    restrict: {
      type: Function,
      default: function _default(start, end) {
        return end.isAfter(moment());
      }
    },
    selected: {
      type: Object,
      twoWay: true
    }
  },

  data: function data() {
    return {
      period: moment({ d: 1 })
    };
  },


  computed: {
    weeks: function weeks() {
      var endWeek = this.period.clone().endOf('M');
      var weeks = [];
      for (var week = this.period.clone().startOf('M'); week.isBefore(endWeek); week.add(1, 'w')) {
        weeks.push(week.clone());
      }
      return weeks;
    }
  },

  methods: {
    getClass: function getClass(week) {
      var isSelected = this.selected && this.selected.start.isSame(week.startOf('w'), 'd') && this.selected.end.isSame(week.endOf('w'), 'd');
      var isRestrict = this.checkRange(week);
      return {
        'selected': isSelected,
        'restrict': isRestrict
      };
    },
    getWeekInfo: function getWeekInfo(week) {
      var startDate = week.startOf('w').format('MMDD');
      var endDate = week.endOf('w').format('MMDD');
      return '\u7B2C ' + week.weeks() + ' \u5468 (' + startDate + ' - ' + endDate + ')';
    },
    click: function click(week) {
      var startMoment = week.clone().startOf('w');
      var endMoment = week.clone().endOf('w');
      if (!this.restrict(startMoment, endMoment)) {
        this.selected = moment.range(startMoment, endMoment);
      }
    },
    checkRange: function checkRange(week) {
      var startMoment = week.clone().startOf('w');
      var endMoment = week.clone().endOf('w');
      return this.restrict(startMoment, endMoment);
    }
  },

  events: {
    prev: function prev() {
      this.period = this.period.clone().subtract(1, 'M');
    },
    next: function next() {
      this.period = this.period.clone().add(1, 'M');
    }
  }
};

var CalendarMonth = { template: "<table class=vmp-calendar-month><tr><th colspan=4><div class=calendar-title>{{ period.get('y') }} 年</div><tr v-for=\"_ in 3\"><td v-for=\"__ in 4\"><div class=calendar-item :class=\"getClass(_ * 4 + __)\" @click=\"click(_ * 4 + __)\">{{ _ * 4 + __ + 1 }} 月</div></table>",
  name: 'CalendarMonth',

  props: {
    restrict: {
      type: Function,
      default: function _default(start, end) {
        return end.isAfter(moment());
      }
    },
    selected: {
      type: Object,
      twoWay: true
    }
  },

  data: function data() {
    return {
      period: moment({ M: 0, d: 1 })
    };
  },


  methods: {
    getClass: function getClass(month) {
      var monthMoment = moment({ y: this.period.year(), M: month });
      var isSelected = this.selected && this.selected.start.isSame(monthMoment.startOf('M'), 'd') && this.selected.end.isSame(monthMoment.endOf('M'), 'd');
      var isRestrict = this.checkRange(month);
      return {
        'selected': isSelected,
        'restrict': isRestrict
      };
    },
    click: function click(month) {
      var monthMoment = this.period.clone().month(month);
      var startMoment = monthMoment.clone().startOf('M');
      var endMoment = monthMoment.clone().endOf('M');
      if (!this.restrict(startMoment, endMoment)) {
        this.selected = moment.range(startMoment, endMoment);
      }
    },
    checkRange: function checkRange(month) {
      var monthMoment = this.period.clone().month(month);
      var startMoment = monthMoment.clone().startOf('M');
      var endMoment = monthMoment.clone().endOf('M');
      return this.restrict(startMoment, endMoment);
    }
  },

  events: {
    prev: function prev() {
      this.period = this.period.clone().subtract(1, 'y');
    },
    next: function next() {
      this.period = this.period.clone().add(1, 'y');
    }
  }
};

var MultiPicker$1 = { template: "<div class=vmp-container><calendars-day v-if=\"['day', 'range'].indexOf(selectType) > -1\" :select-type=selectType :length=length :calendar-num=calendarNum :restrict=restrict :selected.sync=selected></calendars-day><calendar-week v-if=\"selectType === 'week'\" :restrict=restrict :selected.sync=selected></calendar-week><calendar-month v-if=\"selectType === 'month'\" :restrict=restrict :selected.sync=selected></calendar-month></div>",
  props: {
    // common
    selectType: { type: String, default: 'day' },
    selected: { type: Object, twoWay: true },
    restrict: { type: Function },
    resetOnTypeChange: { type: Boolean, default: true },
    // day
    calendarNum: { type: Number, default: 1 },
    length: { type: Number }
  },

  watch: {
    'selectType': function selectType() {
      if (this.resetOnTypeChange) this.selected = null;
    }
  },

  events: {
    prev: function prev() {
      this.$broadcast('prev');
    },
    next: function next() {
      this.$broadcast('next');
    }
  },

  components: { CalendarsDay: CalendarsDay, CalendarWeek: CalendarWeek, CalendarMonth: CalendarMonth }
};

exports['default'] = MultiPicker$1;
exports.CalendarDay = CalendarsDay;
exports.CalendarWeek = CalendarWeek;
exports.CalendarMonth = CalendarMonth;
