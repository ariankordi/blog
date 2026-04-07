// // -----------------------
// // Initialization
// // -----------------------

(function () {

  // Initial application.
  const loadHandler = () => {
    mediumZoom('.post img');
  };
  // document.addEventListener('DOMContentLoaded', loadHandler);
  document.addEventListener('turbo:load', loadHandler);

})();
