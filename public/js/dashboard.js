//Resize browser width to see what happens
//----------------------------------------------------------
var MAX_WIDTH = 1000;
var MENU_CLASS = "menu-hide";
var menu_width;
var statusHitMenu = false;
var not_loaded = false;
var statusMenu = "open";//checa se o menu está aberto ou não
var CLASS_MENU_RETRAIDO = "menu-retraido";
//----------------------------------------------------------
jQuery(document).ready(
function ()
{
    initMenu();
    $(window).resize(resizeWindow);
    resizeWindow();

    //----------------------------
    $(".button-actions").click(function(){
        if($(this).hasClass('active'))
        {
            $(".boxWrapperActions-wrapper").removeClass('active');
            $(".boxWrapperActions-wrapper").stop(true,true).slideUp(300);
            $(".button-actions").removeClass('active');
        }
        else
        {
            $(".boxWrapperActions-wrapper").addClass('active');
            $(".boxWrapperActions-wrapper").stop(true,true).slideDown(300);
            $(".button-actions").addClass('active');
        }

        return false;
    });

    $("#bt_item_user").click(function(){
        if($(this).hasClass('active'))
        {
            $("#bt_item_user").removeClass('active');
            $(".boxOptions-item_user .boxOptionsWrapper-container").stop(true,true).fadeOut(300);
        }
        else
        {
            $("#bt_item_user").addClass('active');
            $(".boxOptions-item_user .boxOptionsWrapper-container").stop(true,true).fadeIn(300);
        }

        return false;
    });
});



function retrairMenu ()
{
    var _timer = 300;

    $('body').addClass(CLASS_MENU_RETRAIDO);
    var _anim_01 = {left:-280,opacity:0};

    $("#menu").stop(true,true).animate(_anim_01,_timer);
    $("#hit-menu").stop(true,true).show();
    $('#header .button-menu-mobile').stop(true,true).show();
    $('#header .button-menu-mobile').stop(true,true).animate({opacity:1},_timer);
    $("#header .menu-modulos .menu-modulosInner").stop(true,true).animate({paddingLeft:0},_timer);
    $("#conteudo .conteudo-inner").stop(true,true).animate({paddingLeft:0},_timer);

    hideBackgroundMenuMobile();
}

function expandirMenu ()
{
    $('body').removeClass(CLASS_MENU_RETRAIDO);
    var _anim_01 = {left:0,opacity:1};

    $("#menu").stop(true,true).animate(_anim_01);
    $("#hit-menu").stop(true,true).hide();
    $("#conteudo .conteudo-inner").stop(true,true).animate({paddingLeft:260});

    $('#header .button-menu-mobile').stop(true,true).animate({opacity:0},function(){
        $('#header .button-menu-mobile').stop(true,true).hide();
    });
    $("#header .menu-modulos .menu-modulosInner").stop(true,true).animate({paddingLeft:280});

    if(($(window).width()<=768))
    {
        showBackgroundMenuMobile ();
    }

}

function resizeWindow ()
{
    var _w = $(window).width();


    if(_w > MAX_WIDTH)//expandir menu
    {
        if($('body').hasClass(CLASS_MENU_RETRAIDO))
        {
            if(statusMenu != "closed")
            {
                expandirMenu ();
            }
        }
        if(statusMenu == "open_by_menu_mobile")
        {
            statusMenu = "open";
        }
    }
    else//retrair menu
    {
        if(!$('body').hasClass(CLASS_MENU_RETRAIDO))
        {
            if(statusMenu != "open_by_menu_mobile")
            {
                retrairMenu ();
            }
        }
    }

    if(_w >= 768)
    {
        if($('.menu-mobile-background').hasClass("on"))
        {
            hideBackgroundMenuMobile ();
        }
    }
    else
    {
        if(statusMenu == "open_by_menu_mobile")
        {
           showBackgroundMenuMobile();
        }
    }
}

function initMenu ()
{
    menu_width = $("#menu .menu").width();

    $(".menu-back").click(function(){

        var _pos = $(".menu-slider").position().left + menu_width;
        var _obj = $(this).closest(".submenu");

        $(".menu-slider").stop().animate({left: _pos}, 300, function ()
        {
            _obj.hide();
        });

        return false;
    });

    $(".menu-anchor").click(function(){
        var _d = $(this).data('menu');
        $(".submenu").each(function(){

            var _d_check = $(this).data('menu');

            if(_d_check == _d)
            {
                $(this).show();
                var _pos = $(".menu-slider").position().left - menu_width;

                $(".menu-slider").stop(true,true).animate({left: _pos}, 300);
                return false;
            }
        });

        return false;
    });

   $(".header-controlMenuButton").click(function()
    {
        statusMenu = "closed";
        retrairMenu ();
        return false;
    });

    $(".button-menu-mobile").click(function(){
        statusMenu = "open_by_menu_mobile";
        expandirMenu();
        return false;
    });

    $(".menu-mobile-background").mousedown(function(){
        retrairMenu();
    });

    $('#hit-menu').mouseenter(function(){
        statusHitMenu = true;
        expandirMenu();
    });

    $('#menu').mouseleave(function(){
        if(statusHitMenu)
        {
            statusHitMenu = false;
            retrairMenu();
        }
    });

}

function hideBackgroundMenuMobile ()
{
    $('.menu-mobile-background').removeClass("on");
    $('.menu-mobile-background').stop(true,true).animate({opacity:0},function(){
        $('.menu-mobile-background').stop(true,true).hide();
        $('.menu-mobile-background').removeAttr('style');
    });
}

function showBackgroundMenuMobile ()
{
    $('.menu-mobile-background').addClass("on");
    $('.menu-mobile-background').stop(true,true).show();
    $('.menu-mobile-background').stop(true,true).animate({opacity:1});
}