const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const fs = require("fs");


const buffer = fs.readFileSync('../ng-frontend/projects/cmdb/locale/messages.xlf');
const XMLdata = buffer.toString();

const options = {
    ignoreAttributes: false,
    attributeNamePrefix : "@_"
};

const parser = new XMLParser(options);
let jObj = parser.parse(XMLdata, true);
jObj.xliff.file.body['trans-unit'].forEach(element => {
    element.target = element.note['#text'];
    console.log(element.target);
});;
const builder = new XMLBuilder(options);
const xmlContent = builder.build(jObj);
fs.writeFileSync('../ng-frontend/projects/cmdb/locale/messages.en.xlf', xmlContent.toString());
