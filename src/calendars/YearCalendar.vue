<template>
  <table class="vmp-calendar-month">
    <tr>
      <th colspan="4" class="calendar-title"><div>{{ years[1] }} - {{ years[10] }} 年</div></th>
    </tr>
    <tr v-for="(_, r) in 3">
      <td v-for="(__, c) in 4" class="calendar-item"
        :class="getClass(years[r * 4 + c])" @click="select(years[r * 4 + c])">
        <div>{{ isNow(years[r * 4 + c]) ? currentText : years[r * 4 + c] }}</div>
      </td>
    </tr>
  </table>
</template>

<script>
var current = new Date()
current.setMonth(0, 1)
current.setHours(0, 0, 0, 0)

var NOW

export default {
  name: 'year-calendar',

  currentText: '本年',

  props: {
    value: {
      type: Date
    },
    restrict: {
      type: Function,
      default () { return false }
    }
  },

  data () {
    return {
      current: Object.freeze(current)
    }
  },

  computed: {
    year () { return this.current.getFullYear() },
    years () {
      let year = this.year.toString()
      let segYears = []
      year -= year[3]
      for (let i = year - 1; i < year + 11; i++) {
        segYears.push(i)
      }
      return segYears
    }
  },

  watch: {
    'value': 'switchToCurrent'
  },

  methods: {
    switchToCurrent (selected, prevSelected) {
      if (!selected) return
      if (!prevSelected || selected.getFullYear() !== this.year) {
        this.current = Object.freeze(new Date(selected.getFullYear(), 0))
      }
    },

    select (year) {
      if (this.restrict(new Date(year.toString()))) return
      this.$emit('input', new Date(year.toString()))
    },

    getClass (year) {
      return {
        outter: year === this.years[0] || year === this.years[11],
        current: this.isNow(year),
        restrict: this.restrict(new Date(year)),
        selected: this.value &&
          this.value.getFullYear() === year
      }
    },

    isNow (year) {
      return NOW.y === year
    }
  },

  created () {
    NOW = {
      y: new Date().getFullYear(),
      m: new Date().getMonth()
    }
    this.currentText = this.$options.currentText
    this.switchToCurrent(this.value)
    this.$on('go', function (num) {
      var current = new Date(this.current)
      current.setFullYear(this.year + num * 10)
      this.current = Object.freeze(current)
    })
  }
}
</script>

