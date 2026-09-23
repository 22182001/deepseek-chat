// api/keepalive.js
export default async function handler(req, res) {
    // 允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*');

    // 从 Vercel 的环境变量中读取密钥（稍后配置）
    const API_KEY = process.env.DEEPSEEK_API_KEY;
    const PUSHPLUS_TOKEN = process.env.PUSHPLUS_TOKEN;

    if (!API_KEY || !PUSHPLUS_TOKEN) {
        return res.status(500).json({ error: '环境变量未配置' });
    }

    try {
        // 1. 让 AI 思考要说什么
        const systemPrompt = `你现在是一个贴心、温暖的AI伴侣。现在是北京时间 ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}。
请根据当前的时间，给用户发一条简短、主动的问候消息（比如提醒喝水、提醒吃饭、或者简单说一句想你了）。
要求：语气自然，不要像机器人，不超过 50 个字。只输出你要发送的内容，不要任何多余的格式。`;

        const aiResp = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: systemPrompt }],
                stream: false,
                max_tokens: 100
            })
        });

        const aiData = await aiResp.json();
        const aiMessage = aiData.choices[0].message.content;

        // 2. 把消息推送到你的微信
        const pushResp = await fetch('https://www.pushplus.plus/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: PUSHPLUS_TOKEN,
                title: '你的AI伴侣发来一条消息',
                content: aiMessage,
                template: 'html'
            })
        });

        return res.status(200).json({ 
            success: true, 
            message: "心跳发送成功", 
            ai_reply: aiMessage 
        });

    } catch (error) {
        console.error('心跳错误:', error);
        return res.status(500).json({ error: error.message });
    }
}
