/* gallery.js - filter/search the gallery, and open photos in a lightbox. */
(function ($) {
  "use strict";
  $(function () {
    var $items = $(".gallery__item");
    if (!$items.length) { return; }

    /* ----- Filter by category and search text ----- */
    var cat = "all";
    function apply() {
      var term = $.trim($("#gallery-search").val()).toLowerCase(), shown = 0;
      $items.each(function () {
        var $i = $(this);
        var ok = (cat === "all" || $i.data("category") === cat) &&
                 (!term || $i.text().toLowerCase().indexOf(term) !== -1);
        $i.toggle(ok);
        if (ok) { shown++; }
      });
      $("#gallery-count").text(shown + (shown === 1 ? " photo" : " photos") + " shown");
      $("#gallery-empty").prop("hidden", shown > 0);
    }
    $(".filter-btn").on("click", function () {
      cat = $(this).data("filter");
      $(".filter-btn").removeClass("is-active").attr("aria-pressed", "false");
      $(this).addClass("is-active").attr("aria-pressed", "true");
      apply();
    });
    $("#gallery-search").on("input", apply);

    /* ----- Lightbox ----- */
    $items.find("img").each(function () {
      var $img = $(this), set = ($img.attr("srcset") || "").split(","), big = $img.attr("src");
      if (set.length) { big = $.trim(set[set.length - 1]).split(" ")[0]; }
      $img.wrap($("<button>", { type: "button", "class": "gallery__zoom", "aria-label": "Enlarge photo: " + $img.attr("alt") }).data("big", big));
    });

    var $lb = $(
      '<div class="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" hidden>' +
        '<button type="button" class="lightbox__close" aria-label="Close">&times;</button>' +
        '<button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Previous photo">&#8249;</button>' +
        '<figure class="lightbox__figure"><img class="lightbox__img" alt=""><figcaption class="lightbox__caption"></figcaption></figure>' +
        '<button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Next photo">&#8250;</button>' +
      '</div>').appendTo("body");
    var idx = 0, last = null;

    function visible() { return $items.filter(":visible"); }
    function show(i) {
      var $v = visible(); if (!$v.length) { return; }
      idx = (i + $v.length) % $v.length;
      var $it = $v.eq(idx);
      $lb.find(".lightbox__img").attr({ src: $it.find(".gallery__zoom").data("big"), alt: $it.find("img").attr("alt") });
      $lb.find(".lightbox__caption").text($it.find(".gallery__title").text() + " - " + $it.find(".gallery__meta").text());
    }
    function close() { $lb.prop("hidden", true); $("body").removeClass("modal-open"); if (last) { $(last).trigger("focus"); } }

    $(document).on("click", ".gallery__zoom", function () {
      last = this;
      show(visible().index($(this).closest(".gallery__item")));
      $lb.prop("hidden", false); $("body").addClass("modal-open");
      $lb.find(".lightbox__close").trigger("focus");
    });
    $lb.on("click", ".lightbox__close", close)
       .on("click", ".lightbox__nav--prev", function () { show(idx - 1); })
       .on("click", ".lightbox__nav--next", function () { show(idx + 1); })
       .on("click", function (e) { if (e.target === this) { close(); } });
    $(document).on("keydown", function (e) {
      if ($lb.prop("hidden")) { return; }
      if (e.key === "Escape") { close(); }
      if (e.key === "ArrowLeft") { show(idx - 1); }
      if (e.key === "ArrowRight") { show(idx + 1); }
    });
    apply();
  });
})(jQuery);
