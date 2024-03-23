const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// 存储数据的变量
let dataStorage = {};

app.use(express.json());

// 获取特定ID的数据
app.get('/data/:id', async (req, res) => {
    const id = req.params.id;

    try {
        if (dataStorage.hasOwnProperty(id)) {
            // 如果数据已经存在于存储中，直接返回存储的数据
            const data = dataStorage[id];
            res.send(data);
        } else {
            // 发送GET请求到示例API
            const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);

            // 处理API响应数据
            const data = response.data;

            // 将数据存储到存储变量中
            dataStorage[id] = data;

            // 将响应数据发送给客户端
            res.send(data);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('服务器错误');
    }
});

// 清除存储中的所有数据
app.delete('/data', (req, res) => {
    dataStorage = {};
    res.send('所有数据已清除');
});

app.listen(port, () => {
    console.log(`应用程序正在运行，访问 http://localhost:${port}`);
});