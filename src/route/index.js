// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)
      //   if (email) {
      //     user.email = email
      // Object.assign(user, { email })

      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}
// ================================================================
class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 10000)
    this.createDate = () => {
      new Date().toISOString()
    }
  }

  static getList = () => this.#list
  checkId = (id) => this.id === id
  static add = (product) => {
    this.#list.push(product)
  }
  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const product = this.getById(id)
    const { name } = data
    if (product) {
      if (name) {
        product.name = name
      }
      //   if (email) {
      //     user.email = email
      // Object.assign(user, { email })

      return true
    } else {
      return false
    }
  }
}
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      //
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-create', function (req, res) {
  //   console.log(req.body)
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'success-info',
    info: 'Create User',
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {
  //   console.log(req.body)
  const { id } = req.query

  //   console.log(typeof id)

  User.deleteById(Number(id))

  //   console.log(user)

  //   if (user) {
  //     console.log('!!!!!!!!!!!!!!')
  //   }

  res.render('success-info', {
    style: 'success-info',
    info: 'Delete User',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  //   console.log(req.body)
  const { email, password, id } = req.body
  let result = false
  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  //   console.log(email, password, id)

  //   let result = false

  //   if()

  //   const result = User.updateById(Number(id), { email })

  res.render('success-info', {
    style: 'success-info',
    info: result ? 'Update user email' : 'Error',
  })
})

// ================================================================

// ==================================Product=======================
router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-list',

    data: {
      //
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================

router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
  })
})
// ================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body
  const product = new Product(name, price, description)

  Product.add(product)

  res.render('alert', {
    style: 'alert',
    info: `Product  ${name} with price ${price} created`,
  })
})

// ================================================================
router.get('/product-delete', function (req, res) {
  const { id } = req.query
  Product.deleteById(Number(id))

  res.render('alert', {
    style: 'alert',
    info: 'Product delete',
  })
})
// ================================================================
router.get('/product-edit', function (req, res) {
  const { id } = req.query
  const product = Product.getById(Number(id))
  if (product) {
    return res.render('product-edit', {
      style: 'product-edit',
      data: {
        name: product.name,
        price: product.price,
        id: product.id,
        description: product.description,
      },
    })
  } else {
    return res.render('alert', {
      style: 'alert',
      info: 'No product found with this ID',
    })
  }
})

// ================================================================
router.post('/product-edit', function (req, res) {
  const { id, price, name, description } = req.body

  const product = Product.updateById(Number(id), {
    name,
    price,
    description,
  })
  console.log(id)
  console.log(product)
  if (product) {
    res.render('alert', {
      style: 'alert',
      info: `Information about the product ${name}  has been ${id} updated`,
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: `Error`,
    })
  }
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
