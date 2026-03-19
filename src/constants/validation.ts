/**
 * Shared validation constants - MUST match server/utils/validation.js
 * Prevents frontend/backend desync (e.g. user passes frontend, fails on backend with 400).
 */

export const MIN_PET_NAME_LENGTH = 2;
export const MIN_OWNER_NAME_LENGTH = 2;
