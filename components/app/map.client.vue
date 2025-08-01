<script lang="ts" setup>
import { CENTER_ODESA } from "~/lib/constants";
import { useMapStore } from "~/stores/map";

const mapStore = useMapStore();

const colorMode = useColorMode();
const style = computed(() => colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty");
const zoom = 11;
</script>

<template>
    <MglMap
        :map-style="style"
        :center="CENTER_ODESA"
        :zoom="zoom"
    >
        <MglNavigationControl />
        <MglMarker
            v-for="point in mapStore.mapPoints"
            :key="point.id"
            :coordinates="[point.long, point.lat]"
        >
            <template #marker>
                <div class="tooltip tooltip-top" :data-tip="point.name">
                    <Icon
                        name="tabler:map-pin-filled"
                        size="30"
                        class="text-primary"
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
