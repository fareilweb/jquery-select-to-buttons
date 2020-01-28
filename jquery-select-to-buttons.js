(function ($) {

  $.fn.selectToButtons = function (user_settings) {
    var $this = this;

    if($this.length == 0) {
      return $this;
    }

    var current_value = this.val();
    var current_selected_index = this[0].selectedIndex;

    // Settings
    var settings = $.extend({
      containerClass: '',
      containerId: '',
      buttonsBackgroundColor: "#222222",
      buttonsTextColor: "#ffffff",
      hideFirstOption: false
    }, user_settings);


    /* ---------------------------------------------------------------- *
     * Methods
     * ---------------------------------------------------------------- */

    $this.selectCurrent = function (button, option) {
      var index = button.dataset.index;
      $this.setValueToSelect(option);
      $this.highlightSelectedBtn(index);
    };

    $this.setValueToSelect = function(option) {
      //$this[0].selectedIndex = option.index;
      $this.val(option.optionValue);
      $this.find('option').each(function(index, sourceOption) {
        if(sourceOption.value === option.optionValue) {
          sourceOption.setAttribute("selected", "selected");
        } else {
          sourceOption.removeAttribute("selected");
        }
      });
      $this.trigger("change");
    };

    $this.highlightSelectedBtn = function(current_index) {
      var $buttons = $($this.container).find("button");
      $buttons.each(function(index, button) {
        var $button = $(button);
        if($button.data("index") == current_index) {
          $button.addClass("selected");
        } else {
          $button.removeClass("selected");
        }
      });
    };



    /* ---------------------------------------------------------------- *
     * Plugin Logic
     * ---------------------------------------------------------------- */

    // Hide source select
    this.hide();

    // Highlight button of current value (if is set)
    if( !!current_value ) {
      $this.highlightSelectedBtn(current_selected_index);
    }

    // Update value if is changed from other source
    this.on("change", function(e) {
      current_value = $this.val();
      current_selected_index = $this[0].selectedIndex;
      $this.highlightSelectedBtn(current_selected_index);
    });

    // Create a container for our buttons
    $this.container = document.createElement("div");
    $this.container.id = settings.containerId;
    $this.container.setAttribute('class', 'jquery-select-to-buttons ' + settings.containerClass);
    this.after($this.container);

    // Get options from source input
    $this.options = [];
    this.find("option").each(function(index, option) {
      var $option = $(option);
      $this.options.push({
        index: index,
        optionText: $option.text(),
        optionValue: $option.val()
      });
    });

    // Create and append buttons
    this.options.forEach(function(option, index) {
      // Is possible ignore first element
      if(settings.hideFirstOption && index == 0) { return; }

      var button = document.createElement("button");
      // Button Attributes
      button.innerText = option.optionText;
      button.setAttribute("data-index", option.index);
      button.setAttribute("class", "jquery-select-to-buttons__button");

      // Button Style
      button.style.backgroundColor = settings.buttonsBackgroundColor;
      button.style.color = settings.buttonsTextColor;

      if(!!current_value && !!current_selected_index && option.index == current_selected_index) {
        var button_class = button.getAttribute("class");
        button.setAttribute("class", button_class + ' selected')
      }

      button.onclick = function(e) {
        e.preventDefault();
        $this.selectCurrent(button, option);
        return false;
      };

      $this.container.appendChild(button);
    });


    //this.after(output);

    return this;
  };

}(jQuery));