define([ "libs/require/order!libs/jquery/jquery"
       , "libs/require/order!libs/jquery/tojson"
       ]

       , function($) {
           // Raw sammy does not return anything, so return it explicitly here.
           return $.fn.toJSON;
         }
      );