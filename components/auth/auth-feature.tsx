import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AuthFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

export function AuthFeature({
  icon: Icon,
  title,
  description,
  delay,
}: AuthFeatureProps) {
  return (
    <motion.div
      className="flex items-start space-x-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}
