## 技术栈

本项目主要用到的技术框架有:

- react
- redux
- react-redux
- react-router@4
- rxjs
- redux-observable
- sass
- es6 es7
- webpack
- antd
- axios

对应的知识请参考各个官网。

## 使用

进入目录安装依赖:

```shell
yarn install
```

```shell
yarn mock #启动模拟数据
yarn dll #第一次npm run dev时需运行此命令，使开发时编译更快
yarn serve #开启
yarn build #生产打包
```

然后访问http://127.0.0.1:9567 查看

## 目录说明

```
├── README
├── README.md
├── config      //项目配置文件 routers 配置路由 menu 配置菜单
├── dist        //打包结果
├── mint        //框架文件 勿动
├── mock        //mock数据 使用jsonserver 设置请修改db.json
├── node_modules
├── package.json
├── public      //模板文件
├── scripts     //打包设置
├── src
│   ├── assets  //静态资源
│   ├── components  //通用组件 包括 formx tablex
│   ├── index.js
│   ├── layouts  //布局
│   ├── models  //状态和时间处理
│   ├── pages   //对应页面
│   ├── router.js
│   ├── services  //接口
│   ├── styles  //样式
│   └── utils //工具方法
├── yarn-error.log
└── yarn.lock
```
