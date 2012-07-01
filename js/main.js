require(
    ["views","controllers"],
    function(JetViewer) {
        // add ember views to DOM
        JetViewer.mainView.appendTo('body');       
    }
);
