import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

export const getAllUsers = async (req, res, next) => {
	try {
		// Fetch all users
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		console.error("Error in getAllUsers:", error);
		next(error);
	}
};

export const getMessages = async (req, res, next) => {
	try {
		const myId = req.auth.userId;
		const { userId } = req.params;

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		console.error("Error in getMessages:", error);
		next(error);
	}
};

// Update user endpoint
export const updateUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { fullName, imageUrl } = req.body;
		
		const user = await User.findByIdAndUpdate(
			id, 
			{ fullName, imageUrl }, 
			{ new: true }
		);
		
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		
		res.status(200).json({ success: true, user });
	} catch (error) {
		console.error("Error updating user:", error);
		next(error);
	}
};

// Delete user endpoint
export const deleteUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		
		const user = await User.findByIdAndDelete(id);
		
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		
		res.status(200).json({ success: true, message: "User deleted successfully" });
	} catch (error) {
		console.error("Error deleting user:", error);
		next(error);
	}
};

// Debug endpoint to check database state
export const debugUsers = async (req, res, next) => {
	try {
		const allUsers = await User.find();
		
		res.status(200).json({
			totalUsers: allUsers.length,
			users: allUsers
		});
	} catch (error) {
		console.error("Error in debugUsers:", error);
		next(error);
	}
};