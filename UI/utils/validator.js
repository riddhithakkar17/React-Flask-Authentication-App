// Validate Register Input
module.exports.validateRegisterInput = (
    username,
    password,
    confirmPassword,
    email
) => {
    const errors = {}
    if (username.trim() === '')
        errors.username = "Username should not be empty"
    if (password !== confirmPassword) {
        errors.password = "Password does not match"
    } else {
        if (password === "") {
            errors.password = "Password is empty"
        }
    }

    if (email.trim() === '')
        errors.email = "Email should not be empty"
    else {
        const regEx = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"
        if (!email.match(regEx)) {
            errors.email = "Enter a valid email"
        }
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

// Validate Login Input
module.exports.validateLoginInput = (
    username,
    password
) => {

    const errors = {}

    if (username.trim() === '')
        errors.username = "Username should not be empty"

    if (password.trim() === "")
        errors.password = "Password is empty"

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }


}