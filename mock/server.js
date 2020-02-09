const path = require('path')
const jsonServer = require('json-server')
const bodyParser = require('body-parser')

const server = jsonServer.create()
const middlewares = jsonServer.defaults()

const router = jsonServer.router(path.resolve(__dirname, './db.json'))
router.render = (req, res) => {
  const dataRes = res.locals.data
  if (Array.isArray(dataRes)) {
    res.jsonp({
      data: {
        total: dataRes.length,
        size: 15,
        current: 1,
        list: dataRes
      },
      code: 200,
      success: true,
      message: ''
    })
  } else {
    res.jsonp({
      data: dataRes,
      code: 200,
      success: true,
      message: ''
    })
  }
}
// urlrewrite 替换通用的前缀
// 针对多级 mock db.json的时候用下划线模拟
const custom = {
  '/api/*': '/$1',
  '/*/*': '/$1_$2',
  '/*/*/*': '/$1_$2_$3'
}
const rewriter = jsonServer.rewriter(custom)
function isAuthorized() {
  return true
}

server.use(rewriter)

// 设置默认的中间件，包括logger, static, cors（支持跨域）和no-cache（无缓存）
server.use(middlewares)
server.use(rewriter)
server.use(bodyParser.json()) // for parsing application/json
server.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// 拦截接口
server.post('/login', (req, res) => {
  const { body } = req
  if (body.identificationNumber === '10000' && body.password === '123456') {
    res.json({
      code: 200,
      success: true,
      message: '',
      data: {
        id: 1,
        identificationNumber: '10000',
        name: '麻花藤',
        gender: 0,
        roleId: 1,
        titleId: 1,
        departmentId: 1,
        title: '总负责人',
        department: '成都分公司',
        roleTag: 'SYSTEM_MGR',
        role: '系统管理员'
      }
    })
  } else {
    res.status(200).json({
      data: {
        reason: 'PSSWORD_ERROR',
        detail: '用户名或密码错误'
      },
      code: 200,
      success: false,
      message: '用户名或密码错误'
    })
  }
})

server.use((req, res, next) => {
  // 如果是RESTful 拦截其他动词 直接返回成功

  // if (req.method === 'DELETE' || req.method === 'POST') {
  //   res.status(200).json({
  //     data: {},
  //     code: 200,
  //     success: true,
  //     message: '操作成功'
  //   })
  // }

  // 暂时解决 json post 清空数据
  // 对于语义化接口类型，转成 'GET' 请求。
  // 通过拼接body里面参数，在前端显示传入参数
  req.method = 'GET'
  // const { body, url } = req
  // const query = Object.keys(body)
  //   .map(key => `${key}=${body[key]}`)
  //   .join('&')

  // req.url = query ? `${url}?${query}` : url
  // console.log(req.url)

  // isAuthorized是你自定义的一个判断请求是否权限合法的方法
  if (isAuthorized(req)) {
    // 记得调用next()，请求才会被继续处理
    next()
  } else {
    res.sendStatus(401)
  }
})

// 使用生成好的RESTful路由
server.use(router)

// 监听9999端口，启动服务器
server.listen(9999, () => {
  console.log('JSON Server is running 9999')
})
