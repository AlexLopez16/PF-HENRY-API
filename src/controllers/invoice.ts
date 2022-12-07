import { RequestHandler } from 'express';
const Invoice = require('../models/invoice');
const company = require('../models/company');

export const createInvoice: RequestHandler = async (req, res) => {
  const { amount, date, method, invoice, description } = req.body;

  const newInvoice = new Invoice({
    amount,
    date,
    method,
    invoice,
    description,
    company,
  });
  await newInvoice.save();

  res.status(201).json({
    newInvoice,
  });
};

export const addInvoiceToCompany: RequestHandler = async (req, res) => {
  const { invoiceId, companyId } = req.body;
  const invoice = await Invoice.findById(invoiceId);
  const company = await companyId.findById(companyId);

  await invoice.save();

  res.status(200).json(invoice);
};
