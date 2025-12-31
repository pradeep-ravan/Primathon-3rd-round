"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedMenuItemProps {
  children: ReactNode;
  index: number;
  className?: string;
  whileHover?: any;
  whileTap?: any;
}

const AnimatedMenuItem = ({
  children,
  index,
  className = "",
  whileHover = { scale: 1.02 },
  whileTap = { scale: 0.98 },
}: AnimatedMenuItemProps) => {
  const menuItemVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.li
      variants={menuItemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 + 0.2 }}
      whileHover={whileHover}
      whileTap={whileTap}
      className={`relative ${className}`}
    >
      {children}
    </motion.li>
  );
};

export default AnimatedMenuItem;
