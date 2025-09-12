<script setup lang="ts">
import LocationBaseForm from "@/components/location-base-form.vue";
</script>

<template>
    <LocationBaseForm v-slot="{ errors, loading }">
        <div>
            <AppFormField
                name="name"
                label="Name"
                :error="errors.name"
                :disabled="loading"
            />
            <AppFormField
                name="description"
                label="Description"
                type="textarea"
                :error="errors.description"
                :disabled="loading"
            />
        </div>
    </LocationBaseForm>
</template>

<style scoped>

</style>
