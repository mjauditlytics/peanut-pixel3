<template>
    <A4PreviewWrapper title="Introduction">
        <div class="grid">
            <div class="col-12">
                <h3 class="text-xl font-bold mb-2 text-primary">Executive Summary</h3>
                <p class="mb-4 line-height-3 font-semibold">{{ data.exec_summary }}</p>
                <!-- {{ data.exec_summary }} -->
            </div>

            <div class="col-12">
                <h3 class="text-xl font-bold mb-2 text-primary">Background</h3>
                <p class="mb-4 line-height-3 font-semibold">{{ data.background }}</p>
            </div>

            <!-- <div class="col-12">
          <h3 class="text-xl font-bold mb-2 text-primary">Objectives</h3>
          <ul class="list-none p-0 m-0">
            <li v-for="(objective, index) in data.objectives" :key="index" class="mb-2">
              <i class="pi pi-check-circle mr-2 text-primary"></i>
              <span>{{ objective }}</span>
            </li>
          </ul>
        </div> -->

            <!-- <div class="col-12">
                <h3 class="text-xl font-bold mb-2 text-primary">Scope</h3>
                <p class="mb-4 line-height-3 font-semibold">{{ data.strengths }}</p>
            </div> -->
        </div>
      <!-- Debugging section -->
      <div class="col-12 mt-4">
        <h4>Preview Data:</h4>
        <pre>{{ JSON.stringify(data, null, 2) }}</pre>
      </div>
    
    </A4PreviewWrapper>


</template>

<script setup>
import { watch } from 'vue';
import A4PreviewWrapper from '@/components/A4PreviewWrapper.vue';


const props = defineProps({
    data: {
        type: Object,
        required: true,
        default: () => ({
            exec_summary: '',
            background: '',
            // objectives: [],
            // scope: ''
        })
    }
});

// Watch for changes in the data prop
// watch(() => props.data, (newVal) => {
//     console.log('Preview data updated:', newVal);
// }, { deep: true });

</script>

<style scoped>
.preview {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.preview-content {
    margin-top: 1rem;
}

.preview-item {
    margin-bottom: 1rem;
}
</style>