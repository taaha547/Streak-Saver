import { motion } from "framer-motion";

interface FlameIconProps {
  size?: number;
  animate?: boolean;
  isActive?: boolean;
}

export function FlameIcon({ size = 24, animate = true, isActive = false }: FlameIconProps) {
  const flameColor = isActive ? "text-orange-500" : "text-gray-400";
  const glowColor = isActive ? "text-yellow-500" : "text-gray-600";

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={flameColor}
      animate={animate ? {
        y: [0, -4, 0],
        scale: [1, 1.1, 1],
        rotate: [0, -5, 5, 0],
      } : undefined}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: [0.76, 0, 0.24, 1], // Custom easing for bouncy effect
      }}
    >
      <motion.path
        d="M12 2C9.5 6 4 8 4 13C4 17.4183 7.58172 21 12 21C16.4183 21 20 17.4183 20 13C20 8 14.5 6 12 2Z"
        fill="currentColor"
        animate={animate ? {
          scale: [1, 1.15, 1],
          fillOpacity: [0.85, 1, 0.85],
        } : undefined}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      {/* Inner glow effect */}
      <motion.path
        d="M12 5C10.5 7.5 7 9 7 12.5C7 15.5376 9.46243 18 12.5 18C15.5376 18 18 15.5376 18 12.5C18 9 14.5 7.5 12 5Z"
        className={glowColor}
        fill="currentColor"
        animate={animate ? {
          scale: [1, 1.2, 1],
          fillOpacity: [0.4, 0.7, 0.4],
        } : undefined}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2
        }}
      />
    </motion.svg>
  );
}