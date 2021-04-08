import { Transaction, TransactionModel } from '@/entities/mongo/Transaction';
import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { NewTransactionInput } from './TransactionInput';

@Resolver()
export class TransactionResolver {
    @Query(() => [Transaction])
    async getTransactions() {
        return await TransactionModel.find();
    }

    @Mutation(() => Transaction)
    async createTransaction(
        @Arg('newTransaction') newTransaction: NewTransactionInput
    ): Promise<Transaction> {
        const transaction = new TransactionModel({ ...newTransaction });
        transaction.save();
        return transaction;
    }
}
