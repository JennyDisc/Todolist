function errorHeadle(res,mess) {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    res.writeHead(400, headers),
        res.write(JSON.stringify({
            "status": 'false',
            // 寫法1：400錯誤訊息寫不同
            "message": mess
            // 寫法2：400錯誤訊息寫相同
            // "message": '欄位未填寫正確，或無此 todo id'
        }))
    res.end();
};

module.exports=errorHeadle;
