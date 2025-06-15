// hooks/useAnonId.js
import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export function useAnonId() {
  const [anonId, setAnonId] = useState(null);

  useEffect(() => {
    const getAnonId = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();

      const res = await fetch('/api/init-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fingerprint: result.visitorId }),
      });

      const data = await res.json();
      setAnonId(data.anonId);
    };

    getAnonId();
  }, []);

  return anonId;
}
