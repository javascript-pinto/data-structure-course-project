 $(function() {
    $('#navbar > ul > li.active').removeClass('active');
    $('a[href="' + location.pathname + '"]').closest('li').addClass('active'); 
  });