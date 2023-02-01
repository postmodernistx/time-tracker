<script setup lang="ts">
/**
 * Button component that displays a tooltip on
 * focus and hover.
 */
const props = defineProps<{
  tooltip?: string;
}>();
</script>

<template>
  <button>
    <slot />
    <span class="tooltip" v-if="tooltip">
      {{ tooltip }}
      <svg
        class="absolute text-black h-2 w-full left-0 rotate-180 -top-2"
        x="0px"
        y="0px"
        viewBox="0 0 255 255"
        xml:space="preserve"
      >
        <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
      </svg>
    </span>
  </button>
</template>

<style lang="scss">
button {
  @apply relative drop-shadow-xl;

  &:focus {
    @apply outline-0 bg-rose-700;
  }

  &:hover,
  &:focus {
    .tooltip {
      @apply opacity-100 visible;
    }
  }
}
.tooltip {
  @apply bg-black px-2 py-1 rounded font-normal inline-block
    invisible opacity-0 transition-opacity
    absolute -bottom-2 translate-y-full -translate-x-1/2 left-1/2 text-xs min-w-max;
}
</style>
