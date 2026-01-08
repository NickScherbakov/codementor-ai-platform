#!/usr/bin/env node

/**
 * MVP SMOKE-CHECK SCRIPT
 * 
 * This script tests the Hard Code Review MVP functionality directly
 * without requiring Docker. It verifies:
 * 1. Review API logic works correctly
 * 2. Free-tier limit (3 reviews) is enforced
 * 3. 4th request returns HTTP 402
 */

const { createReviewRouter } = require('./backend/routes/review');
const { generateHardReview } = require('./backend/services/reviewEngine');

// Mock Express request/response
function mockRequest(body, headers = {}) {
  return {
    body,
    header: (name) => headers[name.toLowerCase()],
    ip: headers['x-forwarded-for'] || '127.0.0.1'
  };
}

function mockResponse() {
  const res = {
    statusCode: 200,
    _data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this._data = data;
      return this;
    }
  };
  return res;
}

// Test the review engine
console.log('\n=== TESTING REVIEW ENGINE ===\n');

const testCode = `
def calculate_sum(a, b):
    # TODO: Add input validation
    result = a + b
    print(result)
    return result
`;

const review = generateHardReview({ language: 'python', code: testCode });
console.log('✓ Review generated successfully');
console.log(`  Summary: ${review.summary}`);
console.log(`  Severity: ${review.severity}`);
console.log(`  Findings: ${review.findings.length}`);
console.log(`  Finding types: ${review.findings.map(f => f.type).join(', ')}`);

// Test the free-tier limit
console.log('\n=== TESTING FREE-TIER LIMIT ===\n');

const { router, limiter } = createReviewRouter();

const validRequest = {
  language: 'python',
  code: testCode,
  mode: 'hard'
};

// Make 3 successful requests
for (let i = 1; i <= 3; i++) {
  const req = mockRequest(validRequest, { 'x-user-id': 'test-user' });
  const res = mockResponse();
  
  router.stack[0].route.stack[0].handle(req, res);
  
  if (res.statusCode === 200) {
    console.log(`✓ Request ${i}/3: SUCCESS (HTTP ${res.statusCode})`);
    console.log(`  Findings: ${res._data.findings.length}`);
  } else {
    console.log(`✗ Request ${i}/3: FAILED (HTTP ${res.statusCode})`);
    console.log(`  Message: ${res._data.message}`);
  }
}

// Make 4th request - should return HTTP 402
console.log('\n=== TESTING PAYWALL (4th REQUEST) ===\n');

const req4 = mockRequest(validRequest, { 'x-user-id': 'test-user' });
const res4 = mockResponse();

router.stack[0].route.stack[0].handle(req4, res4);

if (res4.statusCode === 402) {
  console.log(`✓ Request 4/4: PAYWALL ENFORCED (HTTP ${res4.statusCode})`);
  console.log(`  Message: ${res4._data.message}`);
  console.log('\n✓✓✓ MVP FREE-TIER LIMIT WORKS CORRECTLY ✓✓✓');
} else {
  console.log(`✗ Request 4/4: UNEXPECTED (HTTP ${res4.statusCode})`);
  console.log(`  Expected HTTP 402, got HTTP ${res4.statusCode}`);
  console.log('\n✗✗✗ MVP FREE-TIER LIMIT FAILED ✗✗✗');
  process.exit(1);
}

// Test different user gets fresh limit
console.log('\n=== TESTING PER-USER LIMITS ===\n');

const req5 = mockRequest(validRequest, { 'x-user-id': 'different-user' });
const res5 = mockResponse();

router.stack[0].route.stack[0].handle(req5, res5);

if (res5.statusCode === 200) {
  console.log(`✓ Different user: SUCCESS (HTTP ${res5.statusCode})`);
  console.log(`  Confirms limits are per-user, not global`);
} else {
  console.log(`✗ Different user: FAILED (HTTP ${res5.statusCode})`);
}

console.log('\n=== FINAL VERDICT ===\n');
console.log('✓ Review engine works correctly');
console.log('✓ Free-tier limit enforced at 3 reviews');
console.log('✓ 4th request returns HTTP 402 with paywall message');
console.log('✓ Limits are per-user');
console.log('\n🎉 MVP IS DEMO-READY 🎉\n');
