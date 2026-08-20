export type ResponseTimeOption = 'Within 5 Min' | 'Same Day' | 'Next Day' | '2+ Days';

export type CalculatorInputs = {
  monthlyOpportunities: number;
  averageJobValue: number;
  conversionRate: number; // e.g., 20 for 20%
  responseTime: ResponseTimeOption;
};

export type OpportunityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type CalculatorResult = {
  annualOpportunity: number;
  additionalMonthlyRevenue: number;
  additionalJobs: number;
  estimatedJobsMissed: number;
  opportunityLevel: OpportunityLevel;
  growthScore: number;
  category: string;
  roi: number;
};

export const BOOKING_URL = 'mailto:andrew@mutualsuccesspartners.com?subject=Discovery%20Call%20Request';

export const calculatorConfig = {
  fields: {
    monthlyOpportunities: { min: 5, max: 200, step: 1, defaultValue: 25 },
    averageJobValue: { min: 500, max: 100000, step: 250, defaultValue: 12000 },
    conversionRate: { min: 5, max: 75, step: 1, defaultValue: 20 },
    responseTime: { defaultValue: 'Same Day' as ResponseTimeOption },
  },
  responseLeakageMultipliers: {
    'Within 5 Min': 0.12, // 12% recoverable friction
    'Same Day': 0.28,      // 28% friction
    'Next Day': 0.48,      // 48% friction
    '2+ Days': 0.65,       // 65% friction
  },
};

export const calculateResults = (inputs: CalculatorInputs): CalculatorResult => {
  const { monthlyOpportunities, averageJobValue, conversionRate, responseTime } = inputs;
  
  // Potential monthly closed jobs currently
  const currentMonthlyJobs = (monthlyOpportunities * (conversionRate / 100));
  
  // Response leakage multiplier
  const leakRate = calculatorConfig.responseLeakageMultipliers[responseTime] || 0.28;
  
  // Missed opportunities per month due to friction, slow follow up and dropped estimates
  const missedMonthlyLeads = monthlyOpportunities * leakRate;
  
  // Potential additional jobs captured if systems and speed to lead are fixed
  // An optimized process captures roughly 25-40% of those leaked leads at the baseline conversion rate or higher
  const estimatedJobsMissedPerYear = Math.max(1, Math.round(missedMonthlyLeads * (Math.max(conversionRate, 15) / 100) * 12 * 0.85));
  
  // Annual Revenue Opportunity
  const annualOpportunity = Math.round(estimatedJobsMissedPerYear * averageJobValue);
  const additionalMonthlyRevenue = Math.round(annualOpportunity / 12);
  const additionalJobs = Math.max(1, Math.round(estimatedJobsMissedPerYear / 12));
  
  // Opportunity level: based on annual dollar exposure & response friction
  let opportunityLevel: OpportunityLevel = 'MEDIUM';
  if (responseTime === '2+ Days' || annualOpportunity >= 75000 || leakRate >= 0.45) {
    opportunityLevel = 'HIGH';
  } else if (responseTime === 'Within 5 Min' && annualOpportunity < 30000) {
    opportunityLevel = 'LOW';
  } else {
    opportunityLevel = 'MEDIUM';
  }

  // Growth Score out of 100 (inverse of leakage, higher is healthier)
  const growthScore = Math.max(15, Math.min(95, Math.round(100 - (leakRate * 100 * 0.75 + (100 - conversionRate) * 0.25))));

  const category =
    opportunityLevel === 'HIGH'
      ? 'High Revenue Opportunity'
      : opportunityLevel === 'MEDIUM'
      ? 'Moderate Revenue Opportunity'
      : 'Revenue Optimized';

  const roi = Math.max(1.5, Math.round((annualOpportunity / 24000) * 10) / 10);

  return {
    annualOpportunity,
    additionalMonthlyRevenue,
    additionalJobs,
    estimatedJobsMissed: estimatedJobsMissedPerYear,
    opportunityLevel,
    growthScore,
    category,
    roi,
  };
};
