<script lang="ts" setup>
import type { RouteLocationRaw } from "vue-router";

const props = defineProps<{
    icon: string;
    title: string;
    href?: string;
    to?: RouteLocationRaw;
    showLabel: boolean;
    iconColor?: "text-accent" | "text-primary" | "text-secondary";

}>();

const route = useRoute();
</script>

<template>
    <div
        class="tooltip-right"
        :data-tip="showLabel ? undefined : props.title"
        :class="{ tooltip: !showLabel }"
    >
        <NuxtLink
            :to="props.href || props.to"
            :class="{ 'bg-base-100': route.path === props.href, 'justify-center': !props.showLabel }"
            class="btn justify-start gap-3 cursor-pointer"
        >
            <Icon
                :name="props.icon"
                size="24"
                :class="iconColor"
            />
            <Transition name="grow">
                <span v-if="showLabel" class="truncate">{{ props.title }}</span>
            </Transition>
        </NuxtLink>
    </div>
</template>

<style scoped>
.grow-enter-active {
    animation: grow 0.2s;
}
.grow-leave-active {
    animation: grow 0.2s reverse;
}
@keyframes grow {
    0% {
        transform: scale(0);
    }
    100% {
        transform: scale(1);
    }
}
</style>
