/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
'use strict';

var _reactNative = require("react-native");

const Settings = require('react-native').NativeModules.FBSettings;

module.exports = {
  /**
   * For iOS only, get AdvertiserTrackingEnabled status.
   * @platform ios
   */
  getAdvertiserTrackingEnabled() {
    if (_reactNative.Platform.OS === 'ios') {
      return Settings.getAdvertiserTrackingEnabled();
    } else {
      return Promise.resolve(true);
    }
  },

  /**
   * For iOS only, set AdvertiserTrackingEnabled status, only works in iOS 14 and above.
   * @platform ios
   */
  setAdvertiserTrackingEnabled(ATE) {
    if (_reactNative.Platform.OS === 'ios') {
      return Settings.setAdvertiserTrackingEnabled(ATE);
    } else {
      return Promise.resolve(false);
    }
  },

  /**
   * Set data processing options
   */
  setDataProcessingOptions(options, ...args) {
    let country = 0;

    if (typeof args[0] === 'number') {
      country = args[0];
    }

    let state = 0;

    if (typeof args[1] === 'number') {
      state = args[1];
    }

    Settings.setDataProcessingOptions(options, country, state);
  }

};
//# sourceMappingURL=FBSettings.js.map