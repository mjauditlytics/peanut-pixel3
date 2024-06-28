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
        label: 'Top Sheet Details',
        field: 'title',
        component: 'InputText',
        props: { placeholder: 'Enter review title' },
        questionText: '1. What is the name of the review?'
    },
    {
        label: 'Introduction',
        field: 'client',
        component: 'InputText',
        props: { placeholder: 'Enter client name' },
        questionText: '2. What is the name of your client?'
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
        },
        questionText: '4. What is the period under review?'
    },
    {
        label: 'Staff',
        field: 'staff',
        component: 'InputText',
        props: { placeholder: 'Staff Name' },
        questionText: '5. What is your name?'
    },
    {
        label: 'Role',
        field: 'role',
        component: 'InputText',
        props: { placeholder: 'Role/Designation' },
        questionText: '6. What is your role?'
    },
    {
        label: 'Department',
        field: 'department',
        component: 'InputText',
        props: { placeholder: "Enter your department's name" },
        questionText: '7. What is the name of your department?'
        // component: 'Dropdown',
        // props: {
        //     options: ['Finance', 'IT', 'HR', 'Operations', 'Legal'],
        //     placeholder: 'Select department',
        //     optionLabel: 'name',
        //     optionValue: 'code'
        // }
    },
    {
        label: 'Logo',
        field: 'logo',
        component: 'FileUpload',
        props: {  multiple: "false", maxFileSize: "200", accept:"image/*" , customUpload:1},
        questionText: '8. Please add your logo'
    }
    // <FileUpload name="demo[]" @uploader="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload />

    // {
    //     label: 'Audit Scope',
    //     field: 'scope',
    //     component: 'Textarea',
    //     props: { rows: 4, placeholder: 'Describe the audit scope' }
    // },
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
    <div class="grid">
        <div class="col-12">
            <h2>Report Generation Workflow</h2>

            <Steps :model="steps" :readonly="false" :active="currentStep" @select="onStepClick" />
            <div class="card">
                <h3>{{ currentStepData.label }}</h3>
                <div class="grid">
                    <div class="col-5 flex align-items-center justify-content-center">
                        <div class="p-fluid">
                            <div class="field">
                                <label :for="currentStepData.field" class="mb-4 font-semibold">{{
                                    currentStepData.questionText
                                    }}</label>
                                <component :is="currentStepData.component" v-model="reportData[currentStepData.field]"
                                    v-bind="currentStepData.props" />
                            </div>

                            <div class="navigation-buttons">
                                <Button label="Previous" icon="pi pi-chevron-left"
                                    class="mt-4 col-4 p-button-sm p-button-primary p-button" @click="prevStep"
                                    :disabled="currentStep === 0" />

                                <Button label="Next" icon="pi pi-chevron-right" icon-pos="right"
                                    class="mt-4 col-4 p-button-sm p-button-primary p-button" @click="nextStep"
                                    :disabled="currentStep === steps.length - 1" />
                            </div>
                        </div>
                    </div>

                    <div class="col-2">
                        <Divider layout="vertical">

                        </Divider>
                    </div>
                    <div class="col-5 align-items-center justify-content-center">
                        <LivePreview :reportData="reportData" />
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
:deep(.p-steps) {
    height: 70px;
}

:deep(.p-steps .p-steps-item .p-menuitem-link) {
    flex-direction: column;
}

:deep(.p-steps .p-steps-item .p-steps-number) {
    margin-bottom: 0.5rem;
}

.wizard-container {
    display: flex;
    height: calc(100vh - 300px);
    /* Adjust based on your layout's header/footer */
    overflow: hidden;
}

.wizard-content {
    flex: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.preview-container {
    flex: 1;
    background-color: #f0f0f0;
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.a4-preview {
    width: 100%;
    height: 100%;
    max-width: 21cm;
    max-height: 29.7cm;
    background: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.step-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow-y: auto;
    padding: 1rem;
}

.navigation-buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 1rem;
}

/* Remove or comment out any existing overflow-y: auto; properties */

@media (max-width: 1200px) {
    .wizard-container {
        flex-direction: column;
        height: auto;
        overflow-y: auto;
    }

    .preview-container {
        margin-top: 1rem;
        height: 50vh;
    }

    .a4-preview {
        width: 100%;
        height: 100%;
        max-width: none;
        max-height: none;
    }
}
</style>