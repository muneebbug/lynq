<template>
  <div class="flex flex-1 flex-col gap-4 lg:gap-6 lg:p-6">
    <SettingsGeneral
      v-if="user"
      :user="user"
    />
  </div>
</template>

<script lang="ts" setup>
const user = useAuth().data.value?.user
definePageMeta({
  layout: 'dashboard',
})
</script>

<style>

</style>
