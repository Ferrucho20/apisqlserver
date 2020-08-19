'use strict'

var fs = require('fs');
var https = require('https');
//var http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./dbconfig.js');
const webServerConfig = require('../config/web-server.js');
const mssql = require('mssql');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//let httpServer;
let httpsServer;

function initialize() {
  return new Promise((resolve, reject) => {

    //httpServer = http.createServer(app);
     httpsServer = https.createServer({
       key: fs.readFileSync('./certs/key.pem'),
       cert: fs.readFileSync('./certs/cert.pem'),
       passphrase: 'marval'
     }, app);

    app.get('/api/sqlserver/JDEVTAS/getByYM', (req, res) => {

      var { VE_Anio, //AÑO
        VE_Mes //MES
      } = req.body;
      if (!VE_Anio ||
        !VE_Mes) {
        return res.status(412).json({
          ok: false,
          message: 'Se deben enviar VE_Anio y VE_Mes para la consulta'
        });
      }
      try {
        VE_Anio = parseInt(VE_Anio);
        VE_Mes = parseInt(VE_Mes);
      } catch (error) {
        return res.status(412).json({
          ok: false,
          message: 'Se deben enviar el año y mes en formato numérico'
        });
      }

      r1();

      async function r1() {
        try {

          var info = await get();
          return res.status(200).json({
            ok: true,
            message: 'Se obtuvieron correctamente los datos',
            rowsAffected: info.rowsAffected[0],
            dataList: info.recordsets[0]
          });
        } catch (error) {
          return res.status(400).json({
            ok: false,
            message: 'No se ha podido acceder al ID y los demás datos de la consulta',
            error: error
          });
        }
      }

      // // var sql = "SELECT * FROM JDEVTAS.BICOMERCIAL WHERE VE_Anio = 2020 AND VE_Mes = 7"
      // var sql = "SELECT VE_Ukid, VE_Tipo, VE_Oper, VE_Sucursal, VE_NomSucursal, " +
      //   "VE_CodProyecto, VE_NomProyecto, VE_UndDisponible, VE_FecVtaRet, VE_TipoPry, " +
      //   "VE_Inmueble, VE_UndsVtas, VE_UndsRet, VE_UndsOpc, VE_VlrVtas, VE_VlrRet, " +
      //   "VE_VlrOpc, VE_VlrPpto, VE_VlrBnos, VE_VlrSanciones, VE_VlrSeparaciones " +
      //   "VE_VlrMts, VE_QMts, VE_AN8Asesor, VE_NOMAsesor, VE_AN8Cliente, " +
      //   "VE_NOMCliente, VE_CodCiudad, VE_NOMCiudad " +
      // "FROM JDEVTAS.BICOMERCIAL " +
      // "WHERE VE_Anio = ? " + 
      // " AND VE_Mes = ? "
      function get() {
        return new Promise(async function (resolve, reject) {
          let connection = new mssql.ConnectionPool(dbConfig);
          connection.connect().then(function () {
            new mssql.Request(connection)
              .input('VE_Anio1', mssql.Int, VE_Anio)
              .input('VE_Mes1', mssql.Int, VE_Mes)
              .query('SELECT VE_Ukid, VE_Tipo, VE_Oper, VE_Sucursal, VE_NomSucursal, ' +
                'VE_CodProyecto, VE_NomProyecto, VE_UndDisponible, VE_FecVtaRet, VE_TipoPry,' +
                'VE_Inmueble, VE_UndsVtas, VE_UndsRet, VE_UndsOpc, VE_VlrVtas, VE_VlrRet,' +
                'VE_VlrOpc, VE_VlrPpto, VE_VlrBnos, VE_VlrSanciones, VE_VlrSeparaciones, ' +
                'VE_VlrMts, VE_QMts, VE_AN8Asesor, VE_NOMAsesor, VE_AN8Cliente,' +
                'VE_NOMCliente, VE_CodCiudad, VE_NOMCiudad ' +
                'FROM JDEVTAS.BICOMERCIAL WHERE VE_Anio = @VE_Anio1 AND VE_Mes = @VE_Mes1')
              .then(function (data) {   //${parseInt(VE_Mes)}
                if(data.recordsets[0].length == 0){
                  return res.status(404).json({
                    ok: true,
                    message: 'No se obtuvieron resultados',
                    dataList: data.recordsets[0],
                    rowsAffected: data.rowsAffected
                  });
                }else{
                  resolve(data);
                } 
                connection.close();
              })
              .catch(function (error) {
                console.log(error);
                return res.status(400).json({
                  ok: false,
                  message: 'No se ha podido realizar la consulta con la BD',
                  error: error
                });
              });
          })
            .catch(function (error) {
              console.log(error);
              return res.status(400).json({
                ok: false,
                message: 'No se ha podido conectar con la BD 22',
                error: error
              });
            });



          // try {
          //   connection = mssql.connect(dbConfig)
          //   let request = new mssql.Request();
          //   request.query('SELECT *' +

          //     // request.query('SELECT VE_Ukid, VE_Tipo, VE_Oper, VE_Sucursal, VE_NomSucursal,' +
          //     //   'VE_CodProyecto, VE_NomProyecto, VE_UndDisponible, VE_FecVtaRet, VE_TipoPry,' +
          //     //   'VE_Inmueble, VE_UndsVtas, VE_UndsRet, VE_UndsOpc, VE_VlrVtas, VE_VlrRet,' +
          //     //   'VE_VlrOpc, VE_VlrPpto, VE_VlrBnos, VE_VlrSanciones, VE_VlrSeparaciones,' +
          //     //   'VE_VlrMts, VE_QMts, VE_AN8Asesor, VE_NOMAsesor, VE_AN8Cliente,' +
          //     //   'VE_NOMCliente, VE_CodCiudad, VE_NOMCiudad' +
          //     'FROM BICOMERCIAL' +
          //     'WHERE VE_Anio=' + VE_Anio +
          //     'AND VE_Mes=' + VE_Mes + ";");
          //   resolve(request);

          // } catch (error) {
          //   return res.status(400).json({
          //     ok: false,
          //     message: 'No se ha podido conectar con la BD',
          //     error: err
          //   });
          // }
          // finally {
          //   mssql.close();
          // }
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
