/**
 *  modals.js - magnificently moody modals
 *    Event system to ease management of modal load events.
 */

var modalsNS = odkmaker.namespace.load('odkmaker.modals');

;(function($)
{
    var handlers = {
        signinDialog: function($dialog)
        {
            $dialog
                .find(':input').val('').end()
                .find('h3').text('Sign in').end()
                .find('.signinLink').removeClass('hide').end()
                .find('.signupLink').addClass('hide').end()
                .find('.toggleSignupLink').text('Don\'t yet have an account?').closest('p').show().end().end()
                .find('.passwordLink').addClass('hide').end()
                .find('.togglePasswordLink').text('Forgot your password?').closest('p').show().end().end()
                .find('.signin_section').show().end()
                .find('.signup_section').hide();
        },
        accountDialog: function($dialog)
        {
            $dialog.find('#account_email').val(odkmaker.auth.currentUser.email);
        },
        openDialog: function($dialog)
        {
            var $list = $dialog.find('.formList');
            $list.empty();

            $dialog.find('.errorMessage').empty();
            $dialog.find('.modalLoadingOverlay').fadeIn();

            odkmaker.auth.verify(function()
            {
                $dialog.find('.modalLoadingOverlay').stop().fadeOut();

                _.each(odkmaker.auth.currentUser.forms, function(formObj)
                {
                    $list.append('<li rel="' + formObj.id + '">' + $.h(formObj.title) +
                      '<a href="#delete" class="deleteFormLink">delete</a></li>');
                });
                if (odkmaker.auth.currentUser.forms.length === 0)
                {
                    $list.append('<li class="noData">You do not appear to have saved any forms just yet.</li>');
                }
            });
        },
        saveAsDialog: function($dialog)
        {
            $dialog.find('#saveAs_name').val($('h1').text());
        },
        loadLocallyDialog: function($dialog)
        {
            $dialog.find('.errorMessage').hide();
            $dialog.find('#loadFile_name').val('');
        },
        exportDialog: function($dialog)
        {
            if ($('.workspace .control.error:first').length > 0)
                $dialog.find('.validationWarningMessage').show();
            else
                $dialog.find('.validationWarningMessage').hide();

            $dialog.find('.exportCodeContainer pre').text(odkmaker.data.serialize());
        },
        aggregateDialog: function($dialog)
        {
            $dialog.removeClass('exporting');
        },
        optionsEditorDialog: odkmaker.options.modalHandler
    };

    $(function()
    {
        $('.modal').jqm({
            modal: true,
            onShow: function(jqm)
            {
                _.each(handlers, function(callback, key)
                {
                    if (jqm.w.hasClass(key))
                        callback(jqm.w, jqm.t);
                });
                jqm.w.fadeIn('slow');
                jqm.o.fadeIn('slow');
            },
            onHide: function(jqm)
            {
                jqm.w.fadeOut('slow');
                jqm.o.fadeOut('slow');
            }
        }).append('<div class="modalLoadingOverlay"><div class="loadingSpinner"></div></div>');

        $.live('a[rel=modal]', 'click', function(event)
        {
            event.preventDefault();
            var $this = $(this);

            if ($this.hasClass('authRequired') && (odkmaker.auth.currentUser === null))
            {
                $('.signinDialog').jqmShow();
                return;
            }
            else if ($this.hasClass('destructive'))
            {
                if (!confirm('Are you sure? You will lose unsaved changes to the current form.'))
                    return;
            }

            $('.modal.' + $this.attr('href').replace(/#/, '')).jqmShow();
        });

        $('.modal form').submit(function(event)
        {
            event.preventDefault();
            $(this).closest('.modal')
                .find('.acceptLink')
                    .click();
        });
    });
})(jQuery);
