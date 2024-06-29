<template>
  <A4PreviewWrapper title="Top Sheet">
    <div class="grid">
      <div class="col-4 font-bold text-primary">Project Name:</div>
      <div class="col-8">{{ data.title }}</div>
      
      <div class="col-4 font-bold text-primary">Client:</div>
      <div class="col-8">{{ data.client }}</div>
      
      <div class="col-4 font-bold text-primary">Date:</div>
      <div class="col-8">{{ formattedAuditPeriod }}</div>

            
      <div class="col-4 font-bold text-primary">Staff:</div>
      <div class="col-8">{{ data.staff }}</div>

      <div class="col-4 font-bold text-primary">Role:</div>
      <div class="col-8">{{ data.role }}</div>

      <div class="col-4 font-bold text-primary">Department:</div>
      <div class="col-8">{{ data.department }}</div>
    </div>
    <div class="date-wrapper">
      <span class="text-sm text-500">{{ data.report_date }}</span>
    </div>
  </A4PreviewWrapper>
</template>

<script setup>
import { computed } from 'vue';
import A4PreviewWrapper from '@/components/A4PreviewWrapper.vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});


const formattedAuditPeriod = computed(() => {
    const { auditPeriod } = props.data;
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

<style scoped>
.date-wrapper {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}
</style>