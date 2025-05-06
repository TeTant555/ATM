<script setup lang="ts">
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

const userId = localStorage.getItem('userId') || ''
const { data: transactions, isLoading, isError } = api.transactions.getById.useQuery(userId)

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
      <!-- <Table>
        
      </Table> -->
    </CardHeader>

    <CardContent class="max-h-[450px] overflow-y-auto overflow-x-auto">
      <div v-if="isLoading" class="text-center text-pri/70 p-3"><loader1 /></div>
      <div v-else-if="isError" class="text-center text-red-500">Failed to load transactions.</div>

      <Table v-else class="min-w-full">
        <TableCaption class="text-pri/60 crimson-pro">All transactions made through ATM.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead class="text-center w-[100px] montserrat text-pri/90 font-semibold">Transaction ID</TableHead>
            <TableHead class="text-center montserrat text-pri/90 font-semibold">Type</TableHead>
            <TableHead class="text-center montserrat text-pri/90 font-semibold">Date</TableHead>
            <TableHead class="text-center montserrat text-pri/90 font-semibold">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="transaction in transactions"
            :key="transaction.transactionID"
            class="hover:bg-sec/20 transition"
          >
            <TableCell class="font-semibold montserrat text-xs text-txt text-center">{{
              maskTransactionID(transaction.transactionID)
            }}</TableCell>
            <TableCell class="crimson-pro text-center text-txt">{{ transaction.transactionType }}</TableCell>
            <TableCell class="crimson-pro text-center text-txt">{{
              formatDate(transaction.transactionDate)
            }}</TableCell>
            <TableCell class="crimson-pro text-center text-txt">{{ transaction.amount }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
