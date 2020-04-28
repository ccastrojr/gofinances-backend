import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError("You don't have enough balance");
    }

    let requestCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!requestCategory) {
      requestCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(requestCategory);
    }

    const transaction = await transactionRepository.create({
      title,
      type,
      value,
      category: requestCategory,
    });
    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
