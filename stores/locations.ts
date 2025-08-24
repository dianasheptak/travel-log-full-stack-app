import type { SelectLocationWithLogs } from "~/lib/db/schema";
import type { MapPoint } from "~/lib/types";

import { createMapPointFromLocation } from "~/utils/map-points";

import { useMapStore } from "./map";
import { useSidebarStore } from "./sidebar";

const route = useRoute();
const listLocationsInSidebar = new Set(["dashboard", "dashboard-add"]);
const listCurrentLocationInSidebar = new Set(["dashboard-location-slug", "dashboard-location-slug-add", "dashboard-location-slug-edit"]);

export const useLocationsStore = defineStore("useLocationsStore", () => {
    const { data: locations, status: locationsStatus, refresh: refreshLocations } = useFetch("/api/locations", {
        lazy: true,
    });

    const locationUrlWithSlug = computed(() => `/api/locations/${route.params.slug}`);

    const {
        data: currentLocation,
        status: currentLocationStatus,
        error: currentLocationError,
        refresh: refreshCurrentLocation,
    } = useFetch<SelectLocationWithLogs>(locationUrlWithSlug, {
        lazy: true,
        immediate: false,
        watch: false,
    });

    const sidebarStore = useSidebarStore();
    const mapStore = useMapStore();

    effect(() => {
        if (locations.value && listLocationsInSidebar.has(route.name?.toString() || "")) {
            const mapPoints: MapPoint[] = [];
            const sidebarItems: SidebarItem[] = [];

            locations.value.forEach((location) => {
                const mapPoint = createMapPointFromLocation(location);
                sidebarItems.push({
                    id: `location-${location.id}`,
                    title: location.name,
                    icon: "tabler:map-pin-filled",
                    to: { name: "dashboard-location-slug", params: { slug: location.slug } },
                    mapPoint,
                });
                mapPoints.push(mapPoint);
            });
            sidebarStore.loading = false;
            sidebarStore.sidebarItems = sidebarItems;
            mapStore.mapPoints = mapPoints;
        }
        else if (currentLocation.value && listCurrentLocationInSidebar.has(route.name?.toString() || "")) {
            sidebarStore.sidebarItems = [];
            mapStore.mapPoints = [currentLocation.value];
        }
        sidebarStore.loading = locationsStatus.value === "pending";
    });

    return {
        locations,
        locationsStatus,
        refreshLocations,
        currentLocation,
        currentLocationStatus,
        currentLocationError,
        refreshCurrentLocation,
    };
});
