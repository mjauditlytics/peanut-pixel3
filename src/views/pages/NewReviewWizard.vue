<script setup>
import { ref, reactive, computed } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import LivePreview from "@/components/LivePreview.vue";

const confirm = useConfirm();
const toast = useToast();

// Define the steps and their corresponding fields
const steps = ref([
    { 
        label: 'Review Title', 
        field: 'title',
        component: 'InputText',
        props: { placeholder: 'Enter review title' }
    },
    { 
        label: 'Client Name', 
        field: 'client',
        component: 'InputText',
        props: { placeholder: 'Enter client name' }
    },
    { 
        label: 'Audit Period', 
        field: 'auditPeriod',
        component: 'Calendar',
        props: { 
            selectionMode: 'range', 
            placeholder: 'Select audit period',
            dateFormat: 'dd/mm/yy',
            showIcon: true
        }
    },
    { 
        label: 'Department', 
        field: 'department',
        component: 'Dropdown',
        props: { 
            options: ['Finance', 'IT', 'HR', 'Operations', 'Legal'],
            placeholder: 'Select department',
            optionLabel: 'name',
            optionValue: 'code'
        }
    },
    { 
        label: 'Audit Scope', 
        field: 'scope',
        component: 'Textarea',
        props: { rows: 4, placeholder: 'Describe the audit scope' }
    },
    // Add more steps as needed
]);

const currentStep = ref(0);

// Report data model
const reportData = reactive({
    title: '',
    client: '',
    auditPeriod: null,
    department: null,
    scope: '',
    // Add more fields as needed
});

// Computed property for the current step
const currentStepData = computed(() => steps.value[currentStep.value]);

// Navigation methods
const nextStep = () => {
    if (currentStep.value < steps.value.length - 1) {
        currentStep.value++;
    }
};

const prevStep = () => {
    if (currentStep.value > 0) {
        currentStep.value--;
    }
};

// Method to handle step click in the Steps component
const onStepClick = (event) => {
    currentStep.value = event.index;
};

// Save and exit method
const saveAndExit = () => {
    confirm.require({
        message: 'Are you sure you want to save and exit? You can resume this review later.',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            // Here you would typically save the data to your backend
            toast.add({ severity: 'success', summary: 'Saved', detail: 'Your review has been saved', life: 3000 });
            // Redirect to dashboard or reviews list
        }
    });
};

// Prepare department options
const departmentOptions = ref([
    { name: 'Finance', code: 'FIN' },
    { name: 'IT', code: 'IT' },
    { name: 'HR', code: 'HR' },
    { name: 'Operations', code: 'OPS' },
    { name: 'Legal', code: 'LEG' }
]);

// Update department options in steps
steps.value[3].props.options = departmentOptions.value;
</script>

<template>
    <div class="wizard-container">
        <div class="wizard-content">
            <h2>New Review Wizard</h2>
            <Steps 
                :model="steps" 
                :readonly="false" 
                :active="currentStep"
                @select="onStepClick"
            />
            
            <div class="step-content">
                <h3>{{ currentStepData.label }}</h3>
                <component 
                    :is="currentStepData.component"
                    v-model="reportData[currentStepData.field]"
                    v-bind="currentStepData.props"
                />
            </div>
            
            <div class="navigation-buttons">
                <Button label="Previous" icon="pi pi-chevron-left" @click="prevStep" :disabled="currentStep === 0" />
                <Button label="Save & Exit" icon="pi pi-save" severity="secondary" @click="saveAndExit" />
                <Button label="Next" icon="pi pi-chevron-right" icon-pos="right" @click="nextStep" :disabled="currentStep === steps.length - 1" />
            </div>
        </div>
        
        <div class="preview-container">
            <div class="a4-preview">
                <LivePreview :reportData="reportData" />
            </div>
        </div>
    </div>
</template>


<style scoped>
.wizard-container {
    display: flex;
    height: 100%;
    width: 100%;
    overflow: hidden;
}

.wizard-content {
    flex: 1;
    padding: 1rem;
    margin: 2rem;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
}

h2 {
    margin-top: 2rem;
    margin-bottom: 2rem;
}

.steps-container {
    margin-bottom: 4rem;
}

.step-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    margin: 4rem;
}

.step-content h3 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 1.5rem;
}

.step-content :deep(.p-inputtext) {
    width: 100%;
    max-width: 400px;
    font-size: 1rem;
}

.navigation-buttons {
    display: flex;
    justify-content: space-between;
}

:deep(.p-button) {
    min-width: 120px;
}

:deep(.p-steps) {
    height: 70px; /* Adjust as needed */
}

:deep(.p-steps .p-steps-item .p-menuitem-link) {
    flex-direction: column;
}

:deep(.p-steps .p-steps-item .p-steps-number) {
    margin-bottom: 0.5rem;
}

.navigation-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 2rem;
    padding-bottom: 20%; /* This will position buttons 20% from bottom */
}

.preview-container {
    flex: 1;
    background-color: #f0f0f0;
    padding: 1rem;
    overflow-y: auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.a4-preview {
    width: 21cm;
    height: 29.7cm;
    background: white;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    overflow-y: auto;
}

@media (max-width: 1200px) {
    .wizard-container {
        flex-direction: column;
    }

    .preview-container {
        margin-top: 1rem;
    }

    .a4-preview {
        width: 100%;
        height: auto;
        min-height: 29.7cm;
    }

    .steps-container {
        margin-top: 1rem;
    }

    .navigation-buttons {
        padding-bottom: 1rem;
    }
}
</style>