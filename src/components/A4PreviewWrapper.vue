<template>
    <div class="preview-content p-4">
        <!-- <h2 class="text-xl font-bold mb-4">{{ title }}</h2> -->
        <slot></slot>
    </div>
</template>

<script setup>

defineProps({
    title: {
        type: String,
        required: true
    }
});
</script>

<style scoped>
.preview-content {
    height: 100%;
    overflow-y: auto;
    padding: 1rem;
    color: var(--text-color);
}
</style>