import { Schema, model } from 'mongoose';

const InvoiceSchema = new Schema({
    /*
        # Id
        * Id_Company
        + Amount
        + Date
        + Method
        + Id_Invoice
        + Description
    */
    amount: {
        type: Number,
    },
    date: {
        type: Date,
    },
    Method: {
        type: String,
    },
    Invoice: {
        type: Number,
    },
    Description: {
        type: String,
    },
});

InvoiceSchema.methods.toJSON = function () {
    const { __v, _id, ...invoice } = this.toObject();
    return invoice;
};

module.exports = model('Invoice', InvoiceSchema);
