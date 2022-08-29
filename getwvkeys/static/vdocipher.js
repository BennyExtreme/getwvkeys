/*
 *  This file is part of the GetWVKeys project (https://github.com/GetWVKeys/getwvkeys)
 *  Copyright (C) 2022 Notaghost, Puyodead1 and GetWVKeys contributors
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const mainForm = document.querySelector(".form-container>form");
const formButton = mainForm.querySelector('input[type="submit"]');

mainForm.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();
  formButton.disabled = true;
  formButton.value = "Sending...";
  server_request();
}

async function keycount() {
  async function key_count() {
    const apiKey = getCookie("api_key");
    const response = await fetch("/count", {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
      },
    });
    return await response.text();
  }
  const key_count_value = await key_count();
  document.getElementById("key-count").innerText = key_count_value;
}
keycount();

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

async function server_request() {
  async function server_request_data() {
    document.getElementById("demo").innerHTML = "Sending Request";
    const dicted = {
      pssh: document.getElementById("pssh").value,
      token: document.getElementById("token").value,
      cache: document.getElementById("cache").checked,
      web: true,
    };
    const apiKey = getCookie("api_key");
    const response = await fetch("/vdocipher", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(dicted),
    });
    return await response.text();
  }
  const response = await server_request_data();
  const elem = document.getElementById("demo");
  setInnerHTML(elem, response);

  formButton.disabled = false;
  formButton.value = "Send";
}

const setInnerHTML = function (elm, html) {
  elm.innerHTML = html;
  Array.from(elm.querySelectorAll("script")).forEach((oldScript) => {
    const newScript = document.createElement("script");
    Array.from(oldScript.attributes).forEach((attr) =>
      newScript.setAttribute(attr.name, attr.value)
    );
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
};

function parseUnixTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}