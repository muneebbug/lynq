<template>
  <div>
    <HeroSection />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/home/HeroSection.vue'

// Set up SEO metadata for the homepage
useSeo({
  title: 'Lynq - Shorten, Share, Track',
  description: 'Create shortened links instantly and track their performance with powerful analytics. The modern URL shortener for individuals and teams.',
  type: 'website',
})
</script>
