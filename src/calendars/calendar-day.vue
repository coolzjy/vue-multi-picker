<template>
  <table class="vmp-calendar-day">
    <tr>
      <th colspan="7">
        <div class="calendar-title">
          {{ period.get('y') }} 年 {{ period.get('M') + 1 }} 月
        </div>
      </th>
    </tr>
    <tr>
      <th v-for="day in weekDays">
        <div class="calendar-weekdays">
          {{ day }}
        </div>
      </th>
    </tr>
    <tr v-for="week in calendarWeeks">
      <td v-for="day in calendar.slice(week * 7, week * 7 + 7)">
        <div class="calendar-item"
          :class="getClass(day.clone())"
          @click="click(day.clone())"
          @mouseenter="enter(day.clone())">
          {{ day.get('date') }}
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
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
      default () { return false }
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

  data () {
    this.weekDays = moment.weekdaysShort(true)
    return {}
  },

  computed: {
    calendarStart () {
      return this.period.clone().startOf('M').startOf('w')
    },

    calendarEnd () {
      return this.period.clone().endOf('M').endOf('w')
    },

    calendarWeeks () {
      return this.calendarEnd.diff(this.calendarStart, 'w') + 1
    },

    calendar () {
      let calendar = []
      moment.range(this.calendarStart, this.calendarEnd).by('d', moment => {
        calendar.push(moment)
      })
      return calendar
    },

    realLength () {
      return this.selectType === 'day' ? 0 : this.length - 1
    },

    nextRange () {
      if (this.nextStart) {
        let end = this.nextEnd || this.nextStart
        return this.nextStart.isBefore(end)
          ? moment.range(this.nextStart, end)
          : moment.range(end, this.nextStart)
      }
    }
  },

  methods: {
    getClass (day) {
      let isOutter = day.get('M') !== this.period.get('M')
      let isRestrict = this.restrict(moment.range(day.clone().startOf('d'),
        day.clone().endOf('d')))

      let isStart = this.selected && this.selected.start.isSame(day, 'd')
      let isEnd = this.selected && this.selected.end.isSame(day, 'd')
      let isContain = this.selected && this.selected.contains(day)

      let isNextStart = this.nextRange && this.nextRange.start.isSame(day, 'd')
      let isNextEnd = this.nextRange && this.nextRange.end.isSame(day, 'd')
      let isNextContain = this.nextRange &&
        day.isBetween(this.nextRange.start, this.nextRange.end)
      return {
        'outter': isOutter,
        'restrict': isRestrict,
        'selected-start': isStart,
        'selected': isStart || isContain || isEnd,
        'selected-end': isEnd,
        'next-start': isNextStart,
        'next': isNextStart || isNextContain || isNextEnd,
        'next-end': isNextEnd
      }
    },

    click (day) {
      if (this.selectType === 'day' || this.length > 0) {
        if (this.nextStart && this.nextEnd) {
          this.selected = moment.range(this.nextStart, this.nextEnd)
          this.nextStart = this.nextEnd = null
        }
      } else if (this.nextStart && !this.nextEnd) {
        this.nextEnd = day.clone().endOf('d')
      } else if (this.nextStart && this.nextEnd) {
        if (!this.restrict(this.nextRange)) {
          this.selected = this.nextRange.clone()
          this.nextStart = this.nextEnd = null
        }
      }
    },

    enter (day) {
      if (this.selectType === 'day' || this.length > 0) {
        // single and fixed
        let range =
          moment.range(day, day.clone().add(this.realLength, 'd').endOf('d'))
        if (!this.restrict(range)) {
          this.nextStart = range.start
          this.nextEnd = range.end
        } else {
          this.nextStart = this.nextEnd = null
        }
      } else if (!this.nextEnd) {
        // range start
        if (!this.restrict(moment.range(day, day.clone().endOf('d')))) {
          this.nextStart = day
        } else {
          this.nextStart = null
        }
      } else if (this.nextStart) {
        let prevNextEnd = this.nextEnd
        this.nextEnd = day.clone().endOf('d')
        if (this.restrict(this.nextRange)) {
          this.nextEnd = prevNextEnd
        }
      }
    }
  }
}
</script>
