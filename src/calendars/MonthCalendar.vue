<template>
  <table class="vmp-calendar-month">
    <tr>
      <th colspan="4" class="calendar-title"><div>{{ year }} 年</div></th>
    </tr>
    <tr v-for="(_, r) in 3">
      <td v-for="(cc, c) in 4" class="calendar-item"
        :class="getClass(r * 4 + c)" @click="select(r * 4 + c)">
        <div>{{ isNow(r * 4 + c) ? currentText : r * 4 + cc + '月' }}</div>
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
  name: 'month-calendar',

  currentText: '本月',

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
    year () { return this.current.getFullYear() }
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

    select (month) {
      if (this.restrict(new Date(this.year, month))) return
      this.$emit('input', new Date(this.year, month))
    },

    getClass (month) {
      return {
        current: this.isNow(month),
        restrict: this.restrict(new Date(this.year, month)),
        selected: this.value &&
          this.value.getFullYear() === this.year &&
          this.value.getMonth() === month
      }
    },

    isNow (month) {
      return this.year === NOW.y && month === NOW.m
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
      current.setFullYear(this.year + num)
      this.current = Object.freeze(current)
    })
  }
}
</script>
