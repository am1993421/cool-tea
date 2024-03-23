const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// MongoDB数据库连接
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, '数据库连接错误：'));
db.once('open', () => {
    console.log('数据库连接成功');
});

// 定义用户模型
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

// 静态文件服务
app.use(express.static('public'));

// 注册新用户
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 检查用户名是否已存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('用户名已存在');
        }

        // 使用bcrypt进行密码哈希
        const hashedPassword = await bcrypt.hash(password, 10);

        // 创建新用户
        const newUser = new User({
            username,
            password: hashedPassword
        });

        // 保存用户到数据库
        await newUser.save();

        res.send('用户注册成功');
    } catch (error) {
        console.error(error);
        res.status(500).send('服务器错误');
    }
});

// 用户登录
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 查找用户
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('用户名或密码错误');
        }

        // 验证密码
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('用户名或密码错误');
        }

        // 创建JWT令牌
        const token = jwt.sign({ username: user.username }, 'secret');

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('服务器错误');
    }
});

// 身份验证中间件
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, 'secret', (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
}

// 受保护的路由，需要进行身份验证
app.get('/protected', authenticateToken, (req, res) => {
    res.send('受保护的路由');
});

app.listen(port, () => {
    console.log(`应用程序正在运行，访问 http://localhost:${port}`);
});