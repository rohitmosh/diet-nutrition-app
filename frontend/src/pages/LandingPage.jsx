import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
  HeartIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import {
  AppleIcon,
  Activity,
  Target,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Zap
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-green-400/10 rounded-full blur-3xl animate-pulse-gentle"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 xl:px-16 relative z-10 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-20 items-center min-h-[80vh]">
            {/* Hero Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left lg:pr-8 xl:pr-12"
            >
              <motion.div variants={fadeInUp} className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 text-green-800 text-sm font-medium mb-4">
                  <Zap className="w-4 h-4 mr-2" />
                  Smart Nutrition Made Simple
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Meet
                <span className="block text-gradient-success font-display">
                  NutriTrack
                </span>
                <span className="block text-3xl md:text-4xl lg:text-5xl font-normal text-gray-700 mt-2">
                  Your AI Nutrition Coach
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl"
              >
                Revolutionize your health with intelligent meal tracking, personalized insights,
                and expert-backed nutrition guidance that adapts to your lifestyle.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-stretch"
              >
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg group w-full sm:w-48 h-14 flex items-center justify-center font-semibold transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl active:scale-95"
                >
                  Get Started
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  to="/login"
                  className="btn btn-secondary btn-lg w-full sm:w-48 h-14 flex items-center justify-center font-semibold transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg active:scale-95"
                >
                  Sign In
                </Link>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex items-center justify-center lg:justify-start mt-8 space-x-6 text-sm text-gray-500"
              >
                <div className="flex items-center hover:text-gray-700 transition-colors duration-300 cursor-default group">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 group-hover:text-green-600 transition-all duration-300" />
                  Free to start
                </div>
                <div className="flex items-center hover:text-gray-700 transition-colors duration-300 cursor-default group">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 group-hover:text-green-600 transition-all duration-300" />
                  Expert guidance
                </div>
                <div className="flex items-center hover:text-gray-700 transition-colors duration-300 cursor-default group">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 group-hover:text-green-600 transition-all duration-300" />
                  Proven results
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInRight}
              className="relative flex justify-center lg:justify-center xl:justify-end lg:pl-8 xl:pl-12"
            >
              <div className="relative w-80 h-80 lg:w-96 lg:h-96 xl:w-[420px] xl:h-[420px] mx-8 lg:mx-0">
                {/* Central Circle with Blue-Green Orbit */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-2xl animate-pulse-gentle"></div>
                <div className="absolute inset-4 bg-white rounded-full shadow-inner flex items-center justify-center">
                  <span className="text-9xl">🥗</span>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <motion.div
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-6xl lg:text-7xl hover:scale-110 transition-transform"
                    animate={{
                      y: [0, -8, 0, 8, 0],
                      x: [0, 4, 0, -4, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🍎
                  </motion.div>
                  <motion.div
                    className="absolute top-1/8 right-1/4 transform -translate-y-1/2 text-6xl lg:text-7xl hover:scale-110 transition-transform"
                    animate={{
                      y: [0, 6, 0, -6, 0],
                      x: [0, -3, 0, 3, 0]
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    🫐
                  </motion.div>
                  <motion.div
                    className="absolute top-1/4 -right-2 transform -translate-y-1/2 text-6xl lg:text-7xl hover:scale-110 transition-transform"
                    animate={{
                      y: [0, -10, 0, 10, 0],
                      x: [0, 2, 0, -2, 0]
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    🥦
                  </motion.div>
                  <motion.div
                    className="absolute top-5/8 right-1/4 transform -translate-y-1/2 text-6xl lg:text-7xl hover:scale-110 transition-transform"
                    animate={{
                      y: [0, 7, 0, -7, 0],
                      x: [0, -5, 0, 5, 0]
                    }}
                    transition={{
                      duration: 3.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5
                    }}
                  >
                    🍓
                  </motion.div>
                  <motion.div
                    className="absolute top-3/4 -right-2 transform -translate-y-1/2 text-6xl lg:text-7xl hover:scale-110 transition-transform"
                    animate={{
                      y: [0, -6, 0, 6, 0],
                      x: [0, 3, 0, -3, 0]
                    }}
                    transition={{
                      duration: 4.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2
                    }}
                  >
                    🥕
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-6xl lg:text-7xl hover:scale-110 transition-transform"
                    animate={{
                      y: [0, 9, 0, -9, 0],
                      x: [0, -2, 0, 2, 0]
                    }}
                    transition={{
                      duration: 3.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2.5
                    }}
                  >
                    🥑
                  </motion.div>
                  <motion.div
                    className="absolute top-3/4 -left-2 transform -translate-y-1/2 text-6xl lg:text-7xl hover:scale-110 transition-transform"
                    animate={{
                      y: [0, -5, 0, 5, 0],
                      x: [0, 4, 0, -4, 0]
                    }}
                    transition={{
                      duration: 4.1,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 3
                    }}
                  >
                    🍇
                  </motion.div>
                  <motion.div
                    className="absolute top-1/4 -left-2 transform -translate-y-1/2 text-6xl lg:text-7xl hover:scale-110 transition-transform"
                    animate={{
                      y: [0, 8, 0, -8, 0],
                      x: [0, -1, 0, 1, 0]
                    }}
                    transition={{
                      duration: 3.9,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 3.5
                    }}
                  >
                    🍅
                  </motion.div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -top-6 -left-6 lg:-top-8 lg:-left-8 bg-white rounded-xl shadow-lg p-3 lg:p-4 border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <TrendingUp className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors">98%</div>
                      <div className="text-xs text-gray-500">Goal Achievement</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -bottom-6 -right-6 lg:-bottom-8 lg:-right-8 bg-white rounded-xl shadow-lg p-3 lg:p-4 border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Target className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">95%</div>
                      <div className="text-xs text-gray-500">Goal Achievement</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-green-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 text-green-800 text-sm font-medium hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <SparklesIcon className="w-4 h-4 mr-2 group-hover:animate-spin" />
                Comprehensive Features
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 hover:scale-105 transition-transform duration-300 cursor-default"
            >
              Everything You Need for
              <span className="block text-gradient-success hover:text-green-500 transition-colors duration-300">Better Nutrition</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto hover:text-gray-700 transition-colors duration-300"
            >
              Our comprehensive platform provides all the tools and guidance you need
              to transform your health and achieve your wellness goals.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: BarChart3,
                title: "Smart Meal Tracking",
                description: "Log your meals effortlessly with our intuitive interface and get detailed nutritional insights to make informed dietary choices.",
                color: "from-blue-500 via-blue-600 to-indigo-600",
                bgColor: "bg-gradient-to-br from-blue-50 to-indigo-100",
                iconColor: "text-blue-600",
                cardBg: "bg-gradient-to-br from-blue-50/80 to-indigo-100/80"
              },
              {
                icon: Activity,
                title: "Exercise Integration",
                description: "Track your workouts and see how they complement your nutrition goals for optimal health results and balanced lifestyle.",
                color: "from-green-500 via-emerald-600 to-teal-600",
                bgColor: "bg-gradient-to-br from-green-50 to-emerald-100",
                iconColor: "text-green-600",
                cardBg: "bg-gradient-to-br from-green-50/80 to-emerald-100/80"
              },
              {
                icon: Target,
                title: "Personalized Diet Plans",
                description: "Get customized meal plans tailored to your preferences, goals, and dietary restrictions with expert recommendations.",
                color: "from-purple-500 via-violet-600 to-fuchsia-600",
                bgColor: "bg-gradient-to-br from-purple-50 to-violet-100",
                iconColor: "text-purple-600",
                cardBg: "bg-gradient-to-br from-purple-50/80 to-violet-100/80"
              },
              {
                icon: Users,
                title: "Expert Consultations",
                description: "Schedule appointments with certified nutrition professionals and get personalized guidance for your wellness journey.",
                color: "from-orange-500 via-amber-600 to-yellow-600",
                bgColor: "bg-gradient-to-br from-orange-50 to-amber-100",
                iconColor: "text-orange-600",
                cardBg: "bg-gradient-to-br from-orange-50/80 to-amber-100/80"
              },
              {
                icon: TrendingUp,
                title: "Progress Reports",
                description: "Visualize your journey with comprehensive reports and analytics to stay motivated and track your improvements.",
                color: "from-pink-500 via-rose-600 to-red-600",
                bgColor: "bg-gradient-to-br from-pink-50 to-rose-100",
                iconColor: "text-pink-600",
                cardBg: "bg-gradient-to-br from-pink-50/80 to-rose-100/80"
              },
              {
                icon: Calendar,
                title: "Goal Achievement",
                description: "Set realistic goals and track your progress with our intelligent monitoring system and milestone celebrations.",
                color: "from-teal-500 via-cyan-600 to-blue-600",
                bgColor: "bg-gradient-to-br from-teal-50 to-cyan-100",
                iconColor: "text-teal-600",
                cardBg: "bg-gradient-to-br from-teal-50/80 to-cyan-100/80"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative"
              >
                <div className={`card card-hover p-8 h-full border-0 shadow-soft hover:shadow-large transition-all duration-300 ${feature.cardBg} backdrop-blur-sm border border-white/20 hover:-translate-y-2 hover:scale-105 cursor-pointer`}>
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <feature.icon className={`w-8 h-8 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors group-hover:translate-x-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                  <div className={`absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-lg`}></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >


            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight hover:scale-105 transition-transform duration-300 cursor-default"
            >
              Ready to Start Your
              <span className="block text-accent-300 hover:text-accent-200 transition-colors duration-300">Wellness Journey?</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto hover:text-white transition-colors duration-300"
            >
              Join thousands of users who have transformed their health with NutriTrack.
              Start your personalized nutrition journey today.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/register"
                className="btn bg-white text-primary-600 hover:bg-gray-50 btn-lg group shadow-xl hover:shadow-2xl w-full sm:w-48 h-14 flex items-center justify-center transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 active:scale-95 font-semibold"
              >
                Get Started
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/login"
                className="btn bg-transparent text-white border-2 border-white/30 hover:bg-white/10 btn-lg backdrop-blur-sm w-full sm:w-48 h-14 flex items-center justify-center transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 active:scale-95 font-semibold"
              >
                Sign In
              </Link>
              <a
                href="https://github.com/rohitmosh/diet-nutrition-app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-gray-800/20 text-white border-2 border-gray-400/30 hover:bg-gray-700/30 btn-lg backdrop-blur-sm w-full sm:w-48 h-14 flex items-center justify-center transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 active:scale-95 font-semibold group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center mt-8 space-x-8 text-sm text-blue-100"
            >
              <div className="flex items-center hover:text-white transition-colors duration-300 cursor-default group">
                <CheckCircleIcon className="w-5 h-5 text-accent-300 mr-2 group-hover:scale-110 group-hover:text-accent-200 transition-all duration-300" />
                No credit card required
              </div>
              <div className="flex items-center hover:text-white transition-colors duration-300 cursor-default group">
                <CheckCircleIcon className="w-5 h-5 text-accent-300 mr-2 group-hover:scale-110 group-hover:text-accent-200 transition-all duration-300" />
                14-day free trial
              </div>
              <div className="flex items-center hover:text-white transition-colors duration-300 cursor-default group">
                <CheckCircleIcon className="w-5 h-5 text-accent-300 mr-2 group-hover:scale-110 group-hover:text-accent-200 transition-all duration-300" />
                Cancel anytime
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-2xl">🥗</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gradient-success">NutriTrack</h3>
                </div>
                <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                  Your comprehensive nutrition companion. Transform your health journey with
                  personalized meal tracking, expert guidance, and proven results.
                </p>
                <div className="flex space-x-4">
                  {/* Social Media Icons */}
                  <div className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                    <span className="text-sm">📘</span>
                  </div>
                  <div className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                    <span className="text-sm">🐦</span>
                  </div>
                  <div className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                    <span className="text-sm">📷</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">Features</h4>
                <ul className="space-y-3">
                  {['Meal Tracking', 'Exercise Logging', 'Diet Planning', 'Progress Reports', 'Expert Consultations'].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
                <ul className="space-y-3">
                  {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'FAQ'].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; 2024 NutriTrack. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">Made with ❤️ for your health</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
