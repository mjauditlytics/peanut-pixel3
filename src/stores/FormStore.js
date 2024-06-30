import { defineStore } from 'pinia'

export const useFormStore = defineStore('form', {
  state: () => ({
    currentPage : 0,
    pages : [
      {label: 'Top Sheet Details'},
      {label: 'Introduction'},
      {label: 'Details'},
      {label: 'Appendix'}
    ],
    step1Data: {},
    step2Data: {},
    step3Data: {},
    // Add more steps as needed
  }),
  actions: {
    setActivePage(stepNumber) {
      this.currentPage = stepNumber
    },
    updateStep1(data) {
      this.step1Data = { ...this.step1Data, ...data }
    },
    updateStep2(data) {
      this.step2Data = { ...this.step2Data, ...data }
    },
    updateStep3(data) {
      this.step3Data = { ...this.step3Data, ...data }
    },
    // Add more update actions as needed
  },
  getters: {
    getActivePage: (state) => state.currentPage,
    
    allFormData: (state) => {
      return {
        ...state.step1Data,
        ...state.step2Data,
        ...state.step3Data,
        // Combine data from all steps
      }
    }
  }
})