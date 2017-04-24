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
// TODO: after hiding results users should not be able to tell how many games were played in a match (e.g. bo3/bo5 should show 3 or 5 games)
// TODO: dynamically figure out what information the user already knows to automatically reveal obvious results
// TODO: automatically re-hide popup when user clicks unhide on bracket team info
// TODO: add the ability to unhide the match score summary (i.e. '??' -> '2-0' button)

//// util

function flash(el) {
    $(el).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
}

function textNodeDescendants(els) {
    return els.contents().filter(function() {
        return this.nodeType === 3; // text
    });
}


//// selectors

function prizePoolWinners() {
    return $('table.prizepooltable td:last-child:not(.prizepooltabletoggle) > *');
}

function individualGamePopups() {
    return $('.bracket-popup-body-match > *');
}

function matchesGameCountText() {
    return textNodeDescendants($('tr.match-row td:not(.matchlistslot)'));
}

// FIXME: two sets of question marks where there should be one
function groupResults() {
    return $('table.grouptable td:not(.grouptableslot)').contents();
}

function bracketTeamInfo() {
    return $('.bracket-team-top .team-template-team-bracket,.bracket-team-bottom .team-template-team-bracket');
}

function bracketMatchScore() {
    return $('.bracket-score');
}


//// sibling hiding

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


//// text hiding

function hideableSingleDivHtml() {
    return '<div class="hidden-results-self"></div>';
}

function permanentMysteryHtml() {
    // b tag to make loser bold as well
    return '<p class="mystery-results"><b>??</b></p>';
}

function prepSelves(els) {
    els.wrap(hideableSingleDivHtml());
}

// TODO: support arbitrary html (button or text) insertion
function hideSelves() {
    els = $('div.hidden-results-self');
    els.hide();
    els.before(permanentMysteryHtml());
}





function hideAllResults() {
    console.log('throwing tournament');

    prepSiblings(prizePoolWinners());
    prepSiblings(individualGamePopups());
    prepSiblings(bracketTeamInfo());

    // register all click listeners in one fell swoop
    $('.hidden-results-siblings').click(unhideSiblings);

    prepSelves(matchesGameCountText());
    prepSelves(groupResults());
    // prepSelves(bracketMatchScore());
    hideSelves();

    bracketMatchScore().text('');
    bracketMatchScore().append('<b>??</b>');

    $('td.matchlistslot').css('background-color', '#cfc');

    console.log('SeemsGood');
}


(function() {
    'use strict';
    $('#firstHeading').prepend('<button id="hide-all-results-button">Hide All Results</button>');
    $('#hide-all-results-button').click(hideAllResults);
})();
