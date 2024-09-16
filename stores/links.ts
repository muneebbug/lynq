import type { Tags } from '@prisma/client'
import { defineStore } from 'pinia'
import type { LinksWithTags } from '~/types'

export const useLinksStore = defineStore({
  id: 'linksStore',
  state: () => {
    return {
      links: [] as LinksWithTags[],
      tags: [] as Tags[],
    }
  },
  actions: {
    async getLinks() {
      const { $trpc } = useNuxtApp()
      const data = await $trpc.links.getLinksAndTagsByUser.query()
      this.links = data?.links ?? []
      this.tags = data?.tags ?? []
      return this.links
    },
    async getTags() {
      const { $trpc } = useNuxtApp()
      const data = await $trpc.links.getLinksAndTagsByUser.query()
      this.tags = data?.tags ?? []
      this.links = data?.links ?? []
      return this.tags
    },
  },
})
