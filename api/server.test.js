const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')
const User = require('../api/users/modal')
const bcrypt = require('bcryptjs')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('users').truncate()
})
afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(true)
})


describe("auth end points are working as intended",  () => {
  it('[POST] /api/auth/register works', async () => {
    const res = await request(server).post('/api/auth/register').send({username:"will", password:'1234'})
    expect(res.body.id).toBe(1)
    expect(res.body.username).toBe('will')
  })

  it('[POST] /api/auth/register', async () => {
    const res = await request(server).post('/api/auth/register').send({usernam:"will", password:'will'})
    expect(res.status).toBe(404)
  })

  it('[POST] /api/auth/login', async () => {
    const will = {username: 'jordan', password:'air'}
    const willy = {username: 'jordan', password:'air'}
    const hash = bcrypt.hashSync(will.password, 7)
    will.password = hash
    await User.add(will)
    const response = await request(server).post('/api/auth/login').send(willy)
    expect(response.status).toBe(200)


  })
  it('[POST] /api/auth/login do no work', async () => {
    const will = {username: 'jordan', password:'air'}
    const response = await request(server).post('/api/auth/login').send(will)
    expect(response.status).toBe(401)
  })

})