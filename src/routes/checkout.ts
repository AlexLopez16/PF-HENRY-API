import { Router } from 'express';
import { checkoutSession, portalSession, webhook } from '../controllers/checkout';
const router = Router();

const express = require('express')

router.post('/', checkoutSession);
router.post('/portal', portalSession);
router.post('/webhook', webhook);

module.exports = router;