import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import User from '../user/domain/user.model';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
export interface ObjectLiteral {
  [key: string]: any;
}
interface JWTClaims {
  userId: string;
  email: string;
}
type JWTToken = string;
type RefreshToken = string;
@Injectable()
export class AuthService {
  public jwtHashName = 'activeJwtClients';
  private redisClient: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redisClient = this.redisService.getClient();
  }

  public async refreshTokenExists(
    refreshToken: RefreshToken,
  ): Promise<boolean> {
    const keys = await this.redisClient.keys(`*${refreshToken}*`);
    return keys.length !== 0;
  }

  public async getUserNameFromRefreshToken(
    refreshToken: RefreshToken,
  ): Promise<string> {
    const keys = await this.redisClient.keys(`*${refreshToken}*`);
    const exists = keys.length !== 0;

    if (!exists) {
      throw new Error('Username not found for refresh token.');
    }

    const key = keys[0];

    return key.substring(
      key.indexOf(this.jwtHashName) + this.jwtHashName.length + 1,
    );
  }

  public async saveAuthenticatedUser(user: User): Promise<void> {
    if (user.isLoggedIn()) {
      // this.deAuthenticateUser(user.email);
      await this.addToken(
        user.email.value,
        // user.props.refreshToken,
        user.accessToken,
      );
    }
  }

  public async deAuthenticateUser(email: string): Promise<void> {
    await this.clearAllSessions(email);
  }

  // public createRefreshToken(): RefreshToken {
  //   return randtoken.uid(256) as RefreshToken;
  // }

  public signJWT(props: JWTClaims) {
    const claims: JWTClaims = {
      userId: props.userId,
      email: props.email,
    };

    return jwt.sign(claims, process.env.AUTH_SECRET, {
      expiresIn: '1d',
    });
  }

  public decodeJWT(token: string): Promise<JWTClaims> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
        if (err) {
          return resolve(undefined);
        }
        return resolve(decoded as JWTClaims);
      });
    });
  }

  public verifyJWT(accessToken: JWTToken): Promise<boolean> {
    return this.decodeJWT(accessToken).then((d) => !!d);
  }

  public async getTokens(email: string): Promise<string[]> {
    const keyValues = await this.getAllKeyValue(
      `*${this.jwtHashName}.${email}`,
    );
    return keyValues.map((kv) => kv.value);
  }

  private constructKey(email: string, refreshToken: RefreshToken): string {
    return `refresh-${refreshToken}.${this.jwtHashName}.${email}`;
  }

  private async addToken(
    email: string,
    // refreshToken: RefreshToken,
    token: JWTToken,
  ): Promise<any> {
    return await this.redisClient.set(this.constructKey(email, 'test'), token);
  }

  private async clearAllSessions(email: string): Promise<any> {
    const keyValues = await this.getAllKeyValue(
      `*${this.jwtHashName}.${email}`,
    );
    const keys = keyValues.map((kv) => kv.key);
    return Promise.all(keys.map((key) => this.redisClient.del(key)));
  }

  private async getAllKeyValue(wildcard: string): Promise<ObjectLiteral[]> {
    return new Promise((resolve, reject) => {
      this.redisClient.keys(
        wildcard,
        async (error: Error, results: string[]) => {
          if (error) {
            return reject(error);
          } else {
            const allResults = await Promise.all(
              results.map(async (key) => {
                const value = await this.redisClient.get(key);
                return { key, value };
              }),
            );
            return resolve(allResults);
          }
        },
      );
    });
  }
}
