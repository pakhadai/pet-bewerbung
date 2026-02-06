/**
 * Step Components Index
 * 
 * This file exports all step components used in the form wizard.
 * 
 * STEP MAPPING (7 steps):
 * 
 * | File Name                 | Step # | Description                          |
 * |---------------------------|--------|--------------------------------------|
 * | Step1Details.jsx          | 1      | Owner info + Pet basic info          |
 * | Step2HealthInsurance.jsx  | 2      | Vet, insurance, behavior, references |
 * | Step3Description.jsx      | 3      | AI text generation / description     |
 * | Step4Photo.jsx            | 4      | Photo upload with cropping           |
 * | Step5TemplateSelect.jsx   | 5      | Template selection only              |
 * | Step5Preview.jsx          | 6      | Document preview + download          |
 * | Step6ThankYou.jsx         | 7      | Thank you page + donation            |
 * 
 * Note: Step4UploadSelect.jsx is DEPRECATED - kept for reference but not used.
 */

export { default as Step1Details } from './Step1Details';
export { default as Step2HealthInsurance } from './Step2HealthInsurance';
export { default as Step3Description } from './Step3Description';
export { default as Step4Photo } from './Step4Photo';
export { default as Step5TemplateSelect } from './Step5TemplateSelect';
export { default as Step5Preview } from './Step5Preview';
export { default as Step6ThankYou } from './Step6ThankYou';

// DEPRECATED - kept for reference
// export { default as Step4UploadSelect } from './Step4UploadSelect';
