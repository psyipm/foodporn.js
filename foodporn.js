setTimeout(function() {
  var Items = (function () {

    function Items() {
      this.items = {}
    }

    Items.prototype.getItems = function(day) {
      if(day == undefined) {
        return this.items;
      }

      return (this.items[day] == undefined) ? { items: [], total: 0 } : this.items[day];
    };

    Items.prototype.push = function(day, item, total) {
      var _order = this.getItems(day);
      _order.total = total;

      if(_order.items.indexOf(item) == -1) {
        _order.items.push(item);
      }

      this.items[day] = _order;
    };

    Items.prototype.remove = function(day, item, total) {
      var _order = this.getItems(day);
      _order.total = total;

      var index = _order.items.indexOf(item);
      if(index != -1) {
        _order.items.splice(index, 1);
      }

      this.items[day] = _order;
    };

    return Items;

  })();

  var Foodporn = (function() {

    function Foodporn(options) {
      this._setDefaults(options);

      this.container = null;
      this.items = null;
      this.day = null;
      this.sum = 0;

      this.init();
    }

    Foodporn.prototype._setDefaults = function(options) {
      var defaults;
      if (options == null) {
        options = {};
      }

      defaults = {
        limit: 50,
        container: '<div class="list-group"></div>',
        style: {
          position: 'fixed',
          top: 20,
          right: 20,
          opacity: 0.75
        }
      };

      this.options = $.extend(defaults, options);
    };

    Foodporn.prototype._notify = function() {
      var message = $('<div><div>');
      message.css(this.options.style);
      message.text("Script loaded");
      $('body').append(message)
      message.fadeOut(3000);
    };

    Foodporn.prototype.init = function() {
      this.container = $(this.options.container);
      this.container.css(this.options.style);
      $('body').append(this.container);

      this.items = new Items();

      this._notify();
    };

    Foodporn.prototype.round = function(value) {
      return Number(value.toFixed(2));
    };

    Foodporn.prototype.calculate = function(element) {
      try {
        this.sum += Number(/([\d]*[\,\.]*[\d]*)$/.exec(element.value)[0].replace(',', '.'));
      }
      catch(e) {
        console.log(e.message);
      }
    };

    Foodporn.prototype.updateItems = function(element) {
      if($(element).is(":checked")) {
        this.items.push(this.day, element.value, this.sum);
      }
      else {
        this.items.remove(this.day, element.value, this.sum);
      }
    };

    Foodporn.prototype.getClass = function(total) {
      return (total > this.options.limit) ? 'list-group-item-danger' : 'list-group-item-success';
    };

    Foodporn.prototype.getTotals = function(total) {
      var left = this.options.limit - total;
      return "<h4 class='totals'> Total: " + this.round(total) + ", Left: " + this.round(left) + "</h4>";
    };

    Foodporn.prototype.show = function() {
      var self = this;
      var items = this.items.getItems();
      var element = '';

      $.map(items, function(_order, day) {
        element += "<a class='list-group-item " + self.getClass(_order.total) + "'><h4 class='list-group-item-heading'>" + day + "</h4>";

        $(_order.items).each(function() {
          element += "<p class='list-group-item-text'>" + this + "</p>";
        });

        element += self.getTotals(_order.total);
        element += "</a>";
      });

      this.container.hide().empty().append(element).fadeIn("fast");
    };

    Foodporn.prototype.bind = function() {
      var self = this;
      $(".ss-form-question .ss-choice-item input").off("change").on("change", function() {
        self.sum = 0;

        var parent = $(this).parents(".ss-form-question");
        self.day = $(parent).find(".ss-q-title").text();

        $(parent).find(".ss-choice-item input:checked").each(function(){
          self.calculate(this);
        });

        self.updateItems(this);
        self.show();
      });
    };

    return Foodporn;
  })();


  var f = new Foodporn();
  f.bind();
}, 500);


