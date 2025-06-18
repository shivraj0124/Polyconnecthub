const ProjectModel = require("../model/projects");
const AuthModel = require("../model/Auth");
const cloudinary = require("../utils/imageuploadUtils");

const getAllprojects = async (req, res) => {
    try {
        const Hods = await ProjectModel.find({ isActive: "true" }).sort({ time: -1 });

        return res.status(200).json({
            data: {
                status: true,
                data: Hods,
            },
        });
    } catch (err) {
        return res.status(400).json({
            data: {
                status: false,
                msg: "no data found",
            },
        });
    }
};

const getAllProjectsByCollege = async (req, res) => {
    try {
        const { college_id } = req.body;
        console.log(college_id);
        const projects = await ProjectModel.find({
            allocated_college: college_id,
            isActive: true,
        }).populate("allocated_college")
            .populate("allocated_department")
            .populate("created_By");

        return res.status(200).json({
            data: {
                status: true,
                data: projects,
            },
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            data: {
                status: false,
                msg: err,
            },
        });
    }
}
const getOneproject = async (req, res) => {

    try {
        const { project_id } = req.body;
        console.log(project_id);
        const projects = await ProjectModel.find({
            _id: project_id
        }).populate("allocated_college")
            .populate("allocated_department")
            .populate("created_By").populate("contributers");

        return res.status(200).json({
            data: {
                status: true,
                data: projects,
            },
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            data: {
                status: false,
                msg: err,
            },
        });
    }
};

const filterproject = async (req, res) => {
    const { time, type } = req.body;
    let projects;

    try {
        if (type === "all") {
            if (time === "oldest") {
                projects = await ProjectModel.find().sort({ time: 1 });
            } else {
                projects = await ProjectModel.find().sort({ time: -1 });
            }
        } else {
            if (time === "oldest") {
                projects = await ProjectModel.find({ type: type }).sort({ time: 1 });
            } else {
                projects = await ProjectModel.find({ type: type }).sort({ time: -1 });
            }
        }

        return res.status(200).json({ success: true, data: projects });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

const search = async (req, res) => {
    const { title } = req.body;
    console.log(title);
    try {
        const projects = await ProjectModel.find({ title: { $regex: ".*" + title + ".*", $options: "i" } });
        if (projects) {
            return res.status(200).json({
                data: { projects }
            });
        }
        return res.status(404).json({ success: false, data: "not found" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

const searchStudentsProj = async (req, res) => {
    const { title } = req.body;
    try {
        const projects = await ProjectModel.find({ userType: "Student", title: { $regex: ".*" + title + ".*", $options: "i" } });
        if (projects) {
            return res.status(200).json({
                data: { projects }
            });
        }
        return res.status(404).json({ success: false, data: "not found" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
const addProjectByStudent = async (req, res) => {
    try {
        const { title, description, multimedia, contributors, liveDemo, type, allocated_college, allocated_department, created_By,codeLink } = req.body
        console.log(title, description, multimedia, contributors, liveDemo, type, allocated_college, allocated_department, created_By,)
        const existProject = await ProjectModel.findOne({
            title: title,
            allocated_college: allocated_college,
        });
        if (existProject) {
            return res.status(200).json({
                data: {
                    status: false,
                    err: "Project with same name exist in your collage.",
                },
            });
        }
        const imageUrl = await cloudinary.uploader.upload(multimedia);
        console.log("imageUrl", imageUrl);
        const project = new ProjectModel({
            title: title,
            description: description,
            multimedia: imageUrl.secure_url,
            contributers: contributors,
            live_demo: liveDemo,
            codeLink:codeLink,
            allocated_college: allocated_college,
            allocated_department: allocated_department,
            type: type,
            created_By: created_By,
            userType: "Student",
        });

        await project.save();

        return res.status(200).json({
            data: {
                status: true,
                msg: "Project added Sucessfully....",
            },
        });


    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ success: false, message: "Internal server error" });
    }
}

const contributorData = async (req, res) => {
    try {
        const key = req.params.key;
       

        const users = await AuthModel.find({
            username: { $regex: key, $options: 'i' } ,
            userType: "student"
        });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        console.log(users);
        return res.status(200).json({ users });
    } catch (error) {
        console.error('Error searching users:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
module.exports = { getAllprojects,contributorData, getOneproject, filterproject, search, addProjectByStudent, getAllProjectsByCollege, searchStudentsProj }
