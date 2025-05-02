<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useLoaderStore } from '@/stores/loaderStore'
import { toast } from 'vue-sonner'
import api from '@/api'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const { startLoading, stopLoading } = useLoaderStore()

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
      path: '/main',
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
    startLoading()

    const userData = <AddLoginType>{
      userName: username.value,
      password: password.value,
    }

    await loginUser(userData)
  } catch (error) {
    console.error(error)
  } finally {
    stopLoading()
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
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="bg-sw border-pri/10 text-pri shadow-xl shadow-pri/40">
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
                    ? 'bg-red-100 text-pri !border-red-500 !border-2 rounded-lg px-4 py-2 pr-10 ring-0 focus:ring-1 focus-visible:ring-0'
                    : 'bg-white text-pri !border-pri border-2 rounded-lg px-4 py-2 focus-visible:ring-0 ring-0 focus-visible:bg-blue-50'
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
                      ? 'bg-red-100 text-pri !border-red-500 !border-2 rounded-lg px-4 py-2 pr-10 ring-0 focus:ring-1 focus-visible:ring-0'
                      : 'bg-white text-pri !border-pri border-2 rounded-lg px-4 py-2 focus-visible:ring-0 ring-0 focus-visible:bg-blue-50'
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
                class="w-full bg-pri/90 text-sec font-semibold text-lg hover:bg-pri crimson-pro"
              >
                Login
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
</template>