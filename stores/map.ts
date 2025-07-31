import { useMap } from "@indoorequal/vue-maplibre-gl";
import { LngLatBounds } from "maplibre-gl";

import type { MapPoint } from "~/lib/types";

export const useMapStore = defineStore("useMapStore", () => {
    const mapPoints = ref<MapPoint[]>([]);

    const map = useMap();

    effect(() => {
        const firstPoint = mapPoints.value[0];
        if (!firstPoint) {
            return;
        }
        const bounds = mapPoints.value.reduce((bounds, point) => {
            return bounds.extend([point.long, point.lat]);
        }, new LngLatBounds(
            [firstPoint.long, firstPoint.lat],
            [firstPoint.long, firstPoint.lat],
        ));

        map.map?.fitBounds(bounds, {
            padding: 50,
        });
    });

    return {
        mapPoints,
    };
});
