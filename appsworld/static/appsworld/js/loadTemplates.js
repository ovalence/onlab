window.onload = function() {
    var newsFeedDivs = document.getElementsByClassName("NewsFeedPosts");
    var numberOfPosts = 0;

    if (newsFeedDivs.length > 20) {
        numberOfPosts = 20;
    }
    else {
        numberofPosts = newsFeedDivs.length;
    }

    for (i=0; i<numberofPosts; i++) {
        (function (i) {
            var template_div = document.getElementById(newsFeedDivs[i].id);
            $.ajax({
                url: '/ajax/send_template/',
                data: {'post': newsFeedDivs[i].id},
                dataType: 'json',
                success: function (data) {
                    template_div.insertAdjacentHTML('afterbegin',data.html_string);
                }
                });
        })(i);
    }
}