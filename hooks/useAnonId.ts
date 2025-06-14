// hooks/useAnonId.ts
import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export function useAnonId() {
  const [anonId, setAnonId] = useState<string | null>(null);

  useEffect(() => {
    const getAnonId = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();

      const res = await fetch('/api/init-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fingerprint: result.visitorId }),
      });

      const { anonId } = await res.json();
      setAnonId(anonId);
    };

    getAnonId();
  }, []);

  return anonId;
}
