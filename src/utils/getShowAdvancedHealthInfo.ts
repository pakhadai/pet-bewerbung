import { INITIAL_DATA } from '../constants'
import type { PetData } from '../types/form'

/**
 * Returns whether the advanced health block should be visible
 * (HTML sections + PDF sections) for the given form data.
 *
 * For drafts created before `showAdvancedHealthInfo` existed:
 * - if the flag is present (boolean) -> use it
 * - otherwise -> infer from filled advanced fields and differences from INITIAL_DATA defaults
 */
export function getShowAdvancedHealthInfo(data: Partial<PetData>): boolean {
  if (typeof data.showAdvancedHealthInfo === 'boolean') return data.showAdvancedHealthInfo

  const insuranceProvider = data.insuranceProvider ?? INITIAL_DATA.insuranceProvider
  const chipId = data.chipId ?? INITIAL_DATA.chipId
  const medicalConditions = data.medicalConditions ?? INITIAL_DATA.medicalConditions
  const previousLandlordName = data.previousLandlordName ?? INITIAL_DATA.previousLandlordName
  const emergencyContactName = data.emergencyContactName ?? INITIAL_DATA.emergencyContactName

  const hasAnyAdvancedText =
    !!insuranceProvider ||
    !!chipId ||
    !!medicalConditions ||
    !!previousLandlordName ||
    !!emergencyContactName

  const willingToPayDeposit = data.willingToPayDeposit ?? INITIAL_DATA.willingToPayDeposit
  const noiseLevel = data.noiseLevel ?? INITIAL_DATA.noiseLevel
  const aloneTime = data.aloneTime ?? INITIAL_DATA.aloneTime
  const activeHours = data.activeHours ?? INITIAL_DATA.activeHours
  const isNeutered = data.isNeutered ?? INITIAL_DATA.isNeutered
  const hasVaccination = data.hasVaccination ?? INITIAL_DATA.hasVaccination
  const hasRegistration = data.hasRegistration ?? INITIAL_DATA.hasRegistration
  const behaviorWithChildren = data.behaviorWithChildren ?? INITIAL_DATA.behaviorWithChildren
  const behaviorWithPets = data.behaviorWithPets ?? INITIAL_DATA.behaviorWithPets

  const vetName = data.vetName ?? INITIAL_DATA.vetName
  const vetPhone = data.vetPhone ?? INITIAL_DATA.vetPhone

  const hasCheckboxOrSelectDifferences =
    willingToPayDeposit !== INITIAL_DATA.willingToPayDeposit ||
    noiseLevel !== INITIAL_DATA.noiseLevel ||
    isNeutered !== INITIAL_DATA.isNeutered ||
    hasVaccination !== INITIAL_DATA.hasVaccination ||
    hasRegistration !== INITIAL_DATA.hasRegistration ||
    aloneTime !== INITIAL_DATA.aloneTime ||
    activeHours !== INITIAL_DATA.activeHours ||
    behaviorWithChildren !== INITIAL_DATA.behaviorWithChildren ||
    behaviorWithPets !== INITIAL_DATA.behaviorWithPets ||
    vetName !== INITIAL_DATA.vetName ||
    vetPhone !== INITIAL_DATA.vetPhone

  return hasAnyAdvancedText || hasCheckboxOrSelectDifferences
}
