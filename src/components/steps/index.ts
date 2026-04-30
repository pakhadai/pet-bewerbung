/**
 * Step Components Index
 *
 * This file exports all step components used in the form wizard.
 *
 * STEP MAPPING (7 steps):
 *
 * | File Name                 | Step # | Description                          |
 * |---------------------------|--------|--------------------------------------|
 * | Step1Details.tsx          | 1      | Owner info + Pet basic info          |
 * | Step2HealthInsurance.tsx  | 2      | Vet, insurance, behavior, references |
 * | Step3Description.tsx      | 3      | Template text generation / description |
 * | Step4Photo.tsx            | 4      | Photo upload with cropping           |
 * | Step5TemplateSelect.tsx   | 5      | Template selection only              |
 * | Step5Preview.tsx          | 6      | Document preview + download          |
 * | Step6ThankYou.tsx         | 7      | Thank you page                       |
 */

export { default as Step1Details } from './Step1Details'
export { default as Step2HealthInsurance } from './Step2HealthInsurance'
export { default as Step3Description } from './Step3Description'
export { default as Step4Photo } from './Step4Photo'
export { default as Step5Preview } from './Step5Preview'
export { default as Step5TemplateSelect } from './Step5TemplateSelect'
export { default as Step6ThankYou } from './Step6ThankYou'
