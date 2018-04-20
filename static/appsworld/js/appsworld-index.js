$('#NAVBAR_TOP').hover(
        function() {
            $('#MAIN_NAV_BAR').css({ 'background-color': 'rgba(0, 119, 190, 0.5)' });
            $('.appsworld-bottom-list').show();
        },
        function() {
            $('#MAIN_NAV_BAR').css({ 'background-color': 'rgba(0, 119, 190, 0)' });
            $('.appsworld-bottom-list').hide();
        }
);

    $("#LOG_OUT_DROPDOWN").hover(
        function() {
            $('#LOG_OUT_MENU', this).not('.in .dropdown-menu').stop( true, true ).slideDown("fast");
            $(this).toggleClass('open');
        },
        function() {
            $('#LOG_OUT_MENU', this).not('.in .dropdown-menu').stop( true, true ).slideUp("fast");
            $(this).toggleClass('open');
        }
    );