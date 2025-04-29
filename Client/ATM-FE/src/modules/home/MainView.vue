<script setup lang="ts">
import UserProfileCard from '@/components/UserProfileCard.vue';
import PopularityCard from '@/components/PopularityCard.vue';
import TransactionCard from '@/components/TransactionCard.vue';
</script>

<template>
    <div class="flex flex-col lg:flex-row w-full min-h-screen Whitecontainer p-4 gap-4">
        <!-- User Profile Card -->
        <div class="lg:w-1/3 w-full flex-grow">
            <UserProfileCard class="h-full" />
        </div>

        <!-- Popularity and Transactions Cards -->
        <div class="flex flex-col gap-4 flex-1">
            <PopularityCard class="w-full flex-grow" />
            <TransactionCard class="w-full flex-grow" />
        </div>
    </div>
</template>
