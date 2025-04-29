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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import api from '@/api'

const userId = localStorage.getItem('userId') || ''
const {data : transactions, isLoading, isError} = api.transactions.getById.useQuery(userId);
</script>

<template>
  <Card class="bg-sw border-pri/10 text-pri shadow-lg shadow-pri/40 w-full max-h-[450px] overflow-y-auto overflow-x-auto">
    <CardHeader>
      <CardTitle class="text-2xl font-bold text-pri montserrat">Transaction History</CardTitle>
      <CardDescription class="text-pri/70 crimson-pro">A list of your recent ATM transactions.</CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="isLoading" class="text-center text-pri/70">Loading transactions...</div>
      <div v-else-if="isError" class="text-center text-red-500">Failed to load transactions.</div>
      <Table v-else>
        <TableCaption class="text-pri/60 crimson-pro">All transactions made through ATM.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[100px] montserrat text-pri/90">Transaction ID</TableHead>
            <TableHead class="montserrat text-pri/90">Type</TableHead>
            <TableHead class="montserrat text-pri/90">Date</TableHead>
            <TableHead class="text-right montserrat text-pri/90">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="transaction in transactions"
            :key="transaction.transactionID"
            class="hover:bg-sec/20 transition"
          >
            <TableCell class="font-medium montserrat">{{ transaction.transactionID }}</TableCell>
            <TableCell class="crimson-pro">{{ transaction.transactionType }}</TableCell>
            <TableCell class="crimson-pro">{{ transaction.transactionDate }}</TableCell>
            <TableCell class="text-right crimson-pro">{{ transaction.amount }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>