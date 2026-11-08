import crypto from 'node:crypto';

/** How long a reset code is valid. */
export const OTP_TTL_MINUTES = 10;
/** Wrong-code guesses allowed per code before it is burned. */
export const OTP_MAX_ATTEMPTS = 5;
/** Codes that may be requested per account within the window (anti email-bombing). */
export const OTP_MAX_REQUESTS_PER_WINDOW = 3;
export const OTP_REQUEST_WINDOW_MINUTES = 15;
/** Minimum length for a new password set through this flow. */
export const RESET_PASSWORD_MIN = 8;

/** Same wording whether or not the email belongs to a real admin (no account-existence leak). */
export const GENERIC_REQUEST_MESSAGE = 'If an account exists for that email, a reset code has been sent to it.';
export const GENERIC_INVALID_CODE_MESSAGE = 'That code is invalid or has expired. Request a new one.';

/** A 6-digit numeric code, zero-padded. */
export function generateOtp() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
}
