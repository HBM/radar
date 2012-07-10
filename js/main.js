require(
    ["views","controllers"],
    function(Radar) {
        // add ember views to DOM
        Radar.mainView = Radar.MainView.create();
        Radar.mainView.appendTo('body');       
    }
);
