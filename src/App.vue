<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
ModuleRegistry.registerModules([AllCommunityModule])

type IOlympicData = {
  athlete: string
  country: string
  sport: string
}
const columnDefs = ref<ColDef[]>([{ field: 'athlete' }, { field: 'country' }, { field: 'sport' }])
const defaultColDef = ref<ColDef>({
  flex: 1,
})
const pinnedTopRowData = ref<IOlympicData[]>([
  {
    athlete: 'TOP (athlete)',
    country: 'TOP (country)',
    sport: 'TOP (sport)',
  },
  {
    athlete: 'TOP1 (athlete)',
    country: 'TOP2 (country)',
    sport: 'TOP2 (sport)',
  },
])
const pinnedBottomRowData = ref<IOlympicData[]>([
  {
    athlete: 'BOTTOM (athlete)',
    country: 'BOTTOM (country)',
    sport: 'BOTTOM (sport)',
  },
])
const rowData = ref<IOlympicData[] | null>(null)
const gridApi = ref<GridApi | null>(null)

function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api
}
onMounted(() => {
  fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then((resp) => resp.json())
    .then((data: IOlympicData[]) => {
      rowData.value = data
    })
})

onUnmounted(() => {
  gridApi.value = null
})

function clearData() {
  rowData.value = []
}
</script>
<template>
  <div style="height: 500px">
    <ag-grid-vue
      style="width: 100%; height: 100%"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      :pinnedTopRowData="pinnedTopRowData"
      :pinnedBottomRowData="pinnedBottomRowData"
      @grid-ready="onGridReady"
    />
    <button @click="clearData">Clear Data</button>
  </div>
</template>
