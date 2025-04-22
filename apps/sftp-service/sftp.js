const { Client } = require("ssh2");

function listDirectory({ host, port, username, password, privateKey }, path = ".") {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on("ready", () => {
        conn.sftp((err, sftp) => {
          if (err) {
            conn.end();
            return reject(err);
          }

          sftp.readdir(path, (err, list) => {
            conn.end();
            if (err) return reject(err);
            resolve(
              list.map((item) => ({
                filename: item.filename,
                longname: item.longname,
                attrs: item.attrs,
              }))
            );
          });
        });
      })
      .on("error", reject)
      .connect({ host, port: Number(port), username, password, privateKey });
  });
}

function streamFile({ host, port, username, password, privateKey }, filePath, res) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn
      .on("ready", () => {
        conn.sftp((err, sftp) => {
          if (err) {
            conn.end();
            return reject(err);
          }

          const stream = sftp.createReadStream(filePath);
          stream.pipe(res);
          stream.on("end", () => {
            conn.end();
            resolve();
          });
          stream.on("error", (err) => {
            conn.end();
            reject(err);
          });
        });
      })
      .on("error", reject)
      .connect({ host, port: Number(port), username, password, privateKey });
  });
}

function uploadFile({ host, port, username, password, privateKey }, remotePath, buffer) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on("ready", () => {
        conn.sftp((err, sftp) => {
          if (err) {
            conn.end();
            return reject(err);
          }

          const writeStream = sftp.createWriteStream(remotePath);
          writeStream.write(buffer);
          writeStream.end();
          writeStream.on("close", () => {
            conn.end();
            resolve();
          });
          writeStream.on("error", (err) => {
            conn.end();
            reject(err);
          });
        });
      })
      .on("error", reject)
      .connect({ host, port: Number(port), username, password, privateKey });
  });
}

module.exports = {
  listDirectory,
  streamFile,
  uploadFile,
};
