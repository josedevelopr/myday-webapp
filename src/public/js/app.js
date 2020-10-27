// Initializing components
$(function () {
    $("#birthday").datepicker({ 
          autoclose: true, 
          todayHighlight: true
    }).datepicker('update', new Date());
  });