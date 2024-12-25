import { motion } from "framer-motion";
import { Rocket, Shield, Zap } from "lucide-react";
import { AuthFeature } from "./auth-feature";
import { AuthTestimonial } from "./auth-testimonial";

interface AuthSidebarProps {
  mode: "signin" | "signup";
}

export function AuthSidebar({ mode }: AuthSidebarProps) {
  return (
    <motion.div
      className="hidden lg:flex lg:w-1/2 bg-primary/5 backdrop-blur-lg p-12 flex-col justify-between"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-primary mb-4">
            {mode === "signin" ? "Welcome back!" : "Join our community"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {mode === "signin"
              ? "Sign in to access your dashboard and continue your journey."
              : "Create an account to get started with our platform."}
          </p>
        </motion.div>

        <div className="space-y-8">
          <AuthFeature
            icon={Rocket}
            title="Quick Start"
            description="Get started in minutes with our intuitive onboarding process"
            delay={0.3}
          />
          <AuthFeature
            icon={Shield}
            title="Enterprise Security"
            description="Your Data is Save with us!"
            delay={0.4}
          />
          <AuthFeature
            icon={Zap}
            title="Real-time Analytics"
            description="Access powerful insights and analytics in real-time"
            delay={0.5}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {/* <AuthTestimonial
          content="This platform has completely transformed how we manage our business. The analytics and insights are invaluable."
          author="Sarah Johnson"
          role="CEO at TechCorp"
          image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&crop=face"
        /> */}
      </motion.div>
    </motion.div>
  );
}
