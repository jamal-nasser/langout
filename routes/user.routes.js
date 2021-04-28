const { Router } = require('express');
const router = Router();
const isUserLoggedIn = require('../middleware/index.middleware');

router.get('/profile', (req, res) => {
  const { user } = req;
  res.status(200).render('users/profile', { user });
});

router.get('/private-page', (req, res) => {
  const { user } = req;
  res.status(200).render('users/private', { user });
});

module.exports = router;