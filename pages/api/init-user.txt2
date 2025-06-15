import { v4 as uuidv4 } from 'uuid';
import { firestore } from '../../lib/firebase'; // make sure this points to lib/firebase.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { fingerprint } = req.body;

  try {
    const usersRef = firestore.collection('anonymous_users');
    const existing = await usersRef.where('fingerprint', '==', fingerprint).limit(1).get();

    if (!existing.empty) {
      const existingId = existing.docs[0].id;
      return res.status(200).json({ anonId: existingId });
    }

    const anonId = uuidv4();
    await usersRef.doc(anonId).set({
      fingerprint,
      questionsUsed: 0,
      questionsRemaining: 0,
      lastPaymentTier: 0,
      createdAt: new Date(),
    });

    res.status(200).json({ anonId });
  } catch (error) {
    console.error('Error creating anonId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
