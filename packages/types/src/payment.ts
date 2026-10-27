import { PaymentProvider, PaymentStatus, WalletTransactionType, Currency } from './enums';

export interface IPayment {
  id: string;
  bookingId: string;
  provider: PaymentProvider;
  providerTxId?: string | null;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  idempotencyKey: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IWalletTransaction {
  id: string;
  driverId: string;
  type: WalletTransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceId?: string | null;
  description: string;
  createdAt: Date | string;
}

export interface ICreatePaymentSessionDto {
  bookingId: string;
  provider: PaymentProvider;
  idempotencyKey: string;
}
