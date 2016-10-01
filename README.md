# vue-multi-picker

> A multi function date picker

## Usage
```javascript
// multi-picker
import MultiPicker from 'vue-multi-picker'
// standalone calendar
import { CalendarDay, CalendarWeek, CalendarMonth } from 'vue-multi-picker'
```

```html
<multi-picker
  :select-type="day|range|week|month"
  :length="7 (only work under range select mode)"
  :calendar-num="2 (only work under day and range select mode)"
  :selected.sync="selected (moment range object)"
  :restrict="resFunc (a momentrange object given as arg,
    return true to restrict selection)"
  :reset-on-type-change="true (reset selected to null, default enabled)">
</multi-picker>
```

##Change Calendar##
```javascript
this.$refs.multiPicker.$emit('prev')
this.$refs.multiPicker.$emit('next')
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production
npm run build
```
