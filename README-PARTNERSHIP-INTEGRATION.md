# Partnership Applications Integration

This document explains the partnership applications table structure and integration with the user dashboard form.

## Database Setup

### 1. Run the Migration

Execute the SQL migration file in your Supabase SQL editor:

```sql
-- File: supabase/migrations/20240414_create_partner_applications.sql
```

### 2. Table Structure

The `partner_applications` table includes:

- **id**: UUID primary key (auto-generated)
- **name**: Applicant's full name (required)
- **residence**: Applicant's address (required)
- **mobile**: Mobile phone number (required)
- **email**: Email address (required)
- **partnership_type**: platinum, gold, silver, or bronze (required)
- **payment_method**: bank or momo (required)
- **payment_frequency**: Monthly, Quarterly, or Yearly (required)
- **notify**: Boolean for payment notifications
- **special_request**: Text field for additional requests
- **status**: pending, approved, rejected, or completed
- **payment_status**: pending, paid, failed, or cancelled
- **payment_reference**: Hubtel transaction reference
- **amount_in_pesewas**: Payment amount in pesewas (GHS × 100)
- **created_at**: Timestamp when record was created
- **updated_at**: Timestamp when record was last updated

### 3. Security Features

- **Row Level Security (RLS)** enabled
- **Policies** for user insert/view and admin full access
- **Indexes** on frequently queried columns
- **Constraints** to ensure data integrity

## Form Integration

### Partnership Types and Amounts

- **Platinum**: $100 (1,000,000 pesewas)
- **Gold**: $50 (500,000 pesewas)
- **Silver**: $10 (100,000 pesewas)
- **Bronze**: $5 (50,000 pesewas)

### Form Flow

1. User fills out the partnership application form
2. Form data is validated and submitted to Supabase
3. Application is saved with 'pending' status
4. Hubtel payment modal opens for payment processing
5. Payment amount is automatically calculated based on partnership type

## Testing

### Run Test Queries

Use the test script to verify your setup:

```bash
node test-partner-applications.js
```

Or manually run the SQL queries from the test script in your Supabase SQL editor.

### Expected Behavior

- Form submission should create a new record in `partner_applications`
- Record should have correct amount based on partnership type
- Status should be 'pending' initially
- Hubtel modal should open with correct amount

## Troubleshooting

### Common Issues

1. **Migration fails**: Check for existing table with same name
2. **Form submission fails**: Verify RLS policies are correct
3. **Payment amount incorrect**: Check the pesewas calculation logic
4. **Hubtel doesn't open**: Verify amount is passed as string

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify Supabase connection in Network tab
3. Check Supabase logs for database errors
4. Test with the provided test queries

## Next Steps

1. Run the migration in Supabase
2. Test the form submission
3. Verify Hubtel integration
4. Set up admin dashboard to view applications
5. Configure email notifications for payment reminders
