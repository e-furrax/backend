import { registerEnumType } from 'type-graphql';

export enum TransactionStatus {
    CANCELLED = 'CANCELLED',
    REJECTED = 'PAIEMENT_REJECTED',
    PENDING = 'PENDING',
    VALIDATED = 'PAIEMENT_VALIDATED',
}

registerEnumType(TransactionStatus, {
    name: 'TransactionStatus',
    description: 'Basic transaction status',
});
