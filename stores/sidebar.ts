import type { RouteLocationRaw } from "vue-router";

import type { MapPoint } from "~/lib/types";

export type SidebarItem = {
    id: number | string;
    title: string;
    icon: string;
    href?: string;
    mapPoint?: MapPoint | null;
    to?: RouteLocationRaw;
};

export const useSidebarStore = defineStore("useSidebarStore", () => {
    const sidebarItems = ref<SidebarItem[]>([]);
    const sidebarTopItems = ref<SidebarItem[]>([]);
    const loading = ref(false);

    return {
        sidebarItems,
        sidebarTopItems,
        loading,
    };
});
