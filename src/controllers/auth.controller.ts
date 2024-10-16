import {inject} from '@loopback/core';
import {OperationObject, post, requestBody} from '@loopback/rest';
import {JwtService} from '../services/jwt.service';

const loginOperation: OperationObject = {
  description: 'User login with username and password',
  summary: 'Login endpoint',
  responses: {
    '200': {
      description: 'JWT token',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: {type: 'string'},
            },
          },
        },
      },
    },
  },
};

export class AuthController {
  constructor(
    @inject('services.JwtService') private jwtService: JwtService,
  ) { }

  @post('/login', loginOperation)
  async login(
    @requestBody({
      description: 'The input of login function',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
              username: {type: 'string'},
              password: {type: 'string'},
            },
          },
        },
      },
    })
    credentials: {username: string, password: string},
  ) {
    const userId = 1;
    const token = this.jwtService.generateToken({userId: userId, username: credentials.username});
    return {token};
  }
}
