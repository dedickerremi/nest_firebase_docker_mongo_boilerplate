import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
    constructor() {
    }

    verifyToken(token) {
        return admin.auth().verifyIdToken(token);
    }

    createUser(firebaseUser) {
        return admin.auth().createUser(firebaseUser);
    }

    getUserByEmail(email) {
        return admin.auth().getUsers([{ email }]);
    }
    updateUser(uid, payload) {
        return admin.auth().updateUser(uid, payload);
    }

    pushNotifications(tokens, event) {
        return admin.messaging().sendMulticast({
            tokens,
            notification: {
                title: event.name,
                body: event.description,
            },
        });
    }

}
