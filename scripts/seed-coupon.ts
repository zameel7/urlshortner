/**
 * Seed Firestore with coupon codes. Uses Firebase Admin SDK so it bypasses
 * security rules (no user sign-in required).
 *
 * Setup:
 * 1. Firebase Console → Project settings → Service accounts → Generate new private key
 * 2. Save the JSON file (e.g. as serviceAccountKey.json) and add it to .gitignore
 * 3. Run: GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json npm run seed-coupons
 *
 * Or set GOOGLE_APPLICATION_CREDENTIALS in your environment.
 */
import admin from "firebase-admin";

// Uses Application Default Credentials: set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path
if (!admin.apps?.length) {
  admin.initializeApp();
}

const db = admin.firestore();

function generateCouponCode(length = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function seedCoupons(): Promise<void> {
  console.log("Starting coupon generation...");
  const batch = db.batch();
  const couponsRef = db.collection("coupons");

  const codes: string[] = [];

  for (let i = 0; i < 50; i++) {
    const code = generateCouponCode();
    codes.push(code);
    const docRef = couponsRef.doc(code);
    batch.set(docRef, {
      code,
      isUsed: false,
      createdAt: new Date().toISOString(),
    });
  }

  try {
    await batch.commit();
    console.log("Successfully created 50 coupons:");
    console.log(codes.join(", "));
  } catch (error) {
    console.error("Error writing coupons:", error);
    process.exit(1);
  }
}

seedCoupons();
