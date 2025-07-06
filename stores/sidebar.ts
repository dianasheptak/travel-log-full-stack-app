export type SidebarItem = {
    id: number;
    title: string;
    icon: string;
    href: string;
};

export const useSidebarStore = defineStore("useSidebarStore", () => {
    const sidebarItems = ref<SidebarItem[]>([]);

    return {
        sidebarItems,
    };
});
