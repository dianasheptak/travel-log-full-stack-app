<script lang="ts" setup>
import { CENTER_ODESA } from "~/lib/constants";

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
    </MglMap>
</template>
