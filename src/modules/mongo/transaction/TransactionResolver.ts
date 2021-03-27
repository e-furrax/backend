import { Transaction, TransactionModel } from '@/entities/mongo/Transaction';
import {
    Resolver,
    Mutation,
    Arg,
    Query,
    UseMiddleware,
    Ctx,
    ObjectType,
    Field,
} from 'type-graphql';
import { TransactionInput } from './TransactionInput';

export class TransactionResolver {
    @Query(() => [Transaction])
    async getTransactions() {
        return await TransactionModel.find();
    }

    @Query(() => Transaction)
    async getTransaction(@Arg('transaction') transaction: TransactionInput) {
        return await TransactionModel.findOne({ ...transaction });
    }
    @Mutation(() => Transaction)
    async createTransaction(
        @Arg('appoinementId') appointmentId: number
    ): Promise<Transaction> {
        const transaction: Transaction = new TransactionModel({
            appointmentId,
        }).save();
        return transaction;
    }
}
