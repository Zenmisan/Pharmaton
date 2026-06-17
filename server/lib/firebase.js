import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (getApps().length === 0) {
  initializeApp({
    projectId: 'zentribe-e8ba2'
  });
}

export const auth = getAuth();
