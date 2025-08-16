<script lang="ts" setup>
import type { MglEvent } from "@indoorequal/vue-maplibre-gl";
import type { LngLat } from "maplibre-gl";

import { CENTER_ODESA } from "~/lib/constants";
import { useMapStore } from "~/stores/map";
import { isPointSelected } from "~/utils/map-points";

const mapStore = useMapStore();

const colorMode = useColorMode();
const style = computed(() => colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty");
const zoom = 11;

function updateAddedPoint(location: LngLat) {
    if (mapStore.addedPoint) {
        mapStore.addedPoint.long = location.lng;
        mapStore.addedPoint.lat = location.lat;
    }
}

function onDoubleClick(mglEvent: MglEvent<"dblclick">) {
    console.log(mglEvent);
    if (mapStore.addedPoint) {
        mapStore.addedPoint.lat = mglEvent.event.lngLat.lat;
        mapStore.addedPoint.long = mglEvent.event.lngLat.lng;
    }
}
</script>

<template>
    <MglMap
        :map-style="style"
        :center="CENTER_ODESA"
        :zoom="zoom"
        @map:dblclick="onDoubleClick"
    >
        <MglNavigationControl />
        <MglMarker
            v-if="mapStore.addedPoint"
            :coordinates="[mapStore.addedPoint.long, mapStore.addedPoint.lat]"
            draggable
            class-name="z-50"
            @update:coordinates="updateAddedPoint"
        >
            <template #marker>
                <div
                    class="tooltip tooltip-top tooltip-open hover:cursor-pointer"
                    data-tip="Drag to your desired location"
                >
                    <Icon
                        name="tabler:map-pin-filled"
                        size="36"
                        class="text-warning"
                    />
                </div>
            </template>
        </MglMarker>

        <MglMarker
            v-for="point in mapStore.mapPoints"
            :key="point.id"
            :coordinates="[point.long, point.lat]"
        >
            <template #marker>
                <div
                    class="tooltip tooltip-top hover:cursor-pointer"
                    :data-tip="point.name"
                    :class="{ 'tooltip-open': isPointSelected(point, mapStore.selectedPoint) }"
                    @mouseenter="mapStore.selectedPoint = point"
                    @mouseleave="mapStore.selectedPoint = null"
                >
                    <Icon
                        name="tabler:map-pin-filled"
                        size="30"
                        :class="isPointSelected(point, mapStore.selectedPoint) ? 'text-accent' : 'text-secondary'"
                    />
                </div>
            </template>
            <MglPopup>
                <h2 class="text-primary text-sm">
                    {{ point.name }}
                </h2>
                <p v-if="point.description">
                    {{ point.description }}
                </p>
                <div class="flex justify-end mt-4">
                    <NuxtLink
                        v-if="point.to"
                        :to="point.to"
                        class="btn btn-sm btn-outline"
                    >
                        {{ point.toLabel }}
                    </NuxtLink>
                </div>
            </MglPopup>
        </MglMarker>
    </MglMap>
</template>
