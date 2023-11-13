const {Router} = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { dbFirebase } = require('../database/config');
const { doc, setDoc, collection, updateDoc, getDoc, serverTimestamp } = require("firebase/firestore"); 
const { format } = require('date-fns');
const es = require('date-fns/locale/es');
const {PythonShell} = require('python-shell');
const firebase = require('firebase/app');

//const { v4 } = require("uuid/");

const router = Router();

//sendDataFromArduino
router.post( '/sendDataFromArduino', 
    [
        check('co2', 'Falta el CO2').isLength({min: 1}),
        check('voc', 'Falta el VOC').isLength({min: 1}),
        check('hum', 'Falta el hum').isLength({min: 1}),
        check('iaq', 'Falta el iaq').isLength({min: 1}),
        check('press', 'Falta el press').isLength({min: 1}),
        check('temp', 'Falta el temp').isLength({min: 1}),
        validarCampos
    ], 
    async(req, res) =>{

        console.log(req.body);

        const { co2, voc, hum, iaq, press, temp } = req.body;

        try {
            const fechaActual = new Date();
            const fechaFormateada = Date.now();

            const cosa = doc(collection(dbFirebase, "historial"));
            await setDoc(cosa, {
                CO2: co2,
                VOC: voc,
                hum: hum,
                iaq: iaq,
                press: press,
                temp: temp,
                date: serverTimestamp()
              });

            res.status(200).json({
                ok: true,
                msg: "Enviado Correctamente"
            })
            
        } catch (error) {
            res.status(500).json({
                ok: false,
                msg: error.message
            })
        }
    })//sendDataFromArduino

//  Tiempo real
router.post( '/realTimeData', 
[
    check('co2', 'Falta el CO2').isLength({min: 1}),
    check('voc', 'Falta el VOC').isLength({min: 1}),
    check('hum', 'Falta el hum').isLength({min: 1}),
    check('iaq', 'Falta el iaq').isLength({min: 1}),
    check('press', 'Falta el press').isLength({min: 1}),
    check('temp', 'Falta el temp').isLength({min: 1}),
    validarCampos
], 
async(req, res) =>{

    console.log(req.body);

    const { co2, voc, hum, iaq, press, temp } = req.body;

    try {
        const fechaActual = new Date();
        const fechaFormateada = Date.now();

        const cosa = doc(dbFirebase, "chart", "actual");
            await updateDoc(cosa, {
                CO2: co2,
                VOC: voc,
                hum: hum,
                iaq: iaq,
                press: press,
                temp: temp,
                date: serverTimestamp()
              });

        res.status(200).json({
            ok: true,
            msg: "Enviado Correctamente"
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error.message
        })
    }
})//sendDataFromArduino

//updateState
router.post( '/updateState', 
    [
        check('id_estado', 'El nuevo estado solo puede ser 1 o 0').isIn(['0', '1']),
        validarCampos
    ], 
    async(req, res) =>{
        const { id_estado } = req.body;
        let nuevo_estado = true;

        if(id_estado === "1"){
            nuevo_estado = true;
        }else{
            nuevo_estado = false;
        }

        try {

            const cosa = doc(dbFirebase, "estado", "id_estado");
            await updateDoc(cosa, {
                encendido: nuevo_estado,
              });

            res.status(200).json({
                ok: true,
                msg: "Enviado Correctamente"
            })
            
        } catch (error) {
            res.status(500).json({
                ok: false,
                msg: error.message
            })
        }
    })//updateState

//getState
router.get( '/getState', 
    [
    ], 
    async(req, res) =>{

        try {

            const docRef = doc(dbFirebase, "estado", "id_estado");
            const data = await getDoc(docRef);

            res.status(200).json({
                ok: true,
                msg: "Recuperado Correctamente",
                data: data.data()
            })
            
        } catch (error) {
            res.status(500).json({
                ok: false,
                msg: error.message
            })
        }
    })//getState

//predictionTime
router.post( '/predictionTime', 
    [
    ], 
    async(req, res) =>{

        try {

            PythonShell.run('./python/script.py', null).then(messages=>{
                console.log('N E G R O S');

                res.status(200).json({
                    ok: true,
                    msg: "Corrida Correctamente"
                })
            });
            
        } catch (error) {
            res.status(500).json({
                ok: false,
                msg: error.message
            })
        }
    })//predictionTime

//updateState
router.post( '/updateInfoState', 
[
    check('id_estado', 'El nuevo estado solo puede ser 1 o 0').isIn(['0', '1']),
    validarCampos
], 
async(req, res) =>{
    const { id_estado } = req.body;
    let nuevo_estado = true;

    if(id_estado === "1"){
        nuevo_estado = true;
    }else{
        nuevo_estado = false;
    }

    try {

        const cosa = doc(dbFirebase, "estado", "actualizar");
        await updateDoc(cosa, {
            estado: nuevo_estado,
          });

        res.status(200).json({
            ok: true,
            msg: "Enviado Correctamente"
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error.message
        })
    }
})//updateState

//getInfoState
router.get( '/getUpdateState', 
[
], 
async(req, res) =>{

    try {

        const docRef = doc(dbFirebase, "estado", "actualizar");
        const data = await getDoc(docRef);

        res.status(200).json({
            ok: true,
            msg: "Recuperado Correctamente",
            data: {
                estado: data.data().estado
            }
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error.message
        })
    }
})//getState

module.exports = router;