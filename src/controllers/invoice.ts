import { RequestHandler } from 'express';
import { Schema } from 'mongoose';
import { formatError } from '../utils/formatErros'
import { createUserCompany } from './company';
const Invoice = require('../models/invoice');
const company = require('../models/company');

export const getInvoice: RequestHandler = async (req, res) => {
  try {
    const date:any = req.query.date
    const invoice:any = req.query.invoice
    const { limit = 20, init = 0} = req.query

    if( date ){
      
      const filterDate = new Date(date)
      const [total, totaldate] = await Promise.all([
        Invoice.countDocuments({date: filterDate}),
        Invoice.find({"date": {$gte: filterDate}}).skip(init).limit(limit)
      ])

      return res.status(200).json({
        total,
        totaldate
      })
    }

    if( invoice ){

      const filterNumber = { invoice: invoice }
      console.log(req.user.invoice);
      console.log(req.user);
      
      const[total, totalNumber] = await Promise.all([
        Invoice.countDocuments(filterNumber),
        Invoice.find(filterNumber).skip(init).limit(limit)
      ])
      
      return res.status(200).json({
        total,
        totalNumber,
      })
    }

    const query = { company: req.user._id }
    const [total, totalinvoice] = await Promise.all([
        Invoice.countDocuments(query),
        Invoice.find(query).skip(init).limit(limit)
      ])
    
    res.status(200).json({
      total,
      totalinvoice
    })

  } catch (error: any) {
    
    res.status(400).send(formatError(error.message))

  }
}

export const createInvoice: RequestHandler = async (req, res) => {

  const invoice:any = req.query.invoice
  try {
    const { ...body } = req.body;
    let date: Date = new Date();
    // console.log(req.user);
    
  const data = {
    ...body,
    company: req.user._id,
    date: date
  };

  const newInvoice = new Invoice(data);
  await newInvoice.save();
  const Company = await company.findById(req.user._id)
  Company.invoice = [...invoice, newInvoice._id ]

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
