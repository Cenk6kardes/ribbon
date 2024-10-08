const express = require('express')
const router = express.Router()
const dataJSON = require('./../jsonData/nv/nv.json')

// the remote interface containing access to all the GWC data, query with the name of the GWC.
router.get('/NvApi/nv/v1.0/gwcData/:gwcID', (req, res) => {
    const gwcIDValue = req.params.gwcID;
    const session = req.headers['session-id'];
    console.log('gwcIDValue: ', gwcIDValue);
    console.log('session: ', session);
    res.json(dataJSON.gwcDataByGWCID);
})

// Provides access to all information about a GW element.
router.get('/NvApi/nv/v1.0/gatewayData/:gateway', (req, res) => {
    const gatewayValue = req.params.gateway;
    const session = req.headers['session-id'];
    console.log('gatewayValue: ', gatewayValue);
    console.log('session: ', session);
    res.json(dataJSON.gatewayDataByGW);
})

// CLLI information
router.get('/NvApi/nv/v1.0/cm-clli', (req, res) => {
    res.send("CO24");
})

module.exports = router