// Test script to verify Green Energy platform functionality
const testBaseUrl = 'http://localhost:3000'

async function testAPI(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        }
        
        if (body) {
            options.body = JSON.stringify(body)
        }
        
        const response = await fetch(`${testBaseUrl}${endpoint}`, options)
        const data = await response.json()
        
        return {
            success: response.ok,
            status: response.status,
            data
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        }
    }
}

async function runTests() {
    console.log('🚀 Starting Green Energy Platform Tests...\n')
    
    // Test 1: Health Check
    console.log('1. Testing Health Endpoint...')
    const healthTest = await testAPI('/api/health')
    console.log('Health:', healthTest)
    
    // Test 2: Setup Admin
    console.log('\n2. Setting up Admin User...')
    const adminSetup = await testAPI('/api/setup-admin', 'POST')
    console.log('Admin Setup:', adminSetup)
    
    // Test 3: Test Products API
    console.log('\n3. Testing Products API...')
    const productsTest = await testAPI('/api/products')
    console.log('Products:', productsTest)
    
    // Test 4: Test Categories API
    console.log('\n4. Testing Categories API...')
    const categoriesTest = await testAPI('/api/categories')
    console.log('Categories:', categoriesTest)
    
    // Test 5: Test UPI Settings (should require auth)
    console.log('\n5. Testing UPI Settings API...')
    const upiTest = await testAPI('/api/admin/upi/settings')
    console.log('UPI Settings:', upiTest)
    
    console.log('\n✅ Tests completed!')
}

// Run if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    runTests()
}

module.exports = { testAPI, runTests }