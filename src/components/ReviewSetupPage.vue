<script setup>

// import { useConfirm } from "primevue/useconfirm";
// import { useToast } from "primevue/usetoast";
// import LivePreview from "@/components/LivePreview.vue";
import TopSheetPreview from '@/views/pages/previews/TopSheetPreview.vue';
import IntroductionPreview from '@/views/pages/previews/IntroductionPreview.vue';
// import FindingsRecommendationsPreview from '@/views/pages/previews/FindingsRecommendationsPreview.vue';

import { ref, computed, markRaw, watch } from 'vue';

// const confirm = useConfirm();
// const toast = useToast();
const steps = ref([
    {
        name: 'Top Sheet',
        previewComponent: markRaw(TopSheetPreview),
        questions: [
            {
                label: 'Top Sheet Details',
                field: 'title',
                component: 'InputText',
                props: { placeholder: 'Enter review title' },
                questionText: '1. What is the name of the review?'
            },
            {
                label: 'Client Name',
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

            },

            // {
            //     label: 'Report Date',
            //     field: 'report_date',
            //     component: 'Calendar',
            //     props: { placeholder: "Enter the date of report" },
            //     questionText: '7. What is date of the report?'

            // },    
            {
                label: 'Logo',
                field: 'logo',
                component: 'FileUpload',
                props: { multiple: false, maxFileSize: 200, accept: "image/*"},
                questionText: '8. Please add your logo'
            }
        ],
    },
    {
        name: 'Introduction',
        previewComponent: markRaw(IntroductionPreview),
        questions: [
            {
                label: 'Executive Summary',
                field: 'exec_summary',
                component: 'TextArea',
                props: { placeholder: 'Enter the executive summary', autoResize: "true", rows: "3", cols: "30" },
                questionText: '1. Please enter the Executive summary for this review.'
            },
            {
                label: 'Background & Context',
                field: 'background',
                component: 'TextArea',
                props: { placeholder: 'Enter the background', autoResize: "true", rows: "3", cols: "30" },
                questionText: '2. What is the background of this project?'
            },
            // {
            //     label: 'Audit Objectives',
            //     field: 'objectives',
            //     component: 'TextArea',
            //     props: { placeholder: 'Enter the objective of this audit review', autoResize: "true" },
            //     questionText: '3. What is the objective of this project?'
            // },
            // {
            //     label: 'Summary of Strengths',
            //     field: 'strengths',
            //     component: 'TextArea',
            //     props: { placeholder: 'Enter the summary of strengths', autoResize: "true", rows: "3", cols: "30" },
            //     questionText: '1. Please enter the summary of strengths.'
            // },
            // {
            //     label: 'Summary of Weaknesses',
            //     field: 'weaknesses',
            //     component: 'TextArea',                
            //     props: { placeholder: 'Enter the summary of weaknesses', autoResize:"true", rows:"3", cols:"30"},
            //     questionText: '1. Please enter the summary of weaknesses.'
            // },    
            // {
            //     label: 'Summary of Recommendations',
            //     field: 'recommendations',
            //     component: 'TextArea',                
            //     props: { placeholder: 'Enter the summary of recommendations', autoResize:"true", rows:"3", cols:"30"},
            //     questionText: '1. Please enter the summary of recommendations.'
            // },                           
        ],
    },

    // {
    //     name: 'Appendix',
    //     previewComponent: IntroductionPreview,
    //     questions: [
    //         {
    //             label: 'Methodology',
    //             field: 'methodology',
    //             component: 'TextArea',

    //             props: { placeholder: 'Enter the methodology', autoResize: "true", rows: "3", cols: "30" },
    //             questionText: '1. Please enter the methodologies used for this review.'
    //         }
    //     ]
    // }

    // Add more steps as needed
]);

const currentStepIndex = ref(0);
const currentQuestionIndex = ref(0);

const currentStep = computed(() => steps.value[currentStepIndex.value]);
const currentQuestion = computed(() => currentStep.value.questions[currentQuestionIndex.value]);

const isFirstQuestion = computed(() => currentStepIndex.value === 0 && currentQuestionIndex.value === 0);
const isLastQuestion = computed(() => {
    return currentStepIndex.value === steps.value.length - 1 &&
        currentQuestionIndex.value === currentStep.value.questions.length - 1;
});


const currentAnswer = computed({
    get: () => answers.value[currentStep.value.name][currentQuestion.value.field],
    set: (val) => {
        answers.value[currentStep.value.name][currentQuestion.value.field] = val;
    }
});

function handleDateSelect(event) {
    console.log("In handle date select ", event)
  if (currentStep.value && currentQuestion.value) {
    answers.value[currentStep.value.name][currentQuestion.value.field] = event.value;
  }
}

function updateAnswer(event) {
    currentAnswer.value = event.target.value;    
}

const answers = ref(
    steps.value.reduce((acc, step) => {
        acc[step.name] = step.questions.reduce((qAcc, q) => {
            qAcc[q.field] = '';
            return qAcc;
        }, {});
        return acc;
    }, {})
);

function nextQuestion() {
    if (currentQuestionIndex.value < currentStep.value.questions.length - 1) {
        currentQuestionIndex.value++;
    } else if (currentStepIndex.value < steps.value.length - 1) {
        currentStepIndex.value++;
        currentQuestionIndex.value = 0;
    }
}

function previousQuestion() {
    if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--;
    } else if (currentStepIndex.value > 0) {
        currentStepIndex.value--;
        currentQuestionIndex.value = steps.value[currentStepIndex.value].questions.length - 1;
    }
}


// // Watchers for debugging
// watch(answers, (newVal) => {
//     console.log('Answers updated:', newVal);
// }, { deep: true });

// watch(currentAnswer, (newVal) => {
//     console.log('Current answer updated:', newVal);
// });

</script>
<template>
    <div class="grid">
        <div class="col-12">
            <Steps :model="steps" :readonly="false" />
            <div class="card">
                <h3>{{ currentStep.name }}</h3>
                <div class="grid">
                    <div class="col-5 flex align-items-center justify-content-center">
                        <!-- <h2>{{ currentStep.name }}</h2> -->
                        <div v-if="currentQuestion">

                            <div class="p-fluid">
                                <div class="field">
                                    <label :for="currentQuestion.field" class="mb-4 font-semibold">{{
                                        currentQuestion.questionText
                                        }}</label>
                                        <!-- :value="currentAnswer" -->
                                    <component :is="currentQuestion.component"  
                                     v-model="answers[currentStep.name][currentQuestion.field]"
                                        @input="updateAnswer($event)" v-bind="currentQuestion.props"
                                        @date-select="handleDateSelect" />                          
                                </div>
                            </div>
                            <div class="navigation-buttons">
                                <Button label="Previous" icon="pi pi-chevron-left"
                                    class="mt-4 col-4 p-button-sm p-button-primary p-button" @click="previousQuestion"
                                    :disabled="isFirstQuestion" />
                                <Button label="Next" icon="pi pi-chevron-right"
                                    class="mt-4 col-4 p-button-sm p-button-primary p-button" @click="nextQuestion"
                                    :disabled="isLastQuestion" />

                            </div>
                        </div>


                        <div class="col-2">
                            <Divider layout="vertical" />
                        </div>
                        <div class="col-5 align-items-center justify-content-center">
                            <div class="preview-wrapper surface-card p-4 border-round shadow-2">
                                <component :is="currentStep.previewComponent" :data="answers[currentStep.name]" />
                            </div>
                        </div>


                    </div>


                </div>
            </div>
        </div>

        <!-- Debugging section -->
        <div class="col-12 mt-4">
            <h3>Debugging Info:</h3>
            <pre>{{ JSON.stringify(answers, null, 2) }}</pre>
        </div>

    </div>

</template>

<style scoped>
.questionnaire {
    max-width: 600px;
    margin: 0 auto;
}

.question-container {
    margin: 20px 0;
}


.navigation-buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 1rem;
}



.preview-wrapper {
    width: 21cm;
    height: 29.7cm;
    margin: 0 auto;
    background: var(--surface-card);
    color: var(--text-color);
    position: relative;
    overflow: hidden;
    font-size: 12px;
    line-height: 1.2;
    border: 1px solid var(--surface-border);
}


@media screen and (max-height: 900px) {
    .preview-wrapper {
        height: 21cm;
        width: 14.8cm;
    }
}
</style>