'use client'
import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import RegisterForm from "./_components/register";
import LoginForm from "./_components/login";
import { useSearchParams } from "next/navigation";
import { 
  Shield, 
  Users, 
  Award, 
  ChevronRight, 
  CheckCircle,
  TrendingUp,
  Globe,
  Star,
  ArrowRight,
  Menu,
  X
} from "lucide-react";

function HomeContent() {
  const [openSheet, setOpenSheet] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const searchParams = useSearchParams();
  const formType = searchParams.get("form");

  const features = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>,
      title: "Clean Room Design",
      description: "Advanced HVAC calculations for pharmaceutical, semiconductor, and biotechnology facilities."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Compliance Standards",
      description: "Built-in support for FDA, EU GMP, ISO 14644, and other international cleanroom standards."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Performance Analytics",
      description: "Real-time monitoring and optimization of cleanroom environmental parameters."
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Global Deployment",
      description: "Scalable solutions for multi-site facilities with centralized management capabilities."
    }
  ];

  const stats = [
    { number: "500+", label: "Enterprise Clients" },
    { number: "99.9%", label: "System Uptime" },
    { number: "50+", label: "Countries Served" },
    { number: "24/7", label: "Expert Support" }
  ];

  const testimonials = [
    {
      quote: "STERI Clean Air has transformed our pharmaceutical manufacturing operations. The precision and reliability are unmatched.",
      author: "Dr. Sarah Chen",
      position: "VP of Operations",
      company: "BioPharm Solutions"
    },
    {
      quote: "The compliance features saved us months of regulatory preparation. Outstanding platform for semiconductor cleanrooms.",
      author: "Michael Rodriguez",
      position: "Facilities Director", 
      company: "TechCore Industries"
    },
    {
      quote: "Best-in-class HVAC matrix calculations. Our energy efficiency improved by 35% after implementation.",
      author: "Emily Thompson",
      position: "Chief Engineer",
      company: "MedDevice Corp"
    }
  ];

  const industries = [
    "Pharmaceutical Manufacturing",
    "Semiconductor Fabrication", 
    "Biotechnology Research",
    "Medical Device Production",
    "Aerospace Components",
    "Food & Beverage Processing"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Header */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src="/Arrant%20Logo%20-1.jpg" 
                  alt="Arrant Dynamics Logo" 
                  className="h-16 w-24 mr-4 rounded-sm"
                />
                <span className="text-xl font-bold text-gray-900">STERI Clean Air</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-700 hover:text-primary transition-colors">Features</a>
                <a href="#industries" className="text-gray-700 hover:text-primary transition-colors">Industries</a>
                <a href="#testimonials" className="text-gray-700 hover:text-primary transition-colors">Testimonials</a>
                <a href="#contact" className="text-gray-700 hover:text-primary transition-colors">Contact</a>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setOpenSheet(true)}>
                Sign In
              </Button>
              <Button onClick={() => setOpenSheet(true)}>
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-700">Features</a>
              <a href="#industries" className="block px-3 py-2 text-gray-700">Industries</a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-700">Testimonials</a>
              <a href="#contact" className="block px-3 py-2 text-gray-700">Contact</a>
              <div className="pt-3 border-t border-gray-200">
                <Button className="w-full mb-2" onClick={() => setOpenSheet(true)}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <Award className="h-4 w-4 mr-2" />
              Industry Leading HVAC Matrix Solutions
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                STERI Clean Air
              </span>
              <br />
              <span className="text-gray-700">HVAC Matrix</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-4xl mx-auto">
              Enterprise-grade cleanroom HVAC design and calculation platform
            </p>
            
            <p className="text-lg text-gray-500 mb-10 max-w-3xl mx-auto">
              Arrant Dynamics, a division of Arrant Tech IND, Pvt. Ltd. delivers precision-engineered 
              solutions for pharmaceutical, semiconductor, and biotechnology facilities worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button size="lg" className="text-lg px-8 py-4" onClick={() => setOpenSheet(true)}>
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Schedule Demo
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for Enterprise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed for large-scale cleanroom operations and regulatory compliance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-24 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Trusted Across Industries
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                From pharmaceutical manufacturing to semiconductor fabrication, our platform meets 
                the stringent requirements of regulated industries worldwide.
              </p>
              
              <div className="space-y-4">
                {industries.map((industry, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{industry}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏭</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Scale</h3>
                  <p className="text-gray-600 mb-6">
                    Manage multiple facilities, ensure compliance, and optimize performance 
                    across your entire organization.
                  </p>
                  <Button className="w-full">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              What Industry Leaders Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by Fortune 500 companies and leading research institutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.position}</div>
                  <div className="text-sm text-gray-500">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join hundreds of enterprise clients who trust STERI Clean Air for their 
            mission-critical cleanroom operations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4" onClick={() => setOpenSheet(true)}>
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <img src="/Arrant%20Logo%20-1.jpg" alt="Arrant Dynamics Logo" className="h-16 w-24 mr-4" />
                <span className="text-xl font-bold text-white">STERI Clean Air</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Arrant Dynamics, a division of Arrant Tech IND, Pvt. Ltd. 
                Leading provider of enterprise cleanroom HVAC solutions.
              </p>
              <div className="text-sm text-gray-500">
                © 2024 Arrant Tech IND, Pvt. Ltd. All rights reserved.
              </div>
      </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Login/Register Sheet */}
      <Sheet open={openSheet} onOpenChange={(open) => setOpenSheet(open)}>
        <SheetContent className="lg:max-w-[500px]">
          <SheetHeader>
            <SheetTitle className="text-center">
              <div className="flex items-center justify-center mb-4">
                <img src="/Arrant%20Logo%20-1.jpg" alt="Arrant Dynamics Logo" className="h-14 w-20 mr-4" />
                STERI Clean Air
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="flex justify-center items-center p-5 h-full">
            {formType === 'register' ? <RegisterForm /> : <LoginForm />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
