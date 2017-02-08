<template>
  <table class="vmp-calendar-date">
    <tr>
      <th colspan="7" class="calendar-title">
        <div>{{ year }} 年 {{ month + 1 }} 月</div>
      </th>
    </tr>
    <tr>
      <th v-for="day in weekDays" class="calendar-weekdays">
        <div>{{ day }}</div>
      </th>
    </tr>
    <tr v-for="week in calendar">
      <td v-for="day in week" class="calendar-item"
        :class="getClass(day)" @click="select(day)">
        <div>{{ isNow(day) ? currentText : day.getDate() }}</div>
      </td>
    </tr>
  </table>
</template>

<script>
import calendar from './calendar'

var NOW

export default {
  name: 'date-calendar',

  mixins: [calendar],

  currentText: '今天',

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
    select (day) {
      if (this.restrict(new Date(day))) return
      this.$emit('input', new Date(day))
    },

    getClass (day) {
      return {
        outter: day.getMonth() !== this.month,
        current: this.isNow(day),
        restrict: this.restrict(new Date(day)),
        selected: this.value &&
          day.toDateString() === this.value.toDateString()
      }
    },

    isNow (day) {
      return day.toDateString() === NOW
    }
  },

  created () {
    NOW = new Date().toDateString()
  }
}
</script>
