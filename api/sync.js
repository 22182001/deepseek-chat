import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { messages } = req.body;
        if (messages && Array.isArray(messages)) {
            const recent = messages.slice(-20);
            await kv.set('chat_history', recent);
            return res.status(200).json({ success: true, message: '记忆已同步' });
        }
        return res.status(400).json({ error: '数据格式错误' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
