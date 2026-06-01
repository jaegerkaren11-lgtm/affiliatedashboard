// Netlify serverless function — GoAffPro API proxy
const TOKEN = process.env.GOAFFPRO_TOKEN;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (!TOKEN) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'GOAFFPRO_TOKEN not set in Netlify environment variables' }) };
  }

  const params = event.queryStringParameters || {};
  const endpoint = params.endpoint || 'affiliates';
  delete params.endpoint;

  // GoAffPro API: correct endpoint mapping
  const ENDPOINT_MAP = {
    'affiliates': 'affiliates',   // GET /v1/admin/affiliates
    'sales':      'sales',        // GET /v1/admin/sales
    'payouts':    'payouts',      // GET /v1/admin/payouts
  };

  const path = ENDPOINT_MAP[endpoint] || endpoint;
  const query = new URLSearchParams(params).toString();
  const url = `https://api.goaffpro.com/v1/admin/${path}${query ? '?' + query : ''}`;

  console.log('Fetching:', url);

  try {
    const resp = await fetch(url, {
      headers: {
        'x-goaffpro-access-token': TOKEN,
        'Content-Type': 'application/json',
      },
    });

    const text = await resp.text();
    console.log('Status:', resp.status, 'Body preview:', text.slice(0, 200));

    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return { statusCode: resp.status, headers, body: JSON.stringify(data) };
  } catch (err) {
    console.error('Fetch error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
