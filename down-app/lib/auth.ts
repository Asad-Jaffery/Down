// Re-export all auth functions from their respective modules
export * from './otp-verification';
export * from './new-user-check';
export * from './onboarding';
export * from './user-utils';
export * from './logout';

export type { UserMetadata } from './user-utils';
export type { LogoutResult } from './logout';
export type { OTPVerificationResult } from './otp-verification';
export type { UserCheckResult } from './new-user-check';
export type { OnboardingResult } from './onboarding';
