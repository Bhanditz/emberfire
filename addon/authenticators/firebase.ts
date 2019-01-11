// TODO handle this not being present
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import RSVP from 'rsvp';
import Ember from 'ember';
import FirebaseAppService from '../services/firebase-app';

const { resolve, reject, Promise } = RSVP;

import 'firebase/auth';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
 
export default class FirebaseAuthenticator extends BaseAuthenticator.extend({
    
    firebaseApp: service('firebase-app'),
    
}) {

    /**
     * Override the default FirebaseApp Service used by the authenticator: `service('firebase-app')`
     * 
     * ```js
     * // app/authenticators/application.js
     * import FirebaseAuthenticator from 'emberfire/authenticators/firebase';
     * import { inject as service } from '@ember/service';
     *
     * export default FirebaseAuthenticator.extend({
     *   firebaseApp: service('firebase-different-app')
     * });
     * ```
     * 
     */
    // @ts-ignore repeat here for the tyepdocs
    firebaseApp: Ember.ComputedProperty<FirebaseAppService, FirebaseAppService>;

    restore(data: any) {
        return resolve(data);
    }

    authenticate() {
        return reject(new Error('Please authenticate via the Firebase SDK directly.'));
    }

    invalidate() {
        return new Promise<void>((resolve, reject) => {
            get(this, 'firebaseApp').auth().signOut().then(resolve).catch(reject);
        })
    }

}