$(function() {
    var jetInstance;
    var unfetch;

    $('#fetch-custom-mode').change(function() {
        var checked = $(this).prop('checked');
        $('#fetch-config input').prop('disabled', checked);
        $('#fetch-custom').prop('disabled', !checked);
        $(this).prop('disabled', false);
    });
    var from = 1;
    var to = 10;

    var changeFetch = function() {
        var customMode = $('#fetch-custom-mode').prop('checked');
        var fetchParams;
        if (customMode) {
            var fetchParamsString = $('#fetch-custom').val();
            try {
                fetchParams = JSON.parse(fetchParamsString);
            } catch (e) {
                alert('Sorry, invalid JSON:' + e);
            }
        } else {
            fetchParams = {};
            fetchParams.match = [$('#fetch-path').val()];
            fetchParams.caseInsensitive = $('#fetch-path').prop('checked');
            fetchParams.sort = {
                from: from,
                to: to
            };
        }
        unfetch = jetInstance.fetch(fetchParams, function(n) {
            $('#s' + n.index + ' .path').text(n.path);
            $('#s' + n.index + ' .value').val(n.value);
        }, function(err) {
            if (err) {
                alert('fetching failed' + err);
            } else {
                var index;
                var i;
                for (i = from - 1; i < to; ++i) {
                    index = i + 1;
                    $('#content').append('<div id="s' + index + '">' + index + '<span class="path"></span><input type="text" class="value" editable></input></div>');
                }
            }
        });
    };

    $('#fetch-config').submit(function(event) {
        event.preventDefault();
        if (unfetch) {
            var i;
            var index;
            $('#content').empty();
            unfetch(changeFetch);
            return;
        }
        changeFetch();
    });

    $('form#jet-config').submit(function(event) {
        var jetWsUrl = $('form#jet-config input').val();
        if (jetInstance) {
            $('#status').text('Disconnecting');
            unfetch = null;
            jetInstance.close();
        }
        $('#status').text('Connecting');
        jetInstance = Jet.create(jetWsUrl, {
            onclose: function() {
                $('#status').text('Disconnected');
            },
            onopen: function() {
                $('#status').text('Connected');
            }
        });
        event.preventDefault();
    });

})
