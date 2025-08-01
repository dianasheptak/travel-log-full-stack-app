import type { MapPoint } from "~/lib/types";

export type SidebarItem = {
    id: number;
    title: string;
    icon: string;
    href: string;
    location?: MapPoint | null;
};

export const useSidebarStore = defineStore("useSidebarStore", () => {
    const sidebarItems = ref<SidebarItem[]>([]);
    const loading = ref(false);

    return {
        sidebarItems,
        loading,
    };
});
