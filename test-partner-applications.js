// Test script to verify partner applications table structure
// Run this script in your Supabase SQL editor after running the migration

const testQueries = [
  // Test 1: Check if table exists
  `SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'partner_applications'
  ) as table_exists;`,
  
  // Test 2: Check table structure
  `SELECT column_name, data_type, is_nullable, column_default 
   FROM information_schema.columns 
   WHERE table_name = 'partner_applications' 
   ORDER BY ordinal_position;`,
  
  // Test 3: Check constraints
  `SELECT conname, contype, consrc 
   FROM pg_constraint 
   WHERE conrelid = 'public.partner_applications'::regclass;`,
  
  // Test 4: Check indexes
  `SELECT indexname, indexdef 
   FROM pg_indexes 
   WHERE tablename = 'partner_applications';`,
  
  // Test 5: Check RLS policies
  `SELECT policyname, permissive, roles, cmd, qual 
   FROM pg_policies 
   WHERE tablename = 'partner_applications';`,
  
  // Test 6: Insert a test record
  `INSERT INTO partner_applications (
    name, residence, mobile, email, partnership_type, 
    payment_method, payment_frequency, notify, special_request, 
    amount_in_pesewas, status, payment_status
  ) VALUES (
    'Test User', 'Test Address', '1234567890', 'test@example.com', 
    'bronze', 'momo', 'Monthly', true, 'Test special request', 
    50000, 'pending', 'pending'
  ) RETURNING id;`,
  
  // Test 7: Select the test record
  `SELECT * FROM partner_applications WHERE email = 'test@example.com';`,
  
  // Test 8: Clean up test record
  `DELETE FROM partner_applications WHERE email = 'test@example.com';`
];

console.log('Partner Applications Table Test Queries');
console.log('Run these queries in your Supabase SQL editor to verify the setup:');
console.log('');

testQueries.forEach((query, index) => {
  console.log(`-- Test ${index + 1}:`);
  console.log(query);
  console.log('');
  console.log('--' + '-'.repeat(50));
  console.log('');
});

// Expected results for verification
console.log('Expected Results:');
console.log('1. table_exists should be true');
console.log('2. Should show all columns with proper data types');
console.log('3. Should show CHECK constraints for partnership_type, payment_method, payment_frequency, status, payment_status');
console.log('4. Should show indexes on email, status, created_at, partnership_type');
console.log('5. Should show RLS policies for user access and admin access');
console.log('6. Should return a UUID for the new record');
console.log('7. Should show the complete test record with all fields');
console.log('8. Should delete 1 record');
