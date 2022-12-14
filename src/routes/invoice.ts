import { Router } from 'express';
import { check } from 'express-validator';
import { verifyToken } from '../middlewares/authValidator';
import { validate } from '../middlewares/validator';
import { addInvoiceToCompany, createInvoice, getInvoice } from './../controllers/invoice';
const router = Router();

router.post('/',
  [
    verifyToken,
    //acá podemos evaluar que parametros son obligatorios para la creacion de la invoice
    check('amount', 'Amount is Required').not().isEmpty(),
    //buscar info de como se establece el formato de date (ej: 27-01-12 o 12-01-27 o 01-dic-2022)
    // check('Date', 'Date is required').isDate(),
    check('invoice', 'Invoice number is required').isNumeric(),
    check('description', 'Description is required').isString(),
    validate,
  ],
  createInvoice,
);

router.get('/',
verifyToken, getInvoice)

router.put('/',
verifyToken, addInvoiceToCompany);

module.exports = router;
