var express = require("express");
var router = express.Router();
var timekeepingModel = require("../models/timekeeping");
var UserModel = require("../models/user");
const checkToken = require("./checkToken");



/**
 * @swagger
 * /timekeepings/create:
 *   get:
 *     summary: Create a new timekeeping record
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Timekeeping record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     checked_time:
 *                       type: string
 *                       format: date-time
 *                     __v:
 *                       type: integer
 *       500:
 *         description: Internal server error
 *         content:
 *           
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.get("/create",checkToken, async function (req, res, next) {
  try {
    console.log(req.Id)

    const timekeeping = new timekeepingModel();
    timekeeping.userId = req.Id;
    
    timekeeping.checked_time = new Date();
    const result = await timekeeping.save();
    res.status(200).json({result: true, message: result });
  } catch (err) {
    res.status(500).json({result: false, message: err });
  }
});

/**
 * @swagger
 * /timekeepings/timekeeping-in-month:
 *   get:
 *     summary: Get timekeeping records for a user within a specific month
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *       - in: body
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-08"
 *         description: The month to get timekeeping records for (in YYYY-MM format)
 *     responses:
 *       200:
 *         description: Timekeeping records retrieved successfully
 *         content:
 *          
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       checked_time:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: ID and month are required or not found user
 *         content:
 *           
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID and month are required"
 *       500:
 *         description: Internal server error
 *         content:
 *          
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */


router.get("/timekeeping-in-month",checkToken, async function (req, res, next) {
  try {
    const { id } = req.query;
    const { month } = req.body;
    if (!id || !month) {
      return res.status(400).json({ message: "ID and month are required" });
    }
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).json({ message: "not found user" });
    }

    // Xác định ngày đầu tiên của tháng
    const firstDayOfMonth = new Date(month);
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    // Xác định ngày cuối cùng của tháng
    const lastDayOfMonth = new Date(month);
    lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
    lastDayOfMonth.setDate(0);
    lastDayOfMonth.setHours(23, 59, 59, 999);
    console.log(firstDayOfMonth, lastDayOfMonth);
    const timekeepings = await timekeepingModel.find({
      userId: user._id,
      checked_time: {
        $gte: firstDayOfMonth,
        $lte: lastDayOfMonth,
      },
    });
    res.status(200).json({ message: timekeepings });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
