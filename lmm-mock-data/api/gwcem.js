const express = require('express')
const router = express.Router()
const dataJSON = require('./../jsonData/gwcem/gwcem.json')
const responseJSON = require('./../jsonData/responses/responses-with-message.json')

// get LMM Line Gateway Names
router.get('/GwcemApi/gwcem/v1.0/lmm-gateways/:gwName?', (req, res) => {
    const gwNameValue = req.params.gwName;
    const session = req.headers['session-id'];
    console.log('gwName: ', gwNameValue);
    console.log('session: ', session);
    // get all gateways if params of gwName equal undefined
    if (gwNameValue === undefined) {
        res.json(dataJSON.gatewaysList);
    } else {
        let data = dataJSON.gatewaysList;
        data = data.filter(n => n.includes(gwNameValue));
        res.json(data);
    }
})

// Returns a list of GWC devices with status
router.get('/GwcemApi/gwcem/v1.0/gwc-status-list', (req, res) => {
    const session = req.headers['session-id'];
    console.log('session: ', session);
    // need check this data on YAML
    res.json(dataJSON.GWCDevices);
})

router.get('/GwcemApi/gwcem/v1.0/gatewayData/:gwcID/:gwName', (req, res) => {
    const gwcIDValue = req.params.gwcID;
    console.log('gwcIDValue: ', gwcIDValue);

    const gwNameValue = req.params.gwName;
    console.log('gwNameValue: ', gwNameValue);

    res.json(dataJSON.gatewaysData);
})

router.get('/GwcemApi/gwcem/v1.0/endpoint-by-filter/:epData/:isMG9K', (req, res) => {
    const isMG9K = req.params.isMG9K;
    console.log('isMG9K: ', isMG9K);

    const epData = req.params.epData;
    console.log('epData: ', epData);
    epDataParse = JSON.parse(epData);
    console.log(epDataParse.gatewayName);
    res.json(dataJSON.endpointByFilter);
})

// Properties from file
router.get('/GwcemApi/gwcem/v1.0/properties/:fromFile', (req, res) => {
    const propertiesFromFile = req.params.fromFile;
    console.log('fileInfo: ', propertiesFromFile);

    res.json(dataJSON.filePropertiesData);
})

router.get('/GwcemApi/gwcem/v1.0/middlebox-ip/:MiddleBoxName', (req, res) => {
    const session = req.headers['session-id'];
    console.log('session: ', session);
    
    res.send('47.168.13.13');
})

module.exports = router