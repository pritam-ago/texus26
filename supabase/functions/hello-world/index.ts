const { createHash, createCipheriv, createDecipheriv } = await import(
  "node:crypto"
);

// Import supabase once at the top
import { createClient } from "@supabase/supabase-js";
import "@supabase/functions-js";

const supabase = createClient(
  // @ts-expect-error - This is a workaround to avoid the error
  Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")!,
  // @ts-expect-error - This is a workaround to avoid the error
  Deno.env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")!
);

// Define interface for initialization options
interface CCOptions {
  working_key: string;
  merchant_id: string;
  [key: string]: string;
}

let initOptions: CCOptions = {
  // @ts-expect-error - This is a workaround to avoid the error
  working_key: Deno.env.get("NEXT_PUBLIC_CCAvenue_WORKING_KEY")!,
  // @ts-expect-error - This is a workaround to avoid the error
  merchant_id: Deno.env.get("NEXT_PUBLIC_CAvenue_MERCHANT_ID")!,
};

class Configure {
  constructor(options: CCOptions) {
    initOptions = options || {};
  }

  validate(key: string): boolean {
    return initOptions && initOptions[key] ? true : false;
  }

  throwError(requirement: string): never {
    throw new Error(`${requirement} is required to perform this action`);
  }

  encrypt(plainText: string): string {
    if (this.validate("working_key") && plainText) {
      const { working_key } = initOptions;
      const m = createHash("md5");
      m.update(working_key);
      const key = m.digest();
      const iv =
        "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f";
      const cipher = createCipheriv("aes-128-cbc", key, iv);
      let encoded = cipher.update(plainText, "utf8", "hex");
      encoded += cipher.final("hex");
      return encoded;
    } else if (!plainText) {
      this.throwError("Plain text");
    } else {
      this.throwError("CCAvenue encrypted response");
    }
  }

  decrypt(encText: string): Record<string, string> {
    if (this.validate("working_key") && encText) {
      const { working_key } = initOptions;
      const m = createHash("md5");
      m.update(working_key);
      const key = m.digest();
      const iv =
        "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f";

      const decipher = createDecipheriv("aes-128-cbc", key, iv);
      let decoded = decipher.update(encText, "hex", "utf8");
      decoded += decipher.final("utf8");

      // Parse the decoded string into a Record
      const result: Record<string, string> = {};
      const pairs = decoded.split("&");

      for (const pair of pairs) {
        const [key, value] = pair.split("=");
        if (key) {
          result[key] = value || "";
        }
      }

      return result;
    } else if (!encText) {
      this.throwError("CCAvenue encrypted response");
    } else {
      this.throwError("Working key");
    }
  }

  getEncryptedOrder(orderParams: Record<string, string>): string {
    if (this.validate("merchant_id") && orderParams) {
      let data = `merchant_id=${initOptions.merchant_id}`;
      data += Object.entries(orderParams)
        .map(([key, value]) => `&${key}=${value}`)
        .join("");
      return this.encrypt(data);
    } else if (!orderParams) {
      this.throwError("Order Params");
    } else {
      this.throwError("Merchant ID");
    }
  }
}

const CCAvenue = new Configure({
  // @ts-expect-error - This is a workaround to avoid the error
  working_key: Deno.env.get("NEXT_PUBLIC_CCAvenue_WORKING_KEY")!,
  // @ts-expect-error - This is a workaround to avoid the error
  merchant_id: Deno.env.get("NEXT_PUBLIC_CAvenue_MERCHANT_ID")!,
});

// @ts-expect-error - This is a workaround to avoid the error
Deno.serve(async (req) => {
  try {
    const formData = await req.formData();
    const encResp = formData.get("encResp") as string;

    const data = CCAvenue.decrypt(encResp) as PaymentResponse;

    console.log("order", data);

    let passingProps = {};

    if (data.order_status === "Success" || data.order_status === "Shipped") {
      if (data.merchant_param3 === "musical_night") {
        passingProps = {
          ...data,
          physical_ticket: false,
          merch: false,
          phase: data.merchant_param5,
          user_texus_id: data.merchant_param2,
          payment_status: "Success",
          tickets: data.merchant_param4 ? `{${data.merchant_param4}}` : null,
        };
      } else {
        passingProps = {
          ...data,
          team: `{${data.merchant_param5}}`,
          event_id: data.merchant_param3,
          payment_status: "Success",
          attended: false,
          referral: data.merchant_param4,
        };
      }

      const { data: paymentData, error } = await supabase
        .from(
          data.merchant_param3 === "musical_night"
            ? "musical_night"
            : "registrations"
        )
        .insert(passingProps)
        .select();

      if (paymentData) {
        console.log("Payment successful for Order ID", data.order_id);
      } else if (error) {
        console.log("Error inserting payment data:", error);
      }
    } else {
      console.log("Payment failed for Order ID", data.order_id);
    }
  } catch (error) {
    console.error("Error in hello-world function:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
