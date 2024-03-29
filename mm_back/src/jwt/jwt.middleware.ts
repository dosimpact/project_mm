import { UsersService } from '@/users/users.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ProblemsService } from 'src/problems/problems.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('mm-jwt' in req.headers) {
      const token = req.headers['mm-jwt'];
      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && 'id' in decoded) {
          const { ok, user } = await this.usersService.getUserById({
            id: decoded['id'],
          });
          if (ok && user) req['user'] = user;
        }
      } catch (error) {}
    }
    next();
  }
}

@Injectable()
export class Problem02MiddleWare implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly problemsService: ProblemsService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    // console.log('Problem02MiddleWare check in');
    if ('my-jwt' in req.headers) {
      const token = req.headers['my-jwt'];
      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded == 'object' && 'id' in decoded) {
          const { ok, problem02 } = await this.problemsService.getProblem02(
            decoded['id'],
          );
          if (ok && problem02) {
            req['problem02'] = problem02;
          }
        }
      } catch (error) {}
    }
    next();
  }
}
