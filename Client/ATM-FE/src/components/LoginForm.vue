<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref, onMounted } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useLoaderStore } from '@/stores/loaderStore'
import { toast } from 'vue-sonner'
import loader2 from '@/stores/loader2.vue'
import api from '@/api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useTheme } from '@/assets/theme'

// Light Dark
const { open, theme, setTheme } = useTheme()

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const loaderStore = useLoaderStore()
const { startLoading, stopLoading, isLoading } = loaderStore

const { mutate: loginUser } = api.login.addLogin.useMutation({
  onMutate: startLoading,
  onSuccess: (data) => {
    console.log(data)
    localStorage.setItem('template-app-token', data.token)
    localStorage.setItem('userId', data.user.userID)
    localStorage.setItem('userName', data.user.userName)
    localStorage.setItem('password', data.user.password)
    localStorage.setItem('Wallet', data.user.wallet.toString())

    toast('Login successful', {
      description: `Welcome , ${data.user.userName}`,
      action: {
        label: 'Undo',
        onClick: () => {
          console.log('Undo login')
        },
      },
    }),
    router.push({
      path: '/',
      replace: true,
    })
  },
  onError: (error) => {
    console.error('Error during login:', error)
    errorMessage.value = 'Username and password are required.'
    username.value = ''
    password.value = ''
  },
  onSettled: stopLoading,
})

const onSubmit = async () => {
  try {
    const userData = <AddLoginType>{
      userName: username.value,
      password: password.value,
    }

    await loginUser(userData)
  } catch (error) {
    console.error(error)
  }
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const showPassword = ref(false)
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class), [theme, 'Whitecontainer', theme === 'theme-dark' ? 'Blackcontainer' : 'Whitecontainer']">
    <Card class="bg-sw border-sha/80 text-pri shadow-xl shadow-sha">
      <CardHeader>
        <CardTitle class="text-2xl tracking-tight font-bold text-pri montserrat">
          Login to your ATM account
        </CardTitle>
        <CardDescription class="text-pri/70 crimson-pro text-md">
          Enter your user name below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="onSubmit">
          <div class="flex flex-col gap-6">
            <div class="grid gap-3">
              <Label htmlFor="username" class="text-pri font-semibold montserrat">User Name</Label>
              <Input
                v-model="username"
                id="username"
                type="text"
                :placeholder="errorMessage ? errorMessage : 'Someone'"
                required
                :class="
                  errorMessage
                    ? 'bg-red-100 text-sw !border-red-500 !border-2 rounded-lg px-4 py-2 pr-10 ring-0 focus:ring-1 focus-visible:ring-0'
                    : 'bg-sw text-txt !border-pri border-2 rounded-lg px-4 py-2 focus-visible:ring-0 ring-0'
                "
              />
            </div>

            <div class="grid gap-3">
              <Label htmlFor="password" class="text-pri montserrat font-semibold">Password</Label>
              <div class="relative">
                <Input
                  v-model="password"
                  :class="
                    errorMessage
                      ? 'bg-red-100 text-sw !border-red-500 !border-2 rounded-lg px-4 py-2 pr-10 ring-0 focus:ring-1 focus-visible:ring-0'
                      : 'bg-sw text-txt !border-pri border-2 rounded-lg px-4 py-2 focus-visible:ring-0 ring-0'
                  "
                  :placeholder="errorMessage ? errorMessage : '*****'"
                  required
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                />
                <button
                  type="button"
                  @click="togglePasswordVisibility"
                  :class="
                    errorMessage
                      ? 'absolute right-2 top-1/2 -translate-y-1/2 text-red-500 focus:outline-none'
                      : 'absolute right-2 top-1/2 -translate-y-1/2 text-pri focus:outline-none'
                  "
                >
                  <!-- Eye and EyeOff components -->
                  <EyeOff v-if="showPassword" :size="20" />
                  <Eye v-else :size="20" />
                </button>
              </div>
            </div>

            <div class="flex flex-col gap-3">
              <Button
                type="submit"
                class="w-full !text-sw font-semibold text-lg crimson-pro bg-pri hover:bg-pri/90"
                :disabled="loaderStore.isLoading"
              >
              <template v-if="loaderStore.isLoading">
                <div class="mx-auto scale-45">
                  <loader2 v-if="true"/>
                </div>
              </template>
              <template v-else>
                Login
              </template>
              </Button>
            </div>
          </div>
          <!-- <div class="mt-4 text-center text-sm text-pri montserrat font-semibold">
            Don't have an account?
            <a href="#" class="underline underline-offset-4">Sign up</a>
          </div> -->
        </form>
      </CardContent>
    </Card>
  </div>
  <!-- Dark Light -->
  <AlertDialog v-model:open="open">
    <AlertDialogTrigger class="hidden">Open</AlertDialogTrigger> <!-- hidden to avoid manual open -->
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle class="montserrat">Choose your preference</AlertDialogTitle>
        <AlertDialogDescription class="crimson-pro font-semibold text-lg">
          Select the appearance that suits you best.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel class="montserrat" @click="setTheme('light')">Light</AlertDialogCancel>
        <AlertDialogAction class="montserrat" @click="setTheme('dark')">Dark</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>