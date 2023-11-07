const {Router} = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { dbFirebase } = require('../database/config');
const { doc, setDoc, collection } = require("firebase/firestore"); 
const { format } = require('date-fns');
const es = require('date-fns/locale/es');

//const { v4 } = require("uuid/");

const router = Router();

//Crear Usuario
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
        const { co2, voc, hum, iaq, press, temp } = req.body;

        try {
            const fechaActual = new Date();
            const fechaFormateada = format(fechaActual, "dd 'de' MMMM 'de' yyyy, HH:mm:ss 'UTC'xxx", {
                locale: es,  // Establecer el idioma en español
                timeZone: 'America/Costa_Rica'  // Establecer la zona horaria deseada
            });

            const cosa = doc(collection(dbFirebase, "historial"));
            await setDoc(cosa, {
                CO2: co2,
                VOC: voc,
                hum: hum,
                iaq: iaq,
                press: press,
                temp: temp,
                date: fechaFormateada
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
    })

module.exports = router;