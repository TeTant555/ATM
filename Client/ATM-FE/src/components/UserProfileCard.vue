<script setup lang="ts">
import api from '@/api'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLoaderStore } from '@/stores/loaderStore'
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from 'lucide-vue-next'

const isDialogOpen = ref(false)

const userId = localStorage.getItem('userId')
const userName = localStorage.getItem('userName')
const Password = localStorage.getItem('password')
const Wallet = localStorage.getItem('Wallet')

const date = new Date()
const formattedDate = date.toLocaleDateString('en-US', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

// Withdraw
const amount = ref<number | undefined>(undefined)
const inputPassword = ref('')
const { startLoading, stopLoading } = useLoaderStore()
const { mutate: withdraw } = api.withdraw.Withdraw.useMutation({
  onMutate: startLoading,
  onSuccess: (data) => {
    isDialogOpen.value = false
    alert(data.message || 'Withdrawal successful') // need to use toast
    console.log('✅ Withdraw Response:', data)
  },
  onError: (error) => {
    console.log("🚀 ~ error:", error)
    alert('An error occurred during withdrawal.') // need to use toast
  },
  onSettled: stopLoading
})

const onWithdraw = async () => {
  if (!inputPassword.value || inputPassword.value !== Password) {
    alert('Incorrect password')
    return
  }
  if (!amount.value || amount.value <= 0) {
    alert('Enter a valid amount')
    return
  }

  if (!userId) {
    alert('User ID not found in localStorage.')
    return
  }

withdraw({
  id: userId,
  amount: amount.value
})
};
</script>

<template>
  <Card class="bg-sw border-pri/10 text-pri shadow-xl shadow-pri/40 h-full flex flex-col">
    <!-- Card Header -->
    <CardHeader>
      <CardTitle class="text-2xl font-bold text-pri montserrat"> My Card </CardTitle>
      <CardDescription class="text-pri/70 text-lg crimson-pro">
        Overview of your ATM account
      </CardDescription>
    </CardHeader>

    <!-- ATM Card UI -->
    <CardContent class="flex flex-col gap-4">
      <div class="bg-pri text-sec p-6 rounded-2xl shadow-lg shadow-sec flex flex-col gap-2 mt-3">
        <div class="flex items-center gap-2 text-sm font-semibold">
          <CreditCard :size="23" /> ATM WALLET
        </div>
        <div class="text-lg font-bold tracking-widest">{{ userName }}</div>
        <div class="mt-4 flex justify-between items-center text-sm">
          <span>{{ userId }}</span>
          <span>{{ formattedDate }}</span>
        </div>
      </div>

      <!-- Financial Summary Cards -->
      <div class="grid grid-cols-1 gap-4">
        <!-- Balance Card -->
        <Card class="bg-sw shadow-lg shadow-sec text-pri mt-3">
          <CardContent class="flex items-center gap-4 p-4">
            <DollarSign :size="50" class="text-pri" />
            <div>
              <div class="text-md text-pri/70">Balance</div>
              <div class="text-2xl font-bold">$ {{ Wallet }}</div>
            </div>
          </CardContent>
        </Card>

        <!-- Income & Outcome Cards Row -->
        <div class="flex flex-col sm:flex-row gap-4">
          <Card class="flex-1 shadow-lg shadow-sec text-pri mt-3">
            <CardContent class="flex items-center gap-4 p-4">
              <TrendingUp :size="50" class="text-green-600" />
              <div>
                <div class="text-md text-pri/70">Income (This Month)</div>
                <div class="text-2xl font-bold text-green-600">$2,300</div>
              </div>
            </CardContent>
          </Card>
          <Card class="flex-1 bg-sw shadow-lg shadow-sec text-pri mt-3">
            <CardContent class="flex items-center gap-4 p-4">
              <TrendingDown :size="50" class="text-red-600" />
              <div>
                <div class="text-md text-pri/70">Outcome (This Month)</div>
                <div class="text-2xl font-bold text-red-600">$1,050</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Action Buttons with dialog -->
      <div class="flex gap-4 mt-4">
        <Dialog class="flex-1">
          <DialogTrigger as-child>
            <Button variant="outline" class="flex-1 hover:text-sec bg-pri text-sec shadow-lg shadow-sec hover:bg-pri/90">Deposit</Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="name" class="text-right"> Name </Label>
                <Input id="name" value="Pedro Duarte" class="col-span-3" />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="username" class="text-right"> Username </Label>
                <Input id="username" value="@peduarte" class="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit"> Save changes </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog v-model:open="isDialogOpen" class="flex-1">
          <DialogTrigger as-child>
            <Button variant="outline" class="flex-1 bg-pri hover:text-sec text-sec shadow-lg shadow-sec hover:bg-pri/90">Withdraw</Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Withdraw</DialogTitle>
              <DialogDescription>
                Withdraw from your wallet. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="amount" class="text-right"> Amount </Label>
                <Input 
                v-model="amount as unknown as string | number" 
                id="amount"
                type="number"
                required 
                placeholder="Enter amount" 
                class="col-span-3" />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="password" class="text-right"> Password </Label>
                <Input
                v-model="inputPassword"
                id="password"
                type="password"
                required
                placeholder="Enter Password" 
                class="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button @click="onWithdraw" type="submit"> Save change </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CardContent>
  </Card>
</template>
