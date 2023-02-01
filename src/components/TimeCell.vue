<script lang="ts" setup>
/**
 * This component displays the time, rounded to closest half hour.
 * It will also display the total minutes in parentheses after the hour.
 */
import { computed } from 'vue';

const props = defineProps<{
  data: Array<any>;
}>();

const totalMinutes = computed(() =>{
  return props.data.reduce((accumulator, object) => {
    return accumulator + object.minutes;
  }, 0);
});

const hours = computed(() => {
  return Math.floor(totalMinutes.value / 60);
});

const halfHour = computed(() => {
  return (Math.round((totalMinutes.value % 60) / 30) * 30) / 60;
});

const hoursTotal = computed(() => {
  return hours.value + halfHour.value;
});
</script>

<template>
  <div>
    {{ hoursTotal }} h <span class="text-xs">({{ totalMinutes }} min)</span>
  </div>
</template>
