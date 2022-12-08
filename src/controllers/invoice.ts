import { RequestHandler } from 'express';
import { Schema } from 'mongoose';
const Invoice = require('../models/invoice');
const company = require('../models/company');

export const getInvoice: RequestHandler = async (req, res) => {
  const { limit = 20, init = 0} = req.query
  // const data = Invoice.findAll()
  const query = { company: Schema.Types.ObjectId }
    // const [] = await 
  
  res.status(200).json({
  })
}

export const createInvoice: RequestHandler = async (req, res) => {
  // try {
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
  // } catch (error) {

  //   res.status(400).send(error.message)

  // }
}


export const addInvoiceToCompany: RequestHandler = async (req, res) => {
  const { invoiceId, companyId } = req.body;
  const invoice = await Invoice.findById(invoiceId);
  const company = await companyId.findById(companyId);

  await invoice.save();

  res.status(200).json(invoice);
};
