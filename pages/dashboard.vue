<script setup lang="ts">
import SidebarButton from "~/components/sidebar-button.vue";
import { useSidebarStore } from "~/stores/sidebar";

const isSidebarOpen = ref(true);

function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
    localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}

onMounted(() => {
    isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "trueg";
});

const sidebarStore = useSidebarStore();
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

                <div class="divider" />
                <div v-if="sidebarStore.loading" class="skeleton h-4 w-full" />

                <div v-else class="flex flex-col">
                    <SidebarButton
                        v-for="item in sidebarStore.sidebarItems"
                        :key="item.id"
                        :show-label="isSidebarOpen"
                        :title="item.title"
                        :icon="item.icon"
                        :href="item.href"
                    />
                </div>

                <SidebarButton
                    href="/sign-out"
                    icon="tabler:logout-2"
                    title=" Sign Out"
                    :show-label="isSidebarOpen"
                />
            </div>
        </div>
        <div class="flex-1">
            <NuxtPage />
        </div>
    </div>
</template>
