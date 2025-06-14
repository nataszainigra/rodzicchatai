import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { packageId } = req.body; // np. "mini", "midi", "maxi"

  // Tutaj możesz mapować pakiety na ceny (muszą być skonfigurowane w Stripe Dashboard)
  const priceIdMap = {
    mini: 'price_1RZehAAhfgLESpSDkhKh3nm0', // zamień na prawdziwe price IDs ze Stripe
    midi: 'price_1RZehdAhfgLESpSDdpxoiWI0',
    maxi: 'price_1RZehvAhfgLESpSDBuA3y1zO',
  };

  const priceId = priceIdMap[packageId];

  if (!priceId) {
    return res.status(400).json({ error: 'Nieprawidłowy pakiet' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera Stripe' });
  }
}
