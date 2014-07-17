/**
 * A JavaScript tool for quickly changing the color in monochrome images
 * http://slavchoslavchev.com
 * https://github.com/slavsan
 *
 * Copyright 2014, Slavcho Slavchev
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function( global ) {
  "use strict";

  var doc = global.document;
  var img,
    contexts = [],
    main = doc.querySelector('#monochrome-edit-main'),
    table = main.querySelector('table');

  //function decimalToHex( dec ) {
  //  return dec.toString(16);
  //}

  function hexToDecimal( hex ) {
    return parseInt(hex, 16);
  }

  function hexToRGB( hex ) {
    var i, len, rgb = [];
    if (hex.charAt(0) === '#') hex = hex.substr(1);           // remove first # letter
    if (hex.length !== 3 && hex.length !== 6) return false;   // check if 6 or 3 chars
    // if 3 chars -> to 6 chars
    if (hex.length === 3) {
      var fullHex = '';
      for (i = 0, len = hex.length; i < len; i += 1) {
        fullHex += hex[i] + hex[i];
      }
      hex = fullHex;
    }
    // parse 6 chars
    for (i = 0; i < 6; i += 2) {
      rgb.push(hexToDecimal(hex[i] + hex[i+1]));
    }
    // if error -> return false
    for (i = 0, len = rgb.length; i < len; i += 1) {
      if (rgb[i] < 0 && rgb[i] > 255) return false;
    }
    return rgb;
  }

  //function rgbToHex( red, green, blue ) {
  //  var r = decimalToHex(red);
  //  var g = decimalToHex(green);
  //  var b = decimalToHex(blue);
  //
  //  if (r === '0') r = '00';
  //  if (g === '0') g = '00';
  //  if (b === '0') b = '00';
  //
  //  return '#' + r + g + b;
  //}

  function changeImageColor( ctx, rgbArray ) {
    var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

    var pix = imgData.data;

    for (var i = 0, n = pix.length; i < n; i += 4) {
      if (pix[i + 3] !== 0) {
        pix[i]   = rgbArray[0];
        pix[i+1] = rgbArray[1];
        pix[i+2] = rgbArray[2];
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }

  function addListItem( file ) {
    var tr, td1, td2, td3, link, img, canvas, ctx, infoHeight, infoWidth, infoName, reader = new FileReader();
    tr = doc.createElement('tr');
    link = doc.createElement('a');
    td1 = doc.createElement('td');
    td2 = doc.createElement('td');
    td3 = doc.createElement('td');
    img = doc.createElement("img");
    infoHeight = doc.createElement('div');
    infoWidth = doc.createElement('div');
    infoName = doc.createElement('div');
    canvas = doc.createElement('canvas');
    ctx = canvas.getContext('2d');

    contexts.push(ctx);

    reader.readAsDataURL(file);

    reader.onloadstart = function() {
      //console.log('on load start');
    };
    reader.onload = function() {
      //console.log('on load');
    };
    reader.onprogress = function() {
      //console.log('on progress');
    };
    reader.onloadend = function() {
      img.src = reader.result;
      canvas.width = img.width;
      canvas.height = img.height;
      link.download = file.name;
      link.href = canvas.toDataURL();
      ctx.drawImage(img, 0, 0);
      td1.appendChild(img);
      td2.appendChild(canvas);
      td2.appendChild(link);
      infoHeight.textContent = "height: " + canvas.height + "px";
      infoWidth.textContent = "width: " + canvas.width + "px";
      infoName.textContent = "name: " + file.name;
      td3.appendChild(infoHeight);
      td3.appendChild(infoWidth);
      td3.appendChild(infoName);
      td3.className = 'info';
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      table.appendChild(tr);
    };
  }

  doc.querySelector('#add-image').onchange = function( e ) {
    for (var i = 0; i < e.target.files.length; i += 1) {
      var file = e.target.files[i];
      console.log('CHANGE: %o', file);
      addListItem(file);
    }
  };

  doc.querySelector('#change-color').onchange = function( e ) {
    console.log('CHANGE: %o', e.target.value);
    var rgb = hexToRGB(e.target.value);
    for (var i = 0; i < contexts.length; i += 1) {
      changeImageColor(contexts[i], rgb);
    }
  };

}( window ));
