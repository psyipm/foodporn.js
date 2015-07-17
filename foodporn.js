setTimeout(function() {
  var title = jQuery("<div></div>");
  title.css({position: "fixed", top: 20, left: 20});
  jQuery('body').append(title);

  var message = jQuery("<div></div>");
  message.css({position: "fixed", top: 20, left: 20, color: "red"});
  message.text("Script loaded");
  jQuery('body').append(message)
  message.fadeOut(3000);
  
  jQuery(".ss-form-question .ss-choice-item input").unbind("change").change(function(){
    var sum = 0;
    var parent = jQuery(this).parents(".ss-form-question")
    var checkSum = title.find(".checkSum");
    var day = parent.find(".ss-q-title").text();
    
    parent.find(".ss-choice-item input:checked").each(function(){
      try {
        sum += Number(/[\d\,\.]?\d+$/.exec(this.value)[0].replace(',', '.'));
      }
      catch(e) {
        console.log(e.message);
      }
    });
    
    if (checkSum.length == 0) {
      checkSum = jQuery("<div/>").addClass("checkSum").css("font-size", "20px").css("color", "brown");
      title.append(checkSum);
    }

    checkSum.html(day + "<br>Total: " + sum + ", left: " + (50 - sum));
  });
}, 500);