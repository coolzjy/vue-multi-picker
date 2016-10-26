<template>
  <table class="vmp-calendar-week">
    <tr>
      <th>
        <div class="calendar-title">
          {{ period.get('y') }} 年 {{ period.get('M') + 1 }} 月
        </div>
      </th>
    </tr>
    <tr v-for="week in weeks">
      <td>
        <div class="calendar-item"
          :class="getClass(week.clone())"
          @click="click(week.clone())">
          {{ getWeekInfo(week.clone()) }}
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
const THIS_WEEK = moment().startOf('w')

export default {
  name: 'CalendarWeek',

  props: {
    restrict: {
      type: Function,
      default () { return false }
    },
    selected: {
      type: Object,
      twoWay: true
    }
  },

  data () {
    return { period: moment({ d: 1 }) }
  },

  computed: {
    weeks () {
      let end = this.period.clone().endOf('M').startOf('w')
      let weeks = []
      for (let weekStart = this.period.clone().startOf('M').startOf('w');
        !weekStart.isAfter(end); weekStart.add(1, 'w')) {
          let weekEnd = weekStart.clone().endOf('w')
          weeks.push(moment.range(weekStart, weekEnd))
      }
      return weeks
    }
  },

  watch: {
    'selected': {
      immediate: true,
      handler (value) {
        if (value) {
          this.period = value.end.clone().startOf('M')
        }
      }
    }
  },

  methods: {
    getClass (week) {
      let isCurrent = week.start.isSame(THIS_WEEK, 'w')
      let isSelected = this.selected &&
        this.selected.start.isSame(week.start, 'd') &&
        this.selected.end.isSame(week.end, 'd')
      let isRestrict = this.restrict(week)
      return {
        'current': isCurrent,
        'selected': isSelected,
        'restrict': isRestrict
      }
    },

    getWeekInfo (week) {
      let startStr = week.start.format('MMDD')
      let endStr = week.end.format('MMDD')
      return `第 ${week.start.weeks()} 周 (${startStr} - ${endStr})`
    },

    click (week) {
      if (!this.restrict(week)) {
        this.selected = week
      }
    }
  },

  events: {
    prev () {
      this.period = this.period.clone().subtract(1, 'M')
    },
    next () {
      this.period = this.period.clone().add(1, 'M')
    }
  }
}
</script>
