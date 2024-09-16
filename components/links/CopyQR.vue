<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Copy QR Code</DialogTitle>
      <DialogDescription>{{ props.linkInfo.description }}</DialogDescription>
    </DialogHeader>
    <div class="my-3 flex flex-col overflow-hidden items-center justify-center space-y-3">
      <div class="rounded-lg border border-neutral-100 p-2 shadow-md dark:border-neutral-800">
        <!-- <QRCode
            id="qr-code"
            :size="128"
            style="height:auto;"
            value={`https://slug.vercel.app/${linkInfo.slug}`}
            viewBox={`0 0 128 128`}
          /> -->
        <vue-qrcode
          ref="qrcode"
          :value="text"
          class="w-full"
          tag="svg"
          :options="{
            color: {

            },
          }"
          @ready="onReady($event)"
        />
      </div>
      <p class="font-mono font-medium w-full block truncate">
        {{ `/${linkInfo.slug}` }}
      </p>
    </div>
    <DialogFooter>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline">
            <Download :size="14" />
            <span>Download QR</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem @click="() => handleDownloadQRImage('png')">
            Download as PNG
          </DropdownMenuItem>
          <DropdownMenuItem @click="() => handleDownloadQRImage('svg')">
            Download as SVG
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogClose as-child>
        <Button variant="outline">
          Close
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</template>

<script lang="ts" setup>
import { Download } from 'lucide-vue-next'
import type { Links } from '@prisma/client'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface CopyQRProps {
  linkInfo: Links
}
const qrcode = ref<string>('')
const svgElement = ref<Node>()

const props = defineProps<CopyQRProps>()
const text = ref<string>(`http://localhost:3000/${props.linkInfo.slug}`)

const onReady = (_event: SVGSVGElement) => {
  svgElement.value = _event
  qrcode.value = _event.outerHTML
}
const handleDownloadQRImage = (format: 'png' | 'svg') => {
  // the tag is svg so we need to convert it to png
  const svgData = new XMLSerializer().serializeToString(svgElement.value!)
  if (format === 'svg') {
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
    const downloadLink = document.createElement('a')
    downloadLink.download = `${props.linkInfo.slug}.svg`
    downloadLink.href = window.URL.createObjectURL(svgBlob)
    downloadLink.click()
  }
  else if (format === 'png') {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx!.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `${props.linkInfo.slug}_slug_app.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }
}
</script>

<style>

</style>
