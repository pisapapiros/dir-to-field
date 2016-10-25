var defaultDirectory = "/home";
var defaultFormURL = "https://abc.com";
var defaultFormField = "input_name";

// Saves options to chrome.storage
function save_options() {
  var directory = document.getElementById('directory').value;
  var formURL = document.getElementById('form-url').value;
  var formField = document.getElementById('form-field').value;
  chrome.storage.sync.set({
    directory: directory,
	formURL: formURL,
    formField: formField
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    directory: defaultDirectory,
  	formURL: defaultFormURL,
  	formField: defaultFormField
  }, function(items) {
    document.getElementById('directory').value = items.directory;
    document.getElementById('form-url').value = items.formURL;
    document.getElementById('form-field').value = items.formField;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);