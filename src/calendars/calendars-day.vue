<template>
  <div @mouseleave="leave">
    <calendar-day v-for="p in periods"
      :period="p"
      :select-type="selectType"
      :length="length"
      :restrict="restrict"
      :selected.sync="selected"
      :next-start.sync="nextStart"
      :next-end.sync="nextEnd">
    </calendar-day>
  </div>
</template>

<script>
import CalendarDay from './calendar-day.vue'

export default {
  props: {
    calendarNum: {
      type: Number
    },
    selectType: {
      type: String
    },
    length: {
      type: Number
    },
    restrict: {
      type: Function
    },
    selected: {
      type: Object,
      twoWay: true
    }
  },

  data () {
    return {
      period: Object.freeze(moment({ d: 1 })),
      nextStart: null,
      nextEnd: null
    }
  },

  computed: {
    periods () {
      let periods = []
      for (var i = 0; i < this.calendarNum; i++) {
        periods.unshift(this.period.clone().subtract(i, 'M'))
      }
      return periods
    }
  },

  methods: {
    leave () {
      if (this.selectType === 'day' || this.length || !this.nextEnd) {
        this.nextStart = this.nextEnd = null
      }
    }
  },

  events: {
    prev () {
      this.period = Object.freeze(this.period.clone().subtract(1, 'M'))
    },
    next () {
      this.period = Object.freeze(this.period.clone().add(1, 'M'))
    }
  },

  components: { CalendarDay }
}
</script>
