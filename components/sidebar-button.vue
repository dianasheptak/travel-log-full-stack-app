<script setup>
const props = defineProps({
    icon: String,
    title: String,
    href: String,
    showLabel: Boolean,
});

const route = useRoute();
</script>

<template>
    <div
        class="tooltip-right"
        :data-tip="showLabel ? undefined : props.title"
        :class="{ tooltip: !showLabel }"
    >
        <NuxtLink
            :to="props.href"
            :class="{ 'bg-base-100': route.path === props.href, 'justify-center': !props.showLabel }"
            class="btn justify-start gap-3 cursor-pointer"
        >
            <Icon :name="props.icon" size="24" />
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
