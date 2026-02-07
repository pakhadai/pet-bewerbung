import { useState, useCallback } from 'react';

export interface UsePaymentFlowReturn {
  /** Current donation amount (as string) */
  donationAmount: string;
  /** Set donation amount */
  setDonationAmount: (amount: string) => void;
  /** Whether donation dialog is open */
  donateOpen: boolean;
  /** Set donation dialog state */
  setDonateOpen: (open: boolean) => void;
  /** Whether payment dialog is open */
  paymentOpen: boolean;
  /** Set payment dialog state */
  setPaymentOpen: (open: boolean) => void;
  /** Open donation dialog (optionally with amount) */
  openDonate: (amount?: string | number) => void;
  /** Close donation dialog */
  closeDonate: () => void;
  /** Open payment dialog (closes donation) */
  openPayment: () => void;
  /** Close payment dialog */
  closePayment: () => void;
}

/**
 * Payment flow hook
 * Manages donation and payment dialog state
 *
 * @returns Payment flow state and handlers
 */
export const usePaymentFlow = (): UsePaymentFlowReturn => {
  const [donationAmount, setDonationAmount] = useState<string>('5');
  const [donateOpen, setDonateOpen] = useState<boolean>(false);
  const [paymentOpen, setPaymentOpen] = useState<boolean>(false);

  const openDonate = useCallback((amount?: string | number) => {
    if (amount) setDonationAmount(String(amount));
    setDonateOpen(true);
  }, []);

  const closeDonate = useCallback(() => {
    setDonateOpen(false);
  }, []);

  const openPayment = useCallback(() => {
    setPaymentOpen(true);
    setDonateOpen(false);
  }, []);

  const closePayment = useCallback(() => {
    setPaymentOpen(false);
  }, []);

  return {
    donationAmount,
    setDonationAmount,
    donateOpen,
    setDonateOpen,
    paymentOpen,
    setPaymentOpen,
    openDonate,
    closeDonate,
    openPayment,
    closePayment
  };
};
