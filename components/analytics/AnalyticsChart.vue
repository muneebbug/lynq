<script setup lang="ts">
import { Line, Bar } from 'vue-chartjs'
import type {
  ChartOptions,
} from 'chart.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
)

// Props
const props = defineProps<{
  data: Array<{ date: string, count: number }>
  chartType?: 'bar' | 'line'
  height?: number
}>()

// Default values
const chartType = props.chartType || 'bar'
const height = props.height || 300

// Create chart data
const chartData = computed(() => {
  const labels = props.data.map(item => item.date)
  const counts = props.data.map(item => item.count)

  return {
    labels,
    datasets: [
      {
        label: 'Clicks',
        backgroundColor: 'rgba(71, 85, 105, 0.2)',
        borderColor: 'rgb(71, 85, 105)',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: chartType === 'line' ? 2 : 0,
        data: counts,
      },
    ],
  }
})

// Chart options
const chartOptions = computed<ChartOptions<'bar' | 'line'>>(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Only use integers
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: function (tooltipItems) {
            return tooltipItems[0].label
          },
          label: function (context) {
            return `${context.parsed.y} click${context.parsed.y !== 1 ? 's' : ''}`
          },
        },
      },
    },
  }
})
</script>

<template>
  <div :style="{ height: `${height}px` }">
    <Bar
      v-if="chartType === 'bar'"
      :data="chartData"
      :options="chartOptions"
    />
    <Line
      v-else-if="chartType === 'line'"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>
