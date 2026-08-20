import React, { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock,
  Clock3,
  FileSpreadsheet,
  FileText,
  Flame,
  Globe,
  Hammer,
  HelpCircle,
  Home as HomeIcon,
  Layers,
  Leaf,
  Lightbulb,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  Minus,
  Paintbrush,
  Phone,
  PhoneCall,
  PhoneMissed,
  Pipette,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  UserCheck,
  UserRound,
  Users,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

import { MspLogo, MspLogoMark } from '@/components/MspLogo';
import { ChatWidget } from '@/components/ChatWidget';
import { FaqModal } from '@/components/FaqModal';
import { AssessmentExperience } from '@/components/AssessmentExperience';
import {
  BOOKING_URL,
  calculateResults,
  calculatorConfig,
  type CalculatorInputs,
  type CalculatorResult,
  type ResponseTimeOption,
} from './calculatorConfig';
import {
  assessmentQuestions,
  assessmentSteps,
  calculateAssessmentReport,
  type AssessmentAnswers,
  type AssessmentReport,
} from './assessmentConfig';

const queryClient = new QueryClient();

// Money formatter helper
const formatMoney = (val: number) => `$${val.toLocaleString('en-US')}`;

// Animated Number Counter
function AnimatedCounter({ value, formatter }: { value: number; formatter: (v: number) => string }) {
  const [display, setDisplay] = useState(value);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = display;
    const delta = value - start;
    const started = performance.now();
    const duration = 400;

    const tick = (now: number) => {
      const elapsed = now - started;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + delta * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value]);

  return <>{formatter(display)}</>;
}

// Top Navigation Bar
function Navbar({ onOpenAssessment }: { onOpenAssessment: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#06090e]/90 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 group">
          <MspLogo markSize="h-11 sm:h-14 w-auto" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wider text-slate-300 uppercase">
          <button
            onClick={() => scrollTo('what-we-do')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            What We Do
          </button>
          <button
            onClick={() => scrollTo('who-we-help')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Who We Help
          </button>
          <button
            onClick={() => scrollTo('how-we-help')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            How We Help
          </button>
          <button
            onClick={() => scrollTo('results')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Results
          </button>
          <button
            onClick={() => scrollTo('about')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* Discovery Call Button */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href={BOOKING_URL}
            className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/35 flex items-center gap-1.5 group"
          >
            Book a Discovery Call
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-400 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0f18] border-b border-slate-800 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2">
          <button
            onClick={() => scrollTo('what-we-do')}
            className="block w-full text-left text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white py-2"
          >
            What We Do
          </button>
          <button
            onClick={() => scrollTo('who-we-help')}
            className="block w-full text-left text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white py-2"
          >
            Who We Help
          </button>
          <button
            onClick={() => scrollTo('how-we-help')}
            className="block w-full text-left text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white py-2"
          >
            How We Help
          </button>
          <button
            onClick={() => scrollTo('results')}
            className="block w-full text-left text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white py-2"
          >
            Results
          </button>
          <button
            onClick={() => scrollTo('about')}
            className="block w-full text-left text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white py-2"
          >
            About
          </button>
          <div className="pt-2">
            <a
              href={BOOKING_URL}
              className="block w-full text-center px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm"
            >
              Book a Discovery Call →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

// 1. HERO / SECTION 1
function HeroSection({ onOpenAssessment }: { onOpenAssessment: () => void }) {
  const scrollTo = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Headline & Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.16em] text-sky-400 uppercase">
                STOP LEAKAGE. GROW FASTER.
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Turn More Opportunities <br />
              Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600">Revenue.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              We help service businesses uncover lost opportunities, streamline follow-up and build systems that convert.
            </p>

            {/* Value Indicators (3 horizontal items) */}
            <div className="flex flex-wrap items-center gap-5 pt-2 pb-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Clock size={12} />
                </div>
                <span><strong>2–3 Minutes</strong> / Quick Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <UserCheck size={12} />
                </div>
                <span><strong>Personalized</strong> / Results</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Zap size={12} />
                </div>
                <span><strong>Actionable</strong> / Next Steps</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
              <button
                onClick={() => scrollTo('how-we-help')}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 group cursor-pointer"
              >
                See How We Can Help You
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onOpenAssessment}
                className="px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                See Your Opportunity — Revenue Recovery Assessment™
              </button>
            </div>
          </div>

          {/* Right Column: 4 Clean Dark Cards with Blue Line Icons */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            {/* Card 1: UNCOVER GAPS */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-blue-500/40 transition-all flex items-start gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Search size={20} />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-slate-100 tracking-wider uppercase">
                  UNCOVER GAPS
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Find what’s costing you revenue.
                </p>
              </div>
            </div>

            {/* Card 2: FIX PROCESSES */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-blue-500/40 transition-all flex items-start gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Sliders size={20} />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-slate-100 tracking-wider uppercase">
                  FIX PROCESSES
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Strengthen follow-up and close more deals.
                </p>
              </div>
            </div>

            {/* Card 3: RECOVER REVENUE */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-blue-500/40 transition-all flex items-start gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <RefreshCcw size={20} />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-slate-100 tracking-wider uppercase">
                  RECOVER REVENUE
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Re-engage old leads and win back lost deals.
                </p>
              </div>
            </div>

            {/* Card 4: DRIVE GROWTH */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-blue-500/40 transition-all flex items-start gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-slate-100 tracking-wider uppercase">
                  DRIVE GROWTH
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Build systems that scale your success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 2. REVENUE OPPORTUNITY CALCULATOR
function CalculatorSection({
  inputs,
  setInputs,
  result,
  onOpenAssessment,
}: {
  inputs: CalculatorInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
  result: CalculatorResult;
  onOpenAssessment: () => void;
}) {
  const [jobValueRaw, setJobValueRaw] = useState<string>(inputs.averageJobValue.toString());

  const handleJobValueChange = (valStr: string) => {
    const numeric = parseInt(valStr.replace(/[^0-9]/g, ''), 10);
    setJobValueRaw(valStr);
    if (!isNaN(numeric) && numeric > 0) {
      setInputs((prev) => ({ ...prev, averageJobValue: numeric }));
    }
  };

  const responseTimeOptions: ResponseTimeOption[] = [
    'Within 5 Min',
    'Same Day',
    'Next Day',
    '2+ Days',
  ];

  return (
    <section id="calculator" className="py-12 lg:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900/90 border border-slate-700/80 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="mb-8">
            <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
              REVENUE OPPORTUNITY CALCULATOR™
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1">
              What could your current opportunities be worth?
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-2xl">
              Adjust a few numbers to estimate the revenue opportunity already moving through your business.
            </p>
          </div>

          {/* Grid: Inputs (Left) and Results (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 4 Inputs */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Monthly Opportunities */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs sm:text-sm font-semibold text-slate-200">
                    1. Monthly Opportunities
                  </label>
                  <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono font-bold text-xs sm:text-sm">
                    {inputs.monthlyOpportunities}
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={200}
                  step={1}
                  value={inputs.monthlyOpportunities}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      monthlyOpportunities: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1.5">
                  <span>5</span>
                  <span>200</span>
                </div>
              </div>

              {/* 2. Average Job Value */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-2">
                  2. Average Job Value
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    $
                  </span>
                  <input
                    type="text"
                    value={inputs.averageJobValue.toLocaleString('en-US')}
                    onChange={(e) => handleJobValueChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2.5 pl-8 pr-4 text-white font-mono font-semibold text-sm sm:text-base focus:outline-none focus:border-blue-500"
                    placeholder="12,000"
                  />
                </div>
              </div>

              {/* 3. Current Conversion Rate */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs sm:text-sm font-semibold text-slate-200">
                    3. Current Conversion Rate
                  </label>
                  <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono font-bold text-xs sm:text-sm">
                    {inputs.conversionRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={75}
                  step={1}
                  value={inputs.conversionRate}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      conversionRate: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1.5">
                  <span>5%</span>
                  <span>75%</span>
                </div>
              </div>

              {/* 4. Average Response Time */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-3">
                  4. Average Response Time
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {responseTimeOptions.map((option) => {
                    const isSelected = inputs.responseTime === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setInputs((prev) => ({ ...prev, responseTime: option }))}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all text-center border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-5 h-full">
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between h-full shadow-2xl relative">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Estimated Annual Revenue Opportunity
                  </span>

                  {/* Big Number */}
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-2 flex items-baseline gap-1">
                    <AnimatedCounter
                      value={result.annualOpportunity}
                      formatter={formatMoney}
                    />
                  </div>

                  {/* Sleek Sparkline Graphic */}
                  <div className="my-6 py-2">
                    <svg className="w-full h-16 overflow-visible" viewBox="0 0 300 60">
                      <defs>
                        <linearGradient id="calcGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 50 Q 50 48, 100 38 T 200 20 T 300 8"
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 0 50 Q 50 48, 100 38 T 200 20 T 300 8 L 300 60 L 0 60 Z"
                        fill="url(#calcGlow)"
                      />
                      <circle cx="300" cy="8" r="4" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="2" />
                    </svg>
                  </div>

                  {/* Estimated Jobs Missed & Opportunity Level */}
                  <div className="pt-4 border-t border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-slate-400">
                        Estimated Jobs Missed / Year
                      </span>
                      <span className="text-base sm:text-lg font-mono font-bold text-white">
                        ~{result.estimatedJobsMissed}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-slate-400">Opportunity Level</span>
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider border ${
                          result.opportunityLevel === 'HIGH'
                            ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-sm shadow-red-500/20 animate-pulse'
                            : result.opportunityLevel === 'MEDIUM'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        }`}
                      >
                        {result.opportunityLevel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Assessment Link */}
                <div className="mt-8 pt-4">
                  <button
                    onClick={onOpenAssessment}
                    className="w-full py-3.5 px-4 rounded-xl bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 hover:border-blue-500 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    See Where You’re Losing Revenue
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 3. SIMPLE 5-STEP JOURNEY
function JourneySection({ onOpenAssessment }: { onOpenAssessment: () => void }) {
  const steps = [
    {
      num: '01',
      title: 'Calculate Your Opportunity',
      desc: 'See what additional revenue may already exist in your business.',
      icon: FileSpreadsheet,
      action: () => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      num: '02',
      title: 'Find the Gaps',
      desc: 'Complete the Revenue Recovery Assessment to identify where opportunities may be getting lost.',
      icon: Search,
      action: onOpenAssessment,
    },
    {
      num: '03',
      title: 'Get Your Revenue Report',
      desc: 'See your biggest opportunities and recommended next steps.',
      icon: FileText,
      action: onOpenAssessment,
    },
    {
      num: '04',
      title: 'Build Your Growth Plan',
      desc: 'Meet with MSP to prioritize what should be fixed first.',
      icon: Users,
      action: () => (window.location.href = BOOKING_URL),
    },
    {
      num: '05',
      title: 'Implement & Grow',
      desc: 'Improve the right processes, systems and technology — and measure the results.',
      icon: TrendingUp,
      action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }),
    },
  ];

  return (
    <section id="what-we-do" className="py-16 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs sm:text-sm font-mono font-bold tracking-[0.22em] text-sky-400 uppercase">
            SEE IT. FIND IT. FIX IT. GROW IT.
          </span>
        </div>

        {/* 5 Horizontal Visual Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                onClick={step.action}
                className="group relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-900/90 transition-all cursor-pointer flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  {/* Step Icon */}
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-105 group-hover:border-blue-400 transition-all">
                    <Icon size={22} />
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 block mb-1">
                    {step.num}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 leading-snug group-hover:text-sky-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Arrow indicator on desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <ChevronRight size={16} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 4. EVERY OPPORTUNITY HAS A COST
function OpportunityCostSection() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Copy */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
              THE HIDDEN COST / COMMON REVENUE LEAKS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Every opportunity <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                has a cost.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed pt-2">
              Many businesses don’t have a lead problem. They have a conversion problem. Small moments of friction compound into a number that quietly changes the trajectory of the business.
            </p>
          </div>

          {/* Right Visual: Glowing Cosmic Dollar Node */}
          <div className="lg:col-span-5 flex items-center justify-center relative py-6">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              {/* Outer Orbit Glow */}
              <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-pulse-subtle" />
              <div className="absolute inset-4 rounded-full border border-blue-500/30 border-dashed" />
              <div className="absolute inset-10 rounded-full bg-blue-600/10 backdrop-blur-sm border border-blue-400/40" />

              {/* Constellation Nodes */}
              <div className="absolute top-2 left-10 w-2 h-2 rounded-full bg-sky-400 shadow-lg shadow-sky-400" />
              <div className="absolute bottom-4 right-12 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500" />
              <div className="absolute top-1/2 -left-2 w-2 h-2 rounded-full bg-sky-300" />
              <div className="absolute top-1/3 -right-1 w-2 h-2 rounded-full bg-sky-400" />

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <line x1="30" y1="20" x2="110" y2="110" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="200" y1="180" x2="110" y2="110" stroke="#0284C7" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="10" y1="110" x2="110" y2="110" stroke="#38BDF8" strokeWidth="1" />
              </svg>

              {/* Central Glowing Dollar Badge */}
              <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-blue-500/50 border border-white/20">
                $
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 5. WHAT’S COSTING YOU vs. HOW MSP HELPS
function CostVsFixSection() {
  const problems = [
    {
      title: 'Missed Calls',
      desc: 'Potential customers call and nobody answers.',
      icon: PhoneMissed,
    },
    {
      title: 'Slow Response Times',
      desc: 'Interested prospects cool off while waiting.',
      icon: Clock,
    },
    {
      title: 'Leads That Don’t Get Followed Up',
      desc: 'Good opportunities fall through the cracks.',
      icon: Mail,
    },
    {
      title: 'Lost Deals That Never Get Re-Engaged',
      desc: 'Qualified prospects go quiet after a quote or proposal and never get followed up with.',
      icon: Users,
    },
    {
      title: 'Estimates & Proposals That Go Cold',
      desc: 'Active opportunities stall because there’s no consistent follow-up.',
      icon: FileText,
    },
    {
      title: 'No-Shows & Cancellations',
      desc: 'Revenue disappears before the appointment happens.',
      icon: Calendar,
    },
    {
      title: 'Old Leads Sitting Untouched',
      desc: 'Past inquiries sit in the CRM without a reactivation strategy.',
      icon: UserRound,
    },
    {
      title: 'Manual Administrative Work',
      desc: 'Your team spends time on repetitive tasks instead of revenue activities.',
      icon: Layers,
    },
  ];

  const solutions = [
    {
      title: 'Lead Response Systems',
      desc: 'Respond faster and more consistently.',
      icon: CheckCircle2,
    },
    {
      title: 'Sales & Follow-Up Playbooks',
      desc: 'Create a clear process for moving opportunities forward.',
      icon: CheckCircle2,
    },
    {
      title: 'Lost Opportunity Recovery',
      desc: 'Re-engage qualified prospects who went dark, stalled or were marked lost.',
      icon: CheckCircle2,
    },
    {
      title: 'Estimate & Proposal Follow-Up',
      desc: 'Build structured follow-up after quotes are sent.',
      icon: CheckCircle2,
    },
    {
      title: 'Lead Reactivation',
      desc: 'Turn your existing database into another source of opportunity.',
      icon: CheckCircle2,
    },
    {
      title: 'Appointment & No-Show Systems',
      desc: 'Improve confirmations, reminders and rescheduling.',
      icon: CheckCircle2,
    },
    {
      title: 'CRM & Pipeline Optimization',
      desc: 'Gain visibility, ownership and next actions on every opportunity.',
      icon: CheckCircle2,
    },
    {
      title: 'Automation & AI',
      desc: 'Use technology where it improves consistency, response and efficiency.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="how-we-help" className="py-16 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
            Side-by-side problem / solution comparison
          </span>
        </div>

        {/* Side-by-Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Card: WHAT MAY BE COSTING YOU (Red Accents) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#170e12] to-[#10090c] border border-red-500/25 shadow-2xl space-y-6">
            <h3 className="text-xs sm:text-sm font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert size={16} />
              WHAT MAY BE COSTING YOU
            </h3>

            <div className="space-y-4">
              {problems.map((prob) => {
                const Icon = prob.icon;
                return (
                  <div key={prob.title} className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{prob.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{prob.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Card: HOW MSP HELPS FIX IT (MSP Blue Accents) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0c182a] to-[#07101d] border border-blue-500/30 shadow-2xl space-y-6">
            <h3 className="text-xs sm:text-sm font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={16} />
              HOW MSP HELPS FIX IT
            </h3>

            <div className="space-y-4">
              {solutions.map((sol) => (
                <div key={sol.title} className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{sol.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{sol.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3 text-slate-200">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <Zap size={18} />
            </div>
            <span className="text-sm sm:text-base font-semibold">
              Stop letting good opportunities slip through the cracks.
            </span>
          </div>

          <a
            href={BOOKING_URL}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0"
          >
            See How We Can Help
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

// 6. INDUSTRIES WE HELP
function IndustriesSection() {
  const industries = [
    { name: 'Custom Home Builders', icon: HomeIcon },
    { name: 'Plumbing Services', icon: Wrench },
    { name: 'HVAC Services', icon: Sparkles },
    { name: 'Residential Contractors', icon: Hammer },
    { name: 'Roofing Companies', icon: HomeIcon },
    { name: 'Electrical Services', icon: Zap },
    { name: 'Painting Services', icon: Paintbrush },
    { name: 'Landscaping Services', icon: Leaf },
    { name: '& More', icon: Layers },
  ];

  return (
    <section id="who-we-help" className="py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-xs sm:text-sm font-mono font-bold tracking-[0.2em] text-sky-400 uppercase">
            WE HELP THESE SERVICE INDUSTRIES GROW
          </h2>
        </div>

        {/* Clean Line Icon Grid in Horizontal Alignment */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.name}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/30 transition-all text-center flex flex-col items-center justify-center min-h-[110px]"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2.5">
                  <Icon size={18} />
                </div>
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-tight leading-tight">
                  {ind.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 7. ABOUT MSP & 8. WHAT BETTER LOOKS LIKE
function AboutAndResultsSection() {
  const outcomes = [
    {
      title: 'Faster Response',
      desc: 'Prospects hear from you while they’re still interested.',
      icon: Clock,
    },
    {
      title: 'More Conversations',
      desc: 'More existing opportunities reach your sales team.',
      icon: MessageSquare,
    },
    {
      title: 'More Appointments',
      desc: 'Better follow-up turns interest into scheduled calls.',
      icon: Calendar,
    },
    {
      title: 'More Closed Business',
      desc: 'Improved processes help more opportunities reach a decision.',
      icon: UserCheck,
    },
    {
      title: 'Less Manual Work',
      desc: 'Automation handles tasks so your team focuses on growth.',
      icon: Sliders,
    },
  ];

  return (
    <section id="about" className="py-16 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 7. About MSP (Left Card) */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
                ABOUT MUTUAL SUCCESS PARTNERS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                The best growth <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                  is mutual.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
                We’re a revenue growth consultancy for service businesses that are ready to stop guessing. We connect the dots between lead response, sales, follow-up, operations, technology and the customer experience.
              </p>
            </div>

            <div className="pt-8 mt-6 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <MspLogo markSize="h-12 sm:h-14 w-auto" />
              </div>
            </div>
          </div>

          {/* 8. What Better Looks Like (Right Card) */}
          <div
            id="results"
            className="lg:col-span-7 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6"
          >
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
                WHAT BETTER LOOKS LIKE
              </span>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">
                Outcome-focused, not fake testimonials.
              </p>
            </div>

            {/* 5 Outcomes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {outcomes.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className={`p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3.5 ${
                      idx === 4 ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-200">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 9. PRIMARY CTA SECTION
function PrimaryCtaSection() {
  return (
    <section className="py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-gradient-to-r from-blue-950/70 via-slate-900/90 to-blue-950/70 border border-blue-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
              READY TO GROW?
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Let’s find your biggest revenue opportunity.
            </h2>
            <p className="text-sm text-slate-300">
              A short conversation can uncover where opportunities may be getting lost — and what you can do about it.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
            <a
              href={BOOKING_URL}
              className="px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2 group"
            >
              Book My Discovery Call
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <span className="text-[11px] text-slate-400 font-mono">
              30 minutes • No obligation • Practical next steps
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// 10. CONTACT FORM
function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    challenge: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 lg:py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Let’s find what’s costing you.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Simplified, professional and easy to complete.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-slate-950 border border-blue-500/30 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 text-sky-400 flex items-center justify-center mx-auto">
                <Check size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Message Received</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Thank you! We’ve received your challenge details and will review your revenue opportunity and reach out shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Name*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Business Name*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="Company or Business Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email*
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@business.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 000-0000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  What’s your biggest growth challenge right now?
                </label>
                <textarea
                  rows={4}
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  placeholder="Tell us what’s getting in the way..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Start the Conversation
                  <ArrowRight size={16} />
                </button>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Shield size={14} className="text-slate-400" />
                  <span>Your information stays private.</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// 11. FOOTER
function Footer({ onOpenFaq, onOpenAssessment }: { onOpenFaq: () => void; onOpenAssessment: () => void }) {
  const scrollTo = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="pt-16 pb-12 bg-[#04060a] border-t border-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          {/* Brand & Address */}
          <div className="space-y-4">
            <MspLogo markSize="h-12 sm:h-14 w-auto" />
            <p className="text-xs font-semibold text-slate-300">Mutual Success Partners LLC</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              30 N Gould Street<br />
              Sheridan, WY 82801
            </p>
          </div>

          {/* Contact Details (Clickable phone & email) */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              CONTACT
            </span>
            <div className="space-y-2 text-xs">
              <div>
                <a
                  href="tel:9049133566"
                  className="flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors"
                >
                  <Phone size={14} className="text-blue-400" />
                  904-913-3566
                </a>
              </div>
              <div>
                <a
                  href="mailto:andrew@mutualsuccesspartners.com"
                  className="flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors"
                >
                  <Mail size={14} className="text-blue-400" />
                  andrew@mutualsuccesspartners.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              QUICK LINKS
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => scrollTo('what-we-do')}
                  className="hover:text-white transition-colors"
                >
                  What We Do
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('who-we-help')}
                  className="hover:text-white transition-colors"
                >
                  Who We Help
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('calculator')}
                  className="hover:text-white transition-colors"
                >
                  Revenue Opportunity Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAssessment}
                  className="hover:text-white transition-colors"
                >
                  Revenue Recovery Assessment
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('about')}
                  className="hover:text-white transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button onClick={onOpenFaq} className="hover:text-white transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Connect (Socials) */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              CONNECT
            </span>
            <div className="space-y-2 text-xs">
              <div>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-400 transition-colors inline-flex items-center gap-1.5"
                >
                  Instagram →
                </a>
              </div>
              <div>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-400 transition-colors inline-flex items-center gap-1.5"
                >
                  LinkedIn →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© 2026 Mutual Success Partners LLC. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// MAIN HOMEPAGE COMPONENT
function Home() {
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);

  // Global calculator state so inputs and outputs carry over seamlessly to assessment
  const [calculatorInputs, setCalculatorInputs] = useState<CalculatorInputs>({
    monthlyOpportunities: 25,
    averageJobValue: 12000,
    conversionRate: 20,
    responseTime: 'Within 5 Min',
  });

  const calculatorResult = useMemo(() => calculateResults(calculatorInputs), [calculatorInputs]);

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 selection:bg-blue-500 selection:text-white relative">
      {/* Ambient background glow */}
      <div className="site-bg-ambient" />

      {/* Navigation */}
      <Navbar onOpenAssessment={() => setAssessmentOpen(true)} />

      {/* 1. HERO */}
      <HeroSection onOpenAssessment={() => setAssessmentOpen(true)} />

      {/* 2. REVENUE OPPORTUNITY CALCULATOR */}
      <CalculatorSection
        inputs={calculatorInputs}
        setInputs={setCalculatorInputs}
        result={calculatorResult}
        onOpenAssessment={() => setAssessmentOpen(true)}
      />

      {/* 3. SIMPLE 5-STEP JOURNEY */}
      <JourneySection onOpenAssessment={() => setAssessmentOpen(true)} />

      {/* 4. EVERY OPPORTUNITY HAS A COST */}
      <OpportunityCostSection />

      {/* 5. WHAT’S COSTING YOU vs. HOW MSP HELPS */}
      <CostVsFixSection />

      {/* 6. INDUSTRIES WE HELP */}
      <IndustriesSection />

      {/* 7. ABOUT MSP & 8. WHAT BETTER LOOKS LIKE */}
      <AboutAndResultsSection />

      {/* 9. PRIMARY CTA SECTION */}
      <PrimaryCtaSection />

      {/* 10. CONTACT FORM */}
      <ContactFormSection />

      {/* 11. FOOTER */}
      <Footer
        onOpenFaq={() => setFaqOpen(true)}
        onOpenAssessment={() => setAssessmentOpen(true)}
      />

      {/* 12. PERSISTENT BOTTOM-RIGHT CHAT WIDGET */}
      <ChatWidget
        onOpenAssessment={() => setAssessmentOpen(true)}
        onOpenCalculator={() => {
          document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* REVENUE RECOVERY ASSESSMENT™ LEAD MAGNET EXPERIENCE */}
      <AssessmentExperience
        open={assessmentOpen}
        onClose={() => setAssessmentOpen(false)}
        calculatorInputs={calculatorInputs}
        calculatorResult={calculatorResult}
      />

      {/* FAQ Modal */}
      <FaqModal open={faqOpen} onClose={() => setFaqOpen(false)} />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
