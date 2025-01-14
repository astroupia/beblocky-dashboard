import type { ServiceAccount } from "firebase-admin";
import * as admin from "firebase-admin";
import { getApps, initializeApp } from "firebase/app";
import firebaseConfig from "./firebase-config";

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });
  } catch (error) {
    console.log("Firebase admin initialization error: ", error);
  }
}

export const auth = admin.auth;
export function customInitApp() {
  if (getApps().length <= 0) {
    initializeApp(firebaseConfig);
  }
}

export default admin;
