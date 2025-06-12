
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
  // Manejar preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validar que sea método POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Crear cliente de Supabase con service role para bypassing RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Parsear el body de forma segura
    let requestBody;
    try {
      requestBody = await req.json()
    } catch (error) {
      console.error('Error parsing request body:', error)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { audit_data } = requestBody

    if (!audit_data) {
      return new Response(
        JSON.stringify({ error: 'Missing audit_data in request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validar campos requeridos
    if (!audit_data.user_id || !audit_data.table_name || !audit_data.operation) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, table_name, operation' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Obtener IP del request
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown'

    console.log('Creating audit log:', {
      user_id: audit_data.user_id,
      table_name: audit_data.table_name,
      operation: audit_data.operation,
      record_id: audit_data.record_id
    })

    // Insertar log de auditoría con privilegios de administrador
    const { data, error } = await supabaseAdmin
      .from('audit_logs')
      .insert({
        user_id: audit_data.user_id,
        table_name: audit_data.table_name,
        operation: audit_data.operation,
        record_id: audit_data.record_id || null,
        old_values: audit_data.old_values || null,
        new_values: audit_data.new_values || null,
        user_agent: audit_data.user_agent || null,
        session_id: audit_data.session_id || null,
        additional_info: audit_data.additional_info || null,
        ip_address: clientIP
      })
      .select()

    if (error) {
      console.error('Error insertando audit log:', error)
      return new Response(
        JSON.stringify({ error: error.message, details: error }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Audit log created successfully:', data)

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error en función de auditoría:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
