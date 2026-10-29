// One mailbox for every service. Change it here when the address is confirmed.
export const SERVICE_EMAIL = 'support@opslogistice.com';

export const PET_CANCELLATION = {
  fullRefundDays: 14, // more than this many days before pickup: full refund less the fee
  fee: 50,
  partialRefundDays: 7, // between this and fullRefundDays: 50% refund less costs already spent
  refundBusinessDays: 7,
  delayHoursForFullRefund: 4,
} as const;
