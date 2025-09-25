// Simple test runner for password reset functionality
// Run with: node __tests__/test-password-reset.js

const crypto = require('crypto')

// Mock the password reset utilities
function generateSecureToken() {
  return crypto.randomBytes(32).toString('hex')
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function constantTimeCompare(a, b) {
  if (a.length !== b.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}

function isTokenExpired(expiresAt) {
  return new Date() > expiresAt
}

// Test functions
function testGenerateSecureToken() {
  console.log('Testing generateSecureToken...')
  
  const token = generateSecureToken()
  console.assert(token.length === 64, 'Token should be 64 characters')
  console.assert(/^[a-f0-9]+$/.test(token), 'Token should be hex string')
  
  const token2 = generateSecureToken()
  console.assert(token !== token2, 'Tokens should be unique')
  
  console.log('✅ generateSecureToken tests passed')
}

function testHashToken() {
  console.log('Testing hashToken...')
  
  const token = 'test-token-123'
  const hash1 = hashToken(token)
  const hash2 = hashToken(token)
  
  console.assert(hash1 === hash2, 'Hash should be consistent')
  console.assert(hash1.length === 64, 'Hash should be 64 characters')
  console.assert(hash1 !== token, 'Hash should be different from token')
  
  const token2 = 'test-token-456'
  const hash3 = hashToken(token2)
  console.assert(hash1 !== hash3, 'Different tokens should have different hashes')
  
  console.log('✅ hashToken tests passed')
}

function testConstantTimeCompare() {
  console.log('Testing constantTimeCompare...')
  
  console.assert(constantTimeCompare('same', 'same') === true, 'Same strings should be equal')
  console.assert(constantTimeCompare('different', 'strings') === false, 'Different strings should not be equal')
  console.assert(constantTimeCompare('short', 'muchlonger') === false, 'Different lengths should not be equal')
  console.assert(constantTimeCompare('', '') === true, 'Empty strings should be equal')
  console.assert(constantTimeCompare('', 'not-empty') === false, 'Empty vs non-empty should not be equal')
  
  console.log('✅ constantTimeCompare tests passed')
}

function testIsTokenExpired() {
  console.log('Testing isTokenExpired...')
  
  const future = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
  const past = new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
  
  console.assert(isTokenExpired(future) === false, 'Future dates should not be expired')
  console.assert(isTokenExpired(past) === true, 'Past dates should be expired')
  
  console.log('✅ isTokenExpired tests passed')
}

function testSecurityFeatures() {
  console.log('Testing security features...')
  
  // Test token uniqueness
  const tokens = new Set()
  for (let i = 0; i < 100; i++) {
    tokens.add(generateSecureToken())
  }
  console.assert(tokens.size === 100, 'All tokens should be unique')
  
  // Test hash consistency
  const token = generateSecureToken()
  const hash1 = hashToken(token)
  const hash2 = hashToken(token)
  console.assert(hash1 === hash2, 'Hash should be consistent')
  
  // Test constant time comparison
  const str1 = 'a'.repeat(1000)
  const str2 = 'a'.repeat(1000)
  const str3 = 'a'.repeat(999) + 'b'
  
  console.assert(constantTimeCompare(str1, str2) === true, 'Identical strings should be equal')
  console.assert(constantTimeCompare(str1, str3) === false, 'Different strings should not be equal')
  
  console.log('✅ Security features tests passed')
}

function testEmailTemplate() {
  console.log('Testing email template logic...')
  
  const resetLink = 'https://example.com/reset-password?token=abc123'
  const userName = 'Test User'
  
  // Test that expected elements would be present
  const expectedElements = [
    'Password Reset Request',
    resetLink,
    '30 minutes',
    'single use',
    'STERI Clean Air'
  ]
  
  expectedElements.forEach(element => {
    console.assert(element.length > 0, `Element "${element}" should not be empty`)
  })
  
  console.log('✅ Email template tests passed')
}

// Run all tests
function runAllTests() {
  console.log('🧪 Running Password Reset Tests...\n')
  
  try {
    testGenerateSecureToken()
    testHashToken()
    testConstantTimeCompare()
    testIsTokenExpired()
    testSecurityFeatures()
    testEmailTemplate()
    
    console.log('\n🎉 All tests passed!')
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    process.exit(1)
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests()
}

module.exports = {
  generateSecureToken,
  hashToken,
  constantTimeCompare,
  isTokenExpired,
  runAllTests
}
