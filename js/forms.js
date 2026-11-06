/* forms.js - client-side validation and AJAX submission.
   booking.html  : service enquiry -> validated, sent by AJAX, answered with an
                   estimated cost and slot availability.
   contact.html  : general message -> validated, sent by AJAX, compiled into an
                   email the visitor can send to the address in data-recipient. */
(function ($) {
  "use strict";

  /* ---------------- Validation helpers ---------------- */
  var MESSAGES = {
    valueMissing: "This field is required.",
    typeMismatch: "Please enter a valid value.",
    patternMismatch: "That does not match the format we need.",
    tooShort: "That is too short.",
    tooLong: "That is too long."
  };

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parseDate(v) { var p = v.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }

  /* Custom rules, keyed by field name. Return a message, or "" when valid. */
  var custom = {
    name: function (v) {
      return /^[A-Za-zÀ-ɏ][A-Za-zÀ-ɏ' .-]{1,59}$/.test(v) ? "" : "Use letters only, 2 to 60 characters.";
    },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v) ? "" : "Enter an email like name@example.co.za.";
    },
    phone: function (v) {
      if (!v) { return ""; }
      return /^(\+27|0)[1-9][0-9]{8}$/.test(v.replace(/[\s()-]/g, "")) ? "" : "Enter a South African number, for example 082 345 6789.";
    },
    postcode: function (v) { return !v || /^[0-9]{4}$/.test(v) ? "" : "A postal code has exactly 4 digits."; },
    date: function (v) {
      var d = parseDate(v), today = new Date(); today.setHours(0, 0, 0, 0);
      var max = new Date(today); max.setDate(max.getDate() + 90);
      if (isNaN(d)) { return "Enter a valid date."; }
      if (d < today) { return "Choose today or a future date."; }
      if (d > max) { return "We take bookings up to 90 days ahead."; }
      if (d.getDay() === 0) { return "Sundays are emergency call-outs only. Please call 082 345 6789."; }
      return "";
    },
    slot: function (v, $form) {
      var d = $form.find('[name="date"]').val();
      if (v && d && /^\d{4}-\d{2}-\d{2}$/.test(d) && parseDate(d).getDay() === 6 && ["12-14", "14-16", "16-18"].indexOf(v) !== -1) {
        return "On Saturdays we work 08:00 - 13:00. Choose a morning slot.";
      }
      return "";
    },
    message: function (v) {
      return $.trim(v).length >= 20 ? "" : "Please write at least 20 characters so we can help.";
    }
  };

  function errorBox($f) {
    var id = ($f.attr("id") || $f.attr("name")) + "-error";
    var $e = $("#" + id);
    if (!$e.length) {
      $e = $("<span>", { id: id, "class": "field__error", role: "alert" });
      ($f.closest(".field").length ? $f.closest(".field") : $f.closest(".field-set-inner, fieldset")).append($e);
      var d = ($f.attr("aria-describedby") || "") + " " + id;
      $f.attr("aria-describedby", $.trim(d));
    }
    return $e;
  }

  function validateField($f, $form) {
    var el = $f[0], msg = "", v = $.trim($f.val());
    if (el.type === "checkbox" || el.type === "radio") { msg = el.validity.valueMissing ? MESSAGES.valueMissing : ""; }
    else {
      if ($f.is("input:not([type=date]), textarea")) { $f.val($f.val().replace(/^\s+/, "")); }
      if (el.validity.valueMissing) { msg = MESSAGES.valueMissing; }
      else if (v && custom[$f.attr("name")]) { msg = custom[$f.attr("name")](v, $form); }
      if (!msg && v) {
        if (el.validity.tooShort) { msg = MESSAGES.tooShort; }
        else if (el.validity.typeMismatch) { msg = MESSAGES.typeMismatch; }
        else if (el.validity.patternMismatch && !custom[$f.attr("name")]) { msg = MESSAGES.patternMismatch; }
      }
    }
    var $e = errorBox($f);
    $e.text(msg);
    $f.attr("aria-invalid", msg ? "true" : "false");
    return msg === "";
  }

  function validateForm($form) {
    var firstBad = null;
    $form.find("input, select, textarea").not("[type=hidden], [type=radio], .hp input").each(function () {
      if (!validateField($(this), $form) && !firstBad) { firstBad = this; }
    });
    // radio groups: check the group as one field
    $form.find("fieldset.field-set-inner").each(function () {
      var $r = $(this).find("input[type=radio]");
      if ($r.length && !$r.filter(":checked").length) {
        errorBox($r.first()).text("Please choose one option.");
        if (!firstBad) { firstBad = $r[0]; }
      } else { $(this).find(".field__error").text(""); }
    });
    if (firstBad) { firstBad.focus(); }
    return !firstBad;
  }

  function liveValidation($form) {
    $form.on("blur change", "input, select, textarea", function () {
      if (this.type !== "radio" && !$(this).closest(".hp").length) { validateField($(this), $form); }
    });
    $form.on("input", "[aria-invalid=true]", function () { validateField($(this), $form); });
    $form.on("reset", function () {
      $form.find(".field__error").text(""); $form.find("[aria-invalid]").removeAttr("aria-invalid");
      $form.next(".form-result").prop("hidden", true);
      setTimeout(function () { $form.find("[data-counter]").trigger("input"); }, 0);
    });
    $form.find("[data-counter]").on("input", function () {
      $("#" + $(this).data("counter")).text($(this).val().length + " / " + $(this).attr("maxlength") + " characters");
    }).trigger("input");
  }

  /* AJAX submit: POSTs JSON to the form's action URL. */
  function send($form, payload) {
    return $.ajax({
      url: $form.attr("action"), method: "POST", timeout: 10000,
      contentType: "application/json; charset=UTF-8", data: JSON.stringify(payload), dataType: "json"
    });
  }

  function formData($form) {
    var o = {};
    $.each($form.serializeArray(), function (_, f) { o[f.name] = $.trim(f.value); });
    return o;
  }

  function showStatus($form, kind, text) {
    $form.find(".form__status").attr("class", "form__status form__status--" + kind).text(text).prop("hidden", !text);
  }

  /* Common submit flow shared by both forms. */
  function handle($form, onSuccess) {
    var busy = false;
    $form.on("submit", function (e) {
      e.preventDefault();
      if (busy) { return; }
      showStatus($form, "", "");
      if (!validateForm($form)) { showStatus($form, "error", "Please fix the highlighted fields and try again."); return; }
      var data = formData($form);
      if (data.website) { return; }                           // honeypot: bots fill this in
      busy = true;
      var $btn = $form.find("[type=submit]").prop("disabled", true).data("label", $form.find("[type=submit]").text()).text("Sending...");
      send($form, data).done(function () {
        onSuccess(data);
      }).fail(function () {
        showStatus($form, "error", "We could not send that. Check your connection and try again, or call 012 345 6789.");
      }).always(function () {
        busy = false; $btn.prop("disabled", false).text($btn.data("label"));
      });
    });
  }

  /* ============================ BOOKING / ENQUIRY ============================ */
  var PRICE = {   // [low, high] indicative price incl. VAT, from the price list
    "leak-detection": [650, 1250], geyser: [2400, 3600], drains: [850, 1700],
    fittings: [450, 3900], gas: [1950, 2700], maintenance: [650, 1200], other: [650, 650]
  };
  var NAMES = {
    "leak-detection": "Leak detection and repair", geyser: "Geyser installation or replacement", drains: "Blocked drain or sewer line",
    fittings: "Bathroom or kitchen fittings", gas: "Gas installation or certificate", maintenance: "General maintenance or inspection", other: "Something else"
  };
  var SLOTS = ["08-10", "10-12", "12-14", "14-16", "16-18"];
  var rand = function (n) { return "R" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); };
  var slotLabel = function (s) { return s.replace("-", ":00 - ") + ":00"; };

  function workable(d) {   // slots a date can offer
    var w = d.getDay();
    if (w === 0) { return []; }
    return w === 6 ? SLOTS.slice(0, 2) : SLOTS;
  }
  function taken(dateStr, slot) {   // simulated bookings: stable for a given date+slot
    var h = 0, s = dateStr + slot;
    for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) % 9973; }
    return h % 4 === 0;
  }
  function nextFree(from, slot) {
    var d = new Date(from);
    for (var n = 0; n < 14; n++, d.setDate(d.getDate() + 1)) {
      var list = workable(d), ds = iso(d);
      for (var i = n === 0 ? list.indexOf(slot) + 1 : 0; i < list.length; i++) {
        if (!taken(ds, list[i])) { return { date: new Date(d), slot: list[i] }; }
      }
    }
    return null;
  }

  function bookingResult(data) {
    var range = PRICE[data.service] || PRICE.other, low = range[0], high = range[1];
    var afterHours = data.slot === "16-18";
    if (afterHours) { low += 500; high += 500; }
    var d = parseDate(data.date), free = !taken(data.date, data.slot);
    var fmt = function (x) { return x.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long" }); };

    var $r = $("#booking-result").empty().prop("hidden", false);
    $("<h2>", { "class": "form-result__title", text: "Thanks, " + data.name.split(" ")[0] + ". Here is your estimate." }).appendTo($r);
    var $dl = $('<dl class="result-list">').appendTo($r);
    function row(k, v) { $("<dt>", { text: k }).appendTo($dl); $("<dd>", { text: v }).appendTo($dl); }
    row("Service", NAMES[data.service] || data.service);
    row("Estimated cost", low === high ? rand(low) : rand(low) + " to " + rand(high) + " (incl. VAT)");
    row("Requested slot", fmt(d) + ", " + slotLabel(data.slot));
    row("Availability", free ? "Available - we will confirm within one working hour." : "That slot is already taken.");
    if (!free) {
      var alt = nextFree(d, data.slot);
      row("Next free slot", alt ? fmt(alt.date) + ", " + slotLabel(alt.slot) : "None in the next 14 days - please call us.");
    }
    if (afterHours) { row("Note", "Slots after 16:00 include a R500 after-hours surcharge."); }
    if (data.urgency === "today") { row("Urgent?", "For same-day help please also call 082 345 6789."); }
    $("<p>", { "class": "form__footnote" }).append($("<small>", { text: "This is an estimate, not a quote. The plumber confirms the price on site and nothing starts until you approve it. Parts are charged at cost plus 15%." })).appendTo($r);
    $r[0].scrollIntoView({ behavior: "smooth", block: "center" });
    $r.attr("tabindex", "-1").trigger("focus");
  }

  /* ============================ CONTACT ============================ */
  var TYPES = {
    quote: "Request a quotation", emergency: "Emergency call-out", maintenance: "Maintenance contract",
    invoice: "Invoice or account query", warranty: "Warranty claim", feedback: "Compliment or complaint"
  };

  function compileEmail($form, d) {
    var to = $form.data("recipient");
    var subject = "Website message: " + (TYPES[d.subject] || d.subject) + " - " + d.name;
    var body = [
      "Hello John's Plumbing Services,", "",
      d.message, "",
      "Type of message: " + (TYPES[d.subject] || d.subject),
      "Name: " + d.name,
      "Email: " + d.email,
      "Phone: " + (d.phone || "not given"),
      "Suburb: " + (d.suburb || "not given"), "",
      "Sent from the John's Plumbing Services website."
    ].join("\n");
    $("#email-to").text(to); $("#email-subject").text(subject); $("#email-body").text(body);
    $("#email-send").attr("href", "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body));
    $("#email-copy").off("click").on("click", function () {
      var t = "To: " + to + "\nSubject: " + subject + "\n\n" + body, $b = $(this);
      var done = function () { $b.text("Copied!"); setTimeout(function () { $b.text("Copy text"); }, 1500); };
      if (navigator.clipboard) { navigator.clipboard.writeText(t).then(done); }
    });
    JP.openModal($("#email-modal"));
  }

  /* ============================ INIT ============================ */
  $(function () {
    var $book = $("#booking-form"), $contact = $("#contact-form");

    if ($book.length) {
      var today = new Date(); $("#book-date").attr("min", iso(today));
      var pre = new URLSearchParams(location.search).get("service");
      if (pre && $("#book-service option[value='" + pre + "']").length) { $("#book-service").val(pre); }
      liveValidation($book);
      handle($book, bookingResult);
    }

    if ($contact.length) {
      liveValidation($contact);
      handle($contact, function (data) {
        showStatus($contact, "success", "Message checked and received. Your email is ready to send.");
        compileEmail($contact, data);
      });
    }
  });
})(jQuery);
