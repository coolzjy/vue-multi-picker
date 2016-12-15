<template>
  <div>
    <div>
      <label v-for="type in types">
        <input type="radio" name="type" :value="type.v" v-model="selectedType">
        {{ type.t }}
      </label>
    </div>
    <div>
      <button type="button" @click="go(-1)">-1</button>
      <button type="button" @click="go(1)">+1</button>
    </div>
    <keep-alive>
      <component :is="selectedType" :restrict="restrict" v-model="date">
      </component>
    </keep-alive>
  </div>
</template>

<script>
import { DateCalendar, WeekCalendar, MonthCalendar } from '../src'

var TYPES = [
  { t: '日', v: 'date-calendar' },
  { t: '周', v: 'week-calendar' },
  { t: '月', v: 'month-calendar' },
]

export default {
  data () {
    this.types = TYPES
    return {
      selectedType: 'date-calendar',
      date: undefined
    }
  },

  methods: {
    go (num) {
      this.$children.forEach(comp => {
        if (!comp._inactive) comp.$emit('go', num)
      })
    },

    restrict (date) {
      return (new Date() - date) < 0
    }
  },

  components: { DateCalendar, WeekCalendar, MonthCalendar }
}
</script>

<style>
.outter {
  color: #eee;
}

.selected {
  color: red;
}

.restrict {
  color: yellow;
}
</style>
