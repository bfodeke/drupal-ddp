if (Meteor.isClient) {
  Meteor.startup(function () {
    if (Meteor.settings.public.drupal_ddp_access_private_files === true) {
      Meteor.call('getDrupalSessionToken', 'read', function(err, response) {
        if (!err) {
          // Getting the upper level domain of the current site.
          var urlParts = location.hostname.split('.');
          // var domain = _.last(urlParts, 2).join('.');
          var domain = _.last(urlParts, 1).join('.');
          var cookieName, cookieValue;

          // Set a session cookie.
          var cookieParts = response.cookie.split(';');

          console.log(cookieParts);
          console.log('=== Meteor URL ===');
          console.log(urlParts);

          // Loop through parts of the cookie to make it
          // work across subdomains.
          _.each(cookieParts, function(num, index){

            cookieSegment = num.split('=');

            if ($.trim(cookieSegment[0]) === 'domain') {
              // Set the domain equal to the tld.
              var cookieDomain = ' domain=' + domain;
              cookieParts[index] = cookieDomain;
            }

            // Set cookie name & value variables.
            if (index === 0) {
              cookieName = $.trim(cookieSegment[0]);
              cookieValue = $.trim(cookieSegment[1]);
            }

            // If the 'HttpOnly' flag is set in the cookie,
            // remove it so the cookie can be set via javascript.
            if ($.trim(cookieSegment[0]) === 'HttpOnly') {
              cookieParts.splice(index, 1);
            }

          });

          // If on cordova, doc.cookie doesn't work. Use cookie master package
          // instead.
          if(Meteor.isCordova){
            console.log('==== Cookie Name ====');
            // alert('CookieName: ' + cookieName);

            console.log('==== Cookie Value ====');
            // alert('CookieVal: ' + cookieValue);

            cookieMaster.setCookieValue('.' + domain, 'twoppl', 'allthevalues',
              function() { alert('Set the twoppl cookie.');},
              function() { alert('couldnt set new cookie');}
            );

            // cookieMaster.setCookieValue('.' + domain, cookieName, cookieValue,
            // function() {
            //   // alert('A cookie has been set');
            // },
            // function(error) {
            //   alert('Error setting cookie: ' + error);
            // });

            var sessionCookie = cookieParts.join(';');
            document.cookie = sessionCookie;

            console.log('==== Cookie Master YES) ====');

            cookieMaster.getCookieValue('.' + domain, 'twoppl', function(data) {
              alert('Cookie Value: ' + data.cookieValue);
            }, function(error) {
              if (error) {
                alert('Error getting cookie');
              }
            });

          } else {
            // Join all the cookie parts back together.
            var sessionCookie = cookieParts.join(';');
            document.cookie = sessionCookie;
          }


        }
        else {
          console.log('====== ERROROR ======');
          console.log(err);
        }
      });
    }
  });
}
