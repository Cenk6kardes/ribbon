const express = require('express')
const router = express.Router()
const dataJSON = require('./../jsonData/tmm/tmm.json')
const responseJSON = require('./../jsonData/responses/responses-with-message.json')
// Generic command to perform maintenance or querying on either a gateway's endpoints or a trunk's members
router.put('/TmmApi/tmm/v1.0/maintenance/:command/:sSecurityInfo?', (req, res) => {
    const session = req.headers['session-id'];
    console.log('session: ', session);
    const command = req.params.command;
    const sSecurityInfo = req.params.sSecurityInfo;
    const bodyData = req.body;
    console.log('command: ', command);
    console.log('sSecurityInfo: ', sSecurityInfo);
    console.log('bodyData: ', bodyData);
    switch (command) {
        case 'QESByGatewayName':
            {
                if (bodyData.length > 0) {
                    const showDetailsObject = bodyData.find(n => n.key === 'ShowDetails');
                    if (showDetailsObject && showDetailsObject.value == true) {
                        res.status(200).json(dataJSON.QESBYGATEWAYNAME_DETAIL);
                    }
                    res.status(200).json(dataJSON.QESBYGATEWAYNAME);
                } else {
                    res.status(400).json(responseJSON.response400);
                }
            }
            break;
        case 'PostByGatewayName':
            {
                if (bodyData.length > 0) {
                    const showDetailsObject = bodyData.find(n => n.key === 'ShowDetails');
                    if (showDetailsObject && showDetailsObject.value == true) {
                        res.status(200).json(dataJSON.POSTBYGATEWAYNAME_DETAIL);
                    }
                    res.status(200).json(dataJSON.POSTBYGATEWAYNAME);
                } else {
                    res.status(400).json(responseJSON.response400);
                }
            }
            break;
        case 'BSYByGatewayName':
            {
                if (bodyData.length > 0) {
                    const showDetailsObject = bodyData.find(n => n.key === 'ShowDetails');
                    if (showDetailsObject && showDetailsObject.value == true) {
                        res.status(200).json(dataJSON.BSYBYGATEWAYNAME_DETAIL);
                    }
                    res.status(200).json(dataJSON.BSYBYGATEWAYNAME);
                } else {
                    res.status(400).json(responseJSON.response400);
                }
            }
            break;
        case 'RTSByGatewayName':
            {
                if (bodyData.length > 0) {
                    const showDetailsObject = bodyData.find(n => n.key === 'ShowDetails');
                    if (showDetailsObject && showDetailsObject.value == true) {
                        res.status(200).json(dataJSON.RTSBYGATEWAYNAME_DETAIL);
                    }
                    res.status(200).json(dataJSON.RTSBYGATEWAYNAME);
                } else {
                    res.status(400).json(responseJSON.response400);
                }
            }
            break;
        case 'FRLSByGatewayName':
            {
                if (bodyData.length > 0) {
                    const showDetailsObject = bodyData.find(n => n.key === 'ShowDetails');
                    if (showDetailsObject && showDetailsObject.value == true) {
                        res.status(200).json(dataJSON.FRLSBYGATEWAYNAME_DETAIL);
                    }
                    res.status(200).json(dataJSON.FRLSBYGATEWAYNAME);
                } else {
                    res.status(400).json(responseJSON.response400);
                }
            }
            break;
        case 'GetTrunkCllisByGatewayName':
            {
                if (bodyData[0].key == 'GatewayName' && bodyData[0].value == 'CO39G9PRI') {
                    res.status(200).json(dataJSON.GETTRUNKCLLIBYGATEWAYNAMES);
                }
            }
            break;
        case 'INBByGatewayName':
            {
                if (bodyData.length > 0) {
                    const showDetailsObject = bodyData.find(n => n.key === 'ShowDetails');
                    if (showDetailsObject && showDetailsObject.value == true) {
                        res.status(200).json(dataJSON.INBBYGATEWAYNAME_DETAIL);
                    }
                    res.status(200).json(dataJSON.INBBYGATEWAYNAME);
                } else {
                    res.status(400).json(responseJSON.response400);
                }
            }
            break;
        case 'GetGatewayNames':
            {
                res.status(200).json(dataJSON.GETGATEWAYNAMES);
            }
            break;
        case 'GetCarriers':
            {
                res.status(200).json(dataJSON.GETCARRIERS);
            }
            break;
        case 'QESByCarrier':
            {
                if (bodyData.length > 0) {
                    const showDetailsObject = bodyData.find(n => n.key === 'ShowDetails');
                    if (showDetailsObject && showDetailsObject.value == true) {
                        res.status(200).json(dataJSON.QESBYCARRIER_DETAIL);
                    }
                    res.status(200).json(dataJSON.QESBYCARRIER);
                } else {
                    res.status(400).json(responseJSON.response400);
                }
            }
            break;
        case 'PostByCarrier':
            {
                if (bodyData.length > 0) {
                    const showDetailsObject = bodyData.find(n => n.key === 'ShowDetails');
                    if (showDetailsObject && showDetailsObject.value == true) {
                        res.status(200).json(dataJSON.POSTCARRIERS_DETAIL);
                    }
                    res.status(200).json(dataJSON.POSTCARRIERS);
                } else {
                    res.status(400).json(responseJSON.response400);
                }
            }
            break;
        case 'BSYByCarrier':
            {
                if (bodyData.length > 0) {
                    res.status(200).json(dataJSON.BSYBYCARRIERS);
                } else {
                    res.status(400).json(responseJSON.response400);
                }
            }
            break;
        case 'RTSByCarrier':
            {
                if (bodyData.length > 0) {
                    res.status(200).json(dataJSON.RTSBYCARRIERS);
                } else {
                    res.status(400).json(responseJSON.response400);
                }
            }
            break;
        case 'FRLSByCarrier':
            {
                if (bodyData.length > 0) {
                    res.status(200).json(dataJSON.FRLSBYCARRIERS);
                } else {
                    res.status(400).json(responseJSON.response400);
                }
            }
            break;
        case 'INBByCarrier':
            {
                if (bodyData.length > 0) {
                    res.status(200).json(dataJSON.INBBBYCARRIERS);
                } else {
                    res.status(400).json(responseJSON.response400);
                }
            }
            break;
        case 'PostByTrunkCLLI':
            {
                if (bodyData.length > 0) {
                    res.status(200).json(dataJSON.POSTBYTRUNKCLLI);
                } else {
                    res.status(400).json(responseJSON.response400);
                }
            }
            break;
        case 'PostGroupDChannelByTrunkCLLI':
            {
                if (bodyData.length > 0) {
                    res.status(200).json(dataJSON.POSTGROUPDCHANNELBYTRUNKCLLI);
                } else {
                    res.status(400).json(responseJSON.response400);
                }
            }
            break;
        case 'FRLSByTrunkCLLI':
            {
                if (bodyData.length > 0) {
                    res.status(200).json(dataJSON.FRLSBYTRUNKCLLI);
                } else {
                    res.status(400).json(responseJSON.response400);
                }
            }
            break;
        case 'ICOTTest':
          {
            if (bodyData.length > 0) {
              res.status(200).json(dataJSON.ICOTTEST);
            } else {
              res.status(400).json(responseJSON.response400);
            }
          }
          break;
        default:
            res.status(400).json(responseJSON.response400);
            break;
    }
})

module.exports = router