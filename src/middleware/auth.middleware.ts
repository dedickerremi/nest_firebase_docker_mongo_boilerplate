import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as admin from "firebase-admin";
import {from, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {FirebaseService} from "../firebase-admin/firebase.service";

@Injectable()
export class PreauthMiddleware implements NestMiddleware {

    private readonly authorizedWithoutAuth = [];

    constructor(
        protected readonly firebaseService: FirebaseService
    ) { }

    use(req: Request, res: Response, next: Function) {
        if (this.authorizedWithoutAuth.includes(req.baseUrl)) {
            return next();
        }

        const token = req.headers.authorization;
        if (!token) {
            return this.accessDenied(req.url, res);
        }
        try {
            const tokenTmp = token.split('Bearer ')[1];
            if (tokenTmp) {
                from(this.firebaseService.verifyToken(tokenTmp)).pipe(
                    /*switchMap(decodedToken => {
                        return of(this._authService.findOneByUid(decodedToken.uid));
                    }),
                    switchMap(user => {
                        return from(user);
                    }),
                    switchMap(user => {
                        req['user'] = user;
                        return of(user);
                    }),*/
                ).subscribe(success => {
                    next();
                }, err => {
                    this.accessDenied(req.url, res, err);
                });
            } else {
                return this.accessDenied(req.url, res);
            }
        } catch {
            return this.accessDenied(req.url, res);
        }
    }

    protected accessDenied(url: string, res: Response, message = 'Access Denied') {
        res.status(403).json({
            statusCode: 403,
            timestamp: new Date().toISOString(),
            path: url,
            message,
        });
    }
}
