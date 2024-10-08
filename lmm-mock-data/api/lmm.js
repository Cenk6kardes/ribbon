const express = require('express')
const router = express.Router()
const dataJSON = require('./../jsonData/lmm/lmm.json')
const responseJSON = require('./../jsonData/responses/responses-with-message.json')

// Query Directory Number
router.get('/LmmApi/lmm/v1.0/qdn/:dn', (req, res) => {
    const dnValue = req.params.dn;
    const session = req.headers['session-id'];
    console.log('dnValue: ', dnValue);
    console.log('session: ', session);
    // need check this data on YAML
    res.json(dataJSON.queryDirectoryNumber);
})

// Query Directory Number
router.get('/LmmApi/lmm/v1.0/qsip/:dn', (req, res) => {
    const dnValue = req.params.dn;
    const session = req.headers['session-id'];
    console.log('dnValue: ', dnValue);
    console.log('session: ', session);
    // need check this data on YAML
    res.json(dataJSON.querySessionInitiationProtocol);
})

// Get list of reports
router.get('/LmmApi/lmm/v1.0/report-list/:queryName', (req, res) => {
    const queryNameValue = req.params.queryName;
    const session = req.headers['session-id'];
    console.log('queryNameValue: ', queryNameValue);
    console.log('session: ', session);
    // need check this data on YAML
    res.json(dataJSON.reportsList);
})

// Retrieve General Result of report
router.get('/LmmApi/lmm/v1.0/general-report/:reportName', (req, res) => {
    const reportNameValue = req.params.reportName;
    const session = req.headers['session-id'];
    console.log('reportNameValue: ', reportNameValue);
    console.log('session: ', session);
    // need check this data on YAML
    res.json(dataJSON.generalReports);
})

// Retrieves detailed query report for Gateway Controller
router.get('/LmmApi/lmm/v1.0/detailed-report/:reportName/:GWCName', (req, res) => {
    const reportNameValue = req.params.reportName;
    const GWCNameValue = req.params.GWCName;
    const session = req.headers['session-id'];
    console.log('reportNameValue: ', reportNameValue);
    console.log('GWCNameValue: ', GWCNameValue);
    console.log('session: ', session);
    // need check this data on YAML
    res.json(dataJSON.reportDetail);
    })

//Retrieve query configuration
router.get('/LmmApi/lmm/v1.0/query-configuration/:query', (req, res) => {
    const query = req.params.query;
    const session = req.headers['session-id'];
    console.log('query: ', query);
    console.log('session: ', session);
    res.json(dataJSON.queryConfiguration);
})

// Configure Query
router.put('/LmmApi/lmm/v1.0/query-configuration', (req, res) => {
    const session = req.headers['session-id'];
    console.log('session: ', session);
    res.status(200).json();
})

// Retrieve CBMG ip
router.get('/LmmApi/lmm/v1.0/sdm-ip', (req, res) => {
    res.send("10.254.146.43");
})

router.put('/LmmApi/lmm/v1.0/maintenance', (req, res) => {
    console.log("action " + req.query.action);
    
    res.status(200).json(dataJSON.maintenanceInformation);
})

// CM CLLI information
router.get('/LmmApi/lmm/v1.0/cm-clli/:sdmIP', (req, res) => {
    const sdmIPValue = req.params.sdmIP;
    console.log('sdmIPValue: ', sdmIPValue);
    res.send("CO24");
})


// Get Line Information with DN and CLLI
router.get('/LmmApi/lmm/v1.0/line-validation/:dn/:clli', (req, res) => {
    const dnValue = req.params.dn;
    console.log('dnValue: ', dnValue);
    const clliValue = req.params.clli;
    console.log('clliValue: ', clliValue);
    let data = dataJSON.lineInformationByDNAndCLLI;
    const objectLine = data.find(n => n.cm_dn === dnValue);
    if (objectLine) {
        setTimeout(() => {
            res.json(objectLine);
        }, 2000);
    } else {
        res.json({});
    }
})

// Get Line Information with TID and CLLI
router.get('/LmmApi/lmm/v1.0/line-validation-tid/:tid/:clli', (req, res) => {
    const tidValue = req.params.tid;
    console.log('tid: ', tidValue);
    const clliValue = req.params.clli;
    console.log('clliValue: ', clliValue);
    let data = dataJSON.lineInformationByDNAndCLLI;
    const objectLine = data.find(n => n.cm_tid === tidValue);
    if (objectLine) {
        setTimeout(() => {
            res.json(objectLine);
        }, 2000);
    } else {
        res.json({});
    }
})

// Get line Post Information
router.post('/LmmApi/lmm/v1.0/line-information', (req, res) => {
    const lineValue = req.body;
    console.log('lineValue: ', lineValue);
    const lineInformationData = dataJSON.lineInformation;
    const objectLineInformation = lineInformationData.find(n => n.cm_dn === lineValue.cm_tid);
    if (objectLineInformation) {
        res.json(objectLineInformation);
    } else {
        res.json({});
    }
})

router.get('/LmmApi/lmm/v1.0/endpoint-state/:gwc_address/:nodeNumber/:terminalNumber', (req, res) => {
    const gwcAddressValue = req.params.gwc_address;
    console.log('gwcAddressValue: ', gwcAddressValue);

    const nodeNumberValue = req.params.nodeNumber;
    console.log('nodeNumberValue: ', nodeNumberValue);

    const terminalNumberValue = req.params.terminalNumber;
    console.log('terminalNumberValue: ', terminalNumberValue);

    res.json(dataJSON.endpointStateInformation);
})

// Cancel deload posted line
router.post('/LmmApi/lmm/v1.0/deload-cancellation', (req, res) => {
    res.json({ mtc_rc: 0 });
})

// Query Progress of Trouble Gateway Report
var progress = 1600;
router.get('/LmmApi/lmm/v1.0/query-progress/:step', (req, res) => {
    res.send(progress + '');
    progress += 1600;
    if (progress > 6400) {
        progress = 1600;
    } 
})

router.get('/LmmApi/lmm/v1.0/gw-ip/:gw_address/:gw_name', (req, res) => {
    res.send('47.168.139.99');
})

// Run trouble query for gateways
router.post('/LmmApi/lmm/v1.0/trouble-gw-query', (req, res) => {
    // need check this data on YAML
    res.status(200).json(0);
})

// Run trouble query for all gateway controllers
router.post('/LmmApi/lmm/v1.0/trouble-gw-query/:total', (req, res) => {
    const total = req.params.total;
    const session = req.headers['session-id'];
    console.log('total: ', total);
    console.log('session: ', session);
    // need check this data on YAML
    res.status(200).json(0);
})

module.exports = router