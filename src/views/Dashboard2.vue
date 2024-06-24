<script setup>
import { ref, watch, onMounted, onBeforeMount } from 'vue';
import { useLayout } from '@/layout/composables/layout';

const { layoutConfig } = useLayout();

import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';

const toast = useToast();


const reports = ref(null);
const reportDialog = ref(false);
const deleteReportDialog = ref(false);
const deleteReportsDialog = ref(false);
const report = ref({});
const selectedReports = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
    { label: 'Draft', value: 'draft' },
    { label: 'In Progress', value: 'inprogress' },
    { label: 'Completed', value: 'completed' },
    { label: 'In Review', value: 'inreview' }
]);

onBeforeMount(() => {
    initFilters();
});

onMounted(() => {
    // Replace this with your actual data fetching logic
    reports.value = [
        { id: 1, title: 'Q2 Financial Audit', type: 'Strategic', staff: 'Tash', priority: 'High', status: 'In Progress', dueDate: '2024-07-15' },
        { id: 2, title: 'IT Security Assessment', type: 'Compliance', staff: 'Peanut', priority: 'Medium', status: 'Not Yet Started', dueDate: '2024-08-01' },
        { id: 3, title: 'Compliance Review', type: 'Compliance', staff: 'Kezia', priority: 'Low', status: 'Completed', dueDate: '2024-06-30' },
        { id: 4, title: 'Operational Efficiency Audit', type: 'Operational', staff: 'Caleb', priority: 'Low', status: 'Under Review', dueDate: '2024-07-30' },
        { id: 5, title: 'Operational Efficiency Audit', type: 'Operational', staff: 'Achsah', priority: 'Low', status: 'Under Review', dueDate: '2024-07-30' },
    ];
});

const formatDate = (value) => {
    return new Date(value).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const openNew = () => {
    report.value = {};
    submitted.value = false;
    reportDialog.value = true;
};

const hideDialog = () => {
    reportDialog.value = false;
    submitted.value = false;
};

const saveReport = () => {
    submitted.value = true;
    if (report.value.title && report.value.title.trim()) {
        if (report.value.id) {
            reports.value[findIndexById(report.value.id)] = report.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Report Updated', life: 3000 });
        } else {
            report.value.id = createId();
            report.value.status = report.value.status ? report.value.status.value : 'Draft';
            reports.value.push(report.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Report Created', life: 3000 });
        }
        reportDialog.value = false;
        report.value = {};
    }
};

const editReport = (editReport) => {
    report.value = { ...editReport };
    reportDialog.value = true;
};

const confirmDeleteReport = (editReport) => {
    report.value = editReport;
    deleteReportDialog.value = true;
};

const deleteReport = () => {
    reports.value = reports.value.filter((val) => val.id !== report.value.id);
    deleteReportDialog.value = false;
    report.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Report Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < reports.value.length; i++) {
        if (reports.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteReportsDialog.value = true;
};

const deleteSelectedReports = () => {
    reports.value = reports.value.filter((val) => !selectedReports.value.includes(val));
    deleteReportsDialog.value = false;
    selectedReports.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Reports Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const getPrioritySeverity = (priority) => {
    switch (priority.toLowerCase()) {
        case 'low': return 'success';
        case 'medium': return 'warning';
        case 'high': return 'danger';
        default: return 'info';
    }
};

const getStatusSeverity = (status) => {
    switch (status.toLowerCase()) {
        case 'completed': return 'success';
        case 'in progress': return 'info';
        case 'not yet started': return 'warning';
        case 'under review': return 'help';
        default: return 'info';
    }
};

const stats = ref({
    totalReports: 12,
    inProgress: 5,
    completed: 7,
    upcomingDeadlines: 3
});

const recentActivity = ref([
    { action: 'Updated', report: 'Q2 Financial Audit', time: '2 hours ago' },
    { action: 'Created', report: 'New Compliance Review', time: '1 day ago' },
    { action: 'Submitted', report: 'IT Security Assessment', time: '3 days ago' },
]);

let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');

const pieData = ref(null);
const pieOptions = ref(null);

const barData = ref(null);
const barOptions = ref(null);

const setColorOptions = () => {
    documentStyle = getComputedStyle(document.documentElement);
    textColor = documentStyle.getPropertyValue('--text-color');
    textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    surfaceBorder = documentStyle.getPropertyValue('--surface-border');
};

const setCharts = () => {
    pieData.value = {
        labels: ['Completed', 'In Progress', 'Draft', 'In Review'],
        datasets: [
            {
                data: [7, 5, 3, 2],
                backgroundColor: [
                    documentStyle.getPropertyValue('--blue-900'),
                    documentStyle.getPropertyValue('--orange-700'),
                    documentStyle.getPropertyValue('--green-800'),
                    documentStyle.getPropertyValue('--purple-800')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--blue-400'),
                    documentStyle.getPropertyValue('--orange-400'),
                    documentStyle.getPropertyValue('--green-400'),
                    documentStyle.getPropertyValue('--purple-400')
                ]
            }
        ]
    };

    pieOptions.value = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };

    barData.value = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Completed Audits',
                backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                data: [3, 2, 4, 5, 1, 2, 3]
            },
            {
                label: 'Started Audits',
                backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                data: [5, 4, 3, 6, 4, 3, 4]
            }
        ]
    };

    barOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
};

watch(
    layoutConfig.theme,
    () => {
        setColorOptions();
        setCharts();
    },
    { immediate: true }
);

onMounted(() => {
    setCharts();
});

// const getStatusSeverity = (status) => {
//     switch (status) {
//         case 'Completed': return 'success';
//         case 'In Progress': return 'info';
//         case 'Draft': return 'warning';
//         case 'In Review': return 'help';
//         default: return 'info';
//     }
// };

// const editReport = (report) => {
//     console.log('Edit report', report);
// };

// const deleteReport = (report) => {
//     console.log('Delete report', report);
// };

// const createNewReport = () => {
//     console.log('Create new report');
// };

// const scheduleAudit = () => {
//     console.log('Schedule audit');
// };

// const openCollaboration = () => {
//     console.log('Open collaboration');
// };

// const generateAnalytics = () => {
//     console.log('Generate analytics');
// };
</script>

<template>
    <div class="grid">

        <div class="col-12">
            <div class="card">
                <h5>Quick Actions</h5>
                <div class="flex flex-wrap gap-2">
                    <Button label="New Report" icon="pi pi-plus" class="p-button-lg p-button-outlined" @click="createNewReport"></Button>
                    <Button label="Schedule Audit" icon="pi pi-calendar" class="p-button-lg p-button-info p-button-outlined"
                        @click="scheduleAudit"></Button>
                    <Button label="Team Collaboration" icon="pi pi-users" class="p-button-lg p-button-warning p-button-outlined"
                        @click="openCollaboration"></Button>
                    <Button label="Generate Analytics" icon="pi pi-chart-bar" class="p-button-lg p-button-help p-button-outlined"
                        @click="generateAnalytics"></Button>
                </div>
            </div>
        </div>


        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="mr-2 p-button-outlined" severity="success" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" class="p-button-outlined" severity="danger" @click="confirmDeleteSelected"
                                :disabled="!selectedReports || !selectedReports.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import"
                            chooseLabel="Import" class="mr-2 p-button-outlined inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-outlined" severity="info" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable ref="dt" :value="reports" v-model:selection="selectedReports" dataKey="id" :paginator="true"
                    :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} reports">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Reports</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="title" header="Title" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Title</span>
                            {{ slotProps.data.title }}
                        </template>
                    </Column>
                    <Column field="type" header="Type" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Type</span>
                            {{ slotProps.data.type }}
                        </template>
                    </Column>
                    <Column field="staff" header="Staff" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Staff</span>
                            {{ slotProps.data.staff }}
                        </template>
                    </Column>
                    <Column field="priority" header="Priority" :sortable="true"  headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Priority</span>

                            <Tag :value="slotProps.data.priority"
                                :severity="getPrioritySeverity(slotProps.data.priority)" />

                        </template>
                    </Column>
                    <Column field="status" header="Status" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                        </template>
                    </Column>
                    <Column field="dueDate" header="Due Date" :sortable="true"
                        headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Due Date</span>
                            {{ formatDate(slotProps.data.dueDate) }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded
                                @click="editReport(slotProps.data)" />

                            <Button icon="pi  pi-file" class="mr-2" severity="info" rounded
                                @click="editReport(slotProps.data)" />

                            <Button icon="pi pi-trash" severity="warning" rounded
                                @click="confirmDeleteReport(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="reportDialog" :style="{ width: '450px' }" header="Report Details" :modal="true"
                    class="p-fluid">
                    <div class="field">
                        <label for="title">Title</label>
                        <InputText id="title" v-model.trim="report.title" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !report.title }" />
                        <small class="p-invalid" v-if="submitted && !report.title">Title is required.</small>
                    </div>
                    <div class="field">
                        <label for="status">Status</label>
                        <Dropdown id="status" v-model="report.status" :options="statuses" optionLabel="label"
                            placeholder="Select a Status">
                            <template #value="slotProps">
                                <Tag v-if="slotProps.value" :value="slotProps.value.label"
                                    :severity="getStatusSeverity(slotProps.value.label)" />
                                <span v-else>{{ slotProps.placeholder }}</span>
                            </template>
                        </Dropdown>
                    </div>
                    <div class="field">
                        <label for="dueDate">Due Date</label>
                        <Calendar id="dueDate" v-model="report.dueDate" dateFormat="dd/mm/yy" />
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" text @click="saveReport" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteReportDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="report">Are you sure you want to delete <b>{{ report.title }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteReportDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteReport" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteReportsDialog" :style="{ width: '450px' }" header="Confirm"
                    :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>Are you sure you want to delete the selected reports?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteReportsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedReports" />
                    </template>
                </Dialog>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card flex flex-column align-items-center">
                <h5 class="text-left w-full">Report Status Overview</h5>
                <Chart type="pie" :data="pieData" :options="pieOptions"></Chart>
            </div>
        </div>

        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Audit Activity</h5>
                <Chart type="bar" :data="barData" :options="barOptions"></Chart>
            </div>
        </div>

        <div class="col-12 xl:col-6">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-5">
                    <h5>Recent Activity</h5>
                </div>
                <ul class="list-none p-0 m-0">
                    <li v-for="activity in recentActivity" :key="activity.report"
                        class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">{{ activity.action }}</span>
                            <span class="text-600">{{ activity.report }}</span>
                        </div>
                        <div class="mt-2 md:mt-0 flex align-items-center">
                            <span class="text-600 ml-3 font-medium">{{ activity.time }}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>


    </div>
</template>