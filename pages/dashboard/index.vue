<script setup lang="ts">
import SidebarButton from "~/components/sidebar-button.vue";

const isSidebarOpen = ref(true);

function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
    localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}

onMounted(() => {
    isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === true;
});
</script>

<template>
    <div class="flex-1 flex">
        <div class="bg-base-200 transition-all duration-300" :class="{ 'w-72': isSidebarOpen, 'w-16': !isSidebarOpen }">
            <div
                class="flex cursor-pointer"
                :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }"
                @click="toggleSidebar"
            >
                <Icon
                    v-if="isSidebarOpen"
                    name="tabler:chevron-left"
                    size="36"
                />
                <Icon
                    v-else
                    name="tabler:chevron-right"
                    size="36"
                />
            </div>
            <div class="flex flex-col gap-3">
                <SidebarButton
                    icon="tabler:map"
                    title="Locations"
                    href="/dashboard"
                    :show-label="isSidebarOpen"
                />
                <SidebarButton
                    icon="tabler:circle-plus-filled"
                    title="Add Location"
                    href="/dashboard/add"
                    :show-label="isSidebarOpen"
                />

                <SidebarButton
                    href="/sign-out"
                    icon="tabler:logout-2"
                    title=" Sign Out"
                    :show-label="isSidebarOpen"
                />
            </div>
        </div>
        <div class="flex-1" />
    </div>
</template>
