<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
// import LivePreview from "@/components/LivePreview.vue";
import Stage2IntroductionLivePreview from '@/components/Stage2IntroductionLivePreview.vue';
import { useFormStore } from '@/stores/formStore'

const confirm = useConfirm();
const toast = useToast();
const router = useRouter();
const formStore = useFormStore()

const formData = ref({
    exec_summary: '',
    background: '',
  auditPeriod: null,
  objectives: '',
 
})
const submitStep2 = () => {
  formStore.updateStep2(formData.value)
  formStore.setActivePage(formStore.currentPage + 1);
  router.push('/stage3')
}

const gotToZero = () => {
  formStore.updateStep2(formData.value)
  formStore.setActivePage(formStore.currentPage - 1);
  router.push('/new-wizard')
}

</script>
<template>
    <div class="grid">
        <div class="col-12">
            <h2>Report Generation Workflow</h2>

            <Steps :model="formStore.pages" :readonly="false" :activeIndex="formStore.currentPage"  />
            <div class="card">
                <h3>Introduction</h3>
                <div class="grid">
                    <div class="col-5 flex align-items-center justify-content-center">
                        <div class="p-fluid">
                            <div class="field">
                                <label :for="formData.exec_summary" class="mb-4 font-semibold">Executive Summary</label>
                                <Textarea id="exec_summary" v-model="formData.exec_summary" :autoResize="true" rows="3" cols="30"/>
                            </div>
                            <div class="field">
                                <label :for="formData.background" class="mb-4 font-semibold">Background & Context</label>
                                <Textarea id="background" v-model="formData.background" :autoResize="true" rows="3" cols="30"/>
                            </div>
                            <div class="field">
                                <label :for="formData.objectives" class="mb-4 font-semibold">Audit Objectives</label>
                                <Textarea id="objectives" v-model="formData.objectives" :autoResize="true" rows="3" cols="30"/>
                            </div>


                            <div class="navigation-buttons">
                                <Button label="Previous" icon="pi pi-chevron-left"
                                    class="mt-4 col-4 p-button-sm p-button-primary p-button" @click="gotToZero"
                                     />

                                <Button label="Next" icon="pi pi-chevron-right" icon-pos="right"
                                    class="mt-4 col-4 p-button-sm p-button-primary p-button" @click="submitStep2"
                                    />
                            </div>
                        </div>
                    </div>

                    <div class="col-2">
                        <Divider layout="vertical">

                        </Divider>
                    </div>
                    <div class="col-5 align-items-center justify-content-center">
                        <Stage2IntroductionLivePreview :reportData="formData" />
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.navigation-buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 1rem;
}
/* :deep(.p-steps) {
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


*/
/* Remove or comment out any existing overflow-y: auto; properties */

/*
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
}*/
</style>