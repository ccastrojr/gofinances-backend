import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (req, res) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find({
    select: [
      'id',
      'title',
      'type',
      'value',
      'category',
      'created_at',
      'updated_at',
    ],
    relations: ['category'],
  });

  const balance = await transactionsRepository.getBalance();

  return res.json({ transactions, balance });
});

transactionsRouter.post('/', async (req, res) => {
  const createService = new CreateTransactionService();

  const { title, type, value, category } = req.body;
  const transaction = await createService.execute({
    title,
    type,
    value,
    category,
  });

  return res.status(200).json(transaction);
});

transactionsRouter.delete('/:id', async (req, res) => {
  const deleteService = new DeleteTransactionService();

  const { id } = req.params;
  await deleteService.execute(id);
  return res.status(204).send('Succesfully deleted.');
});

transactionsRouter.post('/import', upload.single('file'), async (req, res) => {
  const importService = new ImportTransactionsService();

  const transations = await importService.execute(req.file.path);
  return res.status(200).json(transations);
});

export default transactionsRouter;
