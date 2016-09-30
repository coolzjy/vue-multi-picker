<template>
  <div class="vmp-container">
    <calendars-day v-if="['day', 'range'].indexOf(selectType) > -1"
      :select-type="selectType"
      :length="length"
      :calendar-num="calendarNum"
      :restrict="restrict"
      :selected.sync="selected">
    </calendars-day>
    <calendar-week v-if="selectType === 'week'"
      :restrict="restrict"
      :selected.sync="selected">
    </calendar-week>
    <calendar-month v-if="selectType === 'month'"
      :restrict="restrict"
      :selected.sync="selected">
    </calendar-month>
  </div>
</template>

<script>
import CalendarsDay from './calendars/calendars-day.vue'
import CalendarWeek from './calendars/calendar-week.vue'
import CalendarMonth from './calendars/calendar-month.vue'

export default {
  props: {
    // common
    selectType: { type: String, default: 'day' },
    selected: { type: Object, twoWay: true },
    restrict: { type: Function },
    resetOnTypeChange: { type: Boolean, default: true },
    // day
    calendarNum: { type: Number, default: 1 },
    length: { type: Number }
  },

  watch: {
    'selectType' () {
      if (this.resetOnTypeChange) this.selected = null
    }
  },

  events: {
    prev () { this.$broadcast('prev') },
    next () { this.$broadcast('next') }
  },

  components: { CalendarsDay, CalendarWeek, CalendarMonth }
}
</script>
