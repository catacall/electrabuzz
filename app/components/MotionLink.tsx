"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function MotionLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
      className={className || "px-4 py-2 rounded-xl t-card border t-border t-shadow"}>
      <Link href={href} className="flex items-center justify-center w-full h-full">
        {children}
      </Link>
    </motion.div>
  );
}
