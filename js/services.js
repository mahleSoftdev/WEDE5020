/* services.js - loads the service list from data.js and lets the visitor
   search, filter and sort it. Runs on services.html only. */
(function ($) {
  "use strict";
  $(function () {
    var $out = $("#service-results");
    if (!$out.length) { return; }

    var $q = $("#service-search"), $cat = $("#service-category"), $sort = $("#service-sort");
    var rand = function (n) { return "R" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); };

    $.each(JP.categories, function (key, label) {
      $("<option>", { value: key, text: label }).appendTo($cat);
    });

    function render() {
      var term = $.trim($q.val()).toLowerCase(), cat = $cat.val(), sort = $sort.val();
      var list = $.grep(JP.services, function (s) {
        var hay = (s.name + " " + s.text + " " + JP.categories[s.category]).toLowerCase();
        return (!cat || s.category === cat) && (!term || hay.indexOf(term) !== -1);
      });
      list.sort(function (a, b) {
        if (sort === "price-asc") { return a.price - b.price; }
        if (sort === "price-desc") { return b.price - a.price; }
        return a.name.localeCompare(b.name);
      });

      $out.empty();
      $.each(list, function (_, s) {
        var $c = $('<article class="card">');
        $("<h3>", { "class": "card__title", text: s.name }).appendTo($c);
        $("<p>", { text: s.text }).appendTo($c);
        $("<p>", { "class": "card__meta" }).append("From <strong>" + rand(s.price) + "</strong> &middot; ")
          .append(document.createTextNode(s.duration)).appendTo($c);
        $("<a>", { "class": "card__link", href: "booking.html?service=" + encodeURIComponent(s.id), text: "Book this service" }).appendTo($c);
        $out.append($c);
      });
      $("#service-count").text(list.length + (list.length === 1 ? " service" : " services") + " shown");
      $("#service-empty").prop("hidden", list.length > 0);
    }

    $q.on("input", render);
    $cat.add($sort).on("change", render);
    $("#service-reset").on("click", function () { $q.val(""); $cat.val(""); $sort.val("name"); render(); });
    render();
  });
})(jQuery);
