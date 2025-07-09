import { useSidebarStore } from "./sidebar";

export const useLocationsStore = defineStore("useLocationsStore", () => {
    const { data, status, refresh } = useFetch("/api/locations", {
        lazy: true,
    });

    const sidebarStore = useSidebarStore();

    watchEffect(() => {
        if (data.value) {
            sidebarStore.loading = false;
            sidebarStore.sidebarItems = data.value.map(loc => ({
                location: `location-${loc.id}`,
                title: loc.name,
                icon: "tabler:map-pin-filled",
                href: "#",
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
