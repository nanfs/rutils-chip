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

对应的知识请参考各个官网。

## 项目组织

本项目采用 yarn 的 workspaces 方式组织, 由 3 个子项目组成.

```js
d-virt
├── package.json
├── packages
│   ├── d-virt
│   ├── mint
│   └── violet-ui
└── yarn.lock
```

### d-virt

使用 violet-ui，mint 搭建的 demo 应用, 包括登录流程， 权限控制， 及增删查改.

### mint

基于 react 和 redux 的轻量级框架， 参考[dva](https://github.com/dvajs/dva). 主要对异步处理方式进行了修改， 使用 redux-observable.

### violet-ui

基于 react 的基础 ui 框架, 提供最基本的组件元素.

## 快速开始

克隆项目文件:

```shell
git clone https://x.x.x.x/ServerUpgrade.git
```

进入目录安装依赖:

```shell
yarn install
```

需要在 linux 下才能正确执行，因为路径没做 windows 处理。

开启 d-virt:

```shell
cd packages/d-virt
yarn mock #启动模拟数据
yarn dll #第一次npm run dev时需运行此命令，使开发时编译更快
yarn serve #开启
yarn build #生产打包
```

然后访问http://127.0.0.1:9567 查看
