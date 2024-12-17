import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, DollarSign, PieChart, TrendingUp } from 'lucide-react';
import { useLocation } from 'wouter';

export default function LandingPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 animate-pulse">
              Welcome to Pro-tfolio
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Take control of your financial future with Pro-tfolio, your all-in-one dashboard. Track investments, manage pensions, and monitor stocks in real-time.
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                size="lg" 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                onClick={() => setLocation('/register')}
              >
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-gray-800 text-green-500 border-green-500 font-bold py-3 px-6 rounded-full transition-all duration-300 hover:bg-gray-700"
                onClick={() => setLocation('/login')}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Choose Pro-tfolio?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<DollarSign className="h-12 w-12 text-green-500" />}
              title="Comprehensive Financial Tracking"
              description="Monitor all your financial assets in one place, from stocks to pensions and everything in between."
            />
            <FeatureCard
              icon={<PieChart className="h-12 w-12 text-green-500" />}
              title="Insightful Analytics"
              description="Gain valuable insights with our advanced analytics tools. Visualize your financial growth and make informed decisions."
            />
            <FeatureCard
              icon={<TrendingUp className="h-12 w-12 text-green-500" />}
              title="Real-time Updates"
              description="Stay on top of market changes with real-time updates and notifications on your investments and stocks."
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="Pro-tfolio has completely transformed how I manage my finances. It's intuitive, comprehensive, and incredibly helpful."
              author="Jane Doe, Entrepreneur"
            />
            <TestimonialCard
              quote="I've tried many financial tools, but Pro-tfolio stands out. The real-time updates and analytics are game-changers for my investment strategy."
              author="John Smith, Financial Analyst"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Elevate Your Financial Management?</h2>
          <p className="text-xl mb-8">Join thousands of users who have already transformed their financial management.</p>
          <Button 
            size="lg" 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
            onClick={() => setLocation('/register')}
          >
            Start Your Free Trial
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-gray-700 border-gray-600 hover:border-green-500 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          {icon}
          <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
          <p className="text-gray-300">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardContent className="p-6">
        <blockquote className="text-lg italic mb-4">"{quote}"</blockquote>
        <p className="text-right text-gray-300">- {author}</p>
      </CardContent>
    </Card>
  );
}
