$("#SIGN_UP_USERNAME").change(function () {
      var username = $(this).val();

      $.ajax({
        url: '/ajax/validate_username/',
        data: {
          'username': username
        },
        dataType: 'json',
        success: function (data) {
          if (data.is_taken) {
            alert("A user with this username already exists.");
          }
        }
      });
});