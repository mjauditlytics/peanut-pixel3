<script setup>
import { computed } from 'vue';

const props = defineProps(['reportData']);

const formattedAuditPeriod = computed(() => {
    const { auditPeriod } = props.reportData;
    if (auditPeriod && Array.isArray(auditPeriod) && auditPeriod.length === 2) {
        const [start, end] = auditPeriod;
        const formatDate = (date) => {
            if (date) {
                return date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            }
            return null;
        };

        const formattedStart = formatDate(start);
        const formattedEnd = formatDate(end);

        if (formattedStart && formattedEnd) {
            return `${formattedStart} - ${formattedEnd}`;
        } else if (formattedStart) {
            return `${formattedStart} - (End date not set)`;
        } else if (formattedEnd) {
            return `(Start date not set) - ${formattedEnd}`;
        }
    }
    return 'Not specified';
});
</script>

<template>
    <div class="a4-page">
        <div class="report-header">
            <h1>{{ reportData.title || 'Untitled Review' }}</h1>
        </div>
        <div class="report-content">
            <table class="info-table">
                <tr>
                    <th>Client:</th>
                    <td>{{ reportData.client || 'Not specified' }}</td>
                </tr>
                <tr>
                    <th>Audit Period:</th>
                    <td>{{ formattedAuditPeriod }}</td>
                </tr>
                <!-- <tr>
                    <th>Department:</th>
                    <td>{{ reportData.department || 'Not specified' }}</td>
                </tr> -->
            </table>

            <span class="font-semibold">
                <br>{{ reportData.staff || 'Staff not yet defined' }}</br>
                <br>{{ reportData.role || 'Role not yet defined' }}</br>
                <br>{{ reportData.department || 'Department not yet defined' }}</br>
            </span>
            <!-- Add more sections as they are implemented -->
        </div>
    </div>
</template>

<style scoped>
.a4-page {
    padding: 2cm;
    font-family: Arial, sans-serif;
    color: #333;
    line-height: 1.5;
}

.report-header {
    text-align: center;
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