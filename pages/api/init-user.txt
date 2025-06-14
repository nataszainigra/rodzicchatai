import { firestore } from '@/lib/firebase'; // adjust path to your Firestore client
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { fingerprint } = req.body;

  const usersRef = firestore.collection('anonymous_users');
  const existing = await usersRef.where('fingerprint', '==', fingerprint).limit(1).get();

  if (!existing.empty) {
    return res.status(200).json({ anonId: existing.docs[0].id });
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
}
