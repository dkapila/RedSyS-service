/* MAIN API FUNCTIONS */

exports.onInit = function (doc) {
	console.log(doc);
    doc.insert(0, "Say hi\n");
    // Get the contents of the document for some reason:
  //  console.log(doc.snapshot);	
}

function onClose () {

}

exports.onDocChange = function (doc) {
	 console.log('Version: ' + doc.version);
}

exports.makeNewFile = function (doc) {
}

exports.getProjectFiles = function (doc) {

}