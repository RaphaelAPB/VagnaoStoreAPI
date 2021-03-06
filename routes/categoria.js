const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool

router.get('/todas', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'select categoria.* from categoria;',
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                res.status(200).json({ message: 'Categoria recuperada com sucesso', data: resultado })
            }
        )
    })
})

router.get('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'select categoria.* from categoria where (select count(produto.id) from produto where produto.idCategoria = categoria.id) > 0;',
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                res.status(200).json({ message: 'Categoria recuperada com sucesso', data: resultado })
            }
        )
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query(
            'SELECT * FROM categoria WHERE id = ?;',
            [id],
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                res.status(200).json({ message: 'Categoria recuperada com sucesso', data: resultado })
            }
        )
    })
})

router.post('/', (req, res) => {

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'INSERT INTO categoria (nome, descricao) values (?,?)',
            [req.body.nome, req.body.descricao],
            (error, resultado, field) => {
                conn.release();

                if (error) {
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.status(201).send({
                    mensagem: "Categoria inserida " + resultado.insertId,
                })
            }
        )
    })


})

router.put('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            `UPDATE categoria
            SET  nome = ?,
            descricao = ?
            WHERE id = ?`,
            [req.body.nome, req.body.descricao, req.params.id],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                res.status(202).send({
                    mensagem: "Categoria alterada com sucesso ",
                })
            }
        )
    })
})

router.delete('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            `DELETE FROM categoria WHERE id = ?`,
            [req.params.id],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                res.status(202).send({
                    mensagem: "Categoria removida com sucesso",
                })
            }
        )
    })
})

module.exports = router;