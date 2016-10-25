function DirectoryElement (addRowCall) {
	var addRowParamsByQuotes = addRowCall.text.match(/".*?"/g);
	var addRowParamsByAlphanumeric = addRowCall.text.match(/[\w\.\% ]+/g);
	
	this.name = addRowParamsByQuotes[1].replace(/^"(.*)"$/, '$1');
	this.date = moment(addRowParamsByQuotes[3].replace(/^"(.*)"$/, '$1'), "DD/MM/YYYY HH:mm:SS").toDate();
	this.size = addRowParamsByQuotes[2];
	this.type = addRowParamsByAlphanumeric[3];	
}

DirectoryElement.prototype.isDirectory = function() {
    return this.type == 1;
};

DirectoryElement.prototype.toString = function() {
    return this.name + " (" + this.date + ")";
};


document.addEventListener('DOMContentLoaded', function() {
	
	// Get settings
	chrome.storage.sync.get({
		directory: "",
		formURL: "",
		formField: "",
	}, function(items) {
		var directory = items.directory;	
		var formURL = items.formURL;	
		var formField = items.formField;	
		var divStatus = document.getElementById('status');
		
		if (!directory) {
			divStatus.textContent ="No directory found in settings.";
			return;
		}
					
		if (!formURL) {
			divStatus.textContent ="No URL found in settings.";
			return;
		}
		
		if (!formField) {
			divStatus.textContent ="No form field found in settings.";
			return;
		}
		
		// Get directory
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", "file://" + directory, false);
		xmlhttp.send();
		
		// Response is a string with HTML content
		// Create DOM elements to manipulate it with ease
		parser = new DOMParser();
		htmlDoc = parser.parseFromString(xmlhttp.response, "text/html");
		// Directory elements needs to be parsed from some script tags
		var scriptTags = htmlDoc.getElementsByTagName('script');

		// Loop over each directory element and save the newest
		var newestDirectory;
		for (var i = 6; i < scriptTags.length-1; i++) {
			var addRowCall = scriptTags[i];
			var directoryElement = new DirectoryElement(addRowCall);
			if (directoryElement.isDirectory()) {
				if (!newestDirectory) {
					newestDirectory = directoryElement;
				}
				if (directoryElement.date >= newestDirectory.date) {
					newestDirectory = directoryElement;
				}		
			}
		}
		
		// Build URL with params
		var params = "";
		if (newestDirectory) {
			console.log("Newest directory found: " + newestDirectory.toString());
			params = "?" + formField + "=" + newestDirectory.name;		
		}
		
		// Open form tab
		if (formURL) {
			var newURL = formURL + params;

			chrome.tabs.create({url: newURL}, function(tab) {});			
		}	
	});	
});
