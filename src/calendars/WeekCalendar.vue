<template>
  <table class="vmp-calendar-week">
    <tr>
      <th colspan="8" class="calendar-title">
        <div>{{ year }} 年 {{ month + 1 }} 月</div>
      </th>
    </tr>
    <tr>
      <th class="calendar-weektitle">{{ weekNoText }}</th>
      <th v-for="day in weekDays" class="calendar-weekdays">
        <div>{{ day }}</div>
      </th>
    </tr>
    <tr v-for="week in calendar"
      :class="getTrClass(week[0])"
      @click="select(week[0])">
      <td class="calendar-weekno">
        <div>{{ isNow(week[0]) ? currentText : getWeek(week[0]) }}</div>
      </td>
      <td v-for="day in week" class="calendar-item" :class="getTdClass(day)">
        <div>{{ day.getDate() }}</div>
      </td>
    </tr>
  </table>
</template>

<script>
import { getWeekStart, getWeek } from '../utils'
import calendar from './calendar'

var NOW = getWeekStart(new Date()).toDateString()

export default {
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
      default () { return false }
    }
  },

  methods: {
    select (week) {
      if (this.restrict(new Date(week))) return
      this.$emit('input', new Date(week))
    },

    getTrClass (week) {
      return {
        current: this.isNow(week),
        restrict: this.restrict(new Date(week)),
        selected: this.value &&
          week.valueOf() === getWeekStart(this.value).valueOf()
      }
    },

    getTdClass (day) {
      return { outter: day.getMonth() !== this.month }
    },

    isNow (week) {
      return week.toDateString() === NOW
    }
  },

  created () {
    this.weekNoText = this.$options.weekNoText
    this.getWeek = getWeek
  }
}
</script>
