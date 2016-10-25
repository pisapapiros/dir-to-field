
function querySt(ji) {
    hu = window.location.search.substring(1);
    gy = hu.split("&");

    for (i=0; i < gy.length; i++) {
        ft = gy[i].split("=");
        if (ft[0] == ji) {
            return ft[1];
        }
    }
}

chrome.storage.sync.get({
	formField: "",
}, function(items) {
	var formFieldElement = document.getElementById(items.formField);
	var paramName = items.formField;
	if (paramName) {
		var paramValue = querySt(paramName);
		if (formFieldElement && paramValue) {
			formFieldElement.value = paramValue.replace("%20", " ");
		}
	}				
});

