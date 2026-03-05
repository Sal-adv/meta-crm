// Vercel Serverless Function — receives leads from Make.com
// URL: https://your-crm.vercel.app/api/webhook

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Allow CORS from your own app
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, city, product, campaign } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Build the new lead object
    const newLead = {
      id: 'l' + Date.now(),
      name: name || '',
      email: email || '',
      phone: phone || '',
      city: city || '',
      product: product || '',
      campaign: campaign || '',
      stage: 'Neu',
      deal: 0,
      created: new Date().toISOString().split('T')[0],
      comments: [`[Auto-Import] Lead von Meta Kampagne: ${campaign || 'Unbekannt'}`],
    };

    // Read existing leads from KV store
    let leads = [];
    try {
      leads = (await kv.get('crm_leads')) || [];
    } catch (e) {
      leads = [];
    }

    // Read existing lists to find matching one by campaign name
    let lists = [];
    try {
      lists = (await kv.get('crm_lists')) || [];
    } catch (e) {
      lists = [];
    }

    // Auto-assign to the right list based on campaign name
    const matchedList = lists.find(
      l => l.campaign && l.campaign.toLowerCase() === (campaign || '').toLowerCase()
    );
    newLead.listId = matchedList ? matchedList.id : (lists[0]?.id || 'list1');

    // Save updated leads
    leads.push(newLead);
    await kv.set('crm_leads', leads);

    return res.status(200).json({ success: true, lead: newLead });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
