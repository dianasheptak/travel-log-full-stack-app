<script setup lang="ts">
import type { InsertLocation } from "~/lib/db/schema";

import LocationBaseForm from "~/components/location-base-form.vue";
import { useLocationsStore } from "~/stores/locations";

const locationStore = useLocationsStore();
const { $csrfFetch } = useNuxtApp();

const route = useRoute();

async function onSubmit(values: InsertLocation) {
    await $csrfFetch(`/api/locations/${route.params.slug}`, {
        method: "put",
        body: values,
    });
}

function onSubmitComplete() {
    navigateTo({
        name: "dashboard-location-slug",
        params: {
            slug: route.params.slug,
        },
    });
}
</script>

<template>
    <LocationBaseForm
        v-if="locationStore.currentLocationStatus !== 'pending'"
        :on-submit="onSubmit"
        :on-submit-complete="onSubmitComplete"
        :initial-values="locationStore.currentLocation"
        submit-label="Update"
        submit-icon="tabler:map-pin-up"
    />
</template>
\
