import { getCustomRepository } from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const transactionExists = await transactionRepository.findOne(id);

    if (!transactionExists) {
      throw new AppError('Transaction does not exist.', 400);
    }

    await transactionRepository.remove(transactionExists);
  }
}

export default DeleteTransactionService;
