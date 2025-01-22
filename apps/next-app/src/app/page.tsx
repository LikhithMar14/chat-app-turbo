"use client";

import { motion } from "framer-motion";
import { Button } from "@repo/ui"
import { Card } from "@repo/ui";
import { MessageCircle, Users, Zap, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Real-time Messaging",
      description: "Experience instant message delivery with live typing indicators and read receipts",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Group Chats",
      description: "Create vibrant communities with unlimited members and custom roles",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Built with cutting-edge technology for instantaneous communication",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen gradient-bg overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <MessageCircle className="h-8 w-8 text-primary" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="h-4 w-4 text-primary" />
              </motion.div>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              ChatApp
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-x-4"
          >
            <Button variant="ghost" asChild className="hover:bg-primary/10">
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </motion.div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16 items-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <h1 className="text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
              Connect with friends in real-time
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Experience seamless communication with our modern chat application.
              Stay connected with friends and family, anywhere, anytime.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="space-x-2 bg-primary hover:bg-primary/90 shadow-xl">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
              alt="Chat Interface"
              className="rounded-2xl shadow-2xl relative z-10 border border-primary/10"
            />
          </motion.div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-8 mt-24"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="feature-card p-6 glass-card border-primary/10 hover:shadow-lg transition-shadow duration-300">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="mb-4 p-3 rounded-full bg-primary/10 w-fit"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}