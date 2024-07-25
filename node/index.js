const express = require('express');
const app = express();
const port = 3000;
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

const mysql = require('mysql');
const connection = mysql.createConnection(config);

async function createDatabase() {
    return new Promise((resolve, reject) => {
        const sqlCreate = `CREATE TABLE IF NOT EXISTS people (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL)`;

        connection.query(sqlCreate, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function insertTable() {
    return new Promise((resolve, reject) => {
        const sqlInsert = `INSERT INTO people (name) VALUES ('Guilherme')`;

        connection.query(sqlInsert, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function selectTable() {
    return new Promise((resolve, reject) => {
        const sqlSelect = `SELECT name FROM people`;

        connection.query(sqlSelect, (error, results) => {
            if (error) {
                reject(error);
            } else {
                const names = results.map(result => result.name);
                resolve(names);
            }
        });
    });
}

app.get('/', async (req, res) => {
    try {
        await createDatabase();
        await insertTable();
        const names = await selectTable();
        const namesList = names.join('<br>');
        const response = `<h1>Full Cycle Rocks!</h1>- Lista de nomes cadastrados no banco de dados.: <br>${namesList}`;
        res.send(response);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno no servidor');
    } finally {
        connection.end();
    }
});

app.listen(port, () => {
    console.log('Servidor está ouvindo na porta ' + port);
});