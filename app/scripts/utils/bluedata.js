/* Copyright (C) 2013 BlueData Software, All Rights Reserved. */

$('.slim-scroll').each(function () {
    var $this = $(this);
    $this.slimScroll({
        height: $this.data('height') || 100,
        railVisible:true
    });
});

$(document).ready(function () {
    $(document).on('click', '.bds-modal-form', function(ev) {
        ev.preventDefault();
        $('.dropdown.open .dropdown-toggle').dropdown('toggle');
        bdStartSpin();
        var url = $(this).attr('href');

        $('#formModal').removeClass('large');

        $('#formModal').load(url, function() {
            bdStopSpin();
            if ($('.bds-modal-form').hasClass('large')) {
                $('#formModal').addClass('large');
            }

            $('#formModal').modal({ backdrop: 'static', keyboard: true });
        });
        return false;
    });

    $('#formModal').on('hidden', function () {
        // Do i need to do anything???
    });

    $('#form-submit').on('click', function(e){
        e.preventDefault();
        if (!$('#form-submit').is(':disabled')) {
            if ($('.bds-form').valid()) {
                $('.bds-form').submit();
            }
        }
        return false;
    });

    $('.bds-form').on('keypress', function(e) {
        if (e.keyCode == 13 && e.target.type != "textarea" && !$(e.target).hasClass('ignore-button')) {
            e.preventDefault();
            if (!$('#form-submit').is(':disabled')) {
                if ($('.bds-form').valid()) {
                    $('.bds-form').submit();
                }
            }
        }
    });

    var tmp = $.fn.popover.Constructor.prototype.show;
    $.fn.popover.Constructor.prototype.show = function () {
        tmp.call(this);
        if (this.options.callback) {
            this.options.callback();
        }
    }

     //listening on click of expand/collapse sidebar
    $(document).on('click', '#sidebar-collapse', function(){
        if('localStorage' in window && window['localStorage'] != null) {
            try {
                var userInfo = $('.user-info .user-tenant').attr('data-tenantId') + '|' + $('.user-info .user-tenant').attr('data-role');
                if(!localStorage.getItem(userInfo)) //for first time, when clicked it is collapsed state
                    localStorage.setItem(userInfo, 'collapsed'); 
                else {
                    if(localStorage.getItem(userInfo) == 'collapsed') //update state to expanded if previously collapsed 
                        localStorage.setItem(userInfo, 'expanded');
                    else //update state to collapsed if previously expanded 
                        localStorage.setItem(userInfo, 'collapsed');
                }
            } 
            catch(err) {}
        }  
    });  

    //set the sidebar expand/collapse icon based on previous state
    if('localStorage' in window && window['localStorage'] != null) {
        try {
            var userInfo = $('.user-info .user-tenant').attr('data-tenantId') + '|' + $('.user-info .user-tenant').attr('data-role');
            if(localStorage.getItem(userInfo) && localStorage.getItem(userInfo) == 'collapsed') {
                $('#sidebar-collapse i').trigger('click');
                localStorage.setItem(userInfo, 'collapsed');
            }
        } 
        catch(err) {}
    }

    //initializing the bootstrap default tooltip
    $('[data-rel=tooltip]').tooltip();
    
    //populating tooltip messages from a object when bds form exist
    if($('.bds-form').length > 0 || $('.bds-form-1').length > 0) {
        var tooltipMessage;
        $('i.icon-question-sign').each(function(index, item){
            if ($(item).attr('tooltip-content')) {
                tooltipMessage = $(item).attr('tooltip-content');
            }
            else {
                tooltipMessage = tooltipMessageJson[$(item).attr('id')];
            }
            $(item).attr('data-original-title', tooltipMessage);
        });
    }

    //initialize the form with focus set to first element
    if($('.bds-form').length > 0) {
        $('form:first *:input[type!=hidden]:first').focus();
    }
    else if($('.bds-form-1').length > 0) {
        window.setTimeout(function() {
            $('.tab-pane.active form *:input[type!=hidden]:first').focus();    
        }, 700);
    }

});

function dcoPopoverCallback() {
    $('.popover-content').slimScroll({
        height: '310px'
    });
}

function bdsGetStats(url, statsHandler)
{
    setTimeout(function () {
    });
}

function getErrorMessage(status_code, reason)
{
    var msg = 'Got an error while performing the operation';

    switch (status_code) {
        case 401:
            msg = 'Unauthorized access. Check your credentials and try again.';
            break;

        case 403:
            msg = 'Fobidden request.';
            break;

        case 404:
            msg = 'Requested resource is not found.';
            break;

        case 405:
            msg = 'Requested resource is not allowed.';
            break;

        case  408:
            msg = 'You will be redirected to login screen.';
            break;

        case 409:
            msg = 'The request could not be completed due to a conflict.';
            break;

    }

    /* Reason (if present) will contain two tokens separate by ':', we will show
     * what contains after ":" */
    if (reason.indexOf(':') > -1) {
        msg += '</br></br>Additional Details ' + reason.substr(reason.indexOf(':'), reason.length);
    }

    return msg;
}

function bdsFormSubmit(form, msg, url)
{
    var modal_form = $(form).hasClass('bds-modal-form');
    if (!modal_form) {
        bdStartSpin();
    }
    var formdata = new FormData(form);
    $.ajax({
        url: $(form).attr('action'),
        type: 'post',
        data: formdata,
        mimeType:"multipart/form-data",
        dataType: "json",
        contentType: false,
        processData: false,

        cache: false,
        csrfmiddlewaretoken: csrftoken,
        headers: {'X-CSRFToken' : csrftoken},
        success:
            function(result) {
                // result can be an array or just a tuple. we need to
                // check for that..
                if (!modal_form) {
                    bdStopSpin();
                }

                if (Array.isArray(result)) {
                    // In this case we have to show a message to the
                    // user that will contain all the error messages.
                    // Currently only support for non-modal forms.
                    // Currently only worker add/gensettings is using this.
                    var validationMsg = '<p>One or more operations failed.</p><table>';
                    for (var i in result) {
                        var validationError = false;
                        if ((result[i].status_code < 200) || (result[i].status_code > 207)) {
                            validationMsg += '<tr>';

                            validationMsg += '<td>' + getErrorMessage(result[i].status_code, result[i].reason) + '</td>';

                            validationMsg += '</tr>';
                            validationError = true;
                        }
                        
                    }
                    validationMsg += '</table>';

                    if (validationError) {
                        bootbox.alert(validationMsg, function(res) {
                            setTimeout(function() { document.location.href = url }, 500);
                        });
                    }
                    else {
                        // Got success
                        setTimeout(function() { document.location.href = url }, 500);
                    }
                }
                else {
                    if (result.status_code >= 200 && result.status_code < 207) {
                        if (modal_form) {
                            $('.form-process-bar').removeClass('active');
                            $('.form-success-bar span').html("Operation completed successfully").parent().addClass('active');
                            setTimeout(function() { document.location.href = url }, 750);
                        }
                        else {
                            // Got success
                            setTimeout(function() { document.location.href = url }, 500);
                        }
                    }
                    else {
                        // Operation has failed..
                        var error_msg = getErrorMessage(result.status_code, result.reason);
                        if (modal_form) {
                            $('.form-process-bar').removeClass('active');
                            $('.form-error-bar span').html(error_msg).parent().addClass('active');
                            if (result.status_code == 408) {
                                setTimeout(function() { document.location.href = result.redirect }, 1000);
                            }
                        }
                        else {
                            bootbox.alert(error_msg, function(res) {
                                if (result.status_code == 408) {
                                    window.location.href = result.redirect;
                                }
                                return;
                            });
                        }
                    }
                }
            },
        error:
            function(response) {
                if (modal_form) {
                    $('.form-process-bar').removeClass('active');
                    $('.form-error-bar span').html("Got an exception while performing the operation").parent().addClass('active');
                }
                else {
                    bdStopSpin();
                    bootbox.alert("Got an exception while performing the operation", function(res) {
                        return;
                    });
                }
            }
    })
}

var spinner;
var bdTimers = [];
var csrftoken = $.cookie('csrftoken');
var gauges = [];

// Each page can have upto 10 tables.
var oTable = new Array(10);
var oSpinner = {};
var numTables = 0;

function bdSetDataTable(headers, cols)
{
    var aCols = [];

    /* Prepare sortable array, first and last shouldn't be sortable. */
    for (var i = 0; i < cols; i++) {
        switch (headers[i].attrs) {
            case  "checkbox":
                aCols.push({bSortable: false});
                break;
            case  "expand":
                aCols.push({bSortable: false});
                break;
            case  "hidden":
                aCols.push({bSortable: true});
                break;
            case  "status":
                aCols.push({bSortable: true, 'sWidth' : '15%'});
                break;
            case  "actions":
                aCols.push({bSortable: false, 'sWidth' : '10%'});
                break;
            case "startTime":
                aCols.push({bSortable: true, 'sType': 'date'});
                break;
            case "completionTime":
                aCols.push({bSortable: true, 'sType': 'date'});
                break;
            default:
                aCols.push({bSortable: true});
                break;
        }
    }

    return(aCols);
}

function uploadCallback(name, status, details) {
    if (status == "success") {
        bdNotify('SOS Report ( ' + name + ' )' + ' successfully uploaded', "success");
    }
    else {
        bdNotify('Failed to upload the SOS report ( ' + name + ' )</br>' + details, "failed");
    }
}

function installCallback(name, status, details) {
    if (status == "success") {
        bdNotify('Downloading started for ( ' + name + ' )' + ' image', "success");
    }
    else {
        bdNotify('Failed to start download for ( ' + name + ' )' + ' image', "failed");
    }
}

function insertPasswordButton(url)
{
    var button = '<a class="grey bds-modal-form" href="'+url+'" data-rel="tooltip" title="Reset Password" data-placement="bottom">' +
                 '<i class="icon-key bigger-120"></i>' +
                 '</a>';

    return button;
}

function insertChartsButton()
{
    var button = '<a class="grey row_charts" data-rel="tooltip" title="Charts" data-placement="bottom">' +
                 '<i class="icon-bar-chart bigger-120"></i>' +
                 '</a>';

    return button;
}


function insertExtrasButton()
{
    var button = '<a class="green row_extras" data-rel="tooltip" title="Details" data-placement="bottom">' +
                 '<i class="icon-info bigger-120"></i>' +
                 '</a>';

    return button;
}

function insertDeleteButton()
{
    var button = '<a class="red row_delete" data-rel="tooltip" title="Delete" data-placement="bottom">' +
                 '<i class="icon-trash bigger-120"></i>' +
                 '</a>';
    return button;
               
}

function insertCopyButton()
{
    var button = '<a class="grey row_clone" data-rel="tooltip" title="Clone" data-placement="bottom">' +
                 '<i class="icon-copy bigger-120"></i>' +
                 '</a>';
    return button;

}


function insertEditButton(tableType, edit_url)
{
    var button;

    if(tableType == 'flavors') {
        button = '<a class="blue bds-modal-form" data-rel="tooltip" title="Edit" data-placement="bottom" href="'+edit_url+'">' +
                   '<i class="icon-pencil bigger-120"></i>' +
                   '</a>';
    }
    else {
        button = '<a class="blue row_edit" data-rel="tooltip" title="Edit" data-placement="bottom">' +
                  '<i class="icon-pencil bigger-120"></i>' +
                  '</a>';
    }

    return button;
}

function insertUploadButton()
{
    var button = '<a class="green row_upload" data-rel="tooltip" title="Upload" data-placement="bottom">' +
                 '<i class="icon-upload bigger-120"></i>' +
                 '</a>';

    return button;
}

function insertInstallButton()
{
    var button = '<a class="blue row_install" data-rel="tooltip" title="Install">' +
                 '<i class="icon-download bigger-120"></i>' +
                 '</a>';

    return button;
}

function insertCancelButton()
{
    var button = '<a class="red row_cancel" data-rel="tooltip" title="Cancel">&#10006;</a>';
    return button;
}



function dir_base_name(fullpath) {
    return fullpath.replace(/^.*[\/\\]/g, '');
}

function insertLogButton(type, url)
{
    var button = '<a data-rel="tooltip"';
    var location = 'window.open(' + '\'' + url + '\'';
    if (type == 'keypair' || type == 'sos-download') {
        location += ',\'_self\');';
    }
    else {
        location += ',\'_blank\');';
    }
    switch (type) {
        case    'log':
            button += 'title="Setup Log" class="grey" onclick="' + location + '"';
            break;
        case    'output':
            button += 'title="Job Output" class="orange" onclick="' + location + '"';
            break;
        case    'history':
            button += 'title="Job History" class="purple" onclick="' + location + '"';
            break;
        case    'keypair':
            button += 'title="Tenant KeyPair" class="grey" onclick="' + location + '"';
            break;
        case    'sos-download':
            button += 'title="Download" class="grey" onclick="' + location + '"';
            break;
    }

    button += ' data-placement="bottom"><i class="icon-download bigger-120"></i></a>';

    return button;
}

function tooltip_placement(context, source) {
    var $source = $(source);
    var $parent = $source.closest('table')
                  var off1 = $parent.offset();
    var w1 = $parent.width();

    var off2 = $source.offset();
    var w2 = $source.width();

//    if( parseInt(off2.left) < parseInt(off1.left) + parseInt(w1 / 2) ) return 'bottom';
    return 'bottom';
}


function registerDataTable(table_id, edit_url, extras_url, manage_url, deleteCallback, delete_id, headers, cols, idCol, nameCol) {
    oTable[numTables] =  $(table_id).dataTable( {
        "aoColumns": bdSetDataTable(headers, cols),
        "aLengthMenu": [[5, 10, 50, -1], [5, 10, 50, "All"]],
        "bAutoWidth": false,
        "iDisplayLength" : 10,
        "bPaginate" : true,
    });

    $('table th input:checkbox').on('click' , function() {
        var that = this;
        $(this).closest('table').find('tr > td:first-child input:checkbox')
                .each(function(){
            if ($(this).attr("disabled")) {
                this.checked = false;
            }
            else {
                this.checked = that.checked;
                $(this).closest('tr').toggleClass('selected');
            }
        });
    });


    if (extras_url != '') {
        $(table_id).on('click', '.row-extras-link', function(event) {
            var currentRow = $(this).closest('tr');
            var rowData = $(table_id).dataTable().fnGetData(currentRow[0]);

            var row_id = rowData[idCol];

            // Redirect to the new url using extras_url
            document.location.href = extras_url + row_id;
       });
    }

    $(table_id).on('click', '.row-clusterfs-link', function(event) {
        var currentRow = $(this).closest('tr');
        var rowData = $(table_id).dataTable().fnGetData(currentRow[0]);

        var row_id = rowData[idCol];

        // Redirect to the new url using extras_url
        document.location.href = extras_url + row_id + "&op=clusterfs";
    });

    $(table_id).on('click', '.row-actions', function(event) {
        console.log("Got row actions click");
        var currentRow = $(this).closest('tr');
        var rowData = $(table_id).dataTable().fnGetData(currentRow[0]);

        var classes = $(event.target).closest('a').attr('class');
        var row_id = rowData[idCol];
        var row_name = $(rowData[nameCol]).html();

        if (classes.indexOf("row_extras") > 0) {
            // Redirect to the new url using extras_url
            document.location.href = extras_url + row_id + "&op=extras"
        }
        if (classes.indexOf("row_clone") > 0) {
            // Redirect to the new url using extras_url
            document.location.href = extras_url + row_id + "&op=clone";
        }
        else if (classes.indexOf("row_delete") > 0) {
            // Perform row delete operation here..
            deleteRow(manage_url, delete_id, row_id, row_name, deleteCallback);
        }
        else if (classes.indexOf("row_edit") > 0) {
            if(table_id != '#flavors_table') { // Redirect to the new url using edit url
                document.location.href = edit_url + row_id;
            }
        }
        else if (classes.indexOf("row_charts") > 0) {
            document.location.href = extras_url + row_id + '&op=charts';
        }
        else if (classes.indexOf("row_upload") > 0) {
            // Perform row delete operation here..
            uploadRow(manage_url, row_id, row_name, uploadCallback);
        }
        else if (classes.indexOf("row_cancel") > 0) {
            // Perform row delete operation here..
            installCancelRow(false, manage_url, row_id, row_name, installCallback);
        }
        else if (classes.indexOf("row_install") > 0) {
            // Perform row delete operation here..
            installCancelRow(true, manage_url, row_id, row_name, installCallback);
        }
    });

    $(delete_id).on('click', function() {
        var table = $(this).closest('table');
        var deleteRowData = new Array();
        $('tbody input[type="checkbox"]', table_id).each(function() {
            if ($(this).is(':checked')) {
                deleteRowData.push(this);
            }
        });

        if (deleteRowData.length == 0) {
            return;
        }

        // Invoke the delete function that does ajax functionality.
        bootbox.confirm("Confirm deletion. This action cannot be undone", function(result) {
            if (result) {
                bdStartSpin();
                deleteRows(table_id, manage_url, delete_id, deleteRowData, 0, idCol, nameCol, deleteCallback);
            }
        });
    });

    numTables++;
}

$(document).on('mouseenter','[data-rel=popover]', function(){
    popover = $(this).popover({html:true});
    $(this).popover('show');
});

$(document).on('mouseleave','[data-rel=popover]', function(){
    $(this).popover('hide');
});


function deleteRow(delete_url, delete_id, row_id, row_name, callback)
{
    /* We have to send a post request to do an edit operation */
    var data = {
        operation: 'delete',
        id: row_id,
        delete_id: delete_id,
        name: row_name,
    };

    bootbox.confirm("Confirm Operation. This action cannot be undone", function(result) {
        if (result) {
            bdStartSpin();
            $.ajax({
                url: delete_url,
                method: 'post',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(data),
                csrfmiddlewaretoken: csrftoken,
                headers: {'X-CSRFToken' : csrftoken},
                success: function(result) {
                    if (result.status_code >= 200 && result.status_code < 207) {
                        callback(row_name, "success", null);
                        location.reload(true);
                        bdStopSpin();
                    }
                    else {
                        msg = getErrorMessage(result.status_code, result.reason);
                        if (result.status_code == 408) {
                            bootbox.alert(msg, function(res) {
                                window.location.href = result.redirect;
                                return;
                            });
                        }
                        else {
                            callback(row_name, "failed", msg);
                            bdStopSpin();
                        }
                    }
                    return false;
                },
                error: function(result) {
                    callback(row_name, "failed", "Got an exception while performing the operation");
                    bdStopSpin();
                    return false;
                }
            });
        }
    });
}

function doAjax(url, data, row_name, callback)
{
    bdStartSpin();
    $.ajax({
        url: url,
        method: 'post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        csrfmiddlewaretoken: csrftoken,
        headers: {'X-CSRFToken' : csrftoken},
        success: function(result) {
             if (result.status_code >= 200 && result.status_code < 207) {
                 callback(row_name, "success", null);
                 location.reload(true);
                 bdStopSpin();
             }
             else {
                 msg = getErrorMessage(result.status_code, result.reason);
                 if (result.status_code == 408) {
                     bootbox.alert(msg, function(res) {
                         window.location.href = result.redirect;
                         return;
                     });
                 }
                 else {
                     callback(row_name, "failed", msg);
                     bdStopSpin();
                 }
             }
             return false;
         },

         error: function(result) {
             callback(row_name, "failed", "Got an exception while performing the operation");
             bdStopSpin();
             return false;
         }
    });
}


function uploadRow(url, row_id, row_name, callback)
{
    /* We have to send a post request to do an edit operation */
    var data = {
        operation: 'upload',
        id: row_id,
    };
    doAjax(url, data, row_name, callback);
}

function installCancelRow(install, url, row_id, row_name, callback)
{
    /* We have to send a post request to do an edit operation */
    var data;
    if (install) {
        data = {
            operation: 'install',
            id: row_id,
        };
        doAjax(url, data, row_name, callback);
    }
    else {
        data = {
            operation: 'cancel',
            id: row_id,
        };
        // Also ask for confirmation message
        bootbox.confirm("Confirm Aborting. This action cannot be undone", function(result) {
            if (result) {
                doAjax(url, data, row_name, callback);
                return;
            }
        });
    }

}

function deleteRows(table_id, delete_url, delete_id, deleteRowData, i, idCol, nameCol, callback)
{
    var currentRow = $(deleteRowData[i]).closest('tr');
    var rowData = $(table_id).dataTable().fnGetData(currentRow[0]);

    if (i == deleteRowData.length) {
        location.reload(true);
        bdStopSpin();
        return;
    }
    var data = {
        operation: 'delete',
        id: rowData[idCol],
        delete_id: delete_id,
        name: $(rowData[nameCol]).html()
    };

    $.ajax({
        url: delete_url,
        method: 'post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        csrfmiddlewaretoken: csrftoken,
        headers: {'X-CSRFToken' : csrftoken},
        success: function(result) {
            if (result.status_code >= 200 && result.status_code < 207) {
                callback(deleteRowData[i].name, "success", null);
            }
            else {
                msg = getErrorMessage(result.status_code, result.reason);
                if (i+1 == deleteRowData.length) {
                    if (result.status_code == 408) {
                        bootbox.alert(msg, function(res) {
                            window.location.href = result.redirect;
                            return;
                        });
                    }
                }
                callback(deleteRowData[i].name, "failed", msg);
            }
            deleteRows(table_id, delete_url, delete_id, deleteRowData, i+1, idCol, nameCol, callback);
            return false;
        },

        error: function(result) {
            callback(deleteRowData[i].name, "failed", "Got an exception while performing the operation");
            deleteRows(table_id, delete_url, delete_id, deleteRowData, i+1, idCol, nameCol, callback);
            return false;
        }
    });
}

/* Single one short timer with callback */
function bdStartAjaxTimer(interval, name, ajaxCallback, ctxt) {
    bdTimers[name] = setTimeout(function() {
        ajaxCallback(ctxt);
    }, interval*1000);
}

function bdStopAjaxTimer(name) {
    clearInterval(bdTimers[name]);
}


function bdStartSpin() {
    var opts = {};
    opts['lines'] = 12;
    opts['length'] = 15;
    opts['width'] = 4;
    opts['radius'] = 20;
    opts['corners'] = 1;
    opts['rotate'] = 0;
    opts['trail'] = 60;
    opts['speed'] = 1;
    spinner = new Spinner().spin(document.getElementById('id_spinner'), opts);
    $('#id_spinner').data('spinner', spinner);
}

function bdStopSpin() {
    if (spinner != null) {
        $('#id_spinner').data('spinner').stop();
    }
}


function bdStartCustomSpin(id) {
    var opts = {};
    opts['lines'] = 12;
    opts['length'] = 20;
    opts['width'] = 10;
    opts['radius'] = 20;
    opts['corners'] = 1;
    opts['rotate'] = 0;
    opts['trail'] = 60;
    opts['speed'] = 0.5;

    var target = document.getElementById(id);
    oSpinner[id] = new Spinner(opts).spin();
    target.appendChild(oSpinner[id].el);
}

function bdStopCustomSpin(id) {
    if (oSpinner[id] != null) {
        oSpinner[id].stop();
        oSpinner[id] = null;
    }
}


function addValidationRules(rulesObj){
    for (var item in rulesObj){
        $('#'+item).rules('add',rulesObj[item]);  
    } 
}

function removeValidationRules(rulesObj){
    for (var item in rulesObj){
        $('#'+item).rules('remove');  
    } 
}

function bdNotify(msg, status)
{
    if (status == "success") {
        $.gritter.add({
            title: msg,
            class_name: 'gritter-success' +  ' gritter-light',
            time: '3000',
        });
    }
    else {
        $.gritter.add({
            title: msg,
            class_name: 'gritter-warning' +  ' gritter-light',
            time: '3000',
        });
    }
}

/* Convert unix timestamp to hours and minutes */
function getTimeFromTimestamp(timestamp) {
    var date = new Date(timestamp*1000);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = '0' + date.getMinutes();
    }
    
    return(hours + ':' + minutes);
}


/* Convert unix timestamp to a full date with time */
function getDateTimeFromTimestamp(timestamp) {
    var a = new Date(timestamp*1000);
    var year = a.getFullYear();
    var month = a.getMonth()+1;
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    if (min < 10) {
        min = '0' + a.getMinutes();
    }
    var sec = a.getSeconds();
    if (sec < 10) {
        sec = '0' + a.getSeconds();
    }
    var time = month+'/'+ date + '/' + year+' '+ hour + ':' + min + ':' + sec ;
    return time;
}

function getDateTimeFromModificationTime(modTime) {
    var a = new Date(modTime);
    var year = a.getFullYear();
    var month = a.getMonth()+1;
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    if (min < 10) {
        min = '0' + a.getMinutes();
    }
    var sec = a.getSeconds();
    if (sec < 10) {
        sec = '0' + a.getSeconds();
    }
    var time = month+'/'+ date + '/' + year+' '+ hour + ':' + min + ':' + sec ;
    return time;
}

(function($){
    var methods = {
        init : function( options ) {
            return this.each(function() {
            var $this = $(this);
            $this.unbind("change");

            $this.find('[contenteditable]').each(function(){
                $(this).contentEditable("field", $this);
            });

            });
        },
        field : function( parent ) {
            return this.each(function(){
                var $this = $(this);
                // setting the key based on an attribute available on the same level as 'contentEditable'
                var key = $this.attr("data-key");
                // add triggers
                $this.on('focus', function() {
                    var $this = $(this);
                    $this.data('enter', $this.html());
                    $this.data('before', $this.html());
                    return $this;
                }).on('keyup paste', function() {
                    var $this = $(this);
                    var text = $this.html();
                    if ($this.data('before') !== text) {
                        $this.data('before', text);
                        var data = {};
                        data[key] = text;
                        parent.trigger({type: 'change', action : 'update', changed: data});
                    }
                    return $this;
                }).on('blur', function() {
                    var $this = $(this);
                    var text = $this.html();
                    if ($this.data('enter') !== text) {
                        $this.data('enter', text);
                        var data = {};
                        data[key] = text;
                        parent.trigger({type: 'change', action : 'save', changed: data});
                    }
                    return $this;
                })
            });
        }
    };

    $.fn.contentEditable = function( method ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.contentEditable' );
        }    
    };
})(jQuery);


function addDashboardVirtnode(table_id, data, is_site_admin) {

    var tddata = '<td>' + data.name + '</td>';
    if (is_site_admin) {
        tddata += '<td>' + data.hypervisor_host + '</td>';
    }
    else{
        tddata += '<td>' + data.public_ip + '</td>';
        tddata += '<td>' + data.hadoop_distro + '</td>';
    }
    tddata += '<td>' + data.flavor + '</td>';
    if (data.persistent) {
        tddata += '<td><span class="center label label-purple" style="width:100px;">'+data.job_or_cluster+'</span>';
    }
    else {
        if (data.in_use) {
            tddata += '<td><span class="center label label-success" style="width:100px;">'+data.job_or_cluster+'</span>';
        }
        else {
            tddata += '<td><span class="center label label-info" style="width:100px;">Free</span>';
        }
    }

    $(table_id).append("<tr>"+tddata+"</tr>");
}


function updateDashboardVirtNodeList(url, is_site_admin)
{
    var data = {
        operation: 'get_vnode_list',
    };
    $.ajax({
        url: '0' + url,
        method: 'post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        csrfmiddlewaretoken: csrftoken,
        headers: {'X-CSRFToken' : csrftoken},
        success: function(result) {
            // Stop the spinner
            bdStopCustomSpin('virtnode_spinner');
            for (i = 0; i < result.length; i++) {
                var data = result[i];
                // name, hadoop_distro, flavor, job_or_cluaster label
                addDashboardVirtnode('#virtnode', result[i], is_site_admin);
            }
        },
        error: function(result) {
             // Got an error. schedule a timer to retry again
             bdTimers['virtnode_time'] = setTimeout(function(url, is_site_admin) {
                 ajaxCallback(url, is_site_admin);
             }, interval*1000);
        },
    });
}


//function to convert xml string into pretty(formatted or indented) xml
function formatXml(xml) 
{
  var formatted = '';
  var reg = '/(>)(<)(\/*)/g';
  xml = xml.replace(reg, '$1\r\n$2$3');
  var pad = 0;

  jQuery.each(xml.split('\r\n'), function(index, node)
  {
      var indent = 0;
      if (node.match( /.+<\/\w[^>]*>$/ ))
      {
          indent = 0;
      }
      else if (node.match( /^<\/\w/ ))
      {
          if (pad != 0)
          {
              pad -= 1;
          }
      }
      else if (node.match( /^<\w[^>]*[^\/]>.*$/ ))
      {
          indent = 1;
      }
      else
      {
          indent = 0;
      }
      var padding = '';
      for (var i = 0; i < pad; i++)
      {
          padding += '  ';
      }
      formatted += padding + node + '\r\n';
      pad += indent;
  });

  return formatted;
}

//To search in tree of DCO list
function searchTree(treeId, nodeId) 
{
    var rootNode = $(treeId).dynatree("getRoot");
    var match = undefined;

    rootNode.visit(function (node) {
      if (node.data.id === nodeId) {
        match = node;
        return;
      }
    });
    return match;
}

function reloadClusterFSNode(options)
{
    var node;

    // Add a root node for cluster fs
    node = searchTree(options.id, "Cluster FS");
    node.data.isFolder = true;
    node.data.isLazy = true,
    node.data.access_error = "";
    node.render();

    // Reload rest of the nodes.
    reloadTree(0, options);
}

//To reload the tree of DCO list
function reloadTree(i, options)
{
    if (i == options.list.length) {
        return;
    }

    // Make an ajax call to see if this root dco is a file/folder
    var data = {
        operation: 'query_root_object',
        id: options.list[i].id
    };

    var id = options.list[i].id;

    $.ajax({
        url: options.url,
        method: 'post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        csrfmiddlewaretoken: csrftoken,
        headers: {'X-CSRFToken' : csrftoken},
        success: function(root_obj) {
            // Search for the node that has same title and modify it..
            node = searchTree(options.id, root_obj.id);
            if (node == undefined) {
                return;
            }

            node.data.isFolder = root_obj.isFolder;
            node.data.isLazy = root_obj.isFolder ? true : false,
            node.data.access_error = root_obj.access_error;
            node.render();
            reloadTree(i+1, options);
        },
        error: function(root_obj) {
           node = searchTree(options.id, root_obj.id);
           if (node == undefined) {
               return;
           }

           node.data.isFolder = false;
           node.data.isLazy = false,
           node.data.access_error = "Got an error while accessing";
           node.render();
           reloadTree(i+1, options);
        }
    });
}

//function to build/initialize the dyna tree
function createDynaTree(options)
{
    $(options.id).dynatree({
        title: "File Browser",
        onActivate: function(node) {
          var path = node.data.path;
          var k = 0;
          var bdfsPath;
          if (node.data.id == "Cluster FS") {
              bdfsPath = "";
          }
          else {
              bdfsPath = 'bdfs://';
              // Find the dco associated with this node.
              for (k = 0; k < options.list.length; k++) {
                  if (options.list[k].id == node.data.id) {
                      break;
                  }
              }
              // strip dco's path from the actual path before setting the url
              path = path.replace(options.list[k].path, "");
              bdfsPath += options.list[k].name;
          }

          // If then path already starts with "/", then don't prepend "/"
          if (path.length && path[0] == '/') {
            bdfsPath += path;
          }
          else {
            bdfsPath += "/" + path;
          }

          options.activateCallback(bdfsPath);
        },

        onRender: function(node, nodeSpan) {
            if (node.data.access_error != '') {
                $(nodeSpan).find("a.dynatree-title").css("color", "red");
            }
            else if (node.data.id == "Cluster FS") {
                $(nodeSpan).find("a.dynatree-title").css("font-weight", "normal");
            }
            else if (node.data.id == "Divider") {
                $(nodeSpan).find("span.dynatree-connector").remove();
                $(nodeSpan).removeClass("dynatree-exp-c");
                $(nodeSpan).removeClass("dynatree-ico-c");
                $(nodeSpan).removeClass("dynatree-node");
                $(nodeSpan).find("span.dynatree-title").css("font-weight", "bold");
                $(nodeSpan).find("span.dynatree-title").css("font-style", "italic");
            }
            else {
                $(nodeSpan).find("a.dynatree-title").css("font-weight", "normal");
            }
        },

        onCreate: function(node, span){
            if (options.contextMenuCallback != undefined) {
                options.contextMenuCallback(span);
            }
        },
        onClick: function(node, event) {
            // Close menu on click
            if (options.contextMenuCallback != null && $(".contextMenu:visible").length > 0) {
                $(".contextMenu").hide();
//					return false;
            }
        },
        onKeydown: function(node, event) {
           if (options.contextMenuCallback == undefined) {
               return false;
           }
           if ($(".contextMenu:visible").length > 0)
               return false;

           switch (event.which) {
                // Open context menu on [Space] key (simulate right click)
               case 32: // [Space]
                   $(node.span).trigger("mousedown", {
                       preventDefault: true,
                                       button: 2
                   })
                   .trigger("mouseup", {
                       preventDefault: true,
                       pageX: node.span.offsetLeft,
                       pageY: node.span.offsetTop,
                       button: 2
                   });
                   return false;
           }
        },
        /*** ****/


        onDeactivate: function(node) {
        },

        onExpand: function(node) {
        },
        onLazyRead: function(node){
          var data = {
              operation: 'get_remote_objects',
              id: node.data.id == "Cluster FS" ? options.cluster_id : node.data.id,
              src: node.data.id == "Cluster FS" ? "cluster" : options.src,
              path: node.data.path,
          };
          
          var id = node.data.id;

          $.ajax({
            url: options.url,
            method: 'post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            csrfmiddlewaretoken: csrftoken,
            headers: {'X-CSRFToken' : csrftoken},
            success: function(list) {
              var res = [];
              for (var i = 0; i < list.length; i++) {
                  if (options.allow_file || list[i].isFolder) {
                      res.push({title: list[i].title,
                        isFolder: list[i].isFolder,
                        isLazy: list[i].isFolder,
                        id: id,
                        access_error: '',
                        path: list[i].path});
                  }
              }
              node.setLazyNodeStatus(DTNodeStatus_Ok);
              node.addChild(res);
            }
          });

        },

        dnd: {
          onDragStart: function(node) {
              return false;
          },
          onDragStop: function(node) {
          },
          onDragOver: function(node) {
          },
        }
    });

    // Based on DSOG selected, add nodes
    var rootNode = $(options.id).dynatree("getRoot");
    if (rootNode != null) {
        // First remove all the nodes in the tree.
        rootNode.removeChildren();

        // Load the nodes without folder access, we will do ajax
        // call to make sure these dcos are ok, and they will
        // get gradually updated in the tree
        if (options.cluster_fs) {
            rootNode.addChild({
                title: "Cluster FS " + "("  + options.cluster_name + ")",
                id: "Divider",
                access_error: '',
                icon: false,
                noLink: true,
            });
            rootNode.addChild({
                title: "/",
                isFolder: false,
                isLazy: false,
                id: "Cluster FS",
                access_error: '',
                path: '',
            });
            rootNode.addChild({
                title: "</br>Data Connectors",
                id: "Divider",
                access_error: '',
                icon: false,
                noLink: true,
            });
        }
        else {
            rootNode.addChild({
                title: "Data Connectors",
                id: "Divider",
                access_error: '',
                icon: false,
                noLink: true,
            });
        }

        for (var k = 0; k < options.list.length; k++) {
            rootNode.addChild({
                title: options.list[k].name,
                isFolder: false,
                isLazy: false,
                id: options.list[k].id,
                access_error: '',
                path: '',
            });
        }
    }

    // Start ajax process of populating the tree
    if (options.cluster_fs) {
        reloadClusterFSNode(options);
    }
    else {
        reloadTree(0, options);
    }
}

//to get length of JSON object
function getJsonLength(json)
{
  if(Object.keys)
    return Object.keys(json).length;
  else {
    var length = 0;
    for(var key in json) {
      if(json.hasOwnProperty(key))
        ++length;
    }
    return length;
  }
}
//sort alphabetically the string exist in label  
function sort_asc(a, b) 
{
  var textA = $('label', $(a)).text().toLowerCase(),
  textB = $('label', $(b)).text().toLowerCase();
  return (textB < textA) ? 1 : -1;
}



function hadoop_config_params() {
    var self = this;
    this.initialized = false;

    this.get_search_objects = function(name) {
        this.search_list = [];
        this.search_active = true;
        for (var i = 0; i < self.cat_list.length; i++) {
            cat = self.cat_list[i];
            if (!self.is_cat_valid(cat.category)) {
                continue;
            }

            for (var j = 0; j < cat.sub_category.length; j++) {
                sub_cat = cat.sub_category[j];

                for (var k = 0; k < sub_cat.items.length; k++) {
                    item = sub_cat.items[k];
                    if (item.property_name.indexOf(name) == 0) {
                        this.search_list.push({"item" : item, "category" : i, "sub_category" : j, "param" : k});
                    }
                }
            }
        }
    }

    this.is_cat_valid = function(category) {
        // Based on the mr type and application checked/or not, check if this category can be
        // shown..
        var cat_valid = false;
        for (var x = 0; x < self.cat_groups.length; x++) {
            if (self.cat_groups[x]["name"] == "Applications" && !self.app_checked) {
                // App is not checked, so we can skip this category..
                continue;
            }
                  
            if (self.cat_groups[x]["name"] != self.mr_type_choice) {
                // mr type is not a match, so skip this as well
                continue;
            }

            for (y = 0; y < self.cat_groups[x].categories.length; y++) {
                if (category == self.cat_groups[x].categories[y]) {
                    cat_valid = true;
                    break;
                }
            }
        }
        return cat_valid;
    }

    this.adv_settings_handler = function() {
        $('#category-tabs').find('ul li').remove();
        $('#sub-category').empty();

        var param_popover_active = false;
        var first_cat = true;

        for (var i = 0; i < self.cat_list.length; i++) {
            // Add category tabs..
            cat = self.cat_list[i];
            if (!self.is_cat_valid(cat.category)) {
                continue;
            }
            
            var data = '';
            if (first_cat) {
                data = '<li class="active">';
            }
            else {
                data = '<li>';
            }
            data += '<a data-toggle="tab" href="#cat-tab-'+i+'">'+cat.category+'</a></li>';
            $('.nav-tabs').append(data);


            // Get the tab content for this tab
            // Prepare the accordions for this...
            if (first_cat) {
                data = '<div id="cat-tab-'+i+'" class="accordion-style2 tab-pane in active">';
                first_cat = false;
            }
            else {
                data = '<div id="cat-tab-'+i+'" class="accordion-style2 tab-pane">';
            }
            data += '<div id="cat'+i+'" class="accordion">';
            for (var j = 0; j < cat.sub_category.length; j++) {
                var subcat = cat.sub_category[j];
                var accordion_id = 'cat'+i+'-subcat'+j;

                // Accordion group/heading
                data += '<div class="accordion-group">' +
                        '<div class="accordion-heading">' +
//                        '<a href="#' + accordion_id + '" data-target="#' + accordion_id + '" data-toggle="collapse" class="accordion-toggle collapsed">' +
                        '<a href="#' + accordion_id + '" data-parent="#cat' + i + '" data-toggle="collapse" class="accordion-toggle collapsed">' +
                        subcat.sub_category +
                        '</a>' + '</div>';

                // Accordion Body
                data += '<div class="accordion-body collapse" id="'+accordion_id+'">' +
                        '<div class="accordion-inner">' ;

                // Include all the input param felds here..
                for (var k = 0; k < subcat.items.length; k++) {
                    var item = subcat.items[k];
                    var param_id="param-cat"+i+"-subcat"+j+"-"+k;
                    // Check to see if the default has to be
                    // overwritten

                    var default_value = item.default_value;
                    
                    for (var def in self.cluster_params) {
                        if (item.property_name == self.cluster_params[def]["property_name"] && 
                              item.namespace == self.cluster_params[def]["namespace"]) {
                            default_value = self.cluster_params[def]["value"];
                            break;
                        }
                    }
                    
                    var common_params='name="'+item.property_name+'" id="'+param_id+'"'+' value="'+default_value+'"'+' category="'+item.category+'"';

                    if (self.edit_view == true) {
                        common_params += ' disabled';
                    }

                    data += '<div class="control-group params-control-group" id="label-'+param_id+'">';
                    data += '<label id="label-'+param_id+'" class="params-control-group control-label" style="width:300px;margin:10px;">' +
                            //                           data += '<label id="label-'+param_id+'" class="params-control-group">' +
                            item.property_name +
                            '</label>';

                    data += '<div class="controls" style="margin:10px;">';
                    if (item.constraints) {
                        var constraints = item.constraints;
                        if (constraints.allowed_values) {
                            data += '<select '+common_params+ '>';
                            for (var val = 0; val < constraints.allowed_values.length; val++) {
                                var option = constraints.allowed_values[val];
                                if (option  == default_value) {
//                                    data += '<option name='+ option  + ' value='+option +' selected>'+option +'</option>';
                                    data += '<option name='+ option  + ' selected >'+option +'</option>';

                                }
                                else {
                                    data += '<option name='+ option  + '>'+option +'</option>';
                                }
                            }
                            data += '</select>';
                        }
                        else if (constraints.min_value || constraints.max_value) {
                            console.log("Got min/max value constraints %s", item.property_name);
                        }
                    }
                    else {
                        switch (item.type) {
                            case "boolean":
                                if (default_value == "true") {
                                    data += '<input '+common_params+' class="ace ace-switch true-false-switch" type="checkbox" checked />';

                                }
                                else {
                                    data += '<input '+common_params+' class="ace ace-switch true-false-switch" type="checkbox" />';
                                }
                                break;
                            case "password_string":
                                data += '<input '+common_params+ ' type="password" />';
                                break;
                            default:
                                data += '<input '+common_params+ ' type="text" />';
                                break;
                        }
                    }
                    data += '<span id="span-'+param_id+'" class="lbl"></span>';

                    data += '</div></div>';
                    //                           data += '</div>';
                }

                data += '</div></div></div>';
            }
            data += '</div></div>';
            $('#sub-category').append(data);

            var cat_id = '#cat'+i;

            $(cat_id).on('hide', function (e) {
                $(e.target).prev().children(0).addClass('collapsed');
            });
            $(cat_id).on('hidden', function (e) {
                $(e.target).prev().children(0).addClass('collapsed');
            });
            $(cat_id).on('show', function (e) {
                $(e.target).prev().children(0).removeClass('collapsed');
            });
            $(cat_id).on('shown', function (e) {
                $(e.target).prev().children(0).removeClass('collapsed');
            })
        }

        // Hide the prev/next buttons.
        $('.prev-next-buttons').hide();

        // Tab shown handling
        $(document).on('shown', 'a[data-toggle="tab"]', function (e) {
            // If search is active, show the first accordion that has to be expanded.
            if (self.search_active) {
                var obj = self.search_list[self.search_index];
                var subcat_id = "#cat"+obj["category"]+"-subcat"+obj["sub_category"];
                $(subcat_id).collapse("show");

                // Foucs on the param
                param_id = "#param-cat"+obj["category"]+"-subcat"+obj["sub_category"]+"-"+obj["param"];
                $(param_id).focus();
            }
        });

        this.get_item_object = function(name, category) {
            for (var i = 0; i < self.cat_list.length; i++) {
                cat = self.cat_list[i];
                if (category == undefined || cat.category == category) {
                    for (var j = 0; j < cat.sub_category.length; j++) {
                        sub_cat = cat.sub_category[j];

                        for (var k = 0; k < sub_cat.items.length; k++) {
                            item = sub_cat.items[k];
                            if (name == item.property_name) {
                                return item;
                            }
                        }
                    }
                }
            }
            return null;
        }

        $('[id^=param-cat]').on('mouseenter mouseleave', function (evt) {
            var eltId = '#span-'+$(this).attr('id');
            var name = $(this).attr('name');
            if (evt.type == "mouseenter") {
                setTimeout(function(eltId, name) {
                    //                   var eltId = id;
                    // Got through the json list and find the
                    var item = self.get_item_object(name);
                    if (item == null) {
                        console.log("Can't find name %s", name);
                        return;
                    }

                    var msg = "<b>Description:</b> " + item.label.description + "</br>";
                    msg += "<b>Affected services:</b> " + item.services + "</br>";
                    // Not showing namespace for now..
                    //           msg += "<b>XML File:</b> " + item.namespace + "</br>";
                    title = item.label.name;
                    $(eltId).popover({
                        trigger: 'manual',
                        animation: true,
                        html: true,
                        title: title,
                        placement: 'right',
                        container: 'body',
                        content: msg
                    }); //.data('popover').tip().addClass(id);

                    $(eltId).popover("show");
                    $('.popover').css("max-width", "400px");
                    $('.popover').css("max-height", "800px");

                }, 700, eltId, name, evt);
            }
            else {
                $(eltId).popover("destroy");

                // Hide the popover.
                setTimeout(function(){
                    $(eltId).popover("destroy");
                }, 800);
            }
        });
    }

    // This function is called when new settings have to be shown.
    this.check_and_show_adv_settings = function(distro_categories, distro_name, mr_type_choice, app_checked) {
        if (!self.initialized) {
            return;
        }
        $('#adv-settings-dropdown').removeClass('icon-chevron-down').addClass('icon-chevron-right');
        $('#category-tabs').hide();
        $('#adv-settings-block').hide();
        this.mr_type_choice = mr_type_choice;
        this.app_checked = app_checked;
        for (var i = 0; i < distro_categories.length; i++) {
            if (distro_name == distro_categories[i].distro_name) {
                if (distro_categories[i].categories.length != 0) {
                    $('#adv-settings-block').show();

                    self.cat_list = distro_categories[i].categories;
                    self.cat_groups = distro_categories[i].category_groups;

                    // Setup hooks to detect adv-settings click
                    this.adv_settings_handler();
                }
                break;
            }
        }
    }

    this.disable_default_params = function(form) {
        // Disable input values that haven't changed
        $('[id^=param-cat]').each(function(index) {
            // Based on the id get the associated item.

            id = $(this).attr('id');
            name = $(this).attr('name');
            category = $(this).attr('category');

            var disable_item = true;

            item = self.get_item_object(name, category);
            if (item.default_value != $(this).val()) {
                // Disable this input element..
                disable_item = false;
            }

            if (disable_item) {
                $(this).prop('disabled', true);
            }
            else {
                // Change the name of the input field and also insert
                // an addition input field to send down namespace..
                $(this).attr('name', "config-param-"+name);

                var input = $("<input>")
                            .attr("type", "hidden")
                            .attr("name", "config-namespace-"+name)
                            .val(item.namespace);
                $(form).append($(input));
            }
        });
    }
    
    // Initialize function...
    this.initialize = function (distro_categories, distro_name, mr_type_choice, app_checked, edit_view) {
        this.cat_list = [];
        this.mr_type_choice = mr_type_choice;
        this.app_checked = app_checked;
        this.cat_groups = [];
        this.search_list = [];
        this.search_active = false;
        this.search_index = 0;
        this.cluster_params = [];
        this.initialized = true;
        this.edit_view = edit_view;

        // Based on the distro select, setup cat_list..
        for (var i = 0; i < distro_categories.length; i++) {
            if (distro_name == distro_categories[i].distro_name) {
                if (distro_categories[i].categories.length != 0) {
                    self.cat_list = distro_categories[i].categories;
                    self.cat_groups = distro_categories[i].category_groups;
                    $('#adv-settings-block').show();

                    // Setup hooks to detect adv-settings click
                    this.adv_settings_handler();
                }
                break;
            }
        }

        function change_tab_accordion() {
            if ((self.search_index+1) == self.search_list.length) {
                // Disable next in this case
                $('#next-button').prop('disabled', true);
            }
            else {
                $('#next-button').prop('disabled', false);
            }

            if (self.search_index == 0) {
                // Disable prev in this case
                $('#prev-button').prop('disabled', true);
            }
            else {
                $('#prev-button').prop('disabled', false);
            }
            var obj = self.search_list[self.search_index];
            var cat_tab_id = "#cat-tab-"+obj["category"];
            var current_active_tab = $('.nav-tabs .active a').attr('href');
            if (cat_tab_id == current_active_tab) {
                // Tab is already visible, expand the accordion
                // No need to show this tab. Jump to highlighting the first sub category..
                var subcat_id = "#cat"+obj["category"]+"-subcat"+obj["sub_category"];
                $(subcat_id).collapse("show");

                // Focus on the param.
                param_id = "#param-cat"+obj["category"]+"-subcat"+obj["sub_category"]+"-"+obj["param"];
                $(param_id).focus();
            }
            else {
                // Start by showing the new tab, event handler will expand accordion and highlight the param
                $('a[href="'+cat_tab_id+'"]').tab('show');
            }
        }

        $("#adv-settings-dropdown").on('click', function() {
            if ($('#category-tabs').is(":visible")) {
                $('#adv-settings-dropdown').removeClass('icon-chevron-down').addClass('icon-chevron-right');
                $('#category-tabs').hide();
            }
            else {
                $('#adv-settings-dropdown').removeClass('icon-chevron-right').addClass('icon-chevron-down');
                $('#category-tabs').show();

                self.adv_settings_handler();
            }
        });

        $(document).on('change', '[id^=param-cat]', function() {
            type = $(this).attr('type');
            if (type == "checkbox") {
                if ($(this).val() == "true") {
                    $(this).val("false");
                }
                else {
                    $(this).val("true");
                }
            }
        });

        $('.prev-next-buttons').on('click', function(e) {
            if (e.target.id == 'prev-button') {
                e.preventDefault();
                self.search_index = self.search_index - 1;
                change_tab_accordion(self.search_index);
            }
            else {
                e.preventDefault();
                self.search_index = self.search_index + 1;
                change_tab_accordion(self.search_index);
            }
        });

        $("#param-search").on('keypress keyup', function(e) {
            if (e.type == 'keypress' && e.keyCode == 13) {
                e.preventDefault();

                // Clear all highlighted params..
                $(".params-control-group").each(function() {
                    $(this).removeClass('purple');
                });    

                $('#param-search').css("color", "black");

                var search = $(this).val();
                if (search.length == 0) {
                    return;
                }

                $('#not-found-text').hide();
                $('.prev-next-buttons').hide();

                bdStartSpin();

                self.get_search_objects(search);
                bdStopSpin();

                if (self.search_list.length == 0) {
                    $(this).css("color", "red");
                    $('#not-found-text').show();
                    return;
                }

                $('.prev-next-buttons').show();

                // Highlight all the params based on the search list
                for (var i = 0; i < self.search_list.length; i++) {
                    var obj = self.search_list[i];
                    param_id = "#label-param-cat"+obj["category"]+"-subcat"+obj["sub_category"]+"-"+obj["param"];
                    $(param_id).addClass('purple');
                }

                change_tab_accordion(self.search_index);
            }
            else if (e.keyCode == 27 || (e.keyCode == 8 && $(this).val().length == 0)) {
                // Reset search params
                $(this).css("color", "black");
                $('#not-found-text').hide();
                $('.prev-next-buttons').hide();
                $(this).val("");
                self.search_active = false;

                // Clear all highlighted params..
                $(".params-control-group").each(function() {
                    $(this).removeClass('purple');
                });    

                // Hide all tabs
                for (var i = 0; i < self.cat_list.length; i++) {
                    var cat_id = '#cat-tab-'+i;
                    $('a[href="'+cat_id+'"]').tab('hide');
                }
            }
        });
    }

    // Params to override the defaultsInitialize function.
    this.override_defaults = function (cluster_params) {
        self.cluster_params = cluster_params;
    }
}

function get_alert_data_from_current_state(alert) {
    var log = '<li><i class="icon-circle large ';
    switch (alert.current_state) {
        case 'OK':
            log += ' green';
            break;
        case 'WARNING':
            log += ' orange';
            break;
        case 'CRITICAL':
            log += ' red';
            break;
        case 'UNKNOWN':
            log += ' red';
            break;
    }
    log += '"></i>';
    log += '[' + getDateTimeFromTimestamp(alert.timestamp) + ']&nbsp;&nbsp;' + alert.line;
    log += '</li>';
    return log;
}


function get_label_from_current_state(service) {
    var last_check = getTimeFromTimestamp(service.last_check);
    var next_check = getTimeFromTimestamp(service.next_check);
    var tooltip = 'data-rel="popover" data-placement="bottom" data-content="' + 'Last Checked Time : ' + last_check + '</br>' + 'Next Check Time : ' + next_check + '"';

    var data = '<span ' + tooltip + '>';
    data += '<svg width="30" height="30"><circle style="stroke: #808080; fill: ';
    switch (service.current_state) {
        case '0':
            data += ' #83ae72';
            break;
        case '1':
            data += ' #fdb65b';
            break;
        case '2':
            data += ' #cf5c4f';
            break;
        case '3':
            data += ' #cf5c4f';
            break;
    }
    data += '; " r="12" cx="15" cy="13"></circle></svg>';
    data += '</span>';
    return data;
}

function get_nagios_data(nagios_data) {
    var name = '<td>' + nagios_data.host_name + '</td>';

    var bd_mgmt_service = '<td><span class="center label label-important">Unable to get service status</span></td>';
    var data_service = '<td><span class="center label label-important">Unable to get service status</span></td>';
    var cnode_service = '<td><span class="center label label-important">Unable to get service status</span></td>';
    var name_node_service = '<td><span class="center label label-important">Unable to get service status</span></td>';
    var data_node_service = '<td><span class="center label label-important">Unable to get service status</span></td>';
    var button = '<td><div class="visible-desktop action-buttons row-actions">';
    button += '<a class="blue row_checknow" data-rel="tooltip" title="Check Now" data-placement="bottom">' +
              '<i class="icon-cogs bigger-120"></i>' +
              '</a>';
    button += '</div></td>';


    for (var j = 0; j < nagios_data.service_list.length; j++) {
        switch (nagios_data.service_list[j].service_description) {
            case "check-service-bdmgmt":
                bd_mgmt_service = '<td>' + get_label_from_current_state(nagios_data.service_list[j]) + '</td>';
                break;
            case "check-service-dataserver":
                data_service = '<td>' + get_label_from_current_state(nagios_data.service_list[j]) + '</td>';
                break;
            case "check-service-cnode":
                cnode_service = '<td>' + get_label_from_current_state(nagios_data.service_list[j]) + '</td>';
                break;
            case "check-service-namenode":
                name_node_service = '<td>' + get_label_from_current_state(nagios_data.service_list[j]) + '</td>';
            case "check-service-datanode":
                data_node_service = '<td>' + get_label_from_current_state(nagios_data.service_list[j]) + '</td>';
        }
    }

    return [name, bd_mgmt_service, data_service, cnode_service, name_node_service, data_node_service, button];
}

function registerDashboardTable(table_id, num_cols) {
    function setColumns(num_cols) {
        var aCols = [];
        for (var i = 0; i < num_cols; i++) {
            aCols.push({bSortable: false});
        }
        return aCols;
    }

    oTable[table_id] =  $('#'+table_id).dataTable( {
        'bPaginate': false,
        'bFilter': false,
        'bInfo': false,
        'sDom': 't',
        'aoColumns': setColumns(num_cols),
    });
}

function checkAndStartTimerCluster() 
{
    for (var i = 0; i < oTable['cluster_table'].fnGetData().length; i++) 
    {
       var rowData = oTable['cluster_table'].fnGetData(i);
       var status = $(rowData[2]).html();
       if (status == "created" ||
             status == "starting" ||
             status == "updating" ||
             status == "deleting") {
           // We have to start the timer...
           bdStartAjaxTimer(15, 'timer', timerCallbackCluster);
           break;
       }
    }
}

var updateRowDataCluster = new Array();

function timerCallbackCluster() 
{
    updateRowDataCluster = [];
    for (var i = 0; i < oTable['cluster_table'].fnGetData().length; i++) {
        var rowData = oTable['cluster_table'].fnGetData(i);
        var status = $(rowData[2]).html();
        if (status == "deleting" ||
                status == "starting" ||
                status == "created" ||
                status == "updating") {
            updateRowDataCluster.push({'data' : rowData, 'index' : i});
        }
    }
    if (updateRowDataCluster.length) {
        updateStatusCluster(updateRowDataCluster, 0);
    }
    else {
        console.log("Nothing to update");
    }
}

function updateStatusCluster(rowData, i) 
{
    if (i == rowData.length) {
        // Scan through the table to see if we have to start the timer again.
        checkAndStartTimerCluster();
        return;
    }

    var row = rowData[i].data;
    var index = rowData[i].index;

    var status = $(row[2]).html();
    var data = {
        operation: 'get_status',
        id: row[0],
    };
    $.ajax({
        url:  MANAGE_CLUSTER_URL,
        method: 'post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        csrfmiddlewaretoken: csrftoken,
        headers: {'X-CSRFToken' : csrftoken},
        success: function(result) {
            var newValue = row[2];
            switch (result.status) {
               case 'created':
                   newValue = '<span class="center label label-info" style="width:60px;">created</span>';
                   break;
               case 'starting':
                   newValue = '<span class="center label label-info" style="width:60px;">starting</span>';
                   break;
               case 'updating':
                   newValue = '<span class="center label label-info" style="width:60px;">updating</span>';
                   break;
               case 'delete_in_progress':
                   newValue = '<span class="center label label-important" style="width:60px;">deleting</span>';
                   break;
               case 'ready':
                   newValue = '<span class="center label label-success" style="width:60px;">ready</span>';
                   // We should add clusterfs link here
                   var Value = row[2];
                   Value += '<a class="row-clusterfs-link">Cluster FS</a>';
                   oTable['cluster_table'].fnUpdate(Value, index, 2, false);

                   break;
               case 'error':
                   newValue = '<span class="center label label-important"';
                   newValue += " data-content='" + result.error_info + "'";
                   newValue += ' style="width:60px; cursor:pointer;">error</span>';
                   break;
            }

            oTable['cluster_table'].fnUpdate(newValue, index, 2, false);
           
            updateStatusCluster(rowData, i+1);
            return false;
        },
        error: function() {
            console.log("Dashboard: Got an error while trying to get cluster status");
            location.reload(true);
            return false;
        }
    });
}

function checkAndStartTimerJob() 
{
    for (var i = 0; i < oTable['job_table'].fnGetData().length; i++) 
    {
        var rowData = oTable['job_table'].fnGetData(i);
        var status = $(rowData[2]).html();
        if (status == "created" ||
                status == "starting" ||
                status == "running" ||
                status == "deleting") {
            // We have to start the timer...
            console.log("Will be restarting the timer");
            bdStartAjaxTimer(15, 'timer', timerCallbackJob);
            break;
        }
    }
}

var updateRowDataJob = new Array();

function timerCallbackJob() 
{
    updateRowDataJob = [];
    for (var i = 0; i < oTable['job_table'].fnGetData().length; i++) {
        var rowData = oTable['job_table'].fnGetData(i);
        var status = $(rowData[2]).html();
        if (status == "created" ||
                status == "starting" ||
                status == "running" ||
                status == "deleting") {
            updateRowDataJob.push({'data' : rowData, 'index' : i});
        }
    }
    if (updateRowDataJob.length) {
        updateStatusJob(updateRowDataJob, 0);
    }
    else {
        console.log("Nothing to update");
    }
}

function updateStatusJob(rowData, i) 
{
    if (i == rowData.length) {
        // Scan through the table to see if we have to start the timer again.
        checkAndStartTimerJob();
        return;
    }

    var row = rowData[i].data;
    var index = rowData[i].index;

    var status = $(row[2]).html();
    var data = {
        operation: 'get_status',
        id: row[0],
    };
    
    $.ajax({
        url: MANAGE_JOB_URL,
        method: 'post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        csrfmiddlewaretoken: csrftoken,
        headers: {'X-CSRFToken' : csrftoken},
        success: function(result) {
            var newValue = row[2];
            switch (result.status) {
                case 'created':
                  newValue = '<span class="center label label-info" style="width:60px;">created</span>';
                  break;
                case 'starting':
                  newValue = '<span class="center label label-info" style="width:60px;">starting</span>';
                  break;
                case 'running':
                  newValue = '<span class="center label label-info" data-rel="popover" data-placement="left"';
                  newValue += ' title="<i class=\'icon-info-sign blue\'></i> Job Duration"';
                  newValue += ' data-content=\'' + result.duration + '(seconds)\'';
                  newValue += ' style="width:60px;">running</span>';
                  break;
                case 'delete_in_progress':
                  newValue = '<span class="center label label-important" style="width:60px;">deleting</span>';
                  break;
                case 'complete':
                  console.log("Got a success callback");
                  location.reload(true);
                  return false;
                case 'error':         
                  newValue = '<span class="center label label-important"';
                  newValue += ' style="width:60px; cursor:pointer;">error</span>';
                  oTable['job_table'].fnUpdate(getDateTimeFromTimestamp(result['update_ts']), index, 2, false);
                  break;
            }

            oTable['job_table'].fnUpdate(newValue, index, 2, false);
                        
            console.log("Got a success callback");
            updateStatusJob(rowData, i+1);
            return false;
        },
        error: function() {
            console.log("Dashboard: Got an error while trying to get job status");
            location.reload(true);
            return false;
        }
    });
}


function isEmpty(object) {  
    for (var i in object) {
        return false;
    }
    return true;
}
