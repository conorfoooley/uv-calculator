$(document).ready(function () {
   let date = new Date;
   const offset = date.getTimezoneOffset()/60;
   const hour = date.getHours();
   const minute = date.getMinutes();
   const hour_offset = Math.abs(3-offset);
   let current_hour = null;
   let uv_value = null;
   if(offset<=3){
      
      if(hour - hour_offset < 0){
         current_hour = 24 + hour - hour_offset;
      }
      else{
         current_hour = hour - hour_offset;
      }
   }
   else{
      if(hour - hour_offset >= 24){
         current_hour = hour + hour_offset -24;
      }
      else{
         current_hour = hour + hour_offset;
      }
   }
   let current_hour_str = "";
   let minute_str = "";
   if(current_hour<10)
      current_hour_str = "0"+current_hour;
   else
      current_hour_str = ""+current_hour;
   if(minute<10)
      minute_str = "0"+minute;
   else
      minute_str = ""+minute;
   $('.current-time').text(current_hour_str+":"+minute_str+" hs.");

   $("select").niceSelect();
   let cityObj = null;
   $.ajax({
         'async': false,
         'global': false,
         'url': "https://api.npoint.io/84b83cc568ddad9002b7",
         'dataType': "json",
         'success': function (data) {
            cityObj = data;
         }
   });
   let uvDataObj = null;
   $.ajax({
         'async': false,
         'global': false,
         'url': "https://api.npoint.io/9b72f4e149600aee5746",
         'dataType': "json",
         'success': function (data) {
            uvDataObj = data;
         }
   });
   let active_flag = '';
   $.each(cityObj, function(i,city){
      if(i==0){
         active_flag = 'active';
      }
      else
         active_flag = '';
      $('.uv-item-div').append(
         '<div class="carousel-item '+ active_flag +'"><div class="col-md-3 uv-item-col"><div class="uv-item"><h3>'+city.city_name+'</h3><div class="btn" data-index="'+city.id+'" data-name="'+city.city_name+'" data-text="'+city.city_text+'">Ver índice UV</div></div></div></div>'
      );
      $('.search-input-option').append(
         '<option class="search-option" id="'+city.city_name+'" value="'+city.city_text+'">'
      );
   });
   $('.carousel .carousel-item').each(function(){
      let minPerSlide = 4;
      let next = $(this).next();
      if (!next.length) {
      next = $(this).siblings(':first');
      }
      next.children(':first-child').clone().appendTo($(this));
      
      for (let i=0;i<minPerSlide;i++) {
          next=next.next();
          if (!next.length) {
             next = $(this).siblings(':first');
           }
          
          next.children(':first-child').clone().appendTo($(this));
        }
   });

   function getDataWithUV(uv_value) {
      if(parseFloat(uv_value) < 3) {
         $('.uv-level').text("Bajo");
         $('.notice-title').text("Buenas noticias");
         $('.notice-text').text("Buenas noticiasLorem ipsum dolor sit amet, consectetuer adipiscing Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam");
         $('.uv-image').attr('src','assets/img/bajo.png');
      }
      if(parseFloat(uv_value) >= 3 && parseFloat(uv_value) <=5) {
         $('.uv-level').text("Moderado");
         $('.notice-title').text("Precaución");
         $('.notice-text').text("El pronóstico indica un nivel moderado de radiación ultravioleta, por lo que se recomienda tomar precauciones para proteger la piel y los ojos, como usar bloqueador solar de amplio espectro con un factor de protección solar (SPF) de al menos 30, lentes de sol y evitar la exposición al sol durante largos períodos de tiempo, especialmente entre las 10 AM y las 4 PM.");
         $('.uv-image').attr('src','assets/img/moderado.png');
      }
      if(parseFloat(uv_value) >= 6 && parseFloat(uv_value) <=7) {
         $('.uv-level').text("Alto");
         $('.notice-title').text("Pronóstico alto");
         $('.notice-text').text("El pronóstico indica un nivel alto de radiación ultravioleta, lo que significa que la exposición al sol puede ser dañina para la piel y los ojos. Se recomienda tomar precauciones adicionales, como usar ropa protectora de color claro, sombrero de ala ancha y gafas de sol con protección contra los rayos UVA y UVB, y evitar la exposición al sol durante las horas pico del día, especialmente entre las 10 AM y las 4 PM. También se debe aplicar bloqueador solar con un SPF de al menos 30 cada dos horas.");
         $('.uv-image').attr('src','assets/img/alto.png');
      }
      if(parseFloat(uv_value) >= 8 && parseFloat(uv_value) <=10) {
         $('.uv-level').text("Muy alto");
         $('.notice-title').text("Pronóstico muy alto");
         $('.notice-text').text("El pronóstico indica un nivel muy alto de radiación ultravioleta, lo que significa que la exposición al sol puede ser extremadamente dañina para la piel y los ojos. Se recomienda tomar precauciones adicionales, como evitar la exposición directa al sol durante las horas pico del día, usar ropa protectora de color claro, sombrero de ala ancha, gafas de sol con protección contra los rayos UVA y UVB y aplicar bloqueador solar con un SPF de al menos 30 cada dos horas.");
         $('.uv-image').attr('src','assets/img/muy-alto.png');
      }
      if(parseFloat(uv_value) >= 11) {
         $('.uv-level').text("Extremo");
         $('.notice-title').text("Pronóstico extremo");
         $('.notice-text').text("El pronóstico indica un nivel extremo de radiación ultravioleta, lo que significa que la exposición al sol puede ser peligrosa. Se recomienda evitar la exposición directa al sol durante las horas pico del día, especialmente entre las 10 AM y las 4 PM, y permanecer en lugares sombreados o interiores. Es importante usar ropa protectora de color claro, sombrero de ala ancha, gafas de sol con protección contra los rayos UVA y UVB y aplicar bloqueador solar con un SPF de al menos 30 cada dos horas. También se recomienda reducir cualquier actividad al aire libre a un mínimo absoluto.");
         $('.uv-image').attr('src','assets/img/extreme.png');
      }
   }

   var textbox = document.getElementById("search-input");
   textbox.addEventListener("input", function(e){
    
   var isInputEvent = (Object.prototype.toString.call(e).indexOf("InputEvent") > -1);
    
   if(!isInputEvent){
      let text = e.target.value;
      let name = null;
      $('.city-text').text(text);
      $.each(cityObj, function(i,city){
        if(city.city_text==text){
          name = city.city_name;
        }
      });
      
      let uv_city_arr = null;
      
      $.each(uvDataObj.resultado, function(i,uvData){
         if(uvData.nombre == name){
            if(uvData.hora == current_hour){
               uv_city_arr = uvData;
               uv_value = uvData.uv;
            }
            else{
               uv_city_arr = null;
            }
         }
         if(uv_city_arr!=null){
            $('.uv-value').text(uv_value);
         }
      });
      getDataWithUV(uv_value);
      showChart();
   }
   }, false);   
   $('.btn').click(function() {
      let index = $(this).data('index');
      let name = $(this).data('name');
      let text = $(this).data('text');
      $('.city-text').text(text);
      let uv_city_arr = null;
      $.each(uvDataObj.resultado, function(i,uvData){
         if(uvData.nombre == name){
            if(uvData.hora == current_hour){
               uv_city_arr = uvData;
               uv_value = uvData.uv;
            }
            else{
               uv_city_arr = null;
            }
         }
         if(uv_city_arr!=null){
            $('.uv-value').text(uv_value);
         }
      });
      getDataWithUV(uv_value);
      showChart();
   });
   var ctx = document.getElementById("myChart");
   showChart();
   function showChart() {
      var myChart = new Chart(ctx, {
         type: 'doughnut',
         data: {
            labels: ["uv","rest"],
            datasets: [{
                  label: '# of Votes',
                  data: [uv_value,11-uv_value],
                  text: "ff",
                  backgroundColor: [
                     '#007bff'
                  ],
                  borderColor: [
                     '#007bff'
                  ],
                  borderWidth: 1
            }]
         },
         options: {
            legend: {
               display: false
            },
            rotation: 1 * Math.PI,
            circumference: 1 * Math.PI,
            cutoutPercentage: 98,
            tooltip: {
               enabled: false // <-- this option disables tooltips
            }
         }
      });
   }
});
