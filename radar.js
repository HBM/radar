$(function () {
    var jetInstance;
    var unfetch;
    var range = 20;
    var fetchParams = {
        path: {
            caseInsensitive: true,
        },
        sort: {
            from: 1,
            to: range
        }
    };

    var isDefined = function (x) {
        return typeof x !== 'undefined' && x !== null;
    };

    var createDisplay = function (jetElement) {
        var n = jetElement;
        var id = '#s' + n.index;
        var label = $(id + ' .path');
        var value = $(id + ' .value');
        var from = fetchParams.sort.from;
        var to = fetchParams.sort.to;
        var isPretty = false;
        if (n.index > to) {
            $('#fetch-next').prop('disabled', false);
            return; // this fetch result is not displayed            
        }
        value.off('change');
        value.off('dblclick');
        label.text(n.path);
        value.val(JSON.stringify(n.value));
        value.prop('rows', 1);
        value.height('');

        if (isDefined(n.value)) {
            value.on('dblclick', function () {
                if (!isPretty) {
                    var pretty = JSON.stringify(n.value, null, 2);
                    var lines = pretty.split('\n').length
                    value.val(pretty);
                    value.prop('rows', lines);
                    value.height('auto');
                } else {
                    var notpretty = JSON.stringify(n.value);
                    value.val(notpretty);
                    value.prop('rows', 1);
                    value.height('');
                }
                isPretty = !isPretty;
            });
            value.on('change', function () {
                var val = value.val();
                try {
                    val = JSON.parse(val);
                } catch (e) {
                    value.val(JSON.stringify(n.value));
                    alert('Input is no JSON (' + e + ') in:\n' + val);
                    return;
                }
                value.prop('disabled', true);
                $('#status').addClass('loading');
                jetInstance.set(n.path, val, function (err, result) {
                    $('#status').removeClass('loading');
                    value.prop('disabled', false);
                    if (err) {
                        value.val(JSON.stringify(n.value));
                        alert('Set returned error: ' + JSON.stringify(err, null, 2));
                    }
                });
            });
        } else {
            value.val('[]');
            value.on('change', function () {
                var args;
                try {
                    args = JSON.parse(value.val());
                    if (!$.isArray(args)) {
                        throw (value.val() + "is no JSON Array");
                    }
                    $('#status').addClass('loading');
                    jetInstance.call(n.path, args, function (err, result) {
                        $('#status').removeClass('loading');
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
    };

    var last;

    var dispatchFetch = function (sorted) {
        var i;
        var from = fetchParams.sort.from;
        var to = fetchParams.sort.to;
        /* debugging changes start */
        last = sorted;
        for (i = 0; i < sorted.changes.length; ++i) {
            var id = '#s' + sorted.changes[i].index;
            var label = $(id + ' .path');
            var value = $(id + ' .value');
            if (label.text() === sorted.changes[i].path && JSON.parse(value.val()) === sorted.changes[i].val) {
                console.log('ERROR: NO CHANGES FOR', sorted.changes[i]);
            }
        }
        /* debugging changes end */
        for (i = from + sorted.n; i <= to; ++i) {
            var id = '#s' + i;
            var label = $(id + ' .path');
            var value = $(id + ' .value');
            label.text('');
            value.val('');
            value.off('change');
        }
        if (sorted.n + from > to) {
            $('#fetch-next').prop('disabled', false);
        } else {
            $('#fetch-next').prop('disabled', true);
        }
        for (var i in sorted.changes) {
            createDisplay(sorted.changes[i]);
        }
    };

    var setupFetch = function () {
        var index;
        var i;
        var row;
        var from = fetchParams.sort.from;
        var to = fetchParams.sort.to;
        var enabledInputs = $('input:enabled');
        $('#content').empty();
        $('#fetch-prev').prop('disabled', from === 1);
        $('#fetch-next').prop('disabled', true);
        for (i = from - 1; i < to; ++i) {
            index = i + 1;
            row = $('<tr></tr>');
            row.attr('id', 's' + index);
            row.addClass('row');
            row.append('<td class="index">' + index + '</td>');
            row.append('<td class="path"></td>');
            row.append('<td><textarea class="value"></textarea></td>');
            $('#content').append(row);
        }
        enabledInputs.prop('disabled', true);
        $('#status').addClass('loading');
        unfetch = jetInstance.fetch(fetchParams, dispatchFetch, function (err) {
            $('#status').removeClass('loading');
            enabledInputs.prop('disabled', false);
            if (err) {
                alert('fetching failed:' + JSON.stringify(err));
            }
        });
    };

    var changeFetch = function () {
        if (!isDefined(fetchParams.sort)) {
            fetchParams.sort = {};
        }
        if (!isDefined(fetchParams.sort.from)) {
            fetchParams.sort.from = 1;
        }
        if (!isDefined(fetchParams.sort.to)) {
            fetchParams.sort.to = 10;
        }
        var fetchParamsString = JSON.stringify(fetchParams);
        var height = fetchParamsString.split('\n').length * 1.2 + 'em';
        $('#fetch-custom').val(fetchParamsString);
        $('#fetch-custom').height(height);
        if (unfetch) {
            unfetch(setupFetch);
            return;
        } else {
            setupFetch();
        }
    };

    $('#fetch-case-insensitive').change(function () {
        fetchParams.path.caseInsensitive = $(this).prop('checked');
        changeFetch();
    });

    $('#jet-address').val(window.document.domain);

    $('#fetch-custom-mode').change(function () {
        $('#fetch-custom').toggle();
    });

    $('#fetch-custom').change(function () {
        try {
            fetchParams = JSON.parse($(this).val());
            changeFetch();
        } catch (e) {
            alert('Invalid JSON:' + e);
        }
    });

    $('#fetch-prev').click(function () {
        fetchParams.sort.from -= range;
        fetchParams.sort.to -= range;
        if (fetchParams.sort.from < 0) {
            $('#fetch-prev').prop('disabled', true);
            fetchParams.sort.from = 1;
            fetchParams.sort.to = range;
        }
        changeFetch();
    });

    $('#fetch-next').click(function () {
        fetchParams.sort.from += range;
        fetchParams.sort.to += range;
        changeFetch();
    });

    $('#fetch-sort-by').change(function () {
        var sortBy = $(this).val();
        var fieldName;
        if (sortBy === 'path') {
            fetchParams.sort.byPath = true;
            delete fetchParams.sort.byValue;
            delete fetchParams.sort.byValueField;
            $('#fetch-sort-fieldname').prop('disabled', true);
        } else if (sortBy === 'value') {
            fetchParams.sort.byValue = 'number';
            delete fetchParams.sort.byPath;
            delete fetchParams.sort.byValueField;
            $('#fetch-sort-fieldname').prop('disabled', true);
        } else if (sortBy === 'valuefield') {
            fetchParams.sort.byValueField = {};
            fieldName = $('#fetch-sort-fieldname').val();
            fetchParams.sort.byValueField[fieldName] = 'number';
            $('#fetch-sort-fieldname').prop('disabled', false);
            delete fetchParams.sort.byPath;
            delete fetchParams.sort.byValue;
        }
        changeFetch();
    });

    $('#fetch-sort-fieldname').change(function () {
        var fieldName = $('#fetch-sort-fieldname').val();
        fetchParams.sort.byValueField = {};
        fetchParams.sort.byValueField[fieldName] = 'number';
        changeFetch();
    });


    $('#fetch-sort-order').change(function () {
        var sortOrder = $(this).val();
        if (sortOrder === 'ascending') {
            fetchParams.sort.ascending = true;
            delete fetchParams.sort.descending;
        } else {
            fetchParams.sort.descending = true;
            delete fetchParams.sort.ascending;
        }
        changeFetch();
    });

    $('#fetch-path').change(function (event) {
        var search = $('#fetch-path').val();
        var path;
        var fetchOp = {
            '>': 'greaterThan',
            '<': 'lessThan',
            '=': 'equals',
            '!': 'equalsNot'
        };
        var where = search.match(/(.*)\s*where:(.*)/);
        if (where) {
            var whereDetails = where[2].match(/(.*)\s*([>|<|=|!])\s*(.+)/);
            if (whereDetails === null) {
                alert('Invalid where expression.');
                return;
            }
            var op = fetchOp[whereDetails[2]];
            if (op === undefined) {
                alert('Invalid where operation: ' + whereDetails[2] + '(Allowed: ">","<","=","!")');
            }
            var value;
            try {
                value = JSON.parse(whereDetails[3]);
            } catch (e) {
                alert('Invalid where expression value:' + e);
                return;
            }
            var prop = whereDetails[1] && whereDetails[1].trim() || null;
            path = where[1];
            if (prop) {
                fetchParams.valueField = {};
                fetchParams.valueField[prop] = {};
                fetchParams.valueField[prop][op] = value;
            } else {
                fetchParams.value = {};
                fetchParams.value[op] = value;
            }
        } else {
            delete fetchParams.value;
            delete fetchParams.valueField;
            path = search;
        }
        fetchParams.path.containsAllOf = path.split(/ +/g);
        event.preventDefault();
        changeFetch();
    });

    var connectJet = function () {
        var once = true;
        var address = $('#jet-address').val();
        var port = $('#jet-port').val();
        var jetWsUrl = 'ws://' + address + ':' + port;
        if (jetInstance) {
            $('#status').removeClass().addClass('disconnecting');
            unfetch = null;
            jetInstance.close();
        }
        $('#status').removeClass().addClass('connecting');
        jetInstance = Jet.create(jetWsUrl, {
            onclose: function () {
                $('#status').removeClass().addClass('disconnected');
                $('#content').removeClass().addClass('inactive');
                $('#content .value').prop('disabled', true);
                if ($('#jet-reconnect').prop('checked') && once) {
                    once = false;
                    setTimeout(function () {
                        connectJet();
                    }, 1000);
                }
            },
            onopen: function () {
                $('#status').removeClass().addClass('connected');
                $('#content').removeClass().addClass('active');
                $('#content .value').prop('disabled', false);
                if (window.msgpack) {
                    jetInstance.setEncoding('msgpack', function (err, result) {
                        changeFetch();
                    });
                } else {
                    changeFetch();
                }
            }
        });
    };

    $('#jet-config').submit(function (event) {
        connectJet();
        event.preventDefault();
    });

    $('#jet-config').trigger('submit');
    $('#jet-config').hide();
    $('#status').click(function () {
        $('#jet-config').toggle();
    });

})
