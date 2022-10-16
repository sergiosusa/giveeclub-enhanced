// ==UserScript==
// @name         Givee Club Enhanced
// @namespace    https://sergiosusa.com
// @version      0.1
// @description  This script enhanced the famous raffle site Givee Club with some extra features.
// @author       Sergio Susa (sergio@sergiosusa.com)
// @match        https://givee.club/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=givee.club
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    try {
        let giveeClubEnhanced = new GiveeClubEnhanced();
        giveeClubEnhanced.render();
    } catch (exception) {
        alert(exception);
    }
})();

function GiveeClubEnhanced() {

    this.rendererList = [
        new iCalcRaffleGenerator(),
    ];

    this.globalRenderList = [
    ];

    this.globalRender = function () {
        return this.globalRenderList.map(renderer => renderer.render());
    }

    this.render = () => {
        let renderer = this.findRenderer();
        if (renderer) {
            renderer.render();
        }
        this.globalRender();
    }

    this.findRenderer = () => {
        return this.rendererList.find(renderer => renderer.canHandleCurrentPage());
    };
}

function Renderer() {
    this.handlePage = "";

    this.canHandleCurrentPage = () => {
        return null !== document.location.href.match(this.handlePage);
    };

    this.showAlert = (text) => {
        alert(text);
    }
}

function iCalcRaffleGenerator() {
    Renderer.call(this);
    this.handlePage = /https:\/\/givee\.club\/(es|en)$/g;

    this.render = () => {

        document.querySelectorAll(".event-card").forEach((eventCard) => {
            const countdown = eventCard.querySelector(".event-timeleft");
            if (countdown !== null) {
                const seconds = parseInt(countdown.getAttribute("data-timeleft"));
                const date = new Date();
                date.setSeconds(date.getSeconds() + seconds);
                eventCard.parentElement.innerHTML =
                    '<div style="text-align:center;background-color:#454e5d;padding-top: 5px;padding-bottom: 5px;">' +
                    '<span calc-date="' + date + '" class="calendar-link"><i style="cursor:pointer;" class="glyphicon glyphicon-calendar"></i>' +
                    '</span>' +
                    '</div>' + eventCard.parentElement.innerHTML;
            } else {
                eventCard.parentElement.innerHTML =
                    '<div style="text-align:center;background-color:#454e5d;padding-top: 15px;padding-bottom: 15px;">' +
                    '</span>' +
                    '</div>' + eventCard.parentElement.innerHTML;
            }
        });

        this.injectOnClick();
    };

    this.injectOnClick = () => {

        const calendars = document.querySelectorAll(".calendar-link");

        for (var i = 0; i < calendars.length; i++) {
            calendars[i].addEventListener('click', this.generateCsv);
        }
    };

    this.generateCsv = (event) => {
        let currentCalendar = event.currentTarget; 
        var startDate = new Date(currentCalendar.getAttribute("calc-date"));
        var endDate = new Date(startDate.getTime() + 30 * 60000);
        var csvText = "Subject,Start Date,Start Time,End Date,End Time,All Day Event\n" +
            "Givee.club / " + currentCalendar.parentElement.parentElement.querySelector(".event-title").innerText + "," +
            startDate.toLocaleString() + "," + 
            endDate.toLocaleString() + ",FALSE\n";
        window.open("data:text/csv;charset=utf8," + escape(csvText));
    };
}

iCalcRaffleGenerator.prototype = Object.create(Renderer.prototype);