<script setup lang="ts">
import type { FetchError } from "ofetch";

import LocationForm from "~/components/location-form.vue";
import getFetchErrorMessage from "~/utils/get-fetch-error-message";

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
    <div class="container max-w-md mx-auto mt-4 p-4">
        <h1 class="text-lg">
            Add Location
        </h1>
        <p class="text-sm">
            A location is a place you have traveled or will travel to. It can be a city, country, state or point of interest. You can add specific times you visited this location after adding it.
        </p>
        <div v-if="submitError" class="my-4">
            <div role="alert" class="alert alert-error">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span>{{ submitError }}</span>
            </div>
        </div>
        <LocationForm
            :submitted="submitted"
            :loading="loading"
            :on-submit="onSubmit"
            :submit-errors="submitErrors"
        />
    </div>
</template>
