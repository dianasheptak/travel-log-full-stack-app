import { useMapStore } from "./map";
import { useSidebarStore } from "./sidebar";

export const useLocationsStore = defineStore("useLocationsStore", () => {
    const { data, status, refresh } = useFetch("/api/locations", {
        lazy: true,
    });

    const sidebarStore = useSidebarStore();
    const mapStore = useMapStore();

    effect(() => {
        if (data.value) {
            sidebarStore.loading = false;
            sidebarStore.sidebarItems = data.value.map(loc => ({
                location: `location-${loc.id}`,
                title: loc.name,
                icon: "tabler:map-pin-filled",
                href: "#",
            }));
            mapStore.mapPoints = data.value.map(loc => ({
                id: loc.id,
                label: loc.name,
                lat: loc.lat,
                long: loc.long,
            }));
        }
        sidebarStore.loading = status.value === "pending";
    });

    return {
        locations: data,
        status,
        refresh,
    };
});
