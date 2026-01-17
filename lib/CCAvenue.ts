import { createHash, createCipheriv, createDecipheriv } from "crypto";

// Define interface for initialization options
interface CCOptions {
  working_key: string;
  merchant_id: string;
  [key: string]: string;
}

let initOptions: CCOptions = {
  working_key: process.env.NEXT_PUBLIC_CCAvenue_WORKING_KEY!,
  merchant_id: process.env.NEXT_PUBLIC_CAvenue_MERCHANT_ID!,
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
  working_key: process.env.NEXT_PUBLIC_CCAvenue_WORKING_KEY!,
  merchant_id: process.env.NEXT_PUBLIC_CAvenue_MERCHANT_ID!,
});

export default CCAvenue;
