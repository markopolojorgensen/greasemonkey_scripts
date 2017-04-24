// ==UserScript==
// @name         Hide Liquipedia tournament results
// @namespace    https://github.com/markopolojorgensen/greasemonkey_scripts
// @version      3.22
// @description  I'm sick of using my hands on my monitor to try to hide hero picks / match / bracket results when I try to find the replay links for big tournaments.
// @author       Mark Jorgensen
// @match        http://wiki.teamliquid.net/*
// @grant        none
// ==/UserScript==

// TODO: use cookies to remember what a user has already unhidden for a given page/tournament.
// TODO: clicking on "hide results" button multiple times should not result in multiple unhide buttons for the same content.

//// util

function flash(el) {
    $(el).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
}

//// selectors

function prizePoolWinners() {
    return $('table.prizepooltable td:last-child:not(.prizepooltabletoggle) > *');
}

function individualGamePopups() {
    return $('.bracket-popup-body-match > *');
}

//// buttons

function unhideSiblingsButtonHtml() {
    return '<button class="hidden-results-siblings">unhide</button>';
}

function prepSiblings(els) {
    els.hide();
    els.before(unhideSiblingsButtonHtml());
}

function unhideSiblings() {
    $(this).siblings().show();
    $(this).hide(); // removes 'unhide' button
}

function hideAllResults() {
    console.log('throwing tournament');

    prepSiblings(prizePoolWinners());
    prepSiblings(individualGamePopups());

    // register all click listeners in one fell swoop
    $('.hidden-results-siblings').click(unhideSiblings);

    console.log('SeemsGood');
}


(function() {
    'use strict';
    $('#firstHeading').prepend('<button id="hide-all-results-button">Hide All Results</button>');
    $('#hide-all-results-button').click(hideAllResults);
})();
