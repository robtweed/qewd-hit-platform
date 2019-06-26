// Login enter
$(window).keydown(function(e){
  if(e.keyCode == 13) {
    e.preventDefault();
   $('#loginBtn').click();
  }
});

