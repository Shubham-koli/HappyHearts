/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.example.basic.Record} Record - the Record transaction
 * @transaction
 */


function Record(Record) {

    console.log('Starting Contract');
    var accessRecord = Record.accessRecord;
    console.log(accessRecord);
    var NS = 'org.example.basic';
    var factory = getFactory();

    if (accessRecord.Record) {
        accessRecord.Record.push(Record);
    } else {
        accessRecord.Record = [Record];
    }

    //added
    return getAssetRegistry(NS + '.AccessRecord')
        .then(function (accessRecordRegistry) {
            // add the temp reading to the contract1
            console.log(accessRecord);
            return accessRecordRegistry.update(accessRecord);
        });

}