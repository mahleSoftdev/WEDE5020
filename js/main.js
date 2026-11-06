/* main.js - interactive elements used on every page (jQuery).
   Accordion, tabs, modal, scroll animations, back-to-top, open-now badge,
   share links. */
(function ($) {
  "use strict";

  var $html = $("html").addClass("js");

  /* ---------- Modal (shared with the contact and booking pages) ---------- */
  var lastFocus = null;

  function openModal($modal) {
    lastFocus = document.activeElement;
    $modal.prop("hidden", false).addClass("is-open");
    $("body").addClass("modal-open");
    $modal.find(".modal__close").first().trigger("focus");
  }

  function closeModal($modal) {
    $modal.removeClass("is-open").prop("hidden", true);
    $("body").removeClass("modal-open");
    if (lastFocus) { $(lastFocus).trigger("focus"); }
  }

  window.JP = window.JP || {};
  JP.openModal = openModal;
  JP.closeModal = closeModal;

  $(document).on("click", "[data-modal-open]", function (e) {
    e.preventDefault();
    openModal($("#" + $(this).data("modal-open")));
  });

  $(document).on("click", "[data-modal-close]", function () {
    closeModal($(this).closest(".modal"));
  });

  $(document).on("click", ".modal", function (e) {
    if (e.target === this) { closeModal($(this)); }   // click on the backdrop
  });

  $(document).on("keydown", function (e) {
    var $open = $(".modal.is-open");
    if (!$open.length) { return; }
    if (e.key === "Escape") { closeModal($open); }
    if (e.key === "Tab") {                              // keep focus inside
      var $f = $open.find("a[href], button:not([disabled]), input, textarea").filter(":visible");
      if (!$f.length) { return; }
      var first = $f[0], last = $f[$f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  $(function () {

    /* ---------- Accordion: animated, one panel open at a time ---------- */
    $("details.disclosure").each(function () {
      var $d = $(this);
      if ($d.attr("open") === undefined) { $d.children(":not(summary)").hide(); }
      else { $d.children("summary").attr("aria-expanded", "true"); }
      $d.children("summary").attr("aria-expanded", $d.prop("open") ? "true" : "false");
    });

    $(document).on("click", "details.disclosure > summary", function (e) {
      e.preventDefault();
      var $d = $(this).parent(), $panel = $d.children(":not(summary)");
      if ($d.prop("open")) {
        $panel.stop(true, true).slideUp(200, function () { $d.prop("open", false); });
        $(this).attr("aria-expanded", "false");
      } else {
        $d.siblings("details.disclosure[open]").children("summary").trigger("click");
        $d.prop("open", true);
        $panel.stop(true, true).hide().slideDown(200);
        $(this).attr("aria-expanded", "true");
      }
    });

    /* ---------- Tabs ---------- */
    $(".tabs").each(function () {
      var $tabs = $(this).find('[role="tab"]');
      function select($tab) {
        $tabs.attr({ "aria-selected": "false", tabindex: "-1" }).removeClass("is-active");
        $tab.attr({ "aria-selected": "true", tabindex: "0" }).addClass("is-active");
        $(this).find('[role="tabpanel"]').prop("hidden", true);
        $("#" + $tab.attr("aria-controls")).prop("hidden", false).hide().fadeIn(200);
      }
      var $wrap = $(this);
      $tabs.on("click", function () { select.call($wrap, $(this)); });
      $tabs.on("keydown", function (e) {
        var i = $tabs.index(this), n = $tabs.length, t = null;
        if (e.key === "ArrowRight") { t = $tabs.eq((i + 1) % n); }
        if (e.key === "ArrowLeft") { t = $tabs.eq((i - 1 + n) % n); }
        if (t) { e.preventDefault(); t.trigger("focus").trigger("click"); }
      });
    });

    /* ---------- Scroll-in animation ---------- */
    var $items = $(".card, .service, .quote, .steps__item, .gallery__item, .contact-card");
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      $items.addClass("reveal");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { $(en.target).addClass("is-visible"); io.unobserve(en.target); }
        });
      }, { threshold: 0.1 });
      $items.each(function () { io.observe(this); });
    }

    /* ---------- Back-to-top button (created with the DOM) ---------- */
    var $top = $('<button type="button" class="to-top" aria-label="Back to top">&uarr;</button>').appendTo("body");
    $(window).on("scroll", function () { $top.toggleClass("is-visible", $(window).scrollTop() > 600); });
    $top.on("click", function () { $("html, body").animate({ scrollTop: 0 }, 300); });

    /* ---------- "Open now" badge in the footer, South African time ---------- */
    var za = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Johannesburg" }));
    var d = za.getDay(), mins = za.getHours() * 60 + za.getMinutes();
    var open = (d >= 1 && d <= 5 && mins >= 420 && mins < 1020) || (d === 6 && mins >= 480 && mins < 780);
    $("<p>", { "class": "status-badge" + (open ? " is-open" : ""), role: "status" })
      .text(open ? "Office open now" : "Office closed - emergency line open 24 hours")
      .insertAfter($(".site-footer .hours").first());


    /* ---------- Load more reviews (home page, builds DOM from data.js) ---------- */
    $("#more-reviews").on("click", function () {
      var $btn = $(this), $list = $("#review-list");
      $.each(JP.reviews, function (_, r) {
        var $f = $('<figure class="quote reveal is-visible">');
        $('<blockquote class="quote__body">').append($("<p>").text(r.text)).appendTo($f);
        var $c = $('<figcaption class="quote__source">').appendTo($f);
        $("<cite>").text(r.name).appendTo($c);
        $c.append(document.createTextNode(", " + r.place + " \u2014 "));
        $("<time>", { datetime: r.date, text: r.label }).appendTo($c);
        $list.append($f.hide().fadeIn(300));
      });
      $btn.prop("hidden", true);
    });

    /* ---------- Share links (off-page SEO: social promotion) ---------- */
    var url = encodeURIComponent(location.href.split("#")[0]), title = encodeURIComponent(document.title);
    var links = [
      ["Facebook", "https://www.facebook.com/sharer/sharer.php?u=" + url],
      ["X", "https://twitter.com/intent/tweet?url=" + url + "&text=" + title],
      ["WhatsApp", "https://wa.me/?text=" + title + "%20" + url],
      ["LinkedIn", "https://www.linkedin.com/sharing/share-offsite/?url=" + url]
    ];
    var $share = $('<p class="share">Share this page: </p>');
    $.each(links, function (_, l) {
      $("<a>", { href: l[1], target: "_blank", rel: "noopener noreferrer", text: l[0] }).appendTo($share).after(" ");
    });
    $(".site-footer__legal").prepend($share);
  });
})(jQuery);
