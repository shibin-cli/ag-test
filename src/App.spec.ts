import App from './App.vue'
import { afterEach, beforeEach, expect, it, vi, type Mock, describe } from 'vitest'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { nextTick, type ComponentPublicInstance } from 'vue'
let wrapper: VueWrapper<ComponentPublicInstance<typeof App>>
const ensureGridApiHasBeenSet = () =>
  new Promise(function (resolve) {
    ;(function waitForGridReady() {
      // we need to wait for the gridReady event before we can start interacting with the grid
      // in this case we're looking at the api property in our App component,
      // but it could be anything (ie a boolean flag)
      if (wrapper.vm.gridApi) {
        // once our condition has been met we can start the tests
        return resolve(null)
      }

      // not set - wait a bit longer
      setTimeout(waitForGridReady, 10)
    })()
  })
const data = [
  {
    athlete: 'Michael Phelps1',
    age: 23,
    country: 'United States',
    year: 2008,
    date: '24/08/2008',
    sport: 'Swimming',
    gold: 8,
    silver: 0,
    bronze: 0,
    total: 8,
  },
  {
    athlete: 'Michael Phelps2',
    age: 19,
    country: 'United States',
    year: 2004,
    date: '29/08/2004',
    sport: 'Swimming',
    gold: 6,
    silver: 0,
    bronze: 2,
    total: 8,
  },
  {
    athlete: 'Michael Phelps3',
    age: 27,
    country: 'United States',
    year: 2012,
    date: '12/08/2012',
    sport: 'Swimming',
    gold: 4,
    silver: 2,
    bronze: 0,
    total: 6,
  },
  {
    athlete: 'Natalie Coughlin',
    age: 25,
    country: 'United States',
    year: 2008,
    date: '24/08/2008',
    sport: 'Swimming',
    gold: 1,
    silver: 2,
    bronze: 3,
    total: 6,
  },
  {
    athlete: 'Ryan Lochte',
    age: 24,
    country: 'United States',
    year: 2008,
    date: '24/08/2008',
    sport: 'Swimming',
    gold: 2,
    silver: 0,
    bronze: 2,
    total: 4,
  },
  {
    athlete: 'Inge de Bruijn',
    age: 30,
    country: 'Netherlands',
    year: 2004,
    date: '29/08/2004',
    sport: 'Swimming',
    gold: 1,
    silver: 1,
    bronze: 2,
    total: 4,
  },
]
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
const pinnedTopRowData = [
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
]
const pinnedBottomRowData = [
  {
    athlete: 'BOTTOM (athlete)',
    country: 'BOTTOM (country)',
    sport: 'BOTTOM (sport)',
  },
]

describe('App.vue', () => {
  global.fetch = vi.fn()
  ;(global.fetch as unknown as Mock).mockResolvedValue({
    ok: true,
    json: async () => data,
  })
  beforeEach(() => {
    wrapper = mount(App)
  })
  afterEach(() => {
    wrapper.unmount()
    document.body.innerHTML = ''
  })
  it('App.vue 应正确加载并显示', async () => {
    await ensureGridApiHasBeenSet()
    await flushPromises()
    await nextTick()

    const cell = wrapper.findAll('.ag-cell-value')
    //   需要减上面固定行和下面固定行的数量
    expect(cell.length).toBe(
      (data.length + pinnedTopRowData.length + pinnedBottomRowData.length) * 3,
    )
    //   上面固定的一行
    for (let i = 0; i < pinnedTopRowData.length; i++) {
      expect(cell[i * 3].text()).toBe(pinnedTopRowData[i].athlete)
      expect(cell[i * 3 + 1].text()).toBe(pinnedTopRowData[i].country)
      expect(cell[i * 3 + 2].text()).toBe(pinnedTopRowData[i].sport)
    }
    for (
      let i = pinnedTopRowData.length, topLength = pinnedTopRowData.length;
      i < data.length + topLength;
      i++
    ) {
      expect(cell[i * 3].text()).toBe(data[i - topLength].athlete)
      expect(cell[i * 3 + 1].text()).toBe(data[i - topLength].country)
      expect(cell[i * 3 + 2].text()).toBe(data[i - topLength].sport)
    }
    //  底部
    for (let i = 0; i < pinnedBottomRowData.length; i++) {
      expect(cell[cell.length - (i + 1) * 3].text()).toBe(pinnedBottomRowData[i].athlete)
      expect(cell[cell.length - (i + 1) * 3 + 1].text()).toBe(pinnedBottomRowData[i].country)
      expect(cell[cell.length - (i + 1) * 3 + 2].text()).toBe(pinnedBottomRowData[i].sport)
    }
  })
  it('清除数据', async () => {
    await ensureGridApiHasBeenSet()
    await flushPromises()
    await nextTick()
    const clearButton = wrapper.find('button')
    clearButton.trigger('click')
    await flushPromises()
    await nextTick()
    await sleep(0)
    expect(wrapper.findAll('.ag-cell-value').length).toBe(
      (pinnedTopRowData.length + pinnedBottomRowData.length) * 3,
    )
  })
})
