<script setup lang="ts">
const { $client } = useNuxtApp()
const { data, error } = await $client.user.ai.useQuery()
</script>

<template>
  <div class="">
    <p v-if="data">
      {{ data.data }}
    </p>
    <NuxtErrorBoundary>
      <div v-if="error">
        {{ error.message }}
        <button @click="clearError({ redirect: '/' })">
          Go back
        </button>
      </div>
    </NuxtErrorBoundary>
  </div>
</template>

<style scoped>

</style>
