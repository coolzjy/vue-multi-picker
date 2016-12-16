import { ONE_DAY, ONE_WEEK, getWeekStart, getWeekEnd } from '../utils'

const current = new Date()
current.setDate(1, 0, 0, 0, 0)

export default {
  weekDays: ['一', '二', '三', '四', '五', '六', '日'],

  data () {
    return {
      current: Object.freeze(current)
    }
  },

  computed: {
    year () { return this.current.getFullYear() },

    month () { return this.current.getMonth() },

    calendar () {
      var weekStart = getWeekStart(new Date(this.year, this.month))
      var weekEnd = getWeekEnd(new Date(this.year,this.month + 1, 0))
      var calendar = []
      for (var i = weekStart.valueOf(); i < weekEnd.valueOf(); i += ONE_WEEK) {
        var week = []
        for (var j = i; j < (i + ONE_WEEK); j += ONE_DAY) {
          week.push(new Date(j))
        }
        calendar.push(week)
      }
      return calendar
    }
  },

  watch: {
    'value': 'switchToCurrent'
  },

  methods: {
    contains (date) {
      var date = new Date(date)
      date.setHours(0, 0, 0, 0)
      return this.calendar[this.calendar.length - 1][6] - date >= 0 &&
        date - this.calendar[0][0] >= 0
    },

    switchToCurrent (selected) {
      if (!selected) return
      if (!this.contains(selected)) {
        var current = new Date(selected.getFullYear(), selected.getMonth())
        this.current = Object.freeze(current)
      }
    }
  },

  created () {
    this.weekDays = this.$options.weekDays
    this.currentText = this.$options.currentText
    this.switchToCurrent(this.value)
    this.$on('go', function (num) {
      var current = new Date(this.current)
      current.setMonth(this.month + num)
      this.current = Object.freeze(current)
    })
  }
}
