var express = require('express');
var router = express.Router();
const checkToken = require('./checkToken');
const DepartmentModel = require('../models/department');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// create
/**
 * @swagger
 * /departments/create:
 *   post:
 *     summary: tạo về department
 *     responses:
 *       200:
 *         description: tạo về department
 */
router.post('/create', checkToken, async function (req, res, next) {
  try {
    const { name, address } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const department = new DepartmentModel();
    department.name = name;
    department.address = address;
    department.created_by = req.id;
    await department.save();
    res.status(200).json({ message: department });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// get all
/**
 * @swagger
 * /departments/all:
 *   get:
 *     summary: get all departments
 *     responses:
 *       200:
 *         description: get all departments
 */
router.get('/all', checkToken, async function (req, res, next) {
  try {
    const departments = await DepartmentModel.find();
    res.status(200).json({ message: departments });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// update by id
/**
 * @swagger
 * /departments/update:
 *   put:
 *     summary: Update department
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The department ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Department updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     address:
 *                       type: string
 *                     updated_by:
 *                       type: string
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Not found department
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "not found department"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.put('/update', checkToken, async function (req, res, next) {
  try {
    const { id } = req.query;
    const {  name, address } = req.body;
    const department = await DepartmentModel.findById(id);
    if (!department) {
      return res.status(400).json({ message: "not found department" });
    }
    department.name = name;
    department.address = address;
    department.updated_by = req.id;
    department.updated_at = new Date();
    await department.save();
    res.status(200).json({ message: department });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// get by id
/**
 * @swagger
 * /departments/get:
 *   get:
 *     summary: get department by id
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The department ID
 *     responses:
 *       200:
 *         description: get department by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     address:
 *                       type: string
 *                     created_by:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Not found department
 *         content:
 *           application/json:
 *             schema:
 * 
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "not found department"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *    
 *     
 */
router.get('/get', checkToken, async function (req, res, next) {
  try {
    const { id } = req.query;
    const department = await DepartmentModel.findById(id);
    res.status(200).json({ message: department });
  } catch (err) {
    res.status(500).json({ message: err });
  }
}); 




module.exports = router;