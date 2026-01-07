const {userAuth} =require("../middlewares/auth");
const {validateEditProfileData}=require("../utils/validation");
const {uploadSingle, uploadsDir} = require("../middlewares/upload");
const path = require('path');
const fs = require('fs');

const express = require('express'); 
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    // Calculate profile completion
    const isComplete = user.isProfileComplete();
    const completionPercentage = user.getProfileCompletion();

    // Send profile data as JSON with completion info
    res.status(200).json({
      ...user.toObject(),
      isProfileComplete: isComplete,
      profileCompletion: completionPercentage,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get profile completion status
profileRouter.get("/profile/completion", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const isComplete = user.isProfileComplete();
    const completionPercentage = user.getProfileCompletion();

    res.status(200).json({
      isProfileComplete: isComplete,
      profileCompletion: completionPercentage,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper function to save base64 image to file
const saveBase64Image = (base64String, userId) => {
  try {
    // Check if it's a data URL
    if (!base64String || !base64String.startsWith('data:image')) {
      return null;
    }

    // Extract base64 data and extension
    const matches = base64String.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!matches) {
      return null;
    }

    const ext = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${userId}-${uniqueSuffix}.${ext}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file
    fs.writeFileSync(filepath, buffer);

    // Return the URL path
    return `/uploads/profiles/${filename}`;
  } catch (error) {
    console.error('Error saving base64 image:', error);
    return null;
  }
};

// Profile edit route - handles both file upload and JSON data
profileRouter.patch("/profile/edit", userAuth, uploadSingle, async (req, res) => {
    try{
      const loggedInUser = req.user;
      const updates = { ...req.body };

      // Handle file upload (if file was uploaded via multer)
      if (req.file) {
        // If a file was uploaded, use its path
        const photoUrl = `/uploads/profiles/${req.file.filename}`;
        updates.photourl = photoUrl;
        
        // Delete old profile photo if it exists and is from uploads directory
        if (loggedInUser.photourl && loggedInUser.photourl.startsWith('/uploads/profiles/')) {
          const oldFilePath = path.join(__dirname, '../..', loggedInUser.photourl);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      } else if (updates.photourl && updates.photourl.startsWith('data:image')) {
        // Handle base64 image (from frontend)
        const photoUrl = saveBase64Image(updates.photourl, loggedInUser._id.toString());
        
        if (photoUrl) {
          // Delete old profile photo if it exists
          if (loggedInUser.photourl && loggedInUser.photourl.startsWith('/uploads/profiles/')) {
            const oldFilePath = path.join(__dirname, '../..', loggedInUser.photourl);
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
          }
          updates.photourl = photoUrl;
        } else {
          // If base64 conversion failed, keep existing photo
          delete updates.photourl;
        }
      } else if (updates.photourl && !updates.photourl.startsWith('/uploads/profiles/') && !updates.photourl.startsWith('http')) {
        // If it's a relative path or invalid, keep existing
        delete updates.photourl;
      }

      // Validate other fields using the validation utility
      // Create a validation object with body containing the updates
      const validationReq = { body: updates };
      if (!validateEditProfileData(validationReq)) {
        throw new Error("Invalid edit request - only photourl, about, gender, age, skills, college, course, branch, city, state, and interestedToConnectWith are allowed");
      }

      // Update user fields
      Object.keys(updates).forEach((key) => {
        // Skip photourl if it wasn't properly processed
        if (key === 'photourl' && !updates.photourl) {
          return;
        }
        
        if (key === 'age') {
          // Handle age - convert to number or set to undefined if empty
          if (updates[key] === '' || updates[key] === null || updates[key] === undefined) {
            loggedInUser[key] = undefined;
          } else {
            loggedInUser[key] = Number(updates[key]);
          }
        } else if (key === 'skills') {
          // Handle skills array
          if (Array.isArray(updates[key])) {
            loggedInUser[key] = updates[key];
          }
        } else if (key === 'college' || key === 'course' || key === 'branch' || key === 'city' || key === 'state') {
          // Handle education and location fields - allow empty strings to clear the field
          if (updates[key] === '' || updates[key] === null || updates[key] === undefined) {
            loggedInUser[key] = undefined; // Clear the field in database
          } else {
            loggedInUser[key] = String(updates[key]).trim(); // Save trimmed value
          }
        } else if (key === 'about' || key === 'gender') {
          // Handle about and gender - allow empty strings
          if (updates[key] === '' || updates[key] === null || updates[key] === undefined) {
            loggedInUser[key] = key === 'about' ? loggedInUser[key] : undefined; // Keep about default, clear gender
          } else {
            loggedInUser[key] = String(updates[key]).trim();
          }
        } else if (key === 'interestedToConnectWith') {
          // Handle interested to connect with field - allow empty to clear
          if (updates[key] === '' || updates[key] === null || updates[key] === undefined) {
            loggedInUser[key] = undefined; // Clear the field
          } else {
            // Validate enum value
            const validValues = ['male', 'female', 'both'];
            if (validValues.includes(updates[key].toLowerCase())) {
              loggedInUser[key] = updates[key].toLowerCase();
            }
          }
        } else if (updates[key] !== undefined && updates[key] !== '') {
          loggedInUser[key] = updates[key];
        }
      });
      
      await loggedInUser.save();
      
      // Calculate profile completion
      const isComplete = loggedInUser.isProfileComplete();
      const completionPercentage = loggedInUser.getProfileCompletion();
      
      res.json({
        message: `${loggedInUser.firstName}, Profile updated successfully`,
        user: {
          ...loggedInUser.toObject(),
          isProfileComplete: isComplete,
          profileCompletion: completionPercentage,
        }
      });

    } catch(err) {
        console.error('Profile update error:', err);
        res.status(400).json({ error: err.message });
    }
});


module.exports = profileRouter;
