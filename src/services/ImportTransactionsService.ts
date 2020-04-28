import { getCustomRepository, getRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';

import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface CSVData {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    // CSV Read Stream config
    const csvReadStream = fs.createReadStream(filePath);
    const parsers = csvParse({
      from_line: 2,
    });
    const parseCSV = csvReadStream.pipe(parsers);

    // Array that will store CSV data
    const transactions: CSVData[] = [];
    const categories: string[] = [];

    // Reading CSV file
    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;
      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    // Checking if CSV read finish
    await new Promise(resolve => parseCSV.on('end', resolve));

    // Checking if category name is already in database
    const existentCategories = await categoryRepository.find({
      where: { title: In(categories) },
    });
    const existentCategoriesTitle = existentCategories.map(
      (category: Category) => category.title,
    );

    // Add news categories on database
    const addCategoryTitle = categories
      .filter(category => !existentCategoriesTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);
    const newCategories = categoryRepository.create(
      addCategoryTitle.map(title => ({ title })),
    );
    await categoryRepository.save(newCategories);

    // Saving transactions on database
    const allCategories = [...newCategories, ...existentCategories];
    const createdTransactions = transactionRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: allCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionRepository.save(createdTransactions);
    await fs.promises.unlink(filePath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
