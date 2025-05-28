<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
    <button
        :disabled="authStore.loading"
        class="btn btn-accent"
        @click="authStore.signIn"
    >
        Start Logging with Github
        <span v-if="authStore.loading" class="loading loading-ring loading-lg" />
        <Icon
            v-else
            name="tabler:brand-github"
            size="24"
        />
    </button>
</template>
