<script setup lang="ts"></script>

<template>
    <div class="spinner"></div>
</template>

<style scoped>
.spinner {
 width: 56px;
 height: 56px;
 display: grid;
 border: 4px solid #0000;
 border-radius: 50%;
 border-right-color: #004dff;
 animation: spinner-a4dj62 1s infinite linear;
}

.spinner::before,
.spinner::after {
 content: "";
 grid-area: 1/1;
 margin: 2px;
 border: inherit;
 border-radius: 50%;
 animation: spinner-a4dj62 2s infinite;
}

.spinner::after {
 margin: 8px;
 animation-duration: 3s;
}

@keyframes spinner-a4dj62 {
 100% {
  transform: rotate(1turn);
 }
}
</style>