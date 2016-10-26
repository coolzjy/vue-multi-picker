<template>
  <table class="vmp-calendar-month">
    <tr>
      <th colspan="4">
        <div class="calendar-title">
          {{ period.get('y') }} 年
        </div>
      </th>
    </tr>
    <tr v-for="_ in 3">
      <td v-for="__ in 4">
        <div class="calendar-item"
          :class="getClass(_ * 4 + __)"
          @click="click(_ * 4 + __)">
          {{ _ * 4 + __ + 1 }} 月
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
const THIS_MONTH = moment().startOf('M')

export default {
  name: 'CalendarMonth',

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
    return { period: moment({ M: 0, d: 1 }) }
  },

  watch: {
    'selected': {
      immediate: true,
      handler (value) {
        if (value) {
          this.period = value.end.clone().startOf('y')
        }
      }
    }
  },

  methods: {
    getClass (month) {
      let monthMoment = moment({ y: this.period.year(), M: month })
      let isCurrent = monthMoment.isSame(THIS_MONTH, 'M')
      let isSelected = this.selected &&
        this.selected.start.isSame(monthMoment.startOf('M'), 'd') &&
        this.selected.end.isSame(monthMoment.endOf('M'), 'd')
      let isRestrict = this.checkRestrict(month)
      return {
        'current': isCurrent,
        'selected': isSelected,
        'restrict': isRestrict
      }
    },

    click (month) {
      let monthMoment = this.period.clone().month(month)
      let startMoment = monthMoment.clone().startOf('M')
      let endMoment = monthMoment.clone().endOf('M')
      if (!this.checkRestrict(month)) {
        this.selected = moment.range(startMoment, endMoment)
      }
    },

    checkRestrict (month) {
      let monthMoment = this.period.clone().month(month)
      let startMoment = monthMoment.clone().startOf('M')
      let endMoment = monthMoment.clone().endOf('M')
      return this.restrict(moment.range(startMoment, endMoment))
    }
  },

  events: {
    prev () {
      this.period = this.period.clone().subtract(1, 'y')
    },
    next () {
      this.period = this.period.clone().add(1, 'y')
    }
  }
}
</script>
