/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to use,
 * copy, modify, and distribute this software in source code or binary form for use
 * in connection with the web services and APIs provided by Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use of
 * this software is subject to the Facebook Developer Principles and Policies
 * [http://developers.facebook.com/policy/]. This copyright notice shall be
 * included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * 
 * @format
 */
'use strict';

const AppEventsLogger = require('react-native').NativeModules.FBAppEventsLogger;

const {
  Platform
} = require('react-native');
/**
 * Controls when an AppEventsLogger sends log events to the server
 */


module.exports = {
  /**
   * Sets the current event flushing behavior specifying when events
   * are sent back to Facebook servers.
   */
  setFlushBehavior(flushBehavior) {
    AppEventsLogger.setFlushBehavior(flushBehavior);
  },

  /**
   * Logs an event with eventName and optional arguments.
   * This function supports the following usage:
   * logEvent(eventName: string);
   * logEvent(eventName: string, valueToSum: number);
   * logEvent(eventName: string, parameters: {[key:string]:string|number});
   * logEvent(eventName: string, valueToSum: number, parameters: {[key:string]:string|number});
   * See https://developers.facebook.com/docs/app-events/android for detail.
   */
  logEvent(eventName, ...args) {
    let valueToSum = 0;

    if (typeof args[0] === 'number') {
      valueToSum = args.shift();
    }

    let parameters = null;

    if (typeof args[0] === 'object') {
      parameters = args[0];
    }

    AppEventsLogger.logEvent(eventName, valueToSum, parameters);
  },

  /**
   * Logs a purchase. See http://en.wikipedia.org/wiki/ISO_4217 for currencyCode.
   */
  logPurchase(purchaseAmount, currencyCode, parameters) {
    AppEventsLogger.logPurchase(purchaseAmount, currencyCode, parameters);
  },

  /**
   * Logs an app event that tracks that the application was open via Push Notification.
   */
  logPushNotificationOpen(payload) {
    AppEventsLogger.logPushNotificationOpen(payload);
  },

  /**
   * Explicitly kicks off flushing of events to Facebook.
   */
  flush() {
    AppEventsLogger.flush();
  },

  /**
   * Sets a custom user ID to associate with all app events.
   * The userID is persisted until it is cleared by passing nil.
   */
  setUserID(userID) {
    AppEventsLogger.setUserID(userID);
  },

  /**
   * Returns user id or null if not set
   */
  async getUserID() {
    return await AppEventsLogger.getUserID();
  },

  /**
   * Returns anonymous id or null if not set
   */
  async getAnonymousID() {
    return await AppEventsLogger.getAnonymousID();
  },

  /**
   * Returns advertiser id or null if not set
   */
  async getAdvertiserID() {
    return await AppEventsLogger.getAdvertiserID();
  },

  /**
   * Returns advertiser id or null if not set.
   * @platform android
   */
  async getAttributionID() {
    if (Platform.OS === 'ios') {
      return null;
    }

    return await AppEventsLogger.getAttributionID();
  },

  /**
   * Sends a request to update the properties for the current user, set by
   * setUserID. You must call setUserID before making this call.
   */
  updateUserProperties(parameters) {
    AppEventsLogger.updateUserProperties(parameters);
  },

  /**
   * Set additional data about the user to increase chances of matching a Facebook user.
   */
  setUserData(userData) {
    AppEventsLogger.setUserData(userData);
  },

  /**
   * For iOS only, sets and sends device token to register the current application for push notifications.
   * @platform ios
   */
  setPushNotificationsDeviceToken(deviceToken) {
    AppEventsLogger.setPushNotificationsDeviceToken(deviceToken);
  },

  /**
   * For Android only, sets and sends registration id to register the current app for push notifications.
   * @platform Android
   */
  setPushNotificationsRegistrationId(registrationId) {
    AppEventsLogger.setPushNotificationsRegistrationId(registrationId);
  }

};
//# sourceMappingURL=FBAppEventsLogger.js.map