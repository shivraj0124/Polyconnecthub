const DPTModel = require("../model/department");

const getAllDpt = async (req, res) => {
    const { page, rows, college } = req.body;
    const currentPage = page + 1;
    const offset = Math.ceil((currentPage - 1) * rows);
    const Dept = await DPTModel.find({ college: college }).sort({ time: -1 }).populate("college").skip(offset).limit(rows)
    const totalDepartments = await DPTModel.countDocuments()
    return res.status(200).json({
        data: {
            status: true,
            data: Dept, totalDepartments
        }
    })
}

const getAllDptAddHod = async (req, res) => {
    const { college } = req.body
    const Dept = await DPTModel.find({ college: college }).populate("college")
    const totalDepartments = await DPTModel.countDocuments({ college: college })
    return res.status(200).json({
        data: {
            status: true,
            data: Dept, totalDepartments
        }
    })
}

const getOneDpt = async (req, res) => {
    const { dpt } = req.body;
    const data = await DPTModel.findOne({ _id: dpt });
    return res.status(200).json({
        data: {
            status: true,
            data: data
        }
    })
}


module.exports = { getAllDpt, getOneDpt, getAllDptAddHod }