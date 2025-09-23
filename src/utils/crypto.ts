import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.CRYPTHOUGHT_KEY;

if (!SECRET_KEY) throw new Error("Chave de criptografia não definida!");

export const encryptThought = (text: string): string => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decryptThought = (cipher: string): string => {
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
