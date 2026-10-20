/* ==========================================================================
   UPCT Racing Team — Quiénes somos
   Genera los enlaces a cada departamento a partir de data/team.js.
   ========================================================================== */
(function () {
  'use strict';

  var UPCT = window.UPCT || {};
  var team = UPCT.team;
  var chips = document.getElementById('dept-chips');
  if (!team || !chips) { return; }

  chips.innerHTML = team.departamentos.map(function (dept) {
    return '<li><a class="chip" href="equipo.html#' + UPCT.esc(dept.ancla) + '">' + UPCT.esc(dept.nombre) + '</a></li>';
  }).join('');
})();
