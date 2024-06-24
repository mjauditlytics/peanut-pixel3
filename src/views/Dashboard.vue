<script setup>
import { ref } from 'vue';

const welcomeVideo = ref('https://example.com/welcome-video');
const templates = ref([
    { name: 'Financial Audit', icon: 'pi pi-money-bill' },
    { name: 'Compliance Audit', icon: 'pi pi-check-square' },
    { name: 'Operational Audit', icon: 'pi pi-cog' },
    { name: 'IT Audit', icon: 'pi pi-desktop' }
]);
const tips = ref([
    'Start with a clear audit objective',
    'Organize your findings effectively',
    'Use data visualization for complex information',
    'Always provide actionable recommendations'
]);

const onboardingSteps = ref([
    { label: 'Create account', completed: true },
    { label: 'Watch tutorial', completed: false },
    { label: 'Create first report', completed: false },
    { label: 'Invite team members', completed: false }
]);

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h2>Welcome to AuditPro!</h2>
                <p>Let's get started with your first audit report.</p>
            </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
            <div class="card">
                <h3>Quick Start Guide</h3>
                <ol>
                    <li>Watch the tutorial video</li>
                    <li>Choose a report template</li>
                    <li>Fill in your audit details</li>
                    <li>Generate your first report</li>
                </ol>
            </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
            <div class="card">
                <h3>Video Tutorial</h3>
                <video controls :src="welcomeVideo" style="width: 100%;">
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
            <div class="card">
                <h3>Report Templates</h3>
                <ul class="list-none p-0 m-0">
                    <li v-for="template in templates" :key="template.name" class="flex align-items-center mb-3">
                        <i :class="template.icon" style="font-size: 2rem; margin-right: 0.5rem;"></i>
                        <span>{{ template.name }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
            <div class="card">
                <h3>Audit Tips</h3>
                <ul>
                    <li v-for="(tip, index) in tips" :key="index">{{ tip }}</li>
                </ul>
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                <h3>Your Progress</h3>
                <ul class="list-none p-0 m-0">
                    <li v-for="step in onboardingSteps" :key="step.label" class="flex align-items-center mb-3">
                        <i :class="step.completed ? 'pi pi-check-circle text-green-500' : 'pi pi-circle-on text-gray-500'" style="font-size: 1.5rem; margin-right: 0.5rem;"></i>
                        <span>{{ step.label }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                <h3>Ready to start?</h3>
                <Button label="Create Your First Report" icon="pi pi-plus" class="p-button-lg" />
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                <h3>Need Help?</h3>
                <div class="flex flex-wrap">
                    <Button label="Documentation" icon="pi pi-book" class="p-button-secondary mr-2 mb-2" />
                    <Button label="FAQs" icon="pi pi-question-circle" class="p-button-secondary mr-2 mb-2" />
                    <Button label="Contact Support" icon="pi pi-envelope" class="p-button-secondary mr-2 mb-2" />
                </div>
            </div>
        </div>
    </div>
</template>