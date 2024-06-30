<script setup>
// import { computed } from 'vue';

const props = defineProps(['reportData']);

</script>

<template>
    <div class="a4-page">
        <div class="report-header">
            <h2 class="font-semibold">Executive Summary</h2>
            {{ reportData.exec_summary || 'Untitled Review' }}
        </div>
        <div class="report-header">
            
            <h2 class="font-semibold">Background</h2>
            {{ reportData.background || 'Untitled Review' }}
        </div>         
    </div>
</template>

<style scoped>
.a4-page {
    padding: 1cm;
    font-family: Arial, sans-serif;
    color: #333;
    line-height: 1.5;
}

.report-header {
    /* text-align: center; */
    margin-bottom: 2cm;
}

h1 {
    color: #2c3e50;
    font-size: 24px;
}

.report-content {
    font-size: 12px;
}

.info-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1cm;
}

.info-table th,
.info-table td {
    border: 1px solid #ddd;
    padding: 8px;
}

.info-table th {
    width: 30%;
    text-align: left;
    background-color: #f2f2f2;
}

h2 {
    color: #2c3e50;
    font-size: 16px;
    margin-top: 1cm;
    margin-bottom: 0.5cm;
}

p {
    margin-bottom: 0.5cm;
}
</style>