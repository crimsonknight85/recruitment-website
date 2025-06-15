import { Suspense } from 'react';
import Applications from './Applications';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading applications...</div>}>
      <Applications />
    </Suspense>
  );
}
