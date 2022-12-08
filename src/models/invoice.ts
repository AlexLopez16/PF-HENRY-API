import { Schema, model } from 'mongoose';

const InvoiceSchema = new Schema({
  amount: {
    type: String,
    required: [true, 'amount is requiered']
  },
  date: {
    type: Date,
  },
  method: {
    type: String,
  },
  invoice: {
    type: Number,
    required: [true, 'invoice is requiered']
  },
  description: {
    type: String,
    required: [true, 'description is requiered']
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
