<script lang="ts" setup>
import type { LngLat } from "maplibre-gl";

import { CENTER_ODESA } from "~/lib/constants";
import { useMapStore } from "~/stores/map";

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
</script>

<template>
    <MglMap
        :map-style="style"
        :center="CENTER_ODESA"
        :zoom="zoom"
    >
        <MglNavigationControl />
        <MglMarker
            v-if="mapStore.addedPoint"
            :coordinates="CENTER_ODESA"
            draggable
            @update:coordinates="updateAddedPoint"
        >
            <template #marker>
                <div
                    class="tooltip tooltip-top hover:cursor-pointer"
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
                    :class="{ 'tooltip-open': mapStore.selectedPoint === point }"
                    @mouseenter="mapStore.selectPointWithoutFlyTo(point)"
                    @mouseleave="mapStore.selectPointWithoutFlyTo(null)"
                >
                    <Icon
                        name="tabler:map-pin-filled"
                        size="30"
                        :class="mapStore.selectedPoint === point ? 'text-accent' : 'text-secondary'"
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
            </MglPopup>
        </MglMarker>
    </MglMap>
</template>
