var replace = require("replace"),
	copy = require("directory-copy"),
	fs = require("fs"),
	concat = require("concat"),
	del = require("del");

var srcPath = __dirname + '/../datastores/transform';
var destPath = __dirname + '/../datastores';
    
module.exports = {
    perform : perform
}    

function perform() {
    copy({
        src: srcPath,
        dest: destPath
    }, function() {
        console.log('Directory copied');			
                
        // fs.renameSync(destPath + "/bills", destPath + "/invoices");
        fs.renameSync(destPath + "/billProducts", destPath + "/invoiceProducts");
        
        console.log('Rename done');

        mergeDeliveryNotesToBills();	
    });
}

function mergeDeliveryNotesToBills() {
	replace({
		regex: "},{",
		replacement: ",\"postponed\":true},{",
		paths: [destPath + "/deliveryNotes"],
		recursive: true,
		silent: false,
		count: true
	});
	
	replace({
		regex: "}(?!,)",
		replacement: ",\"postponed\":true}",
		paths: [destPath + "/deliveryNotes"],
		recursive: true,
		silent: false,
		count: true
	});
	
	replace({
		regex: "},{",
		replacement: ",\"postponed\":false},{",
		paths: [destPath + "/bills"],
		recursive: true,
		silent: false,
		count: true
	});
	
	replace({
		regex: "}(?!,)",
		replacement: ",\"postponed\":false}",
		paths: [destPath + "/bills"],
		recursive: true,
		silent: false,
		count: true
	});

	console.log("start concat");
	
	concat([destPath + "/bills", destPath + "/deliveryNotes"], destPath + "/invoices", function(error) {
		if (error) {
			console.error("!!! An error occured: ");
			console.error(error);
			return;
		}
		
		console.log("bills and delivery notes merged to invoices");
		
		del.sync([destPath + "/deliveryNotes", destPath + "/bills"]);
		
		console.log("Bills and Delivery notes files deleted");
		
		process();
	});
	
}

function process() {
		
	replace({
		regex: "[\\[\\]]",
		replacement: "",
		paths: [destPath],
		recursive: true,
		silent: false,
		count: true
	});

	replace({
		regex: "},{",
		replacement: "}\n{",
		paths: [destPath],
		recursive: true,
		silent: false,
		count: true
	});

	replace({
		regex: "\"id\"",
		replacement: "\"_id\"",
		paths: [destPath],
		recursive: true,
		silent: false
	});

	replace({
		regex: "\"_id\":(\\d*)",
		replacement: "\"_id\":\"$1\"",
		paths: [destPath + '/customers', destPath + '/products'],
		recursive: true,
		silent: false,
		count: true,
		quiet: false
	});

	replace({
		regex: "\"customerId\":(\\d*)",
		replacement: "\"customerId\":\"$1\"",
		paths: [destPath + '/invoices'],
		recursive: true,
		silent: false,
		count: true,
		quiet: false
	});
	
	replace({
		regex: "\"productId\":\"?(\\d*E?)\"?",
		replacement: "\"productId\":\"$1\"",
		paths: [destPath + '/invoiceProducts'],
		recursive: true,
		silent: false,
		count: true,
		quiet: false
	});
	
	replace({
		regex: "\"billId\"",
		replacement: "\"invoiceId\"",
		paths: [destPath + '/invoiceProducts'],
		recursive: true,
		silent: false,
		count: true,
		quiet: false
	});
	
	replace({
		regex: "\"invoiceId\":(?!\")(\\d*)",
		replacement: "\"invoiceId\":\"$1\"",
		paths: [destPath + '/invoiceProducts'],
		recursive: true,
		silent: false,
		count: true,
		quiet: false
	});
	
	replace({
		regex: ".*dateDeleted.*\\r?\\n",
		replacement: "",
		paths: [destPath + '/invoices'],
		recursive: true,
		silent: false,
		count: true,
		quiet: false
	});
}