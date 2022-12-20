import { Schema, model } from 'mongoose';

const InvoiceSchema = new Schema({
  date: {
    type: String
  },
  amount: {
    type: Number
  },
  description: {
    type: String
  },
  currency: {
    type: String
  },
  invoice_url: {
    type: String
  },
  invoice_pdf: {
    type: String
  },
  invoice_id: {
    type: String
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
});

InvoiceSchema.methods.toJSON = function () {
  const { __v, _id, ...invoice } = this.toObject();
  invoice.uid = _id;
  return invoice;
};

module.exports = model('Invoice', InvoiceSchema);
