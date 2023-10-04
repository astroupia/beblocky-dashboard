import { addSubscription } from "@/actions/subscription";
import { toast } from "@/components/ui/use-toast";
import { siteConfig } from "@/config/site-config";
import { PaymentData } from "@/types";
import axios from "axios";
import { nanoid } from "nanoid";
import { Plan } from "./plans";

export interface UserPaymentData {
  first_name: string;
  last_name: string;
  email: string;
  amount: number;
  return_url: string;
}

interface CheckoutWrapper {
  checkout_url: string;
}

export interface ChapaResponse {
  message: string;
  status: "success" | "failed";
  data: CheckoutWrapper;
}

export const makePayment = async (
  paymentData: UserPaymentData,
  userId: string,
  plan: Plan,
  yearly: boolean
) => {
  const txRef = "TX-" + nanoid();
  const realPaymentData: PaymentData = {
    ...paymentData,
    currency: "ETB",
    tx_ref: txRef,
    callback_url: `${siteConfig.url}/api/verify/${txRef}`,
    "customization[title]": "Beblocky, Inc.",
    "customization[description]": "BeBlocky subscription.",
  };
  try {
    const res = await axios
      .post("/api/chapa-payment/", realPaymentData)
      .then((res) => res.data);
    await addSubscription({
      userId,
      plan,
      yearly,
      paymentInfo: {
        txRef,
        email: paymentData.email,
      },
    });
    return res.response.data.checkout_url as string;
  } catch (e: any) {
    toast({
      title: e.message,
    });
  }
};
