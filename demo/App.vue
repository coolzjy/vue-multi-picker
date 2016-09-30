<template>
  <div id="app">
    <button type="button" @click="$broadcast('prev')">prev</button>
    <button type="button" @click="$broadcast('next')">next</button>
    <input type="radio" name="type" value="range" v-model="type">
    <input type="radio" name="type" value="week" v-model="type">
    <input type="radio" name="type" value="month" v-model="type">
    <multi-picker :select-type="type"
      :selected.sync="range">
    </multi-picker>
  </div>
</template>

<script>
import MultiPicker from '../src/index.js'

export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      type: 'day',
      range: moment.range(moment().subtract(1, 'd'), moment())
    }
  },

  methods: {
    restrict (day) {
      return day.isAfter(moment().subtract(1, 'd'), 'd')
    }
  },

  components: { MultiPicker }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}

.selected {
  background: red;
}
.selected-start {
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
}
.selected-end {
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
}

.next {
  background: blue;
}
.next-start {
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
}
.next-end {
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
}
</style>
