'use strict';(function(){CodeMirror.keyMap["default"]["Alt-Up"]="swapLineUp";CodeMirror.keyMap["default"]["Alt-Down"]="swapLineDown";CodeMirror.keyMap.pcDefault["Ctrl-Space"]="autocomplete";CodeMirror.keyMap.macDefault["Alt-Space"]="autocomplete";CodeMirror.commands.backOrClose=function(a){var b=a.execCommand("clearSearch");if(!0===b)return b;a.execCommand("close")};CodeMirror.keyMap["default"].Esc="backOrClose";CodeMirror.keyMap["default"]["Alt-Pause"]="nextTheme";CodeMirror.commands.intelligentTab=
function(a){if(a.getOption("indentByTab")){var b=a.getCursor("head"),e=a.getCursor("anchor");a.operation(function(){for(var d=Math.max(b.line,e.line),c=Math.min(b.line,e.line);c<=d;c++)a.indentLine(c,"smart")})}else{if(a.getOption("indentWithTabs"))return CodeMirror.Pass;var d=Array(a.getOption("indentUnit")+1).join(" ");a.replaceSelection(d)}};CodeMirror.keyMap["default"].Tab="intelligentTab"})();
