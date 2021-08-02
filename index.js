"use strict";

//var fs = require('fs');
//var https = require('https');
//var http = require('http');
const express = require("express");
const bodyParser = require("body-parser");
const dbConfig = require("./services/dbconfig.js");
const webServerConfig = require("./config/web-server.js");
const mssql = require("mssql");

//import * as fs from "fs";
//import express from "express";
//import bodyParser from "bodyParser";
//import dbConfig from "./services/dbConfig";
//import webServerConfig from "./config/webServerConfig";
//import mssql from "mssql";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//let httpServer;
//let httpsServer;

//httpServer = http.createServer(app);
//httpsServer = https.createServer({
//  key: fs.readFileSync('./certs/key.pem'),
//  cert: fs.readFileSync('./certs/cert.pem'),
//  passphrase: 'marval'
//}, app);

app.get("/", (req, res) => {
  res.send("prueba");
});

app.get("/api/sqlserver/JDEVTAS/month", (req, res) => {
  //var { VE_Anio, //AÑO
  //  VE_Mes //MES
  //} = req.body;
  var now = new Date();
  var VE_Anio = now.getFullYear();
  var VE_Mes = now.getMonth() - 4;

  var password = req.headers.pwd;
  if (!password) {
    return res.status(412).json({
      ok: false,
      message: "Se debe enviar la cabecera de autenticación para la consulta",
    });
  }
  if (
    password !=
    "acee589663a018703bb1c4685f55682f3a43426530f5946f9679f97946ca5436"
  ) {
    return res.status(412).json({
      ok: false,
      message: "Cabecera de autenticación equivocada",
    });
  }
  if (!VE_Anio || !VE_Mes) {
    return res.status(412).json({
      ok: false,
      message: "Se deben enviar VE_Anio y VE_Mes para la consulta",
    });
  }
  try {
    VE_Anio = parseInt(VE_Anio);
    VE_Mes = parseInt(VE_Mes);
  } catch (error) {
    return res.status(412).json({
      ok: false,
      message: "Se deben enviar el año y mes en formato numérico",
    });
  }

  r1();

  async function r1() {
    try {
      var info = await get();
      return res.status(200).json({
        ok: true,
        message: "Se obtuvieron correctamente los datos",
        rowsAffected: info.rowsAffected[0],
        dataList: info.recordsets[0],
      });
    } catch (error) {
      return res.status(400).json({
        ok: false,
        message:
          "No se ha podido acceder al ID y los demás datos de la consulta",
        error: error,
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
      connection
        .connect()
        .then(function () {
          new mssql.Request(connection)
            .input("VE_Anio1", mssql.Int, VE_Anio)
            .input("VE_Mes1", mssql.Int, VE_Mes)
            .query(
              "SELECT VE_Ukid, VE_Anio, VE_Mes, VE_Tipo, VE_Oper, VE_Sucursal, VE_NomSucursal, " +
                "VE_CodProyecto, VE_NomProyecto, VE_UndDisponible, VE_FecVtaRet, VE_TipoPry," +
                "VE_Inmueble, VE_UndsVtas, VE_UndsRet, VE_UndsOpc, VE_VlrVtas, VE_VlrRet," +
                "VE_VlrOpc, VE_VlrPpto, VE_VlrBnos,VE_VlrDstoFinan, VE_VlrSanciones, VE_VlrSeparaciones, " +
                "VE_VlrMts, VE_QMts, VE_AN8Asesor, VE_NOMAsesor, VE_AN8Cliente," +
                "VE_NOMCliente, VE_CodCiudad, VE_NOMCiudad, VE_CodRetiro, VE_DesRetiro, VE_VlrDiasPagSepa, VE_Estrato, VE_NroHNVta, VE_NroHNTra, VE_PorcCI, VE_PorcArras, VE_PorcSeparacion, VE_MesesPlazo, VE_NomPlazo,VE_TotInmuebles,VE_TotMts,VE_Fec_Escritura,VE_Anio_Escritura,VE_Mes_Escritura,VE_Agrupacion,VE_Cedula,VE_Transmitir,VE_Vlr_RealSancion " +
                "FROM JDEVTAS.BICOMERCIAL WHERE VE_Anio >= @VE_Anio1 AND VE_Mes >= @VE_Mes1 AND VE_Transmitir = 'Y'"
            ) //
            .then(function (data) {
              //${parseInt(VE_Mes)}
              if (data.recordsets[0].length == 0) {
                return res.status(404).json({
                  ok: true,
                  message: "No se obtuvieron resultados",
                  dataList: data.recordsets[0],
                  rowsAffected: data.rowsAffected,
                });
              } else {
                resolve(data);
              }
              connection.close();
            })
            .catch(function (error) {
              console.log(error);
              return res.status(400).json({
                ok: false,
                message: "No se ha podido realizar la consulta con la BD",
                error: error,
              });
            });
        })
        .catch(function (error) {
          console.log(error);
          return res.status(400).json({
            ok: false,
            message: "No se ha podido conectar con la BD 22",
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

app.get("/api/sqlserver/JDEVTAS/year", (req, res) => {
  //var { VE_Anio, //AÑO
  //  VE_Mes //MES
  //} = req.body;
  var now = new Date();
  var VE_Anio = now.getFullYear();
  var VE_Mes = now.getMonth();

  var password = req.headers.pwd;
  if (!password) {
    return res.status(412).json({
      ok: false,
      message: "Se debe enviar la cabecera de autenticación para la consulta",
    });
  }
  if (
    password !=
    "acee589663a018703bb1c4685f55682f3a43426530f5946f9679f97946ca5436"
  ) {
    return res.status(412).json({
      ok: false,
      message: "Cabecera de autenticación equivocada",
    });
  }
  if (!VE_Anio || !VE_Mes) {
    return res.status(412).json({
      ok: false,
      message: "Se deben enviar VE_Anio y VE_Mes para la consulta",
    });
  }
  try {
    VE_Anio = parseInt(VE_Anio);
    VE_Mes = parseInt(VE_Mes);
  } catch (error) {
    return res.status(412).json({
      ok: false,
      message: "Se deben enviar el año y mes en formato numérico",
    });
  }

  r1();

  async function r1() {
    try {
      var info = await get();
      return res.status(200).json({
        ok: true,
        message: "Se obtuvieron correctamente los datos",
        rowsAffected: info.rowsAffected[0],
        dataList: info.recordsets[0],
      });
    } catch (error) {
      return res.status(400).json({
        ok: false,
        message:
          "No se ha podido acceder al ID y los demás datos de la consulta",
        error: error,
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
      connection
        .connect()
        .then(function () {
          new mssql.Request(connection)
            .input("VE_Anio1", mssql.Int, VE_Anio)
            .input("VE_Mes1", mssql.Int, VE_Mes)
            .query(
              "SELECT VE_Ukid, VE_Anio, VE_Mes, VE_Tipo, VE_Oper, VE_Sucursal, VE_NomSucursal, " +
                "VE_CodProyecto, VE_NomProyecto, VE_UndDisponible, VE_FecVtaRet, VE_TipoPry," +
                "VE_Inmueble, VE_UndsVtas, VE_UndsRet, VE_UndsOpc, VE_VlrVtas, VE_VlrRet," +
                "VE_VlrOpc, VE_VlrPpto, VE_VlrBnos,VE_VlrDstoFinan, VE_VlrSanciones, VE_VlrSeparaciones, " +
                "VE_VlrMts, VE_QMts, VE_AN8Asesor, VE_NOMAsesor, VE_AN8Cliente," +
                "VE_NOMCliente, VE_CodCiudad, VE_NOMCiudad, VE_CodRetiro, VE_DesRetiro, VE_VlrDiasPagSepa, VE_Estrato, VE_NroHNVta, VE_NroHNTra, VE_PorcCI, VE_PorcArras, VE_PorcSeparacion, VE_MesesPlazo, VE_NomPlazo,VE_TotInmuebles,VE_TotMts,VE_Fec_Escritura,VE_Anio_Escritura,VE_Mes_Escritura,VE_Agrupacion,VE_Cedula,VE_Transmitir,VE_Vlr_RealSancion " +
                "FROM JDEVTAS.BICOMERCIAL WHERE VE_Anio = @VE_Anio1 and VE_Mes in (1,2) and VE_Transmitir = 'Y' order by VE_Mes"
                //"FROM JDEVTAS.BICOMERCIAL WHERE VE_Anio in (2018,2019,2020) and VE_Transmitir = 'Y' order by VE_Anio"
            ) //
            .then(function (data) {
              //${parseInt(VE_Mes)}
              if (data.recordsets[0].length == 0) {
                return res.status(404).json({
                  ok: true,
                  message: "No se obtuvieron resultados",
                  dataList: data.recordsets[0],
                  rowsAffected: data.rowsAffected,
                });
              } else {
                resolve(data);
              }
              connection.close();
            })
            .catch(function (error) {
              console.log(error);
              return res.status(400).json({
                ok: false,
                message: "No se ha podido realizar la consulta con la BD",
                error: error,
              });
            });
        })
        .catch(function (error) {
          console.log(error);
          return res.status(400).json({
            ok: false,
            message: "No se ha podido conectar con la BD 22",
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

app.post("/api/sqlserver/JDEVTAS/getPlano", (req, res) => {
  //var CodPry = req.headers.CodPry;
  var CodPry = req.body.CodPry;

  var password = req.headers.pwd;
  if (!password) {
    return res.status(412).json({
      ok: false,
      message: "Se debe enviar la cabecera de autenticación para la consulta",
    });
  }
  if (
    password !=
    "acee589663a018703bb1c4685f55682f3a43426530f5946f9679f97946ca5436"
  ) {
    return res.status(412).json({
      ok: false,
      message: "Cabecera de autenticación equivocada",
    });
  }
  //if (!CodPry) {
  //  return res.status(412).json({
  //    ok: false,
  //    message: 'Se debe enviar un identificador del proyecto para la consulta'
  //  });
  //}
  //try {
  //  BigInt(CodPry);
  //} catch (error) {
  //  return res.status(412).json({
  //    ok: false,
  //    message: 'Se deben enviar el año y mes en formato numérico'
  //  });
  //}

  r1();

  async function r1() {
    try {
      var info = await get();
      return res.status(200).json({
        ok: true,
        message: "Se obtuvieron correctamente los datos",
        rowsAffected: info.rowsAffected[0],
        dataList: info.recordsets[0],
      });
    } catch (error) {
      return res.status(400).json({
        ok: false,
        message:
          "No se ha podido acceder al ID y los demás datos de la consulta",
        error: error,
      });
    }
  }

  function get() {
    return new Promise(async function (resolve, reject) {
      let connection = new mssql.ConnectionPool(dbConfig);
      connection
        .connect()
        .then(function () {
          new mssql.Request(connection)
            .input("CodPry1", mssql.NChar, CodPry)
            .query(
              "SELECT CodLot, EtqEst, EtqPrc, EtqAre, EtqVlm, EtqFev, EtqVlb, EtqNcl, EtqClr FROM JDEVTAS.PLANOBI WHERE CodPry = @CodPry1"
            )
            .then(function (data) {
              if (data.recordsets[0].length == 0) {
                return res.status(404).json({
                  ok: true,
                  message: "No se obtuvieron resultados",
                  dataList: data.recordsets[0],
                  rowsAffected: data.rowsAffected,
                });
              } else {
                resolve(data);
              }
              connection.close();
            })
            .catch(function (error) {
              console.log(error);
              return res.status(400).json({
                ok: false,
                message: "No se ha podido realizar la consulta con la BD",
                error: error,
              });
            });
        })
        .catch(function (error) {
          console.log(error);
          return res.status(400).json({
            ok: false,
            message: "No se ha podido conectar con la BD 22",
          });
        });
    });
  }
});

app.get("/api/sqlserver/BICARTERA", (req, res) => {
  var password = req.headers.pwd;
  if (!password) {
    return res.status(412).json({
      ok: false,
      message: "Se debe enviar la cabecera de autenticación para la consulta",
    });
  }
  if (
    password !=
    "acee589663a018703bb1c4685f55682f3a43426530f5946f9679f97946ca5436"
  ) {
    return res.status(412).json({
      ok: false,
      message: "Cabecera de autenticación equivocada",
    });
  }

  r1();
  async function r1() {
    try {
      var info = await get();
      return res.status(200).json({
        ok: true,
        message: "Se obtuvieron correctamente los datos",
        rowsAffected: info.rowsAffected[0],
        dataList: info.recordsets[0],
      });
    } catch (error) {
      return res.status(400).json({
        ok: false,
        message:
          "No se ha podido acceder al ID y los demás datos de la consulta",
        error: error,
      });
    }
  }
  function get() {
    return new Promise(async function (resolve, reject) {
      let connection = new mssql.ConnectionPool(dbConfig);
      connection
        .connect()
        .then(function () {
          new mssql.Request(connection)
            .query(
              "SELECT CA_Anio, CA_Mes, CA_Sucursal, CA_CodProyecto, CA_NomProyecto, CA_NroDoc, " +
                "CA_TipoDoc, CA_TipoSfx, CA_AN8Cliente, CA_NOMCliente, CA_Concepto, CA_FecCompromiso, " +
                "CA_FecMod, CA_FecPago, CA_FecFactura, CA_VlrPpto, CA_VlRecaudo, CA_VlrSaldo, " +
                "CA_TipoRecaudo, CA_IDPago, CA_IDCuenta, CA_CtaOBJ, CA_CtaSUB, CA_Compania, " +
                "CA_NroRecibo, CA_NroFlujo, CA_CuentaCont, CA_CtasVencidas, CA_RangoCartera, CA_DiasVencido, CA_Critico " +
                "FROM JDEVTAS.BICARTERA WHERE CA_Transmite = 'Y'"
            )
            .then(function (data) {
              //${parseInt(VE_Mes)}
              if (data.recordsets[0].length == 0) {
                return res.status(404).json({
                  ok: true,
                  message: "No se obtuvieron resultados",
                  dataList: data.recordsets[0],
                  rowsAffected: data.rowsAffected,
                });
              } else {
                resolve(data);
              }
              connection.close();
            })
            .catch(function (error) {
              console.log(error);
              return res.status(400).json({
                ok: false,
                message: "No se ha podido realizar la consulta con la BD",
                error: error,
              });
            });
        })
        .catch(function (error) {
          console.log(error);
          return res.status(400).json({
            ok: false,
            message: "No se ha podido conectar con la BD 22",
          });
        });
    });
  }
});


app.get("/api/sqlserver/GESTION", (req, res) => {
  var password = req.headers.pwd;
  if (!password) {
    return res.status(412).json({
      ok: false,
      message: "Se debe enviar la cabecera de autenticación para la consulta",
    });
  }
  if (
    password !=
    "acee589663a018703bb1c4685f55682f3a43426530f5946f9679f97946ca5436"
  ) {
    return res.status(412).json({
      ok: false,
      message: "Cabecera de autenticación equivocada",
    });
  }

  r1();
  async function r1() {
    try {
      var info = await get();
      return res.status(200).json({
        ok: true,
        message: "Se obtuvieron correctamente los datos",
        rowsAffected: info.rowsAffected[0],
        dataList: info.recordsets[0],
      });
    } catch (error) {
      return res.status(400).json({
        ok: false,
        message:
          "No se ha podido acceder al ID y los demás datos de la consulta",
        error: error,
      });
    }
  }
  function get() {
    return new Promise(async function (resolve, reject) {
      let connection = new mssql.ConnectionPool(dbConfig);
      connection
        .connect()
        .then(function () {
          new mssql.Request(connection)
            .query(
              "SELECT GE_Filtro,GE_Linea,GE_Cliente,GE_NomCliente,GE_Estado,GE_Cantidad,GE_CodProyecto,GE_NomProyecto,GE_Sucursal,GE_NomSucursal,GE_Origen,GE_Asesor,GE_NomAsesor,GE_MesDato,GE_Anio,GE_Mes,GE_Descartados FROM JDEVTAS.GESTION WHERE GE_Transmitir = 'Y'"  
            )
            .then(function (data) {
              if (data.recordsets[0].length == 0) {
                return res.status(404).json({
                  ok: true,
                  message: "No se obtuvieron resultados",
                  dataList: data.recordsets[0],
                  rowsAffected: data.rowsAffected,
                });
              } else {
                resolve(data);
              }
              connection.close();
            })
            .catch(function (error) {
              console.log(error);
              return res.status(400).json({
                ok: false,
                message: "No se ha podido realizar la consulta con la BD",
                error: error,
              });
            });
        })
        .catch(function (error) {
          console.log(error);
          return res.status(400).json({
            ok: false,
            message: "No se ha podido conectar con la BD 22",
          });
        });
    });
  }
});


app.get("/api/sqlserver/CARTERA_RECAUDOFUTURO", (req, res) => {
  var password = req.headers.pwd;
  if (!password) {
    return res.status(412).json({
      ok: false,
      message: "Se debe enviar la cabecera de autenticación para la consulta",
    });
  }
  if (
    password !=
    "acee589663a018703bb1c4685f55682f3a43426530f5946f9679f97946ca5436"
  ) {
    return res.status(412).json({
      ok: false,
      message: "Cabecera de autenticación equivocada",
    });
  }

  r1();
  async function r1() {
    try {
      var info = await get();
      return res.status(200).json({
        ok: true,
        message: "Se obtuvieron correctamente los datos",
        rowsAffected: info.rowsAffected[0],
        dataList: info.recordsets[0],
      });
    } catch (error) {
      return res.status(400).json({
        ok: false,
        message:
          "No se ha podido acceder al ID y los demás datos de la consulta",
        error: error,
      });
    }
  }
  function get() {
    return new Promise(async function (resolve, reject) {
      let connection = new mssql.ConnectionPool(dbConfig);
      connection
        .connect()
        .then(function () {
          new mssql.Request(connection)
            .query(
              "SELECT CA_HOJA_NEGOCIACION,CA_MES,CA_ANIO,CA_COD_SUCURSAL,CA_NOM_SUCURSAL,CA_COD_PROYECTO,CA_NOM_PROYECTO,CA_VALOR_CUOTA,CA_SALDO_PENDIENTE FROM JDEVTAS.CARTERA_RECAUDO_FUTURO"  
            )
            .then(function (data) {
              if (data.recordsets[0].length == 0) {
                return res.status(404).json({
                  ok: true,
                  message: "No se obtuvieron resultados",
                  dataList: data.recordsets[0],
                  rowsAffected: data.rowsAffected,
                });
              } else {
                resolve(data);
              }
              connection.close();
            })
            .catch(function (error) {
              console.log(error);
              return res.status(400).json({
                ok: false,
                message: "No se ha podido realizar la consulta con la BD",
                error: error,
              });
            });
        })
        .catch(function (error) {
          console.log(error);
          return res.status(400).json({
            ok: false,
            message: "No se ha podido conectar con la BD 22",
          });
        });
    });
  }
});


app.listen(webServerConfig.port, () => {
  console.log(`Web server listening on remote port:${webServerConfig.port}`);
});
