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

    $('#fetch-prev').click(function() {
        from = from - 10;
        to = to - 10;
        if (from < 0) {
            from = 1;
            to = 10;
        }
    });

    $('#fetch-next').click(function() {
        from = from + 10;
        to = to + 10;
    });

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
            if (n.event !== 'remove') {
                $('#s' + n.index + ' .path').text(n.path);
                $('#s' + n.index + ' .value').val(JSON.stringify(n.value));
                if (typeof n.value !== 'undefined' && n.value !== null) {
                    $('#s' + n.index + ' button').text('set');
                    $('#s' + n.index + ' button').click(function() {
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
                    $('#s' + n.index + ' .value').val('[]');
                    $('#s' + n.index + ' button').text('call');
                    $('#s' + n.index + ' button').off('click');
                    $('#s' + n.index + ' button').click(function() {
                        var val = $('#s' + n.index + ' .value').val();
                        var args;
                        try {
                            args = JSON.parse(val);
                            if (!$.isArray(args)) {
                                throw (val + "is no JSON Array");
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
            } else {
                $('#s' + n.index + ' .path').text('');
                $('#s' + n.index + ' .value').val('');
            }
        }, function(err) {
            if (err) {
                alert('fetching failed' + err);
            } else {
                var index;
                var i;
                for (i = from - 1; i < to; ++i) {
                    index = i + 1;
                    $('#content').append('<div id="s' + index + '">' + index + '<span class="path"></span><input type="text" class="value" editable></input><button></button></div>');
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
