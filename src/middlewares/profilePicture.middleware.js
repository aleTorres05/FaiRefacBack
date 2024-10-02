function generateDefaultProfilePicture(name) {
    return `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(name)}`;
}

function setDefaultProfilePicture(next) {
    if (!this.profilePicture) {
        if (this.firstName) {

            this.profilePicture = generateDefaultProfilePicture(this.firstName);

        } else if (this.companyName) {
           
            this.profilePicture = generateDefaultProfilePicture(this.companyName);

        }
    }
    next();
}

module.exports = setDefaultProfilePicture;
