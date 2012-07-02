require(
    ["views","controllers"],
    function(JetViewer) {
        // add ember views to DOM
        JetViewer.mainView = JetViewer.MainView.create();
        JetViewer.mainView.appendTo('body');       
    }
);
