<script setup lang="ts">
import type { NominatimResult } from "~/lib/types";

import AppFormField from "~/components/app/form-field.vue";
import AppPlaceSearch from "~/components/app/place-search.vue";
import { CENTER_ODESA } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";
import { useMapStore } from "~/stores/map";

const props = defineProps<{
    onSubmit: (location: InsertLocation) => Promise<any>;
    loading: boolean;
    submitted: boolean;
    submitErrors: Record<string, string>;
    initialValues?: InsertLocation | null;
}>();

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
    validationSchema: toTypedSchema(InsertLocation),
    initialValues: {
        name: props.initialValues?.name || "",
        description: props.initialValues?.description || "",
        long: props.initialValues?.long || (CENTER_ODESA as [number, number])[0],
        lat: props.initialValues?.lat || (CENTER_ODESA as [number, number])[1],
    },
});

const router = useRouter();
const loading = ref(false);

const mapStore = useMapStore();

const onSubmit = handleSubmit(props.onSubmit);

function formatNumber(value?: number) {
    if (!value) {
        return 0;
    }
    return value.toFixed(4);
}

function searchResultSelected(result: NominatimResult) {
    setFieldValue("name", result.display_name);
    mapStore.addedPoint = {
        long: +result.lon,
        lat: +result.lat,
        description: "",
        name: "Added point",
        id: 1,
        centerMap: true,
    };
}

onMounted(() => {
    mapStore.addedPoint = {
        long: props.initialValues?.long || (CENTER_ODESA as [number, number])[0],
        lat: props.initialValues?.lat || (CENTER_ODESA as [number, number])[1],
        description: "",
        name: "Added point",
        id: 1,
    };
});

effect(() => {
    setErrors(props.submitErrors);
});

effect(() => {
    if (mapStore.addedPoint) {
        setFieldValue("long", mapStore.addedPoint.long);
        setFieldValue("lat", mapStore.addedPoint.lat);
    }
});

onBeforeRouteLeave(() => {
    let confirmed = true;

    if (!props.submitted && meta.value.dirty) {
    // eslint-disable-next-line no-alert
        confirmed = window.confirm("Are you sure you want to leave? All unsaved changes will be lost.");
    }

    if (!confirmed) {
        return false;
    }
    mapStore.addedPoint = null;
    return true;
});
</script>

<template>
    <div>
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

            <p class="text-xs text-gray-400">
                Current coordinates: {{ formatNumber(controlledValues.lat) }}, {{ formatNumber(controlledValues.long) }}
            </p>

            <ul class="list-disc ml-4 text-sm">
                <li>
                    Drag the <Icon name="tabler:map-pin-filled" class="text-primary dark:text-warning" /> marker on the map.
                </li>
                <li>
                    Double click the map.
                </li>
                <li>
                    Search for a location below.
                </li>
            </ul>

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
        <div class="divider" />
        <AppPlaceSearch @result-selected="searchResultSelected" />
    </div>
</template>
