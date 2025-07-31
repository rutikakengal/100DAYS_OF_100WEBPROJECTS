$(document).ready(function() {
    const body = $("body"),
          universe = $("#universe"),
          solarsys = $("#solar-system");

    // Initialize 3D View
    const init = () => {
        body.removeClass("view-2D opening")
            .addClass("view-3D");

        setTimeout(() => {
            body.removeClass("hide-UI").addClass("set-speed");
        }, 2000);
    };

    // Function to change solar system view
    const setView = (view) => universe.attr("class", view);

    // Toggle Data & Controls Panel
    $("#toggle-data").on("click", (e) => {
        body.toggleClass("data-open data-close");
        e.preventDefault();
    });

    $("#toggle-controls").on("click", (e) => {
        body.toggleClass("controls-open controls-close");
        e.preventDefault();
    });

    // Change Active Planet
    $("#data").on("click", "a", function(e) {
        const planetClass = $(this).attr("class");
        solarsys.attr("class", planetClass);
        $("#data a").removeClass("active");
        $(this).addClass("active");
        e.preventDefault();
    });

    // Toggle Views
    $(".set-view").on("click", () => body.toggleClass("view-3D view-2D"));
    $(".set-zoom").on("click", () => body.toggleClass("zoom-large zoom-close"));
    
    // Change Scale
    $(".set-speed").on("click", () => setView("scale-stretched set-speed"));
    $(".set-size").on("click", () => setView("scale-s set-size"));
    $(".set-distance").on("click", () => setView("scale-d set-distance"));

    // Initialize the setup
    init();
});