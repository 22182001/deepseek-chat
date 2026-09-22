export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { type, value } = req.query;

    console.log("--- 收到手机上报 ---");
    console.log("类型:", type);
    console.log("内容:", value);
    console.log("时间:", new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));

    return res.status(200).json({ 
        success: true, 
        message: "上报成功，我已收到！",
        received: { type, value }
    });
}
