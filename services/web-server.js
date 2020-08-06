'use strict'

var fs = require('fs');
var https = require('https');
//var http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./dbconfig.js');
const webServerConfig = require('../config/web-server.js');
const oracledb = require('oracledb');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Efectuación del consumo del webService remoto sin protocolo TLS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// let httpServer;
let httpsServer;

const URL_GET = webServerConfig.getRoute;

function initialize() {
  return new Promise((resolve, reject) => {

    //httpServer = https.createServer(app);
    httpsServer = https.createServer({
      key: fs.readFileSync('./certs/key.pem'),
      cert: fs.readFileSync('./certs/cert.pem'),
      passphrase: 'marval'
    }, app);

    app.post('/api/sqlserver/JDEVTAS/getByYM', (req, res) => {

      r1();

      async function r1() {
        try {

          let { VE_Anio, //AÑO
            VE_Mes //MES
          } = await getAxios();

          if (!VE_Anio ||
            !VE_Mes) {
            return res.status(412).json({
              ok: false,
              message: 'Se deben enviar año y mes para la consulta'
            });
          }
          // const dataPersist = await getAxios();
          const RF07CM = 1; //Tipo de Documento
          const RFGEN4 = RFYQ74PREF.concat(RFVINV) //concatenar facturas   //Factura con prefijo
          await insert(RF76CTAX, //Nit Empresa Compradora
            RFYQ74SBTD, //Valor con iva
            RFYQ74PREF, //Prefijo factura
            RFYQ74ORD, //Nombre del Proveedor
            RFYQ74FFAC, //Fecha inicial
            RFYQ74CIUD, //Ciudad
            RFVINV, //Factura sin prefijo
            RFTX2, //Nit Comprador
            RFMNAM, //Nombre empresa
            RFEMAL, //Correo del Proveedor
            RFCRCD, //Moneda COP
            RFAAG1, //IVA
            RFAA, //Valor sin iva
            RF07CM, //Tipo de Documento
            RFGEN4); //Factura con Prefijo 
          return res.status(200).json({
            ok: false,
            message: 'Se registraron correctamente los datos',
            data: [RF76CTAX, //Nit Empresa Compradora
              RFYQ74SBTD, //Valor con iva
              RFYQ74PREF, //Prefijo factura
              RFYQ74ORD, //Nombre del Proveedor
              RFYQ74FFAC, //Fecha inicial
              RFYQ74CIUD, //Ciudad
              RFVINV, //Factura sin prefijo
              RFTX2, //Nit Comprador
              RFMNAM, //Nombre empresa
              RFEMAL, //Correo del Proveedor
              RFCRCD, //Moneda COP
              RFAAG1, //IVA
              RFAA, //Valor sin iva
              RF07CM, //Tipo de Documento
              RFGEN4]
          });

        } catch (e) {
          console.log(e);
          return res.status(400).json({
            ok: false,
            message: 'No se ha podido acceder 1',
            error: e
          });
        }
      }

      function insert(RF76CTAXPost, //Nit Empresa Compradora
        RFYQ74SBTDPost, //Valor con iva
        RFYQ74PREFPost, //Prefijo factura
        RFYQ74ORDPost, //Nombre del Proveedor
        RFYQ74FFACPost, //Fecha inicial
        RFYQ74CIUDPost, //Ciudad
        RFVINVPost, //Factura sin prefijo
        RFTX2Post, //Nit Comprador
        RFMNAMPost, //Nombre empresa
        RFEMALPost, //Correo del Proveedor
        RFCRCDPost, //Moneda COP
        RFAAG1Post, //IVA
        RFAAPost, //Valor sin iva
        RF07CMPost, //Tipo de Documento
        RFGEN4Post ) {
        return new Promise(async function (resolve, reject) {

          let connection;
          try {
            connection = await oracledb.getConnection(dbConfig);
            await connection.execute(
              `INSERT INTO F554313 (RF76CTAX,
                RFYQ74SBTD, 
                RFYQ74PREF, 
                RFYQ74ORD, 
                RFYQ74FFAC, 
                RFYQ74CIUD, 
                RFVINV, 
                RFTX2, 
                RFMNAM,
                RFEMAL, 
                RFCRCD, 
                RFAAG1, 
                RFAA,
                RF07CM,
                RFGEN4) VALUES (:RF76CTAX, 
                  :RFYQ74SBTD, 
                  :RFYQ74PREF, 
                  :RFYQ74ORD, 
                  :RFYQ74FFAC, 
                  :RFYQ74CIUD,
                  :RFVINV,
                  :RFTX2,
                  :RFMNAM, 
                  :RFEMAL,
                  :RFCRCD, 
                  :RFAAG1, 
                  :RFAA,
                  :RF07CM,
                  :RFGEN4 )`,
              [RF76CTAXPost, //Nit Empresa Compradora
                RFYQ74SBTDPost, //Valor con iva
                RFYQ74PREFPost, //Prefijo factura
                RFYQ74ORDPost, //Nombre del Proveedor
                RFYQ74FFACPost, //Fecha inicial
                RFYQ74CIUDPost, //Ciudad
                RFVINVPost, //Factura sin prefijo
                RFTX2Post, //Nit Comprador
                RFMNAMPost, //Nombre empresa
                RFEMALPost, //Correo del Proveedor
                RFCRCDPost, //Moneda COP
                RFAAG1Post, //IVA
                RFAAPost,//Valor sin iva
                RF07CMPost,//Tipo de Documento
                RFGEN4Post //Factura con Prefijo 
              ], { autoCommit: true }
            );


          } catch (err) { // catches errors in getConnection and the query
            if (err) {
              console.log(err);
              return res.status(400).json({
                ok: false,
                message: 'No se ha podido acceder al ID y los demás datos de la consulta',
                error: err
              });
            }
            //reject(err);

          } finally {
            if (connection) {   // the connection assignment worked, must release
              try {
                await connection.release();
              } catch (e) {
                console.error(e);
                if (e) {
                  console.log(e);
                  return res.status(406).json({
                    ok: false,
                    message: 'Conection does not release',
                    error: e
                  });
                }
              }
            }
          }
        });
      }

      function getAxios() {
        return new Promise(async function (resolve, reject) {
          try {
            let ress = await axios.post(URL_GET)
            resolve(ress.data);
          }
          catch (err) {
            return res.status(406).json({
              ok: false,
              message: 'Error en la conexión con el servicio web remoto',
              error: err
            });
            reject(err);
          }
        });
      }

    });

    httpsServer.listen(webServerConfig.port)
      .on('listening', () => {
        console.log(`Web server listening on remote port:${webServerConfig.port}`);
        resolve();
      })
      .on('error', err => {
        reject(err);
      });

  });
}

module.exports.initialize = initialize;
