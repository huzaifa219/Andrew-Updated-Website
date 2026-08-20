import type { CalculatorInputs, CalculatorResult } from './calculatorConfig';

export type AssessmentAnswer = string | string[];
export type AssessmentAnswers = Record<string, AssessmentAnswer>;

export interface QuestionOption {
  label: string;
  sublabel?: string;
  points: number; // 0 = Strong / little gap; 1 = Some opportunity; 2 = Meaningful gap; 3 = Significant gap
  iconName?: string;
}

export interface AssessmentQuestion {
  id: string;
  number: number;
  stepId: string;
  prompt: string;
  hint: string;
  type: 'single' | 'multi';
  options: QuestionOption[];
  showOtherInput?: boolean;
}

export interface AssessmentStep {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  questionIds: string[];
}

export interface CategoryScore {
  name: string;
  key: 'leadResponse' | 'followUp' | 'conversion' | 'systems';
  pointsEarned: number;
  possiblePoints: number;
  percentage: number;
  status: 'LOW' | 'MEDIUM' | 'HIGH';
  statusColor: 'emerald' | 'amber' | 'red';
}

export interface RecommendedAction {
  id: string;
  number: string;
  text: string;
  category: string;
  detail?: string;
}

export interface AssessmentReport {
  overallLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  overallPercentage: number;
  annualOpportunity: number;
  biggestGap: {
    name: string;
    categoryKey: string;
    percentage: number;
  };
  secondaryGap: {
    name: string;
    categoryKey: string;
    percentage: number;
  };
  categories: CategoryScore[];
  whatThisMeans: string;
  recommendedActions: RecommendedAction[];
  businessType: string;
}

export const assessmentSteps: AssessmentStep[] = [
  {
    id: 'business',
    stepNumber: 'STEP 01 OF 04',
    title: 'Your Business',
    subtitle: 'Tell us a little about your business and how opportunities come in.',
    questionIds: ['q1_businessType'],
  },
  {
    id: 'lead-response',
    stepNumber: 'STEP 02 OF 04',
    title: 'Lead & Response',
    subtitle: 'How new opportunities arrive and how quickly they receive a response.',
    questionIds: ['q2_contactMethods', 'q3_missedCalls'],
  },
  {
    id: 'conversion-followup',
    stepNumber: 'STEP 03 OF 04',
    title: 'Conversion & Follow-Up',
    subtitle: 'How opportunities are managed after the initial conversation and quote.',
    questionIds: ['q4_followUpProcess', 'q5_quoteFollowUp', 'q6_handlingUndecided'],
  },
  {
    id: 'systems-growth',
    stepNumber: 'STEP 04 OF 04',
    title: 'Systems & Growth',
    subtitle: 'The tracking, re-engagement, and priorities driving your revenue.',
    questionIds: ['q7_leadTracking', 'q8_reengagement', 'q9_priority'],
  },
];

export const assessmentQuestions: AssessmentQuestion[] = [
  // STEP 1 - YOUR BUSINESS
  {
    id: 'q1_businessType',
    number: 1,
    stepId: 'business',
    prompt: 'Which best describes your business?',
    hint: 'Select one.',
    type: 'single',
    showOtherInput: true,
    options: [
      { label: 'Roofing Contractor', points: 0, iconName: 'Home' },
      { label: 'Custom Home Builder', points: 0, iconName: 'Hammer' },
      { label: 'Residential Contractor', points: 0, iconName: 'Wrench' },
      { label: 'Plumber / HVAC', points: 0, iconName: 'Flame' },
      { label: 'Landscaping / Outdoor', points: 0, iconName: 'Leaf' },
      { label: 'Professional Services', points: 0, iconName: 'Briefcase' },
      { label: 'Health / Wellness', points: 0, iconName: 'Heart' },
      { label: 'Automotive', points: 0, iconName: 'Car' },
      { label: 'Other Service Business', points: 0, iconName: 'Layers' },
    ],
  },

  // STEP 2 - LEAD & RESPONSE
  {
    id: 'q2_contactMethods',
    number: 2,
    stepId: 'lead-response',
    prompt: 'How do most new opportunities currently find your business?',
    hint: 'Select all that apply.',
    type: 'multi',
    options: [
      { label: 'Website / Contact Form', points: 0, iconName: 'Globe' },
      { label: 'Phone Calls', points: 0, iconName: 'Phone' },
      { label: 'Text / SMS', points: 0, iconName: 'MessageSquare' },
      { label: 'Referrals / Word of Mouth', points: 0, iconName: 'Users' },
      { label: 'Email Inquiries', points: 0, iconName: 'Mail' },
      { label: 'Social Media / DM', points: 0, iconName: 'Share2' },
      { label: 'Paid Ads (Google / Meta)', points: 0, iconName: 'Sparkles' },
      { label: 'Other', points: 0, iconName: 'Layers' },
    ],
  },
  {
    id: 'q3_missedCalls',
    number: 3,
    stepId: 'lead-response',
    prompt: 'What typically happens when a potential customer calls and no one answers?',
    hint: 'Select one.',
    type: 'single',
    options: [
      { label: 'Quick callback or automatic text / acknowledgment', points: 0 },
      { label: 'Voicemail with reliable same-day callback', points: 1 },
      { label: 'Inconsistent process (depends on who is available)', points: 2 },
      { label: 'No defined process / Not sure', points: 3 },
    ],
  },

  // STEP 3 - CONVERSION & FOLLOW-UP
  {
    id: 'q4_followUpProcess',
    number: 4,
    stepId: 'conversion-followup',
    prompt: 'Do new opportunities have a defined follow-up process?',
    hint: 'Select one.',
    type: 'single',
    options: [
      { label: 'Same defined multi-touch process for every lead', points: 0 },
      { label: 'Mostly consistent, but person-dependent', points: 1 },
      { label: 'Inconsistent follow-up across our team', points: 2 },
      { label: 'No defined follow-up process', points: 3 },
    ],
  },
  {
    id: 'q5_quoteFollowUp',
    number: 5,
    stepId: 'conversion-followup',
    prompt: 'After a quote, estimate, or proposal goes quiet, what happens?',
    hint: 'Select one.',
    type: 'single',
    options: [
      { label: 'Defined multi-touch follow-up cadence until decision', points: 0 },
      { label: '1–2 follow-up attempts, then we stop', points: 1 },
      { label: 'Person-dependent / followed up only when remembered', points: 2 },
      { label: 'We wait for the customer to reach back out', points: 3 },
      { label: 'N/A (We do not send quotes or estimates)', points: -1 },
    ],
  },
  {
    id: 'q6_handlingUndecided',
    number: 6,
    stepId: 'conversion-followup',
    prompt: 'How do you handle opportunities that don’t buy right away?',
    hint: 'Select one.',
    type: 'single',
    options: [
      { label: 'Ongoing nurture campaign & periodic check-ins', points: 0 },
      { label: 'Occasional follow-up when time permits', points: 1 },
      { label: 'Manual notes / when someone happens to remember', points: 2 },
      { label: 'Marked lost or moved on immediately', points: 3 },
      { label: 'Not sure / no set strategy', points: 3 },
    ],
  },

  // STEP 4 - SYSTEMS & GROWTH
  {
    id: 'q7_leadTracking',
    number: 7,
    stepId: 'systems-growth',
    prompt: 'Where do you track leads and active opportunities?',
    hint: 'Select one.',
    type: 'single',
    options: [
      { label: 'Centralized CRM with active stage tracking', points: 0 },
      { label: 'Organized shared spreadsheet / multiple coordinated tools', points: 1 },
      { label: 'Email inbox, calendar & personal notes', points: 2 },
      { label: 'Multiple disconnected systems', points: 2 },
      { label: 'Not consistently tracked in one place', points: 3 },
    ],
  },
  {
    id: 'q8_reengagement',
    number: 8,
    stepId: 'systems-growth',
    prompt: 'Do you have a process for re-engaging old, inactive, or lost opportunities?',
    hint: 'Select one.',
    type: 'single',
    options: [
      { label: 'Yes, consistent campaigns to past leads and unclosed quotes', points: 0 },
      { label: 'Occasionally reach out once or twice a year', points: 1 },
      { label: 'Manual only / individual rep discretion', points: 2 },
      { label: 'No re-engagement process in place', points: 3 },
      { label: 'Not sure', points: 3 },
    ],
  },
  {
    id: 'q9_priority',
    number: 9,
    stepId: 'systems-growth',
    prompt: 'What is your #1 improvement priority right now?',
    hint: 'Select one.',
    type: 'single',
    options: [
      { label: 'Faster lead response speed', points: 0 },
      { label: 'Better follow-up on open quotes & proposals', points: 0 },
      { label: 'Higher overall closing / conversion rate', points: 0 },
      { label: 'Recovering old, inactive, or lost opportunities', points: 0 },
      { label: 'More qualified opportunities / inquiries', points: 0 },
      { label: 'Improving our sales process & visibility', points: 0 },
      { label: 'Systems, operations & automation', points: 0 },
      { label: 'Not sure yet', points: 0 },
    ],
  },
];

// Helper to get status from percentage (LOW = 0-25%, MEDIUM = 26-55%, HIGH = 56-100%)
export function getGapStatus(pct: number): {
  status: 'LOW' | 'MEDIUM' | 'HIGH';
  statusColor: 'emerald' | 'amber' | 'red';
} {
  if (pct <= 25) return { status: 'LOW', statusColor: 'emerald' };
  if (pct <= 55) return { status: 'MEDIUM', statusColor: 'amber' };
  return { status: 'HIGH', statusColor: 'red' };
}

export function calculateAssessmentReport(
  answers: AssessmentAnswers,
  calculatorInputs?: CalculatorInputs,
  calculatorResult?: CalculatorResult
): AssessmentReport {
  // 1. LEAD RESPONSE SCORE: Calculator response time (0-3) + Q3 Missed Call (0-3)
  // Response time: Within 5 min = 0; 5–30 min = 1; Same day = 2; Next day / 2+ days = 3
  let responseTimePoints = 0;
  const respTime = calculatorInputs?.responseTime ?? 'Within 5 Min';
  if (respTime === 'Within 5 Min') responseTimePoints = 0;
  else if (respTime === 'Same Day') responseTimePoints = 2;
  else if (respTime === 'Next Day' || respTime === '2+ Days') responseTimePoints = 3;
  else responseTimePoints = 1;

  // Q3 points
  const q3Answer = answers['q3_missedCalls'] as string | undefined;
  const q3Option = assessmentQuestions
    .find((q) => q.id === 'q3_missedCalls')
    ?.options.find((opt) => opt.label === q3Answer);
  const q3Points = q3Option ? q3Option.points : 2;

  const leadResponseEarned = responseTimePoints + q3Points;
  const leadResponsePossible = 6;
  const leadResponsePct = Math.round((leadResponseEarned / leadResponsePossible) * 100);
  const leadResponseStatus = getGapStatus(leadResponsePct);

  // 2. FOLLOW-UP SCORE: Q4 + Q5 + Q6
  // (N/A in Q5 is excluded from denominator)
  const q4Answer = answers['q4_followUpProcess'] as string | undefined;
  const q4Option = assessmentQuestions
    .find((q) => q.id === 'q4_followUpProcess')
    ?.options.find((opt) => opt.label === q4Answer);
  const q4Points = q4Option ? q4Option.points : 2;

  const q5Answer = answers['q5_quoteFollowUp'] as string | undefined;
  const q5Option = assessmentQuestions
    .find((q) => q.id === 'q5_quoteFollowUp')
    ?.options.find((opt) => opt.label === q5Answer);
  const q5IsNA = q5Option && q5Option.points === -1;
  const q5Points = q5IsNA ? 0 : q5Option ? q5Option.points : 2;

  const q6Answer = answers['q6_handlingUndecided'] as string | undefined;
  const q6Option = assessmentQuestions
    .find((q) => q.id === 'q6_handlingUndecided')
    ?.options.find((opt) => opt.label === q6Answer);
  const q6Points = q6Option ? q6Option.points : 2;

  let followUpEarned = q4Points + q6Points;
  let followUpPossible = 6;
  if (!q5IsNA) {
    followUpEarned += q5Points;
    followUpPossible += 3;
  }
  const followUpPct = Math.round((followUpEarned / followUpPossible) * 100);
  const followUpStatus = getGapStatus(followUpPct);

  // 3. CONVERSION SCORE: Q5 + Q6 + conversion context
  let conversionEarned = q6Points;
  let conversionPossible = 3;
  if (!q5IsNA) {
    conversionEarned += q5Points;
    conversionPossible += 3;
  }
  // Conversion rate context modifier: low conversion rate adds slight severity
  const currentConversion = calculatorInputs?.conversionRate ?? 20;
  if (currentConversion < 15) {
    conversionEarned += 1;
    conversionPossible += 1;
  }
  const conversionPct = Math.round((conversionEarned / conversionPossible) * 100);
  const conversionStatus = getGapStatus(conversionPct);

  // 4. SYSTEMS SCORE: Q4 + Q7 + Q8
  const q7Answer = answers['q7_leadTracking'] as string | undefined;
  const q7Option = assessmentQuestions
    .find((q) => q.id === 'q7_leadTracking')
    ?.options.find((opt) => opt.label === q7Answer);
  const q7Points = q7Option ? q7Option.points : 2;

  const q8Answer = answers['q8_reengagement'] as string | undefined;
  const q8Option = assessmentQuestions
    .find((q) => q.id === 'q8_reengagement')
    ?.options.find((opt) => opt.label === q8Answer);
  const q8Points = q8Option ? q8Option.points : 2;

  const systemsEarned = q4Points + q7Points + q8Points;
  const systemsPossible = 9;
  const systemsPct = Math.round((systemsEarned / systemsPossible) * 100);
  const systemsStatus = getGapStatus(systemsPct);

  // 5. CATEGORIES ARRAY
  const categories: CategoryScore[] = [
    {
      name: 'Lead Response',
      key: 'leadResponse',
      pointsEarned: leadResponseEarned,
      possiblePoints: leadResponsePossible,
      percentage: leadResponsePct,
      status: leadResponseStatus.status,
      statusColor: leadResponseStatus.statusColor,
    },
    {
      name: 'Follow-Up',
      key: 'followUp',
      pointsEarned: followUpEarned,
      possiblePoints: followUpPossible,
      percentage: followUpPct,
      status: followUpStatus.status,
      statusColor: followUpStatus.statusColor,
    },
    {
      name: 'Conversion',
      key: 'conversion',
      pointsEarned: conversionEarned,
      possiblePoints: conversionPossible,
      percentage: conversionPct,
      status: conversionStatus.status,
      statusColor: conversionStatus.statusColor,
    },
    {
      name: 'Systems',
      key: 'systems',
      pointsEarned: systemsEarned,
      possiblePoints: systemsPossible,
      percentage: systemsPct,
      status: systemsStatus.status,
      statusColor: systemsStatus.statusColor,
    },
  ];

  // 6. OVERALL REVENUE RECOVERY OPPORTUNITY
  const totalEarned = leadResponseEarned + followUpEarned + conversionEarned + systemsEarned;
  const totalPossible = leadResponsePossible + followUpPossible + conversionPossible + systemsPossible;
  const overallPercentage = Math.round((totalEarned / totalPossible) * 100);
  const overallLevel = getGapStatus(overallPercentage).status;

  // 7. BIGGEST GAP & SECONDARY GAP (Sort by percentage descending)
  const sortedCategories = [...categories].sort((a, b) => b.percentage - a.percentage);
  const biggestGap = {
    name: sortedCategories[0].name,
    categoryKey: sortedCategories[0].key,
    percentage: sortedCategories[0].percentage,
  };
  const secondaryGap = {
    name: sortedCategories[1].name,
    categoryKey: sortedCategories[1].key,
    percentage: sortedCategories[1].percentage,
  };

  // 8. DYNAMIC TOP 3 PRACTICAL RECOMMENDED ACTIONS
  const potentialActions: Record<string, string[]> = {
    followUp: [
      'Create a consistent follow-up cadence for every quote or proposal that doesn’t receive an immediate decision.',
      'Build a re-engagement process for qualified opportunities that previously went cold or stalled.',
      'Establish a clear multi-touch protocol so sales reps know exactly when and how to follow up next.',
    ],
    leadResponse: [
      'Improve response coverage so new inquiries receive immediate acknowledgment even during busy hours.',
      'Implement an automated missed-call text-back system to capture callers before they contact a competitor.',
      'Route inbound phone calls and form fills to designated responders with a 5-minute response target.',
    ],
    conversion: [
      'Implement a structured estimate review walkthrough to increase quote-to-close conversion rates.',
      'Track lost-deal reasons systematically to uncover recurring objections and pricing hesitation.',
      'Establish a follow-up schedule for undecided prospects rather than waiting for them to reach back out.',
    ],
    systems: [
      'Centralize all inbound leads and quotes into a unified CRM pipeline for total team visibility.',
      'Automate reminders and task ownership so active opportunities never slip through administrative cracks.',
      'Launch a reactivation campaign targeting past inquiries and previous customer databases.',
    ],
  };

  const actionPool: RecommendedAction[] = [];
  const primaryActions = potentialActions[biggestGap.categoryKey] || potentialActions.followUp;
  const secondaryActions = potentialActions[secondaryGap.categoryKey] || potentialActions.leadResponse;

  actionPool.push({
    id: 'act-1',
    number: '01',
    text: primaryActions[0],
    category: biggestGap.name,
  });
  actionPool.push({
    id: 'act-2',
    number: '02',
    text: primaryActions[1] || secondaryActions[0],
    category: biggestGap.name,
  });
  actionPool.push({
    id: 'act-3',
    number: '03',
    text: secondaryActions[0] !== actionPool[1].text ? secondaryActions[0] : secondaryActions[1] || 'Centralize lead tracking and streamline follow-up handoffs across your team.',
    category: secondaryGap.name,
  });

  // 9. DYNAMIC "WHAT THIS MEANS" PARAGRAPH
  let whatThisMeans = '';
  if (overallLevel === 'HIGH') {
    whatThisMeans =
      'Your business is generating steady opportunities, but gaps in response speed, quote follow-up, or lead tracking are likely allowing qualified prospects to slip away to competitors. Prioritizing systematic follow-up and faster inquiry acknowledgment will immediately protect the revenue you are already paying or working to generate.';
  } else if (overallLevel === 'MEDIUM') {
    whatThisMeans =
      'You have solid fundamentals in place, but inconsistent follow-up cadence and missed re-engagement opportunities create friction in your sales pipeline. Tightening your response and proposal follow-up systems will help you convert a higher percentage of existing interest into closed jobs.';
  } else {
    whatThisMeans =
      'Your team demonstrates strong response habits and organized tracking. The highest leverage gains will come from automating re-engagement with past estimates and optimizing multi-touch follow-up on higher-value opportunities.';
  }

  const businessType = (answers['q1_businessType'] as string) || 'Service Business';
  const annualOpportunity = calculatorResult?.annualOpportunity ?? 84500;

  return {
    overallLevel,
    overallPercentage,
    annualOpportunity,
    biggestGap,
    secondaryGap,
    categories,
    whatThisMeans,
    recommendedActions: actionPool.slice(0, 3),
    businessType,
  };
}
