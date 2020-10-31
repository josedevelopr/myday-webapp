$( document ).ready(function() {
      $(function () {
            $("#birthday").datepicker({ 
                  autoclose: true, 
                  todayHighlight: true
            }).datepicker('update', new Date());
      });

      $(function () {
              $('[data-toggle="tooltip"]').tooltip()
      })
});