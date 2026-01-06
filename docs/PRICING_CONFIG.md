# 💰 CodeMentor AI - Pricing Configuration

This document provides the technical implementation details for the pricing and billing system.

---

## 🔧 Stripe Configuration

### Product IDs and Price IDs

```javascript
// B2C Subscription Products
const PRICING_CONFIG = {
  products: {
    free: {
      id: 'prod_free_tier',
      name: 'Learner (Free)',
      features: {
        aiInteractions: 5,
        challengesAccess: 50,
        codeExecutions: 0,
        collaboration: false,
        analytics: 'basic',
        support: 'community'
      }
    },
    
    starter: {
      monthly: {
        stripeId: 'price_starter_monthly',
        priceUSD: 1900, // $19.00 in cents
        interval: 'month'
      },
      yearly: {
        stripeId: 'price_starter_yearly',
        priceUSD: 18000, // $180.00 in cents (save 21%)
        interval: 'year'
      },
      features: {
        aiInteractions: -1, // unlimited
        challengesAccess: 500,
        codeExecutions: 100,
        collaboration: 'basic',
        analytics: 'advanced',
        support: 'email',
        certificates: true
      }
    },
    
    pro: {
      monthly: {
        stripeId: 'price_pro_monthly',
        priceUSD: 4900, // $49.00
        interval: 'month'
      },
      yearly: {
        stripeId: 'price_pro_yearly',
        priceUSD: 46800, // $468.00 (save 20%)
        interval: 'year'
      },
      features: {
        aiInteractions: -1,
        challengesAccess: -1,
        codeExecutions: -1,
        collaboration: 'advanced',
        interviewPrep: true,
        portfolioBuilder: true,
        jobMatching: true,
        analytics: 'advanced',
        support: 'priority',
        apiAccess: 'basic'
      }
    },
    
    teams: {
      monthly: {
        stripeId: 'price_teams_monthly',
        priceUSD: 3900, // $39.00 per user
        interval: 'month',
        minSeats: 3
      },
      features: {
        // Includes all Pro features plus:
        teamDashboard: true,
        teamAnalytics: true,
        adminControls: true,
        ssoIntegration: true,
        invoiceBilling: true,
        dedicatedManager: { threshold: 10 } // 10+ users
      }
    }
  }
}
```

### Regional Pricing Multipliers

```javascript
const REGIONAL_PRICING = {
  // Full price markets
  'US': { multiplier: 1.0, currency: 'USD' },
  'CA': { multiplier: 1.0, currency: 'CAD' },
  'GB': { multiplier: 1.0, currency: 'GBP' },
  'AU': { multiplier: 1.0, currency: 'AUD' },
  'EU': { multiplier: 1.0, currency: 'EUR' },
  
  // Latin America (40% discount)
  'MX': { multiplier: 0.6, currency: 'MXN' },
  'AR': { multiplier: 0.6, currency: 'ARS' },
  'CO': { multiplier: 0.6, currency: 'COP' },
  'CL': { multiplier: 0.6, currency: 'CLP' },
  'ES': { multiplier: 0.6, currency: 'EUR' },
  
  // Brazil (50% discount)
  'BR': { multiplier: 0.5, currency: 'BRL' },
  
  // Asia (60% discount)
  'IN': { multiplier: 0.4, currency: 'INR' },
  'ID': { multiplier: 0.4, currency: 'IDR' },
  'PH': { multiplier: 0.4, currency: 'PHP' },
  'VN': { multiplier: 0.4, currency: 'VND' }
}
```

---

## 🏢 Enterprise Pricing Configuration

```javascript
const ENTERPRISE_PRICING = {
  education: {
    base: {
      price: 15000, // $15,000 for up to 100 students
      included_seats: 100,
      currency: 'USD'
    },
    additional_seat: {
      price: 120, // $120 per additional student
      volume_discounts: [
        { min_seats: 500, discount: 0.10 },  // 10% off
        { min_seats: 1000, discount: 0.20 }  // 20% off
      ]
    },
    features: [
      'unlimited_student_licenses',
      'instructor_dashboard',
      'class_management',
      'custom_challenges',
      'gradebook_integration',
      'lms_integration',
      'sso_saml',
      'data_export',
      'dedicated_account_manager',
      'priority_support_4h',
      'custom_branding',
      'ferpa_compliance',
      'sla_99_9'
    ]
  },
  
  corporate: {
    base: {
      price: 50000, // $50,000 for up to 100 employees
      included_seats: 100,
      currency: 'USD'
    },
    additional_seat: {
      price: 400, // $400 per additional employee
      volume_discounts: [
        { min_seats: 500, discount: 0.15 },  // 15% off
        { min_seats: 1000, discount: 0.25 }  // 25% off
      ]
    },
    features: [
      // All education features plus:
      'custom_skill_assessments',
      'interview_simulation',
      'team_competitions',
      'advanced_analytics',
      'hris_integration',
      'custom_learning_paths',
      'white_label',
      'on_premise_deployment',
      'soc2_compliance',
      'gdpr_compliance',
      'dedicated_csm',
      'custom_sla'
    ]
  },
  
  bootcamp: {
    base: {
      price: 30000, // $30,000 for up to 200 students per cohort
      included_seats: 200,
      currency: 'USD',
      unlimited_cohorts: true
    },
    revenue_share: {
      enabled: true,
      percentage: 0.15, // 15% of tuition fees
      alternative_to: 'base' // Can choose either fixed or revenue share
    },
    features: [
      // All education features plus:
      'cohort_management',
      'job_placement_tracking',
      'alumni_network',
      'career_services',
      'employer_portal',
      'custom_curriculum',
      'outcome_reporting',
      'co_marketing'
    ]
  }
}
```

---

## 🔌 API Pricing Configuration

```javascript
const API_PRICING = {
  challenge_api: {
    base: {
      price: 500, // $500/month
      currency: 'USD',
      interval: 'month'
    },
    usage: {
      per_call: 0.10, // $0.10 per API call
      included_calls: 5000, // 5,000 calls included in base
      rate_limit: {
        requests_per_minute: 100,
        requests_per_day: 50000
      }
    },
    features: [
      '1000+ coding challenges',
      'difficulty ratings',
      'test case validation',
      'automatic grading',
      'progress tracking'
    ]
  },
  
  ai_tutor_api: {
    base: {
      price: 2000, // $2,000/month
      currency: 'USD',
      interval: 'month'
    },
    usage: {
      per_interaction: 0.50, // $0.50 per AI interaction
      included_interactions: 4000, // 4,000 included
      rate_limit: {
        requests_per_minute: 50,
        requests_per_day: 20000
      }
    },
    features: [
      'ai_powered_analysis',
      'natural_language_explanations',
      'personalized_hints',
      'multi_language_support',
      'context_aware_responses'
    ]
  },
  
  code_execution_api: {
    base: {
      price: 1000, // $1,000/month
      currency: 'USD',
      interval: 'month'
    },
    usage: {
      per_execution: 0.05, // $0.05 per execution
      included_executions: 20000, // 20,000 included
      rate_limit: {
        requests_per_minute: 200,
        requests_per_day: 100000
      }
    },
    features: [
      'secure_sandbox',
      '15+ languages',
      'real_time_results',
      'resource_limits',
      'fast_execution'
    ]
  },
  
  enterprise_suite: {
    base: {
      price: 10000, // $10,000/month
      currency: 'USD',
      interval: 'month'
    },
    usage: {
      volume_pricing: true,
      custom_rates: true,
      included_all_apis: true
    },
    features: [
      'all_api_products',
      'higher_rate_limits',
      'priority_support',
      'custom_sla',
      'dedicated_infrastructure',
      'white_label'
    ],
    rate_limit: {
      requests_per_minute: 1000,
      requests_per_day: 1000000
    }
  }
}
```

---

## 💳 Payment Methods Configuration

```javascript
const PAYMENT_METHODS = {
  global: [
    'card', // Visa, Mastercard, Amex
    'paypal',
    'apple_pay',
    'google_pay'
  ],
  
  regional: {
    BR: ['pix', 'boleto'], // Brazil
    MX: ['oxxo'],          // Mexico
    IN: ['upi', 'paytm'],  // India
    ID: ['gopay', 'ovo'],  // Indonesia
    AR: ['mercado_pago']   // Argentina
  },
  
  crypto: {
    enabled: ['pro', 'teams'], // Only for Pro and Teams tiers
    supported: ['bitcoin', 'ethereum', 'usdc']
  },
  
  enterprise: {
    invoice: true,
    wire_transfer: true,
    purchase_order: true,
    net_terms: [30, 60, 90] // Payment terms
  }
}
```

---

## 🎯 Discount & Promotion Configuration

```javascript
const DISCOUNTS = {
  // Student discount
  student: {
    percentage: 0.50, // 50% off
    verification_required: true,
    verification_methods: ['sheerid', 'university_email'],
    applicable_tiers: ['starter', 'pro']
  },
  
  // Nonprofit discount
  nonprofit: {
    percentage: 0.30, // 30% off
    verification_required: true,
    applicable_tiers: ['teams', 'enterprise']
  },
  
  // Annual vs monthly discount (already built into yearly pricing)
  annual_savings: {
    starter: 0.21, // 21% savings
    pro: 0.20      // 20% savings
  },
  
  // Referral program
  referral: {
    referrer_reward: {
      type: 'credit',
      amount: 1900, // $19 credit (1 month Starter)
      duration: 'one_time'
    },
    referee_reward: {
      type: 'discount',
      percentage: 0.20, // 20% off first month
      duration: 1 // 1 month
    }
  },
  
  // Launch promotion
  launch_promo: {
    code: 'LAUNCH2026',
    percentage: 0.30, // 30% off
    duration: 3, // 3 months
    expires: '2026-03-31',
    max_uses: 1000,
    applicable_tiers: ['starter', 'pro']
  }
}
```

---

## 🔄 Subscription Lifecycle

```javascript
const SUBSCRIPTION_POLICIES = {
  trial: {
    enabled: false, // No trial period (free tier serves this purpose)
    duration_days: 0
  },
  
  billing: {
    cycle: {
      monthly: 'monthly',
      yearly: 'yearly'
    },
    proration: true, // Prorate on upgrades/downgrades
    credit_unused: true // Credit unused time on downgrades
  },
  
  cancellation: {
    effective: 'end_of_period', // Service continues until end of paid period
    refund_policy: {
      days: 30, // 30-day money-back guarantee
      conditions: 'first_payment_only'
    }
  },
  
  failed_payment: {
    retry_schedule: [3, 5, 7, 14], // Days after failure
    grace_period: 7, // Days before downgrade to free
    dunning_emails: true
  },
  
  upgrades: {
    effective: 'immediate',
    proration: true
  },
  
  downgrades: {
    effective: 'end_of_period',
    credit_applied: true
  }
}
```

---

## 📊 Metering & Usage Tracking

```javascript
const USAGE_METERING = {
  ai_interactions: {
    tracked: true,
    limits: {
      free: 5, // per day
      starter: -1, // unlimited
      pro: -1,
      teams: -1
    },
    reset_interval: 'daily'
  },
  
  code_executions: {
    tracked: true,
    limits: {
      free: 0,
      starter: 100, // per day
      pro: -1,
      teams: -1
    },
    reset_interval: 'daily'
  },
  
  api_calls: {
    tracked: true,
    metered_billing: true,
    reporting_interval: 'monthly',
    billing_interval: 'monthly'
  },
  
  storage: {
    tracked: true,
    limits: {
      free: 100, // MB
      starter: 1000,
      pro: 10000,
      teams: 50000
    }
  },
  
  collaboration_sessions: {
    tracked: true,
    limits: {
      free: 0,
      starter: 1, // concurrent session
      pro: -1,
      teams: -1
    }
  }
}
```

---

## 🌍 Tax Configuration

```javascript
const TAX_CONFIG = {
  us_sales_tax: {
    enabled: true,
    provider: 'stripe_tax',
    nexus_states: [
      'CA', 'NY', 'TX', 'FL', 'WA', 'IL', 'PA', 'OH', 'GA', 'NC'
    ]
  },
  
  eu_vat: {
    enabled: true,
    provider: 'stripe_tax',
    vat_moss_registered: true,
    reverse_charge: true // For B2B transactions
  },
  
  other_regions: {
    gst_india: { enabled: true, rate: 0.18 },
    gst_australia: { enabled: true, rate: 0.10 },
    hst_canada: { enabled: true, varies_by_province: true }
  },
  
  exemptions: {
    educational_institutions: true, // May be exempt in some jurisdictions
    nonprofits: true,
    government: true
  }
}
```

---

## 🔐 Implementation Checklist

### Phase 1: Basic Setup
- [ ] Create Stripe account and configure products
- [ ] Set up product catalog with all tiers
- [ ] Configure webhook endpoints for subscription events
- [ ] Implement basic subscription management
- [ ] Test payment flows

### Phase 2: Advanced Features
- [ ] Implement regional pricing logic
- [ ] Set up metered billing for API usage
- [ ] Configure dunning and retry logic
- [ ] Add discount and promotion system
- [ ] Implement referral program

### Phase 3: Enterprise
- [ ] Set up invoice billing
- [ ] Configure SSO integrations
- [ ] Implement custom contract management
- [ ] Add usage reporting for enterprise

### Phase 4: Optimization
- [ ] Set up revenue analytics
- [ ] Implement A/B testing for pricing
- [ ] Add churn prevention automation
- [ ] Configure tax handling for all regions
- [ ] Set up compliance tracking

---

## 📝 Notes

- All prices are in USD cents for Stripe (e.g., $19.00 = 1900)
- Regional pricing uses multipliers applied to base USD price
- Enterprise pricing is negotiable and may vary
- API usage is metered and billed monthly in arrears
- Free tier has no payment method required
- All paid tiers include 30-day money-back guarantee
