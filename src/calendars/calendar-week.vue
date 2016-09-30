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
        <div :class="getClass(week.clone())"
          @click="click(week.clone())">
          {{ getWeekInfo(week.clone()) }}
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'CalendarWeek',

  props: {
    restrict: {
      type: Function,
      default (start, end) {
        return end.isAfter(moment())
      }
    },
    selected: {
      type: Object,
      twoWay: true
    }
  },

  data () {
    return {
      period: Object.freeze(moment({ d: 1 }))
    }
  },

  computed: {
    weeks () {
      let endWeek = this.period.clone().endOf('M')
      let weeks = []
      for (let week = this.period.clone().startOf('M');
        week.isBefore(endWeek); week.add(1, 'w')) {
        weeks.push(week.clone())
      }
      return weeks
    }
  },

  methods: {
    getClass (week) {
      let isSelected = this.selected &&
        this.selected.start.isSame(week.startOf('w'), 'd') &&
        this.selected.end.isSame(week.endOf('w'), 'd')
      let isRestrict = this.checkRange(week)
      return {
        'selected': isSelected,
        'restrict': isRestrict
      }
    },

    getWeekInfo (week) {
      let startDate = week.startOf('w').format('MMDD')
      let endDate = week.endOf('w').format('MMDD')
      return `第 ${week.weeks()} 周 (${startDate} - ${endDate})`
    },

    click (week) {
      let startMoment = week.clone().startOf('w')
      let endMoment = week.clone().endOf('w')
      if (!this.restrict(startMoment, endMoment)) {
        this.selected = moment.range(startMoment, endMoment)
      }
    },

    checkRange(week) {
      let startMoment = week.clone().startOf('w')
      let endMoment = week.clone().endOf('w')
      return this.restrict(startMoment, endMoment)
    }
  },

  events: {
    prev () {
      this.period = Object.freeze(this.period.clone().subtract(1, 'M'))
    },
    next () {
      this.period = Object.freeze(this.period.clone().add(1, 'M'))
    }
  }
}
</script>
