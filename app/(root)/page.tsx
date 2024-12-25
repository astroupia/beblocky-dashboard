"use client";

import { BarChart3, Shield, Zap, LineChart, Users, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { FeatureCard } from "@/components/home/feature-card";
import { TestimonialCard } from "@/components/home/testimonial-card";
import { PricingCard } from "@/components/home/pricing-card";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Powerful Analytics for{" "}
            <span className="text-primary">
              <span className="text-secondary">Tracking Courses and </span>{" "}
              Student&#39;s Growth
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform learning data into actionable insights with comprehensive
            dashboard solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedIn>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-secondary/90"
              >
                Go to Dashboard
              </Link>
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
              >
                Get Started
              </Link>
            </SignedOut>
            <Link
              href="#features"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-primary/90 hover:text-white"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to scale your business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our dashboard provides all the tools you need to analyze, track,
              and grow your business effectively.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={BarChart3}
              title="Real-time Analytics"
              description="Get instant insights with real-time data analytics and monitoring capabilities."
            />

            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Optimized for speed and performance to for work efficiency."
            />
            <FeatureCard
              icon={LineChart}
              title="Advanced Reports"
              description="Detailed reports and analytics to track Students' Growth."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by thousands of businesses
            </h2>
            <p className="text-xl text-gray-600">
              Heres what our customers have to say about their experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              content="This dashboard has completely transformed how we track and analyze our business metrics. The insights we've gained are invaluable."
              author="Sarah Johnson"
              role="CEO"
              company="TechCorp"
            />
            <TestimonialCard
              content="The ease of use and powerful features make this the perfect solution for our analytics needs. Highly recommended!"
              author="Michael Chen"
              role="CTO"
              company="InnovateX"
            />
            <TestimonialCard
              content="Outstanding support team and regular updates keep making this platform better and better. We're very satisfied customers."
              author="Emily Rodriguez"
              role="Operations Director"
              company="GrowthLabs"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect plan for your business needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <PricingCard
              title="Free"
              price="0/mo ETB"
              description="Perfect for small businesses"
              features={["Basic Courses", "24/7 support", "IDE Access"]}
            />
            <PricingCard
              title="Standard"
              price="10,000/mo ETB"
              description="For More than 5 Students"
              features={[
                "More Courses",
                "Priority support",
                "More IDE Features",
                "Custom reports",
              ]}
            />
            <PricingCard
              title="Gold"
              price="25,000/mo ETB"
              description="For Small Schools"
              features={[
                "More than 50 Students'",
                "Advanced Courses",
                "24/7 priority support",
                "Custom development",
              ]}
              isPopular
            />
            <PricingCard
              title="Premium"
              price="50,000/mo ETB"
              description="For Large Schools"
              features={[
                "More than 100 Students'",
                "All Courses",
                "24/7 priority support",
                "Custom development of Courses",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Company
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Team
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p>&copy; 2024 DashPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
