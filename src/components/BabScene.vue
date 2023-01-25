<script setup>
import { ref, onMounted } from 'vue'
import { createScene } from '../scenes/x0'

const bcan = ref(null)

onMounted(_ => {
  if (bcan.value) createScene(bcan.value)
})
</script>

<template>
  <section flex justify-center items-center>
    <canvas ref="bcan" w-screen h-screen outline-0></canvas>
  </section>
</template>