<template>
  <table class="vmp-calendar-day">
    <tr>
      <th colspan="7">
        <div class="calendar-title">{{ year }} 年 {{ month + 1 }} 月</div>
      </th>
    </tr>
    <tr>
      <th v-for="day in weekDays">
        <div class="calendar-weekdays">{{ day }}</div>
      </th>
    </tr>
    <tr v-for="week in calendar">
      <td v-for="day in week" @click="select(day)">
        <div class="calendar-item" :class="getClass(day)">
          {{ day.getDate() }}
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
import calendar from './calendar'

export default {
  name: 'date-calendar',

  mixins: [calendar],

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
        restrict: this.restrict(new Date(day)),
        selected: this.value &&
          day.toDateString() === this.value.toDateString()
      }
    }
  }
}
</script>
