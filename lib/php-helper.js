'use babel';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
       'php-helper:gen_nco_post': () => this.gen_nco_post()
      ,'php-helper:get_nco_get': () => this.get_nco_get()
      ,'php-helper:gen_nco_request': () => this.gen_nco_request()
      ,'php-helper:get_class_variables': () => this.get_class_variables()
      ,'php-helper:get_constructor': () => this.get_constructor()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {

  },

  gen_nco(type) {
     var editor = atom.workspace.getActiveTextEditor();
     var s_text = editor.getSelectedText().split("\n");
     if (s_text.length > 0) {
        for (var i = 0; i < s_text.length; i++) {
            var i_text = s_text[i].replace("$", "");
            editor.insertText("$" + i_text + " = isset($_" + type + "['" + i_text + "']) ? $_" + type + "['" + i_text + "'] : '';\n");
        }
     } else {
        editor.insertText("$variable = isset($_" + type + "['']) ? $_" + type + "[''] : '';\n");
     }
  },

  get_nco_get() {
     this.gen_nco('GET');
  },

  gen_nco_post() {
     this.gen_nco('POST');
  },

  gen_nco_request() {
     this.gen_nco('REQUEST');
  },

  get_class_variables() {
     var editor = atom.workspace.getActiveTextEditor();
     var s_text = editor.getSelectedText().split("\n");
     if (s_text.length > 0) {
        for (var i = 0; i < s_text.length; i++) {
            editor.insertText("private $" + s_text[i].replace("$", "") + ";\n");
        }
     } else {
        editor.insertText("private $variable;\n");
     }
  },

  get_constructor() {
     var editor = atom.workspace.getActiveTextEditor();
     var text_to_add = "\t/**\n"
 	                  + "\t* Constructor\n"
 	                  + "\t*/\n"
 	                  + "\tpublic function __construct() {\n"
 	                  + "\t\tif (func_num_args() > 0 && func_num_args() < 1) {\n"
 	                  + "\t\t\treturn new self();\n"
 	                  + "\t\t} else if (func_num_args() == 1) {\n"
 	                  + "\t\t\t$args = func_get_args();\n"
    	               + "\t\t}\n"
                     + "\t}\n";
      editor.insertText(text_to_add);
  }

};
