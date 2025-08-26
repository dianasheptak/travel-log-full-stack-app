<script setup lang="ts">
import type { FetchError } from "ofetch";

import LocationForm from "~/components/location-form.vue";
import { useLocationsStore } from "~/stores/locations";
import getFetchErrorMessage from "~/utils/get-fetch-error-message";

const locationStore = useLocationsStore();
const { $csrfFetch } = useNuxtApp();
const loading = ref(false);
const submitError = ref("");
const submitErrors = ref({});
const submitted = ref(false);

async function onSubmit(values) {
    try {
        submitError.value = "";
        submitErrors.value = {};
        loading.value = true;
        const inserted = await $csrfFetch("/api/locations", {
            method: "post",
            body: values,
        });

        console.log(inserted);

        submitted.value = true;
        navigateTo("/dashboard");
    }
    catch (e) {
        const error = e as FetchError;
        if (error.data) {
            submitErrors.value = error.data?.data;
        }
        submitError.value = getFetchErrorMessage(error);
    }
    finally {
        loading.value = false;
    }
};
</script>

<template>
    <LocationForm
        :submitted="submitted"
        :loading="loading"
        :on-submit="onSubmit"
        :submit-errors="submitErrors"
        :initial-values="locationStore.currentLocation"
    />
</template>
\
