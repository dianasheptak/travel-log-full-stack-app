<script setup lang="ts">
import type { FetchError } from "ofetch";

import AppFormField from "~/components/app/form-field.vue";
import { CENTER_ODESA } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";
import { useMapStore } from "~/stores/map";

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(InsertLocation),
});

const { $csrfFetch } = useNuxtApp();
const router = useRouter();
const loading = ref(false);
const submitError = ref("");
const submitted = ref(false);

const mapStore = useMapStore();

const onSubmit = handleSubmit(async (values) => {
    try {
        submitError.value = "";
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
            setErrors(error.data);
        }
        submitError.value = error.data?.statusMessage || error.statusMessage || "An unknown error occured.";
    }
    finally {
        loading.value = false;
    }
});

onBeforeRouteLeave(() => {
    let confirmed = true;

    if (!submitted.value && meta.value.dirty) {
        // eslint-disable-next-line no-alert
        confirmed = window.confirm("Are you sure you want to leave? All unsaved changes will be lost.");
    }

    if (!confirmed) {
        return false;
    }
    mapStore.addedPoint = null;
    return true;
});

onMounted(() => {
    mapStore.addedPoint = {
        long: (CENTER_ODESA as [number, number])[0],
        lat: (CENTER_ODESA as [number, number])[1],
        description: "",
        name: "Added point",
        id: 1,
    };
});
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

        <form class="flex flex-col gap-4 mt-4" @submit.prevent="onSubmit">
            <AppFormField
                :disabled="loading"
                name="name"
                label="Name"
                :error="errors.name"
            />

            <AppFormField
                :disabled="loading"
                as="textarea"
                name="description"
                label="Description"
                type="textarea"
                :error="errors.description"
            />

            <fieldset class="fieldset">
                <legend class="fieldset-legend">
                    Latitude
                </legend>
                <Field
                    :disabled="loading"
                    name="lat"
                    type="number"
                    class="input w-full"
                    :class="{ 'input-error': errors.lat }"
                />
                <p v-if="errors.lat" class="fieldset-label text-error">
                    {{ errors.lat }}
                </p>
            </fieldset>

            <fieldset class="fieldset">
                <legend class="fieldset-legend">
                    Longitude
                </legend>
                <Field
                    :disabled="loading"
                    name="long"
                    type="number"
                    class="input w-full"
                    :class="{ 'input-error': errors.long }"
                />
                <p v-if="errors.long" class="fieldset-label text-error">
                    {{ errors.long }}
                </p>
            </fieldset>

            <!--            <AppFormField -->
            <!--                name="lat" -->
            <!--                label="Latitude" -->
            <!--                :error="errors.lat" -->
            <!--            /> -->

            <!--            <AppFormField -->
            <!--                name="long" -->
            <!--                label="Longitude" -->
            <!--                :error="errors.long" -->
            <!--            /> -->

            <div class="flex justify-end gap-2">
                <button
                    :disabled="loading"
                    type="button"
                    class="btn btn-primary"
                    @click="router.back()"
                >
                    <Icon name="tabler:arrow-left" size="24" />
                    cancel
                </button>
                <button
                    :disabled="loading"
                    type="submit"
                    class="btn btn-primary"
                >
                    <span v-if="loading" class="loading loading-spinner loading-sm" />

                    <Icon
                        v-if="!loading"
                        name="tabler:circle-plus-filled"
                        size="24"
                    />
                    add
                </button>
            </div>
        </form>
    </div>
</template>
