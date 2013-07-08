$(function() {
    var jetInstance;
    var unfetch;
    var range = 10;
    var from = 1;
    var to = range;

    var dispatchFetch = function(n) {
        var id = '#s' + n.index;
        var label = $(id + ' .path');
        var value = $(id + ' .value');
        var button = $(id + ' button');
        if (n.event !== 'remove') {
            if (n.index > to) {
                $('#fetch-next').prop('disabled', false);
                return; // this fetch result is not displayed            
            }
            label.text(n.path);
            value.val(JSON.stringify(n.value));
            if (typeof n.value !== 'undefined' && n.value !== null) {
                button.text('set');
                button.off('click');
                button.on('click', function() {
                    var val = $('#s' + n.index + ' .value').val();
                    try {
                        val = JSON.parse(val);
                        jetInstance.set(n.path, val, function(err, result) {
                            if (err) {
                                alert('Set returned error: ' + JSON.stringify(err, null, 2));
                            }
                        });
                    } catch (e) {
                        alert('Set failed: ' + e);
                    }
                });
            } else {
                value.val('[]');
                button.text('call');
                button.off('click');
                button.on('click', function() {
                    var args;
                    try {
                        args = JSON.parse(value.val());
                        if (!$.isArray(args)) {
                            throw (value.val() + "is no JSON Array");
                        }
                        jetInstance.call(n.path, args, function(err, result) {
                            if (err) {
                                alert('Call failed: ' + JSON.stringify(err, null, 2));
                            } else {
                                alert('Call returned: ' + JSON.stringify(result, null, 2));
                            }
                        });
                    } catch (e) {
                        alert('Invalid input: ' + e);
                    }
                });
            }
            $(id).show();
        } else {
            $(id).hide();
            if (n.index > to) {
                $('#fetch-next').prop('disabled', true);
                return; // this fetch result is not displayed            
            }
            label.text('');
            value.val('');
        }
    };

    var setupFetch = function(resetFromAndTo) {
        var index;
        var i;
        var customMode = $('#fetch-custom-mode').prop('checked');
        var fetchParams;
        var row;
        $('#content').empty();
        if (from == 1) {
            $('#fetch-prev').prop('disabled', true);
        } else {
            $('#fetch-prev').prop('disabled', false);
        }
        $('#fetch-next').prop('disabled', true);
        for (i = from - 1; i < to; ++i) {
            index = i + 1;
            row = $('<div></div>');
            row.hide();
            row.attr('id', 's' + index);
            row.append('<div class="index">' + index + '</div>');
            row.append('<div class="path"></div>');
            row.append('<input class="value"></input>');
            row.append('<button></button>');
            $('#content').append(row);
        }
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
                to: (to + 1) // increase to by 1 to enable "next"
                // button when notification with index == to + 1 arrives
            };
        }
        unfetch = jetInstance.fetch(fetchParams, dispatchFetch, function(err) {
            if (err) {
                alert('fetching failed' + err);
            }
        });
    };

    var changeFetch = function() {
        if (unfetch) {
            unfetch(setupFetch);
            return;
        } else {
            setupFetch();
        }
    };

    $('#fetch-custom-mode').change(function() {
        var checked = $(this).prop('checked');
        $('#fetch-config input').prop('disabled', checked);
        $('#fetch-custom').prop('disabled', !checked);
        $(this).prop('disabled', false);
    });

    $('#fetch-prev').click(function() {
        from = from - range;
        to = to - range;
        if (from < 0) {
            $('#fetch-prev').prop('disabled', true);
            from = 1;
            to = range;
        }
        changeFetch();
    });

    $('#fetch-next').click(function() {
        from = from + range;
        to = to + range;
        $('#fetch-prev').prop('disabled', false);
        changeFetch();
    });

    $('#fetch-range').change(function() {
        range = parseInt($(this).val());
        to = from + range - 1;
    });


    $('#fetch-config').submit(function(event) {
        event.preventDefault();
        changeFetch();
    });

    $('form#jet-config').submit(function(event) {
        var address = $('#jet-address').val();
        var port = $('#jet-port').val();
        var jetWsUrl = 'ws://' + address + ':' + port;
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
