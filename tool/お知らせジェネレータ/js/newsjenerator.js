$(function() {
  'use strict';

  var bodyText = '';
  var bodySelectionStart = 0;
  var bodySelectionEnd = 0;
  var bodySelectionColor = 'ffffff';

  // スクロールバー初期化
  $('#body').mCustomScrollbar({
    theme: 'light-thick',
    scrollbarPosition: 'outside'
  });

  // カラーピッカー初期化
  $('#input_bodycolor').spectrum({
    color: '#f00',
    showInput: true,
    preferredFormat: 'hex',
    showPalette: true,
    showSelectionPalette: true,
    clickoutFiresChange: true,
    cancelText: 'キャンセル',
    chooseText: '選択',
    palette: [
      ['#000', '#444', '#666', '#999', '#ccc', '#eee', '#f3f3f3', '#fff'],
      ['#f00', '#f90', '#ff0', '#0f0', '#0ff', '#00f', '#90f', '#f0f'],
      ['#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc'],
      ['#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd'],
      ['#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0'],
      ['#c00', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3d85c6', '#674ea7', '#a64d79'],
      ['#900', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#0b5394', '#351c75', '#741b47']
    ],
    change: function(color) {
      editColor(color.toHexString().substr(1));
    },
    show: function() {
      $('#input_body').prop('disabled', true);
    },
    hide: function() {
      $('#input_body').prop('disabled', false);
    }
  });

  // カラーピッカードラッグ
  $('#input_bodycolor').on('dragstop.spectrum', function(e, color) {
    editColor(color.toHexString().substr(1));
  });

  // カラーピッカー選択
  $('.sp-choose').click(function() {
    updateBodyInfo();
  });

  // カラーピッカーキャンセル
  $('.sp-cancel').click(function() {
    var inputBody = $('#input_body');
    $('#mCSB_1_container').html(textEdit(bodyText));
    inputBody.val(bodyText);
    inputBody.prop('selectionStart', bodySelectionStart);
    inputBody.prop('selectionEnd', bodySelectionEnd);
  });

  // タイトル変更
  $('#input_title').keyup(function() {
    $('#title').html(textEdit(this.value));
  });

  // サブタイトル変更
  $('#input_subtitle').keyup(function() {
    $('#subtitle').html(textEdit(this.value));
  });

  // 背景画像変更
  $('#input_bgimg').change(function() {
    if (this.files.length !== 0) {

      var fileReader = new FileReader();

      if (!this.files[0].type.match(/image/)) {
        alert('画像を選択してください');
        return;
      }

      $(fileReader).load(function() {
        $('#screen').css('backgroundImage', 'url(' + this.result + ')');
        $('#input_bgimg_clear').css('display', 'inline');
      });

      fileReader.readAsDataURL(this.files[0]);
    } else {
      $('#screen').css('backgroundImage', '');
      $('#input_bgimg_clear').css('display', 'none');
    }
  });

  // 背景画像クリア
  $('#input_bgimg_clear').click(function() {
    $('#screen').css('backgroundImage', '');
    $('#input_bgimg_clear').css('display', 'none');
    $('#input_bgimg').prop('type', 'text');
    $('#input_bgimg').prop('type', 'file');
  });

  // 背景サイズ変更
  $('input[name="input_bgimg_size"]:radio').change(function() {

    var screen = $('#screen');
    var shadow = $('#shadow');
    var frame1 = $('#frame1');
    var bgImgDescription = $('#input_bgimg_description');
    var inputBody = $('#input_body');

    switch (this.value) {
      case 'ipad':
        screen.css('width', '512px');
        screen.css('height', '683px');
        screen.css('backgroundSize', '512px 683px');
        shadow.css('width', '512px');
        shadow.css('height', '683px');
        frame1.css('margin', '5px 40px 64px');
        inputBody.css('height', '290px');
        bgImgDescription.html('背景画像 <small>(512x683, 1024x1366, 2048x2732 など)</small>');

        break;
      case 'iphone':
        screen.css('width', '450px');
        screen.css('height', '800px');
        screen.css('backgroundSize', '450px 800px');
        shadow.css('width', '450px');
        shadow.css('height', '800px');
        frame1.css('margin', '70px 9px 64px');
        inputBody.css('height', '408px');
        bgImgDescription.html('背景画像 <small>(450x800, 750x1334 など)</small>');
        break;
      default:
        break;
    }
  });

  // バナー画像変更
  $('#input_bannerimg').change(function() {
    if (this.files.length !== 0) {

      var fileReader = new FileReader();

      if (!this.files[0].type.match(/image/)) {
        alert('画像を選択してください');
        return;
      }

      $(fileReader).load(function() {
        $('#banner').css('backgroundImage', 'url(' + this.result + ')');
        $('#banner').css('display', 'block');
        $('#body').css('height', '344px');
        $('#input_bannerimg_clear').css('display', 'inline');
      });

      fileReader.readAsDataURL(this.files[0]);
    } else {
      $('#banner').css('backgroundImage', '');
      $('#banner').css('display', 'none');
      $('#body').css('height', '437px');
      $('#input_bannerimg_clear').css('display', 'none');
    }
  });

  // バナー画像クリア
  $('#input_bannerimg_clear').click(function() {
    $('#banner').css('backgroundImage', '');
    $('#banner').css('display', 'none');
    $('#body').css('height', '437px');
    $('#input_bannerimg_clear').css('display', 'none');
    $('#input_bannerimg').prop('type', 'text');
    $('#input_bannerimg').prop('type', 'file');
  });

  // 本文変更
  $('#input_body').keyup(function() {
    updateBodyInfo();
    $('#mCSB_1_container').html(textEdit(bodyText));
    $('#input_bodycolor').spectrum('set', getSelectionColor());
  });

  // 本文クリック
  $('#input_body').click(function() {
    updateBodyInfo();
    $('#input_bodycolor').spectrum('set', getSelectionColor());
  });

  // 本文フォーカスアウト
  $('#input_body').focusout(function() {
    updateBodyInfo();
  });

  // 現在のカーソルの色を取得
  function getSelectionColor() {

    var selectionColor = 'ffffff';
    var inputBody = $('#input_body');

    bodyText.substring(0, bodySelectionEnd).replace(/\[([0-9a-f]{6})\]/ig, function(a, b) {
      selectionColor = b;
    });

    return selectionColor;
  }

  // 現在の選択範囲の色を変更
  function editColor(color) {

    var inputBody = $('#input_body');
    var text = '';

    if (bodySelectionStart !== bodySelectionEnd) {
      if (bodySelectionEnd - bodySelectionStart === 8 && bodyText.substring(bodySelectionStart, bodySelectionEnd).match(/\[[0-9a-f]{6}\]/)) {
        text = bodyText.substring(0, bodySelectionStart) +
          '[' + color + ']' +
          bodyText.substring(bodySelectionStart, bodySelectionEnd).replace(/\[[0-9a-f]{6}\]/ig, '') +
          bodyText.substr(bodySelectionEnd);
      } else {
        text = bodyText.substring(0, bodySelectionStart) +
          '[' + color + ']' +
          bodyText.substring(bodySelectionStart, bodySelectionEnd).replace(/\[[0-9a-f]{6}\]/ig, '') +
          '[' + bodySelectionColor + ']' +
          bodyText.substr(bodySelectionEnd);
      }
    } else {
      text = bodyText.substring(0, bodySelectionStart) +
        '[' + color + ']' +
        bodyText.substr(bodySelectionEnd);
    }

    $('#mCSB_1_container').html(textEdit(text));
    inputBody.val(text);

  }

  // 本文の入力情報を更新
  function updateBodyInfo() {

    var inputBody = $('#input_body');
    var selectionStartAround = '';
    var selectionEndAround = '';

    bodyText = inputBody.val();
    bodySelectionStart = inputBody.prop('selectionStart');
    bodySelectionEnd = inputBody.prop('selectionEnd');
    bodySelectionColor = getSelectionColor();

    if (bodySelectionStart === bodySelectionEnd && bodyText.substring(0, bodySelectionStart).match(/\[[0-9a-f]{6}\]$/i)) {
      selectionStartAround = bodyText.substring(Math.max(0, bodySelectionStart - 8), Math.min(bodyText.length, bodySelectionStart + 7));
    } else {
      selectionStartAround = bodyText.substring(Math.max(0, bodySelectionStart - 7), Math.min(bodyText.length, bodySelectionStart + 7));
    }

    if (bodySelectionStart === bodySelectionEnd && bodyText.substr(bodySelectionEnd).match(/^\[[0-9a-f]{6}\]/i)) {
      selectionEndAround = bodyText.substring(Math.max(0, bodySelectionEnd - 7), Math.min(bodyText.length, bodySelectionEnd + 8));
    } else {
      selectionEndAround = bodyText.substring(Math.max(0, bodySelectionEnd - 7), Math.min(bodyText.length, bodySelectionEnd + 7));
    }

    if (selectionStartAround.match(/\[[0-9a-f]{6}\]/i)) {
      bodySelectionStart = bodyText.substring(0, bodySelectionStart).lastIndexOf('[');
    }
    if (selectionEndAround.match(/\[[0-9a-f]{6}\]/i)) {
      bodySelectionEnd = bodySelectionEnd + bodyText.substr(bodySelectionEnd).indexOf(']') + 1;
    }
  }

  // テキストを編集
  function textEdit(text) {

    var editFlag = false;

    // カラーコード置換
    text = text.replace(/\[([0-9a-f]{6})\]/ig, function(a, b) {
      if (editFlag) {
        return '</span><span style="color:#' + b + ';">';

      } else {
        editFlag = true;
        return '<span style="color:#' + b + ';">';
      }
    });
    text = editFlag ? text + '</span>' : text;

    // エスケープ置換
    text = text.replace(/\\\]/g, ']');

    // 改行置換
    text = text.replace(/\r\n|\r|\n/g, '<br />');

    return text;
  }

  // 初期値反映
  $('#title').html(textEdit($('#input_title').val()));
  $('#subtitle').html(textEdit($('#input_subtitle').val()));
  $('#mCSB_1_container').html(textEdit($('#input_body').val()));
  bodyText = $('#input_body').val();

});