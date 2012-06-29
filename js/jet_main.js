require(
    ["jquery","jet_controller"],
    function($,jet_controller) {
        $('#select_tab a').click(function(e) {
            e.preventDefault();
            $(this).tab('show');
        });
        $('#select_tab a:first').tab('show');
        jet_controller.init();
    }
);

