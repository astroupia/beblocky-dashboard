import { customInitApp } from "@/lib/firebase/firebase-admin";
import firebase_app from "@/lib/firebase/firebase-client";
import axios from "axios";
import { FirebaseApp } from "firebase/app";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

customInitApp();

async function GET(req: Request, context: { params: { ref: string } }) {
  console.log(context, "context");
  const ref = context.params.ref;
  if (!ref) {
    new NextResponse(JSON.stringify({ error: "No ref provided." }), {
      status: 401,
    });
  }

  await axios.get(`https://api.chapa.co/v1/transaction/verify/${ref}`, {
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    },
  });
  console.log("Firebase Started");

  try {
    const tx_ref = ref;
    const firestore = getFirestore(firebase_app as FirebaseApp);
    const q = query(
      collection(firestore, "UserSubscriptions"),
      where("tx_ref", "==", tx_ref)
    );
    let uid = "";
    await getDocs(q).then((query) => {
      if (!query.empty) {
        const matchingDoc = query.docs[0].data();
        uid = matchingDoc.uid;
        console.log(matchingDoc);
      } else {
        throw Error("Tx Ref Not found");
      }
    });
    const userSubscriptionsRef = doc(firestore, "UserSubscriptions", uid);
    const newData = {
      verified: true,
    };
    await updateDoc(userSubscriptionsRef, newData);
    new NextResponse(JSON.stringify({ message: "Successfully Verified." }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }

  return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
    status: 500,
  });
}

async function POST(req: Request, context: { params: { ref: string } }) {
  const { ref } = context.params;

  if (!ref) {
    new NextResponse(JSON.stringify({ error: "No ref provided." }), {
      status: 401,
    });
  }

  await axios
    .get(`https://api.chapa.co/v1/transaction/verify/${ref}`, {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
    })
    .then(async (data) => {
      try {
        console.log("Firebase Started");
        const tx_ref = data.data.tx_ref;
        const firestore = getFirestore(firebase_app as FirebaseApp);
        const userSubscriptionsRef = doc(
          firestore,
          "UserSubscriptions",
          tx_ref
        );
        const newData = {
          verified: true,
        };
        const updatedDoc = await updateDoc(userSubscriptionsRef, newData);
        console.log(updatedDoc, "Updated Doc");
        new NextResponse(
          JSON.stringify({ message: "Successfully Verified." }),
          {
            status: 200,
          }
        );
      } catch (error) {
        console.log(error);
        new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
          status: 500,
        });
      }
    })
    .catch((error: Error) => {
      new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
      });
    });
}

export { GET, POST };
