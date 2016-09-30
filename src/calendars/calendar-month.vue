<template>
  <table class="vmp-calendar-month">
    <tr>
      <th colspan="4">{{ period.get('y') }} 年</th>
    </tr>
    <tr v-for="_ in 3">
      <td v-for="__ in 4"
        :class="getClass(_ * 4 + __)"
        @click="click(_ * 4 + __)">
        {{ _ * 4 + __ + 1 }} 月
      </td>
    </tr>
  </table>
</template>

<script>
export default {
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
      period: Object.freeze(moment({ M: 0, d: 1 }))
    }
  },

  methods: {
    getClass (month) {
      let monthMoment = moment({ y: this.period.year(), M: month })
      let isSelected = this.selected &&
        this.selected.start.isSame(monthMoment.startOf('M'), 'd') &&
        this.selected.end.isSame(monthMoment.endOf('M'), 'd')
      let isRestrict = this.checkRange(month)
      return {
        'selected': isSelected,
        'restrict': isRestrict
      }
    },

    click (month) {
      let monthMoment = this.period.clone().month(month)
      let startMoment = monthMoment.clone().startOf('M')
      let endMoment = monthMoment.clone().endOf('M')
      if (!this.restrict(startMoment, endMoment)) {
        this.selected = moment.range(startMoment, endMoment)
      }
    },

    checkRange (month) {
      let monthMoment = this.period.clone().month(month)
      let startMoment = monthMoment.clone().startOf('M')
      let endMoment = monthMoment.clone().endOf('M')
      return this.restrict(startMoment, endMoment)
    }
  },

  events: {
    prev () {
      this.period = Object.freeze(this.period.clone().subtract(1, 'y'))
    },
    next () {
      this.period = Object.freeze(this.period.clone().add(1, 'y'))
    }
  }
}
</script>
