
module.exports = {
  authentication: {
    type: 'default',
    options: {
      userName: "usr_admin",
      password: "M4rv4lBI",
    },
  },
  options: {
    database: 'DBA_BI',
    encrypted: false,
    encrypt: false,
    enableArithAbort: true
  },
  //server: "172.11.1.41",
  server: "190.242.129.183",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 100000,
  },
};
