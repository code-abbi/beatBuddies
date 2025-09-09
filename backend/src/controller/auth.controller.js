import { User } from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
	try {
		const { id, firstName, lastName, imageUrl } = req.body;

		if (!id) {
			return res.status(400).json({ error: "User ID is required" });
		}

		// check if user already exists
		const existingUser = await User.findOne({ clerkId: id });

		if (!existingUser) {
			// signup
			const newUser = await User.create({
				clerkId: id,
				fullName: `${firstName || ""} ${lastName || ""}`.trim(),
				imageUrl,
			});
		}

		res.status(200).json({ success: true });
	} catch (error) {
		console.error("Error in auth callback", error);
		next(error);
	}
};

// Manual user creation endpoint for testing
export const createUserManually = async (req, res, next) => {
	try {
		const { id, firstName, lastName, imageUrl } = req.body;

		if (!id) {
			return res.status(400).json({ error: "User ID is required" });
		}

		// check if user already exists
		const existingUser = await User.findOne({ clerkId: id });

		if (!existingUser) {
			// signup
			const newUser = await User.create({
				clerkId: id,
				fullName: `${firstName || ""} ${lastName || ""}`.trim(),
				imageUrl,
			});
			res.status(201).json({ success: true, user: newUser });
		} else {
			res.status(200).json({ success: true, user: existingUser, message: "User already exists" });
		}

	} catch (error) {
		console.error("Error in manual user creation", error);
		next(error);
	}
};
