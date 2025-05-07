<script setup lang="ts">
import type { DropdownMenuCheckboxItemProps } from 'reka-ui'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type {
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import Checkbox from './ui/checkbox/Checkbox.vue'
import { Input } from '@/components/ui/input'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ChevronDown, ChevronsUpDown } from 'lucide-vue-next'
import { h, ref } from 'vue'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import loader1 from '@/stores/loader1.vue'
import api from '@/api'
import { computed, watchEffect } from 'vue'
import type { Column } from '@tanstack/vue-table'
import { Ellipsis } from 'lucide-vue-next'

// API
const userId = localStorage.getItem('userId') || ''
const { data: transactions, isLoading, isError } = api.transactions.getById.useQuery(userId)

// Table Handling (sorting and filtering)
const columnHelper = createColumnHelper<any>()
const columns = [
  columnHelper.accessor('transactionID', {
    header: 'Transaction ID',
    cell: info => h('div', { class: 'text-center font-semibold text-xs text-txt montserrat' }, maskTransactionID(info.getValue())),
  }),
  columnHelper.accessor('transactionType', {
    header: 'Type',
    cell: info => h('div', { class: 'text-center text-txt crimson-pro' }, info.getValue()),
  }),
  columnHelper.accessor('transactionDate', {
    header: 'Date',
    cell: info => h('div', { class: 'text-center text-txt crimson-pro' }, formatDate(info.getValue())),
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: info => h('div', { class: 'text-center text-txt crimson-pro' }, info.getValue()),
  }),
]

// Table state and instance
const table = ref()
// const transactionData = computed(() => transactions.value ?? [])
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})
  watchEffect(() => {
  table.value = useVueTable({
    data: transactions.value || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: updater => (sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater),
    onColumnFiltersChange: updater => (columnFilters.value = typeof updater === 'function' ? updater(columnFilters.value) : updater),
    onColumnVisibilityChange: updater => (columnVisibility.value = typeof updater === 'function' ? updater(columnVisibility.value) : updater),
    state: {
      get sorting() { return sorting.value },
      get columnFilters() { return columnFilters.value },
      get columnVisibility() { return columnVisibility.value },
      get rowSelection() { return rowSelection.value },
      get expanded() { return expanded.value },
    },
  })
})

// Hash transaction
const maskTransactionID = (id: any) => {
  if (!id) return '*****'
  const visible = 4 // Show last 4 characters
  const masked = '*'.repeat(Math.max(0, id.length - visible - 18)) // Show 2 stars, or adjust as needed
  return masked + id.slice(-visible)
}

// Adjust Date
const formatDate = (date: any) => {
  const formattedDate = new Date(date)
  return formattedDate.toISOString().split('T')[0] // Extracts 'YYYY-MM-DD' from the ISO string
}
</script>

<template>
  <Card class="bg-sw border-pri/10 text-pri shadow-lg shadow-sha w-full max-h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-pri/70">
    <CardHeader class="sticky top-0 z-10 bg-sw">
      <CardTitle class="text-2xl font-bold text-pri montserrat">Transaction History</CardTitle>
      <CardDescription class="text-txt/70 crimson-pro">A list of your recent ATM transactions.</CardDescription>
      <div class="w-full">
        <div class="flex items-center py-4">
          <Input
            class="max-w-sm"
            placeholder="Filter by transaction ID..."
            :model-value="table.getColumn('transactionID')?.getFilterValue() as string"
            @update:model-value="table.getColumn('transactionID')?.setFilterValue($event)"
          />

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" class="ml-auto montserrat font-semibold">
                Filter <ChevronDown class="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                v-for="column in table.getAllColumns().filter((col: Column<any, unknown>) => col.getCanHide())"
                :key="column.id"
                class="capitalize montserrat font-semibold"
                :model-value="column.getIsVisible()"
                @update:model-value="value => column.toggleVisibility(!!value)"
              >
                {{ column.id }}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </CardHeader>

    <CardContent class="max-h-[450px] overflow-y-auto overflow-x-auto">
      <div v-if="isLoading" class="text-center text-pri/70 p-3"><loader1 /></div>
      <div v-else-if="isError" class="text-center text-red-500">Failed to load transactions.</div>

      <Table>
        <TableCaption class="text-pri/60 crimson-pro">All transactions made through ATM.</TableCaption>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead class="text-center montserrat text-pri/90 font-semibold" v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <template v-if="table?.getRowModel().rows?.length">
            <TableRow
              v-for="row in table?.getRowModel().rows"
              :key="row.id"
              class="hover:bg-sec/20 transition"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
              <TableCell class="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon">
                      <Ellipsis class="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem>View</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Edit</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Delete</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
            </TableRow>
          </template>
          <TableRow v-else>
            <TableCell :colspan="columns.length" class="text-center py-4 text-pri/50">
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
