// composables/useTheme.ts
import { ref, onMounted } from 'vue'

// Light Dark
const open = ref(false)
const theme = ref('')
const setTheme = (mode: 'light' | 'dark') => {
  theme.value = mode === 'dark' ? 'theme-dark' : ''
  localStorage.setItem('theme', mode) // Save to localstorage
  const root = document.documentElement
  const body = document.body
  if (mode === 'dark') {
    root.classList.add('theme-dark')
    body.classList.add('Blackcontainer')
    body.classList.remove('Whitecontainer')
  } else {
    root.classList.remove('theme-dark')
    body.classList.add('Whitecontainer')
    body.classList.remove('Blackcontainer')
  }
  open.value = false
}

// Check theme on initialization
const checkTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    setTheme(savedTheme as 'light' | 'dark')
  } else {
    setTheme('light') // Default to light theme if none found
  }
}

export function useTheme() {
  onMounted(() => {
    checkTheme()
    open.value = true
  })

  return {
    open,
    theme,
    setTheme,
  }
}
