<script lang="ts" setup>
import { useLocationsStore } from "~/stores/locations";
import { useMapStore } from "~/stores/map";
import { createMapPointFromLocation, isPointSelected } from "~/utils/map-points";

const mapStore = useMapStore();
const locationsStore = useLocationsStore();

const { locations, status } = storeToRefs(locationsStore);

onMounted(() => {
    locationsStore.refresh();
});
</script>

<template>
    <div class="p-4 min-h-64">
        <h2 class="text-2xl">
            Locations
        </h2>
        <div v-if="status === 'pending'">
            <span class="loading loading-spinner loading-xl" />
        </div>
        <div v-else-if="locations && locations.length > 0" class="flex flex-nowrap my-4 gap-3 overflow-auto">
            <NuxtLink
                v-for="location in locations"
                :key="location.id"
                :to="{ name: 'dashboard-location-slug', params: { slug: location.slug } }"
                :class="{
                    'border-accent': isPointSelected(location, mapStore.selectedPoint),
                    'border-transparent': !isPointSelected(location, mapStore.selectedPoint),
                }"
                class="card card-compact bg-base-300 border h-40 w-72 mb-4 shrink-0 cursor-pointer"
                @mouseenter="createMapPointFromLocation(location)"
                @mouseleave="mapStore.selectedPoint = null"
            >
                <div class="card-body">
                    <h3 class="text-xl">
                        {{ location.name }}
                    </h3>
                    <p>{{ location.description }}</p>
                </div>
            </NuxtLink>
        </div>
        <div v-else class="flex flex-col gap-2 mt-5">
            <p>
                Add a location to get started!
            </p>
            <NuxtLink to="/dashboard/add" class="btn btn-primary w-40">
                Add Location
                <Icon name="tabler:circle-plus-filled" size="24" />
            </NuxtLink>
        </div>
    </div>
</template>
