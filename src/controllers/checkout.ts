import { RequestHandler } from 'express';
import { createInvoice } from './invoice';
import { formatDate } from '../utils/formatDate';
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);

const YOUR_DOMAIN = process.env.URL_FRONT || 'http://localhost:5173';

export const checkoutSession: RequestHandler = async (req, res) => {
    try {
        const prices = await stripe.prices.list({
            lookup_keys: [req.body.lookup_key],
            expand: ['data.product'],
        });

        const session = await stripe.checkout.sessions.create({
            billing_address_collection: 'auto',
            line_items: [
                {
                    price: prices.data[0].id,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${YOUR_DOMAIN}/checkout/?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/projects/?canceled=true`,
        });

        res.redirect(303, session.url);
    } catch (error) {
        console.log(error)
    }
};

export const portalSession: RequestHandler = async (req, res) => {
    const { session_id } = req.body;
    try {
        const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

        const returnUrl = `${YOUR_DOMAIN}/projects`;

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: checkoutSession.customer,
            return_url: returnUrl,
        });

        res.redirect(303, portalSession.url);
    } catch (error) {
        console.log(error)
    }
};

export const webhook: RequestHandler = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.ENDPOINT_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
        console.log(err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    switch (event.type) {
        case 'invoice.payment_succeeded':
            const {
                amount_paid,
                billing_reason,
                currency,
                customer_email,
                hosted_invoice_url,
                invoice_pdf,
                number,
                created,
            } = event.data.object;

            const data = {
                date: formatDate(created),
                amount: amount_paid / 100,
                description: billing_reason,
                currency: currency,
                invoice_url: hosted_invoice_url,
                invoice_pdf: invoice_pdf,
                invoice_id: number,
                company: customer_email,
            };

            createInvoice(data);

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.send();
};
