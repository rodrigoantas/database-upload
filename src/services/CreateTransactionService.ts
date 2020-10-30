import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category_id,
    created_at,
    updated_at,
  }: Transaction): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError("Your balance can't afford this transaction");
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
      created_at,
      updated_at,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
