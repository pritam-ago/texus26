import { motion } from "framer-motion";

export default function SeparatorLine() {
  return (
    <motion.div
      initial={{ width: "0%" }}
      whileInView={{ width: "100%" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ margin: "-50px", once: true }}
      className="h-[1px] max-w-xl w-full mx-auto bg-gradient-to-r from-transparent via-pink-500 to-transparent"
    />
  );
}
