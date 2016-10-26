'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var TODAY = moment().startOf('d');

var CalendarDay = { template: "<table class=vmp-calendar-day><tr><th colspan=7><div class=calendar-title>{{ period.get('y') }} 年 {{ period.get('M') + 1 }} 月</div><tr><th v-for=\"day in weekDays\"><div class=calendar-weekdays>{{ day }}</div><tr v-for=\"week in calendarWeeks\"><td v-for=\"day in calendar.slice(week * 7, week * 7 + 7)\"><div class=calendar-item :class=getClass(day.clone()) @click=click(day.clone()) @mouseenter=enter(day.clone())>{{ current.isSame(day, 'd') ? '今天' : day.get('date') }}</div></table>",
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
      default: function _default() {
        return false;
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
    this.current = TODAY;
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
      var isCurrent = day.isSame(TODAY, 'd');

      var isOutter = day.get('M') !== this.period.get('M');
      var isRestrict = this.restrict(moment.range(day.clone().startOf('d'), day.clone().endOf('d')));

      var isStart = this.selected && this.selected.start.isSame(day, 'd');
      var isEnd = this.selected && this.selected.end.isSame(day, 'd');
      var isContain = this.selected && this.selected.contains(day);

      var isNextStart = this.nextRange && this.nextRange.start.isSame(day, 'd');
      var isNextEnd = this.nextRange && this.nextRange.end.isSame(day, 'd');
      var isNextContain = this.nextRange && day.isBetween(this.nextRange.start, this.nextRange.end);
      return {
        'current': isCurrent,
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
      } else if (this.nextStart && !this.nextEnd) {
        this.nextEnd = day.clone().endOf('d');
      } else if (this.nextStart && this.nextEnd) {
        if (!this.restrict(this.nextRange)) {
          this.selected = this.nextRange.clone();
          this.nextStart = this.nextEnd = null;
        }
      }
    },
    enter: function enter(day) {
      if (this.selectType === 'day' || this.length > 0) {
        // single and fixed
        var range = moment.range(day, day.clone().add(this.realLength, 'd').endOf('d'));
        if (!this.restrict(range)) {
          this.nextStart = range.start;
          this.nextEnd = range.end;
        } else {
          this.nextStart = this.nextEnd = null;
        }
      } else if (!this.nextEnd) {
        // range start
        if (!this.restrict(moment.range(day, day.clone().endOf('d')))) {
          this.nextStart = day;
        } else {
          this.nextStart = null;
        }
      } else if (this.nextStart) {
        var prevNextEnd = this.nextEnd;
        this.nextEnd = day.clone().endOf('d');
        if (this.restrict(this.nextRange)) {
          this.nextEnd = prevNextEnd;
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

  watch: {
    'selected': {
      immediate: true,
      handler: function handler(value) {
        if (value) {
          this.period = value.end.clone().startOf('M');
        }
      }
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

var THIS_WEEK = moment().startOf('w');

var CalendarWeek = { template: "<table class=vmp-calendar-week><tr><th><div class=calendar-title>{{ period.get('y') }} 年 {{ period.get('M') + 1 }} 月</div><tr v-for=\"week in weeks\"><td><div class=calendar-item :class=getClass(week.clone()) @click=click(week.clone())>{{ getWeekInfo(week.clone()) }}</div></table>",
  name: 'CalendarWeek',

  props: {
    restrict: {
      type: Function,
      default: function _default() {
        return false;
      }
    },
    selected: {
      type: Object,
      twoWay: true
    }
  },

  data: function data() {
    return { period: moment({ d: 1 }) };
  },


  computed: {
    weeks: function weeks() {
      var end = this.period.clone().endOf('M').startOf('w');
      var weeks = [];
      for (var weekStart = this.period.clone().startOf('M').startOf('w'); !weekStart.isAfter(end); weekStart.add(1, 'w')) {
        var weekEnd = weekStart.clone().endOf('w');
        weeks.push(moment.range(weekStart, weekEnd));
      }
      return weeks;
    }
  },

  watch: {
    'selected': {
      immediate: true,
      handler: function handler(value) {
        if (value) {
          this.period = value.end.clone().startOf('M');
        }
      }
    }
  },

  methods: {
    getClass: function getClass(week) {
      var isCurrent = week.start.isSame(THIS_WEEK, 'w');
      var isSelected = this.selected && this.selected.start.isSame(week.start, 'd') && this.selected.end.isSame(week.end, 'd');
      var isRestrict = this.restrict(week);
      return {
        'current': isCurrent,
        'selected': isSelected,
        'restrict': isRestrict
      };
    },
    getWeekInfo: function getWeekInfo(week) {
      var startStr = week.start.format('MMDD');
      var endStr = week.end.format('MMDD');
      return '\u7B2C ' + week.start.weeks() + ' \u5468 (' + startStr + ' - ' + endStr + ')';
    },
    click: function click(week) {
      if (!this.restrict(week)) {
        this.selected = week;
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
  }
};

var THIS_MONTH = moment().startOf('M');

var CalendarMonth = { template: "<table class=vmp-calendar-month><tr><th colspan=4><div class=calendar-title>{{ period.get('y') }} 年</div><tr v-for=\"_ in 3\"><td v-for=\"__ in 4\"><div class=calendar-item :class=\"getClass(_ * 4 + __)\" @click=\"click(_ * 4 + __)\">{{ _ * 4 + __ + 1 }} 月</div></table>",
  name: 'CalendarMonth',

  props: {
    restrict: {
      type: Function,
      default: function _default() {
        return false;
      }
    },
    selected: {
      type: Object,
      twoWay: true
    }
  },

  data: function data() {
    return { period: moment({ M: 0, d: 1 }) };
  },


  watch: {
    'selected': {
      immediate: true,
      handler: function handler(value) {
        if (value) {
          this.period = value.end.clone().startOf('y');
        }
      }
    }
  },

  methods: {
    getClass: function getClass(month) {
      var monthMoment = moment({ y: this.period.year(), M: month });
      var isCurrent = monthMoment.isSame(THIS_MONTH, 'M');
      var isSelected = this.selected && this.selected.start.isSame(monthMoment.startOf('M'), 'd') && this.selected.end.isSame(monthMoment.endOf('M'), 'd');
      var isRestrict = this.checkRestrict(month);
      return {
        'current': isCurrent,
        'selected': isSelected,
        'restrict': isRestrict
      };
    },
    click: function click(month) {
      var monthMoment = this.period.clone().month(month);
      var startMoment = monthMoment.clone().startOf('M');
      var endMoment = monthMoment.clone().endOf('M');
      if (!this.checkRestrict(month)) {
        this.selected = moment.range(startMoment, endMoment);
      }
    },
    checkRestrict: function checkRestrict(month) {
      var monthMoment = this.period.clone().month(month);
      var startMoment = monthMoment.clone().startOf('M');
      var endMoment = monthMoment.clone().endOf('M');
      return this.restrict(moment.range(startMoment, endMoment));
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
