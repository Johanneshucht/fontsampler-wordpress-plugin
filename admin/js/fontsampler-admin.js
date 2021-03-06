jQuery(function () {
	var $ = jQuery;

    // enable frontend side form validation
    $.validate({
        form: ".fontsampler-validate",
        modules : 'file',
    });

	// todo limit amount of select options to the number of font sets / don't allow duplicates on frontend side
    // duplicate inputs are going to be filtered out on db entry
	$("#fontsampler-admin").on("click", ".fontsampler-fontset-remove", function (e) {
		e.preventDefault();
		if ($("#fontsampler-fontset-list li").length > 1) {
			$(this).parent("li").remove();

            // the the row with the current default font gets delete, move the default to the first font
            if ($("#fontsampler-fontset-list input[name=initial_font]:checked").length === 0) {
                $("#fontsampler-fontset-list li:first input[name=initial_font]").attr("checked", "checked");
            }
		} else {
			console.log("Nope. Can't delete last picker");
		}
        $("#fontsampler-fontset-list").sortable("refresh");
        updateFontsOrder();
        updateInlineFontIndexes();
	});

    /**
     * Adding a new fontsampler select box with prefilled existing fonts
     */
	$("#fontsampler-edit-sample").on("click", ".fontsampler-fontset-add", function (e) {
		e.preventDefault();
		var $clone = $("#fontsampler-admin-fontpicker-placeholder").clone();
        $clone.find("input[name=initial_font]").removeAttr("checked").val("0");
        $clone.find("span.fontsampler-initial-font").removeClass('selected');
        $clone.appendTo("#fontsampler-fontset-list");

		$("#fontsampler-fontset-list li:last option[selected='selected']").removeAttr('selected');
        $("#fontsampler-fontset-list").sortable("refresh");

        updateFontsOrder();
	});

    /**
     * On updating the select font dropdown in the fontsampler font section, update the input that send this font's ID
     * if it is selected as the default font
     */
    $("#fontsampler-fontset-list").on("change", "select[name='font_id[]']", function () {
        $(this).siblings(".fontsampler-initial-font-selection").find("input[name=initial_font]").val($(this).val());
    });

    $("#fontsampler-fontset-list").on("change", "input[name=initial_font]", function () {
        $("#fontsampler-fontset-list span.fontsampler-initial-font").removeClass("selected");
        $("#fontsampler-fontset-list input[name=initial_font]:checked").siblings("span.fontsampler-initial-font").addClass("selected");
    });

    $("#fontsampler-admin").on("change", "#fontsampler-fontset-list select", function () {
        $(this).siblings("input[name=initial_font]").val($(this).val());
        updateFontsOrder();
    });

    // allow sorting multiple fonts in a fontsampler
    $("#fontsampler-fontset-list").sortable({
        handle: ".fontsampler-fontset-sort-handle",
        stop: updateFontsOrder
    });

    /**
     * Creating a new inline font upload form inside the form for creating a fontsampler
     */
    $(".fontsampler-fontset-create-inline").on("click", function () {
        var $clone = $("#fontsampler-fontset-inline-placeholder").clone().removeAttr("id"),
            $fontsList = $("#fontsampler-fontset-list");

        $fontsList.append($clone);
        updateInlineFontIndexes();
        updateFontsOrder();
        return false;
    });


    /**
     * Update the input field fonts_order with a comma separated list of fonts, in the order they are sorted
     * Note: newly created inline fontsets are marked in this list as "inline_ID"
     */
    function updateFontsOrder() {
        var order = $("#fontsampler-fontset-list").find("select[name='font_id[]'], input.inline_font_id").map(function () {
            return $(this).val();
        }).get().join();
        $("input[name=fonts_order]").val(order);
    }


    /**
     * Update the indexes of all file upload inputs of any inline from upload forms, so that they start with 0 index
     * and have no gaps in the name attribute
     */
    function updateInlineFontIndexes() {
        var $fontsList = $("#fontsampler-fontset-list"),
            $placeholder = $("#fontsampler-fontset-inline-placeholder");

        // for the actual font list, go through all now created fontsets and number all their containing
        // file inputs them 0 index based
        $fontsList.find(".fontsampler-fontset-inline").each(function (index, elem) {
            var $this = $(this);

            // set the entire set of file inputs with woff2, woff, etc to the right index of this inserted placeholder
            $this.find("input[type=file]").each(function () {
                var currentName = $(this).attr("name");
                $(this).attr("name", $(this).attr("name").substring(0, currentName.lastIndexOf("_") + 1) + index);
            });

            // to each of those fontsets add 'inline_x' to their hidden inline_font_id
            // this is used in updateFontsOrder to save a placeholder position of that particular font for processing
            $this.find("input.inline_font_id").each(function () {
                $(this).val('inline_' + index);
            });

            // update the radio for setting this font as default for this fontsampler to include a placeholder value
            // so it can be replaced after upload
            $this.find("input[name=initial_font]").val('inline_' + index);
        });

        // in the actual placeholder form, remove the index from the file input, so it doesn't get sent along (at least
        // not as woff_0 etc, which would overwrite the first uploaded fontset's files as empty
        $placeholder.find("input[type=file]").each(function () {
            var currentName = $(this).attr("name");
            $(this).attr("name", $(this).attr("name").substring(0, currentName.lastIndexOf("_") + 1));
        });
    }


    // setting sliders
    $('#fontsampler-admin .form-settings input[type="range"]').rangeslider({
        // Feature detection the default is `true`.
        // Set this to `false` if you want to use
        // the polyfill also in Browsers which support
        // the native <input type="range"> element.
        polyfill: false,
        onSlide: function () {
            var $input = this.$element.closest("label").find(".current-value");
            // prevent reacting to a slide event triggered my text field input update,
            // thus preventing the user being unable to type, as the text input would get overwritten from this update
            if (! $input.is(":focus")) {
                $input.val(this.$element.val());
            }
        }
    });
    $("#fontsampler-admin .form-settings input.current-value").on("keyup", function () {
        var $sliderInput = $(this).closest("label").find("input[name='" + $(this).data("name") + "']"),
            min = $sliderInput.attr("min"),
            max = $sliderInput.attr("max"),
            intval = parseInt($(this).val()),
            constrainedValue = Math.min(Math.max(intval, min), max);

        // prevent blocking the type input while also updating it should the value have been beyond the limits
        if (intval !== constrainedValue && ! isNaN(constrainedValue) ) {
            $(this).val(constrainedValue);
        }
        $sliderInput.val(constrainedValue).change();
    });

    $("#fontsampler-admin .fontsampler-fontset-remove-font").on("click", function (e) {
        e.preventDefault();
        $(this).closest("tr").find(".hidden-file-name").remove();
        $(this).closest("tr").find(".filename").html("");
    });


    // interface
    $("#fontsampler-admin .form-settings input[type=range]").on('change, input', function () {
        var $display = $(this).closest('label').find('code.current-value');
            val = $(this).val(),
            unit = $(this).data('unit');

        $display.html(val);
    });


    $(".fontsampler-preview").fontSampler();

    //Colour picker
    $('.color-picker').wpColorPicker({
        color: false,
        mode: 'hsl',
        controls: {
            horiz: 's', // horizontal defaults to saturation
            vert: 'l', // vertical defaults to lightness
            strip: 'h' // right strip defaults to hue
        },
        hide: true, // hide the color picker by default
        border: false, // draw a border around the collection of UI elements
        target: false, // a DOM element / jQuery selector that the element will be appended within. Only used when called on an input.
        width: 200, // the width of the collection of UI elements
        palettes: true // show a palette of basic colors beneath the square.
    });


    // UI preview sortable
    function calculateUIOrder() {
        var order = "";
        $(".fontsampler-ui-preview-list").each(function (index, element) {
            $(element).children("li").each(function (i, elem) {
                order = order.concat($(elem).data("name")).concat(",");
            });
            order = order.slice(0, -1);
            order = order.concat("|");
        });
        order = order.slice(0, -1);
        $(".fontsampler-ui-preview input[name=ui_order]").val(order);
        return order;
    }

    $(".fontsampler-ui-preview-list").sortable({
        connectWith: ".fontsampler-ui-preview-list",
        placeholder: "ui-state-highlight",
        forcePlaceholderSize: true,
        stop: function () {
            $(".fontsampler-ui-preview-list .original-sibling").removeClass("original-sibling");
            calculateUIOrder();
        },
        over: function( event, ui ) {
            // TODO there is one case that is not covered ideally:
            // when dragging a single item from a 2 item row onto the next row with 3 items and then onto the textarea
            // the textarea and the first row swap place, when it should be texarea and second row
            if (ui.item.hasClass("fontsampler-ui-placeholder-full")) {
                // textarea is dragged: swap on the fly with all current items
                var $sender = $(".fontsampler-ui-preview-list:has(.ui-sortable-helper)");
                var $receiver = $(".fontsampler-ui-preview-list:has(.ui-state-highlight)");
                $(".fontsampler-ui-preview-list").each(function (index, element) {
                   if ($(element).children().length == 0) {
                       $sender = $(element);
                   }
                });
                $receiver.children(":not(.ui-sortable-helper):not(.ui-state-highlight)").each(function (index, $element) {
                    $sender.append($element);
                });
            } else if (ui.placeholder.siblings().length > 1 && ui.placeholder.siblings(":not(.ui-sortable-helper)").length == 3) {
                // single item is dragged and receiving list is full, swap the one item with the last of the receiving list
                // TODO not :last but: the one hovering closest to
                var $receiver = $(".fontsampler-ui-preview-list:has(.ui-state-highlight)");
                var $sender = $(".fontsampler-ui-preview-list:not(:has(.ui-state-highlight))").not(":has(.fontsampler-ui-placeholder-full)");
                $sender.append($receiver.children(".fontsampler-ui-block:last"));
                $receiver.append(ui.item);

            } else if (ui.placeholder.siblings(".fontsampler-ui-placeholder-full").length == 1) {
                // single items dragged to where the textarea is, swap the textarea with where the single item originates from
                var $origin = $(".fontsampler-ui-preview-list:has(.ui-sortable-helper)");
                var $destination = $(".fontsampler-ui-preview-list:has(.fontsampler-ui-placeholder-full)");

                if ($destination.has(".ui-sortable-helper").length == 1) {
                    $destination = $origin;
                    $origin = $(".fontsampler-ui-preview-list:has(.original-sibling)");
                }
                $origin.children(":not(.ui-sortable-helper)").each(function (index, element) {
                    $(element).addClass("original-sibling");
                    $destination.append($(element));
                });
                $origin.append($(".fontsampler-ui-placeholder-full"));
            }
        }
    });


    // sampler checkboxes & UI preview interaction
    $("#fontsampler-edit-sample input[type=checkbox]").on("change", function () {
        iterateCheckboxes($(this));
    });
    calculateUIOrder();

    /**
     * Function that gets called when any of the checkboxes controlling the display of a UI element get toggled
     * If the element is currently hidden, it gets appended to the sortable
     * If the element is currently visible, it gets stashed in the placeholder list
     *
     * @param $this - the checkbox
     * @returns {boolean}
     */
    function iterateCheckboxes($this) {
        var attr = $this.attr("name"),
            checked = $this.is(":checked"),

            // the fields controlling the "option" preview block
            $combined = $("input[name*=ot], input[name=alignment], input[invert]"),
            $optionsElem = $(".fontsampler-ui-preview li[data-name=options]"),
            $elem = $(".fontsampler-ui-preview li[data-name='" + attr + "']");

        if (checked) {
            // proceed showing
            // copy element from placeholder to the first preview list with less than 3 items in it (and not the text input)

            // if it's one of the special "options" checkboxes show it
            if (attr.indexOf("ot_") > -1 || ['alignment', 'invert'].indexOf(attr) > -1 ) {
                $elem = $optionsElem;
            }

            $(".fontsampler-ui-preview-list:not(:has(.fontsampler-ui-placeholder-full))").filter(function () {
                return $(this).children("li").length < 3;
            }).filter(":first").append($elem);
            $elem.fadeIn(calculateUIOrder);
        } else {
            // see if the unchecked field was one of the combo fields from OP alignment or inverting
            if (attr.indexOf("ot_") > -1 || ['alignment', 'invert'].indexOf(attr) > -1 ) {
                if ($combined.filter(":checked").length > 0) {
                    // if indeed it is one of those checkboxes that got changed and if indeed not all of those fields
                    // are unchecked, the UI field remains visible, so do nothing / don't fade out the preview field
                    return false;
                } else {
                    $elem = $optionsElem;
                }
            }

            // proceed hiding
            $elem.fadeOut(function () {
                $(this).appendTo(".fontsampler-ui-preview-placeholder");
                calculateUIOrder();
            });
        }
    }


    $("#fontsampler-edit-sample input[name=default_features]").on("change", function () {
        var $checkboxes = $("#fontsampler-options-checkboxes input[type=checkbox]"),
            $this = $(this);

        $checkboxes.each(function () {
            var $that = $(this);

            if ( parseInt( $this.val() ) === 1 ) {
                // use defaults:
                if ($that.data('default') == 'checked') {
                    $that.attr('checked', 'checked');
                } else {
                    $that.removeAttr('checked');
                }
            } else {
                // use custom set:
                if ($that.data('set') == 'checked') {
                    $that.attr('checked', 'checked');
                } else {
                    $that.removeAttr('checked');
                }
            }
            iterateCheckboxes($that);
        });
    });

    // update the script writing direction on selecting an option
    $("#fontsampler-edit-sample input[name=is_ltr]").on("change", function () {
        var $textarea = $(this).closest('form').find('textarea[name="initial"]');
        if (parseInt($(this).val()) === 1) {
            $textarea.attr("dir", "ltr");
        } else {
            $textarea.attr("dir", "rtl");
        }
    });

    // toggling a class on given element from a radio set
    $("[data-toggle-id]").on("change", function () {
        if (parseInt( $(this).val() ) === 1) {
            $("#" + $(this).data('toggle-id')).addClass($(this).data('toggle-class'));
        } else {
            $("#" + $(this).data('toggle-id')).removeClass($(this).data('toggle-class'));
        }
    });


    // fontsets list pagination
    $("#fontsampler-admin nav.fontsampler-pagination a").on("click", function (event) {
        event.preventDefault();

        var $this = $(this),
            $target = $("#" + $this.data("target") ),
            href = $this.attr("href");

        $.get(href, function (result, error) {
            $target.html($(result).find("#fontsampler-admin-tbody-ajax").html());
            $(".fontsampler-preview").fontSampler();
            $("html, body").scrollTop(0);
        });

        $("#fontsampler-admin nav.fontsampler-pagination a.fontsampler-pagination-current-page").removeClass("fontsampler-pagination-current-page");
        $("#fontsampler-admin nav.fontsampler-pagination a:nth-of-type(" + ($this.index() + 1) + ")").addClass("fontsampler-pagination-current-page");

        return false;
    });

});
