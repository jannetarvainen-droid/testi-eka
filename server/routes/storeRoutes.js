import express from 'express';
import { createId, readStore, writeStore } from '../utils/store.js';

const router = express.Router();

const collections = {
  tasks: 't',
  procurements: 'p',
  changeWorks: 'c',
  risks: 'r'
};

router.get('/data', async (_req, res) => {
  const data = await readStore();
  res.json(data);
});

router.put('/site-info', async (req, res) => {
  const data = await readStore();
  data.siteInfo = req.body;
  await writeStore(data);
  res.json(data.siteInfo);
});

router.post('/:collection', async (req, res) => {
  const { collection } = req.params;
  if (!collections[collection]) {
    return res.status(404).json({ message: 'Tuntematon kokoelma' });
  }

  const data = await readStore();
  const newItem = { ...req.body, id: createId(collections[collection]) };
  data[collection].push(newItem);
  await writeStore(data);

  return res.status(201).json(newItem);
});

router.put('/:collection/:id', async (req, res) => {
  const { collection, id } = req.params;
  if (!collections[collection]) {
    return res.status(404).json({ message: 'Tuntematon kokoelma' });
  }

  const data = await readStore();
  const idx = data[collection].findIndex((item) => item.id === id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Riviä ei löytynyt' });
  }

  data[collection][idx] = { ...data[collection][idx], ...req.body, id };
  await writeStore(data);
  return res.json(data[collection][idx]);
});

router.delete('/:collection/:id', async (req, res) => {
  const { collection, id } = req.params;
  if (!collections[collection]) {
    return res.status(404).json({ message: 'Tuntematon kokoelma' });
  }

  const data = await readStore();
  const next = data[collection].filter((item) => item.id !== id);
  if (next.length === data[collection].length) {
    return res.status(404).json({ message: 'Riviä ei löytynyt' });
  }

  data[collection] = next;
  await writeStore(data);
  return res.status(204).send();
});

export default router;
