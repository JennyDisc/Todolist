const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHeadle = require('./errorHeadle');
// const todos = [
//     {
//         title: '睡前要刷牙',
//         id: uuidv4()
//     }
// ]
const todos = [
    {
        title: '完成預習影音課程',
        id: uuidv4()
    },
    {
        title: '傍晚運動30分鐘',
        id: uuidv4()
    }
];

const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
        // 'Content-Type': 'text/pain' 
    }
    // res.writeHead(200,{'Content-Type':'text/pain'}),
    // res.write('hello'),
    // res.end()
    let body = '';
    req.on('data', (chunk) => {
        // console.log(chunk);
        body += chunk;
    });
    // req.on('end', () => {
    //     console.log(body); // 字串型態
    //     console.log(JSON.parse(body).title) // 字串轉成物件，才能取 title 屬性
    // });
    if (req.url == '/todos' && req.method == 'GET') {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": 'success',
            "data": todos
        }));
        res.end();
    } else if (req.url == '/todos' && req.method == 'POST') {
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title;
                if (title !== undefined) {
                    const data =
                    {
                        "title": title,
                        "id": uuidv4()
                    };
                    todos.push(data);
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": 'success',
                        "data": todos
                    }));
                    res.end();
                } else {
                    // 寫法1：400錯誤訊息寫不同
                    const mess = '無此屬性';
                    errorHeadle(res, mess);
                    // 寫法2：400錯誤訊息寫相同(重複的函式未簡化)
                    // res.writeHead(400, headers);
                    // res.write(JSON.stringify({
                    //     "status": 'false',
                    //     "message": '欄位未填寫正確，或無此 todo id'
                    // }));
                    // res.end();
                }
            }
            catch {
                // 寫法1：400錯誤訊息寫不同
                const mess = '欄位未填寫正確，或無此 todo id';
                errorHeadle(res, mess);
                // 寫法2：400錯誤訊息寫相同(重複的函式未簡化)
                // res.writeHead(400, headers);
                // res.write(JSON.stringify({
                //     "status": 'false',
                //     "message": '欄位未填寫正確，或無此 todo id'
                // }));
                // res.end();
            };
        });
    } else if (req.url == '/todos' && req.method == 'DELETE') {
        // 清空陣列資料
        todos.length = 0;
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": 'success',
            "data": todos,
            "message": "delete"
        }));
        res.end();
    } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
        const id = req.url.split("/").pop();
        // console.log(id);
        const idIndex = todos.findIndex(element => element.id == id);
        // console.log(idIndex);
        if (idIndex !== -1) {
            todos.splice(idIndex, 1);
            res.writeHead(200, headers);
            res.write(JSON.stringify({
                "status": 'success',
                "data": todos,
            }));
            res.end();
        } else {
            // 寫法1：400錯誤訊息寫不同
            const mes = '查無此 todo id'
            errorHeadle(res, mes);
            // 寫法2：400錯誤訊息寫相同
            // errorHeadle(res);
        };
    } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title;
                // console.log(title);
                const id = req.url.split("/").pop();
                // console.log(id);
                const idIndex = todos.findIndex(element => element.id == id);
                // console.log(idIndex);
                if (title !== undefined && idIndex !== -1) {
                    // 更新陣列內指定的資料
                    todos[idIndex].title = title;
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": 'success',
                        "data": todos
                    }));
                    res.end();
                } else {
                    // 寫法1：400錯誤訊息寫不同
                    const mes = '查無 todo title 或 id 屬性'
                    errorHeadle(res, mes);
                    // 寫法2：400錯誤訊息寫相同
                    // errorHeadle(res);
                };
            } catch {
                // 寫法1：400錯誤訊息寫不同
                const mes = '欄位未填寫正確，或無此 todo id';
                errorHeadle(res, mes);
                // 寫法2：400錯誤訊息寫相同
                // errorHeadle(res);
            };
        });
    } else if (req.method == 'OPTIONS') {
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": 'false',
            "message": 'not found pages'
        }));
        res.end();
    };
};

const server = http.createServer(requestListener);

server.listen(process.env.PORT || 3005);