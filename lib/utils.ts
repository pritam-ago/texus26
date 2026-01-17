import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * XOR encryption/decryption function
 * This function performs XOR operation between the input string and the key
 * It can be used for both encryption and decryption as XOR is symmetric
 *
 * @param input - The string to encrypt or decrypt
 * @param key - The encryption/decryption key
 * @returns The encrypted or decrypted string
 */
export function xorCipher(input: string, key: string): string {
  if (!input || !key) return input;

  let result = "";

  for (let i = 0; i < input.length; i++) {
    // XOR the charCode of the input character with the charCode of the key character
    // Use modulo to cycle through the key if it's shorter than the input
    const keyChar = key.charCodeAt(i % key.length);
    const inputChar = input.charCodeAt(i);
    const xorResult = inputChar ^ keyChar;

    result += String.fromCharCode(xorResult);
  }

  return result;
}

/**
 * Encrypt a string using XOR cipher
 *
 * @param input - The string to encrypt
 * @param key - The encryption key (typically user_auth_id)
 * @returns The encrypted string
 */
export function encrypt(input: string, key: string): string {
  return xorCipher(input, key);
}

/**
 * Decrypt a string using XOR cipher
 *
 * @param input - The encrypted string to decrypt
 * @param key - The decryption key (must be the same as the encryption key)
 * @returns The decrypted string
 */
export function decrypt(input: string, key: string): string {
  return xorCipher(input, key);
}

interface DepartmentInfo {
  success: boolean;
  message?: string;
  department?: string;
  departmentCode?: string;
  yearOfStudy?: number;
  fullRegisterNumber?: string;
}

export const departmentCodes: Record<string, string> = {
  "2010": "B.Arch. – Architecture",
  "2020": "B.Des. - Interior Design",
  "0130": "B.Tech. - Biomedical Engineering",
  "0090": "B.Tech. – Biotechnology",
  "0010": "B.Tech. - Civil Engineering",
  "0420": "B.Tech. - Computer Science and Business System",
  "0470": "B.Tech. - Artificial Intelligence",
  "0260": "B.Tech. - CSE – AIML",
  "0270": "B.Tech. - CSE - Big Data Analytics",
  "0280": "B.Tech. - CSE - Cloud Computing",
  "0300": "B.Tech. - CSE - Cyber Security",
  "0510": "B.Tech. - CSE - Gaming Technology",
  "0320": "B.Tech. - CSE – IoT",
  "0030": "B.Tech. – CSE",
  "0530": "B.Tech. - ECE - Data Science",
  "0040": "B.Tech. - ECE",
  "0050": "B.Tech. – EEE",
  "0080": "B.Tech. - Information Technology",
  "0020": "B.Tech. - Mechanical Engineering",
  "4100": "B.D.S - Dental Surgery",
};

export function getDepartmentInfo(registerNumber: string): DepartmentInfo {
  // Define the department mapping based on the image

  // Updated regex to allow for different ending numbers
  // Pattern: RAYY11XXXX##### where XXXX is the department code and YY is the year code
  const registerRegex = /RA(\d{2})11(\d{4})\d+/;
  const match = registerNumber.match(registerRegex);

  if (!match) {
    return {
      success: false,
      message:
        "Invalid register number format. Expected format: RAYY11XXXX#####",
    };
  }

  // Extract year and department code from regex match
  const yearCode = match[1];
  const departmentCode = match[2];
  const department = departmentCodes[departmentCode];

  if (!department) {
    return {
      success: false,
      message: `Unknown department code: ${departmentCode}`,
    };
  }

  // Calculate year of study: 25 - YY
  const yearOfStudy = 25 - parseInt(yearCode);

  return {
    success: true,
    department: department,
    departmentCode: departmentCode,
    yearOfStudy: yearOfStudy,
    fullRegisterNumber: registerNumber,
  };
}
