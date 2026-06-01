import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const body = await req.json()
    console.log('Hubtel callback received:', JSON.stringify(body, null, 2))

    // Hubtel sends ResponseCode "0000" for success
    const isSuccess =
      body?.ResponseCode === '0000' ||
      body?.Status === 'Success' ||
      body?.status === 'success'

    const clientReference =
      body?.Data?.ClientReference ||
      body?.ClientReference ||
      body?.clientReference

    if (!clientReference) {
      console.error('Missing clientReference in callback:', body)
      return new Response(JSON.stringify({ error: 'Missing clientReference' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const status = isSuccess ? 'success' : 'failed'

    const { error } = await supabase
      .from('payments')
      .update({ status })
      .eq('reference', clientReference)

    if (error) {
      console.error('Supabase update error:', error)
      return new Response(JSON.stringify({ error: 'DB update failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    console.log(`Payment ${clientReference} updated to: ${status}`)

    return new Response(JSON.stringify({ received: true, status }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Callback handler error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
