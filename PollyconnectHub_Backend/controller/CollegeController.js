const CollegeModel = require("../model/College");
const HodModel = require("../model/hod");
const projectModel = require("../model/projects");
const authModel = require("../model/Auth");
const Subscribers=require("../model/Subscribe")
const getAllColleges = async (req, res) => {
    const Hods = await CollegeModel.find();
    const totalColleges = await CollegeModel.countDocuments();
    return res.status(200).json({
        data: {
            status: true,
            data: Hods,
            totalColleges: totalColleges
        }
    })
}


const getAllColleges2 = async (req, res) => {
  const { studentId } = req.params;

  try {
    const colleges = await CollegeModel.find();
    const totalColleges = await CollegeModel.countDocuments();

    const subscribedDocs = await Subscribers.find({ 'subscribers.studentId': studentId });

    const subscribedCollegeIds = new Set(subscribedDocs.map(doc => doc.collegeId.toString()));

    const collegesWithSubscription = colleges.map(college => ({
      ...college.toObject(),
      isSubscribed: subscribedCollegeIds.has(college._id.toString())
    }));

    return res.status(200).json({
      data: {
        status: true,
        data: collegesWithSubscription,
        totalColleges: totalColleges
      }
    });

  } catch (error) {
    return res.status(500).json({
      data: {
        status: false,
        message: "Failed to fetch colleges",
        error: error.message
      }
    });
  }
};


const getOneCollege = async (req, res) => {
    try {
        const { college } = req.body;
        const data = await CollegeModel.findOne({ _id: college });
        if (!data) {
            return res.status(200).json({
                status: false,
                msg: "College not found"
            });
        }

        return res.status(200).json({
            status: true,
            data: data
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            msg: "Internal server error",
            error: err.message
        });
    }
};

// const addCollege = async(req,res)=>{
//     const {name,about,address,poc,departments} = req.body
//     const data = await CollegeModel.find({ name: name });
//     console.log("data",data);
//     if(data.length){
//         return res.status(200).json({
//             data: {
//                 status: false,
//                 msg:'College Already Exists'
//             }
//         })
//     }
//     const college = new CollegeModel({
//        name:name,
//        about:about,
//        address:address,
//        poc:poc,
//        departments:departments

//     })
//     await college.save()
//     return res.status(200).json({
//         data: {
//             status: true,
//             msg: 'College Created Successfully'
//         }
//     })

// }

const search = async (req, res) => {
    const { title } = req.body;
    console.log(title);
    try {
        const college = await CollegeModel.find({ name: { $regex: ".*" + title + ".*", $options: "i" } });
        if (college) {
            return res.status(200).json({
                data: { college }
            });
        }
        return res.status(404).json({ success: falsee, data: "not found" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
const search2 = async (req, res) => {
    const { title, studentId } = req.body;
    console.log(title, studentId);
    try {
      const colleges = await CollegeModel.find({
        name: { $regex: ".*" + title + ".*", $options: "i" }
      });
  
      const subscribedDocs = await Subscribers.find({ 'subscribers.studentId': studentId });
  
      const subscribedCollegeIds = new Set(subscribedDocs.map(doc => doc.collegeId.toString()));
  
      const collegesWithSubscription = colleges.map(college => ({
        ...college.toObject(),
        isSubscribed: subscribedCollegeIds.has(college._id.toString())
      }));
      console.log(collegesWithSubscription);
  
      return res.status(200).json({
        data: { college: collegesWithSubscription }
      });
  
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

const getcount = async (req, res) => {
    try {
        const { college_id } = req.body;
        const totalCountHod = await HodModel.countDocuments({ allocated_college: college_id });
        const totalcountProject = await projectModel.countDocuments({ allocated_college: college_id });
        const totalCountStudent = await authModel.countDocuments({ allocated_college: college_id })
        res.send({ totalcountProject, totalCountStudent, totalCountHod });
    } catch (err) {
        console.log(err);
        return res.status(200).json({
            err: err
        })
    }

}

// POST /api/subscribe
const subscribeToCollege = async (req, res) => {
    const { studentId, collegeId } = req.body;
  
    try {
      let subscriberDoc = await Subscribers.findOne({ collegeId });
  
      if (!subscriberDoc) {
        // Create new if college entry doesn't exist
        subscriberDoc = new Subscribers({
          collegeId,
          subscribers: [{ studentId, subscribedDate: new Date() }]
        });
      } else {
        // Check if already subscribed
        const alreadySubscribed = subscriberDoc.subscribers.some(
          (s) => s.studentId.toString() === studentId
        );
  
        if (alreadySubscribed) {
          return res.send({ message: "Already subscribed to this college." });
        }
  
        // Add to subscribers array
        subscriberDoc.subscribers.push({ studentId, subscribedDate: new Date() });
      }
  
      await subscriberDoc.save();
      res.send({ message: "Successfully subscribed!" });
  
    } catch (err) {
      console.error(err);
      res.send({ message: "Subscription failed", error: err.message });
    }
  };

// POST /api/unsubscribe
const unsubscribeFromCollege = async (req, res) => {
    const { studentId, collegeId } = req.body;
  
    try {
      const subscriberDoc = await Subscribers.findOne({ collegeId });
  
      if (!subscriberDoc) {
        return res.send({ message: "No subscribers found for this college." });
      }
  
      const beforeCount = subscriberDoc.subscribers.length;
  
      subscriberDoc.subscribers = subscriberDoc.subscribers.filter(
        (s) => s.studentId.toString() !== studentId
      );
  
      const afterCount = subscriberDoc.subscribers.length;
  
      if (beforeCount === afterCount) {
        return res.send({ message: "You are not subscribed to this college." });
      }
  
      await subscriberDoc.save();
      res.send({ message: "Successfully unsubscribed!" });
  
    } catch (err) {
      console.error(err);
      res.send({ message: "Unsubscription failed", error: err.message });
    }
  };
  
module.exports = { getAllColleges, getOneCollege, search, getcount,subscribeToCollege,unsubscribeFromCollege,getAllColleges2,search2 }