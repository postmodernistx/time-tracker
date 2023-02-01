<script lang="ts" setup>
/**
 * This component creates a <tr> with the name of the task
 * and then the time grouped by date.
 */
import type { ITimeLogEntry } from '@/stores/firestore';
import { computed, onMounted, ref } from 'vue';
import { firebaseTimestampToDate, prettyDate } from '@/helpers/helpers';
import type { IFirebaseTimestamp } from '@/helpers/helpers';
import TimeCell from '@/components/TimeCell.vue';

interface ITimeEntry {
  minutes: number;
  date: string;
}

const props = defineProps<{
  minDate: number;
  maxDate: number;
  data: ITimeLogEntry[];
  name: string;
}>();

const result = ref({});

function processData() {
  // Push entries to new array with proper date object
  const arr: ITimeEntry[] = [];
  props.data.forEach(item => {
    const date: unknown = item.date as unknown;
    const d: IFirebaseTimestamp = date as IFirebaseTimestamp;
    const properDate: Date = firebaseTimestampToDate(d.seconds);
    const obj = {
      minutes: item.minutes,
      date: prettyDate(properDate),
    };
    arr.push(obj);
  });

  // Group the data by date
  const grouped = arr.reduce((acc, currentValue) => {
    acc[currentValue.date] = acc[currentValue.date] || [];
    acc[currentValue.date].push(currentValue);
    return acc;
  }, Object.create(null));

  // Sort by date
  result.value = Object.keys(grouped)
    .sort()
    .reduce((a, b) => {
      // @ts-ignore
      a[b] = grouped[b];
      return a;
    }, {});
}

const daysBetween = computed(() => {
  const dateStart = firebaseTimestampToDate(props.minDate);
  const dateEnd = firebaseTimestampToDate(props.maxDate);
  const diff_in_time = dateEnd.getTime() - dateStart.getTime();
  return Math.ceil(diff_in_time / (1000 * 3600 * 24));
});

const days = computed(() => {
  let arr = [];
  const dateStart = firebaseTimestampToDate(props.minDate);
  for (let i = 0; i <= daysBetween.value; i++) {
    arr.push(prettyDate(dateStart));
    dateStart.setDate(dateStart.getDate() + 1);
  }
  return arr;
});

onMounted(() => {
  processData();
});
</script>

<template>
  <tr>
    <td>{{ data[0].taskName }}</td>
    <td v-for="date in days" :key="`d-${date}`">
      <template v-if="result[date]">
        <TimeCell :data="result[date]" />
      </template>
    </td>
  </tr>
</template>
