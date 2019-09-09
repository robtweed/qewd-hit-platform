function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function deleteCookie(name) {
  document.cookie = name + '=;path=/;Max-Age=-99999999;';
}

function getHeaders() {
  return {
    authorization: 'Bearer ' + getCookie('JSESSIONID')
  };
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function rev(str) {
  return str.split('').reverse().join('');
}

function hideForms() {
  $('#demographicsForm').hide();
  $('#allergyForm').hide();
  $('#flatJSONForm').hide();
  $('#headingJSONForm').hide();
  $('#getHeadingForm').hide();
  $('#getSchemaForm').hide();
  $('#editBtn').hide();
  $('#mpiBtn').show();
}

$(document).ready(function() {

  var jwt;
  var patient;
  var headings = {};
  var transforms = {};

  $('#header').hide();
  $('#whenLoggedIn').hide();
  hideForms();
  $('#newPatient').hide();

  // fire off the /auth/redirect request every time
  // index.html is loaded

  // the oidc-client will respond with either a redirect to the
  //  oidc-provider, or will return authenticated: true

  var jwt = getCookie('JSESSIONID');
  var request = {
    url: '/auth/redirect',
    data: {
      //client_id: 'admin',
      client_id: 'test_client',
      scope: 'openid profile email'
    }
  };
  if (jwt && jwt !== '') {
    request.headers = {
      authorization: 'Bearer ' + jwt
    };
  }

  $.ajax(request)
  .done(function(data) {
    console.log('**** got ' + JSON.stringify(data));
    if (data.authenticated) {

      // user is authenticated, so begin display

      // fetch registered headings

      $.ajax({
        url: '/openehr/headings',
        headers: getHeaders()
      })
      .done(function(data) {
        headings = data.headings;
        var firstHeading;
        for (var heading in headings) {
          if (!firstHeading) firstHeading = heading;
          $('#headingNameInput').append($('<option>', { 
            value: heading,
            text : heading 
          }));
          $('#getHeadingName').append($('<option>', { 
            value: heading,
            text : heading 
          }));
          $('#getSchemaHeadingName').append($('<option>', { 
            value: heading,
            text : heading 
          }));
        }

        // fetch input transform names

        $.ajax({
          url: '/openehr/transforms?filter=inputAndOutput',
          headers: getHeaders()
        })
        .done(function(data) {
          console.log('getTransforms response: ' + JSON.stringify(data, null, 2));
          transforms = data.transforms;
          transforms[firstHeading]['input'].forEach(function(transform) {
            $('#headingInputTransform').append($('<option>', { 
              value: transform,
              text : transform 
            }));
          });

          transforms[firstHeading]['output'].forEach(function(transform) {
            $('#getHeadingOutputFormat').append($('<option>', { 
              value: transform,
              text : transform 
            }));
          });

          $('#headingNameInput').change(function(){
             //alert('Selected value: ' + $(this).val());
            $('#headingInputTransform').children().remove();
            if (!transforms[$(this).val()]) {
              transforms[$(this).val()] = {
                input: ['openehr'],
                output: ['openehr']
              };
            }
            transforms[$(this).val()]['input'].forEach(function(transform) {
              $('#headingInputTransform').append($('<option>', { 
                value: transform,
                text : transform 
              }));
            });
          });

          $('#getHeadingName').change(function(){
             //alert('Selected value: ' + $(this).val());
            $('#getHeadingOutputFormat').children().remove();
            if (!transforms[$(this).val()]) {
              transforms[$(this).val()] = {
                input: ['openehr'],
                output: ['openehr']
              };
            }
            transforms[$(this).val()]['output'].forEach(function(transform) {
              $('#getHeadingOutputFormat').append($('<option>', { 
                value: transform,
                text : transform 
              }));
            });
          });

        });

      });

      // set up display

      $('#header').show();
      $('#demographicsForm').hide();
      $('#whenLoggedIn').show();

      jwt = jwt_decode(data.token);
      console.log('JWT = ' + JSON.stringify(jwt, null, 2));

      $('#welcome').text('Welcome ' + jwt.firstName + ' ' + jwt.lastName);

    }
    else if (data.redirectURL) {

      // user not authenticated, so redirect to
      // OIDC Provider
      window.location = data.redirectURL;
      //console.log('redirectURL = ' + redirectURL);
    }
  });

  $('#logoutBtn').on('click', function(e) {
    $('#whenLoggedIn').hide();
    $.ajax({
      url: '/auth/logout?client_id=test_client',
      headers: getHeaders()
    })
    .done(function(data) {
      //console.log('logout response: ' + JSON.stringify(data, null, 2));
      if (data.redirectURL) {
        deleteCookie('JSESSIONID');
        window.location = data.redirectURL;
      }
    });
  });

  $('#mpiBtn').on('click', function(e) {
    $('#contentTitle').text("Fetching demographics from FHIR MPI service. Please wait...");
    $.ajax({
      url: '/mpi/Patient',
      method: 'GET',
      headers: getHeaders()
    })
    .done(function(data) {
      console.log('mpi response: ' + JSON.stringify(data, null, 2));
      hideForms();
      $('#mpiBtn').hide();
      $('#editBtn').show();
      patient = data.patient;
      $('#content').show();
      $('#contentTitle').text("Demographics (FHIR)");
      $('#content').text(JSON.stringify(data.patient, null, 2));  
    })
    .fail(function(error) {
      //console.log('mpi error: ' + JSON.stringify(error, null, 2));
      if (error.responseJSON.error === 'The specified Patient Id does not exist') {
        $('#contentTitle').text("Your Demographics Data Could Not be Found");
        $('#firstNames').val(jwt.firstName);
        $('#lastName').val(jwt.lastName);
        $('#telecom').val(jwt.openid.mobileNumber);
        //var pieces = jwt.openid.dob.split('/');
        //var dob = pieces[2] + '-' + pieces[1] + '-' + pieces[0];
        //$('#birthDate').val(dob);
        $('#birthDate').val('');
        $('#country').val('United Kingdom');
        $('#demographicsForm').show();
        $('#newPatient').show();
      }
    });
  });

  $('#saveMpiBtn').on('click', function(e) {
    var givenNames = $('#firstNames').val().split(' '); 

    var data = {
      name: {
        family: $('#lastName').val(),
        given: givenNames,
        prefix: $('#prefix').val()
      },
      telecom: $('#telecom').val(),
      gender: $('#gender').val(),
      birthDate: $('#birthDate').val(),
      address: {
        line: $('#address_line').val(),
        city: $('#city').val(),
        district: $('#district').val(),
        postalCode: $('#postalCode').val(),
        country: $('#country').val(),
      }
    };

    var message = {
      dataType: 'json',
      data: JSON.stringify(data),
      contentType: 'application/json',
      headers: getHeaders()
    };

    if (patient) {
      message.url = '/mpi/Patient';
      message.method = 'PUT';
    }
    else {
      message.url = '/mpi/Patient';
      message.method = 'POST';
    }

    $.ajax(message)
    .done(function(data) {
      console.log('mpi response: ' + JSON.stringify(data, null, 2));
      // re-fetch data
      $('#mpiBtn').click();
    })
    .fail(function(error) {
      console.log('mpi error: ' + error.responseJSON.error);
      alert(error.responseJSON.error);
      $('#demographicsForm').hide();
      $('#editBtn').show();
    });
  });

  $('#editBtn').on('click', function(e) {
    var fnArr = patient.name[0].given;
    $('#firstNames').val(fnArr.join(' '));
    $('#lastName').val(patient.name[0].family);
    $('#telecom').val(patient.telecom);
    //var pieces = patient.birthDate.split('/');
    //var dob = pieces[2] + '-' + pieces[1] + '-' + pieces[0];
    $('#birthDate').val(patient.birthDate);
    $('#address_line').val(patient.address[0].line[0]);
    $('#city').val(patient.address[0].city);
    $('#district').val(patient.address[0].district);
    $('#postalCode').val(patient.address[0].postalCode);
    $('#country').val(patient.address[0].country);

    hideForms();
    $('#demographicsForm').show();
    $('#mpiBtn').hide();
    $('#editBtn').show();
    $('#content').hide();
    $('#newPatient').hide();
    $('#contentTitle').text("Edit Demographics Data");
  });

  $('#cancelEditBtn').on('click', function(e) {
    hideForms();
    $('#content').show();    
    $('#contentTitle').text("");
    $('#content').text("");
  });


  $('#getTemplatesBtn').on('click', function(e) {
    $('#contentTitle').text("Fetching Template List from OpenEHR. Please wait...");
    $.ajax({
      url: '/openehr/templates',
      method: 'GET',
      headers: getHeaders()
    })
    .done(function(data) {
      hideForms();
      $('#mpiBtn').show();
      $('#contentTitle').text("Templates on your OpenEHR System");
      $('#content').show();
      $('#content').text(JSON.stringify(data.templates, null, 2));  
    })
    .fail(function(error) {
      console.log('Error fetching templates: ' + error);
    });
  });

  $('#addAllergyBtn').on('click', function(e) {
    hideForms();
    $('#allergyForm').show();
    $('#content').hide();
    $('#contentTitle').text('Add an Allergy');
    if ($('#allergy_causative_agent_code').val() === '') {
      $('#allergy_causative_agent_code').val('91936005');
    }
    $('#allergy_causative_agent_terminology').val('SNOMED-CT');
    if ($('#allergy_manifestation_code').val() === '') {
      $('#allergy_manifestation_code').val('28926001');
    }
    $('#allergy_manifestation_terminology').val('SNOMED-CT');
  });

  $('#getHeadingBtn').on('click', function(e) {
    hideForms();
    $('#getHeadingForm').show();
    $('#content').hide();
    $('#contentTitle').text('');
  });

  $('#getHeadingGoBtn').on('click', function(e) {
    var heading = $('#getHeadingName').val();
    var format = $('#getHeadingOutputFormat').val();

    $('#contentTitle').text('Fetching ' + heading + ' from OpenEHR. Please wait...');
    $.ajax({
      url: '/openehr/heading/' + heading + '/' + jwt.openid.userId + '?format=' + format,
      method: 'GET',
      headers: getHeaders()
    })
    .done(function(data) {
      delete data.token;
      hideForms();
      $('#mpiBtn').show();
      $('#contentTitle').text(heading + ' data (from OpenEHR in ' + format + ' format)');
      $('#content').show();
      $('#content').text(JSON.stringify(data, null, 2));
    })
    .fail(function(error) {
      console.log('Error fetching ' + heading + ': ' + error);
    });
  });

  $('#cancelgetHeadingBtn').on('click', function(e) {
    hideForms();
    $('#content').show();    
    $('#contentTitle').text("");
    $('#content').text("");
  });

  $('#getSchemaBtn').on('click', function(e) {
    hideForms();
    $('#getSchemaForm').show();
    $('#content').hide();
    $('#contentTitle').text('');
  });

  $('#cancelGetSchemaBtn').on('click', function(e) {
    hideForms();
    $('#content').show();    
    $('#contentTitle').text("");
    $('#content').text("");
  });

  $('#getSchemaGoBtn').on('click', function(e) {
    var heading = $('#getSchemaHeadingName').val();
    var format = $('#getSchemaFormat').val();
    var type = 'Input';
    if (format === 'out') type = 'Output';
    $('#contentTitle').text('Fetching ' + heading + ' ' + type + ' Schema from OpenEHR. Please wait...');
    $.ajax({
      url: '/openehr/schema/' + heading + '?format=' + format,
      method: 'GET',
      headers: getHeaders()
    })
    .done(function(data) {
      hideForms();
      $('#contentTitle').text(heading + ' ' + type + ' Unflattened Flat JSON Template (from OpenEHR)');
      $('#content').show();
      $('#content').text(JSON.stringify(data.schema, null, 2));  
    })
    .fail(function(error) {
      console.log('Error fetching ' + heading + ' ' + type + ' Schema: ' + error);
    });
  });


  $('#addHeadingBtn').on('click', function(e) {
    hideForms();
    $('#headingJSONForm').show();
    $('#content').hide();
    $('#contentTitle').text('');
  });

  $('#cancelAllergyBtn').on('click', function(e) {
    hideForms();
    $('#mpiBtn').show();
    $('#content').show();    
    $('#contentTitle').text("");
    $('#content').text("");
  });

  $('#cancelHeadingBtn').on('click', function(e) {
    hideForms();
    $('#mpiBtn').show();
    $('#content').show();    
    $('#contentTitle').text("");
    $('#content').text("");
  });


  $('#saveAllergyBtn').on('click', function(e) {
    var data = {
      allergies: [
        {
          causative_agent: {
            value: $('#allergy_causative_agent_name').val(),
            code: $('#allergy_causative_agent_code').val(),
            terminology: $('#allergy_causative_agent_terminology').val()
          },
          manifestations: [
            {
              value: $('#allergy_manifestation_name').val(),
              code: $('#allergy_manifestation_code').val(),
              terminology: $('#allergy_manifestation_terminology').val()
            }
          ],
          comment: $('#allergy_comment').val()
        }
      ]
    };

    var message = {
      dataType: 'json',
      data: JSON.stringify(data),
      contentType: 'application/json',
      headers: getHeaders()
    };

    message.url = '/openehr/heading/allergies/' + jwt.openid.userId + '?format=ui';
    message.method = 'POST';

    $.ajax(message)
    .done(function(data) {
      console.log('OpenEHR POST response: ' + JSON.stringify(data, null, 2));
      alert('Allergy saved');
      $('#getAllergiesRawBtn').click();
    })
    .fail(function(error) {
      console.log('Allergy POST error: ' + error.responseJSON.error);
      alert(error.responseJSON.error);
      hideForms();
    });

  });

  $('#saveHeadingBtn').on('click', function(e) {
    var data = $('#headingJSONInput').val();
    var heading = $('#headingNameInput').val();
    var format = $('#headingInputTransform').val();

    var message = {
      dataType: 'json',
      data: data,
      contentType: 'application/json',
      headers: getHeaders()
    };

    message.url = '/openehr/heading/' + heading + '/' + jwt.openid.userId + '?format=' + format;
    message.method = 'POST';

    $.ajax(message)
    .done(function(data) {
      console.log('OpenEHR POST response: ' + JSON.stringify(data, null, 2));
      alert(heading + ' record saved');
      $('#getAllergiesRawBtn').click();
    })
    .fail(function(error) {
      console.log(heading + ' POST error: ' + error.responseJSON.error);
      alert(error.responseJSON.error);
      hideForms();
    });

  });

  $('#unFlattenBtn').on('click', function(e) {
    hideForms();
    $('#flatJSONForm').show();
    $('#content').show();    
    $('#contentTitle').text("");
    $('#content').text("");
  });

  $('#unFlattenItBtn').on('click', function(e) {
    var flatJSON = $('#flatJSON').val();
    try {
      flatJSON = JSON.parse(flatJSON);
      var unflatJSON = unflatten(flatJSON);
      hideForms();
      $('#content').show();  
      $('#contentTitle').text("Unflattened version of your JSON");
      $('#content').text(JSON.stringify(unflatJSON, null, 2));
    }
    catch(err) {
      alert('Unable to parse that JSON');
    }
  });

  $('#getJWTBtn').on('click', function(e) {
    hideForms();
    $('#contentTitle').text("Current JWT");
    $('#content').show();
    $('#content').html(getCookie('JSESSIONID') + '<br /> <br />'); 
  });

});


function unflatten(flatJson) {
  var value;
  var json = {};

  for (var path in flatJson) {
    value = flatJson[path];

    // pre-process to sort out | anomalies

    if (path.indexOf('|') !== -1) {
      var pieces = path.split('|');
      var prev;
      var lc;
      var found = false;
      var xpcs;
      var prevRev;
      for (var i = 1; i < pieces.length; i++) {
        prev = pieces[i - 1];
        lc = prev[prev.length - 1];
        if (isNumeric(lc)) {
          prevRev = rev(prev);
          xpcs = prevRev.split(':');
          if (isNumeric(rev(xpcs[0]))) {
            pieces[0] = pieces[0] + '/';
            found = true;
          }
        }
      }
      if (found) {
        path = pieces.join('|');
      }
    }

    // now begin processing

    pieces = path.split('/');
    var ref = json;
    var lastIndex = pieces.length - 1;
    pieces.forEach(function(piece, ix) {
      var pieces = piece.split(':');
      var name = pieces[0];
      var index = pieces[1];
      if (typeof index === 'undefined') {
        if (typeof ref[name] === 'undefined') {
          if (ix === lastIndex) {
            ref[name] = value;
          }
          else {
            ref[name] = {};
          }
        }
        ref = ref[name];
      }
      else {
        if (typeof ref[name] === 'undefined') {
          ref[name] = [];
          if (ix === lastIndex) {
            ref[name][index] = value;
          }
          else {
            ref[name][index] = {};
          }
        }
        if (typeof ref[name][index] === 'undefined') {
          ref[name][index] = {};
        }
        ref = ref[name][index];
      }
    });
  }
  return json;
}
