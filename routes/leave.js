var express = require('express');
var router = express.Router();
var leaveModel = require('../models/leave');
var UserModel = require('../models/user');
const checkToken = require('./checkToken');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// create
/**
 * @swagger
 * /leaves/create:
 *   post:
 *     summary: Create leave request
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leave_date_start:
 *                 type: string
 *                 format: date-time
 *               leave_date_end:
 *                 type: string
 *                 format: date-time
 *               leave_reason:
 *                 type: string
 *               leave_type:
 *                 type: string
 *               leave_status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Leave request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     leave_date_start:
 *                       type: string
 *                       format: date-time
 *                     leave_date_end:
 *                       type: string
 *                       format: date-time
 *                     leave_reason:
 *                       type: string
 *                     leave_type:
 *                       type: string
 *                     leave_status:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     created_by:
 *                       type: string
 *       400:
 *         description: Not found user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "not found user"
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

router.post('/create', checkToken, async function (req, res, next) {
  try {
    const { id } = req.query;
    const { leave_date_start, leave_date_end, leave_reason, leave_type, leave_status } = req.body;
    const user = await UserModel.findById(id);
    
    if (!user) {
      return res.status(400).json({ message: "not found user" });
    }
    const leave = new leaveModel();
    leave.userId = id;
    leave.leave_date_start = leave_date_start;
    leave.leave_date_end = leave_date_end;
    leave.leave_reason = leave_reason;
    leave.leave_type = leave_type;
    leave.leave_status = leave_status;
    leave.created_at = new Date();
    leave.created_by = req.id;
    await leave.save();
    res.status(200).json({ message: leave });
} catch (err) {
    res.status(500).json({ message: err });
  }
});

// update
/**
 * @swagger
 * /leaves/update:
 *   put:
 *     summary: Update leave request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The leave request ID
 *               leave_date_start:
 *                 type: string
 *                 format: date-time
 *               leave_date_end:
 *                 type: string
 *                 format: date-time
 *               leave_reason:
 *                 type: string
 *               leave_type:
 *                 type: string
 *               leave_status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Leave request updated successfully
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
 *                     leave_date_start:
 *                       type: string
 *                       format: date-time
 *                     leave_date_end:
 *                       type: string
 *                       format: date-time
 *                     leave_reason:
 *                       type: string
 *                     leave_type:
 *                       type: string
 *                     leave_status:
 *                       type: string
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                     updated_by:
 *                       type: string
 *       400:
 *         description: Not found user or leave request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "not found user or leave request"
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
    const { id, leave_date_start, leave_date_end, leave_reason, leave_type, leave_status } = req.body;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).json({ message: "not found user" });
    }
    const leave = await leaveModel.findById(id);
    if (!leave) {
      return res.status(400).json({ message: "not found leave" });
    }
    leave.leave_date_start = leave_date_start;
    leave.leave_date_end = leave_date_end;
    leave.leave_reason = leave_reason;
    leave.leave_type = leave_type;
    leave.leave_status = leave_status;
    leave.updated_at = new Date();
    leave.updated_by = req.id;
    await leave.save();
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;