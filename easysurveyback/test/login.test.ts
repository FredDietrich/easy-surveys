import request from 'supertest'
import { hash } from 'bcrypt'
import { User } from '../entities/user.entity'
import app from '../index'

describe('Testes das Rotas', () => {
  let server: any;

  beforeAll(async () => {
    // Configuração antes de executar os testes
    const user = User.build({
      username: 'testuser',
      email: 'testuser@example.com',
      password: await hash('testpassword', 10)
    })
    await user.save()
  })

  beforeEach(() => {
    server = app.listen()
  })

  afterEach((done) => {
    server.close(done)
  })

  afterAll(async () => {
    // Limpeza após a conclusão dos testes
    await User.destroy({ where: { username: 'testuser' } })
  })

  it('Deve retornar um token e o usuário ao fazer login', async () => {
    const response = await request(server)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'testpassword'
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
    expect(response.body).toHaveProperty('user')
  })

  it('Deve retornar um status 401 ao fazer login com credenciais inválidas', async () => {
    const response = await request(server)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword'
      })

    expect(response.status).toBe(401)
    expect(response.text).toBe('Usuário ou senha inválidos!')
  })

  it('Deve retornar um status 422 ao criar um usuário com email existente', async () => {
    const response = await request(server)
      .post('/user')
      .send({
        username: 'newuser',
        email: 'testuser@example.com',
        password: 'newpassword'
      })

    expect(response.status).toBe(422)
    expect(response.text).toBe('Usuário existente com email!')
  })

  it('Deve retornar um status 422 ao criar um usuário com username existente', async () => {
    const response = await request(server)
      .post('/user')
      .send({
        username: 'testuser',
        email: 'newuser@example.com',
        password: 'newpassword'
      })

    expect(response.status).toBe(422)
    expect(response.text).toBe('Usuário existente com username!')
  })

  it('Deve criar um novo usuário com sucesso', async () => {
    const response = await request(server)
      .post('/user')
      .send({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'newpassword'
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.headers.location).toMatch(/\/user\/\d+/)
  })

  it('Deve fazer logout e redirecionar para a página inicial', async () => {
    const response = await request(server)
      .delete('/login')

    expect(response.status).toBe(302)
    expect(response.header.location).toBe('/')
  })
})
