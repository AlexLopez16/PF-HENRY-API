const Invoice = require('../models/invoice');
const Company = require('../models/company');

type data = {
  company?: string;
};

export const createInvoice = async (data: data = {}) => {
  try {
    const company = await Company.findOne({ email: data.company });

    if (!company) throw new Error(`Usuario no encontrado con el email: ${data.company}`);
    data.company = company._id;

    const invoice = new Invoice(data);
    await invoice.save();

    company.invoice = [...company.invoice, invoice._id];
    company.premium = true;
    await company.save();

    return invoice;
  } catch (error: any) {
    console.log(error);
  }
};
