// Test script to debug Paystack API issues
console.log('Environment variables:', import.meta.env);
console.log('Paystack key:', import.meta.env.VITE_PAYSTACK_SECRET_KEY);

// Test the paystack service directly
import { paystackService } from './src/lib/paystack.js';

async function testPaystack() {
  try {
    console.log('Testing Paystack API...');
    const result = await paystackService.getTransactions({ perPage: 1 });
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPaystack();
