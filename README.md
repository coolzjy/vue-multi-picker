# vue-multi-picker

> A multi function date picker

> NOTE: version 1.\* is for vue 2.x and version 0.\* is for vue 1.x

## Usage
```javascript
import { DateCalendar, WeekCalendar, MonthCalendar } from 'vue-multi-picker'
```

```html
<date-calendar
  :restrict="restrictFunction"
  v-model="date" v-ref:picker>
</date-calendar>
```

##Change Calendar##
```javascript
this.$refs.picker.$emit('go', 1/-1/...)
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
