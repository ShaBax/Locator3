/**
 * Created by peter joseph on 12/18/2015.
 */
$(document).ready(function(){
    hideSpinner();
    hideSpinner2();
    hideSpinner3();
    hideSpinner4();
   // checkInternet();
    
    $(window).on('load resize', function () {

        var windowsHeight=$(window).height();

        var documentHeight=$(document).height();

        var imgHeight = $('.intro-pic img').height();

        //console.log(windowsHeight);

        //console.log(documentHeight);

        $('.intro-pic').css('height',imgHeight+'px')

        $('.login-page').css('height',windowsHeight+'px')

        $('.login-container').css('height',windowsHeight+'px')

        $('.walkthrough-container').css('height',windowsHeight+'px')

        });
    $('body').on('click','.thumb-icon',function () {
        $('.left').toggleClass('widthopen')
        $('.right').toggleClass('widthopen')

    });
    $('body').on('click','.close-pop',function () {
        hideSpinner2();
    });
    $('body').on('click','.close-spinner',function () {
        hideSpinner4();
    });

    if (window.innerWidth > 768) {

        if($("#full-content").hasClass("isOpen")){

            $("#side-menu-wrapper").css({'left':'-350px'});

            $(".header").css({'right':'0px'});

            $("#full-content").removeClass('isOpen');

        }

    }
    $('body').on('click','.menu-btn .toggle-bar',function () {

        $("#full-content").toggleClass('isOpen');

        $("#side-menu-wrapper").toggleClass('isLeft');

    });
    $('body').on('click','.menu2',function () {
        menuSettings();
    })

});
// custom ramnadh 
menuSettings = function(){
    $('.menu-dropdown').toggleClass('hasheight');

        $('.categories-body').toggleClass('hasopacity');



        if($('.menu-dropdown').hasClass('hasheight'))

        {
            var divHeight=$('.menu-dropdown ul').height();

            $('.menu-dropdown').css({'height':divHeight+'px','opacity':1})

        }

        else

        {
            $('.menu-dropdown').css({'height':'0px','opacity':0})

        }
}
showSidemenu = function(){
    showSpinner3();
    $("#full-content").toggleClass('isOpen');
    $("#side-menu-wrapper").toggleClass('isLeft');
}
hideSideMenu = function(){
    hideSpinner3();
    $("#full-content").removeClass('isOpen');
    $("#side-menu-wrapper").removeClass('isLeft');
}
skipIntro = function(){
    setTimeout(explode, 1000);
    
}
explode = function(){
    window.location.href = "walkthrough.html";
}
detailsPage = function(){
    window.location.href = "service-details1.html";
}
detailsPageMain = function(){
    window.location.href = "service-details2.html";
}
profilePage = function(){
    window.location.href = "profile.html";
}
menuPage = function(){
    window.location.href = "menu.html";
}
menuTwoPage = function(){
    window.location.href = "menu2.html";
}
showSpinner = function(){
    $('.spinnerBg').show();
    $('.spinner').show();
}
hideSpinner = function(){
    $('.spinnerBg').hide();
    $('.spinner').hide();
}

showSpinner2 = function(){
    $('.spinnerBg2').show();
    $('.spinner2').show();
}
hideSpinner2 = function(){
    $('.spinnerBg2').hide();
    $('.spinner2').hide();
}

showSpinner4 = function(){
    $('.spinnerBg4').show();
    $('.spinner4').show();
}
hideSpinner4 = function(){
    $('.spinnerBg4').hide();
    $('.spinner4').hide();
}
hideSpinner3 = function(){
    $('.spinnerBg3').hide();
}
showSpinner3 = function(){
    $('.spinnerBg3').show();
}
shareApp = function(){
    window.plugins.socialsharing.share('Have a look at this app nice app Na3eeman', 'Na3eeman App', null, 'https://play.google.com/store/apps/details?id=com.na3eeman.app');
}