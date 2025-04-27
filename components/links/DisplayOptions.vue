<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
      >
        <LayoutIcon class="mr-2 h-4 w-4" />
        <span>Display</span>
        <ChevronDown class="ml-1 h-4 w-4 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-56 p-3">
      <div class="space-y-3">
        <div class="space-y-1.5">
          <h4 class="font-medium text-sm">
            View Mode
          </h4>
          <div class="grid grid-cols-2 gap-2">
            <Button
              :variant="displayMode === 'cards' ? 'default' : 'outline'"
              class="w-full justify-start"
              @click="setDisplayMode('cards')"
            >
              <LayoutGrid class="mr-2 h-4 w-4" />
              Cards
            </Button>
            <Button
              :variant="displayMode === 'rows' ? 'default' : 'outline'"
              class="w-full justify-start"
              @click="setDisplayMode('rows')"
            >
              <LayoutList class="mr-2 h-4 w-4" />
              Rows
            </Button>
          </div>
        </div>

        <Separator class="my-2" />

        <div class="space-y-1.5">
          <h4 class="font-medium text-sm">
            Ordering
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="outline"
                class="w-full justify-between"
              >
                <div class="flex items-center">
                  <ArrowDownUpIcon class="mr-2 h-4 w-4" />
                  <span>{{ getSortLabel() }}</span>
                </div>
                <ChevronDown class="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-48">
              <DropdownMenuRadioGroup v-model="sortBy">
                <DropdownMenuRadioItem value="created">
                  <div class="flex items-center">
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    <span>Date created</span>
                    <CheckIcon
                      v-if="sortBy === 'created'"
                      class="ml-auto h-4 w-4"
                    />
                  </div>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="clicks">
                  <div class="flex items-center">
                    <MousePointerClickIcon class="mr-2 h-4 w-4" />
                    <span>Total clicks</span>
                    <CheckIcon
                      v-if="sortBy === 'clicks'"
                      class="ml-auto h-4 w-4"
                    />
                  </div>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name">
                  <div class="flex items-center">
                    <TextIcon class="mr-2 h-4 w-4" />
                    <span>Name</span>
                    <CheckIcon
                      v-if="sortBy === 'name'"
                      class="ml-auto h-4 w-4"
                    />
                  </div>
                </DropdownMenuRadioItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="toggleSortOrder">
                  <div class="flex items-center">
                    <component
                      :is="sortOrder === 'asc' ? ArrowUpIcon : ArrowDownIcon"
                      class="mr-2 h-4 w-4"
                    />
                    <span>{{ sortOrder === 'asc' ? 'Ascending' : 'Descending' }}</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import {
  LayoutGrid,
  LayoutList,
  LayoutIcon,
  ChevronDown,
  ArrowDownUpIcon,
  CalendarIcon,
  MousePointerClickIcon,
  TextIcon,
  CheckIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from 'lucide-vue-next'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Props {
  modelValue: {
    displayMode: 'cards' | 'rows'
    sortBy: 'created' | 'clicks' | 'name'
    sortOrder: 'asc' | 'desc'
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: Props['modelValue']]
}>()

const displayMode = computed({
  get: () => props.modelValue.displayMode,
  set: (value) => {
    emit('update:modelValue', {
      ...props.modelValue,
      displayMode: value,
    })
  },
})

const sortBy = computed({
  get: () => props.modelValue.sortBy,
  set: (value) => {
    emit('update:modelValue', {
      ...props.modelValue,
      sortBy: value,
    })
  },
})

const sortOrder = computed({
  get: () => props.modelValue.sortOrder,
  set: (value) => {
    emit('update:modelValue', {
      ...props.modelValue,
      sortOrder: value,
    })
  },
})

const setDisplayMode = (mode: 'cards' | 'rows') => {
  displayMode.value = mode
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

const getSortLabel = () => {
  switch (sortBy.value) {
    case 'created':
      return 'Date created'
    case 'clicks':
      return 'Total clicks'
    case 'name':
      return 'Name'
    default:
      return 'Date created'
  }
}
</script>
