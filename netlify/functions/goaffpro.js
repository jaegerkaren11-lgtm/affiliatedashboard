// Netlify serverless function — GoAffPro API proxy
const TOKEN = process.env.GOAFFPRO_TOKEN;

exports.handler = async (event) => {
    const headers = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
          return { statusCode: 200, headers, body: '' };
    }

    if (!TOKEN) {
          return { statusCode: 500, headers, body: JSON.stringify({ error: 'GOAFFPRO_TOKEN not set' }) };
    }

    const params = event.queryStringParameters || {};
    const endpoint = params.endpoint || 'affiliates';
    delete params.endpoint;
    if (!params.fields) params.fields = endpoint === 'orders'
      ? 'id,created_at,affiliate_id,total,commission,status,coupon_code,subtotal_price,order_total'
          : 'id,name,email,referral_code,coupon_code,status,commission_rate,num_visitors,date_created,total_earned,available_balance';

    const query = new URLSearchParams(params).toString();
    const url = `https://api.goaffpro.com/v1/admin/${endpoint}${query ? '?' + query : ''}`;

    console.log('Fetching:', url);

    try {
          const resp = await fetch(url, {
                  headers: { 'x-goaffpro-access-token': TOKEN },
          });
          const text = await resp.text();
          console.log('Status:', resp.status, 'Preview:', text.slice(0, 300));
          let data;
          try { data = JSON.parse(text); } catch { data = { raw: text }; }
          return { statusCode: resp.status, headers, body: JSON.stringify(data) };
    } catch (err) {
          return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
};
