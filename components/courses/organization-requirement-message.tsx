"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Mail,
  Shield,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

interface OrganizationRequirementMessageProps {
  userRole: string;
  organizationId?: string;
}

export function OrganizationRequirementMessage({
  userRole,
  organizationId,
}: OrganizationRequirementMessageProps) {
  const isAdmin = userRole === "admin";
  const hasOrganization = !!organizationId;

  if (hasOrganization) {
    return null; // Don't show message if user has organization
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center"
            >
              <Building2 className="h-10 w-10 text-orange-500" />
            </motion.div>

            <Badge
              variant="outline"
              className="mb-4 bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800"
            >
              <Shield className="h-3 w-3 mr-1" />
              {isAdmin
                ? "Administrator Access Required"
                : "Teacher Access Required"}
            </Badge>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
              Organization Association Required
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              To access the course management system, you need to be associated
              with an educational organization.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Current Status */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                    <AlertTriangle className="h-5 w-5" />
                    Current Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium">Not Associated</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Your account is not currently linked to any educational
                    organization.
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Required Action */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <CheckCircle className="h-5 w-5" />
                    Required Action
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">
                      Contact Organization
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Reach out to your educational institution to add you to
                    their system.
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">
                        Contact Your Organization
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Reach out to your school, university, or educational
                        institution's IT department or administrator.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">
                        Provide Your Information
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Share your email address and role (
                        {isAdmin ? "Administrator" : "Teacher"}) with the
                        organization.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Wait for Association</h3>
                      <p className="text-sm text-muted-foreground">
                        Once added to the organization, you'll be able to access
                        the course management system.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="font-medium">Need Help?</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  If you're having trouble getting associated with an
                  organization, contact our support team.
                </p>
                <Button variant="outline" className="group">
                  Contact Support
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
