<script lang="ts" setup>
const route = useRoute();
const locationStore = useLocationsStore();
const {
    currentLocation: location,
    currentLocationError: error,
    currentLocationStatus: status,
} = storeToRefs(locationStore);

const isOpen = ref(false);

function openDialog() {
    isOpen.value = true;
    (document.activeElement as HTMLElement).blur();
}

function confirmDeleteLocation() {}

onMounted(() => {
    locationStore.refreshCurrentLocation();
});

onBeforeRouteUpdate((to) => {
    if (to.name === "dashboard-location-slug") {
        locationStore.refreshCurrentLocation();
    }
});
</script>

<template>
    <div class="p-4 min-h-64">
        <div v-if="status === 'pending'">
            <div class="loading" />
        </div>
        <div v-if="error && status !== 'pending'" class="alert alert-error">
            <h2 class="text-lg">
                {{ error.statusMessage }}
            </h2>
        </div>
        <div v-if="route.name === 'dashboard-location-slug' && location && status !== 'pending'">
            <h2 class="text-xl">
                {{ location.name }}
                <div class="dropdown dropdown-bottom">
                    <div
                        tabindex="0"
                        role="button"
                        class="btn btn-sm p-0"
                    >
                        <Icon name="tabler:dots-vertical" size="20" />
                    </div>
                    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-32 p-2 shadow-sm">
                        <li>
                            <NuxtLink
                                :to="{ name: 'dashboard-location-slug-edit', params: { slug: route.params.slug } }"
                                @click="openDialog"
                            >
                                <Icon name="tabler:trash-x-filled" size="20" />
                                Delete
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink>
                                <Icon name="tabler:map-pin-cog" size="20" />
                                Edit
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
            </h2>
            <p class="text-sm">
                {{ location.description }}
            </p>
            <div v-if="!location.locationLogs.length" class="mt-4">
                <p class="text-sm italic">
                    Add a location log to get started.
                </p>
            </div>
            <button class="btn btn-primary mt-2">
                Add Location Log
                <Icon name="tabler:map-pin-plus" size="24" />
            </button>
        </div>
        <div v-if="route.name !== 'dashboard-location-slug'">
            <NuxtPage />
        </div>
        <AppDialog
            title="Are you sure?"
            description="Deleting this location will also delete all of the associated logs. This cannot be undone. Do you really want to do this?"
            :is-open="isOpen"
            confirm-label="Yes, Delete this location!"
            confirm-class="btn-error"
            @on-closed="isOpen = false"
            @on-confirmed="confirmDeleteLocation"
        />
    </div>
</template>
