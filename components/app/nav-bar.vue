<script setup>
import ThemeToggle from "~/components/app/theme-toggle.vue";
</script>

<template>
    <div>
        <div class="navbar bg-primary text-primary-content">
            <div class="navbar-start">
                <NuxtLink to="/" class="btn btn-ghost text-xl">
                    Travel Log
                </NuxtLink>
            </div>
            <div class="navbar-end">
                <ThemeToggle class="mx-4" />
                <NuxtLink class="btn">
                    Start Logging with Github
                    <Icon name="tabler:brand-github" size="24" />
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>
