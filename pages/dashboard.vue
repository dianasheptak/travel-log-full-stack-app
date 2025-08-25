<script setup lang="ts">
import AppMap from "~/components/app/map.client.vue";
import SidebarButton from "~/components/sidebar-button.vue";
import { CURRENT_LOCATION_PAGES, LOCATION_PAGES } from "~/lib/constants";
import { useLocationsStore } from "~/stores/locations";
import { useMapStore } from "~/stores/map";
import { useSidebarStore } from "~/stores/sidebar";
import { isPointSelected } from "~/utils/map-points";

const isSidebarOpen = ref(true);
const sidebarStore = useSidebarStore();
const locationsStore = useLocationsStore();
const mapStore = useMapStore();

const { currentLocation, currentLocationStatus } = storeToRefs(locationsStore);
const route = useRoute();

function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
    localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}

onMounted(() => {
    if (route.path !== "/dashboard") {
        locationsStore.refreshLocations();
    }
    isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});

effect(() => {
    if (LOCATION_PAGES.has(route.name?.toString() || "")) {
        sidebarStore.sidebarTopItems = [{
            id: "link-dashboard",
            title: "Locations",
            href: "/dashboard",
            icon: "tabler:map",
        }, {
            id: "link-location-add",
            title: "Add Location",
            href: "/dashboard/add",
            icon: "tabler:circle-plus-filled",
        }];
    }
    else if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
        sidebarStore.sidebarTopItems = [{
            id: "link-dashboard",
            title: "Back to Locations",
            href: "/dashboard",
            icon: "tabler:arrow-left",
        }];

        if (currentLocation.value && currentLocationStatus.value !== "pending") {
            sidebarStore.sidebarTopItems.push({
                id: "link-dashboard",
                title: currentLocation.value.name,
                to: {
                    name: "dashboard-location-slug",
                    params: {
                        slug: route.params.slug,
                    },
                },
                icon: "tabler:map",
            }, {
                id: "link-location-edit",
                title: "Edit Location",
                to: {
                    name: "dashboard-location-slug-edit",
                    params: {
                        slug: route.params.slug,
                    },
                },
                icon: "tabler:map-pin-cog",
            }, {
                id: "link-location-add",
                title: "Add Location Log",
                to: {
                    name: "dashboard-location-slug-add",
                    params: {
                        slug: route.params.slug,
                    },
                },
                icon: "tabler:circle-plus-filled",
            });
        }
    }
});
</script>

<template>
    <div class="flex-1 flex">
        <div class="bg-base-200 transition-all duration-300 shrink-0" :class="{ 'w-72': isSidebarOpen, 'w-16': !isSidebarOpen }">
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
                    v-for="item in sidebarStore.sidebarTopItems"
                    :key="item.id"
                    :icon="item.icon"
                    :title="item.title"
                    :href="item.href"
                    :to="item.to"
                    :show-label="isSidebarOpen"
                />

                <div v-if="sidebarStore.loading || sidebarStore.sidebarItems.length" class="divider" />
                <div v-if="sidebarStore.loading" class="px-4">
                    <div class="skeleton h-4 w-full" />
                </div>

                <div v-if="sidebarStore.sidebarItems.length" class="flex flex-col">
                    <SidebarButton
                        v-for="item in sidebarStore.sidebarItems"
                        :key="item.id"
                        :show-label="isSidebarOpen"
                        :title="item.title"
                        :icon="item.icon"
                        :to="item.to"
                        :icon-color="isPointSelected(item.mapPoint, mapStore.selectedPoint) ? 'text-primary' : undefined"
                        @mouseenter="mapStore.selectedPoint = item.mapPoint ?? null"
                        @mouseleave="mapStore.selectedPoint = null"
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

        <div class="flex-1 overflow-auto bg-base-100">
            <div class="flex size-full" :class="{ 'flex-col': route.path !== '/dashboard/add' }">
                <NuxtPage />
                <AppMap class="flex-1" />
            </div>
        </div>
    </div>
</template>
