<script setup lang="ts">
import api from '@/api'
import { ref, watch } from 'vue'
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
import { toast } from 'vue-sonner'
import { useQueryClient } from '@tanstack/vue-query'
import loader2 from '@/stores/loader2.vue'

// Error validation 
const errorMessage = ref('')

// Separate dialog states
const isDepositDialogOpen = ref(false)
const isWithdrawDialogOpen = ref(false)

const userId = localStorage.getItem('userId') || ''
const userName = localStorage.getItem('userName')
const Password = localStorage.getItem('password')
// const Wallet = localStorage.getItem('Wallet')
const queryClient = useQueryClient()

const date = new Date()
const formattedDate = date.toLocaleDateString('en-US', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

// Check Balance
const Wallet = ref<number>(0)
const { data: balance } = api.balance.BalanceById.useQuery(userId)
watch(
  () => balance.value,
  (newVal) => {
    if (newVal?.data !== undefined) {
      Wallet.value = newVal.data
    }
  },
  { immediate: true },
)

// Shared form state
const amount = ref<number | undefined>(undefined)
const inputPassword = ref('')
const loaderStore = useLoaderStore()
const { startLoading, stopLoading, isLoading } = loaderStore

// Withdraw API
const { mutate: withdraw } = api.withdraw.Withdraw.useMutation({
  onMutate: startLoading,
  onSuccess: (data) => {
    toast('Withdraw successful', {
      description: `Withdraw successfully from your account`,
      action: {
        label: 'Undo',
        onClick: () => {
          console.log('Undo withdraw')
        },
      },
    }),
      (isWithdrawDialogOpen.value = false)
    console.log('✅ Withdraw Response:', data)
    queryClient.invalidateQueries(
      { queryKey: ['balancetype', userId], exact: false, refetchType: 'active' },
      { throwOnError: false, cancelRefetch: false },
    )
    queryClient.invalidateQueries(
      { queryKey: ['transactions', userId], exact: false, refetchType: 'active' },
      { throwOnError: false, cancelRefetch: false },
    )
    queryClient.invalidateQueries(
      { queryKey: ['incomeoutcome', userId], exact: false, refetchType: 'active' },
      { throwOnError: false, cancelRefetch: false },
    )
  },
  onError: (error) => {
    console.log('🚀 ~ Withdraw error:', error)
    errorMessage.value = 'Username and password are required.'
    inputPassword.value = ''
  },
  onSettled: stopLoading,
})

const onWithdraw = async () => {
  if (!inputPassword.value || inputPassword.value !== Password) {
    errorMessage.value = 'Enter a valid password'
    inputPassword.value = ''
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
    amount: amount.value,
  })
}

// Deposit API
const { mutate: Deposit } = api.deposit.Deposit.useMutation({
  onMutate: startLoading,
  onSuccess: (data) => {
    console.log('check data', amount)
    toast('Deposit successful', {
      description: `Deposit successfully from your account`,
      action: {
        label: 'Undo',
        onClick: () => {
          console.log('Undo Deposit')
        },
      },
    }),
      (isDepositDialogOpen.value = false)
    console.log('✅ Deposit Response:', data)
    queryClient.invalidateQueries(
      { queryKey: ['balancetype', userId], exact: false, refetchType: 'active' },
      { throwOnError: false, cancelRefetch: false },
    )
    queryClient.invalidateQueries(
      { queryKey: ['transactions', userId], exact: false, refetchType: 'active' },
      { throwOnError: false, cancelRefetch: false },
    )
    queryClient.invalidateQueries(
      { queryKey: ['incomeoutcome', userId], exact: false, refetchType: 'active' },
      { throwOnError: false, cancelRefetch: false },
    )
  },
  onError: (error) => {
    console.log('🚀 ~ Deposit error:', error)
    errorMessage.value = 'Username and password are required.'
    inputPassword.value = ''
  },
  onSettled: stopLoading,
})

const onDeposit = async () => {
  if (!inputPassword.value || inputPassword.value !== Password) {
    errorMessage.value = 'Enter a valid password'
    inputPassword.value = ''
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

  Deposit({
    id: userId,
    amount: amount.value,
  })
}

// Income and Outcome
const Income = ref<number | undefined>(0)
const Outcome = ref<number | undefined>(0)
const { data: inout, isError } = api.incomeoutcome.InOutById.useQuery(userId)
console.log('Outcome', inout.value)
watch(
  () => inout.value,
  (newVal) => {
    Income.value = newVal?.income
    Outcome.value = newVal?.outcome
  },
  { immediate: true, deep: false },
)
</script>

<template>
  <!-- <div class="min-w-100"> -->
  <Card class="bg-sw border-pri/10 text-pri shadow-lg shadow-sha h-full flex flex-col items-center justify-center transition-all duration-500 hover:-translate-y-1 hover:shadow-pri/70">
    <CardHeader class="w-full ">
      <CardTitle class="text-2xl font-bold text-pri montserrat">My Card</CardTitle>
      <CardDescription class="text-pri/70 text-lg crimson-pro">
        Overview of your ATM account
      </CardDescription>
    </CardHeader>

    <CardContent class="flex flex-col gap-4 w-full">
      <!-- ATM Wallet UI -->
      <div class="bg-bgu text-sec p-6 rounded-2xl shadow-lg shadow-sha flex flex-col gap-2 mt-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-pri/70">
        <div class="flex items-center gap-2 text-sm font-semibold montserrat">
          <CreditCard :size="23" /> ATM WALLET
        </div>
        <div class="text-lg font-semibold tracking-widest montserrat">{{ userName }}</div>
        <div class="mt-4 flex justify-between items-center text-sm crimson-pro">
          <span>{{ userId }}</span>
          <span>{{ formattedDate }}</span>
        </div>
      </div>

      <!-- Balance -->
      <Card class="bg-gradient-to-l from-blue-100 via-blue-200 to-blue-300 shadow-lg border-none shadow-sha text-blue-950 mt-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-blue-500/70">
        <CardContent class="flex items-center gap-4 p-4">
          <DollarSign :size="50" class="text-blue-950" />
          <div>
            <div class="text-md text-text-blue-950/65 montserrat font-semibold">Balance</div>
            <div class="text-2xl font-bold text-blue-950">$ {{ Wallet }}</div>
          </div>
        </CardContent>
      </Card>

      <!-- Income & Outcome -->
      <div class="flex flex-col sm:flex-row gap-4">
        <Card class="border-none flex-1 bg-gradient-to-l from-green-100 via-green-200 to-green-300 shadow-lg shadow-sha mt-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-green-500/70">
        <CardContent class="flex items-center gap-4 p-4">
          <TrendingUp :size="50" class="text-green-950" />
          <div>
            <div class="text-md text-green-950/65 montserrat font-semibold">Income (This Month)</div>
            <div class="text-2xl font-bold text-green-950">$ {{ Income }}</div>
          </div>
        </CardContent>
      </Card>
        <Card class="border-none flex-1 bg-gradient-to-l from-red-100 via-red-200 to-red-300 shadow-lg shadow-sha mt-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-red-500/70">
          <CardContent class="flex items-center gap-4 p-4">
            <TrendingDown :size="50" class="text-red-950" />
            <div>
              <div class="text-md text-red-950/65 montserrat font-semibold">Outcome (This Month)</div>
              <div class="text-2xl font-bold text-red-950">$ {{ Outcome }}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4 mt-5">
        <!-- Deposit Dialog -->
        <Dialog v-model:open="isDepositDialogOpen">
          <DialogTrigger as-child>
            <Button
              variant="outline"
              class="border-none mt-2 flex-1 crimson-pro text-md bg-pri text-sec shadow-lg hover:bg-pri/90 hover:text-sec"
            >
              Deposit
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[425px] bg-sw text-pri shadow border-none border-sec">
            <DialogHeader>
              <DialogTitle class="text-pri montserrat">Deposit</DialogTitle>
              <DialogDescription class="text-pri crimson-pro">Deposit to your wallet.</DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="amount" class="text-right text-pri montserrat">Amount</Label>
                <Input
                v-model.number="amount"
                id="amount"
                type="number"
                required
                placeholder="Enter amount"
                class="col-span-3 crimson-pro bg-sw text-txt !border-pri border-2 rounded-lg px-4 py-2 focus-visible:ring-0 ring-0 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                @input="(e : any) => { e.target.value = e.target.value.replace(/[^0-9.]/g, '') }"
              />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="password" class="text-right text-pri montserrat">Password</Label>
                <Input
                  v-model="inputPassword"
                  id="password"
                  type="password"
                  required
                  :placeholder="errorMessage ? errorMessage : 'Enter password'"
                  :class="
                  errorMessage
                  ? 'col-span-3 crimson-pro bg-red-100 text-red !border-red-500 !border-2 rounded-lg px-4 py-2 ring-0 focus:ring-1 focus-visible:ring-0 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]'
                  : 'col-span-3 crimson-pro bg-sw text-txt !border-pri border-2 rounded-lg px-4 py-2 focus-visible:ring-0 ring-0 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]'"
                  @input="(e : any) => { e.target.value = e.target.value.replace(/[^0-9.]/g, '') }"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
              type="submit" 
              @click="onDeposit" 
              class="montserrat bg-pri text-sec shadow-lg hover:bg-pri/90 hover:text-sec"
              :disabled="loaderStore.isLoading">
              <template v-if="loaderStore.isLoading">
                <div class="mx-auto scale-45">
                  <loader2 v-if="true"/>
                </div>
              </template>
              <template v-else>
                Save change
              </template>
            </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <!-- Withdraw Dialog -->
        <Dialog v-model:open="isWithdrawDialogOpen">
          <DialogTrigger as-child>
            <Button
              variant="outline"
              class="border-none flex-1 crimson-pro text-md bg-pri text-sec shadow-sha shadow-lg hover:bg-pri/90 hover:text-sec mt-2"
            >
              Withdraw
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[425px] bg-sw text-pri shadow border-none border-sec">
            <DialogHeader>
              <DialogTitle class="text-pri montserrat">Withdraw</DialogTitle>
              <DialogDescription class="text-pri crimson-pro">Withdraw from your wallet.</DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="amount" class="text-right text-pri montserrat">Amount</Label>
                <Input
                  v-model.number="amount"
                  id="amount"
                  type="number"
                  required
                  placeholder="Enter amount"
                  class="col-span-3 crimson-pro bg-sw text-txt !border-pri border-2 rounded-lg px-4 py-2 focus-visible:ring-0 ring-0 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                  @input="(e : any) => { e.target.value = e.target.value.replace(/[^0-9.]/g, '') }"
                />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="password" class="text-right">Password</Label>
                <Input
                  v-model="inputPassword"
                  id="password"
                  type="password"
                  required
                  :placeholder="errorMessage ? errorMessage : 'Enter password'"
                  :class="
                  errorMessage
                  ? 'col-span-3 crimson-pro bg-red-100 text-red !border-red-500 !border-2 rounded-lg px-4 py-2 ring-0 focus:ring-1 focus-visible:ring-0 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]'
                  : 'col-span-3 crimson-pro bg-sw text-txt !border-pri border-2 rounded-lg px-4 py-2 focus-visible:ring-0 ring-0 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]'"
                  @input="(e : any) => { e.target.value = e.target.value.replace(/[^0-9.]/g, '') }"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
              type="submit" 
              @click="onWithdraw" 
              class="montserrat bg-pri text-sec shadow-lg hover:bg-pri/90 hover:text-sec"
              :disabled="loaderStore.isLoading">
              <template v-if="loaderStore.isLoading">
                <div class="mx-auto scale-45">
                  <loader2 v-if="true"/>
                </div>
              </template>
              <template v-else>
                Save change
              </template>
            </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CardContent>
  </Card>
  <!-- </div> -->
</template>
