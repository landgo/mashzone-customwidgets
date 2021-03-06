/*
 * Copyright © 2017 - 2018 Software AG, Darmstadt, Germany and/or its licensors
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.                                                            
 *
 */
angular.module('extendedDropdownWidgetModule')
  .service('jQuery_xdw', ['$window', function ($window) {
    // License - N/A built into MashZone
    return $window.jQuery;
  }])
  .service('lodashPromise_xdw', ['$q', '$window', 'jQuery_xdw', function ($q, $window, jQuery) {
    // License - MIT
    var deferred = $q.defer();
    jQuery.getScript("/mashzone/hub/dashboard/widgets/customWidgets/extendedDropdownWidget/js/lodash.min.js.src", function () {
      deferred.resolve($window._.noConflict());
    });
    return deferred.promise;
  }])
  .service('UtilX_xdw', [function () {
    /**
     * this contains some utils I find useful inside the widgets. Most of it has been taken from internet forums (stackoverflow...)
     * and is therefore not my work
     */
    var UtilX = {
      debug: function(msg, obj, isDebug) {
        if (isDebug === undefined || isDebug == null) {
          var url = window.location.href;
          var name = "debug";
          var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
              results = regex.exec(url);
          if (!results) isDebug = false;
          else if (!results[2]) isDebug = false;
          else isDebug = decodeURIComponent(results[2].replace(/\+/g, ' '));
        }
        if (isDebug === 'true' && msg) {
          var prefix = "+-+-+- TTWW >> ";
          if (obj == null || obj === undefined) {
            console.log(prefix + msg);
          } else {
            console.log(prefix + msg + " ", obj);
          }
        }
        return isDebug;
      },
      parseDate: function (x) {
        return d3.time.format("%Y-%m-%dT%H:%M:%S").parse(x);
      },
      generateUUID: function () {
        function s(n) {
          return h((Math.random() * (1 << (n << 2))) ^ Date.now()).slice(-n);
        }
        function h(n) {
          return (n | 0).toString(16);
        }
        return "X" + [s(4) + s(4), s(4), "4" + s(3), h(8 | (Math.random() * 4)) + s(3), Date.now() // s(4) + s(4) + s(4), // UUID version 4 // {8|9|A|B}xxx
          .toString(16)
          .slice(-10) + s(2)
        ].join("-"); // Use timestamp to avoid collisions
      },
      findWithAttr: function (array, attr, value) {
        for(var i = 0; i < array.length; i += 1) {
          if(array[i][attr] === value) {
            return i;
          }
        }
        return -1;
      },
      parseShortDate: function (x) {
        return d3.time.format("%Y-%m-%d").parse(x);
      },
      parseHour: function (x) {
        return d3.time.format("%H:%M:%S").parse(x);
      },
      translateDateFormat: function (dateFormat) {
        // TODO: add missing formats
        var dateFormat = dateFormat.replace("yyyy", "%Y");
        dateFormat = dateFormat.replace("MM", "%m");
        dateFormat = dateFormat.replace("dd", "%d");
        dateFormat = dateFormat.replace("T", " ");
        dateFormat = dateFormat.replace("HH", "%H");
        dateFormat = dateFormat.replace("mm", "%M");
        dateFormat = dateFormat.replace("ss", "%S");
        return dateFormat;
      },
      isTooBright: function (colorCode) {
        var c = colorCode.substring(1);      // strip #
        var rgb = parseInt(c, 16);   // convert rrggbb to decimal
        var r = (rgb >> 16) & 0xff;  // extract red
        var g = (rgb >>  8) & 0xff;  // extract green
        var b = (rgb >>  0) & 0xff;  // extract blue

        // var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
        var luma = (r+g+b)/3; // 
        if (luma < 128) {
          return false;
        }
        return true;
      },
      /**
       * this will transpose the data rows in MZNG feed result
       */
      transposeRows: function (a) {
        var sol = [], // return array
          outL = a.length || 0; // length of the outer array
        if (outL == 0) {} else {
          if (a[0] && a[0].hasOwnProperty("values") && a[0].values instanceof Array && a[0].values.length > 0) {
            var inL = a[0].values.length, // length of the inner arrays, which should all be the same
              i;
            for (i = 0; i < inL; i++) {
              sol.push([]); // init transposed array
            }
            for (i = 0; i < outL; i++) {
              for (var j = 0; j < inL; j++) {
                sol[j].push(a[i].values[j]);
              }
            }
          }
        }
        return sol;
      }
    };
    return UtilX;
  }]);