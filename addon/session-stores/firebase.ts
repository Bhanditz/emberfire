// TODO handle this not being present
import BaseSessionStore from 'ember-simple-auth/session-stores/base';

import { get, set } from '@ember/object';
import RSVP from 'rsvp';

import Ember from 'ember';
import FirebaseAppService from '../services/firebase-app';

const { Promise, resolve } = RSVP;
import { run } from '@ember/runloop';

import 'firebase/auth';
import { inject as service } from '@ember/service';

export default class FirebaseSessionStore extends BaseSessionStore.extend({
    firebaseApp: service('firebase-app')
}) { 

    /**
     * Override the default FirebaseApp Service used by the session store: `service('firebase-app')`
     * 
     * ```js
     * // app/session-stores/application.js
     * import FirebaseSessionStore from 'emberfire/session-stores/firebase';
     * import { inject as service } from '@ember/service';
     *
     * export default FirebaseSessionStore.extend({
     *   firebaseApp: service('firebase-different-app')
     * });
     * ```
     * 
     */
    // @ts-ignore repeat here for the tyepdocs
    firebaseApp: Ember.ComputedProperty<FirebaseAppService, FirebaseAppService>;

    restoring = true;
    persist = resolve;
    clear = resolve;

    restore() {
        return new Promise(resolve => {
            get(this, 'firebaseApp').auth().onIdTokenChanged((user:any) => run(() => {
                let authenticated = user ? {authenticator: 'authenticator:firebase', user, credential: user.getIdToken()} : {};
                if (get(this, 'restoring')) {
                    set(this, 'restoring', false);
                    resolve({ authenticated });
                } else {
                    this.trigger('sessionDataUpdated', { authenticated });
                }
            }));
        });
    }

}