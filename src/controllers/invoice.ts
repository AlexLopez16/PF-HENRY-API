import { RequestHandler } from 'express';
import { Schema } from 'mongoose';
import { formatError } from '../utils/formatErros'
const Invoice = require('../models/invoice');
const company = require('../models/company');

export const getInvoice: RequestHandler = async (req, res) => {
  try {

    
    const { limit = 20, init = 0} = req.query
    const query = { company: req.user._id }
      const [total, invoice] = await Promise.all([
        Invoice.countDocuments(query),
        Invoice.find(query).skip(init).limit(limit)
      ])
    
    res.status(200).json({
      total,
      invoice
    })

  } catch (error: any) {
    
    res.status(400).send(formatError(error.message))

  }
}

export const createInvoice: RequestHandler = async (req, res) => {
  try {
    const { ...body } = req.body;
  const data = {
    ...body,
    company: req.user._id,
  };

  const newInvoice = new Invoice(data);
  await newInvoice.save();

  res.status(201).json({
    newInvoice,
  })
  } catch (error: any) {

    res.status(400).send(formatError(error.message))

  }
}


export const addInvoiceToCompany: RequestHandler = async (req, res) => {
  try {
    
    const { invoiceId, companyId } = req.body;
    const invoice = await Invoice.findById(invoiceId);
    const company = await companyId.findById(companyId);
  
    await invoice.save();
  
    res.status(200).json(invoice);

  } catch (error: any) {

    res.status(400).send(formatError(error.message))
    
  }

};
