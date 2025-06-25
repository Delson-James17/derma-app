import { Router } from 'express';
import { Booking } from '../models/index.js';

const router = Router();

router.get('/', async (req, res) => {
  const bookings = await Booking.findAll();
  res.json(bookings);
});

router.post('/', async (req, res) => {
  try {
    const { userId, service, date, time, status, details } = req.body;
    const booking = await Booking.create({ userId, service, date, time, status, details });
    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

export default router;
