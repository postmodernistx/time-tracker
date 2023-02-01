<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import TooltipButton from '@/components/TooltipButton.vue';
import tickSound from '@/assets/tick.mp3';
import dingSound from '@/assets/ding.mp3';
import { useFirestore } from '@/stores/firestore';
import { storeToRefs } from 'pinia';
import TimeEntryLog from '@/components/TimeEntryLog.vue';
import { firebaseTimestampToDate, prettyDate as pd } from '@/helpers/helpers';

const timerActive = ref(false);
const input = ref<HTMLInputElement | null>(null);
const selectedValue = ref('');
const timer = ref(0);
const date = ref<Date | null>(null);
const isPomodoro = ref(false);
const tickingActivated = ref(true);
const audio = ref<HTMLAudioElement | null>(null);
const ding = ref<HTMLAudioElement | null>(null);

const seconds = ref(0);
const minutes = ref(0);
const hours = ref(0);

const prettyDate = ref('');

const firestore = useFirestore();
const { taskList, timeEntries } = storeToRefs(firestore);

function startTimer(minutes: number = 0) {
  confirmTask();

  if (selectedValue.value === '') {
    return;
  }

  timerActive.value = true;

  date.value = new Date();

  if (minutes !== 0) {
    date.value.setMinutes(date.value.getMinutes() + minutes);
    isPomodoro.value = true;
  }

  timer.value = setInterval(tick, 1000);
  tick();
}

function tick() {
  const now = new Date();
  const timeDifference = isPomodoro.value
    ? date.value!.getTime() - now.getTime()
    : now.getTime() - date.value!.getTime();

  if (isPomodoro.value && timeDifference <= 0) {
    stopTimer();
    return;
  }

  hours.value = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
  minutes.value = Math.floor((timeDifference / 1000 / 60) % 60);
  seconds.value = Math.floor((timeDifference / 1000) % 60);

  prettyDate.value = `${String(hours.value).padStart(2, '0')}:${String(minutes.value).padStart(2, '0')}:${String(
    seconds.value
  ).padStart(2, '0')}`;

  document.title = prettyDate.value;

  if (tickingActivated.value && audio.value !== null) {
    audio.value.play();
  }
}

function stopTimer() {
  let mins = 0;
  if (isPomodoro.value) {
    mins = 25; // TODO: Handle prematurely cancelled pomodoro
  } else {
    mins = minutes.value + hours.value * 60;
    mins += seconds.value / 60 >= 0.5 ? 1 : 0;
  }
  firestore.addLogEntry(selectedValue.value, new Date(), mins);

  if (audio.value !== null) {
    audio.value.pause();
  }
  if (ding.value !== null && isPomodoro.value) {
    ding.value.play();
  }
  timerActive.value = false;
  isPomodoro.value = false;
  clearInterval(timer.value);

  prettyDate.value = '00:00:00';
}

function startPomodoro() {
  startTimer(25);
}

function confirmTask() {
  if (timerActive.value) {
    return;
  }
  if (input.value === null) {
    return;
  }
  if (input.value.value === '') {
    return;
  }

  if (taskList.value.indexOf(input.value.value) === -1) {
    taskList.value.push(input.value.value);
  }
  selectedValue.value = input.value.value;
  input.value.value = '';
}

const groupedTimeEntries = computed(() => {
  return timeEntries.value.reduce((acc, currentValue) => {
    acc[currentValue.taskName] = acc[currentValue.taskName] || [];
    acc[currentValue.taskName].push(currentValue);
    return acc;
  }, Object.create(null));
});

const minDate = computed(() => {
  // @ts-ignore
  return Math.min(...timeEntries.value.map(o => o.date.seconds));
});

const maxDate = computed(() => {
  // @ts-ignore
  return Math.max(...timeEntries.value.map(o => o.date.seconds));
});

function clearEntries() {
  firestore.deleteEntries();
}

const dateHeadings = computed(() => {
  const dateStart = firebaseTimestampToDate(minDate.value);
  const dateEnd = firebaseTimestampToDate(maxDate.value);
  const timeDiff = dateEnd.getTime() - dateStart.getTime();
  const daysBetween = Math.ceil(timeDiff / (1000 * 3600 * 24));
  let arr = [];
  for (let i = 0; i <= daysBetween; i++) {
    arr.push(pd(dateStart));
    dateStart.setDate(dateStart.getDate() + 1);
  }
  return arr;
});

function getWeekdayName(date: Date | string) {
  return new Intl.DateTimeFormat(navigator.languages[0], { weekday: 'short' }).format(new Date(date));
}

onMounted(() => {
  document.title = 'Time Tracker';
});

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<template>
  <div class="my-8">
    <div class="p-4 mx-auto max-w-5xl grid grid-cols-5 items-center border border-zinc-700">
      <div>
        <label>
          <input type="checkbox" v-model="tickingActivated" />
          Tick
        </label>
      </div>
      <div class="col-span-2 flex gap-2 items-center">
        <select class="p-2" v-model="selectedValue" :disabled="timerActive">
          <option v-for="(option, index) in taskList" :key="`option-${index}`" :value="option">
            {{ option }}
          </option>
        </select>
        <input
          type="text"
          class="p-2"
          ref="input"
          placeholder="New task"
          @keydown.enter="confirmTask"
          @keydown.tab="confirmTask"
          :disabled="timerActive"
        />
      </div>
      <div>
        {{ prettyDate }}
      </div>
      <div class="text-right">
        <template v-if="!timerActive">
          <TooltipButton @click="startPomodoro" :tooltip="'Start 25 min pomodoro'">
            <span class="material-symbols-outlined">timelapse</span>
          </TooltipButton>

          <TooltipButton @click="startTimer(0)" :tooltip="'Start timer'">
            <span class="material-symbols-outlined">alarm_on</span>
          </TooltipButton>
        </template>

        <TooltipButton v-if="timerActive" @click="stopTimer" class="cancel" :tooltip="'Stop timer'">
          <span class="material-symbols-outlined">alarm_off</span>
        </TooltipButton>
      </div>
    </div>

    <div class="max-w-5xl mx-auto">
      <table class="my-8 w-full">
        <tr>
          <th>&nbsp;</th>
          <th v-for="date in dateHeadings" :key="date">{{ getWeekdayName(date) }} {{ date }}</th>
        </tr>
        <template v-for="(entry, index) in groupedTimeEntries" :key="`data-${index}`">
          <TimeEntryLog :max-date="maxDate" :min-date="minDate" :name="index" :data="entry" />
        </template>
      </table>
    </div>

    <div class="text-center mt-24" v-if="timeEntries.length > 0">
      <TooltipButton :tooltip="'Start new week'" @click="clearEntries">
        <span class="flex gap-2 items-center">
          <span>Delete entries</span>
          <span class="material-symbols-outlined">recycling</span>
        </span>
      </TooltipButton>
    </div>

    <audio :src="tickSound" ref="audio" loop></audio>
    <audio :src="dingSound" ref="ding"></audio>
  </div>
</template>

<style scoped lang="scss">
:deep(tr) {
  @apply border-b border-b-zinc-800;
}
:deep(td),
:deep(th) {
  @apply px-4 py-1;
}

:deep(th:nth-of-type(2n)),
:deep(td:nth-of-type(2n)) {
  @apply bg-zinc-900;
}
</style>
