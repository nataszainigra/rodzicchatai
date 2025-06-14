import { buffer } from "micro";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // ustaw w .env

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Obsługa eventów
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Płatność zakończona, sesja:", session);

    // Tutaj możesz zapisać info o zakupie do bazy lub zwiększyć limit pytań

    // Przykład (pseudo):
    // const userId = session.client_reference_id;
    // await increaseUserQuestionLimit(userId, purchasedPackage);
  }

  res.status(200).json({ received: true });
}
