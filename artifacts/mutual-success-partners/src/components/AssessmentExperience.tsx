import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Shield,
  Clock,
  Sparkles,
  Phone,
  RefreshCw,
  Filter,
  Settings,
  ChevronRight,
  Calendar,
  Lightbulb,
  Info,
  Building2,
  Lock,
  Home as HomeIcon,
  Hammer,
  Wrench,
  Flame,
  Leaf,
  Briefcase,
  Heart,
  Car,
  Layers,
  Globe,
  MessageSquare,
  Users,
  Mail,
  Share2,
} from 'lucide-react';
import { MspLogo } from './MspLogo';
import {
  assessmentSteps,
  assessmentQuestions,
  calculateAssessmentReport,
  type AssessmentAnswers,
  type AssessmentReport,
  type RecommendedAction,
} from '../assessmentConfig';
import type { CalculatorInputs, CalculatorResult } from '../calculatorConfig';

const BOOKING_URL = 'https://cal.com/mutualsuccesspartners/discovery';

interface AssessmentExperienceProps {
  open: boolean;
  onClose: () => void;
  calculatorInputs?: CalculatorInputs;
  calculatorResult?: CalculatorResult;
  onBookingClick?: () => void;
}

export function AssessmentExperience({
  open,
  onClose,
  calculatorInputs,
  calculatorResult,
  onBookingClick,
}: AssessmentExperienceProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    q1_businessType: 'Roofing Contractor',
    q2_contactMethods: ['Website / Contact Form', 'Phone Calls', 'Referrals / Word of Mouth'],
  });
  const [otherBusinessText, setOtherBusinessText] = useState('');
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  const [leadGateSubmitted, setLeadGateSubmitted] = useState(false);
  const [leadFormData, setLeadFormData] = useState({
    firstName: '',
    businessName: '',
    email: '',
    phone: '',
  });
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [selectedActionDetail, setSelectedActionDetail] = useState<RecommendedAction | null>(null);

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const activeStep = assessmentSteps[stepIndex];
  const activeQuestions = assessmentQuestions.filter((q) => q.stepId === activeStep?.id);
  const isLast = stepIndex === assessmentSteps.length - 1;

  // Validation
  const isStepValid = activeQuestions.every((q) => {
    const val = answers[q.id];
    if (q.type === 'multi') {
      return Array.isArray(val) && val.length > 0;
    }
    return Boolean(val);
  });

  const handleNextStep = () => {
    if (!isStepValid) return;
    if (isLast) {
      // Calculate report
      const computedReport = calculateAssessmentReport(answers, calculatorInputs, calculatorResult);
      setReport(computedReport);
      // Show lead gate before displaying report if not yet submitted
      if (!leadGateSubmitted) {
        setLeadGateOpen(true);
      }
    } else {
      setStepIndex((prev) => prev + 1);
    }
  };

  const handleUnlockReport = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadGateSubmitted(true);
    setLeadGateOpen(false);
  };

  const handleReset = () => {
    setStepIndex(0);
    setAnswers({
      q1_businessType: 'Roofing Contractor',
      q2_contactMethods: ['Website / Contact Form', 'Phone Calls'],
    });
    setReport(null);
    setSelectedActionDetail(null);
  };

  const formatMoney = (val: number) => `$${val.toLocaleString('en-US')}`;

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Home':
        return <HomeIcon size={16} />;
      case 'Hammer':
        return <Hammer size={16} />;
      case 'Wrench':
        return <Wrench size={16} />;
      case 'Flame':
        return <Flame size={16} />;
      case 'Leaf':
        return <Leaf size={16} />;
      case 'Briefcase':
        return <Briefcase size={16} />;
      case 'Heart':
        return <Heart size={16} />;
      case 'Car':
        return <Car size={16} />;
      case 'Globe':
        return <Globe size={16} />;
      case 'Phone':
        return <Phone size={16} />;
      case 'MessageSquare':
        return <MessageSquare size={16} />;
      case 'Users':
        return <Users size={16} />;
      case 'Mail':
        return <Mail size={16} />;
      case 'Share2':
        return <Share2 size={16} />;
      case 'Sparkles':
        return <Sparkles size={16} />;
      default:
        return <Layers size={16} />;
    }
  };

  if (!open) return null;

  const currentOpportunityAmount = calculatorResult?.annualOpportunity ?? 84500;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-lg overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-5xl bg-[#080d16] border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-3 sm:my-6 flex flex-col text-slate-100">
        {/* Top Header Bar */}
        <div className="px-5 sm:px-8 py-4 bg-[#0a101d] border-b border-slate-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MspLogo markSize="h-10 sm:h-12 w-auto" />
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Shield size={14} className="text-sky-400" />
              <span>Your information is safe and never shared.</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer"
              aria-label="Close assessment"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-4 sm:p-8 lg:p-10">
          {!report || (leadGateOpen && !leadGateSubmitted) ? (
            /* QUESTIONNAIRE VIEW */
            <div className="space-y-8">
              {/* Header Hero Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-sky-400 font-mono text-[11px] font-bold uppercase tracking-wider">
                      Revenue Recovery Assessment™
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                    Find Where You’re Losing Revenue.
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    You’ve seen what your opportunities could be worth. Now let’s identify where
                    revenue may be slipping through the cracks — and where to focus first.
                  </p>

                  {/* Value Badges */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 text-[11px] sm:text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                      <Clock size={13} className="text-sky-400" /> Takes 2–3 Minutes
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                      <Sparkles size={13} className="text-sky-400" /> Personalized Results
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                      <Check size={13} className="text-sky-400" /> Actionable Next Steps
                    </span>
                  </div>
                </div>

                {/* Right Summary Card (Connected with Calculator) */}
                <div className="lg:col-span-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0d1627] border border-blue-500/30 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider mb-2">
                    <span>YOUR CALCULATED OPPORTUNITY</span>
                    <Sparkles size={13} className="text-sky-400" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Estimated Annual Revenue Opportunity
                  </p>
                  <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-sky-400 font-mono tracking-tight my-1">
                    {formatMoney(currentOpportunityAmount)}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Based on the numbers you provided in the calculator.
                  </p>
                </div>
              </div>

              {/* 4-Step Stepper Progress Bar */}
              <div className="pt-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                  {assessmentSteps.map((step, idx) => {
                    const isActive = idx === stepIndex;
                    const isPassed = idx < stepIndex;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => {
                          if (isPassed) setStepIndex(idx);
                        }}
                        disabled={!isPassed && !isActive}
                        className={`p-3 rounded-xl border text-left transition-all relative ${
                          isActive
                            ? 'bg-blue-950/40 border-sky-500 text-white shadow-sm ring-1 ring-sky-500/30'
                            : isPassed
                            ? 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-600 cursor-pointer'
                            : 'bg-slate-950/40 border-slate-800/80 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                              isActive
                                ? 'bg-sky-500 text-black'
                                : isPassed
                                ? 'bg-blue-500/20 text-sky-400'
                                : 'bg-slate-900 text-slate-600'
                            }`}
                          >
                            {isPassed ? <Check size={10} strokeWidth={3} /> : idx + 1}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            0{idx + 1}
                          </span>
                        </div>
                        <p className="text-xs font-semibold truncate">{step.title}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Step Content */}
              <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-slate-900/50 border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-400">
                      {activeStep.stepNumber}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{activeStep.title}</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{activeStep.subtitle}</p>
                  </div>

                  {/* Calculator Context Reminder */}
                  {calculatorInputs && (
                    <div className="hidden sm:block text-right">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        Calculator Parameters
                      </span>
                      <p className="text-xs font-mono text-slate-300">
                        {calculatorInputs.monthlyOpportunities} leads/mo •{' '}
                        {formatMoney(calculatorInputs.averageJobValue)} avg
                      </p>
                    </div>
                  )}
                </div>

                {/* Questions for the active step */}
                <div className="space-y-6">
                  {activeQuestions.map((q) => {
                    const currentAnswer = answers[q.id];
                    const selectedList: string[] = Array.isArray(currentAnswer)
                      ? currentAnswer
                      : currentAnswer
                      ? [currentAnswer]
                      : [];

                    const handleSelect = (label: string) => {
                      if (q.type === 'single') {
                        setAnswers((prev) => ({ ...prev, [q.id]: label }));
                      } else {
                        const updated = selectedList.includes(label)
                          ? selectedList.filter((item) => item !== label)
                          : [...selectedList, label];
                        setAnswers((prev) => ({ ...prev, [q.id]: updated }));
                      }
                    };

                    return (
                      <div key={q.id} className="space-y-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-mono font-bold text-sky-400">
                            0{q.number}
                          </span>
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-slate-100">
                              {q.prompt}
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">{q.hint}</p>
                          </div>
                        </div>

                        {/* Options Grid */}
                        <div
                          className={`grid gap-2.5 ${
                            q.id === 'q1_businessType'
                              ? 'grid-cols-1 sm:grid-cols-3'
                              : q.id === 'q2_contactMethods'
                              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                              : 'grid-cols-1'
                          }`}
                        >
                          {q.options.map((opt) => {
                            const isSelected = selectedList.includes(opt.label);
                            return (
                              <button
                                key={opt.label}
                                type="button"
                                onClick={() => handleSelect(opt.label)}
                                className={`p-3.5 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between border cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-600/20 text-white border-sky-400 shadow-md shadow-blue-500/10 ring-1 ring-sky-400/40'
                                    : 'bg-slate-950/80 text-slate-300 border-slate-800/90 hover:border-slate-700 hover:text-white'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  {opt.iconName && (
                                    <span
                                      className={`p-1.5 rounded-lg shrink-0 ${
                                        isSelected
                                          ? 'bg-sky-400/20 text-sky-300'
                                          : 'bg-slate-900 text-slate-400'
                                      }`}
                                    >
                                      {renderIcon(opt.iconName)}
                                    </span>
                                  )}
                                  <span className="font-semibold">{opt.label}</span>
                                </div>

                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                                    isSelected
                                      ? 'bg-sky-400 border-sky-400 text-black'
                                      : 'border-slate-700 bg-slate-900/60'
                                  }`}
                                >
                                  {isSelected && <Check size={12} strokeWidth={3} />}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Optional text input for "Other" */}
                        {q.showOtherInput && answers[q.id] === 'Other Service Business' && (
                          <div className="pt-2">
                            <input
                              type="text"
                              value={otherBusinessText}
                              onChange={(e) => setOtherBusinessText(e.target.value)}
                              placeholder="Please specify your service industry (e.g. Electrician, Painting, Solar)..."
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Navigation & Context note */}
                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Shield size={14} className="text-sky-400" />
                    <span>Your answers remain completely confidential.</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {stepIndex > 0 && (
                      <button
                        type="button"
                        onClick={() => setStepIndex((prev) => prev - 1)}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <ArrowLeft size={15} /> Back
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!isStepValid}
                      className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLast ? 'See My Recovery Report' : 'Next Step'}
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Step Progression Visual Roadmap Footer */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span className="font-mono text-slate-300 font-semibold">1. CALCULATOR</span>
                  <span className="text-slate-500">→</span>
                  <span className="font-mono text-sky-400 font-semibold">2. ASSESSMENT</span>
                  <span className="text-slate-500">→</span>
                  <span className="font-mono text-slate-300 font-semibold">3. RESULTS & ACTION</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  Step {stepIndex + 1} of {assessmentSteps.length}
                </span>
              </div>
            </div>
          ) : (
            /* RESULTS PAGE (PERSONALIZED REPORT - EXACT MATCH TO SPEC IMAGE 2) */
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Header Title with Celebration Badge */}
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Check size={14} className="stroke-[3]" /> ASSESSMENT COMPLETE!
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  Here’s what we found based on your answers.
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  Tailored diagnostic report for{' '}
                  <span className="text-sky-300 font-semibold">{report.businessType}</span>.
                </p>
              </div>

              {/* 3 Top Highlight Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Opportunity Level */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-xl">
                  <div>
                    <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                      YOUR REVENUE RECOVERY OPPORTUNITY
                    </span>
                    <div
                      className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight mt-2 ${
                        report.overallLevel === 'HIGH'
                          ? 'text-rose-500'
                          : report.overallLevel === 'MEDIUM'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {report.overallLevel}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    Your assessment shows multiple areas of opportunity where revenue may be
                    slipping through the cracks.
                  </p>
                </div>

                {/* 2. Estimated Annual Revenue Opportunity */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-xl">
                  <div>
                    <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                      ESTIMATED ANNUAL REVENUE OPPORTUNITY
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400 font-mono tracking-tight mt-2">
                      {formatMoney(report.annualOpportunity)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                    <span>Based on the information you provided in the calculator.</span>
                    <Info size={13} className="text-slate-500 shrink-0" />
                  </p>
                </div>

                {/* 3. Gaps Card (Biggest & Secondary) */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-xl space-y-4">
                  {/* Biggest Gap */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                      <RefreshCw size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        BIGGEST POTENTIAL GAP
                      </span>
                      <p className="text-sm font-bold text-rose-400">{report.biggestGap.name}</p>
                    </div>
                  </div>

                  <div className="h-[1px] bg-slate-800 w-full" />

                  {/* Secondary Gap */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                      <Phone size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        SECONDARY GAP
                      </span>
                      <p className="text-sm font-bold text-amber-400">{report.secondaryGap.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* YOUR REVENUE RECOVERY BREAKDOWN (4 Category Cards) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    YOUR REVENUE RECOVERY BREAKDOWN
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Opportunity Intensity by Pillar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {report.categories.map((cat) => {
                    let IconComponent = Phone;
                    if (cat.key === 'followUp') IconComponent = RefreshCw;
                    if (cat.key === 'conversion') IconComponent = Filter;
                    if (cat.key === 'systems') IconComponent = Settings;

                    const statusBg =
                      cat.status === 'HIGH'
                        ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        : cat.status === 'MEDIUM'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';

                    const barColor =
                      cat.status === 'HIGH'
                        ? 'bg-rose-500'
                        : cat.status === 'MEDIUM'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400';

                    return (
                      <div
                        key={cat.key}
                        className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-slate-800 text-sky-400 flex items-center justify-center">
                              <IconComponent size={14} />
                            </span>
                            <span className="text-xs font-bold text-slate-200">{cat.name}</span>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${statusBg}`}
                          >
                            {cat.status}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${barColor}`}
                              style={{ width: `${Math.max(15, cat.percentage)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                            <span>Gap Level</span>
                            <span>{cat.percentage}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom 2 Diagnostic Columns: WHAT THIS MEANS & TOP 3 RECOMMENDED ACTIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left: What This Means */}
                <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                      WHAT THIS MEANS
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                      Your revenue is leaking through uncaptured follow-up and delayed responses.
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                      {report.whatThisMeans}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
                    <Lightbulb size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Most service companies lose 15–30% of sales purely to communication friction,
                      not lack of market demand.
                    </span>
                  </div>
                </div>

                {/* Right: Top 3 Recommended Actions */}
                <div className="lg:col-span-7 p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                        YOUR TOP 3 RECOMMENDED ACTIONS
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Practical Next Steps
                      </span>
                    </div>

                    {/* Action Cards */}
                    <div className="space-y-3">
                      {report.recommendedActions.map((action) => (
                        <div
                          key={action.id}
                          onClick={() => setSelectedActionDetail(action)}
                          className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/90 transition-all flex items-center justify-between gap-4 cursor-pointer group"
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-sky-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {action.number}
                            </span>
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                                {action.text}
                              </p>
                              <span className="text-[10px] font-mono text-slate-500 uppercase mt-0.5 inline-block">
                                Focus: {action.category}
                              </span>
                            </div>
                          </div>

                          <ChevronRight
                            size={16}
                            className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all shrink-0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-1">
                    Click any action above to review how MSP can help implement this in your
                    operations.
                  </p>
                </div>
              </div>

              {/* Primary Call-to-Action Banner */}
              <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-blue-950/80 border border-sky-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-sky-400 flex items-center justify-center shrink-0">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Want help putting this into action?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                      Let’s review your results together and build a practical plan to recover your
                      lost revenue.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2 shrink-0 w-full md:w-auto">
                  <a
                    href={BOOKING_URL}
                    onClick={() => {
                      if (onBookingClick) onBookingClick();
                    }}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    Review My Results With MSP
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span>✓ Complimentary</span>
                    <span>•</span>
                    <span>✓ 30 Minutes</span>
                    <span>•</span>
                    <span>✓ No Obligation</span>
                  </div>
                </div>
              </div>

              {/* Bottom 2 Footer Informational Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                  <Lightbulb size={18} className="text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                      WHAT’S NEXT?
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      In your discovery review call, we’ll walk through your specific answers,
                      identify where we’d start first, and answer any questions.
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                  <Shield size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                      CONFIDENTIAL & PRIVATE
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Your assessment responses are kept strictly private and will never be shared
                      or sold to third parties.
                    </p>
                  </div>
                </div>
              </div>

              {/* Retake / Exit buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-slate-400 hover:text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} /> Retake Assessment
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-200 font-semibold"
                >
                  Close Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LEAD CAPTURE GATE MODAL */}
      {leadGateOpen && !leadGateSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0a101d] border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-sky-400 flex items-center justify-center mx-auto">
                <Lock size={22} />
              </div>
              <h3 className="text-xl font-bold text-white">Your Results Are Ready</h3>
              <p className="text-xs text-slate-300">
                Where should we send your personalized Revenue Recovery report and action checklist?
              </p>
            </div>

            <form onSubmit={handleUnlockReport} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                  First Name*
                </label>
                <input
                  type="text"
                  required
                  value={leadFormData.firstName}
                  onChange={(e) => setLeadFormData({ ...leadFormData, firstName: e.target.value })}
                  placeholder="e.g. Sarah"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Business Name*
                </label>
                <input
                  type="text"
                  required
                  value={leadFormData.businessName}
                  onChange={(e) =>
                    setLeadFormData({ ...leadFormData, businessName: e.target.value })
                  }
                  placeholder="e.g. Apex Roofing Co."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Work Email*
                </label>
                <input
                  type="email"
                  required
                  value={leadFormData.email}
                  onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
                  placeholder="sarah@apexroofing.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={leadFormData.phone}
                  onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                  placeholder="(555) 000-0000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  View My Revenue Report
                  <ArrowRight size={15} />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <Shield size={12} className="text-slate-400" />
                <span>No spam. 100% confidential.</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTION DETAIL MODAL (WHEN USER CLICKS ON ONE OF THE TOP 3 ACTIONS) */}
      {selectedActionDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0a101d] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-sky-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                Action {selectedActionDetail.number} • {selectedActionDetail.category}
              </span>
              <button
                onClick={() => setSelectedActionDetail(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <h3 className="text-lg font-bold text-white">{selectedActionDetail.text}</h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When MSP partners with your business, we help implement automated workflows,
              response scripts, and sales pipeline tracking so this action is executed consistently
              without burdening your team with manual work.
            </p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedActionDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Close
              </button>
              <a
                href={BOOKING_URL}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"
              >
                Discuss on Discovery Call <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
