<template>
  <div>PC home page</div>
</template>

<script setup lang="ts">
import { useMessage } from "naive-ui";
import { onMounted } from "vue";

const message = useMessage();

const warning = () => {
  message.warning("This is a warning message");
};
onMounted(() => {
  warning();
});
</script>

<style></style>
