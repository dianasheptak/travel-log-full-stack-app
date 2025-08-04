import { useMap } from "@indoorequal/vue-maplibre-gl";
import { LngLatBounds } from "maplibre-gl";
import { watch } from "vue";

import type { MapPoint } from "~/lib/types";

export const useMapStore = defineStore("useMapStore", () => {
    const mapPoints = ref<MapPoint[]>([]);

    const selectedPoint = ref<MapPoint | null>(null);
    const addedPoint = ref<MapPoint | null>(null);
    const map = useMap();
    let bounds: LngLatBounds | null = null;

    effect(() => {
        const firstPoint = mapPoints.value[0];
        if (!firstPoint) {
            return;
        }
        bounds = mapPoints.value.reduce((bounds, point) => {
            return bounds.extend([point.long, point.lat]);
        }, new LngLatBounds(
            [firstPoint.long, firstPoint.lat],
            [firstPoint.long, firstPoint.lat],
        ));

        map.map?.fitBounds(bounds, {
            padding: 50,
        });
    });

    watch(addedPoint, (newValue, oldValue) => {
        if (newValue && !oldValue) {
            map.map?.flyTo({
                center: [newValue.long, newValue.lat],
                speed: 0.8,
                zoom: 6,
            });
        }
    }, {
        immediate: true,
    });

    return {
        mapPoints,
        selectedPoint,
        addedPoint,
    };
});
