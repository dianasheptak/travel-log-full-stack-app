import { useMap } from "@indoorequal/vue-maplibre-gl";
import { LngLatBounds } from "maplibre-gl";
import { nextTick, watch } from "vue";

import type { MapPoint } from "~/lib/types";

export const useMapStore = defineStore("useMapStore", () => {
    const mapPoints = ref<MapPoint[]>([]);

    const selectedPoint = ref<MapPoint | null>(null);
    const addedPoint = ref<MapPoint & { centerMap?: boolean } | null>(null);
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

    watch(addedPoint, async (newValue, oldValue) => {
        if ((newValue && !oldValue) || newValue?.centerMap) {
            await nextTick();

            if (map.map && map.map.isStyleLoaded()) {
                map.map.flyTo({
                    center: [newValue.long, newValue.lat],
                    speed: 0.8,
                    zoom: 5,
                });
            }
            else {
                map.map?.once("load", () => {
                    map.map?.flyTo({
                        center: [newValue.long, newValue.lat],
                        speed: 0.8,
                        zoom: 2,
                    });
                });
            }
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
