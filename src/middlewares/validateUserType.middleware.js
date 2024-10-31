function validateUserType(userType) {
    return (req, res, next) => {
        if (!req.user || !req.user[userType] || !req.user[userType]._id) {
            return res.status(400).json({
                success: false,
                error: `Unauthorized: ${userType} information is missing or incomplete.`,
            });
        }
        next();
    };
}

module.exports = validateUserType;